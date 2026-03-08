import { getBrandSlugs, getCategorySlugs } from "@/lib/seo-data"

const baseUrl = 'https://savesmart.bio'

// Fallback brands and categories
const FALLBACK_BRANDS = [
  "apple", "samsung", "nike", "adidas", "sony", "lg", "dell", "hp",
  "lenovo", "bose", "beats", "microsoft", "nintendo", "dyson"
]

const FALLBACK_CATEGORIES = [
  "electronics", "headphones", "laptops", "smartphones", "tvs",
  "fashion", "sneakers", "kitchen", "home-kitchen"
]

export async function GET() {
  const now = new Date().toISOString().split('T')[0]
  
  // Get brands and categories from database or fallback
  const dbBrands = await getBrandSlugs()
  const dbCategories = await getCategorySlugs()
  
  const brands = dbBrands.length > 0 ? dbBrands : FALLBACK_BRANDS
  const categories = dbCategories.length > 0 ? dbCategories : FALLBACK_CATEGORIES
  
  // Generate all brand × category combinations
  const urls: string[] = []
  for (const brand of brands) {
    for (const category of categories) {
      urls.push(`${baseUrl}/brands/${brand}/${category}`)
    }
  }
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
