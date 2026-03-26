import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { 
  generateStores, 
  generateCategories, 
  generateCoupons, 
  generateSeoPages 
} from '@/lib/data/seed-data'

export const dynamic = 'force-dynamic'

// Batch size for database inserts (to avoid timeouts)
const BATCH_SIZE = 100

// Helper to insert in batches
async function insertBatch<T extends Record<string, unknown>>(
  supabase: Awaited<ReturnType<typeof createClient>>,
  tableName: string,
  data: T[],
  batchSize: number = BATCH_SIZE
): Promise<{ inserted: number; errors: string[] }> {
  let inserted = 0
  const errors: string[] = []
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize)
    
    const { error } = await supabase
      .from(tableName)
      .upsert(batch, { onConflict: 'slug' })
    
    if (error) {
      errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`)
    } else {
      inserted += batch.length
    }
  }
  
  return { inserted, errors }
}

export async function POST(request: Request) {
  try {
    // Verify authorization (use a simple API key for now)
    const authHeader = request.headers.get('authorization')
    const expectedKey = process.env.SEED_API_KEY || 'savesmart-seed-2024'
    
    if (authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Parse request body for options
    const body = await request.json().catch(() => ({}))
    const {
      storeCount = 1000,
      couponCount = 10000,
      clearExisting = false
    } = body
    
    const supabase = await createClient()
    const results: Record<string, { inserted: number; errors: string[] }> = {}
    
    // Optionally clear existing data
    if (clearExisting) {
      await supabase.from('seo_pages').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('coupons').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('stores').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    }
    
    // 1. Generate and insert categories (100)
    console.log('[v0] Generating categories...')
    const categories = generateCategories()
    results.categories = await insertBatch(supabase, 'categories', categories)
    
    // 2. Generate and insert stores
    console.log(`[v0] Generating ${storeCount} stores...`)
    const stores = generateStores(storeCount)
    results.stores = await insertBatch(supabase, 'stores', stores)
    
    // 3. Generate and insert coupons
    console.log(`[v0] Generating ${couponCount} coupons...`)
    const storeInfo = stores.map(s => ({ slug: s.slug, name: s.name }))
    const coupons = generateCoupons(storeInfo, couponCount)
    
    // Insert coupons in smaller batches (they don't have unique slug constraint)
    let couponsInserted = 0
    const couponErrors: string[] = []
    
    for (let i = 0; i < coupons.length; i += BATCH_SIZE) {
      const batch = coupons.slice(i, i + BATCH_SIZE)
      const { error } = await supabase.from('coupons').insert(batch)
      
      if (error) {
        couponErrors.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${error.message}`)
      } else {
        couponsInserted += batch.length
      }
    }
    results.coupons = { inserted: couponsInserted, errors: couponErrors }
    
    // 4. Generate and insert SEO pages
    console.log('[v0] Generating SEO pages...')
    const categoryInfo = categories.map(c => ({ slug: c.slug, name: c.name }))
    const seoPages = generateSeoPages(storeInfo, categoryInfo)
    results.seo_pages = await insertBatch(supabase, 'seo_pages', seoPages)
    
    // Calculate totals
    const totalInserted = Object.values(results).reduce((sum, r) => sum + r.inserted, 0)
    const totalErrors = Object.values(results).reduce((sum, r) => sum + r.errors.length, 0)
    
    return NextResponse.json({
      success: true,
      message: `Seed completed. Inserted ${totalInserted} records with ${totalErrors} errors.`,
      results
    })
    
  } catch (error) {
    console.error('[v0] Seed error:', error)
    return NextResponse.json(
      { error: 'Seed failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET endpoint to check seed status
export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get counts from each table
    const [storesResult, categoriesResult, couponsResult, seoPagesResult] = await Promise.all([
      supabase.from('stores').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('coupons').select('*', { count: 'exact', head: true }),
      supabase.from('seo_pages').select('*', { count: 'exact', head: true })
    ])
    
    return NextResponse.json({
      counts: {
        stores: storesResult.count || 0,
        categories: categoriesResult.count || 0,
        coupons: couponsResult.count || 0,
        seo_pages: seoPagesResult.count || 0
      },
      isSeeded: (storesResult.count || 0) > 0
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get seed status', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
