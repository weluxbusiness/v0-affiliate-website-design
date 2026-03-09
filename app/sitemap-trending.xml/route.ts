// Sitemap for trending deal pages
// High-traffic pages targeting time-sensitive search queries

const baseUrl = "https://savesmart.bio"

// Empty sitemap XML for fallback
const EMPTY_SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`

// Static category list for trending pages
const TRENDING_CATEGORIES = [
  "laptops",
  "sneakers", 
  "headphones",
  "electronics",
  "fashion",
  "home",
  "gaming",
]

export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  try {
    const now = new Date().toISOString().split('T')[0]
    
    // Dynamically import to handle potential errors
    let TRENDING_PAGES: { slug: string; priority: number }[] = []
    try {
      const trendingAlgorithm = await import("@/lib/seo/trending-algorithm")
      TRENDING_PAGES = trendingAlgorithm.TRENDING_PAGES || []
    } catch (err) {
      console.error('[sitemap-trending] Error importing trending-algorithm:', err)
      TRENDING_PAGES = []
    }
    
    // Generate URLs for all trending pages
    const urls = [
      // Main trending deals page (priority 1.0)
      {
        loc: `${baseUrl}/trending-deals`,
        lastmod: now,
        changefreq: "hourly",
        priority: "1.0",
      },
      // Dynamic trending pages from algorithm
      ...TRENDING_PAGES.map(page => ({
        loc: `${baseUrl}/trending/${page.slug}`,
        lastmod: now,
        changefreq: "hourly",
        priority: page.priority?.toString() || "0.8",
      })),
      // Category-specific trending pages
      ...TRENDING_CATEGORIES.map(category => ({
        loc: `${baseUrl}/trending/${category}`,
        lastmod: now,
        changefreq: "hourly",
        priority: "0.8",
      })),
    ]
    
    // De-duplicate URLs by loc (limit to 50k)
    const uniqueUrls = [...new Map(urls.map(u => [u.loc, u])).values()].slice(0, 50000)
    
    // Return empty sitemap if no URLs exist (don't 404)
    if (!uniqueUrls || uniqueUrls.length === 0) {
      return new Response(EMPTY_SITEMAP, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      })
    }
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueUrls.map(({ loc, lastmod, changefreq, priority }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`
    
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('[sitemap-trending] Unhandled error:', error)
    return new Response(EMPTY_SITEMAP, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  }
}
