/**
 * Sitemap Index for /deals/seo/* programmatic pages
 * Generated from deal-pages dataset (brands × prices + categories × prices)
 * Automatically splits into multiple sitemaps when exceeding 5000 URLs
 */
import { 
  generateAllDealSeoUrls, 
  getDealSeoSitemapStats,
  MAX_URLS_PER_SITEMAP,
} from '@/lib/sitemaps/dealSeo'
import { getLatestDealUpdateTime } from '@/lib/deals-cached'

const baseUrl = 'https://savesmart.bio'

export const revalidate = 3600 // ISR: revalidate every hour

export async function GET() {
  // Use actual latest deal update for freshness signal
  let lastMod: string
  try {
    const latestUpdate = await getLatestDealUpdateTime()
    lastMod = latestUpdate.split('T')[0] // YYYY-MM-DD format
  } catch {
    lastMod = new Date().toISOString().split('T')[0]
  }
  const stats = getDealSeoSitemapStats()
  
  // Calculate number of sub-sitemaps needed
  const sitemapCount = Math.ceil(stats.total / MAX_URLS_PER_SITEMAP)
  
  // If total URLs fit in one sitemap, return a single sitemap instead of index
  if (sitemapCount === 1) {
    return generateSingleSitemap(lastMod)
  }
  
  // Generate sitemap index pointing to multiple sub-sitemaps
  const sitemapUrls = Array.from({ length: sitemapCount }, (_, i) => 
    `${baseUrl}/sitemaps/deal-seo/${i + 1}`
  )

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(url => `  <sitemap>
    <loc>${url}</loc>
    <lastmod>${lastMod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

/**
 * Generate a single sitemap with all URLs when count is under 5000
 */
function generateSingleSitemap(lastMod: string) {
  const urls = generateAllDealSeoUrls()
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${lastMod}</lastmod>
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
