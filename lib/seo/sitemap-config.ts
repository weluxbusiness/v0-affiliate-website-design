// Sitemap configuration for scalable programmatic SEO
// Supports 100k+ pages with proper sitemap index splitting

import { brands, categories as dealCategories, priceRanges as dealPriceRanges, getTotalPageCount } from '@/data/deal-pages'

export const SITEMAP_CONFIG = {
  baseUrl: 'https://savesmart.bio',
  maxUrlsPerSitemap: 10000, // Google recommends max 50,000, we use 10,000 for performance
  
  // All known stores for programmatic pages
  stores: [
    'amazon', 'best-buy', 'nike', 'target', 'apple', 'dyson',
    'adidas', 'levis', 'walmart', 'costco', 'macys', 'nordstrom',
    'home-depot', 'lowes', 'wayfair', 'ikea', 'sephora', 'ulta',
    'gap', 'old-navy', 'banana-republic', 'jcrew', 'anthropologie',
    'urban-outfitters', 'asos', 'zappos', 'footlocker', 'dicks-sporting-goods',
    'rei', 'patagonia', 'the-north-face', 'columbia', 'under-armour',
    'puma', 'new-balance', 'converse', 'vans', 'timberland',
    'samsung', 'dell', 'hp', 'lenovo', 'microsoft', 'sony',
    'bose', 'beats', 'jbl', 'lg', 'tcl', 'hisense', 'vizio',
    'kohls', 'jcpenney', 'bloomingdales', 'neiman-marcus', 'saks',
    'williams-sonoma', 'crate-barrel', 'pottery-barn', 'west-elm',
    'bed-bath-beyond', 'overstock', 'target', 'michaels', 'hobby-lobby',
    'staples', 'office-depot', 'best-buy', 'gamestop', 'newark',
    'b-h-photo', 'adorama', 'guitar-center', 'sweetwater',
    'chewy', 'petco', 'petsmart', 'autozone', 'advance-auto', 'oreilys'
  ],
  
  // All product categories
  categories: [
    'electronics', 'fashion', 'home-kitchen', 'laptops', 'headphones',
    'sneakers', 'fitness', 'beauty', 'gaming', 'outdoor', 'kitchen',
    'tvs', 'smartphones', 'tablets', 'smartwatches', 'cameras',
    'speakers', 'monitors', 'printers', 'networking', 'storage',
    'jeans', 'jackets', 'shoes', 'bags', 'jewelry', 'watches',
    'furniture', 'bedding', 'decor', 'lighting', 'appliances',
    'cookware', 'bakeware', 'cutlery', 'small-appliances',
    'vitamins', 'skincare', 'makeup', 'haircare', 'fragrance',
    'running-shoes', 'basketball-shoes', 'training-shoes', 'casual-shoes',
    'mens-clothing', 'womens-clothing', 'kids-clothing',
    'office-supplies', 'school-supplies', 'arts-crafts',
    'pet-supplies', 'dog-food', 'cat-food', 'pet-toys',
    'car-accessories', 'car-electronics', 'car-care',
    'musical-instruments', 'audio-equipment', 'dj-equipment'
  ],
  
  // Best product categories for /best/[category] pages
  bestCategories: [
    'headphones', 'earbuds', 'laptops', 'macbooks', 'gaming-laptops',
    'tvs', 'oled-tvs', 'smartphones', 'iphones', 'smartwatches',
    'apple-watch', 'sneakers', 'running-shoes', 'jeans', 'jackets',
    'air-fryers', 'vacuums', 'coffee-makers', 'monitors', 'tablets', 'ipads',
    'gaming-chairs', 'keyboards', 'mice', 'webcams', 'microphones',
    'robot-vacuums', 'air-purifiers', 'humidifiers', 'fans',
    'mattresses', 'pillows', 'sheets', 'comforters', 'towels',
    'pots-pans', 'knife-sets', 'blenders', 'toasters', 'mixers',
    'wireless-earbuds', 'noise-canceling-headphones', 'gaming-headsets',
    'smart-home', 'smart-speakers', 'smart-lights', 'smart-plugs',
    'action-cameras', 'drones', 'security-cameras', 'doorbell-cameras'
  ],
  
  // Price ranges for /deals/price/[slug] pages
  priceRanges: [
    'under-10', 'under-20', 'under-25', 'under-50', 'under-100',
    'under-150', 'under-200', 'under-250', 'under-300', 'under-500',
    'under-750', 'under-1000', '50-to-100', '100-to-200', '200-to-500'
  ],
  
  // Static pages
  staticPages: [
    '', // homepage
    'deals',
    'deals/today', // Today's deals
    'latest-deals',
    'trending-deals',
    'deal-finder',
    'blog',
    'how-it-works',
    'help-center',
    'privacy-policy',
    'terms-of-service',
    'cookie-policy',
    'affiliate-disclosure',
    // Gaming section
    'gaming',
    'gaming/promo-codes',
    'gaming/today',
    'gaming/best-codes',
    'gaming/top-games',
    'gaming/free-rewards',
    'gaming/new-player-deals',
    'gaming/all-codes',
  ],
  
  // Gaming pages for sitemap
  gamingPages: [
    'gaming',
    'gaming/promo-codes',
    'gaming/today',
    'gaming/best-codes',
    'gaming/top-games',
    'gaming/free-rewards',
    'gaming/new-player-deals',
    'gaming/all-codes',
  ],
  
  // Today's deals entities (categories and brands)
  todayCategories: [
    'laptops', 'headphones', 'tvs', 'sneakers', 'smartphones',
    'gaming-consoles', 'vacuums', 'air-fryers', 'watches', 'tablets',
    'running-shoes', 'wireless-earbuds', 'monitors', 'gaming-laptops',
    'coffee-makers', 'robot-vacuums', 'smartwatches', 'cameras'
  ],
  
  todayBrands: [
    'amazon', 'nike', 'apple', 'samsung', 'sony', 'best-buy', 'target', 
    'walmart', 'adidas', 'dyson', 'bose', 'lg', 'dell', 'hp', 'lenovo',
    'microsoft', 'nintendo', 'playstation', 'kitchenaid', 'north-face'
  ]
}

// Generate all possible URL combinations for sitemaps
export function generateAllUrls(): {
  static: string[]
  stores: string[]
  coupons: string[]
  categories: string[]
  bestCategories: string[]
  storeCategories: string[]
  pricePages: string[]
  storePricePages: string[]
} {
  const { baseUrl, stores, categories, bestCategories, priceRanges, staticPages } = SITEMAP_CONFIG
  
  // Static pages
  const staticUrls = staticPages.map(page => 
    page ? `${baseUrl}/${page}` : baseUrl
  )
  
  // Store pages: /stores/[store]
  const storeUrls = stores.map(store => `${baseUrl}/stores/${store}`)
  
  // Coupon pages: /coupons/[store]
  const couponUrls = stores.map(store => `${baseUrl}/coupons/${store}`)
  
  // Category pages: /deals/[category]
  const categoryUrls = categories.map(cat => `${baseUrl}/deals/${cat}`)
  
  // Best category pages: /best/[category]
  const bestUrls = bestCategories.map(cat => `${baseUrl}/best/${cat}`)
  
  // Store + Category combinations: /stores/[store]/[category]
  const storeCategoryUrls: string[] = []
  for (const store of stores) {
    for (const category of categories.slice(0, 20)) { // Limit to top 20 categories per store
      storeCategoryUrls.push(`${baseUrl}/stores/${store}/${category}`)
    }
  }
  
  // Price range pages: /deals/price/[slug]
  const priceUrls = priceRanges.map(range => `${baseUrl}/deals/price/${range}`)
  
  // Store + Price combinations: /stores/[store]/price/[slug]
  const storePriceUrls: string[] = []
  for (const store of stores.slice(0, 30)) { // Top 30 stores
    for (const range of priceRanges.slice(0, 6)) { // Top 6 price ranges
      storePriceUrls.push(`${baseUrl}/stores/${store}/price/${range}`)
    }
  }
  
  return {
    static: staticUrls,
    stores: storeUrls,
    coupons: couponUrls,
    categories: categoryUrls,
    bestCategories: bestUrls,
    storeCategories: storeCategoryUrls,
    pricePages: priceUrls,
    storePricePages: storePriceUrls,
  }
}

// Get total URL count for sitemap index planning
export function getTotalUrlCount(): number {
  const urls = generateAllUrls()
  return Object.values(urls).reduce((total, arr) => total + arr.length, 0)
}

// Generate sitemap XML for a list of URLs
export function generateSitemapXml(urls: string[], priority: number = 0.7): string {
  const now = new Date().toISOString().split('T')[0]
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`
}

// Generate sitemap index XML
export function generateSitemapIndexXml(sitemapUrls: string[]): string {
  const now = new Date().toISOString().split('T')[0]
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(url => `  <sitemap>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`
}

// ============================================
// PROGRAMMATIC SEO PAGES (50k+)
// ============================================

/**
 * Generate all brand × price and category × price URLs
 * e.g., /deals/seo/amazon-under-50, /deals/seo/laptops-under-500
 */
export function generateSeoPageUrls(): string[] {
  const { baseUrl } = SITEMAP_CONFIG
  const urls: string[] = []
  
  // Brand × Price combinations
  for (const brand of brands) {
    for (const price of dealPriceRanges) {
      urls.push(`${baseUrl}/deals/seo/${brand}-under-${price}`)
    }
  }
  
  // Category × Price combinations
  for (const category of dealCategories) {
    for (const price of dealPriceRanges) {
      urls.push(`${baseUrl}/deals/seo/${category}-under-${price}`)
    }
  }
  
  return urls
}

/**
 * Get SEO page count breakdown
 */
export function getSeoPageStats(): {
  brandPages: number
  categoryPages: number
  total: number
  breakdown: string
} {
  const stats = getTotalPageCount()
  return {
    ...stats,
    breakdown: `${brands.length} brands × ${dealPriceRanges.length} prices = ${stats.brandPages} pages\n${dealCategories.length} categories × ${dealPriceRanges.length} prices = ${stats.categoryPages} pages\nTotal: ${stats.total} programmatic SEO pages`
  }
}

/**
 * Generate all URLs including programmatic SEO pages
 */
export function generateAllUrlsWithSeo(): {
  static: string[]
  stores: string[]
  coupons: string[]
  categories: string[]
  bestCategories: string[]
  storeCategories: string[]
  pricePages: string[]
  storePricePages: string[]
  seoPages: string[]
} {
  const baseUrls = generateAllUrls()
  const seoUrls = generateSeoPageUrls()
  
  return {
    ...baseUrls,
    seoPages: seoUrls,
  }
}

/**
 * Get total URL count including programmatic SEO pages
 */
export function getTotalUrlCountWithSeo(): {
  base: number
  seo: number
  total: number
} {
  const baseCount = getTotalUrlCount()
  const seoCount = getTotalPageCount().total
  
  return {
    base: baseCount,
    seo: seoCount,
    total: baseCount + seoCount
  }
}

/**
 * Split URLs into multiple sitemaps (max 50k URLs each for Google)
 */
export function splitUrlsIntoSitemaps(urls: string[], maxPerSitemap = 10000): string[][] {
  const sitemaps: string[][] = []
  
  for (let i = 0; i < urls.length; i += maxPerSitemap) {
    sitemaps.push(urls.slice(i, i + maxPerSitemap))
  }
  
  return sitemaps
}
