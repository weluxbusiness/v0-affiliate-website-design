// Sitemap for trending deal pages
// High-traffic pages targeting time-sensitive search queries

const baseUrl = "https://savesmart.bio"

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
  const now = new Date().toISOString().split('T')[0]
  
  // Generate URLs for all trending pages
  const urls = [
    // Main trending deals page (priority 1.0)
    {
      loc: `${baseUrl}/trending-deals`,
      lastmod: now,
      changefreq: "hourly",
      priority: "1.0",
    },
    // Category-specific trending pages
    ...TRENDING_CATEGORIES.map(category => ({
      loc: `${baseUrl}/trending/${category}`,
      lastmod: now,
      changefreq: "hourly",
      priority: "0.8",
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
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
