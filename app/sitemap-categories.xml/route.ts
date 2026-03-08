// Sitemap for category pages: /deals/[category]
// Dynamically generates from database for scalable 100k+ page support
import { getCategorySlugsForSitemap } from '@/lib/seo-data'
import { SITEMAP_CONFIG, generateSitemapXml } from '@/lib/seo/sitemap-config'

const baseUrl = SITEMAP_CONFIG.baseUrl

export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  // Fetch all active categories from database with fallback
  const categories = await getCategorySlugsForSitemap()
  
  let urls: string[]
  
  if (categories.length === 0) {
    // Fallback to static config if database unavailable
    urls = SITEMAP_CONFIG.categories.map(cat => `${baseUrl}/deals/${cat}`)
  } else {
    urls = categories.map(cat => `${baseUrl}/deals/${cat.slug}`)
  }
  
  const xml = generateSitemapXml(urls, 0.8)

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
