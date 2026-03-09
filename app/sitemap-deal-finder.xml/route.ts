// Sitemap for deal finder pages: /deals-finder/[slug]
import { DEAL_FINDER_PAGES } from "@/lib/seo/deal-ranking"

const baseUrl = "https://savesmart.bio"

export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  const now = new Date().toISOString().split('T')[0]
  
  // Generate URLs for all deal finder pages
  const urls = [
    // Index page
    {
      loc: `${baseUrl}/deals-finder`,
      lastmod: now,
      changefreq: "daily",
      priority: "0.9",
    },
    // Individual deal finder pages
    ...DEAL_FINDER_PAGES.map(page => ({
      loc: `${baseUrl}/deals-finder/${page.slug}`,
      lastmod: now,
      changefreq: "hourly",
      priority: page.priority.toString(),
    })),
  ]
  
  // Return 404 if no URLs exist (safety check)
  if (urls.length === 0) {
    return new Response('No deal finder URLs available', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  }
  
  // Generate XML
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
}
