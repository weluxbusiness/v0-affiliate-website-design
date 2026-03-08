import { getCategorySlugs } from "@/lib/seo-data"

const baseUrl = 'https://savesmart.bio'

// Fallback categories
const FALLBACK_CATEGORIES = [
  "electronics", "headphones", "laptops", "smartphones", "tvs",
  "fashion", "sneakers", "kitchen", "home-kitchen", "running-shoes",
  "smartwatches", "jeans", "jackets", "coffee-makers", "air-fryers",
  "vacuums", "blenders", "sunglasses"
]

// Max pages to include in sitemap per category
const MAX_PAGES_PER_CATEGORY = 10

export async function GET() {
  const now = new Date().toISOString().split('T')[0]
  
  // Get categories from database or fallback
  const dbCategories = await getCategorySlugs()
  const categories = dbCategories.length > 0 ? dbCategories : FALLBACK_CATEGORIES
  
  // Generate pagination URLs for each category
  // /deals/[category]/page/2, /deals/[category]/page/3, etc.
  const urls: string[] = []
  for (const category of categories) {
    for (let page = 2; page <= MAX_PAGES_PER_CATEGORY; page++) {
      urls.push(`${baseUrl}/deals/${category}/page/${page}`)
    }
  }
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.5</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
