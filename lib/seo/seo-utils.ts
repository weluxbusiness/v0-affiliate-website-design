// SEO utilities for programmatic page generation
// Handles slug generation, meta tag creation, and structured data

import type { Deal } from '@/lib/deal-types'

// Generate SEO-friendly slug from any text
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')  // Remove special characters
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/-+/g, '-')            // Replace multiple hyphens with single
    .replace(/^-|-$/g, '')          // Remove leading/trailing hyphens
    .trim()
    .slice(0, 100)                   // Limit length
}

// Generate unique slug with optional suffix
export function generateUniqueSlug(text: string, suffix?: string | number): string {
  const baseSlug = generateSlug(text)
  if (suffix !== undefined) {
    return `${baseSlug}-${suffix}`.slice(0, 100)
  }
  return baseSlug
}

// Generate store slug from store name
export function storeNameToSlug(storeName: string): string {
  const specialMappings: Record<string, string> = {
    "Best Buy": "best-buy",
    "Home Depot": "home-depot",
    "The Home Depot": "home-depot",
    "Levi's": "levis",
    "Macy's": "macys",
    "Dick's Sporting Goods": "dicks-sporting-goods",
    "Kohl's": "kohls",
    "JCPenney": "jcpenney",
    "Sam's Club": "sams-club",
    "BJ's": "bjs",
    "Trader Joe's": "trader-joes",
    "Sunglass Hut": "sunglass-hut",
    "Williams-Sonoma": "williams-sonoma",
    "Williams Sonoma": "williams-sonoma",
    "Crate & Barrel": "crate-barrel",
    "Pottery Barn": "pottery-barn",
    "West Elm": "west-elm",
    "The North Face": "the-north-face",
    "Under Armour": "under-armour",
    "New Balance": "new-balance",
    "B&H Photo": "b-h-photo",
    "O'Reilly Auto Parts": "oreilys",
    "Advance Auto Parts": "advance-auto",
  }
  
  return specialMappings[storeName] || generateSlug(storeName)
}

// Convert slug back to formatted store name
export function slugToStoreName(slug: string): string {
  const storeMap: Record<string, string> = {
    'amazon': 'Amazon',
    'best-buy': 'Best Buy',
    'nike': 'Nike',
    'target': 'Target',
    'apple': 'Apple',
    'dyson': 'Dyson',
    'adidas': 'Adidas',
    'levis': "Levi's",
    'walmart': 'Walmart',
    'costco': 'Costco',
    'macys': "Macy's",
    'nordstrom': 'Nordstrom',
    'home-depot': 'Home Depot',
    'lowes': "Lowe's",
    'wayfair': 'Wayfair',
    'ikea': 'IKEA',
    'sephora': 'Sephora',
    'ulta': 'Ulta Beauty',
    'kohls': "Kohl's",
    'jcpenney': 'JCPenney',
    'the-north-face': 'The North Face',
    'patagonia': 'Patagonia',
    'columbia': 'Columbia',
    'under-armour': 'Under Armour',
    'puma': 'Puma',
    'new-balance': 'New Balance',
    'converse': 'Converse',
    'vans': 'Vans',
    'timberland': 'Timberland',
    'samsung': 'Samsung',
    'dell': 'Dell',
    'hp': 'HP',
    'lenovo': 'Lenovo',
    'microsoft': 'Microsoft',
    'sony': 'Sony',
    'bose': 'Bose',
    'beats': 'Beats',
    'jbl': 'JBL',
    'lg': 'LG',
    'williams-sonoma': 'Williams Sonoma',
    'crate-barrel': 'Crate & Barrel',
    'pottery-barn': 'Pottery Barn',
    'west-elm': 'West Elm',
    'b-h-photo': 'B&H Photo',
    'rei': 'REI',
  }
  
  return storeMap[slug] || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

// Generate category slug
export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/\s*&\s*/g, '-')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Convert slug back to formatted category name
export function slugToCategoryName(slug: string): string {
  const categoryMap: Record<string, string> = {
    'electronics': 'Electronics',
    'fashion': 'Fashion',
    'home': 'Home',
    'home-kitchen': 'Home & Kitchen',
    'laptops': 'Laptops',
    'headphones': 'Headphones',
    'sneakers': 'Sneakers',
    'fitness': 'Fitness',
    'beauty': 'Beauty',
    'gaming': 'Gaming',
    'outdoor': 'Outdoor',
    'kitchen': 'Kitchen',
    'tvs': 'TVs',
    'smartphones': 'Smartphones',
    'tablets': 'Tablets',
    'smartwatches': 'Smartwatches',
    'cameras': 'Cameras',
    'speakers': 'Speakers',
    'monitors': 'Monitors',
    'jeans': 'Jeans',
    'jackets': 'Jackets',
    'shoes': 'Shoes',
    'bags': 'Bags',
    'jewelry': 'Jewelry',
    'watches': 'Watches',
    'furniture': 'Furniture',
    'bedding': 'Bedding',
    'cookware': 'Cookware',
    'air-fryers': 'Air Fryers',
    'vacuums': 'Vacuums',
    'coffee-makers': 'Coffee Makers',
    'running-shoes': 'Running Shoes',
    'gaming-laptops': 'Gaming Laptops',
    'oled-tvs': 'OLED TVs',
  }
  
  return categoryMap[slug] || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

// Generate meta title with template
export function generateMetaTitle(
  type: 'store' | 'coupon' | 'category' | 'best' | 'price',
  primary: string,
  secondary?: string
): string {
  const year = new Date().getFullYear()
  const month = new Date().toLocaleString('default', { month: 'long' })
  
  switch (type) {
    case 'store':
      return secondary 
        ? `${primary} ${secondary} Deals & Discounts | SaveSmart`
        : `${primary} Deals & Coupons - ${month} ${year} | SaveSmart`
    case 'coupon':
      return `${primary} Coupons & Promo Codes - ${month} ${year} | SaveSmart`
    case 'category':
      return `Best ${primary} Deals - Compare Prices & Save | SaveSmart`
    case 'best':
      return `Best ${primary} Deals ${year} - Top Discounts | SaveSmart`
    case 'price':
      return `Deals ${primary} - Best Discounts | SaveSmart`
    default:
      return `${primary} | SaveSmart`
  }
}

// Generate meta description
export function generateMetaDescription(
  type: 'store' | 'coupon' | 'category' | 'best' | 'price',
  primary: string,
  secondary?: string,
  dealCount?: number
): string {
  const year = new Date().getFullYear()
  const month = new Date().toLocaleString('default', { month: 'long' })
  const count = dealCount ? `${dealCount}+ ` : ''
  
  switch (type) {
    case 'store':
      return secondary
        ? `Find ${count}${primary} ${secondary} deals. Compare prices and save up to 70% with verified discounts and coupon codes.`
        : `Get the best ${primary} deals and discounts for ${month} ${year}. Save up to 70% with verified coupons, promo codes and exclusive offers.`
    case 'coupon':
      return `Get ${primary} coupon codes, promo codes & discounts for ${month} ${year}. Save up to 70% with ${count}verified ${primary} coupons.`
    case 'category':
      return `Compare ${primary.toLowerCase()} deals from Amazon, Best Buy, Target & more. Find ${count}discounts on top ${primary.toLowerCase()} products.`
    case 'best':
      return `Find the best ${primary.toLowerCase()} deals in ${year}. Compare prices from top retailers. Save up to 70% with verified discounts.`
    case 'price':
      return `Shop ${count}deals ${primary.toLowerCase()}. Compare prices from Amazon, Best Buy, Target & more. Updated hourly.`
    default:
      return `Find the best deals on ${primary}. Compare prices and save money with SaveSmart.`
  }
}

// Generate structured data for a collection page
export function generateCollectionSchema(
  name: string,
  description: string,
  url: string,
  deals: Deal[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: deals.length,
      itemListElement: deals.slice(0, 10).map((deal, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: deal.title,
          description: deal.description,
          offers: {
            "@type": "Offer",
            price: deal.deal_price,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: deal.affiliate_link,
          },
        },
      })),
    },
  }
}

// Generate store structured data
export function generateStoreSchema(
  storeName: string,
  url: string,
  rating: number,
  reviewCount: number,
  dealCount: number,
  minPrice: number,
  maxPrice: number
) {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    name: storeName,
    url,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount: reviewCount,
    },
    offers: {
      "@type": "AggregateOffer",
      offerCount: dealCount,
      lowPrice: minPrice,
      highPrice: maxPrice,
      priceCurrency: "USD",
    },
  }
}

// Generate FAQ structured data
export function generateFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

// Generate breadcrumb structured data
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// Parse price range from slug (e.g., "under-50" -> { max: 50 })
export function parsePriceRangeSlug(slug: string): { min?: number; max?: number } | null {
  // Handle "under-X" format
  const underMatch = slug.match(/^under-(\d+)$/)
  if (underMatch) {
    return { max: parseInt(underMatch[1], 10) }
  }
  
  // Handle "X-to-Y" format
  const rangeMatch = slug.match(/^(\d+)-to-(\d+)$/)
  if (rangeMatch) {
    return {
      min: parseInt(rangeMatch[1], 10),
      max: parseInt(rangeMatch[2], 10),
    }
  }
  
  // Handle "over-X" format
  const overMatch = slug.match(/^over-(\d+)$/)
  if (overMatch) {
    return { min: parseInt(overMatch[1], 10) }
  }
  
  return null
}

// Format price range for display
export function formatPriceRange(slug: string): string {
  const range = parsePriceRangeSlug(slug)
  if (!range) return slug
  
  if (range.max && !range.min) {
    return `Under $${range.max}`
  }
  if (range.min && range.max) {
    return `$${range.min} - $${range.max}`
  }
  if (range.min && !range.max) {
    return `Over $${range.min}`
  }
  return slug
}
