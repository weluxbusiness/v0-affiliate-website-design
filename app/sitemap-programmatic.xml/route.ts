// Programmatic sitemap index - large-scale SEO pages
// Contains sub-sitemaps for: cities, price ranges, brand-categories, deals
// Architecture supports 500k+ URLs by splitting into multiple child sitemaps
const baseUrl = 'https://savesmart.bio'

export const revalidate = 3600 // ISR: revalidate every hour

export async function GET() {
  const now = new Date().toISOString().split('T')[0]
  
  // Sub-sitemaps for programmatic content
  // Each can contain up to 50k URLs
  // When a sitemap exceeds 50k, split into numbered parts (e.g., sitemap-cities-1.xml)
  const sitemaps = [
    // City-based pages: /deals/[category]/[city]
    // ~8,000 pages (20 categories × 400 cities)
    `${baseUrl}/sitemap-cities.xml`,
    
    // Price range pages: /deals/price/[slug]
    // ~50-100 pages
    `${baseUrl}/sitemap-price.xml`,
    
    // Brand × Category pages: /brands/[brand]/[category]
    // ~700 pages (45 brands × 15 categories)
    `${baseUrl}/sitemap-brand-categories.xml`,
    
    // Best category pages: /best/[category]
    // ~20 pages
    `${baseUrl}/sitemap-best.xml`,
    
    // Individual deal pages: /deal/[slug]
    // Variable count based on database
    `${baseUrl}/sitemap-deals.xml`,
    
    // Legacy SEO/promo pages: /promo/[slug]
    `${baseUrl}/sitemap-seo.xml`,
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(loc => `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
