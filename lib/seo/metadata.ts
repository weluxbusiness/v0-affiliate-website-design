import type { Metadata } from "next"

const BASE_URL = "https://savesmart.bio"
const SITE_NAME = "SaveSmart"
const currentYear = new Date().getFullYear()

// ==================== CATEGORY METADATA ====================

export function generateCategoryMetadata(
  categorySlug: string,
  categoryName: string
): Metadata {
  const title = `Best ${categoryName} Deals - Compare Prices & Save | ${SITE_NAME}`
  const description = `Compare ${categoryName.toLowerCase()} deals from top retailers. Find the lowest prices, coupon codes, and exclusive discounts on ${categoryName.toLowerCase()}.`

  return {
    title,
    description,
    openGraph: {
      title: `Best ${categoryName} Deals | ${SITE_NAME}`,
      description: `Find the best deals on ${categoryName.toLowerCase()} from Amazon, Best Buy, and more. Prices updated hourly.`,
      type: "website",
      url: `${BASE_URL}/deals/${categorySlug}`,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/deals/${categorySlug}`,
    },
    keywords: [
      `${categoryName.toLowerCase()} deals`,
      `best ${categoryName.toLowerCase()} deals`,
      `${categoryName.toLowerCase()} discounts`,
      `cheap ${categoryName.toLowerCase()}`,
      `${categoryName.toLowerCase()} sale`,
      `${categoryName.toLowerCase()} coupons`,
    ],
  }
}

// ==================== CITY + CATEGORY METADATA ====================

export function generateCityMetadata(
  categorySlug: string,
  categoryName: string,
  citySlug: string,
  cityName: string
): Metadata {
  const title = `Best ${categoryName} Deals in ${cityName} ${currentYear} | ${SITE_NAME}`
  const description = `Find the best ${categoryName.toLowerCase()} deals in ${cityName}. Compare prices from Amazon, Best Buy, Target & more. Updated daily with the latest discounts.`

  return {
    title,
    description,
    openGraph: {
      title: `Best ${categoryName} Deals in ${cityName} | ${SITE_NAME}`,
      description: `Compare ${categoryName.toLowerCase()} deals from top retailers in ${cityName}. Prices updated hourly.`,
      type: "website",
      url: `${BASE_URL}/deals/${categorySlug}/city/${citySlug}`,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/deals/${categorySlug}/city/${citySlug}`,
    },
    keywords: [
      `${categoryName.toLowerCase()} deals ${cityName}`,
      `best ${categoryName.toLowerCase()} ${cityName}`,
      `${categoryName.toLowerCase()} discounts ${cityName}`,
      `cheap ${categoryName.toLowerCase()} ${cityName}`,
      `${categoryName.toLowerCase()} sale ${cityName}`,
      `buy ${categoryName.toLowerCase()} ${cityName}`,
    ],
  }
}

// ==================== STORE METADATA ====================

export function generateStoreMetadata(
  storeSlug: string,
  storeName: string
): Metadata {
  const title = `${storeName} Deals & Coupons ${currentYear} | ${SITE_NAME}`
  const description = `Find the latest ${storeName} deals and discounts. Save money with verified coupons and exclusive offers from ${storeName}.`

  return {
    title,
    description,
    openGraph: {
      title: `${storeName} Deals & Coupons | ${SITE_NAME}`,
      description: `Find the latest deals and discounts from ${storeName}. Save money with verified coupons and exclusive offers.`,
      type: "website",
      url: `${BASE_URL}/stores/${storeSlug}`,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/stores/${storeSlug}`,
    },
    keywords: [
      `${storeName.toLowerCase()} deals`,
      `${storeName.toLowerCase()} coupons`,
      `${storeName.toLowerCase()} promo codes`,
      `${storeName.toLowerCase()} discounts`,
      `${storeName.toLowerCase()} sale`,
    ],
  }
}

// ==================== BRAND METADATA ====================

export function generateBrandMetadata(
  brandSlug: string,
  brandName: string
): Metadata {
  const title = `Best ${brandName} Deals & Coupons ${currentYear} | ${SITE_NAME}`
  const description = `Find the best ${brandName} deals, coupons and discounts from Amazon, Best Buy, Target and other retailers. Save up to 70% on ${brandName} products.`

  return {
    title,
    description,
    openGraph: {
      title: `Best ${brandName} Deals | ${SITE_NAME}`,
      description: `Compare the best ${brandName} deals from top retailers. Prices updated hourly.`,
      type: "website",
      url: `${BASE_URL}/brands/${brandSlug}`,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/brands/${brandSlug}`,
    },
    keywords: [
      `${brandName.toLowerCase()} deals`,
      `${brandName.toLowerCase()} sale`,
      `${brandName.toLowerCase()} discounts`,
      `best ${brandName.toLowerCase()} deals`,
      `${brandName.toLowerCase()} coupons`,
      `buy ${brandName.toLowerCase()}`,
    ],
  }
}

// ==================== COUPON PAGE METADATA ====================

export function generateCouponMetadata(
  storeSlug: string,
  storeName: string
): Metadata {
  const title = `${storeName} Coupons & Promo Codes ${currentYear} | ${SITE_NAME}`
  const description = `Get verified ${storeName} coupons and promo codes. Save money with exclusive discounts, free shipping codes, and special offers from ${storeName}.`

  return {
    title,
    description,
    openGraph: {
      title: `${storeName} Coupons & Promo Codes | ${SITE_NAME}`,
      description: `Get verified ${storeName} coupons and promo codes. Save with exclusive discounts and free shipping.`,
      type: "website",
      url: `${BASE_URL}/coupons/${storeSlug}`,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/coupons/${storeSlug}`,
    },
    keywords: [
      `${storeName.toLowerCase()} coupons`,
      `${storeName.toLowerCase()} promo codes`,
      `${storeName.toLowerCase()} discount codes`,
      `${storeName.toLowerCase()} free shipping`,
      `${storeName.toLowerCase()} deals`,
    ],
  }
}

// ==================== BEST CATEGORY METADATA ====================

export function generateBestCategoryMetadata(
  categorySlug: string,
  categoryName: string
): Metadata {
  const title = `Best ${categoryName} Deals ${currentYear} - Top Discounts | ${SITE_NAME}`
  const description = `Find the best ${categoryName.toLowerCase()} deals in ${currentYear}. Compare prices from Amazon, Best Buy, Target & more. Save up to 70% with verified discounts.`

  return {
    title,
    description,
    openGraph: {
      title: `Best ${categoryName} Deals ${currentYear}`,
      description: `Compare the best ${categoryName.toLowerCase()} deals from top retailers. Prices updated hourly.`,
      type: "website",
      url: `${BASE_URL}/best/${categorySlug}`,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/best/${categorySlug}`,
    },
    keywords: [
      `best ${categoryName.toLowerCase()} deals`,
      `${categoryName.toLowerCase()} deals ${currentYear}`,
      `cheap ${categoryName.toLowerCase()}`,
      `${categoryName.toLowerCase()} discounts`,
      `${categoryName.toLowerCase()} sale`,
    ],
  }
}
