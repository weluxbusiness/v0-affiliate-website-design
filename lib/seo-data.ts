import "server-only"

// Server-only SEO data fetching functions for programmatic pages
// Fetches stores, coupons, categories, and brands from Supabase
import { createAnonClient } from "@/lib/supabase/anon"
import type { Deal } from "@/lib/deal-types"

// Types for SEO entities
export interface Store {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  website_url: string | null
  affiliate_base_url: string | null
  rating: number
  review_count: number
  color: string
  is_active: boolean
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  parent_slug: string | null
  description: string | null
  icon: string | null
  image_url: string | null
  is_active: boolean
  meta_title: string | null
  meta_description: string | null
  display_order: number
  created_at: string
  updated_at: string
}

export interface Brand {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  website_url: string | null
  is_active: boolean
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
}

export interface Coupon {
  id: string
  store_id: string | null
  store_slug: string
  code: string | null
  title: string
  description: string | null
  discount_type: 'percentage' | 'fixed' | 'free_shipping' | 'bogo' | null
  discount_value: number | null
  minimum_purchase: number | null
  affiliate_link: string | null
  is_verified: boolean
  is_exclusive: boolean
  is_active: boolean
  starts_at: string
  expires_at: string | null
  success_rate: number
  uses_count: number
  created_at: string
  updated_at: string
}

// Fallback data when database is empty or unavailable
const FALLBACK_STORES = [
  'amazon', 'best-buy', 'nike', 'target', 'apple', 'dyson',
  'adidas', 'levis', 'walmart', 'costco', 'macys', 'nordstrom',
  'home-depot', 'lowes', 'wayfair', 'ikea', 'sephora', 'ulta',
  'samsung', 'dell', 'hp', 'lenovo', 'microsoft', 'sony',
  'bose', 'beats', 'jbl', 'lg', 'tcl', 'hisense', 'vizio'
]

const FALLBACK_CATEGORIES = [
  'electronics', 'fashion', 'home-kitchen', 'laptops', 'headphones',
  'sneakers', 'fitness', 'beauty', 'gaming', 'outdoor', 'kitchen',
  'tvs', 'smartphones', 'tablets', 'smartwatches'
]

// ==================== STORE FUNCTIONS ====================

export async function getAllStoresFromDb(): Promise<Store[]> {
  const supabase = createAnonClient()
  
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('is_active', true)
    .order('name')
  
  if (error) {
    console.error('Error fetching stores:', error)
    return []
  }
  
  return data || []
}

export async function getStoreBySlug(slug: string): Promise<Store | null> {
  const supabase = createAnonClient()
  
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  
  if (error) {
    // Store not in DB - return null to use fallback
    return null
  }
  
  return data
}

export async function getStoreSlugs(): Promise<string[]> {
  const supabase = createAnonClient()
  
  const { data, error } = await supabase
    .from('stores')
    .select('slug')
    .eq('is_active', true)
    .order('name')
    .limit(10000)
  
  if (error || !data || data.length === 0) {
    // Fallback to static list
    return FALLBACK_STORES
  }
  
  return data.map(s => s.slug)
}

// ==================== CATEGORY FUNCTIONS ====================

export async function getAllCategoriesFromDb(): Promise<Category[]> {
  const supabase = createAnonClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order')
    .order('name')
  
  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  
  return data || []
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createAnonClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  
  if (error) {
    return null
  }
  
  return data
}

export async function getCategorySlugs(): Promise<string[]> {
  const supabase = createAnonClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('slug')
    .eq('is_active', true)
    .order('name')
    .limit(10000)
  
  if (error || !data || data.length === 0) {
    return FALLBACK_CATEGORIES
  }
  
  return data.map(c => c.slug)
}

// ==================== COUPON FUNCTIONS ====================

export async function getCouponsByStore(storeSlug: string, limit = 50): Promise<Coupon[]> {
  const supabase = createAnonClient()
  
  const now = new Date().toISOString()
  
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('store_slug', storeSlug)
    .eq('is_active', true)
    .or(`expires_at.is.null,expires_at.gte.${now}`)
    .order('is_verified', { ascending: false })
    .order('is_exclusive', { ascending: false })
    .order('discount_value', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error(`Error fetching coupons for ${storeSlug}:`, error)
    return []
  }
  
  return data || []
}

export async function getStoresWithCoupons(): Promise<string[]> {
  const supabase = createAnonClient()
  
  const { data, error } = await supabase
    .from('coupons')
    .select('store_slug')
    .eq('is_active', true)
  
  if (error || !data) {
    return FALLBACK_STORES
  }
  
  // Get unique store slugs
  const storeSet = new Set(data.map(c => c.store_slug))
  return Array.from(storeSet)
}

export async function getAllActiveCoupons(limit = 100): Promise<Coupon[]> {
  const supabase = createAnonClient()
  
  const now = new Date().toISOString()
  
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('is_active', true)
    .or(`expires_at.is.null,expires_at.gte.${now}`)
    .order('is_verified', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching all coupons:', error)
    return []
  }
  
  return data || []
}

// ==================== BRAND FUNCTIONS ====================

export async function getAllBrandsFromDb(): Promise<Brand[]> {
  const supabase = createAnonClient()
  
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('is_active', true)
    .order('name')
  
  if (error) {
    console.error('Error fetching brands:', error)
    return []
  }
  
  return data || []
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const supabase = createAnonClient()
  
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  
  if (error) {
    return null
  }
  
  return data
}

export async function getBrandSlugs(): Promise<string[]> {
  const supabase = createAnonClient()
  
  const { data, error } = await supabase
    .from('brands')
    .select('slug')
    .eq('is_active', true)
    .order('name')
    .limit(10000)
  
  if (error || !data || data.length === 0) {
    return []
  }
  
  return data.map(b => b.slug)
}

// ==================== COMBINED QUERY FUNCTIONS ====================

export interface StoreWithDeals extends Store {
  deals: Deal[]
  coupons: Coupon[]
  dealCount: number
  couponCount: number
}

export async function getStoreWithDeals(storeSlug: string): Promise<StoreWithDeals | null> {
  const supabase = createAnonClient()
  
  // Fetch store info
  const store = await getStoreBySlug(storeSlug)
  
  // Fetch deals for store (from deals table)
  const { data: deals, error: dealsError } = await supabase
    .from('deals')
    .select('*')
    .eq('is_active', true)
    .ilike('store', `%${storeSlug.replace(/-/g, ' ')}%`)
    .order('discount_percentage', { ascending: false })
    .limit(50)
  
  if (dealsError) {
    console.error(`Error fetching deals for ${storeSlug}:`, dealsError)
  }
  
  // Fetch coupons for store
  const coupons = await getCouponsByStore(storeSlug)
  
  const dealsList = deals || []
  
  // If store doesn't exist in DB, create a minimal store object
  const storeData: Store = store || {
    id: storeSlug,
    name: storeSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    slug: storeSlug,
    description: null,
    logo_url: null,
    website_url: null,
    affiliate_base_url: null,
    rating: 4.5,
    review_count: 1000,
    color: 'from-blue-600 to-blue-700',
    is_active: true,
    meta_title: null,
    meta_description: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  
  return {
    ...storeData,
    deals: dealsList,
    coupons,
    dealCount: dealsList.length,
    couponCount: coupons.length,
  }
}

// ==================== SITEMAP HELPER FUNCTIONS ====================

export async function getStoreSlugsForSitemap(): Promise<{ slug: string; updatedAt: string }[]> {
  const supabase = createAnonClient()
  
  const { data, error } = await supabase
    .from('stores')
    .select('slug, updated_at')
    .eq('is_active', true)
    .order('name')
    .limit(10000)
  
  if (error || !data || data.length === 0) {
    // Fallback to static list with current date
    const now = new Date().toISOString()
    return FALLBACK_STORES.map(slug => ({ slug, updatedAt: now }))
  }
  
  return data.map(s => ({ slug: s.slug, updatedAt: s.updated_at }))
}

export async function getCategorySlugsForSitemap(): Promise<{ slug: string; updatedAt: string }[]> {
  const supabase = createAnonClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('slug, updated_at')
    .eq('is_active', true)
    .order('name')
    .limit(10000)
  
  if (error || !data || data.length === 0) {
    const now = new Date().toISOString()
    return FALLBACK_CATEGORIES.map(slug => ({ slug, updatedAt: now }))
  }
  
  return data.map(c => ({ slug: c.slug, updatedAt: c.updated_at }))
}

// ==================== INTERNAL LINKING HELPERS ====================

export async function getRelatedStores(currentSlug: string, limit = 6): Promise<Store[]> {
  const supabase = createAnonClient()
  
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('is_active', true)
    .neq('slug', currentSlug)
    .order('review_count', { ascending: false })
    .limit(limit)
  
  if (error || !data) {
    return []
  }
  
  return data
}

export async function getRelatedCategories(currentSlug: string, limit = 6): Promise<Category[]> {
  const supabase = createAnonClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .neq('slug', currentSlug)
    .order('display_order')
    .limit(limit)
  
  if (error || !data) {
    return []
  }
  
  return data
}

// Get stores that have deals in a specific category
export async function getStoresForCategory(categorySlug: string, limit = 10): Promise<string[]> {
  const supabase = createAnonClient()
  
  const { data, error } = await supabase
    .from('deals')
    .select('store')
    .eq('is_active', true)
    .ilike('category', `%${categorySlug.replace(/-/g, ' ')}%`)
  
  if (error || !data) {
    return FALLBACK_STORES.slice(0, limit)
  }
  
  // Get unique stores
  const storeSet = new Set(data.map(d => d.store))
  return Array.from(storeSet).slice(0, limit)
}

// Get categories available for a specific store
export async function getCategoriesForStore(storeSlug: string, limit = 10): Promise<string[]> {
  const supabase = createAnonClient()
  
  const { data, error } = await supabase
    .from('deals')
    .select('category')
    .eq('is_active', true)
    .ilike('store', `%${storeSlug.replace(/-/g, ' ')}%`)
  
  if (error || !data) {
    return FALLBACK_CATEGORIES.slice(0, limit)
  }
  
  // Get unique categories
  const categorySet = new Set(data.map(d => d.category))
  return Array.from(categorySet).slice(0, limit)
}
