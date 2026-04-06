/**
 * SEO Route Utilities
 * Handles flat URL patterns for optimal search engine rankings
 * Example: /raid-shadow-legends-working-codes instead of /gaming/raid-shadow-legends/working-codes
 */

import { getAllGameSlugs } from "@/lib/gaming-data"

// HIGH-VALUE SEO page types only (reduced from 5 to 2 for better indexing)
// These are the only pages that should be indexed by Google
export type SeoPageType = 'codes' | 'redeem-codes'

export const SEO_PAGE_TYPES: SeoPageType[] = [
  'codes',        // Main codes page - targets "[game] codes" searches
  'redeem-codes', // Redeem guide - targets "how to redeem [game] codes" searches
]

// Low-value page types that should be noindexed or removed
// These create index bloat and thin content issues
export type LowValuePageType = 'codes-today' | 'working-codes' | 'new-codes' | 'free-rewards'

export const LOW_VALUE_PAGE_TYPES: LowValuePageType[] = [
  'codes-today',
  'working-codes',
  'new-codes',
  'free-rewards',
]

// Blog/Guide page types - NOINDEXED (thin content, duplicate)
// Keeping for backward compatibility but not indexing
export type BlogPageType = 'how-to-get-free-rewards' | 'tips-and-tricks' | 'beginner-guide' | 'how-to-level-up-fast' | 'best-strategies'

export const BLOG_PAGE_TYPES: BlogPageType[] = [
  'how-to-get-free-rewards',
  'tips-and-tricks',
  'beginner-guide',
  'how-to-level-up-fast',
  'best-strategies',
]

// Combined type for all flat SEO pages (for routing purposes)
export type AllSeoPageType = SeoPageType | LowValuePageType | BlogPageType

export const ALL_SEO_PAGE_TYPES: AllSeoPageType[] = [
  ...SEO_PAGE_TYPES,
  ...LOW_VALUE_PAGE_TYPES,
  ...BLOG_PAGE_TYPES,
]

/**
 * Parse a flat SEO slug like "raid-shadow-legends-codes"
 * Returns the game slug and page type
 * Only matches HIGH-VALUE page types (codes, redeem-codes)
 */
export function parseSeoSlug(slug: string): { gameSlug: string; pageType: SeoPageType } | null {
  const gameSlugs = getAllGameSlugs()
  
  // Sort by length descending to match longer slugs first
  // This prevents "raid" from matching before "raid-shadow-legends"
  const sortedSlugs = [...gameSlugs].sort((a, b) => b.length - a.length)
  
  for (const gameSlug of sortedSlugs) {
    for (const pageType of SEO_PAGE_TYPES) {
      const expectedSlug = `${gameSlug}-${pageType}`
      if (slug === expectedSlug) {
        return { gameSlug, pageType }
      }
    }
  }
  
  return null
}

/**
 * Parse a low-value SEO slug (for redirect handling)
 * Returns the game slug and page type for low-value pages
 */
export function parseLowValueSlug(slug: string): { gameSlug: string; pageType: LowValuePageType } | null {
  const gameSlugs = getAllGameSlugs()
  const sortedSlugs = [...gameSlugs].sort((a, b) => b.length - a.length)
  
  for (const gameSlug of sortedSlugs) {
    for (const pageType of LOW_VALUE_PAGE_TYPES) {
      const expectedSlug = `${gameSlug}-${pageType}`
      if (slug === expectedSlug) {
        return { gameSlug, pageType }
      }
    }
  }
  
  return null
}

/**
 * Check if a slug should be noindexed
 * Returns true for low-value and blog pages
 */
export function shouldNoindex(slug: string): boolean {
  const lowValueParsed = parseLowValueSlug(slug)
  const blogParsed = parseBlogSlug(slug)
  return !!(lowValueParsed || blogParsed)
}

/**
 * Parse a flat blog slug like "raid-shadow-legends-beginner-guide"
 * Returns the game slug and blog page type
 */
export function parseBlogSlug(slug: string): { gameSlug: string; pageType: BlogPageType } | null {
  const gameSlugs = getAllGameSlugs()
  
  // Sort by length descending to match longer slugs first
  const sortedSlugs = [...gameSlugs].sort((a, b) => b.length - a.length)
  
  for (const gameSlug of sortedSlugs) {
    for (const pageType of BLOG_PAGE_TYPES) {
      const expectedSlug = `${gameSlug}-${pageType}`
      if (slug === expectedSlug) {
        return { gameSlug, pageType }
      }
    }
  }
  
  return null
}

/**
 * Check if a slug is a blog page type
 */
export function isBlogPageType(pageType: string): pageType is BlogPageType {
  return BLOG_PAGE_TYPES.includes(pageType as BlogPageType)
}

/**
 * Check if a slug is an SEO (promo code) page type
 */
export function isSeoPageType(pageType: string): pageType is SeoPageType {
  return SEO_PAGE_TYPES.includes(pageType as SeoPageType)
}

/**
 * Generate flat SEO URL for a game and page type
 */
export function getSeoUrl(gameSlug: string, pageType: SeoPageType): string {
  return `/${gameSlug}-${pageType}`
}

/**
 * Generate flat blog URL for a game and blog page type
 */
export function getBlogUrl(gameSlug: string, pageType: BlogPageType): string {
  return `/${gameSlug}-${pageType}`
}

/**
 * Get canonical URL for SEO pages (flat version)
 */
export function getCanonicalUrl(gameSlug: string, pageType: SeoPageType | BlogPageType): string {
  return `https://savesmart.bio/${gameSlug}-${pageType}`
}

/**
 * Generate all flat SEO slugs for static params (promo code pages only)
 */
export function generateAllSeoSlugs(): { slug: string }[] {
  const gameSlugs = getAllGameSlugs()
  const params: { slug: string }[] = []
  
  for (const gameSlug of gameSlugs) {
    for (const pageType of SEO_PAGE_TYPES) {
      params.push({ slug: `${gameSlug}-${pageType}` })
    }
  }
  
  return params
}

/**
 * Generate all flat blog slugs for static params
 */
export function generateAllBlogSlugs(): { slug: string }[] {
  const gameSlugs = getAllGameSlugs()
  const params: { slug: string }[] = []
  
  for (const gameSlug of gameSlugs) {
    for (const pageType of BLOG_PAGE_TYPES) {
      params.push({ slug: `${gameSlug}-${pageType}` })
    }
  }
  
  return params
}

/**
 * Get nested URL from flat URL (for internal reference)
 */
export function getNestedUrl(gameSlug: string, pageType: SeoPageType): string {
  return `/gaming/${gameSlug}/${pageType}`
}
