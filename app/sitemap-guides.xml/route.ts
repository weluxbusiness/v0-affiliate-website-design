// Sitemap for buying guide pages: /guides/[slug]
// Long-form SEO content pages for topical authority

import { GUIDE_TOPICS } from '@/lib/seo/guide-generator'

const baseUrl = 'https://savesmart.bio'

// Empty sitemap XML for fallback
const EMPTY_SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`

export const revalidate = 86400 // Revalidate daily

export async function GET() {
  try {
    const now = new Date().toISOString().split('T')[0]
    
    // Get all guide slugs from the generator
    const guideSlugs = GUIDE_TOPICS.map(guide => guide.slug)
    
    // Return empty sitemap if no guides exist
    if (!guideSlugs || guideSlugs.length === 0) {
      return new Response(EMPTY_SITEMAP, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      })
    }
    
    // Generate URLs for all guides plus the index page (limit to 50k)
    const urls = [
      // Guides index page
      {
        loc: `${baseUrl}/guides`,
        lastmod: now,
        changefreq: 'weekly',
        priority: '0.8',
      },
      // Individual guide pages
      ...guideSlugs.slice(0, 49999).map(slug => ({
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
  } catch (error) {
    console.error('[sitemap-guides] Error:', error)
    return new Response(EMPTY_SITEMAP, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  }
}
