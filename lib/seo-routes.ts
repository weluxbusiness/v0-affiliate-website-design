/**
 * SEO Route Utilities
 * Handles flat URL patterns for optimal search engine rankings
 * Example: /raid-shadow-legends-working-codes instead of /gaming/raid-shadow-legends/working-codes
 */

import { getAllGameSlugs } from "@/lib/gaming-data"

// All SEO page variations
export type SeoPageType = 'codes-today' | 'working-codes' | 'new-codes' | 'free-rewards' | 'redeem-codes'

export const SEO_PAGE_TYPES: SeoPageType[] = [
  'codes-today',
  'working-codes', 
  'new-codes',
  'free-rewards',
  'redeem-codes',
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
 * Generate flat SEO URL for a game and page type
 */
export function getSeoUrl(gameSlug: string, pageType: SeoPageType): string {
  return `/${gameSlug}-${pageType}`
}

/**
 * Get canonical URL for SEO pages (flat version)
 */
export function getCanonicalUrl(gameSlug: string, pageType: SeoPageType): string {
  return `https://savesmart.bio/${gameSlug}-${pageType}`
}

/**
 * Generate all flat SEO slugs for static params
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
 * Get nested URL from flat URL (for internal reference)
 */
export function getNestedUrl(gameSlug: string, pageType: SeoPageType): string {
  return `/gaming/${gameSlug}/${pageType}`
}
