/**
 * Centralized SEO metadata defaults and utilities
 * Ensures consistent indexing, canonicals, and Open Graph across all pages
 */

import type { Metadata } from 'next'

// Site-wide constants
export const SITE_URL = 'https://savesmart.bio'
export const SITE_NAME = 'SaveSmart'
export const SITE_TAGLINE = 'Save Money Automatically While Shopping Online'
export const DEFAULT_OG_IMAGE = '/social-preview.png'

// Default robots configuration - ALL pages should be indexable by default
export const DEFAULT_ROBOTS = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-video-preview': -1,
    'max-image-preview': 'large' as const,
    'max-snippet': -1,
  },
}

// Default Open Graph configuration
export const DEFAULT_OG = {
  type: 'website' as const,
  locale: 'en_US',
  siteName: SITE_NAME,
  images: [
    {
      url: DEFAULT_OG_IMAGE,
      width: 1200,
      height: 630,
      alt: 'SaveSmart – Find the Best Deals Online',
    },
  ],
}

// Default Twitter card configuration
export const DEFAULT_TWITTER = {
  card: 'summary_large_image' as const,
  creator: '@savesmart',
}

/**
 * Generate a canonical URL for a page
 * Always returns absolute URL for proper canonical handling
 */
export function getCanonicalUrl(path: string): string {
  // Remove trailing slashes and ensure starts with /
  const cleanPath = path.replace(/\/+$/, '').replace(/^([^/])/, '/$1')
  // For homepage, return base URL without trailing slash
  if (cleanPath === '' || cleanPath === '/') {
    return SITE_URL
  }
  return `${SITE_URL}${cleanPath}`
}

/**
 * Generate alternates metadata with canonical URL
 */
export function getAlternates(path: string) {
  return {
    canonical: getCanonicalUrl(path),
  }
}

/**
 * Generate current date strings for SEO content
 */
export function getCurrentDateStrings() {
  const now = new Date()
  return {
    month: now.toLocaleString('en-US', { month: 'long' }),
    shortMonth: now.toLocaleString('en-US', { month: 'short' }),
    year: now.getFullYear(),
    day: now.getDate(),
    monthYear: `${now.toLocaleString('en-US', { month: 'long' })} ${now.getFullYear()}`,
    shortMonthYear: `${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()}`,
    isoDate: now.toISOString(),
  }
}

/**
 * Generate SEO-optimized metadata for a page
 * Ensures all required fields are present with proper defaults
 */
export function generatePageMetadata({
  title,
  description,
  path,
  keywords = [],
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  noIndex = false,
}: {
  title: string
  description: string
  path: string
  keywords?: string[]
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  noIndex?: boolean
}): Metadata {
  const canonicalUrl = getCanonicalUrl(path)

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      ...DEFAULT_OG,
      type: ogType,
      title: ogTitle || title,
      description: ogDescription || description,
      url: canonicalUrl,
      ...(ogImage && {
        images: [
          {
            url: ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`,
            width: 1200,
            height: 630,
            alt: ogTitle || title,
          },
        ],
      }),
    },
    twitter: {
      ...DEFAULT_TWITTER,
      title: ogTitle || title,
      description: ogDescription || description,
      images: ogImage ? [ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`] : [DEFAULT_OG_IMAGE],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : DEFAULT_ROBOTS,
  }
}

/**
 * Generate metadata for deals/category pages
 */
export function generateDealsMetadata({
  categoryName,
  path,
  dealCount = 0,
  storeName,
  brandName,
}: {
  categoryName: string
  path: string
  dealCount?: number
  storeName?: string
  brandName?: string
}): Metadata {
  const { month, year } = getCurrentDateStrings()
  const lowerCategory = categoryName.toLowerCase()

  // Build title based on context
  let title: string
  let description: string

  if (storeName && brandName) {
    title = `${brandName} ${categoryName} at ${storeName} – ${month} ${year} Deals`
    description = `Shop ${brandName} ${lowerCategory} deals at ${storeName}. ${dealCount} verified discounts available. Save up to 70% on ${lowerCategory} today!`
  } else if (storeName) {
    title = `${storeName} ${categoryName} Deals – ${month} ${year} | Up to 70% Off`
    description = `${dealCount}+ ${lowerCategory} deals at ${storeName}. Compare prices and save with verified coupons. Updated hourly!`
  } else if (brandName) {
    title = `${brandName} ${categoryName} Deals – ${month} ${year} | Best Prices`
    description = `Find the best ${brandName} ${lowerCategory} deals. ${dealCount} offers from top retailers. Save up to 70%!`
  } else {
    title = `${categoryName} Deals ${month} ${year} – Save 50-70% Today | Limited Time`
    description = `Best ${lowerCategory} deals ending soon! Compare prices from Amazon, Best Buy, Target & Walmart. ${dealCount} verified coupons available.`
  }

  const keywords = [
    `${lowerCategory} deals`,
    `${lowerCategory} deals ${year}`,
    `${lowerCategory} sale`,
    `${lowerCategory} discount`,
    `${lowerCategory} coupon codes`,
    `cheap ${lowerCategory}`,
    `${lowerCategory} deals ${month.toLowerCase()} ${year}`,
    ...(storeName ? [`${storeName.toLowerCase()} ${lowerCategory} deals`] : []),
    ...(brandName ? [`${brandName.toLowerCase()} ${lowerCategory} deals`] : []),
  ]

  return generatePageMetadata({
    title,
    description,
    path,
    keywords,
    ogTitle: title,
    ogDescription: description,
  })
}

/**
 * Generate metadata for gaming pages
 */
export function generateGamingMetadata({
  gameName,
  gameSlug,
  codeCount = 0,
  pageType = 'main',
  customTitle,
  customDescription,
}: {
  gameName: string
  gameSlug: string
  codeCount?: number
  pageType?: 'main' | 'codes-today' | 'monthly' | 'guide' | 'tips'
  customTitle?: string
  customDescription?: string
}): Metadata {
  const { month, year } = getCurrentDateStrings()

  let path: string
  let title: string
  let description: string

  switch (pageType) {
    case 'codes-today':
      path = `/gaming/${gameSlug}/codes-today`
      title = customTitle || `${gameName} Codes Today (${month} ${year}) – ${codeCount} Working Codes`
      description = customDescription || `${codeCount} working ${gameName} codes updated today. Get FREE rewards, gems & exclusive items. Verified and working!`
      break
    case 'monthly':
      path = `/gaming/${gameSlug}`
      title = customTitle || `${gameName} Codes (${month} ${year}) – ${codeCount} Working Codes + Free Rewards`
      description = customDescription || `${codeCount} verified ${gameName} codes for ${month} ${year}. Updated today with working codes. Redeem for FREE rewards!`
      break
    case 'guide':
      path = `/gaming/${gameSlug}-guide`
      title = customTitle || `${gameName} Guide ${year} – Tips, Tricks & Strategies`
      description = customDescription || `Complete ${gameName} guide with tips, tricks, and strategies. Learn how to progress faster and get more rewards!`
      break
    case 'tips':
      path = `/gaming/${gameSlug}-tips`
      title = customTitle || `${gameName} Tips & Tricks ${year} – Pro Strategies`
      description = customDescription || `Pro tips and tricks for ${gameName}. Master the game with our expert strategies and guides!`
      break
    default:
      path = `/gaming/${gameSlug}`
      title = customTitle || `${gameName} Codes (${month} ${year}) – ${codeCount} Working Codes + Free Rewards`
      description = customDescription || `${codeCount} working ${gameName} codes for ${month} ${year}. Updated today with verified codes. Redeem for FREE rewards, gems & exclusive items!`
  }

  const keywords = [
    `${gameName} promo codes`,
    `${gameName} codes`,
    `${gameName} redeem codes`,
    `${gameName} codes ${year}`,
    `${gameName} codes ${month.toLowerCase()} ${year}`,
    `${gameName} codes today`,
    `${gameName} free rewards`,
    `working ${gameName} codes`,
  ]

  return generatePageMetadata({
    title,
    description,
    path,
    keywords,
    ogTitle: `${gameName} WORKING CODES (${month} ${year}) – ${codeCount} Free Rewards`,
    ogDescription: `${codeCount} verified working codes. Updated today! FREE rewards, gems & items.`,
  })
}

/**
 * Generate metadata for store pages
 */
export function generateStoreMetadata({
  storeName,
  storeSlug,
  dealCount = 0,
  categoryName,
}: {
  storeName: string
  storeSlug: string
  dealCount?: number
  categoryName?: string
}): Metadata {
  const { month, year } = getCurrentDateStrings()

  const path = categoryName
    ? `/stores/${storeSlug}/${categoryName.toLowerCase().replace(/\s+/g, '-')}`
    : `/stores/${storeSlug}`

  const title = categoryName
    ? `${storeName} ${categoryName} Deals – ${month} ${year} | Up to 70% Off`
    : `${storeName} Coupons & Deals – ${month} ${year} | Save Up to 70%`

  const description = categoryName
    ? `${dealCount}+ ${categoryName.toLowerCase()} deals at ${storeName}. Verified coupons and discounts updated hourly. Shop now and save!`
    : `${dealCount}+ verified ${storeName} coupons and deals for ${month} ${year}. Save up to 70% with our exclusive codes!`

  const keywords = [
    `${storeName.toLowerCase()} coupons`,
    `${storeName.toLowerCase()} deals`,
    `${storeName.toLowerCase()} promo codes`,
    `${storeName.toLowerCase()} discount codes ${year}`,
    ...(categoryName ? [`${storeName.toLowerCase()} ${categoryName.toLowerCase()} deals`] : []),
  ]

  return generatePageMetadata({
    title,
    description,
    path,
    keywords,
  })
}
