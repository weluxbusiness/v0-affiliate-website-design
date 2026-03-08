import { getAllSeoSlugs } from '@/lib/seo/seo-slug-parser'

const baseUrl = 'https://savesmart.bio'

export async function GET() {
  const now = new Date().toISOString().split('T')[0]
  
  // Get all programmatic SEO slugs
  const seoSlugs = getAllSeoSlugs()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${seoSlugs.map(slug => `  <url>
    <loc>${baseUrl}/promo/${slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
