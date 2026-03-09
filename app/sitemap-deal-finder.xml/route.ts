// Sitemap for deal finder pages
// Links to deal-finder which exists at /deal-finder (not /deals-finder)

const baseUrl = "https://savesmart.bio"

export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  const now = new Date().toISOString().split('T')[0]
  
  // Generate URLs for deal finder page
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/deal-finder</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
