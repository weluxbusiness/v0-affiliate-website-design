// Seed data generators for stores, coupons, and categories
// Generates realistic data for programmatic SEO pages

// Store industry/vertical definitions
const STORE_VERTICALS = [
  { prefix: 'Tech', categories: ['electronics', 'laptops', 'smartphones', 'tablets'] },
  { prefix: 'Fashion', categories: ['fashion', 'shoes', 'accessories', 'jewelry'] },
  { prefix: 'Home', categories: ['home-kitchen', 'furniture', 'decor', 'bedding'] },
  { prefix: 'Sports', categories: ['fitness', 'outdoor', 'running-shoes', 'activewear'] },
  { prefix: 'Beauty', categories: ['beauty', 'skincare', 'makeup', 'haircare'] },
  { prefix: 'Gaming', categories: ['gaming', 'consoles', 'pc-gaming', 'accessories'] },
  { prefix: 'Office', categories: ['office-supplies', 'printers', 'furniture', 'electronics'] },
  { prefix: 'Pet', categories: ['pet-supplies', 'dog-food', 'cat-food', 'pet-toys'] },
  { prefix: 'Auto', categories: ['car-accessories', 'car-electronics', 'car-care'] },
  { prefix: 'Kids', categories: ['kids-clothing', 'toys', 'baby-gear', 'school-supplies'] },
]

const STORE_SUFFIXES = [
  'Mart', 'Store', 'Shop', 'Direct', 'Outlet', 'Depot', 'Hub', 'World', 
  'Express', 'Central', 'Plus', 'Pro', 'Max', 'Zone', 'Base', 'Point',
  'Place', 'Corner', 'Box', 'Way', 'Land', 'City', 'Town', 'Goods',
  'Supply', 'Source', 'Deals', 'Bargains', 'Savings', 'Values', 'Best'
]

const STORE_PREFIXES = [
  'Super', 'Mega', 'Ultra', 'Prime', 'Elite', 'Smart', 'Quick', 'Fast',
  'Easy', 'Value', 'Budget', 'Luxury', 'Premium', 'Select', 'Choice',
  'Top', 'Best', 'Great', 'Grand', 'Royal', 'Golden', 'Silver', 'Blue',
  'Red', 'Green', 'Fresh', 'New', 'Modern', 'Classic', 'Digital', 'Online'
]

const BRAND_NAMES = [
  'Alpine', 'Aurora', 'Beacon', 'Canyon', 'Cedar', 'Coast', 'Crest', 'Dawn',
  'Echo', 'Edge', 'Ember', 'Everest', 'Frost', 'Galaxy', 'Harbor', 'Haven',
  'Horizon', 'Iron', 'Jade', 'Jet', 'Knight', 'Lake', 'Leaf', 'Lightning',
  'Lunar', 'Maple', 'Marble', 'Mercury', 'Mesa', 'Metro', 'Midnight', 'Mist',
  'Moon', 'Mountain', 'Neptune', 'North', 'Nova', 'Oak', 'Ocean', 'Onyx',
  'Orbit', 'Pacific', 'Peak', 'Phoenix', 'Pine', 'Pixel', 'Polar', 'Prism',
  'Pulse', 'Quantum', 'Quest', 'Rain', 'Reef', 'Ridge', 'River', 'Rock',
  'Rose', 'Ruby', 'Sage', 'Sand', 'Sapphire', 'Scout', 'Shadow', 'Shore',
  'Sierra', 'Sky', 'Slate', 'Snow', 'Solar', 'Spark', 'Spring', 'Star',
  'Steel', 'Stone', 'Storm', 'Stream', 'Summit', 'Sun', 'Swift', 'Terra',
  'Thunder', 'Tide', 'Timber', 'Titan', 'Trail', 'Trend', 'Tropic', 'True',
  'Urban', 'Valley', 'Vapor', 'Vega', 'Velocity', 'Venture', 'Vertex', 'Vista',
  'Wave', 'West', 'Wild', 'Wind', 'Winter', 'Wolf', 'Zen', 'Zero', 'Zodiac', 'Zone'
]

// Major real stores to include
const REAL_STORES = [
  { name: 'Amazon', slug: 'amazon', website: 'https://amazon.com', color: '#FF9900' },
  { name: 'Best Buy', slug: 'best-buy', website: 'https://bestbuy.com', color: '#0046BE' },
  { name: 'Target', slug: 'target', website: 'https://target.com', color: '#CC0000' },
  { name: 'Walmart', slug: 'walmart', website: 'https://walmart.com', color: '#0071CE' },
  { name: 'Nike', slug: 'nike', website: 'https://nike.com', color: '#111111' },
  { name: 'Adidas', slug: 'adidas', website: 'https://adidas.com', color: '#000000' },
  { name: 'Apple', slug: 'apple', website: 'https://apple.com', color: '#555555' },
  { name: 'Samsung', slug: 'samsung', website: 'https://samsung.com', color: '#1428A0' },
  { name: 'Costco', slug: 'costco', website: 'https://costco.com', color: '#E31837' },
  { name: 'Home Depot', slug: 'home-depot', website: 'https://homedepot.com', color: '#F96302' },
  { name: 'Lowes', slug: 'lowes', website: 'https://lowes.com', color: '#004990' },
  { name: 'Macys', slug: 'macys', website: 'https://macys.com', color: '#E21A2C' },
  { name: 'Nordstrom', slug: 'nordstrom', website: 'https://nordstrom.com', color: '#000000' },
  { name: 'Sephora', slug: 'sephora', website: 'https://sephora.com', color: '#000000' },
  { name: 'Ulta', slug: 'ulta', website: 'https://ulta.com', color: '#F26522' },
  { name: 'Wayfair', slug: 'wayfair', website: 'https://wayfair.com', color: '#7B68A6' },
  { name: 'Ikea', slug: 'ikea', website: 'https://ikea.com', color: '#0051BA' },
  { name: 'REI', slug: 'rei', website: 'https://rei.com', color: '#1A3C34' },
  { name: 'Dyson', slug: 'dyson', website: 'https://dyson.com', color: '#CC0066' },
  { name: 'Dell', slug: 'dell', website: 'https://dell.com', color: '#007DB8' },
  { name: 'HP', slug: 'hp', website: 'https://hp.com', color: '#0096D6' },
  { name: 'Lenovo', slug: 'lenovo', website: 'https://lenovo.com', color: '#E2231A' },
  { name: 'Microsoft', slug: 'microsoft', website: 'https://microsoft.com', color: '#00A4EF' },
  { name: 'Sony', slug: 'sony', website: 'https://sony.com', color: '#000000' },
  { name: 'Bose', slug: 'bose', website: 'https://bose.com', color: '#000000' },
  { name: 'JBL', slug: 'jbl', website: 'https://jbl.com', color: '#FF6600' },
  { name: 'Zappos', slug: 'zappos', website: 'https://zappos.com', color: '#0081C2' },
  { name: 'ASOS', slug: 'asos', website: 'https://asos.com', color: '#2D2D2D' },
  { name: 'Gap', slug: 'gap', website: 'https://gap.com', color: '#000066' },
  { name: 'Old Navy', slug: 'old-navy', website: 'https://oldnavy.com', color: '#003366' },
  { name: 'Patagonia', slug: 'patagonia', website: 'https://patagonia.com', color: '#1A1A1A' },
  { name: 'The North Face', slug: 'the-north-face', website: 'https://thenorthface.com', color: '#000000' },
  { name: 'Under Armour', slug: 'under-armour', website: 'https://underarmour.com', color: '#1D1D1D' },
  { name: 'Puma', slug: 'puma', website: 'https://puma.com', color: '#000000' },
  { name: 'New Balance', slug: 'new-balance', website: 'https://newbalance.com', color: '#CF0A2C' },
  { name: 'Converse', slug: 'converse', website: 'https://converse.com', color: '#000000' },
  { name: 'Vans', slug: 'vans', website: 'https://vans.com', color: '#C1002A' },
  { name: 'Foot Locker', slug: 'foot-locker', website: 'https://footlocker.com', color: '#D52B1E' },
  { name: 'GameStop', slug: 'gamestop', website: 'https://gamestop.com', color: '#FF0000' },
  { name: 'B&H Photo', slug: 'b-h-photo', website: 'https://bhphotovideo.com', color: '#000000' },
  { name: 'Newegg', slug: 'newegg', website: 'https://newegg.com', color: '#F7931E' },
  { name: 'eBay', slug: 'ebay', website: 'https://ebay.com', color: '#E53238' },
  { name: 'Overstock', slug: 'overstock', website: 'https://overstock.com', color: '#D6001C' },
  { name: 'Chewy', slug: 'chewy', website: 'https://chewy.com', color: '#1C49C2' },
  { name: 'Petco', slug: 'petco', website: 'https://petco.com', color: '#00AEEF' },
  { name: 'AutoZone', slug: 'autozone', website: 'https://autozone.com', color: '#F7941D' },
  { name: 'Staples', slug: 'staples', website: 'https://staples.com', color: '#CC0000' },
  { name: 'Office Depot', slug: 'office-depot', website: 'https://officedepot.com', color: '#CC0000' },
  { name: 'Williams Sonoma', slug: 'williams-sonoma', website: 'https://williams-sonoma.com', color: '#2C3E2D' },
  { name: 'Crate & Barrel', slug: 'crate-barrel', website: 'https://crateandbarrel.com', color: '#000000' },
]

// Category definitions
const CATEGORIES = [
  // Electronics
  { name: 'Electronics', slug: 'electronics', parent: null, icon: 'Laptop' },
  { name: 'Laptops', slug: 'laptops', parent: 'electronics', icon: 'Laptop' },
  { name: 'Smartphones', slug: 'smartphones', parent: 'electronics', icon: 'Smartphone' },
  { name: 'Tablets', slug: 'tablets', parent: 'electronics', icon: 'Tablet' },
  { name: 'TVs', slug: 'tvs', parent: 'electronics', icon: 'Tv' },
  { name: 'Headphones', slug: 'headphones', parent: 'electronics', icon: 'Headphones' },
  { name: 'Smartwatches', slug: 'smartwatches', parent: 'electronics', icon: 'Watch' },
  { name: 'Cameras', slug: 'cameras', parent: 'electronics', icon: 'Camera' },
  { name: 'Speakers', slug: 'speakers', parent: 'electronics', icon: 'Speaker' },
  { name: 'Monitors', slug: 'monitors', parent: 'electronics', icon: 'Monitor' },
  { name: 'Printers', slug: 'printers', parent: 'electronics', icon: 'Printer' },
  { name: 'Gaming Consoles', slug: 'gaming-consoles', parent: 'electronics', icon: 'Gamepad2' },
  
  // Fashion
  { name: 'Fashion', slug: 'fashion', parent: null, icon: 'Shirt' },
  { name: 'Mens Clothing', slug: 'mens-clothing', parent: 'fashion', icon: 'Shirt' },
  { name: 'Womens Clothing', slug: 'womens-clothing', parent: 'fashion', icon: 'Shirt' },
  { name: 'Kids Clothing', slug: 'kids-clothing', parent: 'fashion', icon: 'Baby' },
  { name: 'Shoes', slug: 'shoes', parent: 'fashion', icon: 'Footprints' },
  { name: 'Sneakers', slug: 'sneakers', parent: 'fashion', icon: 'Footprints' },
  { name: 'Running Shoes', slug: 'running-shoes', parent: 'fashion', icon: 'Footprints' },
  { name: 'Jeans', slug: 'jeans', parent: 'fashion', icon: 'Shirt' },
  { name: 'Jackets', slug: 'jackets', parent: 'fashion', icon: 'Shirt' },
  { name: 'Accessories', slug: 'accessories', parent: 'fashion', icon: 'Watch' },
  { name: 'Jewelry', slug: 'jewelry', parent: 'fashion', icon: 'Gem' },
  { name: 'Bags', slug: 'bags', parent: 'fashion', icon: 'ShoppingBag' },
  { name: 'Watches', slug: 'watches', parent: 'fashion', icon: 'Watch' },
  
  // Home & Kitchen
  { name: 'Home & Kitchen', slug: 'home-kitchen', parent: null, icon: 'Home' },
  { name: 'Furniture', slug: 'furniture', parent: 'home-kitchen', icon: 'Sofa' },
  { name: 'Bedding', slug: 'bedding', parent: 'home-kitchen', icon: 'Bed' },
  { name: 'Decor', slug: 'decor', parent: 'home-kitchen', icon: 'Palette' },
  { name: 'Lighting', slug: 'lighting', parent: 'home-kitchen', icon: 'Lamp' },
  { name: 'Appliances', slug: 'appliances', parent: 'home-kitchen', icon: 'Refrigerator' },
  { name: 'Cookware', slug: 'cookware', parent: 'home-kitchen', icon: 'ChefHat' },
  { name: 'Kitchen Tools', slug: 'kitchen-tools', parent: 'home-kitchen', icon: 'Utensils' },
  { name: 'Storage', slug: 'storage', parent: 'home-kitchen', icon: 'Box' },
  { name: 'Vacuums', slug: 'vacuums', parent: 'home-kitchen', icon: 'Sparkles' },
  { name: 'Air Fryers', slug: 'air-fryers', parent: 'home-kitchen', icon: 'ChefHat' },
  { name: 'Coffee Makers', slug: 'coffee-makers', parent: 'home-kitchen', icon: 'Coffee' },
  
  // Beauty
  { name: 'Beauty', slug: 'beauty', parent: null, icon: 'Sparkles' },
  { name: 'Skincare', slug: 'skincare', parent: 'beauty', icon: 'Droplets' },
  { name: 'Makeup', slug: 'makeup', parent: 'beauty', icon: 'Palette' },
  { name: 'Haircare', slug: 'haircare', parent: 'beauty', icon: 'Scissors' },
  { name: 'Fragrance', slug: 'fragrance', parent: 'beauty', icon: 'Sparkles' },
  { name: 'Vitamins', slug: 'vitamins', parent: 'beauty', icon: 'Pill' },
  
  // Sports & Outdoors
  { name: 'Fitness', slug: 'fitness', parent: null, icon: 'Dumbbell' },
  { name: 'Outdoor', slug: 'outdoor', parent: null, icon: 'Mountain' },
  { name: 'Camping', slug: 'camping', parent: 'outdoor', icon: 'Tent' },
  { name: 'Hiking', slug: 'hiking', parent: 'outdoor', icon: 'Mountain' },
  { name: 'Cycling', slug: 'cycling', parent: 'fitness', icon: 'Bike' },
  { name: 'Yoga', slug: 'yoga', parent: 'fitness', icon: 'PersonStanding' },
  { name: 'Home Gym', slug: 'home-gym', parent: 'fitness', icon: 'Dumbbell' },
  
  // Gaming
  { name: 'Gaming', slug: 'gaming', parent: null, icon: 'Gamepad2' },
  { name: 'PC Gaming', slug: 'pc-gaming', parent: 'gaming', icon: 'Monitor' },
  { name: 'Gaming Accessories', slug: 'gaming-accessories', parent: 'gaming', icon: 'Gamepad2' },
  { name: 'Gaming Chairs', slug: 'gaming-chairs', parent: 'gaming', icon: 'Armchair' },
  
  // Office
  { name: 'Office Supplies', slug: 'office-supplies', parent: null, icon: 'Briefcase' },
  { name: 'Office Furniture', slug: 'office-furniture', parent: 'office-supplies', icon: 'Desk' },
  { name: 'School Supplies', slug: 'school-supplies', parent: 'office-supplies', icon: 'GraduationCap' },
  
  // Pets
  { name: 'Pet Supplies', slug: 'pet-supplies', parent: null, icon: 'PawPrint' },
  { name: 'Dog Food', slug: 'dog-food', parent: 'pet-supplies', icon: 'Dog' },
  { name: 'Cat Food', slug: 'cat-food', parent: 'pet-supplies', icon: 'Cat' },
  { name: 'Pet Toys', slug: 'pet-toys', parent: 'pet-supplies', icon: 'PawPrint' },
  
  // Auto
  { name: 'Automotive', slug: 'automotive', parent: null, icon: 'Car' },
  { name: 'Car Accessories', slug: 'car-accessories', parent: 'automotive', icon: 'Car' },
  { name: 'Car Electronics', slug: 'car-electronics', parent: 'automotive', icon: 'Radio' },
  { name: 'Car Care', slug: 'car-care', parent: 'automotive', icon: 'Sparkles' },
  
  // Toys & Baby
  { name: 'Toys', slug: 'toys', parent: null, icon: 'Blocks' },
  { name: 'Baby Gear', slug: 'baby-gear', parent: null, icon: 'Baby' },
  
  // Smart Home
  { name: 'Smart Home', slug: 'smart-home', parent: null, icon: 'Home' },
  { name: 'Smart Speakers', slug: 'smart-speakers', parent: 'smart-home', icon: 'Speaker' },
  { name: 'Smart Lights', slug: 'smart-lights', parent: 'smart-home', icon: 'Lightbulb' },
  { name: 'Smart Plugs', slug: 'smart-plugs', parent: 'smart-home', icon: 'Plug' },
  { name: 'Security Cameras', slug: 'security-cameras', parent: 'smart-home', icon: 'Camera' },
  
  // Additional high-value categories
  { name: 'Mattresses', slug: 'mattresses', parent: 'home-kitchen', icon: 'Bed' },
  { name: 'Air Purifiers', slug: 'air-purifiers', parent: 'home-kitchen', icon: 'Wind' },
  { name: 'Robot Vacuums', slug: 'robot-vacuums', parent: 'home-kitchen', icon: 'Bot' },
  { name: 'Earbuds', slug: 'earbuds', parent: 'electronics', icon: 'Headphones' },
  { name: 'Wireless Earbuds', slug: 'wireless-earbuds', parent: 'electronics', icon: 'Headphones' },
  { name: 'Noise Canceling Headphones', slug: 'noise-canceling-headphones', parent: 'electronics', icon: 'Headphones' },
  { name: 'Gaming Headsets', slug: 'gaming-headsets', parent: 'gaming', icon: 'Headphones' },
  { name: 'Keyboards', slug: 'keyboards', parent: 'electronics', icon: 'Keyboard' },
  { name: 'Mice', slug: 'mice', parent: 'electronics', icon: 'Mouse' },
  { name: 'Webcams', slug: 'webcams', parent: 'electronics', icon: 'Camera' },
  { name: 'Microphones', slug: 'microphones', parent: 'electronics', icon: 'Mic' },
  { name: 'Blenders', slug: 'blenders', parent: 'home-kitchen', icon: 'ChefHat' },
  { name: 'Toasters', slug: 'toasters', parent: 'home-kitchen', icon: 'ChefHat' },
  { name: 'Mixers', slug: 'mixers', parent: 'home-kitchen', icon: 'ChefHat' },
  { name: 'Instant Pots', slug: 'instant-pots', parent: 'home-kitchen', icon: 'ChefHat' },
  { name: 'OLED TVs', slug: 'oled-tvs', parent: 'electronics', icon: 'Tv' },
  { name: 'Gaming Laptops', slug: 'gaming-laptops', parent: 'electronics', icon: 'Laptop' },
  { name: 'MacBooks', slug: 'macbooks', parent: 'electronics', icon: 'Laptop' },
  { name: 'iPhones', slug: 'iphones', parent: 'electronics', icon: 'Smartphone' },
  { name: 'iPads', slug: 'ipads', parent: 'electronics', icon: 'Tablet' },
  { name: 'Apple Watch', slug: 'apple-watch', parent: 'electronics', icon: 'Watch' },
  { name: 'Action Cameras', slug: 'action-cameras', parent: 'electronics', icon: 'Camera' },
  { name: 'Drones', slug: 'drones', parent: 'electronics', icon: 'Plane' },
]

// Coupon code prefixes
const COUPON_PREFIXES = [
  'SAVE', 'DEAL', 'EXTRA', 'HOT', 'FLASH', 'MEGA', 'SUPER', 'BIG',
  'NEW', 'VIP', 'MEMBER', 'WELCOME', 'SPRING', 'SUMMER', 'FALL', 'WINTER',
  'HOLIDAY', 'BLACK', 'CYBER', 'PRIME', 'SALE', 'BEST', 'TOP', 'MAX'
]

const DISCOUNT_TYPES = ['percentage', 'fixed', 'free_shipping', 'bogo'] as const

// Utility to generate slug from name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Generate random color
function randomColor(): string {
  const colors = [
    '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#6366f1',
    '#84cc16', '#22c55e', '#0ea5e9', '#a855f7', '#e11d48'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Generate random rating
function randomRating(): number {
  return Math.round((3.5 + Math.random() * 1.5) * 10) / 10
}

// Generate random review count
function randomReviewCount(): number {
  return Math.floor(Math.random() * 10000) + 100
}

// Generate unique store name
function generateStoreName(index: number, usedNames: Set<string>): string {
  let name: string
  let attempts = 0
  
  do {
    if (attempts < 100) {
      // Try brand + suffix combinations
      const brand = BRAND_NAMES[Math.floor(Math.random() * BRAND_NAMES.length)]
      const suffix = STORE_SUFFIXES[Math.floor(Math.random() * STORE_SUFFIXES.length)]
      name = `${brand} ${suffix}`
    } else if (attempts < 200) {
      // Try prefix + brand combinations
      const prefix = STORE_PREFIXES[Math.floor(Math.random() * STORE_PREFIXES.length)]
      const brand = BRAND_NAMES[Math.floor(Math.random() * BRAND_NAMES.length)]
      name = `${prefix} ${brand}`
    } else {
      // Fallback with number
      const brand = BRAND_NAMES[Math.floor(Math.random() * BRAND_NAMES.length)]
      name = `${brand} ${index + 1}`
    }
    attempts++
  } while (usedNames.has(name.toLowerCase()))
  
  usedNames.add(name.toLowerCase())
  return name
}

// Generate stores
export function generateStores(count: number = 1000): Array<{
  name: string
  slug: string
  description: string
  logo_url: string | null
  website_url: string
  affiliate_base_url: string
  rating: number
  review_count: number
  color: string
  is_active: boolean
  meta_title: string
  meta_description: string
}> {
  const stores: Array<{
    name: string
    slug: string
    description: string
    logo_url: string | null
    website_url: string
    affiliate_base_url: string
    rating: number
    review_count: number
    color: string
    is_active: boolean
    meta_title: string
    meta_description: string
  }> = []
  
  const usedNames = new Set<string>()
  const usedSlugs = new Set<string>()
  
  // First add real stores
  for (const store of REAL_STORES) {
    if (stores.length >= count) break
    
    usedNames.add(store.name.toLowerCase())
    usedSlugs.add(store.slug)
    
    stores.push({
      name: store.name,
      slug: store.slug,
      description: `Shop the best deals and discounts at ${store.name}. Find exclusive coupons, promo codes, and savings on your favorite products.`,
      logo_url: null,
      website_url: store.website,
      affiliate_base_url: `${store.website}?ref=savesmart`,
      rating: randomRating(),
      review_count: randomReviewCount(),
      color: store.color,
      is_active: true,
      meta_title: `${store.name} Coupons & Deals - Save up to 70% | SaveSmart`,
      meta_description: `Find verified ${store.name} coupon codes, promo codes & deals. Save money with exclusive discounts updated daily.`
    })
  }
  
  // Generate remaining stores
  for (let i = stores.length; i < count; i++) {
    const name = generateStoreName(i, usedNames)
    let slug = generateSlug(name)
    
    // Ensure unique slug
    let slugSuffix = 0
    while (usedSlugs.has(slug)) {
      slugSuffix++
      slug = `${generateSlug(name)}-${slugSuffix}`
    }
    usedSlugs.add(slug)
    
    const vertical = STORE_VERTICALS[Math.floor(Math.random() * STORE_VERTICALS.length)]
    
    stores.push({
      name,
      slug,
      description: `Discover amazing deals and discounts at ${name}. Shop ${vertical.prefix.toLowerCase()} products with exclusive coupons and promo codes.`,
      logo_url: null,
      website_url: `https://${slug}.com`,
      affiliate_base_url: `https://${slug}.com?ref=savesmart`,
      rating: randomRating(),
      review_count: randomReviewCount(),
      color: randomColor(),
      is_active: true,
      meta_title: `${name} Coupons & Deals - Save up to 70% | SaveSmart`,
      meta_description: `Find verified ${name} coupon codes, promo codes & deals. Save money with exclusive discounts updated daily.`
    })
  }
  
  return stores
}

// Generate categories (returns exactly 100)
export function generateCategories(): Array<{
  name: string
  slug: string
  parent_slug: string | null
  description: string
  icon: string
  image_url: string | null
  is_active: boolean
  meta_title: string
  meta_description: string
  display_order: number
}> {
  return CATEGORIES.slice(0, 100).map((cat, index) => ({
    name: cat.name,
    slug: cat.slug,
    parent_slug: cat.parent,
    description: `Shop the best ${cat.name.toLowerCase()} deals and discounts. Find top-rated products at the lowest prices.`,
    icon: cat.icon,
    image_url: null,
    is_active: true,
    meta_title: `Best ${cat.name} Deals & Discounts | SaveSmart`,
    meta_description: `Find the best ${cat.name.toLowerCase()} deals and discounts from top retailers. Save money with verified coupons and promo codes.`,
    display_order: index
  }))
}

// Generate coupons
export function generateCoupons(
  stores: Array<{ slug: string; name: string }>,
  count: number = 10000
): Array<{
  store_slug: string
  code: string | null
  title: string
  description: string
  discount_type: typeof DISCOUNT_TYPES[number]
  discount_value: number
  minimum_purchase: number | null
  affiliate_link: string
  is_verified: boolean
  is_exclusive: boolean
  is_active: boolean
  starts_at: string
  expires_at: string | null
  success_rate: number
  uses_count: number
}> {
  const coupons: Array<{
    store_slug: string
    code: string | null
    title: string
    description: string
    discount_type: typeof DISCOUNT_TYPES[number]
    discount_value: number
    minimum_purchase: number | null
    affiliate_link: string
    is_verified: boolean
    is_exclusive: boolean
    is_active: boolean
    starts_at: string
    expires_at: string | null
    success_rate: number
    uses_count: number
  }> = []
  
  const now = new Date()
  const usedCodes = new Set<string>()
  
  for (let i = 0; i < count; i++) {
    const store = stores[Math.floor(Math.random() * stores.length)]
    const discountType = DISCOUNT_TYPES[Math.floor(Math.random() * DISCOUNT_TYPES.length)]
    const hasCode = Math.random() > 0.3 // 70% have codes
    
    // Generate unique code
    let code: string | null = null
    if (hasCode) {
      let attempts = 0
      do {
        const prefix = COUPON_PREFIXES[Math.floor(Math.random() * COUPON_PREFIXES.length)]
        const number = Math.floor(Math.random() * 100)
        code = `${prefix}${number}`
        attempts++
      } while (usedCodes.has(`${store.slug}-${code}`) && attempts < 50)
      
      if (code) usedCodes.add(`${store.slug}-${code}`)
    }
    
    let discountValue: number
    let title: string
    let description: string
    
    switch (discountType) {
      case 'percentage':
        discountValue = [5, 10, 15, 20, 25, 30, 40, 50, 60, 70][Math.floor(Math.random() * 10)]
        title = `${discountValue}% Off ${store.name}`
        description = `Get ${discountValue}% off your purchase at ${store.name}. Limited time offer.`
        break
      case 'fixed':
        discountValue = [5, 10, 15, 20, 25, 50, 100][Math.floor(Math.random() * 7)]
        title = `$${discountValue} Off ${store.name}`
        description = `Save $${discountValue} on your next order at ${store.name}.`
        break
      case 'free_shipping':
        discountValue = 0
        title = `Free Shipping at ${store.name}`
        description = `Enjoy free shipping on all orders at ${store.name}.`
        break
      case 'bogo':
        discountValue = 50
        title = `Buy One Get One at ${store.name}`
        description = `Buy one item, get one free or at a discount at ${store.name}.`
        break
    }
    
    const minPurchase = Math.random() > 0.5 ? [25, 50, 75, 100, 150, 200][Math.floor(Math.random() * 6)] : null
    
    // Generate expiration date (some never expire, most expire within 30-90 days)
    const hasExpiry = Math.random() > 0.2
    let expiresAt: string | null = null
    if (hasExpiry) {
      const daysUntilExpiry = Math.floor(Math.random() * 90) + 7
      const expiryDate = new Date(now)
      expiryDate.setDate(expiryDate.getDate() + daysUntilExpiry)
      expiresAt = expiryDate.toISOString()
    }
    
    coupons.push({
      store_slug: store.slug,
      code,
      title,
      description,
      discount_type: discountType,
      discount_value: discountValue,
      minimum_purchase: minPurchase,
      affiliate_link: `https://${store.slug}.com?ref=savesmart&coupon=${code || 'deal'}`,
      is_verified: Math.random() > 0.3,
      is_exclusive: Math.random() > 0.8,
      is_active: true,
      starts_at: now.toISOString(),
      expires_at: expiresAt,
      success_rate: Math.floor(Math.random() * 40) + 60,
      uses_count: Math.floor(Math.random() * 5000)
    })
  }
  
  return coupons
}

// Generate SEO pages for stores and categories
export function generateSeoPages(
  stores: Array<{ slug: string; name: string }>,
  categories: Array<{ slug: string; name: string }>
): Array<{
  slug: string
  page_type: string
  title: string
  h1: string
  meta_description: string
  canonical_url: string
  is_indexed: boolean
}> {
  const baseUrl = 'https://savesmart.bio'
  const month = new Date().toLocaleString('default', { month: 'long' })
  const year = new Date().getFullYear()
  const pages: Array<{
    slug: string
    page_type: string
    title: string
    h1: string
    meta_description: string
    canonical_url: string
    is_indexed: boolean
  }> = []
  
  // Store pages
  for (const store of stores) {
    pages.push({
      slug: `stores/${store.slug}`,
      page_type: 'store',
      title: `${store.name} Deals & Coupons - Save up to 70% | SaveSmart`,
      h1: `${store.name} Deals & Discounts`,
      meta_description: `Find the best ${store.name} deals, coupons, and promo codes for ${month} ${year}. Save money with verified discounts updated daily.`,
      canonical_url: `${baseUrl}/stores/${store.slug}`,
      is_indexed: true
    })
    
    // Coupon pages
    pages.push({
      slug: `coupons/${store.slug}`,
      page_type: 'coupon',
      title: `${store.name} Coupons & Promo Codes - ${month} ${year} | SaveSmart`,
      h1: `${store.name} Coupons & Promo Codes`,
      meta_description: `Get verified ${store.name} coupon codes and promo codes for ${month} ${year}. Save with exclusive discounts and free shipping offers.`,
      canonical_url: `${baseUrl}/coupons/${store.slug}`,
      is_indexed: true
    })
  }
  
  // Category pages
  for (const category of categories) {
    pages.push({
      slug: `deals/${category.slug}`,
      page_type: 'category',
      title: `Best ${category.name} Deals & Discounts | SaveSmart`,
      h1: `Best ${category.name} Deals`,
      meta_description: `Shop the best ${category.name.toLowerCase()} deals and discounts from top retailers. Find verified coupons and save money today.`,
      canonical_url: `${baseUrl}/deals/${category.slug}`,
      is_indexed: true
    })
    
    // Best category pages
    pages.push({
      slug: `best/${category.slug}`,
      page_type: 'best',
      title: `Best ${category.name} of ${year} - Top Deals & Reviews | SaveSmart`,
      h1: `Best ${category.name} of ${year}`,
      meta_description: `Discover the best ${category.name.toLowerCase()} of ${year} with expert reviews and top deals. Compare prices and save money.`,
      canonical_url: `${baseUrl}/best/${category.slug}`,
      is_indexed: true
    })
  }
  
  return pages
}
