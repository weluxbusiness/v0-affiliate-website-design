import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/data/seed-data'

export const dynamic = 'force-dynamic'

// POST: Import stores from external source or JSON
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { stores } = body
    
    if (!stores || !Array.isArray(stores)) {
      return NextResponse.json(
        { error: 'Invalid request. Expected { stores: [...] }' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    // Process and validate stores
    const processedStores = stores.map((store: Record<string, unknown>) => ({
      name: String(store.name),
      slug: store.slug ? String(store.slug) : generateSlug(String(store.name)),
      description: store.description ? String(store.description) : `Shop deals at ${store.name}`,
      logo_url: store.logo_url || null,
      website_url: store.website_url ? String(store.website_url) : `https://${generateSlug(String(store.name))}.com`,
      affiliate_base_url: store.affiliate_base_url ? String(store.affiliate_base_url) : null,
      rating: typeof store.rating === 'number' ? store.rating : 4.0,
      review_count: typeof store.review_count === 'number' ? store.review_count : 0,
      color: store.color ? String(store.color) : '#10b981',
      is_active: store.is_active !== false,
      meta_title: store.meta_title ? String(store.meta_title) : `${store.name} Deals & Coupons | SaveSmart`,
      meta_description: store.meta_description ? String(store.meta_description) : `Find the best ${store.name} deals, coupons, and promo codes.`
    }))
    
    // Insert with upsert to handle duplicates
    const { data, error } = await supabase
      .from('stores')
      .upsert(processedStores, { onConflict: 'slug' })
      .select()
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to import stores', details: error.message },
        { status: 500 }
      )
    }
    
    // Also create SEO pages for new stores
    const seoPages = processedStores.flatMap((store: { slug: string; name: string }) => [
      {
        slug: `stores/${store.slug}`,
        page_type: 'store',
        title: `${store.name} Deals & Coupons | SaveSmart`,
        h1: `${store.name} Deals & Discounts`,
        meta_description: `Find the best ${store.name} deals, coupons, and promo codes.`,
        canonical_url: `https://savesmart.bio/stores/${store.slug}`,
        is_indexed: true
      },
      {
        slug: `coupons/${store.slug}`,
        page_type: 'coupon',
        title: `${store.name} Coupons & Promo Codes | SaveSmart`,
        h1: `${store.name} Coupons & Promo Codes`,
        meta_description: `Get verified ${store.name} coupon codes and promo codes.`,
        canonical_url: `https://savesmart.bio/coupons/${store.slug}`,
        is_indexed: true
      }
    ])
    
    await supabase.from('seo_pages').upsert(seoPages, { onConflict: 'slug' })
    
    return NextResponse.json({
      success: true,
      imported: data?.length || processedStores.length,
      stores: data
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Import failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET: List all stores
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    const active = searchParams.get('active')
    
    const supabase = await createClient()
    
    let query = supabase
      .from('stores')
      .select('*', { count: 'exact' })
      .order('name')
      .range(offset, offset + limit - 1)
    
    if (active === 'true') {
      query = query.eq('is_active', true)
    }
    
    const { data, error, count } = await query
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch stores', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      stores: data,
      total: count,
      limit,
      offset
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Request failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
