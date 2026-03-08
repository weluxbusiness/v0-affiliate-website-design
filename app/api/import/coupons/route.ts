import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST: Import coupons from external source or JSON
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { coupons } = body
    
    if (!coupons || !Array.isArray(coupons)) {
      return NextResponse.json(
        { error: 'Invalid request. Expected { coupons: [...] }' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    // Process and validate coupons
    const processedCoupons = coupons.map((coupon: Record<string, unknown>) => ({
      store_slug: String(coupon.store_slug),
      store_id: coupon.store_id || null,
      code: coupon.code || null,
      title: String(coupon.title),
      description: coupon.description ? String(coupon.description) : null,
      discount_type: coupon.discount_type || 'percentage',
      discount_value: typeof coupon.discount_value === 'number' ? coupon.discount_value : 0,
      minimum_purchase: typeof coupon.minimum_purchase === 'number' ? coupon.minimum_purchase : null,
      affiliate_link: coupon.affiliate_link ? String(coupon.affiliate_link) : null,
      is_verified: coupon.is_verified === true,
      is_exclusive: coupon.is_exclusive === true,
      is_active: coupon.is_active !== false,
      starts_at: coupon.starts_at || new Date().toISOString(),
      expires_at: coupon.expires_at || null,
      success_rate: typeof coupon.success_rate === 'number' ? coupon.success_rate : 0,
      uses_count: typeof coupon.uses_count === 'number' ? coupon.uses_count : 0
    }))
    
    // Insert coupons (no upsert since they don't have unique slug)
    const { data, error } = await supabase
      .from('coupons')
      .insert(processedCoupons)
      .select()
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to import coupons', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      imported: data?.length || processedCoupons.length,
      coupons: data
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Import failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET: List coupons with filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    const storeSlug = searchParams.get('store')
    const active = searchParams.get('active')
    const verified = searchParams.get('verified')
    
    const supabase = await createClient()
    
    let query = supabase
      .from('coupons')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (storeSlug) {
      query = query.eq('store_slug', storeSlug)
    }
    
    if (active === 'true') {
      query = query.eq('is_active', true)
    }
    
    if (verified === 'true') {
      query = query.eq('is_verified', true)
    }
    
    const { data, error, count } = await query
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch coupons', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      coupons: data,
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
