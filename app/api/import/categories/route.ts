import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/data/seed-data'

// Force dynamic to avoid build-time request.url issues
export const dynamic = "force-dynamic"

// POST: Import categories from external source or JSON
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { categories } = body
    
    if (!categories || !Array.isArray(categories)) {
      return NextResponse.json(
        { error: 'Invalid request. Expected { categories: [...] }' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    // Process and validate categories
    const processedCategories = categories.map((category: Record<string, unknown>, index: number) => ({
      name: String(category.name),
      slug: category.slug ? String(category.slug) : generateSlug(String(category.name)),
      parent_slug: category.parent_slug || null,
      description: category.description ? String(category.description) : `Shop the best ${category.name} deals`,
      icon: category.icon ? String(category.icon) : 'Tag',
      image_url: category.image_url || null,
      is_active: category.is_active !== false,
      meta_title: category.meta_title ? String(category.meta_title) : `Best ${category.name} Deals | SaveSmart`,
      meta_description: category.meta_description ? String(category.meta_description) : `Find the best ${category.name} deals and discounts.`,
      display_order: typeof category.display_order === 'number' ? category.display_order : index
    }))
    
    // Insert with upsert to handle duplicates
    const { data, error } = await supabase
      .from('categories')
      .upsert(processedCategories, { onConflict: 'slug' })
      .select()
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to import categories', details: error.message },
        { status: 500 }
      )
    }
    
    // Also create SEO pages for new categories
    const seoPages = processedCategories.flatMap((category: { slug: string; name: string }) => [
      {
        slug: `deals/${category.slug}`,
        page_type: 'category',
        title: `Best ${category.name} Deals & Discounts | SaveSmart`,
        h1: `Best ${category.name} Deals`,
        meta_description: `Shop the best ${category.name} deals and discounts.`,
        canonical_url: `https://savesmart.bio/deals/${category.slug}`,
        is_indexed: true
      },
      {
        slug: `best/${category.slug}`,
        page_type: 'best',
        title: `Best ${category.name} of ${new Date().getFullYear()} | SaveSmart`,
        h1: `Best ${category.name} of ${new Date().getFullYear()}`,
        meta_description: `Discover the best ${category.name} with expert reviews and top deals.`,
        canonical_url: `https://savesmart.bio/best/${category.slug}`,
        is_indexed: true
      }
    ])
    
    await supabase.from('seo_pages').upsert(seoPages, { onConflict: 'slug' })
    
    return NextResponse.json({
      success: true,
      imported: data?.length || processedCategories.length,
      categories: data
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Import failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET: List all categories
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    const parent = searchParams.get('parent')
    const active = searchParams.get('active')
    
    const supabase = await createClient()
    
    let query = supabase
      .from('categories')
      .select('*', { count: 'exact' })
      .order('display_order')
      .range(offset, offset + limit - 1)
    
    if (parent) {
      query = query.eq('parent_slug', parent)
    } else if (parent === '') {
      query = query.is('parent_slug', null)
    }
    
    if (active === 'true') {
      query = query.eq('is_active', true)
    }
    
    const { data, error, count } = await query
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch categories', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      categories: data,
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
