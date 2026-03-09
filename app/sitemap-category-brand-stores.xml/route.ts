import { getBrandSlugs, getCategorySlugs, getStoreSlugs } from '@/lib/seo-data'

const baseUrl = 'https://savesmart.bio'

export const revalidate = 3600 // ISR: revalidate every hour

export async function GET() {
  const now = new Date().toISOString().split('T')[0]
  
  // Get slugs from database
  const categorySlugs = await getCategorySlugs()
  const brandSlugs = await getBrandSlugs()
  const storeSlugs = await getStoreSlugs()
  
  // Use fetched data or fallback
  const categories = categorySlugs.length > 0 ? categorySlugs.slice(0, 10) : [
    'electronics', 'laptops', 'headphones', 'smartphones', 'tvs',
    'fashion', 'sneakers', 'home-kitchen'
  ]
  
  const brands = brandSlugs.length > 0 ? brandSlugs.slice(0, 10) : [
    'apple', 'samsung', 'nike', 'sony', 'lg', 'dell', 'hp', 'lenovo'
  ]
  
  const stores = storeSlugs.length > 0 ? storeSlugs.slice(0, 8) : [
    'amazon', 'best-buy', 'target', 'walmart', 'costco'
  ]
  
  // Generate category × brand × store combinations
  // Limit to stay under 50k URLs
  const urls: string[] = []
  const maxUrls = 50000
  
  for (const category of categories) {
    for (const brand of brands) {
      for (const store of stores) {
        if (urls.length >= maxUrls) break
        urls.push(`${baseUrl}/deals/${category}/${brand}/${store}`)
      }
      if (urls.length >= maxUrls) break
    }
    if (urls.length >= maxUrls) break
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
