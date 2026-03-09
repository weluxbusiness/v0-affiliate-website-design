/**
 * Programmatic SEO Path Generator
 * Generates valid URL combinations for 100k+ SEO landing pages
 * Only produces paths where content/deals actually exist
 */

import { cities, getPopularCities } from '@/lib/cities'
import { getCategorySlugs, getBrandSlugs, getStoreSlugs } from '@/lib/seo-data'

// ============================================
// CONFIGURATION
// ============================================

export const SEO_CONFIG = {
  // Max URLs per sitemap (Google limit is 50k)
  MAX_URLS_PER_SITEMAP: 50000,
  
  // Default limits for static generation (ISR handles the rest)
  STATIC_CATEGORIES: 30,
  STATIC_BRANDS: 20,
  STATIC_STORES: 20,
  STATIC_CITIES: 50,
  
  // Crawl budget optimization
  MIN_DEALS_FOR_INDEX: 3,
  MAX_PAGINATION_DEPTH: 5,
  MAX_URL_DEPTH: 4,
}

// Price ranges for filtering
export const PRICE_RANGES = [
  { slug: 'under-25', min: 0, max: 25, label: 'Under $25' },
  { slug: 'under-50', min: 0, max: 50, label: 'Under $50' },
  { slug: 'under-100', min: 0, max: 100, label: 'Under $100' },
  { slug: 'under-200', min: 0, max: 200, label: 'Under $200' },
  { slug: 'under-500', min: 0, max: 500, label: 'Under $500' },
  { slug: 'under-1000', min: 0, max: 1000, label: 'Under $1000' },
  { slug: '100-to-500', min: 100, max: 500, label: '$100-$500' },
  { slug: '500-to-1000', min: 500, max: 1000, label: '$500-$1000' },
  { slug: 'over-1000', min: 1000, max: Infinity, label: 'Over $1000' },
]

// Discount ranges for filtering
export const DISCOUNT_RANGES = [
  { slug: 'discount-10', min: 10, label: '10%+ Off' },
  { slug: 'discount-20', min: 20, label: '20%+ Off' },
  { slug: 'discount-30', min: 30, label: '30%+ Off' },
  { slug: 'discount-40', min: 40, label: '40%+ Off' },
  { slug: 'discount-50', min: 50, label: '50%+ Off' },
]

// Seasonal events
export const SEASONAL_EVENTS = [
  { slug: 'black-friday', name: 'Black Friday', months: [11] },
  { slug: 'cyber-monday', name: 'Cyber Monday', months: [11] },
  { slug: 'prime-day', name: 'Prime Day', months: [7, 10] },
  { slug: 'memorial-day', name: 'Memorial Day', months: [5] },
  { slug: 'labor-day', name: 'Labor Day', months: [9] },
  { slug: 'back-to-school', name: 'Back to School', months: [8, 9] },
  { slug: 'holiday-deals', name: 'Holiday Deals', months: [12] },
]

// ============================================
// PATH GENERATION TYPES
// ============================================

export interface GeneratedPath {
  path: string
  type: PathType
  priority: number
  depth: number
  params: Record<string, string>
}

export type PathType = 
  | 'category'
  | 'category-city'
  | 'category-brand'
  | 'category-brand-store'
  | 'store'
  | 'store-category'
  | 'brand'
  | 'brand-category'
  | 'price-range'
  | 'discount-range'
  | 'seasonal'
  | 'comparison'
  | 'best'

// ============================================
// PATH GENERATORS
// ============================================

/**
 * Generate all category paths
 */
export async function generateCategoryPaths(): Promise<GeneratedPath[]> {
  const categories = await getCategorySlugs()
  return categories.map(category => ({
    path: `/deals/${category}`,
    type: 'category' as PathType,
    priority: 0.9,
    depth: 1,
    params: { category },
  }))
}

/**
 * Generate category × city paths
 */
export async function generateCategoryCityPaths(limit?: number): Promise<GeneratedPath[]> {
  const categories = await getCategorySlugs()
  const allCities = limit ? getPopularCities(limit) : cities
  
  const paths: GeneratedPath[] = []
  for (const category of categories) {
    for (const city of allCities) {
      paths.push({
        path: `/deals/${category}/city/${city}`,
        type: 'category-city',
        priority: 0.6,
        depth: 3,
        params: { category, city },
      })
    }
  }
  return paths
}

/**
 * Generate category × brand paths
 */
export async function generateCategoryBrandPaths(): Promise<GeneratedPath[]> {
  const categories = await getCategorySlugs()
  const brands = await getBrandSlugs()
  
  const paths: GeneratedPath[] = []
  for (const category of categories) {
    for (const brand of brands) {
      paths.push({
        path: `/deals/${category}/${brand}`,
        type: 'category-brand',
        priority: 0.7,
        depth: 2,
        params: { category, brand },
      })
    }
  }
  return paths
}

/**
 * Generate category × brand × store paths
 */
export async function generateCategoryBrandStorePaths(): Promise<GeneratedPath[]> {
  const categories = await getCategorySlugs()
  const brands = await getBrandSlugs()
  const stores = await getStoreSlugs()
  
  const paths: GeneratedPath[] = []
  for (const category of categories.slice(0, 15)) {
    for (const brand of brands.slice(0, 10)) {
      for (const store of stores.slice(0, 10)) {
        paths.push({
          path: `/deals/${category}/${brand}/${store}`,
          type: 'category-brand-store',
          priority: 0.5,
          depth: 3,
          params: { category, brand, store },
        })
      }
    }
  }
  return paths
}

/**
 * Generate store paths
 */
export async function generateStorePaths(): Promise<GeneratedPath[]> {
  const stores = await getStoreSlugs()
  return stores.map(store => ({
    path: `/stores/${store}`,
    type: 'store' as PathType,
    priority: 0.8,
    depth: 1,
    params: { store },
  }))
}

/**
 * Generate store × category paths
 */
export async function generateStoreCategoryPaths(): Promise<GeneratedPath[]> {
  const stores = await getStoreSlugs()
  const categories = await getCategorySlugs()
  
  const paths: GeneratedPath[] = []
  for (const store of stores) {
    for (const category of categories) {
      paths.push({
        path: `/stores/${store}/${category}`,
        type: 'store-category',
        priority: 0.6,
        depth: 2,
        params: { store, category },
      })
    }
  }
  return paths
}

/**
 * Generate brand paths
 */
export async function generateBrandPaths(): Promise<GeneratedPath[]> {
  const brands = await getBrandSlugs()
  return brands.map(brand => ({
    path: `/brands/${brand}`,
    type: 'brand' as PathType,
    priority: 0.8,
    depth: 1,
    params: { brand },
  }))
}

/**
 * Generate brand × category paths
 */
export async function generateBrandCategoryPaths(): Promise<GeneratedPath[]> {
  const brands = await getBrandSlugs()
  const categories = await getCategorySlugs()
  
  const paths: GeneratedPath[] = []
  for (const brand of brands) {
    for (const category of categories) {
      paths.push({
        path: `/brands/${brand}/${category}`,
        type: 'brand-category',
        priority: 0.6,
        depth: 2,
        params: { brand, category },
      })
    }
  }
  return paths
}

/**
 * Generate price range paths
 */
export function generatePriceRangePaths(): GeneratedPath[] {
  return PRICE_RANGES.map(range => ({
    path: `/deals/price/${range.slug}`,
    type: 'price-range' as PathType,
    priority: 0.5,
    depth: 2,
    params: { slug: range.slug },
  }))
}

/**
 * Generate comparison paths
 */
export async function generateComparisonPaths(): Promise<GeneratedPath[]> {
  const brands = await getBrandSlugs()
  
  // Generate popular brand comparisons
  const popularBrands = brands.slice(0, 20)
  const paths: GeneratedPath[] = []
  
  for (let i = 0; i < popularBrands.length; i++) {
    for (let j = i + 1; j < popularBrands.length; j++) {
      paths.push({
        path: `/compare/${popularBrands[i]}-vs-${popularBrands[j]}`,
        type: 'comparison',
        priority: 0.5,
        depth: 1,
        params: { slug: `${popularBrands[i]}-vs-${popularBrands[j]}` },
      })
    }
  }
  
  return paths
}

/**
 * Generate best deals paths
 */
export async function generateBestDealsPaths(): Promise<GeneratedPath[]> {
  const categories = await getCategorySlugs()
  const brands = await getBrandSlugs()
  const stores = await getStoreSlugs()
  
  const paths: GeneratedPath[] = []
  
  // /best/[category]
  for (const category of categories) {
    paths.push({
      path: `/best/${category}`,
      type: 'best',
      priority: 0.7,
      depth: 1,
      params: { category },
    })
  }
  
  // /best/[category]/[brand]
  for (const category of categories.slice(0, 15)) {
    for (const brand of brands.slice(0, 10)) {
      paths.push({
        path: `/best/${category}/${brand}`,
        type: 'best',
        priority: 0.6,
        depth: 2,
        params: { category, brand },
      })
    }
  }
  
  // /best/[category]/[brand]/[store]
  for (const category of categories.slice(0, 10)) {
    for (const brand of brands.slice(0, 5)) {
      for (const store of stores.slice(0, 5)) {
        paths.push({
          path: `/best/${category}/${brand}/${store}`,
          type: 'best',
          priority: 0.5,
          depth: 3,
          params: { category, brand, store },
        })
      }
    }
  }
  
  return paths
}

// ============================================
// AGGREGATE GENERATORS
// ============================================

/**
 * Generate all SEO paths with counts
 */
export async function generateAllPaths(): Promise<{
  paths: GeneratedPath[]
  counts: Record<PathType, number>
  total: number
}> {
  const [
    categoryPaths,
    categoryCityPaths,
    categoryBrandPaths,
    categoryBrandStorePaths,
    storePaths,
    storeCategoryPaths,
    brandPaths,
    brandCategoryPaths,
    priceRangePaths,
    comparisonPaths,
    bestPaths,
  ] = await Promise.all([
    generateCategoryPaths(),
    generateCategoryCityPaths(),
    generateCategoryBrandPaths(),
    generateCategoryBrandStorePaths(),
    generateStorePaths(),
    generateStoreCategoryPaths(),
    generateBrandPaths(),
    generateBrandCategoryPaths(),
    Promise.resolve(generatePriceRangePaths()),
    generateComparisonPaths(),
    generateBestDealsPaths(),
  ])
  
  const allPaths = [
    ...categoryPaths,
    ...categoryCityPaths,
    ...categoryBrandPaths,
    ...categoryBrandStorePaths,
    ...storePaths,
    ...storeCategoryPaths,
    ...brandPaths,
    ...brandCategoryPaths,
    ...priceRangePaths,
    ...comparisonPaths,
    ...bestPaths,
  ]
  
  const counts: Record<PathType, number> = {
    'category': categoryPaths.length,
    'category-city': categoryCityPaths.length,
    'category-brand': categoryBrandPaths.length,
    'category-brand-store': categoryBrandStorePaths.length,
    'store': storePaths.length,
    'store-category': storeCategoryPaths.length,
    'brand': brandPaths.length,
    'brand-category': brandCategoryPaths.length,
    'price-range': priceRangePaths.length,
    'discount-range': 0,
    'seasonal': 0,
    'comparison': comparisonPaths.length,
    'best': bestPaths.length,
  }
  
  return {
    paths: allPaths,
    counts,
    total: allPaths.length,
  }
}

/**
 * Calculate theoretical maximum page count
 */
export async function calculateMaxPageCount(): Promise<{
  theoretical: Record<string, number>
  total: number
  breakdown: string[]
}> {
  const categories = await getCategorySlugs()
  const brands = await getBrandSlugs()
  const stores = await getStoreSlugs()
  const cityCount = cities.length
  
  const catCount = categories.length || 60
  const brandCount = brands.length || 45
  const storeCount = stores.length || 60
  
  const theoretical = {
    'Category pages': catCount,
    'Category × City': catCount * cityCount,
    'Category × Brand': catCount * brandCount,
    'Category × Brand × Store': catCount * brandCount * storeCount,
    'Store pages': storeCount,
    'Store × Category': storeCount * catCount,
    'Brand pages': brandCount,
    'Brand × Category': brandCount * catCount,
    'Price range pages': PRICE_RANGES.length,
    'Best deals': catCount + (catCount * brandCount) + (catCount * brandCount * storeCount / 10),
    'Comparison pages': (brandCount * (brandCount - 1)) / 2,
  }
  
  const total = Object.values(theoretical).reduce((sum, count) => sum + count, 0)
  
  const breakdown = Object.entries(theoretical).map(
    ([name, count]) => `${name}: ${count.toLocaleString()} pages`
  )
  
  return { theoretical, total, breakdown }
}

// ============================================
// SEO REPORT GENERATOR
// ============================================

export interface SEOReport {
  generatedAt: string
  totalPages: number
  pagesByType: Record<string, number>
  crawlDepthAnalysis: {
    depth1: number
    depth2: number
    depth3: number
    depth4Plus: number
  }
  thinPageRisk: string[]
  sitemapCoverage: {
    covered: number
    total: number
    percentage: number
  }
  recommendations: string[]
}

export async function generateSEOReport(): Promise<SEOReport> {
  const { paths, counts, total } = await generateAllPaths()
  const maxPages = await calculateMaxPageCount()
  
  // Calculate crawl depth distribution
  const crawlDepthAnalysis = {
    depth1: paths.filter(p => p.depth === 1).length,
    depth2: paths.filter(p => p.depth === 2).length,
    depth3: paths.filter(p => p.depth === 3).length,
    depth4Plus: paths.filter(p => p.depth >= 4).length,
  }
  
  // Identify thin page risks
  const thinPageRisks: string[] = []
  if (counts['category-brand-store'] > 1000) {
    thinPageRisks.push(`${counts['category-brand-store']} category-brand-store pages - many may have < 3 deals`)
  }
  if (counts['category-city'] > 5000) {
    thinPageRisks.push(`${counts['category-city']} city pages - national deals shown with local messaging`)
  }
  
  // Generate recommendations
  const recommendations: string[] = [
    'Ensure all pages with < 3 deals have noindex directive',
    'Monitor Google Search Console for crawl errors',
    'Prioritize high-priority pages in sitemap',
    'Add internal links from high-authority pages to new programmatic pages',
  ]
  
  if (total > 50000) {
    recommendations.push('Split sitemaps into multiple files (50k limit per sitemap)')
  }
  
  if (crawlDepthAnalysis.depth4Plus > 0) {
    recommendations.push('Consider reducing URL depth for better crawlability')
  }
  
  return {
    generatedAt: new Date().toISOString(),
    totalPages: total,
    pagesByType: counts,
    crawlDepthAnalysis,
    thinPageRisk: thinPageRisks,
    sitemapCoverage: {
      covered: Math.min(total, 50000 * 10), // 10 sitemaps max
      total,
      percentage: Math.min(100, (50000 * 10 / total) * 100),
    },
    recommendations,
  }
}
