// Sitemap for coupon pages: /coupons/[store]
import { SITEMAP_CONFIG, generateSitemapXml } from '@/lib/seo/sitemap-config'

const baseUrl = SITEMAP_CONFIG.baseUrl

export async function GET() {
  const urls = SITEMAP_CONFIG.stores.map(store => `${baseUrl}/coupons/${store}`)
  
  const xml = generateSitemapXml(urls, 0.8)

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
