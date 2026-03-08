import { getStoreSlugs } from "@/lib/seo-data"

const baseUrl = 'https://savesmart.bio'

// Fallback stores
const FALLBACK_STORES = [
  'amazon', 'best-buy', 'nike', 'target', 'apple', 'dyson',
  'adidas', 'levis', 'walmart', 'costco', 'macys', 'nordstrom',
  'home-depot', 'lowes', 'wayfair', 'ikea', 'sephora', 'ulta'
]

// Max pages per store
const MAX_PAGES_PER_STORE = 10

export async function GET() {
  const now = new Date().toISOString().split('T')[0]
  
  const dbStores = await getStoreSlugs()
  const stores = dbStores.length > 0 ? dbStores : FALLBACK_STORES
  
  // Generate pagination URLs
  // /stores/[store]/page/2, /stores/[store]/page/3, etc.
  const urls: string[] = []
  for (const store of stores) {
    for (let page = 2; page <= MAX_PAGES_PER_STORE; page++) {
      urls.push(`${baseUrl}/stores/${store}/page/${page}`)
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
