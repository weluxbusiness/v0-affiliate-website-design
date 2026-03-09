// Programmatic sitemap index - large-scale SEO pages
// Contains sub-sitemaps for: cities, price ranges, brand-categories, deals
// Architecture supports 500k+ URLs by splitting into multiple child sitemaps
const baseUrl = 'https://savesmart.bio'

export const revalidate = 3600 // ISR: revalidate every hour

export async function GET() {
  const now = new Date().toISOString().split('T')[0]
  
  // Sub-sitemaps for programmatic content (cross-dimensional pages)
  // Each can contain up to 50k URLs
  // Note: cities, price, guides, comparisons, deal-finder, trending are in main sitemap.xml
  const sitemaps = [
    // Brand × Category pages: /brands/[brand]/[category]
    // ~700 pages (45 brands × 15 categories)
    `${baseUrl}/sitemap-brand-categories.xml`,
    
    // Store × Category pages: /stores/[store]/[category]
    // ~500+ pages (30 stores × 20 categories)
    `${baseUrl}/sitemap-store-categories.xml`,
    
    // Category × Brand pages: /deals/[category]/[brand]
    // ~500+ pages (categories × brands where deals exist)
    `${baseUrl}/sitemap-category-brands.xml`,
    
    // Category × Brand × Store pages: /deals/[category]/[brand]/[store]
    // ~2000+ pages (categories × brands × stores)
    `${baseUrl}/sitemap-category-brand-stores.xml`,
    
    // Best category pages: /best/[category], /best/[category]/[brand]
    // ~500 pages
    `${baseUrl}/sitemap-best.xml`,
    
    // Individual deal pages: /deal/[slug]
    // Variable count based on database
    `${baseUrl}/sitemap-deals.xml`,
    
    // Coupon pages: /coupons/[store]
    `${baseUrl}/sitemap-coupons.xml`,
    
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
