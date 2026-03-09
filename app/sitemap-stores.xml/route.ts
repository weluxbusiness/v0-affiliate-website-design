// Sitemap for store pages: /stores/[store] and /deals/store/[store]
// Dynamically generates from database for scalable 100k+ page support
import { getStoreSlugsForSitemap } from '@/lib/seo-data'
import { SITEMAP_CONFIG, generateSitemapXml } from '@/lib/seo/sitemap-config'

const baseUrl = SITEMAP_CONFIG.baseUrl

// Known stores for /deals/store/[store] pages
const dealsStores = [
  'amazon', 'best-buy', 'nike', 'target', 'apple', 'dyson',
  'adidas', 'levis', 'walmart', 'costco', 'macys', 'nordstrom',
  'kohls', 'home-depot', 'lowes', 'wayfair', 'ikea', 'gap', 
  'old-navy', 'north-face', 'patagonia', 'williams-sonoma',
  'sunglass-hut', 'starbucks'
]

export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  // Fetch all active stores from database with fallback
  const stores = await getStoreSlugsForSitemap()
  
  let urls: string[] = []
  
  if (stores.length === 0) {
    // Fallback to static config if database unavailable
    urls = SITEMAP_CONFIG.stores.map(store => `${baseUrl}/stores/${store}`)
  } else {
    urls = stores.map(store => `${baseUrl}/stores/${store.slug}`)
  }
  
  // Add /deals/store/[store] pages
  const dealsStoreUrls = dealsStores.map(store => `${baseUrl}/deals/store/${store}`)
  urls = [...urls, ...dealsStoreUrls]
  
  // Store pages get high priority (0.9) - brand authority and conversion pages
  const xml = generateSitemapXml(urls, 0.9)

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
