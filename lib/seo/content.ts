// Dynamic SEO content generators for programmatic pages
// Target 150-250 words per page to avoid thin content

const TOP_STORES = ["Amazon", "Best Buy", "Target", "Walmart", "Costco"]

// ==================== CITY PAGE CONTENT ====================

export function generateCityIntroContent(
  categoryName: string,
  cityName: string
): string {
  const currentYear = new Date().getFullYear()
  const stores = TOP_STORES.slice(0, 3).join(", ")
  
  const intros = [
    `Looking for the best ${categoryName.toLowerCase()} deals in ${cityName}? You've come to the right place. SaveSmart tracks prices across all major retailers to help ${cityName} shoppers find incredible savings on ${categoryName.toLowerCase()} products.`,
    
    `${cityName} shoppers can find exceptional discounts on ${categoryName.toLowerCase()} from leading retailers like ${stores}. Our team monitors prices around the clock to bring you the most current deals and promotions available in ${currentYear}.`,
    
    `Whether you're shopping for everyday essentials or looking for that perfect item, ${cityName} residents have access to some of the best ${categoryName.toLowerCase()} deals available online. All products ship directly to ${cityName} with fast delivery options from most retailers.`,
  ]
  
  const tips = [
    `Pro tip: Many retailers offer same-day or next-day delivery to ${cityName}, so you can get your ${categoryName.toLowerCase()} purchases quickly. Some stores also offer local pickup options for even faster access to your deals.`,
    
    `We update our ${categoryName.toLowerCase()} deals for ${cityName} every hour, ensuring you always see the most current prices. Bookmark this page and check back often - flash sales and limited-time offers appear throughout the day.`,
  ]
  
  return `${intros.join(" ")} ${tips[Math.floor(cityName.length % tips.length)]}`
}

// ==================== BRAND PAGE CONTENT ====================

export function generateBrandIntroContent(brandName: string): string {
  const currentYear = new Date().getFullYear()
  
  return `Discover the best ${brandName} deals and discounts available in ${currentYear}. SaveSmart compares prices across all major retailers including Amazon, Best Buy, Target, and authorized ${brandName} dealers to help you find the lowest prices on ${brandName} products.

${brandName} is known for quality and innovation, but that doesn't mean you have to pay full price. Our deal-tracking technology monitors prices 24/7 to alert you when ${brandName} products go on sale. From seasonal promotions to flash sales, we catch every discount so you don't miss out.

Whether you're shopping for the latest ${brandName} releases or looking for deals on previous-generation products, we've got you covered. Many shoppers save 20-50% off retail prices by timing their purchases with sales events like Black Friday, Prime Day, and holiday promotions.

All ${brandName} deals on SaveSmart are verified against retailer websites. We show the original price, current sale price, and exact discount percentage so you can make informed purchasing decisions with confidence.`
}

// ==================== STORE PAGE CONTENT ====================

export function generateStoreIntroContent(storeName: string): string {
  const currentYear = new Date().getFullYear()
  
  return `Find the latest ${storeName} deals, coupons, and promo codes all in one place. SaveSmart tracks every discount and promotion from ${storeName} to help you save money on your purchases in ${currentYear}.

${storeName} regularly offers sales events, clearance deals, and exclusive online discounts. Our team monitors these promotions around the clock, updating our deal listings hourly to ensure you always see the most current prices.

From electronics and home goods to fashion and beauty products, ${storeName} carries a wide selection of items across multiple categories. We organize deals by category and discount percentage, making it easy to find exactly what you're looking for at the best price.

Many ${storeName} promotions include free shipping thresholds and membership perks. Check each deal listing for specific terms and any coupon codes that may apply to maximize your savings.`
}

// ==================== CATEGORY PAGE CONTENT ====================

export function generateCategoryIntroContent(categoryName: string): string {
  const currentYear = new Date().getFullYear()
  
  return `Compare ${categoryName.toLowerCase()} deals from top retailers and find the best prices in ${currentYear}. SaveSmart aggregates deals from Amazon, Best Buy, Target, Walmart, and dozens of other stores to help you save money on ${categoryName.toLowerCase()}.

Our deal-tracking system monitors prices across the web, automatically highlighting the biggest discounts. Each listing shows the original price, sale price, and discount percentage so you can quickly identify the best savings opportunities.

${categoryName} prices can vary significantly between retailers, making comparison shopping essential. We do the hard work for you by collecting all active deals in one place, sorted by discount percentage so the best deals appear first.

Deals are refreshed hourly to ensure accuracy. We also feature exclusive coupons and promo codes that provide additional savings on top of sale prices. Check back often as flash sales and limited-time offers appear throughout the day.`
}

// ==================== RELATED LINKS GENERATORS ====================

export function getRelatedCategoryLinks(
  currentCategory: string,
  categories: string[]
): { label: string; href: string }[] {
  return categories
    .filter((cat) => cat !== currentCategory)
    .slice(0, 5)
    .map((cat) => ({
      label: formatCategoryName(cat),
      href: `/deals/${cat}`,
    }))
}

export function getRelatedStoreLinks(
  currentStore: string,
  stores: string[]
): { label: string; href: string }[] {
  return stores
    .filter((store) => store !== currentStore)
    .slice(0, 5)
    .map((store) => ({
      label: formatStoreName(store),
      href: `/stores/${store}`,
    }))
}

export function getRelatedBrandLinks(
  currentBrand: string,
  brands: string[]
): { label: string; href: string }[] {
  return brands
    .filter((brand) => brand !== currentBrand)
    .slice(0, 5)
    .map((brand) => ({
      label: formatBrandName(brand),
      href: `/brands/${brand}`,
    }))
}

// ==================== FORMATTING HELPERS ====================

export function formatCategoryName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function formatStoreName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function formatBrandName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
