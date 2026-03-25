import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Force dynamic to avoid build-time request.url issues
export const dynamic = "force-dynamic"

const BASE_URL = 'https://savesmart.bio'

// Auto-generate SEO pages for all stores and categories
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json().catch(() => ({}))
    const { type = 'all' } = body // 'all', 'stores', 'categories', 'coupons'
    
    const results: Record<string, { generated: number; errors: string[] }> = {}
    const month = new Date().toLocaleString('default', { month: 'long' })
    const year = new Date().getFullYear()
    
    // Generate store and coupon pages
    if (type === 'all' || type === 'stores' || type === 'coupons') {
      const { data: stores, error: storesError } = await supabase
        .from('stores')
        .select('slug, name')
        .eq('is_active', true)
      
      if (storesError) {
        return NextResponse.json({ error: 'Failed to fetch stores', details: storesError.message }, { status: 500 })
      }
      
      if (stores && stores.length > 0) {
        const storePages = stores.map(store => ({
          slug: `stores/${store.slug}`,
          page_type: 'store',
          title: `${store.name} Deals & Coupons - Save up to 70% | SaveSmart`,
          h1: `${store.name} Deals & Discounts`,
          meta_description: `Find the best ${store.name} deals, coupons, and promo codes for ${month} ${year}. Save money with verified discounts.`,
          canonical_url: `${BASE_URL}/stores/${store.slug}`,
          is_indexed: true
        }))
        
        const couponPages = stores.map(store => ({
          slug: `coupons/${store.slug}`,
          page_type: 'coupon',
          title: `${store.name} Coupons & Promo Codes - ${month} ${year} | SaveSmart`,
          h1: `${store.name} Coupons & Promo Codes`,
          meta_description: `Get verified ${store.name} coupon codes and promo codes for ${month} ${year}. Save with exclusive discounts.`,
          canonical_url: `${BASE_URL}/coupons/${store.slug}`,
          is_indexed: true
        }))
        
        const allStorePages = [...storePages, ...couponPages]
        
        const { error: insertError } = await supabase
          .from('seo_pages')
          .upsert(allStorePages, { onConflict: 'slug' })
        
        results.stores = {
          generated: insertError ? 0 : allStorePages.length,
          errors: insertError ? [insertError.message] : []
        }
      }
    }
    
    // Generate category and best pages
    if (type === 'all' || type === 'categories') {
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('slug, name')
        .eq('is_active', true)
      
      if (categoriesError) {
        return NextResponse.json({ error: 'Failed to fetch categories', details: categoriesError.message }, { status: 500 })
      }
      
      if (categories && categories.length > 0) {
        const categoryPages = categories.map(category => ({
          slug: `deals/${category.slug}`,
          page_type: 'category',
          title: `Best ${category.name} Deals & Discounts ${year} | SaveSmart`,
          h1: `Best ${category.name} Deals`,
          meta_description: `Shop the best ${category.name.toLowerCase()} deals and discounts from top retailers. Find verified coupons and save.`,
          canonical_url: `${BASE_URL}/deals/${category.slug}`,
          is_indexed: true
        }))
        
        const bestPages = categories.map(category => ({
          slug: `best/${category.slug}`,
          page_type: 'best',
          title: `Best ${category.name} of ${year} - Top Deals & Reviews | SaveSmart`,
          h1: `Best ${category.name} of ${year}`,
          meta_description: `Discover the best ${category.name.toLowerCase()} of ${year} with expert reviews and top deals. Compare and save.`,
          canonical_url: `${BASE_URL}/best/${category.slug}`,
          is_indexed: true
        }))
        
        const allCategoryPages = [...categoryPages, ...bestPages]
        
        const { error: insertError } = await supabase
          .from('seo_pages')
          .upsert(allCategoryPages, { onConflict: 'slug' })
        
        results.categories = {
          generated: insertError ? 0 : allCategoryPages.length,
          errors: insertError ? [insertError.message] : []
        }
      }
    }
    
    // Calculate totals
    const totalGenerated = Object.values(results).reduce((sum, r) => sum + r.generated, 0)
    const totalErrors = Object.values(results).reduce((sum, r) => sum + r.errors.length, 0)
    
    return NextResponse.json({
      success: true,
      message: `Generated ${totalGenerated} SEO pages with ${totalErrors} errors.`,
      results
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Generation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET: List all SEO pages
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    const type = searchParams.get('type')
    
    const supabase = await createClient()
    
    let query = supabase
      .from('seo_pages')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (type) {
      query = query.eq('page_type', type)
    }
    
    const { data, error, count } = await query
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch SEO pages', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      pages: data,
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
