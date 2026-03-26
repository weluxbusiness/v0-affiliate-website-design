/**
 * Quality-First Sitemap
 * ONLY includes pages with custom SEO content
 * This sitemap is the primary one for GSC submission
 * Limited to high-quality pages for maximum crawl efficiency
 * 
 * DYNAMIC LASTMOD: Updates on every build/request
 */
import { getAllSEOContentUrls, getSEOContentCount } from '@/lib/seo/programmatic-seo-content'
import { getAllGameSlugs } from '@/lib/gaming-data'
import { getLatestDealUpdateTime } from '@/lib/deals-cached'

const baseUrl = 'https://savesmart.bio'

// Revalidate every 24 hours for freshness
export const revalidate = 86400

/**
 * Log all indexable pages for monitoring
 * Ensures no empty pages are included in sitemap
 */
function logIndexablePages(urls: { url: string; priority: string; changefreq: string }[]) {
  console.log('[sitemap-quality] === INDEXABLE PAGES ===')
  console.log(`[sitemap-quality] Total URLs: ${urls.length}`)
  
  // Group by priority
  const byPriority: Record<string, string[]> = {}
  urls.forEach(u => {
    if (!byPriority[u.priority]) byPriority[u.priority] = []
    byPriority[u.priority].push(u.url)
  })
  
  Object.entries(byPriority)
    .sort(([a], [b]) => parseFloat(b) - parseFloat(a))
    .forEach(([priority, pageUrls]) => {
      console.log(`[sitemap-quality] Priority ${priority}: ${pageUrls.length} pages`)
      pageUrls.forEach(url => console.log(`[sitemap-quality]   - ${url}`))
    })
  
  console.log('[sitemap-quality] === END INDEXABLE PAGES ===')
}

export async function GET() {
  try {
    // Dynamic lastmod - uses actual data update time
    let lastMod: string
    try {
      const latestUpdate = await getLatestDealUpdateTime()
      lastMod = latestUpdate.split('T')[0]
    } catch {
      lastMod = new Date().toISOString().split('T')[0]
    }
    
    // Get all URLs with custom SEO content
    const seoContentUrls = getAllSEOContentUrls()
    
    // Core static pages (always high quality)
    const staticPages = [
      { url: `${baseUrl}`, priority: '1.0', changefreq: 'daily' },
      { url: `${baseUrl}/deals`, priority: '0.9', changefreq: 'daily' },
      { url: `${baseUrl}/gaming`, priority: '0.9', changefreq: 'daily' },
      { url: `${baseUrl}/gaming/promo-codes`, priority: '0.9', changefreq: 'daily' },
      { url: `${baseUrl}/gaming/best-codes`, priority: '0.8', changefreq: 'daily' },
      { url: `${baseUrl}/gaming/top-games`, priority: '0.8', changefreq: 'daily' },
      { url: `${baseUrl}/gaming/free-rewards`, priority: '0.8', changefreq: 'daily' },
      { url: `${baseUrl}/gaming/today`, priority: '0.9', changefreq: 'hourly' },
      { url: `${baseUrl}/deals/today`, priority: '0.9', changefreq: 'hourly' },
      { url: `${baseUrl}/deals/trending`, priority: '0.8', changefreq: 'daily' },
      { url: `${baseUrl}/categories`, priority: '0.7', changefreq: 'weekly' },
      { url: `${baseUrl}/brands`, priority: '0.7', changefreq: 'weekly' },
      { url: `${baseUrl}/stores`, priority: '0.7', changefreq: 'weekly' },
      { url: `${baseUrl}/guides`, priority: '0.7', changefreq: 'weekly' },
    ]
    
    // Combine all URLs, prioritizing SEO content pages
    const allUrls = [
      ...staticPages,
      ...seoContentUrls,
    ]
    
    // Deduplicate and limit to 100 URLs max for quality-first approach
    const uniqueUrls = Array.from(new Map(allUrls.map(u => [u.url, u])).values())
      .slice(0, 100)
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueUrls.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    // Log all indexable URLs for monitoring
    logIndexablePages(uniqueUrls)
    console.log(`[sitemap-quality] Generated ${uniqueUrls.length} URLs (${getSEOContentCount()} with custom SEO content)`)

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('[sitemap-quality] Error generating sitemap:', error)
    
    // Return minimal valid sitemap on error
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <priority>1.0</priority>
  </url>
</urlset>`
    
    return new Response(fallback, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  }
}
