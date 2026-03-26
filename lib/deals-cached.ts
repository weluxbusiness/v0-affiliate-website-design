import "server-only"

// Cached deal fetching functions for programmatic SEO pages
// Uses unstable_cache to reduce database load when scaling to 100k+ pages
import { unstable_cache } from "next/cache"
import { createAnonClient } from "@/lib/supabase/anon"
import type { Deal } from "@/lib/deal-types"

// Cache durations
const ONE_HOUR = 3600
const FOUR_HOURS = 14400
const ONE_DAY = 86400

// ==================== CACHED DEAL QUERIES ====================

// Cached trending deals - used on homepage
export const getCachedTrendingDeals = unstable_cache(
  async (limit: number): Promise<Deal[]> => {
    const supabase = createAnonClient()
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
  },
  ["trending-deals"],
  { revalidate: ONE_HOUR, tags: ["deals"] }
)

// Cached deals by category - used on category pages
export const getCachedDealsByCategory = unstable_cache(
  async (category: string, limit: number): Promise<Deal[]> => {
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
  },
  ["deals-category"],
  { revalidate: ONE_HOUR, tags: ["deals"] }
)

// Cached deals by store - used on store pages
export const getCachedDealsByStore = unstable_cache(
  async (store: string, limit: number): Promise<Deal[]> => {
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
  },
  ["deals-store"],
  { revalidate: ONE_HOUR, tags: ["deals"] }
)

// Cached deals by brand - used on brand pages
export const getCachedDealsByBrand = unstable_cache(
  async (brand: string, limit: number): Promise<Deal[]> => {
    const supabase = createAnonClient()
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
  },
  ["deals-brand"],
  { revalidate: ONE_HOUR, tags: ["deals"] }
)

// Cached search results - used for search queries
export const getCachedSearchDeals = unstable_cache(
  async (query: string, limit: number): Promise<Deal[]> => {
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
  },
  ["deals-search"],
  { revalidate: ONE_HOUR, tags: ["deals"] }
)

// Cached deals under price - used on price filter pages
export const getCachedDealsUnderPrice = unstable_cache(
  async (maxPrice: number, category?: string, limit?: number): Promise<Deal[]> => {
    const supabase = createAnonClient()
    
    let query = supabase
      .from("deals")
      .select("*")
      .eq("is_active", true)
      .lte("deal_price", maxPrice)
    
    if (category) {
      query = query.ilike("category", `%${category}%`)
    }
    
    query = query.order("discount_percentage", { ascending: false }).limit(limit || 50)
    
    const { data, error } = await query
    
    if (error) {
      console.error(`Error fetching deals under $${maxPrice}:`, error)
      return []
    }
    
    return data || []
  },
  ["deals-price"],
  { revalidate: ONE_HOUR, tags: ["deals"] }
)

// Cached latest deals - used on homepage
export const getCachedLatestDeals = unstable_cache(
  async (limit: number): Promise<Deal[]> => {
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
  },
  ["latest-deals"],
  { revalidate: ONE_HOUR, tags: ["deals"] }
)

// ==================== CACHED AGGREGATE QUERIES ====================

// Cached popular stores - used for navigation/cross-linking
export const getCachedPopularStores = unstable_cache(
  async (limit: number): Promise<{ store: string; dealCount: number }[]> => {
    const supabase = createAnonClient()
    
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
    return Array.from(storeCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([store, dealCount]) => ({ store, dealCount }))
  },
  ["popular-stores"],
  { revalidate: FOUR_HOURS, tags: ["stores"] }
)

// Cached popular categories - used for navigation/cross-linking
export const getCachedPopularCategories = unstable_cache(
  async (limit: number): Promise<{ category: string; dealCount: number }[]> => {
    const supabase = createAnonClient()
    
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
    return Array.from(categoryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([category, dealCount]) => ({ category, dealCount }))
  },
  ["popular-categories"],
  { revalidate: FOUR_HOURS, tags: ["categories"] }
)

// ==================== SITEMAP HELPERS ====================

// Cached deal slugs for sitemap - long cache since sitemaps don't need real-time data
export const getCachedDealSlugs = unstable_cache(
  async (): Promise<{ slug: string; updatedAt: string }[]> => {
    const supabase = createAnonClient()
    
    const { data, error } = await supabase
      .from("deals")
      .select("slug, updated_at")
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(10000)
    
    if (error) {
      console.error("Error fetching deal slugs:", error)
      return []
    }
    
    return (data || []).map(d => ({
      slug: d.slug,
      updatedAt: d.updated_at,
    }))
  },
  ["deal-slugs-sitemap"],
  { revalidate: ONE_DAY, tags: ["sitemap"] }
)

// Get latest deal update timestamp for sitemap freshness signals
export const getLatestDealUpdateTime = unstable_cache(
  async (): Promise<string> => {
    const supabase = createAnonClient()
    
    const { data, error } = await supabase
      .from("deals")
      .select("updated_at")
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single()
    
    if (error || !data) {
      // Fallback to current time if query fails
      return new Date().toISOString()
    }
    
    return data.updated_at
  },
  ["latest-deal-update"],
  { revalidate: ONE_HOUR, tags: ["sitemap"] }
)
