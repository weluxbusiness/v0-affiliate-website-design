import "server-only"

// Server-only deal fetching functions
// This file should only be imported from Server Components (pages, layouts, route handlers)
import { createClient } from "@/lib/supabase/server"
import { createAnonClient } from "@/lib/supabase/anon"
import type { Deal } from "@/lib/deal-types"

export async function getTrendingDeals(limit = 6): Promise<Deal[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("is_active", true)
    .order("discount_percentage", { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error("Error fetching trending deals:", error)
    return []
  }
  
  return data || []
}

export async function getDailyDeals(limit = 4): Promise<Deal[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("is_active", true)
    .gte("expires_at", new Date().toISOString())
    .order("expires_at", { ascending: true })
    .limit(limit)
  
  if (error) {
    console.error("Error fetching daily deals:", error)
    return []
  }
  
  return data || []
}

export async function getDealsByCategory(category: string, limit = 12): Promise<Deal[]> {
  // Use anon client for ISR compatibility (no cookies)
  const supabase = createAnonClient()
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("is_active", true)
    .ilike("category", `%${category}%`)
    .order("discount_percentage", { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error(`Error fetching ${category} deals:`, error)
    return []
  }
  
  return data || []
}

export async function getAllCategories(): Promise<string[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("deals")
    .select("category")
    .eq("is_active", true)
  
  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }
  
  const categories = [...new Set(data?.map(d => d.category) || [])]
  return categories
}

export async function getDealById(id: string): Promise<Deal | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("id", id)
    .single()
  
  if (error) {
    console.error(`Error fetching deal ${id}:`, error)
    return null
  }
  
  return data
}

export async function getAllDeals(limit = 20): Promise<Deal[]> {
  // Use anon client for ISR compatibility (no cookies)
  const supabase = createAnonClient()
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("is_active", true)
    .order("discount_percentage", { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error("Error fetching all deals:", error)
    return []
  }
  
  return data ?? []
}

export async function getDealsByStore(store: string, limit = 12): Promise<Deal[]> {
  // Use anon client for ISR compatibility (no cookies)
  const supabase = createAnonClient()
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("is_active", true)
    .ilike("store", `%${store}%`)
    .order("discount_percentage", { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error(`Error fetching ${store} deals:`, error)
    return []
  }
  
  return data || []
}

export async function searchDeals(query: string, limit = 12): Promise<Deal[]> {
  // Use anon client for ISR compatibility (no cookies)
  const supabase = createAnonClient()
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("is_active", true)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order("discount_percentage", { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error(`Error searching deals for ${query}:`, error)
    return []
  }
  
  return data || []
}

export async function getAllStores(): Promise<string[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("deals")
    .select("store")
    .eq("is_active", true)
  
  if (error) {
    console.error("Error fetching stores:", error)
    return []
  }
  
  const stores = [...new Set(data?.map(d => d.store) || [])]
  return stores
}

export async function getLatestDeals(limit = 10): Promise<Deal[]> {
  // Use anon client for ISR compatibility (no cookies)
  const supabase = createAnonClient()
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error("Error fetching latest deals:", error)
    return []
  }
  
  return data || []
}

export async function getDealsFromSameStore(store: string, excludeId: string, limit = 6): Promise<Deal[]> {
  const supabase = createAnonClient()
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("is_active", true)
    .ilike("store", store)
    .neq("id", excludeId)
    .order("discount_percentage", { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error(`Error fetching deals from ${store}:`, error)
    return []
  }
  
  return data || []
}

export interface PopularStore {
  store: string
  dealCount: number
}

export async function getPopularStores(limit = 10): Promise<PopularStore[]> {
  // Use anon client for ISR compatibility (no cookies)
  const supabase = createAnonClient()
  
  // Fetch all active deals and count by store
  const { data, error } = await supabase
    .from("deals")
    .select("store")
    .eq("is_active", true)

  if (error) {
    console.error("Error fetching popular stores:", error)
    return []
  }

  // Count deals per store
  const storeCounts = new Map<string, number>()
  for (const deal of data || []) {
    if (deal.store) {
      const count = storeCounts.get(deal.store) || 0
      storeCounts.set(deal.store, count + 1)
    }
  }

  // Sort by count and return top stores
  const sorted = Array.from(storeCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([store, dealCount]) => ({ store, dealCount }))

  return sorted
}

export interface SeoQueryFilters {
  category?: string
  brand?: string
  maxPrice?: number
}

export async function getDealsForSeoPage(filters: SeoQueryFilters, limit = 50): Promise<Deal[]> {
  const supabase = createAnonClient()
  
  let query = supabase
    .from("deals")
    .select("*")
    .eq("is_active", true)

  // Apply category filter
  if (filters.category) {
    query = query.or(`category.ilike.%${filters.category}%,title.ilike.%${filters.category}%,description.ilike.%${filters.category}%`)
  }

  // Apply brand filter (search in title, store, or description)
  if (filters.brand) {
    query = query.or(`store.ilike.%${filters.brand}%,title.ilike.%${filters.brand}%,description.ilike.%${filters.brand}%`)
  }

  // Apply max price filter
  if (filters.maxPrice) {
    query = query.lte("deal_price", filters.maxPrice)
  }

  // Order by discount percentage for "best" deals
  query = query.order("discount_percentage", { ascending: false }).limit(limit)

  const { data, error } = await query

  if (error) {
    console.error("Error fetching SEO page deals:", error)
    return []
  }

  return data || []
}

export async function getDealsUnderPrice(
  maxPrice: number, 
  category?: string, 
  store?: string, 
  limit = 50
): Promise<Deal[]> {
  const supabase = createAnonClient()
  
  let query = supabase
    .from("deals")
    .select("*")
    .eq("is_active", true)
    .lte("deal_price", maxPrice)

  if (category) {
    query = query.ilike("category", `%${category}%`)
  }

  if (store) {
    query = query.ilike("store", `%${store}%`)
  }

  query = query.order("discount_percentage", { ascending: false }).limit(limit)

  const { data, error } = await query

  if (error) {
    console.error(`Error fetching deals under $${maxPrice}:`, error)
    return []
  }

  return data || []
}

export async function getPopularCategories(limit = 10): Promise<{ category: string; dealCount: number }[]> {
  // Use anon client for ISR compatibility (no cookies)
  const supabase = createAnonClient()
  
  // Fetch all active deals and count by category
  const { data, error } = await supabase
    .from("deals")
    .select("category")
    .eq("is_active", true)

  if (error) {
    console.error("Error fetching popular categories:", error)
    return []
  }

  // Count deals per category
  const categoryCounts = new Map<string, number>()
  for (const deal of data || []) {
    if (deal.category) {
      const count = categoryCounts.get(deal.category) || 0
      categoryCounts.set(deal.category, count + 1)
    }
  }

  // Sort by count and return top categories
  const sorted = Array.from(categoryCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([category, dealCount]) => ({ category, dealCount }))

  return sorted
}

export async function getDealsByBrand(brand: string, limit = 50): Promise<Deal[]> {
  // Use anon client for ISR compatibility (no cookies)
  const supabase = createAnonClient()
  
  // Search for brand in title, store, or description
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("is_active", true)
    .or(`store.ilike.%${brand}%,title.ilike.%${brand}%,description.ilike.%${brand}%`)
    .order("discount_percentage", { ascending: false })
    .limit(limit)

  if (error) {
    console.error(`Error fetching ${brand} deals:`, error)
    return []
  }

  return data || []
}

// ============================================
// PAGINATION HELPERS FOR SEO
// ============================================

export const DEALS_PER_PAGE = 24

export interface PaginatedDealsResult {
  deals: Deal[]
  totalCount: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export async function getDealsByCategoryPaginated(
  category: string, 
  page: number = 1
): Promise<PaginatedDealsResult> {
  const supabase = createAnonClient()
  const offset = (page - 1) * DEALS_PER_PAGE
  
  // Get total count
  const { count, error: countError } = await supabase
    .from("deals")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)
    .ilike("category", `%${category}%`)
  
  if (countError) {
    console.error(`Error counting ${category} deals:`, countError)
    return { deals: [], totalCount: 0, totalPages: 0, currentPage: page, hasNextPage: false, hasPrevPage: false }
  }
  
  const totalCount = count || 0
  const totalPages = Math.ceil(totalCount / DEALS_PER_PAGE)
  
  // Get paginated deals
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("is_active", true)
    .ilike("category", `%${category}%`)
    .order("discount_percentage", { ascending: false })
    .range(offset, offset + DEALS_PER_PAGE - 1)
  
  if (error) {
    console.error(`Error fetching ${category} deals page ${page}:`, error)
    return { deals: [], totalCount, totalPages, currentPage: page, hasNextPage: false, hasPrevPage: false }
  }
  
  return {
    deals: data || [],
    totalCount,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}

export async function getDealsByStorePaginated(
  store: string, 
  page: number = 1
): Promise<PaginatedDealsResult> {
  const supabase = createAnonClient()
  const offset = (page - 1) * DEALS_PER_PAGE
  
  // Get total count
  const { count, error: countError } = await supabase
    .from("deals")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)
    .ilike("store", `%${store}%`)
  
  if (countError) {
    console.error(`Error counting ${store} deals:`, countError)
    return { deals: [], totalCount: 0, totalPages: 0, currentPage: page, hasNextPage: false, hasPrevPage: false }
  }
  
  const totalCount = count || 0
  const totalPages = Math.ceil(totalCount / DEALS_PER_PAGE)
  
  // Get paginated deals
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("is_active", true)
    .ilike("store", `%${store}%`)
    .order("discount_percentage", { ascending: false })
    .range(offset, offset + DEALS_PER_PAGE - 1)
  
  if (error) {
    console.error(`Error fetching ${store} deals page ${page}:`, error)
    return { deals: [], totalCount, totalPages, currentPage: page, hasNextPage: false, hasPrevPage: false }
  }
  
  return {
    deals: data || [],
    totalCount,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}

export async function getDealsByBrandPaginated(
  brand: string, 
  page: number = 1
): Promise<PaginatedDealsResult> {
  const supabase = createAnonClient()
  const offset = (page - 1) * DEALS_PER_PAGE
  
  // Get total count
  const { count, error: countError } = await supabase
    .from("deals")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)
    .or(`store.ilike.%${brand}%,title.ilike.%${brand}%,description.ilike.%${brand}%`)
  
  if (countError) {
    console.error(`Error counting ${brand} deals:`, countError)
    return { deals: [], totalCount: 0, totalPages: 0, currentPage: page, hasNextPage: false, hasPrevPage: false }
  }
  
  const totalCount = count || 0
  const totalPages = Math.ceil(totalCount / DEALS_PER_PAGE)
  
  // Get paginated deals
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("is_active", true)
    .or(`store.ilike.%${brand}%,title.ilike.%${brand}%,description.ilike.%${brand}%`)
    .order("discount_percentage", { ascending: false })
    .range(offset, offset + DEALS_PER_PAGE - 1)
  
  if (error) {
    console.error(`Error fetching ${brand} deals page ${page}:`, error)
    return { deals: [], totalCount, totalPages, currentPage: page, hasNextPage: false, hasPrevPage: false }
  }
  
  return {
    deals: data || [],
    totalCount,
    totalPages,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
}

export async function getDealsByBrandAndCategory(
  brand: string,
  category: string,
  limit: number = 50
): Promise<Deal[]> {
  const supabase = createAnonClient()
  
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("is_active", true)
    .ilike("category", `%${category}%`)
    .or(`store.ilike.%${brand}%,title.ilike.%${brand}%,description.ilike.%${brand}%`)
    .order("discount_percentage", { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error(`Error fetching ${brand} ${category} deals:`, error)
    return []
  }
  
  return data || []
}

export async function getDealsByStoreAndCategory(
  store: string,
  category: string,
  limit: number = 50
): Promise<Deal[]> {
  const supabase = createAnonClient()
  
  // Format store slug for search (e.g., "best-buy" -> "best buy")
  const storeSearch = store.replace(/-/g, ' ')
  
  const { data, error } = await supabase
    .from("deals")
    .select("*")
    .eq("is_active", true)
    .ilike("store", `%${storeSearch}%`)
    .ilike("category", `%${category}%`)
    .order("discount_percentage", { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error(`Error fetching ${store} ${category} deals:`, error)
    return []
  }
  
  return data || []
}

// ============================================
// CATEGORY × BRAND PAGINATION
// ============================================

export interface CategoryBrandPaginatedResult {
  deals: Deal[]
  totalCount: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export async function getDealsByCategoryAndBrandPaginated(
  category: string,
  brand: string,
  page: number = 1
): Promise<CategoryBrandPaginatedResult> {
  // Validate inputs
  if (!category || !brand) {
    return { deals: [], totalCount: 0, totalPages: 0, currentPage: page, hasNextPage: false, hasPrevPage: false }
  }
  
  try {
    const supabase = createAnonClient()
    const offset = (page - 1) * DEALS_PER_PAGE
    
    // Format for search (convert slug to searchable text)
    const categorySearch = category.replace(/-/g, ' ')
    const brandSearch = brand.replace(/-/g, ' ')
    
    // Get total count - use textSearch approach for brand matching
    const { count, error: countError } = await supabase
      .from("deals")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)
      .ilike("category", `%${categorySearch}%`)
      .or(`store.ilike.%${brandSearch}%,title.ilike.%${brandSearch}%`)
    
    if (countError) {
      console.error(`[v0] Error counting ${category} ${brand} deals:`, countError.message)
      return { deals: [], totalCount: 0, totalPages: 0, currentPage: page, hasNextPage: false, hasPrevPage: false }
    }
    
    const totalCount = count || 0
    const totalPages = Math.ceil(totalCount / DEALS_PER_PAGE)
    
    // If no deals, return early
    if (totalCount === 0) {
      return { deals: [], totalCount: 0, totalPages: 0, currentPage: page, hasNextPage: false, hasPrevPage: false }
    }
    
    // Get paginated deals
    const { data, error } = await supabase
      .from("deals")
      .select("*")
      .eq("is_active", true)
      .ilike("category", `%${categorySearch}%`)
      .or(`store.ilike.%${brandSearch}%,title.ilike.%${brandSearch}%`)
      .order("discount_percentage", { ascending: false })
      .range(offset, offset + DEALS_PER_PAGE - 1)
    
    if (error) {
      console.error(`[v0] Error fetching ${category} ${brand} deals page ${page}:`, error.message)
      return { deals: [], totalCount, totalPages, currentPage: page, hasNextPage: false, hasPrevPage: false }
    }
    
    return {
      deals: data || [],
      totalCount,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    }
  } catch (err) {
    console.error(`[v0] Unexpected error in getDealsByCategoryAndBrandPaginated:`, err)
    return { deals: [], totalCount: 0, totalPages: 0, currentPage: page, hasNextPage: false, hasPrevPage: false }
  }
}

export async function getCategoryBrandCombinations(): Promise<{ category: string; brand: string }[]> {
  const supabase = createAnonClient()
  
  // Get all active deals with category info
  const { data, error } = await supabase
    .from("deals")
    .select("category, store, title")
    .eq("is_active", true)
  
  if (error || !data) {
    return []
  }
  
  // Extract unique category × brand combinations
  const combinations = new Map<string, { category: string; brand: string }>()
  
  // Common brand keywords to extract from store/title
  const knownBrands = [
    'apple', 'samsung', 'nike', 'adidas', 'sony', 'lg', 'dell', 'hp',
    'lenovo', 'bose', 'beats', 'microsoft', 'nintendo', 'dyson', 'philips',
    'panasonic', 'canon', 'nikon', 'asus', 'acer'
  ]
  
  for (const deal of data) {
    if (!deal.category) continue
    
    const categorySlug = deal.category.toLowerCase().replace(/\s+/g, '-')
    const searchText = `${deal.store} ${deal.title}`.toLowerCase()
    
    for (const brand of knownBrands) {
      if (searchText.includes(brand)) {
        const key = `${categorySlug}-${brand}`
        if (!combinations.has(key)) {
          combinations.set(key, { category: categorySlug, brand })
        }
      }
    }
  }
  
  return Array.from(combinations.values())
}
