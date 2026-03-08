import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/deal-types'
import { pingSearchEngines } from '@/lib/seo/pingGoogle'
import { z } from 'zod'

export const maxDuration = 30

// Schema for deal creation request
const CreateDealSchema = z.object({
  title: z.string().min(5).max(200),
  store: z.string().min(2).max(100),
  category: z.string().min(2).max(50),
  price: z.number().positive(),
  original_price: z.number().positive(),
  affiliate_url: z.string().url(),
  description: z.string().optional(),
  image_url: z.string().url().optional().nullable(),
  coupon_code: z.string().optional().nullable(),
  expires_at: z.string().optional(), // ISO date string
})

// Bulk creation schema
const BulkCreateSchema = z.object({
  deals: z.array(CreateDealSchema).min(1).max(100),
})

export async function POST(req: Request) {
  // Verify API key for automated access
  const authHeader = req.headers.get('authorization')
  const expectedKey = process.env.DEAL_API_KEY || process.env.DEAL_DISCOVERY_API_KEY
  
  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    
    // Check if this is a bulk request or single deal
    const isBulk = Array.isArray(body.deals)
    
    let dealsToInsert: z.infer<typeof CreateDealSchema>[]
    
    if (isBulk) {
      const parsed = BulkCreateSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json({ 
          error: 'Invalid request body', 
          details: parsed.error.errors 
        }, { status: 400 })
      }
      dealsToInsert = parsed.data.deals
    } else {
      const parsed = CreateDealSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json({ 
          error: 'Invalid request body', 
          details: parsed.error.errors 
        }, { status: 400 })
      }
      dealsToInsert = [parsed.data]
    }

    const supabase = await createClient()
    const insertedDeals = []
    const errors = []

    for (const deal of dealsToInsert) {
      // Calculate discount percentage
      const discount_percentage = Math.round(
        ((deal.original_price - deal.price) / deal.original_price) * 100
      )
      
      // Generate SEO-friendly slug
      const baseSlug = generateSlug(deal.title)
      
      // Check for existing slug and make unique if needed
      let slug = baseSlug
      let slugCounter = 0
      
      while (true) {
        const { data: existing } = await supabase
          .from('deals')
          .select('id')
          .eq('slug', slug)
          .single()
        
        if (!existing) break
        
        slugCounter++
        slug = `${baseSlug}-${slugCounter}`
        
        if (slugCounter > 10) {
          // Add random suffix if too many duplicates
          slug = `${baseSlug}-${Date.now()}`
          break
        }
      }

      // Set default expiration (30 days from now if not provided)
      const expires_at = deal.expires_at || 
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

      const insertData = {
        title: deal.title,
        description: deal.description || `Save on ${deal.title} at ${deal.store}`,
        store: deal.store,
        category: deal.category,
        original_price: deal.original_price,
        deal_price: deal.price,
        discount_percentage,
        coupon_code: deal.coupon_code || null,
        affiliate_link: deal.affiliate_url,
        image_url: deal.image_url || null,
        expires_at,
        is_active: true,
        slug,
        source: 'api',
      }

      const { data, error } = await supabase
        .from('deals')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        errors.push({
          title: deal.title,
          error: error.message,
        })
      } else if (data) {
        insertedDeals.push({
          id: data.id,
          slug: data.slug,
          title: data.title,
          url: `/deal/${data.slug}`,
        })
      }
    }

    // Ping search engines to notify about new content
    let seoNotification = null
    if (insertedDeals.length > 0) {
      try {
        seoNotification = await pingSearchEngines()
        console.log('[API] Search engines pinged:', seoNotification)
      } catch (pingError) {
        console.error('[API] Failed to ping search engines:', pingError)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Created ${insertedDeals.length} deal(s)`,
      inserted: insertedDeals.length,
      deals: insertedDeals,
      errors: errors.length > 0 ? errors : undefined,
      seo: seoNotification,
    })
  } catch (error) {
    console.error('Deal creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create deal(s)' },
      { status: 500 }
    )
  }
}

// GET endpoint to list recent deals (for debugging/verification)
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  const expectedKey = process.env.DEAL_API_KEY || process.env.DEAL_DISCOVERY_API_KEY
  
  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)

  try {
    const supabase = await createClient()
    const { data: deals, error } = await supabase
      .from('deals')
      .select('id, slug, title, store, category, deal_price, discount_percentage, created_at')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      count: deals?.length || 0,
      deals: deals?.map(d => ({
        ...d,
        url: `/deal/${d.slug}`,
      })) || [],
    })
  } catch (error) {
    console.error('Deal listing error:', error)
    return NextResponse.json(
      { error: 'Failed to list deals' },
      { status: 500 }
    )
  }
}
