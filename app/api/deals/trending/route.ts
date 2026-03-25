import { NextRequest, NextResponse } from "next/server"
import { createAnonClient } from "@/lib/supabase/anon"
import type { Deal } from "@/lib/deal-types"

// Force dynamic to avoid build-time request.url issues
export const dynamic = "force-dynamic"

// Store popularity scores for trending algorithm
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
  "adidas": 75,
}

// Calculate trending score
function calculateTrendingScore(deal: Deal): number {
  const discountScore = Math.min((deal.discount_percentage || 0) * 0.7, 35)
  
  const hoursOld = deal.created_at 
    ? Math.floor((Date.now() - new Date(deal.created_at).getTime()) / (1000 * 60 * 60))
    : 720
  const recencyScore = Math.max(0, 25 - (hoursOld / 168) * 25)
  
  const storeSlug = deal.store.toLowerCase().replace(/\s+/g, "-")
  const storeScore = ((STORE_POPULARITY[storeSlug] || 50) / 100) * 20
  
  const priceScore = deal.deal_price < 20 ? 5 
    : deal.deal_price < 75 ? 10 
    : deal.deal_price < 200 ? 8 
    : deal.deal_price < 500 ? 5 
    : 2
  
  const savings = (deal.original_price || 0) - deal.deal_price
  const savingsScore = Math.min(savings / 100, 10)
  
  return Math.round(discountScore + recencyScore + storeScore + priceScore + savingsScore)
}

export const revalidate = 300 // 5 minutes

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hours = parseInt(searchParams.get("hours") || "24", 10)
    const limit = parseInt(searchParams.get("limit") || "50", 10)
    
    const supabase = createAnonClient()
    
    // Calculate cutoff date
    const cutoffDate = new Date(Date.now() - hours * 60 * 60 * 1000)
    
    // Fetch deals from the time period
    let query = supabase
      .from("deals")
      .select("*")
      .eq("is_active", true)
      .order("discount_percentage", { ascending: false })
    
    // Only apply date filter for shorter time periods
    if (hours <= 168) { // Up to 1 week
      query = query.gte("created_at", cutoffDate.toISOString())
    }
    
    const { data: deals, error } = await query.limit(limit * 2)
    
    if (error) {
      console.error("Error fetching trending deals:", error)
      return NextResponse.json({ error: "Failed to fetch deals" }, { status: 500 })
    }
    
    // If not enough deals from the time period, fetch more recent deals
    let allDeals = deals || []
    
    if (allDeals.length < limit) {
      const existingIds = allDeals.map(d => d.id)
      
      const { data: moreDeal } = await supabase
        .from("deals")
        .select("*")
        .eq("is_active", true)
        .not("id", "in", `(${existingIds.length > 0 ? existingIds.join(',') : 'null'})`)
        .order("discount_percentage", { ascending: false })
        .limit(limit - allDeals.length)
      
      if (moreDeal) {
        allDeals = [...allDeals, ...moreDeal]
      }
    }
    
    // Calculate trending scores and sort
    const rankedDeals = allDeals
      .map(deal => ({ ...deal, trendingScore: calculateTrendingScore(deal) }))
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, limit)
    
    return NextResponse.json({
      deals: rankedDeals,
      period: `${hours} hours`,
      count: rankedDeals.length,
    })
  } catch (error) {
    console.error("Trending API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
