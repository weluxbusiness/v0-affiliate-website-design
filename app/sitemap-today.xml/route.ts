// Today's deals sitemap: /deals/today and /deals/today/[entity]
// High-priority pages for fresh content (changefreq: daily, priority: 0.9)

import { brands, categories } from '@/data/deal-pages'

const baseUrl = 'https://savesmart.bio'

// Revalidate daily to ensure freshness
export const revalidate = 86400

// Popular categories for today's deals pages
const todayCategories = [
  'laptops', 'headphones', 'tvs', 'sneakers', 'smartphones',
  'gaming-consoles', 'vacuums', 'air-fryers', 'watches', 'tablets',
  'running-shoes', 'wireless-earbuds', 'monitors', 'gaming-laptops',
  'coffee-makers', 'robot-vacuums', 'smartwatches', 'cameras',
  'backpacks', 'jackets', 'jeans', 'dresses', 'furniture',
  'mattresses', 'kitchen-gadgets', 'bluetooth-speakers', 'gaming-chairs'
]

// Popular brands for today's deals pages
const todayBrands = [
  'amazon', 'nike', 'apple', 'samsung', 'sony', 'best-buy', 'target', 
  'walmart', 'adidas', 'dyson', 'bose', 'lg', 'dell', 'hp', 'lenovo',
  'microsoft', 'nintendo', 'playstation', 'kitchenaid', 'north-face',
  'lululemon', 'patagonia', 'under-armour', 'puma', 'new-balance',
  'beats', 'google', 'costco', 'macys', 'nordstrom'
]

export async function GET() {
  const today = new Date().toISOString().split('T')[0]
  
  // Build all today's deals URLs
  const urls: { loc: string; priority: number }[] = [
    // Main today's deals page (highest priority)
    { loc: `${baseUrl}/deals/today`, priority: 0.95 },
  ]
  
  // Add category today pages
  for (const category of todayCategories) {
    // Validate category exists
    if (categories.includes(category as typeof categories[number])) {
      urls.push({
        loc: `${baseUrl}/deals/today/${category}`,
        priority: 0.85,
      })
    }
  }
  
  // Add brand today pages
  for (const brand of todayBrands) {
    // Validate brand exists
    if (brands.includes(brand as typeof brands[number])) {
      urls.push({
        loc: `${baseUrl}/deals/today/${brand}`,
        priority: 0.85,
      })
    }
  }
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
