/**
 * SEO Slug Parser
 * Parses programmatic SEO slugs into database query filters
 * 
 * Supported patterns:
 * - {category}-under-{price} → laptops-under-500
 * - {brand}-{category} → nike-sneakers
 * - best-{category} → best-laptops
 * - {brand}-{category}-under-{price} → sony-headphones-under-200
 * - best-{brand}-{category} → best-apple-laptops
 */

// Known brands for matching
const knownBrands = new Set([
  'apple', 'samsung', 'sony', 'lg', 'bose', 'nike', 'adidas', 'puma',
  'dell', 'hp', 'lenovo', 'asus', 'acer', 'microsoft', 'google',
  'dyson', 'kitchenaid', 'ninja', 'vitamix', 'breville', 'cuisinart',
  'amazon', 'target', 'walmart', 'costco', 'bestbuy', 'best-buy',
  'patagonia', 'north-face', 'columbia', 'levis', 'gap', 'uniqlo',
  'ray-ban', 'oakley', 'gucci', 'prada', 'coach',
  'canon', 'nikon', 'gopro', 'dji', 'fujifilm',
  'jbl', 'beats', 'sennheiser', 'audio-technica', 'skullcandy',
])

// Known categories for matching
const knownCategories = new Set([
  'laptops', 'headphones', 'sneakers', 'shoes', 'tvs', 'monitors',
  'phones', 'smartphones', 'tablets', 'watches', 'smartwatches',
  'cameras', 'speakers', 'earbuds', 'keyboards', 'mice', 'gaming',
  'jeans', 'jackets', 'shirts', 'dresses', 'pants', 'sweaters',
  'sunglasses', 'bags', 'backpacks', 'wallets', 'belts',
  'vacuums', 'blenders', 'coffee-makers', 'air-fryers', 'toasters',
  'mattresses', 'furniture', 'lighting', 'decor',
  'fitness', 'yoga', 'running', 'outdoor', 'camping', 'hiking',
  'electronics', 'fashion', 'home', 'kitchen', 'appliances', 'beauty',
])

export interface SeoSlugParsed {
  type: 'price' | 'brand' | 'best' | 'brand-price' | 'best-brand' | 'unknown'
  category?: string
  categoryDisplay?: string
  brand?: string
  brandDisplay?: string
  maxPrice?: number
  slug: string
  title: string
  description: string
  h1: string
}

function capitalize(str: string): string {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

function formatBrand(brand: string): string {
  const brandMap: Record<string, string> = {
    'apple': 'Apple',
    'samsung': 'Samsung',
    'sony': 'Sony',
    'lg': 'LG',
    'bose': 'Bose',
    'nike': 'Nike',
    'adidas': 'Adidas',
    'dell': 'Dell',
    'hp': 'HP',
    'lenovo': 'Lenovo',
    'asus': 'ASUS',
    'dyson': 'Dyson',
    'kitchenaid': 'KitchenAid',
    'ray-ban': 'Ray-Ban',
    'north-face': 'The North Face',
    'best-buy': 'Best Buy',
    'jbl': 'JBL',
    'beats': 'Beats',
    'gopro': 'GoPro',
    'dji': 'DJI',
  }
  return brandMap[brand] || capitalize(brand)
}

function formatCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    'laptops': 'Laptops',
    'headphones': 'Headphones',
    'sneakers': 'Sneakers',
    'tvs': 'TVs',
    'monitors': 'Monitors',
    'phones': 'Phones',
    'smartphones': 'Smartphones',
    'tablets': 'Tablets',
    'watches': 'Watches',
    'smartwatches': 'Smartwatches',
    'earbuds': 'Earbuds',
    'speakers': 'Speakers',
    'cameras': 'Cameras',
    'gaming': 'Gaming',
    'jeans': 'Jeans',
    'jackets': 'Jackets',
    'sunglasses': 'Sunglasses',
    'vacuums': 'Vacuums',
    'blenders': 'Blenders',
    'coffee-makers': 'Coffee Makers',
    'air-fryers': 'Air Fryers',
    'mattresses': 'Mattresses',
    'fitness': 'Fitness',
    'running': 'Running',
    'electronics': 'Electronics',
    'fashion': 'Fashion',
    'home': 'Home & Kitchen',
    'kitchen': 'Kitchen',
    'appliances': 'Appliances',
    'beauty': 'Beauty',
  }
  return categoryMap[category] || capitalize(category)
}

export function parseSeoSlug(slug: string): SeoSlugParsed {
  const parts = slug.toLowerCase().split('-')
  
  // Pattern: {category}-under-{price}
  // Example: laptops-under-500
  const underIndex = parts.indexOf('under')
  if (underIndex > 0 && underIndex < parts.length - 1) {
    const price = parseInt(parts[underIndex + 1], 10)
    if (!isNaN(price)) {
      const beforeUnder = parts.slice(0, underIndex).join('-')
      
      // Check if it's {brand}-{category}-under-{price}
      // Example: sony-headphones-under-200
      let brand: string | undefined
      let category: string | undefined
      
      for (let i = 0; i < underIndex; i++) {
        const segment = parts.slice(0, i + 1).join('-')
        const rest = parts.slice(i + 1, underIndex).join('-')
        
        if (knownBrands.has(segment) && knownCategories.has(rest)) {
          brand = segment
          category = rest
          break
        }
      }
      
      if (brand && category) {
        const brandDisplay = formatBrand(brand)
        const categoryDisplay = formatCategory(category)
        return {
          type: 'brand-price',
          brand,
          brandDisplay,
          category,
          categoryDisplay,
          maxPrice: price,
          slug,
          title: `Best ${brandDisplay} ${categoryDisplay} Under $${price} | SaveSmart`,
          description: `Find the best ${brandDisplay} ${categoryDisplay.toLowerCase()} deals under $${price}. Compare prices from top retailers and save.`,
          h1: `${brandDisplay} ${categoryDisplay} Under $${price}`,
        }
      }
      
      // Simple {category}-under-{price}
      if (knownCategories.has(beforeUnder)) {
        const categoryDisplay = formatCategory(beforeUnder)
        return {
          type: 'price',
          category: beforeUnder,
          categoryDisplay,
          maxPrice: price,
          slug,
          title: `Best ${categoryDisplay} Deals Under $${price} | SaveSmart`,
          description: `Browse the best ${categoryDisplay.toLowerCase()} deals under $${price} from top stores like Amazon, Best Buy and Walmart.`,
          h1: `${categoryDisplay} Deals Under $${price}`,
        }
      }
    }
  }
  
  // Pattern: best-{brand}-{category}
  // Example: best-apple-laptops
  if (parts[0] === 'best' && parts.length >= 3) {
    for (let i = 1; i < parts.length - 1; i++) {
      const potentialBrand = parts.slice(1, i + 1).join('-')
      const potentialCategory = parts.slice(i + 1).join('-')
      
      if (knownBrands.has(potentialBrand) && knownCategories.has(potentialCategory)) {
        const brandDisplay = formatBrand(potentialBrand)
        const categoryDisplay = formatCategory(potentialCategory)
        return {
          type: 'best-brand',
          brand: potentialBrand,
          brandDisplay,
          category: potentialCategory,
          categoryDisplay,
          slug,
          title: `Best ${brandDisplay} ${categoryDisplay} Deals 2026 | SaveSmart`,
          description: `Discover the best ${brandDisplay} ${categoryDisplay.toLowerCase()} deals. Compare prices and save on top-rated products.`,
          h1: `Best ${brandDisplay} ${categoryDisplay} Deals`,
        }
      }
    }
  }
  
  // Pattern: best-{category}
  // Example: best-laptops, best-gaming-laptops
  if (parts[0] === 'best' && parts.length >= 2) {
    const categoryPart = parts.slice(1).join('-')
    if (knownCategories.has(categoryPart) || knownCategories.has(parts[parts.length - 1])) {
      const categoryDisplay = formatCategory(categoryPart)
      return {
        type: 'best',
        category: categoryPart,
        categoryDisplay,
        slug,
        title: `Best ${categoryDisplay} Deals 2026 | SaveSmart`,
        description: `Find the best ${categoryDisplay.toLowerCase()} deals from top retailers. Prices updated hourly.`,
        h1: `Best ${categoryDisplay} Deals`,
      }
    }
  }
  
  // Pattern: {brand}-{category}
  // Example: nike-sneakers, sony-headphones
  for (let i = 0; i < parts.length - 1; i++) {
    const potentialBrand = parts.slice(0, i + 1).join('-')
    const potentialCategory = parts.slice(i + 1).join('-')
    
    if (knownBrands.has(potentialBrand) && knownCategories.has(potentialCategory)) {
      const brandDisplay = formatBrand(potentialBrand)
      const categoryDisplay = formatCategory(potentialCategory)
      return {
        type: 'brand',
        brand: potentialBrand,
        brandDisplay,
        category: potentialCategory,
        categoryDisplay,
        slug,
        title: `${brandDisplay} ${categoryDisplay} Deals & Discounts | SaveSmart`,
        description: `Shop ${brandDisplay} ${categoryDisplay.toLowerCase()} deals. Find the lowest prices, coupon codes, and exclusive discounts.`,
        h1: `${brandDisplay} ${categoryDisplay} Deals`,
      }
    }
  }
  
  // Unknown pattern - treat entire slug as a search term
  const display = capitalize(slug)
  return {
    type: 'unknown',
    slug,
    title: `${display} Deals & Discounts | SaveSmart`,
    description: `Find the best deals on ${display.toLowerCase()}. Compare prices from top retailers and save.`,
    h1: `${display} Deals`,
  }
}

/**
 * Generate related SEO slugs for internal linking
 */
export function getRelatedSeoSlugs(parsed: SeoSlugParsed): string[] {
  const related: string[] = []
  
  if (parsed.category) {
    // Related price points
    if (parsed.maxPrice) {
      const prices = [200, 300, 500, 750, 1000, 1500, 2000].filter(p => p !== parsed.maxPrice)
      prices.slice(0, 3).forEach(price => {
        related.push(`${parsed.category}-under-${price}`)
      })
    } else {
      related.push(`${parsed.category}-under-500`)
      related.push(`${parsed.category}-under-1000`)
    }
    
    // Best category
    if (parsed.type !== 'best') {
      related.push(`best-${parsed.category}`)
    }
  }
  
  if (parsed.brand) {
    // Other categories from same brand
    const otherCategories = ['laptops', 'headphones', 'tvs', 'speakers', 'phones']
      .filter(c => c !== parsed.category)
      .slice(0, 2)
    
    otherCategories.forEach(cat => {
      related.push(`${parsed.brand}-${cat}`)
    })
  }
  
  return related.slice(0, 6)
}

/**
 * Generate all known SEO slugs for sitemap
 */
export function getAllSeoSlugs(): string[] {
  const slugs: string[] = []
  const categories = ['laptops', 'headphones', 'sneakers', 'tvs', 'phones', 'smartwatches', 'tablets', 'cameras', 'speakers', 'earbuds', 'jeans', 'jackets', 'sunglasses', 'vacuums', 'blenders', 'air-fryers', 'mattresses', 'fitness', 'gaming']
  const brands = ['apple', 'samsung', 'sony', 'lg', 'bose', 'nike', 'adidas', 'dell', 'hp', 'lenovo', 'dyson', 'beats', 'jbl']
  const prices = [200, 300, 500, 750, 1000, 1500]
  
  // {category}-under-{price}
  categories.forEach(cat => {
    prices.forEach(price => {
      slugs.push(`${cat}-under-${price}`)
    })
  })
  
  // {brand}-{category}
  brands.forEach(brand => {
    categories.slice(0, 8).forEach(cat => {
      slugs.push(`${brand}-${cat}`)
    })
  })
  
  // best-{category}
  categories.forEach(cat => {
    slugs.push(`best-${cat}`)
  })
  
  return slugs
}
