import {
  convertToModelMessages,
  streamText,
  tool,
  stepCountIs,
} from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const maxDuration = 30

// Create OpenAI provider with API key from environment variable
// This bypasses Vercel AI Gateway and uses OpenAI directly
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Sanitize user input to prevent injection
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 500)
}

// Validate that a URL is a proper product link (not a placeholder or invalid URL)
function isValidProductUrl(url: string | null | undefined): boolean {
  if (!url) return false
  
  try {
    const parsed = new URL(url)
    
    // Must be https
    if (parsed.protocol !== 'https:') return false
    
    // Must have a valid hostname (not localhost, not placeholder)
    const hostname = parsed.hostname.toLowerCase()
    if (hostname === 'localhost' || hostname === 'example.com' || hostname.includes('placeholder')) {
      return false
    }
    
    // Known valid retailer domains
    const validDomains = [
      'amazon.com', 'www.amazon.com',
      'bestbuy.com', 'www.bestbuy.com',
      'nike.com', 'www.nike.com',
      'target.com', 'www.target.com',
      'apple.com', 'www.apple.com',
      'dyson.com', 'www.dyson.com',
      'adidas.com', 'www.adidas.com',
      'levis.com', 'www.levis.com',
      'williams-sonoma.com', 'www.williams-sonoma.com',
      'sunglasshut.com', 'www.sunglasshut.com',
      'thenorthface.com', 'www.thenorthface.com',
      'starbucks.com', 'www.starbucks.com',
      'patagonia.com', 'www.patagonia.com',
      // Add affiliate domains
      'amzn.to', 'bit.ly', 'rstyle.me', 'shopstyle.it',
    ]
    
    const isValidDomain = validDomains.some(domain => 
      hostname === domain || hostname.endsWith('.' + domain)
    )
    
    // Also accept any .com domain with a proper path
    const hasProperPath = parsed.pathname.length > 1
    
    return isValidDomain || (hostname.endsWith('.com') && hasProperPath)
  } catch {
    return false
  }
}

// Filter deals to only include those with valid URLs
function filterValidDeals<T extends { affiliate_link?: string | null }>(deals: T[]): T[] {
  return deals.filter(deal => isValidProductUrl(deal.affiliate_link))
}

// Define tools with inputSchema (not parameters)
const searchDealsTool = tool({
  description: 'Search for deals by keyword, category, or store name. Use this tool when users ask about specific products, categories, or stores.',
  inputSchema: z.object({
    query: z.string().optional().describe('Search query for deals (product name, brand, etc.)'),
    category: z.enum(['Electronics', 'Fashion', 'Home & Kitchen']).optional().describe('Category filter'),
    store: z.string().optional().describe('Store name filter (e.g., Amazon, Best Buy, Nike)'),
    minDiscount: z.number().optional().describe('Minimum discount percentage (e.g., 20 for 20% off)'),
    maxPrice: z.number().optional().describe('Maximum price filter'),
  }),
  execute: async ({ query, category, store, minDiscount, maxPrice }) => {
    const supabase = await createClient()
    const sanitizedQuery = query ? sanitizeInput(query) : ''
    const sanitizedStore = store ? sanitizeInput(store) : ''
    
    let dbQuery = supabase
      .from('deals')
      .select('*')
      .eq('is_active', true)
      .order('discount_percentage', { ascending: false })
      .limit(6)

    if (category) {
      dbQuery = dbQuery.eq('category', category)
    }
    if (sanitizedStore) {
      dbQuery = dbQuery.ilike('store', `%${sanitizedStore}%`)
    }
    if (minDiscount && minDiscount > 0) {
      dbQuery = dbQuery.gte('discount_percentage', Math.min(minDiscount, 100))
    }
    if (maxPrice && maxPrice > 0) {
      dbQuery = dbQuery.lte('deal_price', maxPrice)
    }
    if (sanitizedQuery) {
      dbQuery = dbQuery.or(`title.ilike.%${sanitizedQuery}%,description.ilike.%${sanitizedQuery}%,store.ilike.%${sanitizedQuery}%`)
    }

    const { data: deals, error } = await dbQuery

    if (error) {
      return { error: 'Failed to search deals', deals: [], count: 0 }
    }

    // Filter to only include deals with valid product URLs
    const validDeals = filterValidDeals(deals || [])

    return { 
      deals: validDeals, 
      count: validDeals.length,
      searchParams: { query: sanitizedQuery, category, store: sanitizedStore, minDiscount, maxPrice }
    }
  },
})

const getTopDealsTool = tool({
  description: 'Get the best deals with highest discounts. Use this when users ask for "best deals", "top deals", "biggest discounts", or "deals today".',
  inputSchema: z.object({
    limit: z.number().optional().default(6).describe('Number of deals to return (default 6)'),
    category: z.enum(['Electronics', 'Fashion', 'Home & Kitchen']).optional().describe('Optional category filter'),
  }),
  execute: async ({ limit, category }) => {
    const supabase = await createClient()
    const safeLimit = Math.min(Math.max(limit || 6, 1), 10)
    
    let dbQuery = supabase
      .from('deals')
      .select('*')
      .eq('is_active', true)
      .order('discount_percentage', { ascending: false })
      .limit(safeLimit)

    if (category) {
      dbQuery = dbQuery.eq('category', category)
    }

    const { data: deals, error } = await dbQuery

    if (error) {
      return { error: 'Failed to fetch top deals', deals: [], count: 0 }
    }

    // Filter to only include deals with valid product URLs
    const validDeals = filterValidDeals(deals || [])

    return { 
      deals: validDeals, 
      count: validDeals.length,
      message: category ? `Top deals in ${category}` : `Top deals across all categories`
    }
  },
})

const getDealsByStoreTool = tool({
  description: 'Get all deals from a specific store. Use this when users ask about deals at specific retailers like Amazon, Best Buy, Nike, Target, etc.',
  inputSchema: z.object({
    store: z.string().describe('Store name to search for (e.g., Amazon, Best Buy, Nike, Target, Apple)'),
  }),
  execute: async ({ store }) => {
    const supabase = await createClient()
    const sanitizedStore = sanitizeInput(store)
    
    const { data: deals, error } = await supabase
      .from('deals')
      .select('*')
      .eq('is_active', true)
      .ilike('store', `%${sanitizedStore}%`)
      .order('discount_percentage', { ascending: false })
      .limit(10)

    if (error) {
      return { error: 'Failed to fetch store deals', deals: [], count: 0, store: sanitizedStore }
    }

    // Filter to only include deals with valid product URLs
    const validDeals = filterValidDeals(deals || [])

    return { 
      deals: validDeals, 
      count: validDeals.length, 
      store: sanitizedStore,
      message: validDeals.length ? `Found ${validDeals.length} verified deals at ${sanitizedStore}` : `No verified deals found at ${sanitizedStore}`
    }
  },
})

const getCouponCodesTool = tool({
  description: 'Get deals that have coupon codes available. Use this when users specifically ask for "coupon codes", "promo codes", or "discount codes".',
  inputSchema: z.object({
    category: z.enum(['Electronics', 'Fashion', 'Home & Kitchen']).optional().describe('Optional category filter'),
    store: z.string().optional().describe('Optional store filter'),
  }),
  execute: async ({ category, store }) => {
    const supabase = await createClient()
    const sanitizedStore = store ? sanitizeInput(store) : ''
    
    let dbQuery = supabase
      .from('deals')
      .select('*')
      .eq('is_active', true)
      .not('coupon_code', 'is', null)
      .neq('coupon_code', '')
      .order('discount_percentage', { ascending: false })
      .limit(10)

    if (category) {
      dbQuery = dbQuery.eq('category', category)
    }
    if (sanitizedStore) {
      dbQuery = dbQuery.ilike('store', `%${sanitizedStore}%`)
    }

    const { data: deals, error } = await dbQuery

    if (error) {
      return { error: 'Failed to fetch coupon codes', deals: [], count: 0 }
    }

    // Filter to only include deals with valid product URLs
    const validDeals = filterValidDeals(deals || [])
    const couponCodes = validDeals.map(d => ({ store: d.store, code: d.coupon_code, discount: d.discount_percentage }))
    
    return { 
      deals: validDeals, 
      count: validDeals.length,
      couponCodes,
      message: validDeals.length ? `Found ${validDeals.length} verified deals with coupon codes` : 'No verified coupon codes available right now'
    }
  },
})

const tools = {
  searchDeals: searchDealsTool,
  getTopDeals: getTopDealsTool,
  getDealsByStore: getDealsByStoreTool,
  getCouponCodes: getCouponCodesTool,
} as const

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array required' },
        { status: 400 }
      )
    }
    
    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to your environment variables.' },
        { status: 500 }
      )
    }
    
    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: `You are SaveSmart's AI deal finder. Help users find deals from our database.

CRITICAL: The UI will automatically display deal cards from tool results. DO NOT write out deal details in your text response.

Your text response should ONLY be a brief 1-sentence intro like:
- "Here are the best deals I found for you."
- "Found some great electronics deals!"
- "Here are today's top discounts."

NEVER list deals as text, markdown, or bullet points. The deal cards will show automatically.

Tool usage:
- searchDeals: product searches, category browsing, price filters (maxPrice), discount filters (minDiscount)
- getTopDeals: "best deals", "top deals", "biggest discounts"  
- getDealsByStore: specific stores like Amazon, Best Buy, Nike
- getCouponCodes: "coupon codes", "promo codes"

Categories: Electronics, Fashion, Home & Kitchen
Stores: Amazon, Best Buy, Nike, Target, Apple, Dyson, Adidas

If no deals found, suggest trying a different category or store.`,
      messages: await convertToModelMessages(body.messages),
      tools,
      stopWhen: stepCountIs(5),
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('Deal finder API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
