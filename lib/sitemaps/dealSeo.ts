/**
 * Shared utilities for /deals/seo/* sitemap generation
 * Used by route handlers and other modules
 */
import { 
  brands, 
  categories, 
  priceRanges,
  getTotalPageCount,
} from '@/data/deal-pages'

const baseUrl = 'https://savesmart.bio'
export const MAX_URLS_PER_SITEMAP = 5000

/**
 * Generate all /deals/seo/* URLs from the dataset
 */
export function generateAllDealSeoUrls(): string[] {
  const urls: string[] = []
  
  // Brand × Price combinations
  for (const brand of brands) {
    for (const price of priceRanges) {
      urls.push(`${baseUrl}/deals/seo/${brand}-under-${price}`)
    }
  }
  
  // Category × Price combinations
  for (const category of categories) {
    for (const price of priceRanges) {
      urls.push(`${baseUrl}/deals/seo/${category}-under-${price}`)
    }
  }
  
  return urls
}

/**
 * Get a paginated slice of URLs for sub-sitemaps
 */
export function getDealSeoUrlsSlice(page: number): string[] {
  const allUrls = generateAllDealSeoUrls()
  const start = (page - 1) * MAX_URLS_PER_SITEMAP
  const end = start + MAX_URLS_PER_SITEMAP
  return allUrls.slice(start, end)
}

/**
 * Get statistics about the sitemap
 */
export function getDealSeoSitemapStats() {
  const { brandPages, categoryPages, total } = getTotalPageCount()
  const sitemapCount = Math.ceil(total / MAX_URLS_PER_SITEMAP)
  
  return {
    brandPages,
    categoryPages,
    total,
    sitemapCount,
    maxPerSitemap: MAX_URLS_PER_SITEMAP,
    brands: brands.length,
    categories: categories.length,
    priceRanges: priceRanges.length,
  }
}
