import { getBrandSlugs } from "@/lib/seo-data"

const baseUrl = 'https://savesmart.bio'

// Fallback brands
const FALLBACK_BRANDS = [
  "apple", "samsung", "nike", "adidas", "sony", "lg", "dell", "hp",
  "lenovo", "bose", "beats", "microsoft", "nintendo", "dyson",
  "kitchenaid", "cuisinart", "ninja", "instant-pot", "keurig"
]

// Max pages per brand
const MAX_PAGES_PER_BRAND = 10

export async function GET() {
  const now = new Date().toISOString().split('T')[0]
  
  const dbBrands = await getBrandSlugs()
  const brands = dbBrands.length > 0 ? dbBrands : FALLBACK_BRANDS
  
  // Generate pagination URLs
  // /brands/[brand]/page/2, /brands/[brand]/page/3, etc.
  const urls: string[] = []
  for (const brand of brands) {
    for (let page = 2; page <= MAX_PAGES_PER_BRAND; page++) {
      urls.push(`${baseUrl}/brands/${brand}/page/${page}`)
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
