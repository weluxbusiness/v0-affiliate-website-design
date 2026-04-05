/**
 * SEO Route Utilities
 * Handles flat URL patterns for optimal search engine rankings
 * Example: /raid-shadow-legends-working-codes instead of /gaming/raid-shadow-legends/working-codes
 */

import { getAllGameSlugs } from "@/lib/gaming-data"

// All SEO page variations (promo code focused)
export type SeoPageType = 'codes-today' | 'working-codes' | 'new-codes' | 'free-rewards' | 'redeem-codes'

export const SEO_PAGE_TYPES: SeoPageType[] = [
  'codes-today',
  'working-codes', 
  'new-codes',
  'free-rewards',
  'redeem-codes',
]

// Blog/Guide page types (informational content for topical authority)
export type BlogPageType = 'how-to-get-free-rewards' | 'tips-and-tricks' | 'beginner-guide' | 'how-to-level-up-fast' | 'best-strategies'

export const BLOG_PAGE_TYPES: BlogPageType[] = [
  'how-to-get-free-rewards',
  'tips-and-tricks',
  'beginner-guide',
  'how-to-level-up-fast',
  'best-strategies',
]

// Combined type for all flat SEO pages
export type AllSeoPageType = SeoPageType | BlogPageType

export const ALL_SEO_PAGE_TYPES: AllSeoPageType[] = [
  ...SEO_PAGE_TYPES,
  ...BLOG_PAGE_TYPES,
]

/**
 * Parse a flat SEO slug like "raid-shadow-legends-working-codes"
 * Returns the game slug and page type
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
