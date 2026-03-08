// Sitemap for coupon pages: /coupons/[store]
// Dynamically generates from database for scalable 100k+ page support
import { getStoreSlugsForSitemap, getStoresWithCoupons } from '@/lib/seo-data'
import { SITEMAP_CONFIG, generateSitemapXml } from '@/lib/seo/sitemap-config'

const baseUrl = SITEMAP_CONFIG.baseUrl

export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  // Try to get stores that specifically have coupons
  let storeSlugs = await getStoresWithCoupons()
  
  // If no stores have coupons, fall back to all stores
  if (storeSlugs.length === 0) {
    const allStores = await getStoreSlugsForSitemap()
    storeSlugs = allStores.map(s => s.slug)
  }
  
  // Final fallback to static config
  if (storeSlugs.length === 0) {
    storeSlugs = SITEMAP_CONFIG.stores
  }
  
  const urls = storeSlugs.map(slug => `${baseUrl}/coupons/${slug}`)
  const xml = generateSitemapXml(urls, 0.8)

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
