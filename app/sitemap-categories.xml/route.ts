// Sitemap for category pages: /deals/[category]
import { SITEMAP_CONFIG, generateSitemapXml } from '@/lib/seo/sitemap-config'

const baseUrl = SITEMAP_CONFIG.baseUrl

export async function GET() {
  const urls = SITEMAP_CONFIG.categories.map(cat => `${baseUrl}/deals/${cat}`)
  
  const xml = generateSitemapXml(urls, 0.8)

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
