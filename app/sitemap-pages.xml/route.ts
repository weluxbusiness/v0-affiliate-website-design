// Sitemap for static/core pages
const baseUrl = 'https://savesmart.bio'

const staticPages = [
  // Homepage
  { path: '/', changefreq: 'daily', priority: 1.0 },
  
  // Main deal pages
  { path: '/deals', changefreq: 'hourly', priority: 0.9 },
  { path: '/deals/trending', changefreq: 'hourly', priority: 0.9 },
  { path: '/deals/today', changefreq: 'hourly', priority: 0.9 },
  { path: '/deals/compare', changefreq: 'daily', priority: 0.8 },
  { path: '/latest-deals', changefreq: 'hourly', priority: 0.9 },
  { path: '/trending-deals', changefreq: 'hourly', priority: 0.9 },
  
  // Trending categories
  { path: '/trending/laptops', changefreq: 'hourly', priority: 0.85 },
  { path: '/trending/sneakers', changefreq: 'hourly', priority: 0.85 },
  { path: '/trending/headphones', changefreq: 'hourly', priority: 0.85 },
  { path: '/trending/electronics', changefreq: 'hourly', priority: 0.85 },
  { path: '/trending/fashion', changefreq: 'hourly', priority: 0.85 },
  { path: '/trending/home', changefreq: 'hourly', priority: 0.85 },
  { path: '/trending/gaming', changefreq: 'hourly', priority: 0.85 },
  { path: '/trending/tvs', changefreq: 'hourly', priority: 0.85 },
  { path: '/trending/smartphones', changefreq: 'hourly', priority: 0.85 },
  { path: '/trending/smartwatches', changefreq: 'hourly', priority: 0.85 },
  
  // Content pages
  { path: '/blog', changefreq: 'daily', priority: 0.8 },
  { path: '/deal-finder', changefreq: 'weekly', priority: 0.8 },
  { path: '/how-it-works', changefreq: 'monthly', priority: 0.7 },
  { path: '/help-center', changefreq: 'monthly', priority: 0.6 },
  
  // Legal pages
  { path: '/privacy-policy', changefreq: 'monthly', priority: 0.3 },
  { path: '/terms-of-service', changefreq: 'monthly', priority: 0.3 },
  { path: '/cookie-policy', changefreq: 'monthly', priority: 0.3 },
  { path: '/affiliate-disclosure', changefreq: 'monthly', priority: 0.3 },
]

export async function GET() {
  const now = new Date().toISOString().split('T')[0]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
