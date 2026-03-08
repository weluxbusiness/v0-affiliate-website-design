// Sitemap for store+category pages: /stores/[store]/[category]
// This generates thousands of URLs for programmatic SEO
import { SITEMAP_CONFIG, generateSitemapXml } from '@/lib/seo/sitemap-config'

const baseUrl = SITEMAP_CONFIG.baseUrl

export async function GET() {
  // Generate store + category combinations
  // Limit to top 20 categories per store to stay under 10,000 URLs
  const topCategories = SITEMAP_CONFIG.categories.slice(0, 20)
  
  const urls: string[] = []
  for (const store of SITEMAP_CONFIG.stores) {
    for (const category of topCategories) {
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
