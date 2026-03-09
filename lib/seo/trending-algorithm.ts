import "server-only"

import { createAnonClient } from "@/lib/supabase/anon"
import type { Deal } from "@/lib/deal-types"

// ============================================
// TRENDING SCORE ALGORITHM
// ============================================

// Store popularity scores (higher = more traffic/conversions)
const STORE_POPULARITY: Record<string, number> = {
  "amazon": 100,
  "best-buy": 85,
  "apple": 95,
  "walmart": 80,
  "target": 75,
  "costco": 70,
  "samsung": 72,
  "nike": 88,
  "dell": 65,
  "hp": 60,
  "lenovo": 62,
  "sony": 75,
  "microsoft": 78,
  "google": 70,
  "dyson": 68,
  "bose": 72,
  "nordstrom": 65,
  "macys": 60,
  "home-depot": 70,
  "lowes": 65,
  "wayfair": 62,
  "newegg": 55,
  "b-and-h": 58,
  "adorama": 52,
  "adidas": 75,
  "new-balance": 60,
  "foot-locker": 55,
}

// Calculate trending score (0-100)
// Factors: discount%, recency, store popularity, price value
export function calculateTrendingScore(deal: Deal): number {
  // 1. Discount score (0-35 points) - biggest factor
  const discountScore = Math.min(deal.discount_percentage * 0.7, 35)
  
  // 2. Recency score (0-25 points) - favor fresh deals
  const hoursOld = deal.created_at 
    ? Math.floor((Date.now() - new Date(deal.created_at).getTime()) / (1000 * 60 * 60))
    : 720 // 30 days default
  // Deals less than 24 hours get max points, drops to 0 after 7 days
  const recencyScore = Math.max(0, 25 - (hoursOld / 168) * 25)
  
  // 3. Store popularity (0-20 points)
  const storeSlug = deal.store.toLowerCase().replace(/\s+/g, "-")
  const storeScore = ((STORE_POPULARITY[storeSlug] || 50) / 100) * 20
  
  // 4. Price value score (0-10 points) - favor accessible prices
  // Sweet spot: $20-200, max points around $75
  const priceScore = deal.deal_price < 20 ? 5 
    : deal.deal_price < 75 ? 10 
    : deal.deal_price < 200 ? 8 
    : deal.deal_price < 500 ? 5 
    : 2
  
  // 5. Savings amount bonus (0-10 points)
  const savings = deal.original_price - deal.deal_price
  const savingsScore = Math.min(savings / 100, 10)
  
  return Math.round(discountScore + recencyScore + storeScore + priceScore + savingsScore)
}

// Sort deals by trending score
export function rankTrendingDeals(deals: Deal[]): (Deal & { trendingScore: number })[] {
  return deals
    .map(deal => ({ ...deal, trendingScore: calculateTrendingScore(deal) }))
    .sort((a, b) => b.trendingScore - a.trendingScore)
}

// ============================================
// TRENDING PAGE DEFINITIONS
// ============================================

export interface TrendingPage {
  slug: string
  title: string
  h1: string
  description: string
  keywords: string[]
  filter: {
    minDiscount?: number
    maxHoursOld?: number
    sortBy?: 'trending' | 'discount' | 'recency' | 'price'
  }
  heroGradient: string
  icon: string // lucide icon name
  priority: number // sitemap priority
}

export const TRENDING_PAGES: TrendingPage[] = [
  {
    slug: "trending-deals",
    title: "Trending Deals - Hottest Discounts Right Now | SaveSmart",
    h1: "Trending Deals",
    description: "Discover the hottest trending deals with massive discounts. Shop top-rated products from Amazon, Best Buy, Nike and more at unbeatable prices.",
    keywords: ["trending deals", "hot deals", "popular deals", "best deals today", "top discounts"],
    filter: { sortBy: 'trending' },
    heroGradient: "from-orange-600 to-red-600",
    icon: "TrendingUp",
    priority: 1.0,
  },
  {
    slug: "deals-today",
    title: "Deals Today - Today's Best Discounts & Sales | SaveSmart",
    h1: "Today's Best Deals",
    description: "Fresh deals updated hourly. Find today's biggest discounts on electronics, fashion, home goods and more from top retailers.",
    keywords: ["deals today", "today's deals", "daily deals", "deals of the day", "fresh deals"],
    filter: { maxHoursOld: 24, sortBy: 'recency' },
    heroGradient: "from-blue-600 to-cyan-600",
    icon: "Calendar",
    priority: 1.0,
  },
  {
    slug: "biggest-discounts",
    title: "Biggest Discounts - 50%+ Off Deals | SaveSmart",
    h1: "Biggest Discounts",
    description: "Massive savings with 50%+ off deals. Find the deepest discounts on top brands and products at rock-bottom prices.",
    keywords: ["biggest discounts", "50% off", "huge discounts", "massive savings", "deep discounts"],
    filter: { minDiscount: 50, sortBy: 'discount' },
    heroGradient: "from-green-600 to-emerald-600",
    icon: "Percent",
    priority: 0.9,
  },
  {
    slug: "hot-deals",
    title: "Hot Deals - Limited Time Offers & Flash Sales | SaveSmart",
    h1: "Hot Deals",
    description: "Limited time hot deals and flash sales. Act fast on these popular discounts before they're gone.",
    keywords: ["hot deals", "flash sales", "limited time offers", "urgent deals", "expiring deals"],
    filter: { maxHoursOld: 48, minDiscount: 30, sortBy: 'trending' },
    heroGradient: "from-red-600 to-pink-600",
    icon: "Flame",
    priority: 0.9,
  },
  {
    slug: "top-deals-this-week",
    title: "Top Deals This Week - Weekly Best Discounts | SaveSmart",
    h1: "Top Deals This Week",
    description: "The best deals from the past 7 days. Curated weekly roundup of the biggest discounts and top-rated savings.",
    keywords: ["top deals this week", "weekly deals", "best deals this week", "weekly roundup", "deals of the week"],
    filter: { maxHoursOld: 168, sortBy: 'trending' },
    heroGradient: "from-purple-600 to-violet-600",
    icon: "Star",
    priority: 0.8,
  },
  {
    slug: "lightning-deals",
    title: "Lightning Deals - Flash Sales & Quick Discounts | SaveSmart",
    h1: "Lightning Deals",
    description: "Ultra-fast lightning deals that won't last long. Fresh flash sales added every hour from top retailers.",
    keywords: ["lightning deals", "flash deals", "quick deals", "hourly deals", "fast deals"],
    filter: { maxHoursOld: 12, minDiscount: 25, sortBy: 'recency' },
    heroGradient: "from-yellow-500 to-orange-500",
    icon: "Zap",
    priority: 0.8,
  },
  {
    slug: "clearance-deals",
    title: "Clearance Deals - Deep Discounts on Closeouts | SaveSmart",
    h1: "Clearance Deals",
    description: "Clearance and closeout deals with the deepest discounts. Find last-chance savings on quality products.",
    keywords: ["clearance deals", "closeout deals", "final sale", "clearance sale", "last chance deals"],
    filter: { minDiscount: 60, sortBy: 'discount' },
    heroGradient: "from-rose-600 to-red-700",
    icon: "Tag",
    priority: 0.7,
  },
  {
    slug: "new-deals",
    title: "New Deals - Just Added Discounts & Sales | SaveSmart",
    h1: "New Deals",
    description: "Freshly added deals from the past few hours. Be first to catch the newest discounts before they sell out.",
    keywords: ["new deals", "just added deals", "fresh deals", "latest deals", "newest discounts"],
    filter: { maxHoursOld: 6, sortBy: 'recency' },
    heroGradient: "from-teal-600 to-cyan-600",
    icon: "Sparkles",
    priority: 0.8,
  },
]

// Get page definition by slug
export function getTrendingPageBySlug(slug: string): TrendingPage | undefined {
  return TRENDING_PAGES.find(p => p.slug === slug)
}

// Get all trending page slugs for static generation
export function getAllTrendingPageSlugs(): string[] {
  return TRENDING_PAGES.map(p => p.slug)
}

// ============================================
// DATA FETCHING
// ============================================

export async function getTrendingDealsFiltered(
  filter: TrendingPage['filter'],
  limit: number = 50
): Promise<(Deal & { trendingScore: number })[]> {
  const supabase = createAnonClient()
  
  let query = supabase
    .from("deals")
    .select("*")
    .eq("is_active", true)
  
  // Apply discount filter
  if (filter.minDiscount) {
    query = query.gte("discount_percentage", filter.minDiscount)
  }
  
  // Apply recency filter
  if (filter.maxHoursOld) {
    const cutoffDate = new Date(Date.now() - filter.maxHoursOld * 60 * 60 * 1000)
    query = query.gte("created_at", cutoffDate.toISOString())
  }
  
  // Apply initial sort (will be re-sorted by trending score)
  if (filter.sortBy === 'discount') {
    query = query.order("discount_percentage", { ascending: false })
  } else if (filter.sortBy === 'recency') {
    query = query.order("created_at", { ascending: false })
  } else if (filter.sortBy === 'price') {
    query = query.order("deal_price", { ascending: true })
  } else {
    query = query.order("discount_percentage", { ascending: false })
  }
  
  // Fetch more than needed to allow for re-ranking
  query = query.limit(limit * 2)
  
  const { data, error } = await query
  
  if (error) {
    console.error("Error fetching trending deals:", error)
    return []
  }
  
  // Rank by trending score and return requested limit
  return rankTrendingDeals(data || []).slice(0, limit)
}

// Get stats for a trending page
export async function getTrendingPageStats(filter: TrendingPage['filter']): Promise<{
  totalDeals: number
  avgDiscount: number
  topStore: string
  priceRange: { min: number; max: number }
}> {
  const deals = await getTrendingDealsFiltered(filter, 100)
  
  if (deals.length === 0) {
    return {
      totalDeals: 0,
      avgDiscount: 0,
      topStore: "Amazon",
      priceRange: { min: 0, max: 0 }
    }
  }
  
  const avgDiscount = Math.round(
    deals.reduce((sum, d) => sum + d.discount_percentage, 0) / deals.length
  )
  
  // Find most common store
  const storeCounts = deals.reduce((acc, d) => {
    acc[d.store] = (acc[d.store] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const topStore = Object.entries(storeCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || "Amazon"
  
  const prices = deals.map(d => d.deal_price)
  
  return {
    totalDeals: deals.length,
    avgDiscount,
    topStore,
    priceRange: {
      min: Math.min(...prices),
      max: Math.max(...prices)
    }
  }
}
