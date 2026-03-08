import { generateText, Output } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { generateSlug } from '@/lib/deal-types'

export const maxDuration = 60

// Create OpenAI provider
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Schema for discovered deals
const DiscoveredDealSchema = z.object({
  title: z.string().describe('Product title - clear and specific'),
  description: z.string().describe('Brief product description'),
  store: z.string().describe('Retailer name (Amazon, Best Buy, Nike, Target, etc.)'),
  category: z.enum(['Electronics', 'Fashion', 'Home & Kitchen']).describe('Product category'),
  original_price: z.number().describe('Original price before discount'),
  deal_price: z.number().describe('Current discounted price'),
  discount_percentage: z.number().describe('Discount percentage (0-100)'),
  coupon_code: z.string().nullable().describe('Coupon code if available, null otherwise'),
  affiliate_link: z.string().url().describe('Direct product URL'),
  image_url: z.string().nullable().describe('Product image URL if available'),
  expires_at: z.string().describe('Deal expiration date in ISO format'),
  ai_description: z.string().describe('SEO-optimized description for the deal page'),
})

const DealsResponseSchema = z.object({
  deals: z.array(DiscoveredDealSchema).describe('Array of discovered deals'),
  source: z.string().describe('Where these deals were discovered'),
})

// Validate URL is from a known retailer
function isValidRetailerUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    const hostname = parsed.hostname.toLowerCase()
    
    const validDomains = [
      'amazon.com', 'www.amazon.com',
      'bestbuy.com', 'www.bestbuy.com',
      'nike.com', 'www.nike.com',
      'target.com', 'www.target.com',
      'apple.com', 'www.apple.com',
      'dyson.com', 'www.dyson.com',
      'adidas.com', 'www.adidas.com',
      'walmart.com', 'www.walmart.com',
      'costco.com', 'www.costco.com',
      'homedepot.com', 'www.homedepot.com',
      'lowes.com', 'www.lowes.com',
      'macys.com', 'www.macys.com',
      'nordstrom.com', 'www.nordstrom.com',
      'kohls.com', 'www.kohls.com',
    ]
    
    return validDomains.some(domain => 
      hostname === domain || hostname.endsWith('.' + domain)
    )
  } catch {
    return false
  }
}

// Validate URL with HEAD request - returns true if URL returns 200 or 302
async function validateUrlWithHead(url: string): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
    
    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SaveSmartBot/1.0)',
      },
      redirect: 'follow',
    })
    
    clearTimeout(timeoutId)
    
    // Accept 200 OK and 302 redirects
    return response.status === 200 || response.status === 302 || response.status === 301
  } catch {
    // If HEAD fails, try a GET request (some servers don't support HEAD)
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SaveSmartBot/1.0)',
        },
        redirect: 'follow',
      })
      
      clearTimeout(timeoutId)
      return response.status === 200 || response.status === 302 || response.status === 301
    } catch {
      return false
    }
  }
}

export async function POST(req: Request) {
  // Verify API key
  const authHeader = req.headers.get('authorization')
  const expectedKey = process.env.DEAL_DISCOVERY_API_KEY
  
  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
  }

  try {
    const body = await req.json()
    const { category, store, query } = body

    // Build the prompt based on parameters
    let prompt = `Find 5-10 current, verified deals and discounts`
    if (category) prompt += ` in the ${category} category`
    if (store) prompt += ` from ${store}`
    if (query) prompt += ` matching "${query}"`
    
    prompt += `. 

Requirements:
- Only include deals that are currently active (not expired)
- Include real product URLs from major retailers
- Calculate accurate discount percentages
- Set expiration dates within the next 7-30 days
- Write SEO-optimized descriptions for each deal
- Ensure all prices are in USD

Focus on popular products with significant discounts (20%+ off).`

    const result = await generateText({
      model: openai('gpt-4o-mini'),
      prompt,
      output: Output.object({ schema: DealsResponseSchema }),
    })

    const discoveredDeals = result.output

    if (!discoveredDeals || !discoveredDeals.deals.length) {
      return NextResponse.json({ 
        message: 'No deals discovered',
        deals: [],
        inserted: 0 
      })
    }

    // Validate and filter deals (basic checks first)
    const basicValidDeals = discoveredDeals.deals.filter(deal => {
      // Check URL validity
      if (!isValidRetailerUrl(deal.affiliate_link)) return false
      // Check price sanity
      if (deal.deal_price >= deal.original_price) return false
      if (deal.discount_percentage < 5 || deal.discount_percentage > 95) return false
      return true
    })

    // Validate URLs with HEAD requests (in parallel, max 5 at a time)
    const validDeals: typeof basicValidDeals = []
    for (let i = 0; i < basicValidDeals.length; i += 5) {
      const batch = basicValidDeals.slice(i, i + 5)
      const results = await Promise.all(
        batch.map(async (deal) => {
          const isValid = await validateUrlWithHead(deal.affiliate_link)
          return isValid ? deal : null
        })
      )
      validDeals.push(...results.filter((d): d is NonNullable<typeof d> => d !== null))
    }

    // Insert deals into database
    const supabase = await createClient()
    const insertedDeals = []

    for (const deal of validDeals) {
      const slug = generateSlug(deal.title)
      
      // Check if deal with similar title already exists
      const { data: existing } = await supabase
        .from('deals')
        .select('id')
        .ilike('title', deal.title)
        .single()

      if (existing) continue // Skip duplicates

      // Try to insert with new columns first, fall back to basic insert if columns don't exist
      let insertData: Record<string, unknown> = {
        title: deal.title,
        description: deal.description,
        store: deal.store,
        category: deal.category,
        original_price: deal.original_price,
        deal_price: deal.deal_price,
        discount_percentage: Math.round(deal.discount_percentage),
        coupon_code: deal.coupon_code,
        affiliate_link: deal.affiliate_link,
        image_url: deal.image_url,
        expires_at: deal.expires_at,
        is_active: true,
      }

      // Try adding new columns (slug, source, ai_description)
      // These may not exist if migration hasn't run
      try {
        insertData = {
          ...insertData,
          slug,
          source: 'ai-discovery',
          ai_description: deal.ai_description,
        }
      } catch {
        // Columns don't exist, continue with basic insert
        console.warn(
          'Database migration needed: slug, source, and ai_description columns are missing. ' +
          'Run the following SQL in Supabase SQL Editor:\n' +
          'ALTER TABLE deals ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;\n' +
          'ALTER TABLE deals ADD COLUMN IF NOT EXISTS source TEXT DEFAULT \'manual\';\n' +
          'ALTER TABLE deals ADD COLUMN IF NOT EXISTS ai_description TEXT;\n' +
          'CREATE INDEX IF NOT EXISTS idx_deals_slug ON deals(slug);'
        )
      }

      const { data, error } = await supabase
        .from('deals')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        // Check if error is due to missing columns
        if (error.message?.includes('column') && (
          error.message.includes('slug') || 
          error.message.includes('source') || 
          error.message.includes('ai_description')
        )) {
          console.warn(
            'Database migration required! The following columns are missing from the deals table:\n' +
            '- slug (TEXT UNIQUE)\n' +
            '- source (TEXT)\n' +
            '- ai_description (TEXT)\n\n' +
            'Please run this SQL in your Supabase SQL Editor:\n' +
            'ALTER TABLE deals ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;\n' +
            'ALTER TABLE deals ADD COLUMN IF NOT EXISTS source TEXT DEFAULT \'manual\';\n' +
            'ALTER TABLE deals ADD COLUMN IF NOT EXISTS ai_description TEXT;\n' +
            'CREATE INDEX IF NOT EXISTS idx_deals_slug ON deals(slug);'
          )
          
          // Retry with basic insert (without new columns)
          const { data: basicData, error: basicError } = await supabase
            .from('deals')
            .insert({
              title: deal.title,
              description: deal.description,
              store: deal.store,
              category: deal.category,
              original_price: deal.original_price,
              deal_price: deal.deal_price,
              discount_percentage: Math.round(deal.discount_percentage),
              coupon_code: deal.coupon_code,
              affiliate_link: deal.affiliate_link,
              image_url: deal.image_url,
              expires_at: deal.expires_at,
              is_active: true,
            })
            .select()
            .single()

          if (!basicError && basicData) {
            insertedDeals.push(basicData)
          }
        }
      } else if (data) {
        insertedDeals.push(data)
      }
    }

    return NextResponse.json({
      message: `Discovered ${validDeals.length} deals, inserted ${insertedDeals.length} new deals`,
      deals: insertedDeals,
      inserted: insertedDeals.length,
      source: discoveredDeals.source,
    })
  } catch (error) {
    console.error('Deal discovery error:', error)
    return NextResponse.json(
      { error: 'Failed to discover deals' },
      { status: 500 }
    )
  }
}
