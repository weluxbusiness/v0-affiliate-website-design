/**
 * Dynamic SEO intro content generator
 * Generates unique 80-150 word intros for each page type to avoid duplicate content
 * Uses variation patterns and page-specific data to create unique content
 */

import { getCurrentDateStrings } from './metadata-defaults'

// Variation templates for intro paragraphs
// Each template has multiple variations to create unique content per page

// ============================================
// DEALS CATEGORY INTROS
// ============================================

const dealsCategoryIntros = [
  (category: string, count: number, month: string, year: number) =>
    `Looking for the best ${category.toLowerCase()} deals in ${month} ${year}? You&apos;re in the right place. Our team has curated ${count}+ verified ${category.toLowerCase()} discounts from top retailers like Amazon, Best Buy, Target, and Walmart. Every deal is checked hourly to ensure you&apos;re seeing accurate prices and real savings. Whether you&apos;re shopping for a gift or treating yourself, these ${category.toLowerCase()} deals offer savings of up to 70% off retail prices. Don&apos;t miss out on limited-time offers that could expire any moment.`,

  (category: string, count: number, month: string, year: number) =>
    `${month} ${year} brings incredible savings on ${category.toLowerCase()}. We&apos;ve gathered ${count}+ active ${category.toLowerCase()} deals from America&apos;s favorite retailers, all verified and updated in real-time. Our price comparison tools help you find the absolute lowest prices on the ${category.toLowerCase()} you want. From flash sales to exclusive coupon codes, we track every discount so you don&apos;t have to. Start saving today with deals that won&apos;t last long.`,

  (category: string, count: number, month: string, year: number) =>
    `Save big on ${category.toLowerCase()} this ${month}! With ${count}+ deals from trusted retailers, finding the perfect ${category.toLowerCase()} at the best price has never been easier. Our smart deal-finding technology scans thousands of products daily, bringing you only the most significant discounts. Compare prices across stores in seconds and never overpay again. These ${year} ${category.toLowerCase()} deals represent some of the best values we&apos;ve seen all year.`,

  (category: string, count: number, month: string, year: number) =>
    `Discover ${count}+ hand-picked ${category.toLowerCase()} deals for ${month} ${year}. Our deal experts work around the clock to find discounts you won&apos;t find anywhere else. From everyday essentials to premium products, we&apos;ve got ${category.toLowerCase()} savings for every budget. Each listing shows the original price, sale price, and exact discount percentage so you know exactly how much you&apos;re saving. Shop with confidence knowing these deals are verified and currently active.`,
]

// ============================================
// STORE PAGE INTROS
// ============================================

const storeIntros = [
  (store: string, count: number, month: string, year: number) =>
    `Find the best ${store} coupons and deals for ${month} ${year}. We currently have ${count}+ verified ${store} discount codes and offers, updated hourly to ensure they work. From sitewide sales to product-specific discounts, we track every way to save at ${store}. Our team tests each code before adding it to guarantee savings. Stop paying full price and start saving with these exclusive ${store} deals.`,

  (store: string, count: number, month: string, year: number) =>
    `${count}+ active ${store} coupons and promo codes for ${month} ${year}. Whether you&apos;re a first-time shopper or loyal customer, we&apos;ve got savings for you. Our ${store} deals include exclusive codes, free shipping offers, and limited-time sales that can save you up to 70%. Each coupon is verified by real shoppers and updated in real-time. Never miss a ${store} deal again.`,

  (store: string, count: number, month: string, year: number) =>
    `Save money at ${store} with ${count}+ working coupons and deals. Our ${month} ${year} collection includes the latest promo codes, cashback offers, and clearance finds. We partner directly with ${store} to bring you exclusive discounts not available elsewhere. Compare prices, stack coupons where possible, and maximize your savings on every purchase. Updated hourly so you always have access to the newest deals.`,
]

// ============================================
// GAMING PAGE INTROS
// ============================================

const gamingIntros = [
  (game: string, codeCount: number, month: string, year: number) =>
    `Get ${codeCount} working ${game} codes for ${month} ${year}. Our team verifies every code daily to ensure they&apos;re still active and redeemable. Unlock free rewards, premium currency, exclusive items, and more by redeeming these ${game} promo codes. Whether you&apos;re a new player looking for a head start or a veteran wanting extra rewards, these codes will boost your progress. Codes can expire without warning, so redeem them while they&apos;re still working.`,

  (game: string, codeCount: number, month: string, year: number) =>
    `${codeCount} verified ${game} codes updated for ${month} ${year}. Stop grinding and start winning with free rewards, gems, currency, and exclusive items. Our ${game} code list is updated daily as new codes are released and old ones expire. Each code includes the exact reward you&apos;ll receive and step-by-step redemption instructions. Don&apos;t miss out on these limited-time freebies that can give you a serious advantage.`,

  (game: string, codeCount: number, month: string, year: number) =>
    `Looking for ${game} codes that actually work? We&apos;ve got ${codeCount} verified codes for ${month} ${year}, all tested and confirmed working today. Get free gems, coins, characters, skins, and other valuable rewards without spending a dime. New ${game} codes are added regularly, so bookmark this page and check back often. Our community helps verify codes in real-time, so you can trust that what you see here works.`,

  (game: string, codeCount: number, month: string, year: number) =>
    `Claim ${codeCount} free ${game} rewards with our updated codes for ${month} ${year}. From new player bonuses to anniversary event codes, we track every way to get free stuff in ${game}. Each code is verified within 24 hours of being added, and expired codes are removed promptly. Follow our step-by-step guide to redeem codes and start collecting your free rewards today. Check back daily for new codes!`,
]

// ============================================
// HOW TO USE CODES SECTIONS
// ============================================

export function generateHowToUseCodesContent(gameName: string): {
  title: string
  steps: { title: string; description: string }[]
} {
  return {
    title: `How to Redeem ${gameName} Codes`,
    steps: [
      {
        title: 'Launch the Game',
        description: `Open ${gameName} on your device and make sure you&apos;re logged into your account.`,
      },
      {
        title: 'Find the Redeem Section',
        description: `Look for a "Redeem Code", "Gift Code", or "Promo Code" option in the game&apos;s settings or main menu.`,
      },
      {
        title: 'Enter the Code',
        description: `Type or paste the code exactly as shown (codes are case-sensitive). Double-check for any typos.`,
      },
      {
        title: 'Claim Your Rewards',
        description: `Press confirm or redeem, then check your in-game mailbox or inventory for your free rewards!`,
      },
    ],
  }
}

// ============================================
// TIPS TO SAVE MONEY SECTIONS
// ============================================

export function generateSavingTipsContent(context: 'deals' | 'store' | 'gaming', name?: string): {
  title: string
  tips: string[]
} {
  if (context === 'gaming') {
    return {
      title: `Tips to Get More Free ${name || 'Game'} Rewards`,
      tips: [
        'Check back daily for new codes - developers often release codes without announcement',
        'Follow official social media accounts for exclusive giveaway codes',
        'Look for codes during special events, holidays, and game anniversaries',
        'Join the game&apos;s official Discord or community for early code access',
        'Enable notifications so you never miss a limited-time code',
      ],
    }
  }

  if (context === 'store') {
    return {
      title: `How to Save More at ${name || 'This Store'}`,
      tips: [
        'Sign up for the email newsletter to get exclusive discount codes',
        'Check for student, military, or first-time buyer discounts',
        'Use cashback apps and browser extensions for extra savings',
        'Shop during major sales events like Black Friday and Prime Day',
        'Compare prices across retailers before buying',
      ],
    }
  }

  // Default: deals context
  return {
    title: `Tips to Find the Best ${name || 'Product'} Deals`,
    tips: [
      'Compare prices across multiple retailers before purchasing',
      'Look for bundle deals that include accessories or extras',
      'Consider open-box or refurbished options for bigger discounts',
      'Set price alerts to get notified when prices drop',
      'Stack coupons with cashback offers for maximum savings',
    ],
  }
}

// ============================================
// MAIN INTRO GENERATOR FUNCTIONS
// ============================================

/**
 * Generate unique intro content for a deals category page
 * Uses a hash of the category name to select a consistent variation
 */
export function generateDealsCategoryIntro(
  categoryName: string,
  dealCount: number
): string {
  const { month, year } = getCurrentDateStrings()
  
  // Use category name to consistently select a variation
  const variationIndex = Math.abs(hashCode(categoryName)) % dealsCategoryIntros.length
  const introFn = dealsCategoryIntros[variationIndex]
  
  return introFn(categoryName, dealCount, month, year)
}

/**
 * Generate unique intro content for a store page
 */
export function generateStoreIntro(
  storeName: string,
  dealCount: number
): string {
  const { month, year } = getCurrentDateStrings()
  
  const variationIndex = Math.abs(hashCode(storeName)) % storeIntros.length
  const introFn = storeIntros[variationIndex]
  
  return introFn(storeName, dealCount, month, year)
}

/**
 * Generate unique intro content for a gaming page
 */
export function generateGamingIntro(
  gameName: string,
  codeCount: number
): string {
  const { month, year } = getCurrentDateStrings()
  
  const variationIndex = Math.abs(hashCode(gameName)) % gamingIntros.length
  const introFn = gamingIntros[variationIndex]
  
  return introFn(gameName, codeCount, month, year)
}

/**
 * Generate unique "codes today" intro for gaming pages
 */
export function generateCodesTodayIntro(
  gameName: string,
  codeCount: number
): string {
  const { month, year, day } = getCurrentDateStrings()
  
  return `${codeCount} ${gameName} codes working today (${month} ${day}, ${year}). Every code on this page has been verified within the last 24 hours and confirmed active. Redeem these codes now for free rewards, gems, currency, and exclusive items before they expire. New codes are added as soon as they&apos;re discovered, so check back daily for the latest working ${gameName} codes. Don&apos;t wait - some codes have limited uses and could stop working at any moment!`
}

/**
 * Generate unique monthly codes intro for gaming pages
 */
export function generateMonthlyCodesIntro(
  gameName: string,
  codeCount: number,
  targetMonth: string,
  targetYear: number
): string {
  return `Complete list of ${codeCount} ${gameName} codes for ${targetMonth} ${targetYear}. This page includes all active codes released this month, plus any still-working codes from previous months. We update this list daily as new ${gameName} codes are discovered or expire. Bookmark this page for your go-to source for free ${gameName} rewards all month long. Each code shows the exact rewards you&apos;ll receive and has been tested by our community.`
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Simple hash function to generate consistent variations
 */
function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

/**
 * Generate a unique seed for combining with page type for more variation
 */
export function generateContentSeed(pageType: string, identifier: string): number {
  return Math.abs(hashCode(`${pageType}-${identifier}`))
}
