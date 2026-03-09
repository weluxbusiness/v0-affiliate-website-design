// Sitemap for buying guide pages: /guides/[slug]
// Long-form SEO content pages for topical authority

import { getAllGuideSlugs } from '@/lib/seo/guide-generator'

const baseUrl = 'https://savesmart.bio'

export const revalidate = 86400 // Revalidate daily

export async function GET() {
  const now = new Date().toISOString().split('T')[0]
  const guideSlugs = getAllGuideSlugs()
  
  // Return 404 if no guides exist
  if (guideSlugs.length === 0) {
    return new Response('No guide URLs available', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    })
  }
  
  // Generate URLs for all guides plus the index page
  const urls = [
    // Guides index page
    {
      loc: `${baseUrl}/guides`,
      lastmod: now,
      changefreq: 'weekly',
      priority: '0.8',
    },
    // Individual guide pages
    ...guideSlugs.map(slug => ({
      loc: `${baseUrl}/guides/${slug}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: '0.7',
    })),
  ]
  
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
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
