/**
 * SEO Content Generator
 * Generates unique, keyword-optimized intro content for programmatic deal pages
 * Each page gets a 120-200 word intro with semantic keywords
 */

import type { ParsedDealSlug } from "@/data/deal-pages"

// ============================================
// SEMANTIC KEYWORD MAPS
// ============================================

// Brand-specific semantic keywords and context
const brandSemantics: Record<string, {
  adjectives: string[]
  productTypes: string[]
  audiences: string[]
  benefits: string[]
  occasions: string[]
}> = {
  // Electronics Retailers
  'amazon': {
    adjectives: ['top-rated', 'best-selling', 'customer-favorite', 'highly-reviewed'],
    productTypes: ['electronics', 'home essentials', 'everyday items', 'tech gadgets'],
    audiences: ['savvy shoppers', 'deal hunters', 'online shoppers', 'budget-conscious buyers'],
    benefits: ['fast shipping', 'easy returns', 'verified reviews', 'competitive prices'],
    occasions: ['any occasion', 'daily needs', 'gift-giving', 'home upgrades']
  },
  'best-buy': {
    adjectives: ['cutting-edge', 'premium', 'top-tier', 'latest'],
    productTypes: ['electronics', 'tech products', 'gadgets', 'smart devices'],
    audiences: ['tech enthusiasts', 'early adopters', 'gadget lovers', 'home theater fans'],
    benefits: ['expert advice', 'price matching', 'Geek Squad support', 'in-store pickup'],
    occasions: ['tech upgrades', 'home entertainment', 'gaming setups', 'office equipment']
  },
  'walmart': {
    adjectives: ['affordable', 'value-packed', 'everyday', 'family-friendly'],
    productTypes: ['household items', 'electronics', 'home goods', 'everyday essentials'],
    audiences: ['families', 'budget shoppers', 'everyday consumers', 'value seekers'],
    benefits: ['low prices', 'rollback deals', 'store pickup', 'wide selection'],
    occasions: ['weekly shopping', 'home needs', 'back-to-school', 'holiday shopping']
  },
  'target': {
    adjectives: ['stylish', 'trendy', 'affordable', 'designer-inspired'],
    productTypes: ['home decor', 'fashion', 'electronics', 'beauty products'],
    audiences: ['style-conscious shoppers', 'young professionals', 'families', 'design lovers'],
    benefits: ['exclusive brands', 'RedCard savings', 'same-day delivery', 'curated selection'],
    occasions: ['home makeovers', 'seasonal updates', 'gift shopping', 'self-care']
  },
  
  // Fashion Brands
  'nike': {
    adjectives: ['iconic', 'performance-driven', 'athletic', 'innovative'],
    productTypes: ['sneakers', 'athletic wear', 'sportswear', 'training gear'],
    audiences: ['athletes', 'fitness enthusiasts', 'sneakerheads', 'active lifestyle seekers'],
    benefits: ['superior comfort', 'innovative technology', 'durability', 'style versatility'],
    occasions: ['workouts', 'running', 'casual wear', 'sports activities']
  },
  'adidas': {
    adjectives: ['classic', 'performance-ready', 'street-style', 'sustainable'],
    productTypes: ['sneakers', 'activewear', 'athleisure', 'sports gear'],
    audiences: ['athletes', 'streetwear fans', 'eco-conscious buyers', 'fitness lovers'],
    benefits: ['sustainable materials', 'Boost technology', 'iconic design', 'comfort'],
    occasions: ['training', 'casual outings', 'sports', 'everyday wear']
  },
  'north-face': {
    adjectives: ['rugged', 'adventure-ready', 'weather-resistant', 'expedition-grade'],
    productTypes: ['jackets', 'outdoor gear', 'backpacks', 'hiking equipment'],
    audiences: ['outdoor enthusiasts', 'adventurers', 'hikers', 'travelers'],
    benefits: ['weather protection', 'durability', 'thermal insulation', 'lightweight design'],
    occasions: ['hiking trips', 'camping', 'winter weather', 'outdoor adventures']
  },
  
  // Electronics Brands
  'apple': {
    adjectives: ['premium', 'sleek', 'innovative', 'industry-leading'],
    productTypes: ['MacBooks', 'iPhones', 'iPads', 'AirPods', 'Apple Watch'],
    audiences: ['creatives', 'professionals', 'tech enthusiasts', 'Apple ecosystem users'],
    benefits: ['seamless integration', 'long-term support', 'privacy features', 'build quality'],
    occasions: ['productivity', 'creative work', 'everyday computing', 'mobile communication']
  },
  'samsung': {
    adjectives: ['feature-rich', 'versatile', 'cutting-edge', 'award-winning'],
    productTypes: ['smartphones', 'TVs', 'tablets', 'monitors', 'appliances'],
    audiences: ['tech lovers', 'Android users', 'home entertainment fans', 'power users'],
    benefits: ['brilliant displays', 'advanced cameras', 'smart features', 'wide compatibility'],
    occasions: ['entertainment', 'mobile computing', 'smart home', 'productivity']
  },
  'sony': {
    adjectives: ['legendary', 'audiophile-grade', 'cinematic', 'professional-quality'],
    productTypes: ['headphones', 'TVs', 'cameras', 'PlayStation', 'speakers'],
    audiences: ['audiophiles', 'movie lovers', 'gamers', 'content creators'],
    benefits: ['superior sound quality', 'stunning visuals', 'noise cancellation', 'durability'],
    occasions: ['entertainment', 'content creation', 'gaming', 'music listening']
  },
  'bose': {
    adjectives: ['premium', 'noise-cancelling', 'crystal-clear', 'audiophile-approved'],
    productTypes: ['headphones', 'speakers', 'soundbars', 'earbuds'],
    audiences: ['audiophiles', 'frequent travelers', 'music lovers', 'remote workers'],
    benefits: ['industry-leading noise cancellation', 'rich sound', 'comfort', 'battery life'],
    occasions: ['travel', 'work from home', 'music enjoyment', 'focus time']
  },
  
  // Home Brands
  'dyson': {
    adjectives: ['revolutionary', 'powerful', 'innovative', 'premium'],
    productTypes: ['vacuums', 'air purifiers', 'hair tools', 'fans'],
    audiences: ['homeowners', 'allergy sufferers', 'clean freaks', 'tech-forward buyers'],
    benefits: ['powerful suction', 'HEPA filtration', 'cordless convenience', 'innovative design'],
    occasions: ['spring cleaning', 'home maintenance', 'allergy season', 'daily cleaning']
  },
  'kitchenaid': {
    adjectives: ['professional-grade', 'iconic', 'versatile', 'durable'],
    productTypes: ['stand mixers', 'blenders', 'food processors', 'cookware'],
    audiences: ['home bakers', 'cooking enthusiasts', 'professional chefs', 'newlyweds'],
    benefits: ['powerful motors', 'endless attachments', 'lifetime durability', 'beautiful design'],
    occasions: ['holiday baking', 'meal prep', 'wedding registries', 'kitchen upgrades']
  },
  
  // Gaming
  'playstation': {
    adjectives: ['next-gen', 'immersive', 'exclusive', 'powerful'],
    productTypes: ['PS5 consoles', 'games', 'controllers', 'VR headsets'],
    audiences: ['gamers', 'PlayStation fans', 'entertainment seekers', 'families'],
    benefits: ['exclusive titles', 'fast loading', 'stunning graphics', 'immersive gameplay'],
    occasions: ['gaming sessions', 'gift-giving', 'entertainment upgrades', 'weekend fun']
  },
  'nintendo': {
    adjectives: ['family-friendly', 'portable', 'creative', 'nostalgic'],
    productTypes: ['Switch consoles', 'games', 'controllers', 'accessories'],
    audiences: ['families', 'casual gamers', 'Nintendo fans', 'all ages'],
    benefits: ['portability', 'local multiplayer', 'exclusive franchises', 'fun for all ages'],
    occasions: ['family game nights', 'travel', 'parties', 'kid-friendly gaming']
  },
}

// Category-specific semantic keywords
const categorySemantics: Record<string, {
  adjectives: string[]
  features: string[]
  audiences: string[]
  useCases: string[]
  buyingTips: string[]
}> = {
  // Electronics
  'laptops': {
    adjectives: ['powerful', 'portable', 'lightweight', 'high-performance'],
    features: ['fast processors', 'ample storage', 'long battery life', 'crisp displays'],
    audiences: ['students', 'professionals', 'remote workers', 'content creators'],
    useCases: ['work', 'school', 'entertainment', 'creative projects'],
    buyingTips: ['processor speed', 'RAM capacity', 'storage type', 'display quality']
  },
  'gaming-laptops': {
    adjectives: ['high-powered', 'immersive', 'VR-ready', 'RGB-lit'],
    features: ['dedicated GPUs', 'high refresh displays', 'advanced cooling', 'mechanical keyboards'],
    audiences: ['gamers', 'streamers', 'esports players', 'power users'],
    useCases: ['AAA gaming', 'streaming', 'video editing', 'VR experiences'],
    buyingTips: ['GPU performance', 'cooling system', 'display refresh rate', 'portability']
  },
  'headphones': {
    adjectives: ['immersive', 'comfortable', 'premium', 'wireless'],
    features: ['noise cancellation', 'long battery life', 'premium drivers', 'comfortable padding'],
    audiences: ['music lovers', 'commuters', 'remote workers', 'audiophiles'],
    useCases: ['music listening', 'work calls', 'travel', 'focused work'],
    buyingTips: ['sound signature', 'comfort fit', 'noise cancellation level', 'battery life']
  },
  'wireless-earbuds': {
    adjectives: ['compact', 'convenient', 'truly wireless', 'waterproof'],
    features: ['touch controls', 'fast charging', 'secure fit', 'transparency mode'],
    audiences: ['fitness enthusiasts', 'commuters', 'busy professionals', 'podcast fans'],
    useCases: ['workouts', 'commuting', 'calls on the go', 'casual listening'],
    buyingTips: ['fit security', 'water resistance', 'case battery', 'call quality']
  },
  'tvs': {
    adjectives: ['stunning', 'cinematic', 'smart', 'immersive'],
    features: ['4K resolution', 'HDR support', 'smart platform', 'thin bezels'],
    audiences: ['movie lovers', 'sports fans', 'families', 'gamers'],
    useCases: ['movie nights', 'sports viewing', 'gaming', 'streaming'],
    buyingTips: ['screen size', 'panel type', 'smart features', 'HDMI ports']
  },
  'smartwatches': {
    adjectives: ['connected', 'health-tracking', 'stylish', 'feature-packed'],
    features: ['heart rate monitoring', 'GPS tracking', 'app ecosystem', 'water resistance'],
    audiences: ['fitness enthusiasts', 'busy professionals', 'health-conscious users', 'tech lovers'],
    useCases: ['fitness tracking', 'notifications', 'health monitoring', 'contactless payments'],
    buyingTips: ['phone compatibility', 'battery life', 'health features', 'style options']
  },
  
  // Fashion
  'sneakers': {
    adjectives: ['stylish', 'comfortable', 'versatile', 'trendy'],
    features: ['cushioned soles', 'breathable materials', 'supportive design', 'durable construction'],
    audiences: ['sneakerheads', 'casual wearers', 'athletes', 'fashion enthusiasts'],
    useCases: ['everyday wear', 'light exercise', 'casual outings', 'street style'],
    buyingTips: ['proper fit', 'arch support', 'material quality', 'style versatility']
  },
  'running-shoes': {
    adjectives: ['responsive', 'cushioned', 'lightweight', 'breathable'],
    features: ['energy return', 'shock absorption', 'secure lockdown', 'traction outsoles'],
    audiences: ['runners', 'fitness enthusiasts', 'marathon trainers', 'casual joggers'],
    useCases: ['road running', 'trail running', 'gym workouts', 'daily training'],
    buyingTips: ['gait analysis', 'cushioning level', 'drop height', 'durability']
  },
  
  // Home & Kitchen
  'vacuums': {
    adjectives: ['powerful', 'efficient', 'versatile', 'easy-to-use'],
    features: ['strong suction', 'HEPA filtration', 'multiple attachments', 'easy emptying'],
    audiences: ['homeowners', 'pet owners', 'allergy sufferers', 'apartment dwellers'],
    useCases: ['whole-home cleaning', 'pet hair removal', 'quick cleanups', 'deep cleaning'],
    buyingTips: ['suction power', 'filtration type', 'cord vs cordless', 'dustbin capacity']
  },
  'robot-vacuums': {
    adjectives: ['autonomous', 'smart', 'convenient', 'hands-free'],
    features: ['mapping technology', 'app control', 'auto-emptying', 'obstacle avoidance'],
    audiences: ['busy professionals', 'tech enthusiasts', 'pet owners', 'elderly homeowners'],
    useCases: ['daily maintenance', 'scheduled cleaning', 'pet hair management', 'hard floors'],
    buyingTips: ['navigation system', 'suction power', 'battery life', 'smart features']
  },
  'air-fryers': {
    adjectives: ['healthy', 'convenient', 'versatile', 'fast'],
    features: ['rapid air technology', 'easy cleanup', 'preset programs', 'large capacity'],
    audiences: ['health-conscious cooks', 'busy families', 'small kitchen owners', 'beginners'],
    useCases: ['crispy cooking', 'reheating', 'healthy meals', 'quick dinners'],
    buyingTips: ['basket size', 'wattage', 'preset options', 'ease of cleaning']
  },
  'coffee-makers': {
    adjectives: ['aromatic', 'programmable', 'barista-quality', 'convenient'],
    features: ['brew strength control', 'thermal carafe', 'programmable timer', 'built-in grinder'],
    audiences: ['coffee lovers', 'busy professionals', 'home baristas', 'office workers'],
    useCases: ['morning routines', 'entertaining guests', 'work from home', 'afternoon pick-me-ups'],
    buyingTips: ['brew capacity', 'carafe type', 'programmability', 'coffee type compatibility']
  },
  
  // Gaming
  'gaming-consoles': {
    adjectives: ['next-generation', 'powerful', 'immersive', 'connected'],
    features: ['fast loading', '4K gaming', 'online multiplayer', 'exclusive titles'],
    audiences: ['gamers', 'families', 'entertainment enthusiasts', 'streamers'],
    useCases: ['gaming sessions', 'family entertainment', 'streaming media', 'social gaming'],
    buyingTips: ['exclusive games', 'storage capacity', 'controller features', 'backward compatibility']
  },
  'video-games': {
    adjectives: ['immersive', 'engaging', 'award-winning', 'action-packed'],
    features: ['stunning graphics', 'compelling stories', 'multiplayer modes', 'DLC content'],
    audiences: ['casual gamers', 'hardcore players', 'families', 'collectors'],
    useCases: ['solo adventures', 'co-op play', 'online competition', 'relaxation'],
    buyingTips: ['genre preference', 'platform compatibility', 'multiplayer options', 'content rating']
  },
}

// ============================================
// INTRO TEMPLATES BY TYPE
// ============================================

// Templates for brand pages - each produces 120-200 words
const brandIntroTemplates = [
  // Template 1: Value-focused
  (brand: string, price: number, semantics: typeof brandSemantics[string], year: number) => 
    `Looking for ${semantics.adjectives[0]} ${brand} products without breaking the bank? Our curated collection of ${brand} deals under $${price} brings you ${semantics.productTypes.slice(0, 3).join(', ')} at prices that make sense. Whether you're a ${semantics.audiences[0]} or simply seeking ${semantics.benefits[0]}, these budget-friendly ${brand} options deliver exceptional value.

We compare prices across Amazon, Walmart, Target, Best Buy, and dozens of authorized retailers to find the deepest discounts on authentic ${brand} products. Every deal is verified hourly to ensure accuracy and availability. From ${semantics.occasions[0]} to ${semantics.occasions[2]}, discover ${brand} items that fit your budget and lifestyle.

Save smart on ${semantics.productTypes[0]} and ${semantics.productTypes[1]} with our ${year} collection of ${brand} deals under $${price}. ${semantics.audiences[1]} trust SaveSmart to surface the best values, and our AI-powered deal finder ensures you never overpay. Start exploring and find your perfect ${brand} deal today.`,

  // Template 2: Discovery-focused
  (brand: string, price: number, semantics: typeof brandSemantics[string], year: number) =>
    `Discover ${year}'s best ${brand} deals under $${price} right here at SaveSmart. From ${semantics.adjectives[1]} ${semantics.productTypes[0]} to ${semantics.adjectives[2]} ${semantics.productTypes[1]}, we've gathered ${semantics.audiences[2]}-approved products that won't stretch your wallet.

${brand} is known for ${semantics.benefits[1]} and ${semantics.benefits[2]}, and now you can experience these benefits at accessible price points. Our deal hunters scan major retailers around the clock, bringing you verified discounts on genuine ${brand} merchandise. Perfect for ${semantics.occasions[1]} or treating yourself without guilt.

Whether you need ${semantics.productTypes[2]} for work, play, or ${semantics.occasions[3]}, these under $${price} ${brand} options prove that quality doesn't require a premium price tag. ${semantics.audiences[3]} love our selection because every deal is hand-picked for value and authenticity. Browse our ${brand} collection and see why thousands of shoppers save with us daily.`,

  // Template 3: Comparison-focused
  (brand: string, price: number, semantics: typeof brandSemantics[string], year: number) =>
    `Finding authentic ${brand} products under $${price} used to mean endless searching across multiple stores. Not anymore. SaveSmart aggregates ${brand} deals from Amazon, Walmart, Best Buy, Target, and 50+ other retailers—all in one place. Our ${year} collection features ${semantics.adjectives[0]} ${semantics.productTypes[0]}, ${semantics.productTypes[1]}, and more.

${brand} delivers on ${semantics.benefits[0]} and ${semantics.benefits[3]}, making these deals even more valuable. Whether you're shopping for ${semantics.occasions[0]} or searching for the perfect gift, our under $${price} selection has ${semantics.audiences[0]} covered.

Each listing shows the original price, current sale price, and discount percentage so you know exactly what you're saving. ${semantics.audiences[2]} appreciate our transparent approach and verified deals. From ${semantics.productTypes[2]} essentials to ${semantics.adjectives[3]} ${semantics.productTypes[3] || semantics.productTypes[0]}, your budget-friendly ${brand} shopping starts here.`,
]

// Templates for category pages - each produces 120-200 words
const categoryIntroTemplates = [
  // Template 1: Budget-focused
  (category: string, price: number, semantics: typeof categorySemantics[string], year: number) =>
    `Shopping for ${semantics.adjectives[0]} ${category} under $${price}? Our ${year} collection brings together the best budget-friendly options with ${semantics.features[0]}, ${semantics.features[1]}, and ${semantics.features[2]}. Perfect for ${semantics.audiences[0]} and ${semantics.audiences[1]} who want quality without the premium price tag.

We track prices across Amazon, Best Buy, Walmart, Target, and specialty retailers to find ${category} that deliver genuine value. Whether you need ${category} for ${semantics.useCases[0]} or ${semantics.useCases[2]}, our under $${price} picks offer impressive features at accessible prices.

When shopping for ${category}, consider ${semantics.buyingTips[0]} and ${semantics.buyingTips[1]}. Our curated deals highlight products that excel in these areas while staying budget-friendly. ${semantics.audiences[2]} trust SaveSmart to surface verified discounts daily. Start browsing and find ${semantics.adjectives[2]} ${category} that fit your needs and budget.`,

  // Template 2: Feature-focused
  (category: string, price: number, semantics: typeof categorySemantics[string], year: number) =>
    `Discover ${semantics.adjectives[1]} ${category} under $${price} that don't compromise on quality. In ${year}, you'll find options featuring ${semantics.features[0]} and ${semantics.features[3]}—all within your budget. Ideal for ${semantics.audiences[2]} seeking reliable ${category} for ${semantics.useCases[1]} and beyond.

Our deal-finding AI compares prices across 100+ retailers, surfacing only the best ${category} discounts. Each listing is verified hourly, showing original prices alongside current deals so you can see exactly how much you're saving. From trusted brands to emerging favorites, we cover the full spectrum.

Before buying ${category}, experts recommend checking ${semantics.buyingTips[2]} and ${semantics.buyingTips[3]}. Our collection makes this easy by featuring ${category} that score well in these categories while remaining under $${price}. ${semantics.audiences[3]} appreciate our focus on value and quality. Explore today and find ${category} perfect for ${semantics.useCases[3]}.`,

  // Template 3: Use-case focused
  (category: string, price: number, semantics: typeof categorySemantics[string], year: number) =>
    `Need ${semantics.adjectives[2]} ${category} for ${semantics.useCases[0]}? Our under $${price} collection in ${year} delivers exactly that. From budget picks ideal for ${semantics.audiences[0]} to ${semantics.adjectives[3]} options for ${semantics.audiences[3]}, there's something for every need and budget.

Great ${category} should offer ${semantics.features[1]} and ${semantics.features[2]}. Even at prices under $${price}, you'll find options that check these boxes. We scan Amazon, Walmart, Best Buy, and dozens more retailers to bring you the deepest discounts on quality ${category}.

Shopping tips: prioritize ${semantics.buyingTips[0]} for ${semantics.useCases[2]}, or focus on ${semantics.buyingTips[1]} if ${semantics.useCases[1]} is your main use case. Our verified deals make comparison easy—see prices from multiple stores, read savings percentages, and shop with confidence. ${semantics.audiences[1]} save an average of 30% shopping with SaveSmart.`,
]

// ============================================
// CONTENT GENERATION FUNCTIONS
// ============================================

/**
 * Get a deterministic template index based on entity and price
 * Ensures same page always gets same template for consistency
 */
function getTemplateIndex(entity: string, price: number, templateCount: number): number {
  let hash = 0
  const str = `${entity}-${price}`
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash) % templateCount
}

/**
 * Get default semantics for unknown brands
 */
function getDefaultBrandSemantics(): typeof brandSemantics[string] {
  return {
    adjectives: ['quality', 'popular', 'trusted', 'well-reviewed'],
    productTypes: ['products', 'items', 'essentials', 'goods'],
    audiences: ['smart shoppers', 'value seekers', 'deal hunters', 'budget-conscious buyers'],
    benefits: ['great value', 'quality construction', 'reliable performance', 'customer satisfaction'],
    occasions: ['everyday needs', 'gift-giving', 'personal use', 'home essentials']
  }
}

/**
 * Get default semantics for unknown categories
 */
function getDefaultCategorySemantics(): typeof categorySemantics[string] {
  return {
    adjectives: ['quality', 'affordable', 'reliable', 'popular'],
    features: ['great build quality', 'user-friendly design', 'durable materials', 'modern features'],
    audiences: ['everyday shoppers', 'first-time buyers', 'budget-conscious consumers', 'deal hunters'],
    useCases: ['daily use', 'home use', 'personal needs', 'general purposes'],
    buyingTips: ['quality', 'reviews', 'warranty', 'brand reputation']
  }
}

/**
 * Generate unique SEO intro content for a deal page
 * Returns 120-200 word intro optimized for the target keyword
 */
export function generateSEOIntro(parsed: ParsedDealSlug): string {
  const { type, entity, price, displayName } = parsed
  const year = new Date().getFullYear()
  
  if (type === 'brand') {
    const semantics = brandSemantics[entity] || getDefaultBrandSemantics()
    const templateIndex = getTemplateIndex(entity, price, brandIntroTemplates.length)
    const template = brandIntroTemplates[templateIndex]
    return template(displayName, price, semantics, year)
  }
  
  // Category page
  const semantics = categorySemantics[entity] || getDefaultCategorySemantics()
  const templateIndex = getTemplateIndex(entity, price, categoryIntroTemplates.length)
  const template = categoryIntroTemplates[templateIndex]
  return template(displayName.toLowerCase(), price, semantics, year)
}

/**
 * Generate meta description for SEO (150-160 characters)
 */
export function generateMetaDescription(parsed: ParsedDealSlug): string {
  const { type, displayName, price } = parsed
  const year = new Date().getFullYear()
  
  if (type === 'brand') {
    return `Find the best ${displayName} deals under $${price} in ${year}. Compare prices from Amazon, Walmart & more. Verified discounts updated hourly.`
  }
  
  return `Shop ${displayName.toLowerCase()} under $${price} - compare prices & save in ${year}. Verified deals from top retailers. Free shipping options available.`
}

/**
 * Generate title tag for SEO (50-60 characters)
 */
export function generateTitleTag(parsed: ParsedDealSlug): string {
  const { type, displayName, price } = parsed
  const year = new Date().getFullYear()
  
  if (type === 'brand') {
    return `Best ${displayName} Deals Under $${price} (${year}) | SaveSmart`
  }
  
  return `${displayName} Under $${price} - Best Deals ${year} | SaveSmart`
}

/**
 * Generate H1 heading variations
 */
export function generateH1(parsed: ParsedDealSlug, variant: 'default' | 'deals' | 'savings' = 'default'): string {
  const { type, displayName, price } = parsed
  
  const variants = {
    default: type === 'brand' 
      ? `Best ${displayName} Deals Under $${price}`
      : `Best ${displayName} Under $${price}`,
    deals: type === 'brand'
      ? `${displayName} Deals & Discounts Under $${price}`
      : `${displayName} Deals Under $${price}`,
    savings: type === 'brand'
      ? `Save on ${displayName} Products Under $${price}`
      : `Save on ${displayName} Under $${price}`
  }
  
  return variants[variant]
}
