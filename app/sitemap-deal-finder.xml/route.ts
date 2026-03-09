// Sitemap for deal finder pages: /deal-finder/[slug]

import { DEAL_FINDER_PAGES } from '@/lib/seo/deal-ranking'

const baseUrl = "https://savesmart.bio"

// Empty sitemap XML for fallback
const EMPTY_SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`

export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  try {
    const now = new Date().toISOString().split('T')[0]
    
    // Generate URLs for all deal finder pages (limit to 50k)
    const urls = [
      // Index page
      {
        loc: `${baseUrl}/deal-finder`,
        lastmod: now,
        changefreq: "daily",
        priority: "0.9",
      },
      // Individual deal finder pages
      ...DEAL_FINDER_PAGES.slice(0, 49999).map(page => ({
        loc: `${baseUrl}/deal-finder/${page.slug}`,
        lastmod: now,
        changefreq: "hourly",
        priority: page.priority?.toString() || "0.7",
      })),
    ]
    
    if (!urls || urls.length === 0) {
      return new Response(EMPTY_SITEMAP, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      })
    }
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ loc, lastmod, changefreq, priority }) => `  <url>
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
    console.error('[sitemap-deal-finder] Error:', error)
    return new Response(EMPTY_SITEMAP, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  }
}
