// Main sitemap index - supports 100k+ pages by splitting into multiple sitemaps
// Architecture designed for scalability: each sub-sitemap contains max 10,000 URLs
const baseUrl = 'https://savesmart.bio'

export async function GET() {
  const now = new Date().toISOString().split('T')[0]
  
  // Sitemap index with all sub-sitemaps
  // Each sitemap should contain max 10,000 URLs for optimal performance
  // Priority order: higher priority sitemaps listed first for faster discovery
  const sitemaps = [
    // Core pages (highest priority)
    `${baseUrl}/sitemap-pages.xml`,
    
    // Store pages: /stores/[store]
    `${baseUrl}/sitemap-stores.xml`,
    
    // Brand pages: /brands/[brand]
    `${baseUrl}/sitemap-brands.xml`,
    
    // Brand × Category pages: /brands/[brand]/[category]
    `${baseUrl}/sitemap-brand-categories.xml`,
    
    // Coupon pages: /coupons/[store]
    `${baseUrl}/sitemap-coupons.xml`,
    
    // Category pages: /deals/[category]
    `${baseUrl}/sitemap-categories.xml`,
    
    // Unified pagination sitemap: all /page/[page] routes
    // Covers categories, stores, and brands pagination (page 2+)
    `${baseUrl}/sitemap-pagination.xml`,
    
    // Best category pages: /best/[category]
    `${baseUrl}/sitemap-best.xml`,
    
    // Store + Category combinations: /stores/[store]/[category]
    `${baseUrl}/sitemap-store-categories.xml`,
    
    // Price range pages
    `${baseUrl}/sitemap-price.xml`,
    
    // Individual deal pages
    `${baseUrl}/sitemap-deals.xml`,
    
    // City-based pages: /deals/[category]/[city]
    // Note: This can be split into multiple sitemaps if > 50k pages
    `${baseUrl}/sitemap-cities.xml`,
    
    // Blog posts
    `${baseUrl}/sitemap-blog.xml`,
    
    // Legacy SEO pages
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
