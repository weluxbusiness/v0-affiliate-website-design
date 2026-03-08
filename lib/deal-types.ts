// Shared types and utilities - safe for client and server components

export interface Deal {
  id: string
  title: string
  description: string
  store: string
  category: string
  original_price: number
  deal_price: number
  discount_percentage: number
  coupon_code: string | null
  affiliate_link: string
  image_url: string | null
  expires_at: string
  is_active: boolean
  created_at: string
  updated_at: string
  // New fields for SEO and deal discovery
  slug?: string | null
  source?: string | null
  ai_description?: string | null
}

// Helper to generate SEO-friendly slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')  // Remove special characters
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/-+/g, '-')            // Replace multiple hyphens with single
    .replace(/^-|-$/g, '')          // Remove leading/trailing hyphens
    .trim()
    .slice(0, 100)
}

// Generate unique slug with optional suffix
export function generateUniqueSlug(title: string, suffix?: string | number): string {
  const baseSlug = generateSlug(title)
  if (suffix !== undefined) {
    return `${baseSlug}-${suffix}`.slice(0, 100)
  }
  return baseSlug
}

// Convert store name to URL slug
export function storeToSlug(store: string): string {
  return store
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Convert category name to URL slug
export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/\s*&\s*/g, '-')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Convert slug back to formatted store name
export function formatStoreName(slug: string): string {
  const storeMap: Record<string, string> = {
    'amazon': 'Amazon',
    'best-buy': 'Best Buy',
    'nike': 'Nike',
    'target': 'Target',
    'apple': 'Apple',
    'dyson': 'Dyson',
    'adidas': 'Adidas',
    'levis': "Levi's",
    'walmart': 'Walmart',
    'costco': 'Costco',
    'macys': "Macy's",
    'nordstrom': 'Nordstrom',
    'the-north-face': 'The North Face',
    'patagonia': 'Patagonia',
    'williams-sonoma': 'Williams Sonoma',
    'sunglass-hut': 'Sunglass Hut',
    'starbucks': 'Starbucks',
  }
  return storeMap[slug] || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

// Convert slug back to formatted category name
export function formatCategoryName(slug: string): string {
  const categoryMap: Record<string, string> = {
    'electronics': 'Electronics',
    'fashion': 'Fashion',
    'home': 'Home & Kitchen',
    'home-kitchen': 'Home & Kitchen',
    'laptops': 'Laptops',
    'headphones': 'Headphones',
    'sneakers': 'Sneakers',
    'fitness': 'Fitness',
    'beauty': 'Beauty',
    'gaming': 'Gaming',
    'outdoor': 'Outdoor',
    'kitchen': 'Kitchen',
  }
  return categoryMap[slug] || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export interface StoreInfo {
  name: string
  logo: string
  rating: number
  reviewCount: number
  color: string
}

export const storeData: Record<string, StoreInfo> = {
  "Amazon": {
    name: "Amazon",
    logo: "/stores/amazon.svg",
    rating: 4.7,
    reviewCount: 2847293,
    color: "bg-[#FF9900]"
  },
  "Best Buy": {
    name: "Best Buy",
    logo: "/stores/bestbuy.svg",
    rating: 4.5,
    reviewCount: 892741,
    color: "bg-[#0046BE]"
  },
  "Nike": {
    name: "Nike",
    logo: "/stores/nike.svg",
    rating: 4.6,
    reviewCount: 1234567,
    color: "bg-black"
  },
  "Apple": {
    name: "Apple",
    logo: "/stores/apple.svg",
    rating: 4.8,
    reviewCount: 3456789,
    color: "bg-black"
  },
  "Target": {
    name: "Target",
    logo: "/stores/target.svg",
    rating: 4.4,
    reviewCount: 567890,
    color: "bg-[#CC0000]"
  },
  "Dyson": {
    name: "Dyson",
    logo: "/stores/dyson.svg",
    rating: 4.6,
    reviewCount: 234567,
    color: "bg-[#6E6E6E]"
  },
  "Adidas": {
    name: "Adidas",
    logo: "/stores/adidas.svg",
    rating: 4.5,
    reviewCount: 987654,
    color: "bg-black"
  },
  "Levi's": {
    name: "Levi's",
    logo: "/stores/levis.svg",
    rating: 4.4,
    reviewCount: 345678,
    color: "bg-[#C41230]"
  },
  "Williams Sonoma": {
    name: "Williams Sonoma",
    logo: "/stores/williams-sonoma.svg",
    rating: 4.5,
    reviewCount: 123456,
    color: "bg-[#1B3D6D]"
  },
  "Sunglass Hut": {
    name: "Sunglass Hut",
    logo: "/stores/sunglass-hut.svg",
    rating: 4.3,
    reviewCount: 98765,
    color: "bg-[#D71920]"
  },
  "The North Face": {
    name: "The North Face",
    logo: "/stores/northface.svg",
    rating: 4.6,
    reviewCount: 456789,
    color: "bg-black"
  },
  "Starbucks": {
    name: "Starbucks",
    logo: "/stores/starbucks.svg",
    rating: 4.5,
    reviewCount: 567890,
    color: "bg-[#00704A]"
  },
  "Patagonia": {
    name: "Patagonia",
    logo: "/stores/patagonia.svg",
    rating: 4.7,
    reviewCount: 234567,
    color: "bg-[#1A1A1A]"
  }
}

export function getStoreInfo(storeName: string): StoreInfo {
  return storeData[storeName] || {
    name: storeName,
    logo: "/stores/default.svg",
    rating: 4.0,
    reviewCount: 1000,
    color: "bg-muted"
  }
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function formatReviewCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(0)}K`
  }
  return count.toString()
}

// Product-specific image mapping with reliable Unsplash URLs
const productImages: Record<string, string> = {
  // Electronics
  'airpods': 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&h=400&fit=crop',
  'headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop',
  'sony': 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=400&fit=crop',
  'macbook': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop',
  'ipad': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop',
  'tv': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop',
  'samsung': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop',
  'lg': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop',
  'oled': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop',
  'bose': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=400&fit=crop',
  'speaker': 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=400&fit=crop',
  // Fashion
  'nike': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop',
  'air max': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop',
  'adidas': 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=400&fit=crop',
  'ultraboost': 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&h=400&fit=crop',
  'jeans': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=400&fit=crop',
  'levi': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=400&fit=crop',
  'sunglasses': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=400&fit=crop',
  'ray-ban': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=400&fit=crop',
  'jacket': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=400&fit=crop',
  'north face': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=400&fit=crop',
  'sweater': 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=400&fit=crop',
  'patagonia': 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=400&fit=crop',
  // Home & Kitchen
  'instant pot': 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&h=400&fit=crop',
  'pressure cooker': 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&h=400&fit=crop',
  'dyson': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&h=400&fit=crop',
  'vacuum': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&h=400&fit=crop',
  'kitchenaid': 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=600&h=400&fit=crop',
  'mixer': 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=600&h=400&fit=crop',
  'ninja': 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&h=400&fit=crop',
  'air fryer': 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&h=400&fit=crop',
  'vitamix': 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&h=400&fit=crop',
  'blender': 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&h=400&fit=crop',
  'breville': 'https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=600&h=400&fit=crop',
  'espresso': 'https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=600&h=400&fit=crop',
  'coffee': 'https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=600&h=400&fit=crop',
  'ember': 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=400&fit=crop',
  'mug': 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=400&fit=crop',
  'temperature': 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=400&fit=crop',
}

// Fallback category images
const categoryFallbacks: Record<string, string> = {
  'Electronics': 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&h=400&fit=crop',
  'Fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop',
  'Home & Kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
}

export function getProductImageUrl(deal: Deal): string {
  if (deal.image_url) {
    return deal.image_url
  }
  
  // Search for matching product keywords in the title
  const titleLower = deal.title.toLowerCase()
  for (const [keyword, imageUrl] of Object.entries(productImages)) {
    if (titleLower.includes(keyword)) {
      return imageUrl
    }
  }
  
  // Fall back to category image
  return categoryFallbacks[deal.category] || categoryFallbacks['Electronics']
}

export function calculateTimeRemaining(expiresAt: string): {
  days: number
  hours: number
  minutes: number
  seconds: number
  expired: boolean
} {
  const now = new Date().getTime()
  const expiry = new Date(expiresAt).getTime()
  const diff = expiry - now

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds, expired: false }
}
