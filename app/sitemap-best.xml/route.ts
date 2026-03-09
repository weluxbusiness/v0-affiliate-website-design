// Sitemap for best deal pages: /best/[category], /best/[category]/[brand], /best/[category]/[brand]/[store]
// Dynamically generates from database - only includes URLs where deals exist
import { getCategorySlugs, getBrandSlugs, getStoreSlugs } from '@/lib/seo-data'
import { 
  getBestDealsForCategory, 
  getBestDealsForCategoryBrand, 
  getBestDealsForCategoryBrandStore 
} from '@/lib/deals'

const baseUrl = "https://savesmart.bio"

export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  const now = new Date().toISOString().split('T')[0]
  
  // Fetch all slugs
  const categories = await getCategorySlugs()
  const brands = await getBrandSlugs()
  const stores = await getStoreSlugs()
  
  const urls: { loc: string; lastmod: string; priority: string }[] = []
  
  // Generate /best/[category] URLs (only where deals exist)
  for (const category of categories.slice(0, 50)) {
    const deals = await getBestDealsForCategory(category, 1)
    if (deals.length > 0) {
      urls.push({
        loc: `${baseUrl}/best/${category}`,
        lastmod: now,
        priority: "0.8",
      })
    }
  }
  
  // Generate /best/[category]/[brand] URLs (only where deals exist)
  for (const category of categories.slice(0, 20)) {
    for (const brand of brands.slice(0, 15)) {
      const deals = await getBestDealsForCategoryBrand(category, brand, 1)
      if (deals.length > 0) {
        urls.push({
          loc: `${baseUrl}/best/${category}/${brand}`,
          lastmod: now,
          priority: "0.7",
        })
      }
    }
  }
  
  // Generate /best/[category]/[brand]/[store] URLs (only where 5+ deals exist)
  for (const category of categories.slice(0, 10)) {
    for (const brand of brands.slice(0, 8)) {
      for (const store of stores.slice(0, 5)) {
        const deals = await getBestDealsForCategoryBrandStore(category, brand, store, 5)
        if (deals.length >= 5) {
          urls.push({
            loc: `${baseUrl}/best/${category}/${brand}/${store}`,
            lastmod: now,
            priority: "0.6",
          })
        }
      }
    }
  }
  
  // Return 404 if no URLs exist
  if (urls.length === 0) {
    return new Response('No best deal URLs available', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  }
  
  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ loc, lastmod, priority }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
