// Sitemap for store+category pages: /stores/[store]/[category]
// This generates thousands of URLs for programmatic SEO
import { getStoreSlugsForSitemap, getCategorySlugsForSitemap } from '@/lib/seo-data'
import { SITEMAP_CONFIG, generateSitemapXml } from '@/lib/seo/sitemap-config'

const baseUrl = SITEMAP_CONFIG.baseUrl

export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  // Fetch stores and categories from database with fallbacks
  const stores = await getStoreSlugsForSitemap()
  const categories = await getCategorySlugsForSitemap()
  
  const storeSlugs = stores.length > 0 
    ? stores.map(s => s.slug) 
    : SITEMAP_CONFIG.stores
    
  const categorySlugs = categories.length > 0 
    ? categories.map(c => c.slug).slice(0, 20) // Top 20 categories
    : SITEMAP_CONFIG.categories.slice(0, 20)
  
  // Generate store + category combinations
  // Limit to top 20 categories per store to stay under 10,000 URLs
  const urls: string[] = []
  for (const store of storeSlugs) {
    for (const category of categorySlugs) {
      urls.push(`${baseUrl}/stores/${store}/${category}`)
    }
  }
  
  const xml = generateSitemapXml(urls, 0.7)

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
