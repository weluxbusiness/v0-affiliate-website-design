import { getBrandSlugs } from "@/lib/seo-data"

const baseUrl = 'https://savesmart.bio'

// Popular brands fallback
const POPULAR_BRANDS = [
  "apple", "samsung", "nike", "adidas", "sony", "lg", "dell", "hp",
  "lenovo", "bose", "beats", "microsoft", "nintendo", "playstation",
  "xbox", "dyson", "kitchenaid", "cuisinart", "ninja", "instant-pot",
  "keurig", "nespresso", "ray-ban", "oakley", "levis", "north-face",
  "columbia", "patagonia", "under-armour", "new-balance", "puma",
  "reebok", "converse", "vans", "canon", "nikon", "gopro", "fitbit",
  "garmin", "roku", "amazon", "google", "philips", "braun", "oral-b"
]

export async function GET() {
  const now = new Date().toISOString().split('T')[0]
  
  // Get brands from database with fallback
  const dbBrands = await getBrandSlugs()
  const brands = dbBrands.length > 0 ? dbBrands : POPULAR_BRANDS
  
  const urls = [
    // Brands index page
    {
      loc: `${baseUrl}/brands`,
      lastmod: now,
      changefreq: 'weekly',
      priority: '0.8',
    },
    // Individual brand pages
    ...brands.map(brand => ({
      loc: `${baseUrl}/brands/${brand}`,
      lastmod: now,
      changefreq: 'daily',
      priority: '0.7',
    })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
