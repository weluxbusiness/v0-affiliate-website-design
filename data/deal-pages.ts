/**
 * Programmatic SEO Dataset
 * Generates 50,000+ landing pages for deals and coupons
 * 
 * URL patterns:
 * - /deals/amazon-under-50
 * - /deals/nike-under-100
 * - /deals/laptops-under-500
 * - /deals/headphones-under-200
 */

// ============================================
// BRANDS - Major retailers and brand names
// ============================================

export const brands = [
  // Major Retailers
  "amazon", "walmart", "target", "costco", "best-buy", "home-depot", "lowes",
  "macys", "nordstrom", "kohls", "jcpenney", "sears", "dillards",
  
  // Electronics
  "apple", "samsung", "sony", "lg", "dell", "hp", "lenovo", "asus", "acer",
  "microsoft", "google", "nvidia", "amd", "intel", "razer", "corsair",
  "logitech", "steelseries", "hyperx", "bose", "beats", "jbl", "sennheiser",
  "audio-technica", "skullcandy", "jabra", "anker", "belkin", "tp-link",
  "netgear", "asus-router", "linksys", "ring", "nest", "arlo", "wyze",
  "roku", "fire-tv", "chromecast", "nvidia-shield", "tcl", "hisense", "vizio",
  "onn", "insignia", "element",
  
  // Fashion & Apparel
  "nike", "adidas", "puma", "reebok", "new-balance", "under-armour",
  "north-face", "patagonia", "columbia", "canada-goose", "moncler",
  "levis", "gap", "old-navy", "banana-republic", "h-m", "zara", "uniqlo",
  "forever21", "asos", "shein", "fashion-nova", "boohoo", "prettylittlething",
  "ralph-lauren", "tommy-hilfiger", "calvin-klein", "guess", "michael-kors",
  "coach", "kate-spade", "tory-burch", "louis-vuitton", "gucci", "prada",
  "chanel", "burberry", "versace", "armani", "hugo-boss", "lacoste",
  
  // Footwear
  "converse", "vans", "skechers", "crocs", "birkenstock", "timberland",
  "dr-martens", "ugg", "steve-madden", "clarks", "ecco", "cole-haan",
  "allen-edmonds", "johnston-murphy", "rockport", "hoka", "brooks",
  "asics", "saucony", "mizuno", "on-running", "allbirds", "rothy",
  
  // Home & Kitchen
  "dyson", "shark", "bissell", "roomba", "eufy", "roborock", "ecovacs",
  "kitchenaid", "cuisinart", "ninja", "instant-pot", "breville", "keurig",
  "nespresso", "de-longhi", "mr-coffee", "hamilton-beach", "black-decker",
  "vitamix", "nutribullet", "magic-bullet", "oster", "crock-pot",
  "le-creuset", "lodge", "all-clad", "calphalon", "t-fal", "rachael-ray",
  "oxo", "simplehuman", "joseph-joseph", "rubbermaid", "tupperware",
  
  // Furniture & Home Decor
  "wayfair", "ikea", "ashley-furniture", "pottery-barn", "crate-barrel",
  "west-elm", "restoration-hardware", "ethan-allen", "arhaus", "z-gallerie",
  "world-market", "pier-1", "bed-bath-beyond", "williams-sonoma", "sur-la-table",
  
  // Beauty & Personal Care
  "sephora", "ulta", "mac", "nars", "urban-decay", "too-faced", "tarte",
  "fenty-beauty", "charlotte-tilbury", "rare-beauty", "glossier", "drunk-elephant",
  "tatcha", "clinique", "estee-lauder", "lancome", "benefit", "maybelline",
  "loreal", "revlon", "covergirl", "nyx", "elf", "morphe", "colourpop",
  "olaplex", "kerastase", "redken", "paul-mitchell", "joico", "chi",
  "t3", "ghd", "dyson-hair", "revlon-hair", "conair", "hot-tools",
  
  // Sports & Outdoors
  "rei", "dicks-sporting-goods", "academy-sports", "bass-pro-shops", "cabelas",
  "yeti", "hydro-flask", "stanley", "thermos", "contigo", "camelbak",
  "coleman", "big-agnes", "msr", "kelty", "osprey", "gregory", "deuter",
  "garmin", "fitbit", "whoop", "oura", "polar", "suunto", "coros",
  "gopro", "dji", "insta360", "akaso",
  
  // Gaming
  "playstation", "xbox", "nintendo", "steam", "epic-games", "ea-sports",
  "ubisoft", "activision", "bethesda", "rockstar", "2k-games", "capcom",
  "sega", "bandai-namco", "square-enix", "konami", "nintendo-switch",
  "ps5", "xbox-series-x", "gaming-pc", "gaming-laptop", "gaming-monitor",
  
  // Baby & Kids
  "disney", "lego", "mattel", "hasbro", "fisher-price", "melissa-doug",
  "little-tikes", "step2", "vtech", "leapfrog", "paw-patrol", "barbie",
  "hot-wheels", "nerf", "play-doh", "crayola",
  
  // Pet Supplies
  "chewy", "petco", "petsmart", "blue-buffalo", "purina", "iams", "hills",
  "royal-canin", "nutro", "wellness", "fromm", "orijen", "acana",
  
  // Office & School
  "staples", "office-depot", "amazon-basics", "five-star", "mead",
  "moleskine", "rhodia", "leuchtturm", "pilot", "uni-ball", "zebra",
  "sharpie", "expo", "post-it", "3m", "brother", "canon-printer", "hp-printer",
  "epson", "xerox", "fujitsu", "doxie", "scansnap"
] as const

export type Brand = typeof brands[number]

// ============================================
// CATEGORIES - Product types
// ============================================

export const categories = [
  // Electronics
  "laptops", "gaming-laptops", "chromebooks", "macbooks", "ultrabooks",
  "desktops", "gaming-pcs", "all-in-one-pcs", "mini-pcs",
  "monitors", "gaming-monitors", "ultrawide-monitors", "4k-monitors",
  "tvs", "4k-tvs", "oled-tvs", "smart-tvs", "roku-tvs",
  "smartphones", "iphones", "android-phones", "samsung-phones",
  "tablets", "ipads", "android-tablets", "kindle", "e-readers",
  "smartwatches", "apple-watch", "fitness-trackers", "garmin-watches",
  "headphones", "wireless-earbuds", "airpods", "noise-cancelling", "gaming-headsets",
  "speakers", "bluetooth-speakers", "soundbars", "home-theater",
  "cameras", "dslr-cameras", "mirrorless-cameras", "action-cameras", "webcams",
  "drones", "security-cameras", "video-doorbells",
  "routers", "mesh-wifi", "wifi-extenders", "modems",
  "storage", "external-hard-drives", "ssds", "usb-drives", "memory-cards",
  "printers", "laser-printers", "inkjet-printers", "all-in-one-printers",
  
  // Fashion
  "sneakers", "running-shoes", "basketball-shoes", "casual-shoes",
  "boots", "sandals", "heels", "flats", "loafers", "dress-shoes",
  "jeans", "pants", "shorts", "leggings", "joggers",
  "t-shirts", "hoodies", "sweaters", "jackets", "coats",
  "dresses", "skirts", "blouses", "activewear", "athleisure",
  "suits", "blazers", "dress-shirts", "ties",
  "handbags", "backpacks", "wallets", "belts", "sunglasses",
  "watches", "jewelry", "earrings", "necklaces", "bracelets",
  
  // Home & Kitchen
  "vacuums", "robot-vacuums", "cordless-vacuums", "steam-mops",
  "air-purifiers", "humidifiers", "dehumidifiers", "fans", "heaters",
  "coffee-makers", "espresso-machines", "single-serve-coffee",
  "blenders", "food-processors", "mixers", "juicers",
  "air-fryers", "instant-pots", "slow-cookers", "rice-cookers",
  "toasters", "toaster-ovens", "microwaves", "convection-ovens",
  "cookware", "pots-pans", "bakeware", "cast-iron", "non-stick",
  "knife-sets", "cutting-boards", "kitchen-gadgets",
  "bedding", "mattresses", "pillows", "sheets", "comforters",
  "furniture", "sofas", "sectionals", "recliners", "office-chairs",
  "desks", "bookshelves", "dressers", "nightstands", "coffee-tables",
  "lighting", "lamps", "ceiling-lights", "smart-bulbs",
  "rugs", "curtains", "home-decor", "wall-art", "mirrors",
  
  // Beauty
  "makeup", "foundation", "lipstick", "mascara", "eyeshadow",
  "skincare", "moisturizers", "serums", "cleansers", "sunscreen",
  "hair-care", "shampoo", "conditioner", "hair-styling", "hair-tools",
  "fragrances", "perfume", "cologne",
  "nail-care", "nail-polish", "manicure-kits",
  
  // Sports & Fitness
  "fitness-equipment", "treadmills", "exercise-bikes", "ellipticals",
  "weights", "dumbbells", "kettlebells", "resistance-bands",
  "yoga-mats", "foam-rollers", "fitness-accessories",
  "golf-clubs", "golf-balls", "golf-bags", "golf-accessories",
  "tennis-rackets", "basketballs", "footballs", "soccer-balls",
  "camping-gear", "tents", "sleeping-bags", "camping-chairs",
  "hiking-boots", "hiking-backpacks", "trekking-poles",
  "fishing-gear", "fishing-rods", "tackle-boxes", "fishing-accessories",
  "bikes", "mountain-bikes", "road-bikes", "e-bikes", "bike-accessories",
  
  // Gaming
  "video-games", "ps5-games", "xbox-games", "nintendo-games", "pc-games",
  "gaming-consoles", "gaming-accessories", "gaming-controllers",
  "gaming-chairs", "gaming-desks", "gaming-keyboards", "gaming-mice",
  "vr-headsets", "gaming-headsets", "capture-cards", "stream-decks",
  
  // Baby & Kids
  "baby-gear", "strollers", "car-seats", "cribs", "high-chairs",
  "baby-monitors", "baby-clothes", "diapers", "baby-toys",
  "kids-toys", "dolls", "action-figures", "board-games", "puzzles",
  "kids-bikes", "outdoor-toys", "educational-toys",
  
  // Pet
  "dog-food", "cat-food", "pet-toys", "pet-beds", "pet-carriers",
  "dog-crates", "cat-trees", "aquariums", "pet-grooming",
  
  // Office
  "office-supplies", "desk-accessories", "file-organizers",
  "office-furniture", "ergonomic-chairs", "standing-desks",
  "paper", "notebooks", "planners", "pens", "markers"
] as const

export type Category = typeof categories[number]

// ============================================
// PRICE RANGES
// ============================================

export const priceRanges = [
  15, 20, 25, 30, 40, 50, 75, 100, 150, 200, 250, 300, 400, 500, 750, 1000, 1500, 2000
] as const

export type PriceRange = typeof priceRanges[number]

// ============================================
// SLUG PARSING UTILITIES
// ============================================

export interface ParsedDealSlug {
  type: 'brand' | 'category'
  entity: string
  price: number
  displayName: string
}

/**
 * Parse a slug like "amazon-under-50" or "laptops-under-500"
 * Returns null if invalid format
 */
export function parseDealSlug(slug: string): ParsedDealSlug | null {
  const match = slug.match(/^(.+)-under-(\d+)$/)
  if (!match) return null
  
  const [, entity, priceStr] = match
  const price = parseInt(priceStr, 10)
  
  if (isNaN(price) || price <= 0) return null
  
  // Check if it's a brand
  const normalizedEntity = entity.toLowerCase()
  const isBrand = brands.includes(normalizedEntity as Brand)
  const isCategory = categories.includes(normalizedEntity as Category)
  
  if (!isBrand && !isCategory) {
    // Allow unknown entities, default to category
    return {
      type: 'category',
      entity: normalizedEntity,
      price,
      displayName: formatDisplayName(entity)
    }
  }
  
  return {
    type: isBrand ? 'brand' : 'category',
    entity: normalizedEntity,
    price,
    displayName: formatDisplayName(entity)
  }
}

/**
 * Format a slug into a display name
 * e.g., "best-buy" -> "Best Buy", "laptops" -> "Laptops"
 */
export function formatDisplayName(slug: string): string {
  // Special cases for brand names
  const specialCases: Record<string, string> = {
    'amazon': 'Amazon',
    'best-buy': 'Best Buy',
    'macys': "Macy's",
    'kohls': "Kohl's",
    'levis': "Levi's",
    'h-m': 'H&M',
    'lowes': "Lowe's",
    'jcpenney': 'JCPenney',
    'dicks-sporting-goods': "Dick's Sporting Goods",
    'bass-pro-shops': 'Bass Pro Shops',
    'bed-bath-beyond': 'Bed Bath & Beyond',
    'crate-barrel': 'Crate & Barrel',
    't-fal': 'T-Fal',
    'lg': 'LG',
    'hp': 'HP',
    'jbl': 'JBL',
    'tcl': 'TCL',
    'msr': 'MSR',
    'dji': 'DJI',
    'ps5': 'PS5',
    'xbox-series-x': 'Xbox Series X',
    'pc-games': 'PC Games',
    'vr-headsets': 'VR Headsets',
    'tvs': 'TVs',
    '4k-tvs': '4K TVs',
    'oled-tvs': 'OLED TVs',
    'ssds': 'SSDs',
    'e-bikes': 'E-Bikes',
    'pots-pans': 'Pots & Pans',
    'cast-iron': 'Cast Iron',
    'non-stick': 'Non-Stick',
    'all-in-one-pcs': 'All-in-One PCs',
    'all-in-one-printers': 'All-in-One Printers',
    't-shirts': 'T-Shirts',
    'e-readers': 'E-Readers',
  }
  
  if (specialCases[slug]) {
    return specialCases[slug]
  }
  
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// ============================================
// STATIC PARAMS GENERATION
// ============================================

/**
 * Generate all static params for /deals/[slug]/page.tsx
 * This creates thousands of pages like:
 * - /deals/amazon-under-50
 * - /deals/nike-under-100
 * - /deals/laptops-under-500
 */
export function generateAllDealPageParams(): { slug: string }[] {
  const params: { slug: string }[] = []
  
  // Generate brand × price combinations
  for (const brand of brands) {
    for (const price of priceRanges) {
      params.push({ slug: `${brand}-under-${price}` })
    }
  }
  
  // Generate category × price combinations
  for (const category of categories) {
    for (const price of priceRanges) {
      params.push({ slug: `${category}-under-${price}` })
    }
  }
  
  return params
}

/**
 * Get total page count for SEO reporting
 */
export function getTotalPageCount(): {
  brandPages: number
  categoryPages: number
  total: number
} {
  const brandPages = brands.length * priceRanges.length
  const categoryPages = categories.length * priceRanges.length
  return {
    brandPages,
    categoryPages,
    total: brandPages + categoryPages
  }
}

// ============================================
// BRAND-CATEGORY RELATIONSHIPS (for cross-linking)
// ============================================

// Map brands to their most relevant categories
const brandCategoryMap: Record<string, string[]> = {
  // Electronics brands
  'apple': ['laptops', 'macbooks', 'smartphones', 'iphones', 'tablets', 'ipads', 'smartwatches', 'apple-watch', 'headphones', 'airpods'],
  'samsung': ['smartphones', 'android-phones', 'samsung-phones', 'tvs', 'smart-tvs', '4k-tvs', 'tablets', 'monitors', 'soundbars'],
  'sony': ['headphones', 'noise-cancelling', 'tvs', 'oled-tvs', 'cameras', 'gaming-consoles', 'ps5-games', 'speakers'],
  'lg': ['tvs', 'oled-tvs', '4k-tvs', 'monitors', 'soundbars', 'appliances', 'vacuums'],
  'dell': ['laptops', 'gaming-laptops', 'monitors', 'gaming-monitors', 'desktops', 'gaming-pcs'],
  'hp': ['laptops', 'printers', 'monitors', 'desktops', 'all-in-one-pcs'],
  'lenovo': ['laptops', 'gaming-laptops', 'chromebooks', 'tablets', 'desktops', 'monitors'],
  'microsoft': ['laptops', 'tablets', 'gaming-consoles', 'video-games', 'pc-games', 'gaming-accessories'],
  'bose': ['headphones', 'noise-cancelling', 'speakers', 'bluetooth-speakers', 'soundbars', 'wireless-earbuds'],
  'beats': ['headphones', 'wireless-earbuds', 'speakers', 'bluetooth-speakers'],
  'logitech': ['gaming-mice', 'gaming-keyboards', 'webcams', 'speakers', 'gaming-accessories', 'gaming-headsets'],
  
  // Fashion brands
  'nike': ['sneakers', 'running-shoes', 'basketball-shoes', 'activewear', 'athleisure', 'backpacks', 'hoodies'],
  'adidas': ['sneakers', 'running-shoes', 'activewear', 'athleisure', 'hoodies', 't-shirts'],
  'puma': ['sneakers', 'running-shoes', 'activewear', 'athleisure'],
  'under-armour': ['activewear', 'athleisure', 'running-shoes', 'fitness-equipment'],
  'north-face': ['jackets', 'coats', 'backpacks', 'hiking-boots', 'outdoor-gear'],
  'levis': ['jeans', 'pants', 'jackets', 'shorts'],
  'ralph-lauren': ['dress-shirts', 'suits', 'blazers', 'polo-shirts', 'watches'],
  
  // Retailers
  'amazon': ['laptops', 'headphones', 'tvs', 'tablets', 'smart-home', 'home-decor', 'kitchen-gadgets'],
  'walmart': ['tvs', 'laptops', 'home-decor', 'furniture', 'toys', 'groceries'],
  'target': ['home-decor', 'furniture', 'clothing', 'toys', 'beauty', 'kitchen'],
  'best-buy': ['laptops', 'tvs', 'gaming-consoles', 'headphones', 'cameras', 'smart-home'],
  'costco': ['tvs', 'laptops', 'appliances', 'furniture', 'outdoor-gear'],
  
  // Home brands
  'dyson': ['vacuums', 'cordless-vacuums', 'air-purifiers', 'hair-tools', 'fans', 'heaters'],
  'roomba': ['robot-vacuums', 'vacuums', 'smart-home'],
  'kitchenaid': ['mixers', 'blenders', 'food-processors', 'cookware', 'kitchen-gadgets'],
  'ninja': ['blenders', 'air-fryers', 'coffee-makers', 'food-processors'],
  'instant-pot': ['slow-cookers', 'air-fryers', 'rice-cookers', 'kitchen-gadgets'],
  
  // Gaming
  'playstation': ['gaming-consoles', 'ps5-games', 'video-games', 'gaming-accessories', 'gaming-headsets'],
  'xbox': ['gaming-consoles', 'xbox-games', 'video-games', 'gaming-accessories', 'gaming-headsets'],
  'nintendo': ['gaming-consoles', 'nintendo-games', 'video-games', 'gaming-accessories'],
  'razer': ['gaming-laptops', 'gaming-mice', 'gaming-keyboards', 'gaming-headsets', 'gaming-chairs'],
}

// Map categories to related categories
const categoryRelationMap: Record<string, string[]> = {
  'laptops': ['gaming-laptops', 'chromebooks', 'macbooks', 'ultrabooks', 'tablets', 'monitors'],
  'gaming-laptops': ['laptops', 'gaming-pcs', 'gaming-monitors', 'gaming-keyboards', 'gaming-mice'],
  'headphones': ['wireless-earbuds', 'airpods', 'noise-cancelling', 'gaming-headsets', 'speakers'],
  'wireless-earbuds': ['headphones', 'airpods', 'bluetooth-speakers'],
  'tvs': ['4k-tvs', 'oled-tvs', 'smart-tvs', 'soundbars', 'streaming-devices'],
  'smartphones': ['iphones', 'android-phones', 'samsung-phones', 'tablets', 'smartwatches'],
  'sneakers': ['running-shoes', 'basketball-shoes', 'casual-shoes', 'activewear'],
  'running-shoes': ['sneakers', 'fitness-equipment', 'activewear', 'fitness-trackers'],
  'vacuums': ['robot-vacuums', 'cordless-vacuums', 'steam-mops', 'air-purifiers'],
  'air-fryers': ['instant-pots', 'blenders', 'coffee-makers', 'kitchen-gadgets'],
  'gaming-consoles': ['video-games', 'gaming-accessories', 'gaming-headsets', 'gaming-chairs'],
}

// ============================================
// INTERNAL LINKING HELPERS
// ============================================

/**
 * Get related brand pages for internal linking
 * Deterministic selection based on brand name for consistent results
 */
export function getRelatedBrands(currentBrand: string, limit = 6): string[] {
  const filtered = brands.filter(b => b !== currentBrand)
  // Use deterministic "random" based on brand name hash for consistent results
  const seed = hashString(currentBrand)
  const shuffled = seededShuffle([...filtered], seed)
  return shuffled.slice(0, limit)
}

/**
 * Get related category pages for internal linking
 * Deterministic selection based on category name for consistent results
 */
export function getRelatedCategories(currentCategory: string, limit = 6): string[] {
  // First, try to get semantically related categories
  const related = categoryRelationMap[currentCategory] || []
  const validRelated = related.filter(c => categories.includes(c as Category))
  
  if (validRelated.length >= limit) {
    return validRelated.slice(0, limit)
  }
  
  // Fill remaining with other categories
  const filtered = categories.filter(c => c !== currentCategory && !validRelated.includes(c))
  const seed = hashString(currentCategory)
  const shuffled = seededShuffle([...filtered], seed)
  
  return [...validRelated, ...shuffled].slice(0, limit)
}

/**
 * Get related price ranges for internal linking
 * Returns nearby prices (lower and higher) for better navigation
 */
export function getRelatedPriceRanges(currentPrice: number, limit = 5): number[] {
  const currentIndex = priceRanges.indexOf(currentPrice as PriceRange)
  if (currentIndex === -1) {
    return priceRanges.slice(0, limit)
  }
  
  const nearby: number[] = []
  
  // Add 2-3 lower prices
  for (let i = currentIndex - 1; i >= 0 && nearby.length < 3; i--) {
    nearby.unshift(priceRanges[i])
  }
  
  // Add 2-3 higher prices
  for (let i = currentIndex + 1; i < priceRanges.length && nearby.length < limit; i++) {
    nearby.push(priceRanges[i])
  }
  
  return nearby
}

/**
 * Get categories related to a brand for cross-linking
 * e.g., Nike -> sneakers, running-shoes, activewear
 */
export function getCategoriesForBrand(brand: string, limit = 6): string[] {
  const relatedCategories = brandCategoryMap[brand] || []
  const validCategories = relatedCategories.filter(c => categories.includes(c as Category))
  
  if (validCategories.length >= limit) {
    return validCategories.slice(0, limit)
  }
  
  // Fill with popular categories
  const popularCategories = ['laptops', 'headphones', 'sneakers', 'tvs', 'smartphones', 'watches']
  const filtered = popularCategories.filter(c => !validCategories.includes(c))
  
  return [...validCategories, ...filtered].slice(0, limit)
}

/**
 * Get brands related to a category for cross-linking
 * e.g., sneakers -> Nike, Adidas, Puma
 */
export function getBrandsForCategory(category: string, limit = 6): string[] {
  const relatedBrands: string[] = []
  
  // Find brands that have this category in their map
  for (const [brand, cats] of Object.entries(brandCategoryMap)) {
    if (cats.includes(category)) {
      relatedBrands.push(brand)
    }
  }
  
  if (relatedBrands.length >= limit) {
    return relatedBrands.slice(0, limit)
  }
  
  // Fill with popular brands
  const popularBrands = ['amazon', 'walmart', 'target', 'best-buy', 'nike', 'apple', 'samsung']
  const filtered = popularBrands.filter(b => !relatedBrands.includes(b))
  
  return [...relatedBrands, ...filtered].slice(0, limit)
}

/**
 * Get comprehensive internal links for a deal page
 * Returns all related pages: nearby prices, related brands, related categories
 */
export interface InternalLinks {
  nearbyPrices: { slug: string; price: number; label: string }[]
  relatedBrands: { slug: string; brand: string; label: string }[]
  relatedCategories: { slug: string; category: string; label: string }[]
  crossLinks: { slug: string; entity: string; label: string }[] // Categories for brands or brands for categories
}

export function getInternalLinks(
  type: 'brand' | 'category',
  entity: string,
  price: number
): InternalLinks {
  const nearbyPrices = getRelatedPriceRanges(price, 5).map(p => ({
    slug: `${entity}-under-${p}`,
    price: p,
    label: `Under $${p}`
  }))
  
  const relatedBrands = getRelatedBrands(type === 'brand' ? entity : '', 6).map(brand => ({
    slug: `${brand}-under-${price}`,
    brand,
    label: formatDisplayName(brand)
  }))
  
  const relatedCategories = getRelatedCategories(type === 'category' ? entity : '', 6).map(category => ({
    slug: `${category}-under-${price}`,
    category,
    label: formatDisplayName(category)
  }))
  
  // Cross-links: if current page is a brand, link to related categories and vice versa
  const crossLinks = type === 'brand'
    ? getCategoriesForBrand(entity, 6).map(category => ({
        slug: `${category}-under-${price}`,
        entity: category,
        label: formatDisplayName(category)
      }))
    : getBrandsForCategory(entity, 6).map(brand => ({
        slug: `${brand}-under-${price}`,
        entity: brand,
        label: formatDisplayName(brand)
      }))
  
  return {
    nearbyPrices,
    relatedBrands,
    relatedCategories,
    crossLinks
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Simple string hash for deterministic "randomness"
 */
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

/**
 * Seeded shuffle for deterministic ordering
 */
function seededShuffle<T>(array: T[], seed: number): T[] {
  const result = [...array]
  let currentSeed = seed
  
  for (let i = result.length - 1; i > 0; i--) {
    currentSeed = (currentSeed * 1103515245 + 12345) & 0x7fffffff
    const j = currentSeed % (i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  
  return result
}

/**
 * Get featured brand × price combinations for sitemap priority
 */
export function getFeaturedBrandPrices(): { brand: string; price: number }[] {
  const featuredBrands = ['amazon', 'walmart', 'target', 'best-buy', 'nike', 'apple', 'samsung']
  const featuredPrices = [50, 100, 200, 500]
  
  const combinations: { brand: string; price: number }[] = []
  for (const brand of featuredBrands) {
    for (const price of featuredPrices) {
      combinations.push({ brand, price })
    }
  }
  return combinations
}

/**
 * Get featured category × price combinations for sitemap priority
 */
export function getFeaturedCategoryPrices(): { category: string; price: number }[] {
  const featuredCategories = ['laptops', 'headphones', 'sneakers', 'tvs', 'smartphones', 'gaming-laptops']
  const featuredPrices = [100, 200, 500, 1000]
  
  const combinations: { category: string; price: number }[] = []
  for (const category of featuredCategories) {
    for (const price of featuredPrices) {
      combinations.push({ category, price })
    }
  }
  return combinations
}
