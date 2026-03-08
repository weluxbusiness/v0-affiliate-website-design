// Sitemap for best category pages: /best/[category]
import { SITEMAP_CONFIG, generateSitemapXml } from '@/lib/seo/sitemap-config'

const baseUrl = SITEMAP_CONFIG.baseUrl

export async function GET() {
  const urls = SITEMAP_CONFIG.bestCategories.map(cat => `${baseUrl}/best/${cat}`)
  
  const xml = generateSitemapXml(urls, 0.8)

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
