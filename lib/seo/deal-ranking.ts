import "server-only"

import { createAnonClient } from "@/lib/supabase/anon"
import type { Deal } from "@/lib/deal-types"

// ============================================
// DEAL RANKING ALGORITHM
// ============================================

// Store reputation scores (higher = better)
const STORE_REPUTATION: Record<string, number> = {
  "amazon": 95,
  "best-buy": 90,
  "apple": 95,
  "walmart": 85,
  "target": 88,
  "costco": 92,
  "samsung": 88,
  "nike": 90,
  "dell": 85,
  "hp": 82,
  "lenovo": 80,
  "sony": 88,
  "microsoft": 90,
  "google": 88,
  "dyson": 92,
  "bose": 90,
  "nordstrom": 85,
  "macys": 80,
  "home-depot": 85,
  "lowes": 82,
  "wayfair": 78,
  "newegg": 82,
  "b-and-h": 88,
  "adorama": 85,
}

// Calculate deal score (0-100)
export function calculateDealScore(deal: Deal): number {
  // Normalize discount (0-40 points) - higher discount = better
  const discountScore = Math.min(deal.discount_percentage * 0.8, 40)
  
  // Store reputation (0-20 points)
  const storeSlug = deal.store.toLowerCase().replace(/\s+/g, "-")
  const storeScore = ((STORE_REPUTATION[storeSlug] || 70) / 100) * 20
  
  // Price value score (0-20 points) - favor lower prices
  // Deals under $50 get max points, scaling down to 0 for deals over $500
  const priceScore = Math.max(0, 20 - (deal.deal_price / 500) * 20)
  
  // Savings amount score (0-10 points)
  const savings = deal.original_price - deal.deal_price
  const savingsScore = Math.min(savings / 50, 10)
  
  // Recency bonus (0-10 points) - newer deals get slight boost
  const daysOld = deal.created_at 
    ? Math.floor((Date.now() - new Date(deal.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 30
  const recencyScore = Math.max(0, 10 - daysOld * 0.5)
  
  return Math.round(discountScore + storeScore + priceScore + savingsScore + recencyScore)
}

// Sort deals by score
export function rankDeals(deals: Deal[]): Deal[] {
  return [...deals].sort((a, b) => calculateDealScore(b) - calculateDealScore(a))
}

// ============================================
// DEAL FINDER PAGE DEFINITIONS
// ============================================

export interface DealFinderPage {
  slug: string
  title: string
  h1: string
  description: string
  keywords: string[]
  filter: {
    maxPrice?: number
    minDiscount?: number
    category?: string
    store?: string
  }
  priority: number // 0.5-1.0 for sitemap
}

// Pre-defined deal finder pages
export const DEAL_FINDER_PAGES: DealFinderPage[] = [
  // Price-based pages
  {
    slug: "best-deals-under-25",
    title: "Best Deals Under $25 - Budget Finds | SaveSmart",
    h1: "Best Deals Under $25",
    description: "Find amazing deals under $25. Budget-friendly products with big discounts from Amazon, Target, Walmart and more.",
    keywords: ["deals under $25", "cheap deals", "budget deals", "affordable products"],
    filter: { maxPrice: 25 },
    priority: 0.9,
  },
  {
    slug: "best-deals-under-50",
    title: "Best Deals Under $50 - Top Discounts | SaveSmart",
    h1: "Best Deals Under $50",
    description: "Discover the best deals under $50. Quality products at affordable prices from top retailers. Updated daily.",
    keywords: ["deals under $50", "discounts under $50", "cheap products", "budget shopping"],
    filter: { maxPrice: 50 },
    priority: 0.9,
  },
  {
    slug: "best-deals-under-100",
    title: "Best Deals Under $100 - Great Value | SaveSmart",
    h1: "Best Deals Under $100",
    description: "Shop the best deals under $100. Premium products at great prices from Amazon, Best Buy, and more.",
    keywords: ["deals under $100", "products under $100", "best value deals"],
    filter: { maxPrice: 100 },
    priority: 0.9,
  },
  {
    slug: "best-deals-under-200",
    title: "Best Deals Under $200 - Premium Savings | SaveSmart",
    h1: "Best Deals Under $200",
    description: "Find premium products under $200 with the best discounts. Electronics, home goods, and more.",
    keywords: ["deals under $200", "products under $200", "mid-range deals"],
    filter: { maxPrice: 200 },
    priority: 0.8,
  },
  {
    slug: "best-deals-under-500",
    title: "Best Deals Under $500 - Big Ticket Savings | SaveSmart",
    h1: "Best Deals Under $500",
    description: "Score big-ticket items under $500 with massive discounts. TVs, laptops, appliances, and more.",
    keywords: ["deals under $500", "big ticket deals", "electronics under $500"],
    filter: { maxPrice: 500 },
    priority: 0.8,
  },
  
  // Discount-based pages
  {
    slug: "deals-50-percent-off",
    title: "50% Off Deals - Half Price Sales | SaveSmart",
    h1: "Deals with 50% Off or More",
    description: "Find deals with 50% off or more. Massive discounts on electronics, fashion, home goods from top retailers.",
    keywords: ["50 percent off", "half price deals", "50% off sales", "big discounts"],
    filter: { minDiscount: 50 },
    priority: 0.9,
  },
  {
    slug: "deals-40-percent-off",
    title: "40% Off Deals - Great Discounts | SaveSmart",
    h1: "Deals with 40% Off or More",
    description: "Discover deals with at least 40% off. Save big on quality products from Amazon, Best Buy, and more.",
    keywords: ["40 percent off", "40% off deals", "big savings"],
    filter: { minDiscount: 40 },
    priority: 0.8,
  },
  {
    slug: "deals-30-percent-off",
    title: "30% Off Deals - Solid Savings | SaveSmart",
    h1: "Deals with 30% Off or More",
    description: "Shop deals with 30% off or more. Quality products at reduced prices from trusted retailers.",
    keywords: ["30 percent off", "30% off deals", "discount shopping"],
    filter: { minDiscount: 30 },
    priority: 0.7,
  },
  
  // Category-based pages
  {
    slug: "best-tech-deals-today",
    title: "Best Tech Deals Today - Electronics Discounts | SaveSmart",
    h1: "Best Tech Deals Today",
    description: "Find the best tech deals today. Laptops, phones, tablets, and gadgets at the lowest prices.",
    keywords: ["tech deals today", "electronics deals", "gadget sales", "technology discounts"],
    filter: { category: "electronics" },
    priority: 0.95,
  },
  {
    slug: "best-gaming-deals",
    title: "Best Gaming Deals - PS5, Xbox, PC Games | SaveSmart",
    h1: "Best Gaming Deals",
    description: "Score the best gaming deals on consoles, games, and accessories. PS5, Xbox, Nintendo, and PC gaming.",
    keywords: ["gaming deals", "ps5 deals", "xbox deals", "video game sales", "gaming accessories"],
    filter: { category: "gaming" },
    priority: 0.95,
  },
  {
    slug: "best-smartphone-deals",
    title: "Best Smartphone Deals - iPhone, Samsung, Pixel | SaveSmart",
    h1: "Best Smartphone Deals",
    description: "Compare the best smartphone deals on iPhone, Samsung Galaxy, Google Pixel, and more.",
    keywords: ["smartphone deals", "iphone deals", "samsung deals", "cell phone sales"],
    filter: { category: "smartphone" },
    priority: 0.95,
  },
  {
    slug: "best-laptop-deals",
    title: "Best Laptop Deals - MacBook, Dell, HP | SaveSmart",
    h1: "Best Laptop Deals",
    description: "Find the best laptop deals on MacBook, Dell, HP, Lenovo, and more. Compare prices and save.",
    keywords: ["laptop deals", "macbook deals", "computer sales", "notebook discounts"],
    filter: { category: "laptop" },
    priority: 0.95,
  },
  {
    slug: "best-tv-deals",
    title: "Best TV Deals - 4K, OLED, Smart TVs | SaveSmart",
    h1: "Best TV Deals",
    description: "Shop the best TV deals on 4K, OLED, and Smart TVs from Samsung, LG, Sony, and more.",
    keywords: ["tv deals", "4k tv deals", "oled tv sales", "smart tv discounts"],
    filter: { category: "tv" },
    priority: 0.9,
  },
  {
    slug: "best-headphone-deals",
    title: "Best Headphone Deals - AirPods, Sony, Bose | SaveSmart",
    h1: "Best Headphone Deals",
    description: "Find the best headphone deals on AirPods, Sony WH-1000XM5, Bose, and more wireless earbuds.",
    keywords: ["headphone deals", "airpods deals", "wireless earbuds", "audio sales"],
    filter: { category: "headphone" },
    priority: 0.9,
  },
  {
    slug: "best-fashion-deals",
    title: "Best Fashion Deals - Clothing & Shoes | SaveSmart",
    h1: "Best Fashion Deals",
    description: "Discover the best fashion deals on clothing, shoes, and accessories from Nike, Adidas, and more.",
    keywords: ["fashion deals", "clothing sales", "shoe deals", "apparel discounts"],
    filter: { category: "fashion" },
    priority: 0.85,
  },
  {
    slug: "best-home-deals",
    title: "Best Home Deals - Furniture & Appliances | SaveSmart",
    h1: "Best Home Deals",
    description: "Shop the best home deals on furniture, appliances, and decor from Wayfair, Amazon, and more.",
    keywords: ["home deals", "furniture sales", "appliance deals", "home decor discounts"],
    filter: { category: "home" },
    priority: 0.85,
  },
  
  // Time-based pages
  {
    slug: "todays-best-deals",
    title: "Today's Best Deals - Daily Discounts | SaveSmart",
    h1: "Today's Best Deals",
    description: "Find today's best deals and discounts. Fresh deals updated hourly from Amazon, Best Buy, and more.",
    keywords: ["todays deals", "daily deals", "deals today", "current sales"],
    filter: {},
    priority: 1.0, // Highest priority
  },
  {
    slug: "flash-deals",
    title: "Flash Deals - Limited Time Offers | SaveSmart",
    h1: "Flash Deals",
    description: "Don't miss these flash deals! Limited time offers with deep discounts. Act fast before they're gone.",
    keywords: ["flash deals", "limited time deals", "lightning deals", "quick sales"],
    filter: { minDiscount: 35 },
    priority: 0.9,
  },
  
  // Store-specific pages
  {
    slug: "best-amazon-deals",
    title: "Best Amazon Deals - Top Discounts | SaveSmart",
    h1: "Best Amazon Deals",
    description: "Find the best Amazon deals today. Compare discounts on electronics, home, fashion, and more.",
    keywords: ["amazon deals", "amazon sales", "amazon discounts", "prime deals"],
    filter: { store: "amazon" },
    priority: 0.9,
  },
  {
    slug: "best-best-buy-deals",
    title: "Best Buy Deals - Electronics & More | SaveSmart",
    h1: "Best Best Buy Deals",
    description: "Shop the best Best Buy deals on electronics, computers, appliances, and tech accessories.",
    keywords: ["best buy deals", "best buy sales", "electronics deals"],
    filter: { store: "best-buy" },
    priority: 0.85,
  },
  {
    slug: "best-target-deals",
    title: "Best Target Deals - Home, Fashion & More | SaveSmart",
    h1: "Best Target Deals",
    description: "Discover the best Target deals on home goods, fashion, electronics, and everyday essentials.",
    keywords: ["target deals", "target sales", "target discounts"],
    filter: { store: "target" },
    priority: 0.85,
  },
  {
    slug: "best-walmart-deals",
    title: "Best Walmart Deals - Rollback Savings | SaveSmart",
    h1: "Best Walmart Deals",
    description: "Find the best Walmart deals and rollback prices on electronics, home, grocery, and more.",
    keywords: ["walmart deals", "walmart rollbacks", "walmart sales"],
    filter: { store: "walmart" },
    priority: 0.85,
  },
]

// Get deal finder page by slug
export function getDealFinderPage(slug: string): DealFinderPage | null {
  return DEAL_FINDER_PAGES.find(page => page.slug === slug) ?? null
}

// Get all deal finder page slugs
export function getAllDealFinderSlugs(): string[] {
  return DEAL_FINDER_PAGES.map(page => page.slug)
}

// ============================================
// DEAL FETCHING BY FILTER
// ============================================

export async function getDealsForFinderPage(
  filter: DealFinderPage["filter"],
  limit: number = 24
): Promise<Deal[]> {
  const supabase = createAnonClient()
  
  let query = supabase
    .from("deals")
    .select("*")
    .eq("is_active", true)
  
  // Apply price filter
  if (filter.maxPrice) {
    query = query.lte("deal_price", filter.maxPrice)
  }
  
  // Apply discount filter
  if (filter.minDiscount) {
    query = query.gte("discount_percentage", filter.minDiscount)
  }
  
  // Apply category filter
  if (filter.category) {
    query = query.ilike("category", `%${filter.category}%`)
  }
  
  // Apply store filter
  if (filter.store) {
    const storeSearch = filter.store.replace(/-/g, " ")
    query = query.ilike("store", `%${storeSearch}%`)
  }
  
  // Order by discount percentage
  query = query.order("discount_percentage", { ascending: false })
  
  // Limit results
  query = query.limit(limit)
  
  const { data, error } = await query
  
  if (error) {
    console.error("Error fetching deals for finder page:", error)
    return []
  }
  
  // Rank the deals
  return rankDeals(data || [])
}

// ============================================
// STRUCTURED DATA GENERATORS
// ============================================

export function generateItemListSchema(
  deals: Deal[],
  pageTitle: string,
  pageUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: pageTitle,
    url: `https://savesmart.bio${pageUrl}`,
    numberOfItems: deals.length,
    itemListElement: deals.slice(0, 20).map((deal, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: deal.title,
        description: deal.description,
        image: deal.image_url,
        brand: {
          "@type": "Brand",
          name: deal.store,
        },
        offers: {
          "@type": "Offer",
          url: deal.affiliate_link,
          price: deal.deal_price,
          priceCurrency: "USD",
          priceValidUntil: deal.expires_at,
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: deal.store,
          },
        },
      },
    })),
  }
}

export function generateAggregateOfferSchema(
  deals: Deal[],
  pageTitle: string
) {
  if (deals.length === 0) return null
  
  const prices = deals.map(d => d.deal_price)
  const lowPrice = Math.min(...prices)
  const highPrice = Math.max(...prices)
  
  return {
    "@context": "https://schema.org",
    "@type": "AggregateOffer",
    name: pageTitle,
    offerCount: deals.length,
    lowPrice: lowPrice.toFixed(2),
    highPrice: highPrice.toFixed(2),
    priceCurrency: "USD",
  }
}

// ============================================
// FAQ GENERATION
// ============================================

export function generateDealFinderFAQs(page: DealFinderPage, dealCount: number) {
  const faqs = []
  
  // Price-based FAQs
  if (page.filter.maxPrice) {
    faqs.push({
      question: `What are the best deals under $${page.filter.maxPrice}?`,
      answer: `We currently have ${dealCount} deals under $${page.filter.maxPrice} from top retailers like Amazon, Best Buy, Target, and Walmart. Our deals are ranked by a combination of discount percentage, store reputation, and overall value.`,
    })
    faqs.push({
      question: `How often are deals under $${page.filter.maxPrice} updated?`,
      answer: `Our deal finder pages are updated hourly to ensure you see the freshest discounts. Deals are automatically ranked by our algorithm that considers discount percentage, price value, and store reputation.`,
    })
  }
  
  // Discount-based FAQs
  if (page.filter.minDiscount) {
    faqs.push({
      question: `How do I find deals with ${page.filter.minDiscount}% off or more?`,
      answer: `This page shows all deals with at least ${page.filter.minDiscount}% off the original price. We verify discounts against retailer websites and rank deals by overall value and store reputation.`,
    })
  }
  
  // Category-based FAQs
  if (page.filter.category) {
    const category = page.filter.category.charAt(0).toUpperCase() + page.filter.category.slice(1)
    faqs.push({
      question: `What are the best ${category} deals today?`,
      answer: `We track ${dealCount}+ ${category.toLowerCase()} deals from major retailers. Our ranking algorithm prioritizes high discounts, trusted stores, and great value to surface the best deals first.`,
    })
    faqs.push({
      question: `Which stores have the best ${category} discounts?`,
      answer: `For ${category.toLowerCase()}, we find the best deals at Amazon, Best Buy, Walmart, and specialty retailers. SaveSmart compares prices across all stores so you can find the lowest price.`,
    })
  }
  
  // Store-based FAQs
  if (page.filter.store) {
    const store = page.filter.store.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ")
    faqs.push({
      question: `What are the best ${store} deals right now?`,
      answer: `We track ${dealCount}+ ${store} deals across all categories. Our algorithm ranks deals by discount percentage and overall value to help you find the best savings at ${store}.`,
    })
  }
  
  // Generic FAQs
  faqs.push({
    question: "How does the deal ranking algorithm work?",
    answer: "Our algorithm scores deals based on discount percentage (40%), store reputation (20%), price value (20%), savings amount (10%), and recency (10%). Deals with higher scores appear first.",
  })
  faqs.push({
    question: "Are these deals verified?",
    answer: "Yes, all deals are verified against retailer websites. We show the original price, sale price, and exact discount percentage. Click any deal to confirm pricing on the retailer's site.",
  })
  
  return faqs
}
