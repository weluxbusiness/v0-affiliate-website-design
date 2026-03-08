// Core sitemap - high-priority pages that form the site's main structure
// Includes: homepage, categories, stores, brands, coupons, blog
// Max 50k URLs per sitemap (Google limit)
const baseUrl = 'https://savesmart.bio'

export const revalidate = 3600 // ISR: revalidate every hour

export async function GET() {
  const now = new Date().toISOString().split('T')[0]
  
  // Sub-sitemaps for core content
  const sitemaps = [
    // Static pages: homepage, about, how-it-works, etc.
    `${baseUrl}/sitemap-pages.xml`,
    
    // Store pages: /stores/[store]
    `${baseUrl}/sitemap-stores.xml`,
    
    // Brand pages: /brands/[brand]
    `${baseUrl}/sitemap-brands.xml`,
    
    // Coupon pages: /coupons/[store]
    `${baseUrl}/sitemap-coupons.xml`,
    
    // Category pages: /deals/[category]
    `${baseUrl}/sitemap-categories.xml`,
    
    // Store + Category: /stores/[store]/[category]
    `${baseUrl}/sitemap-store-categories.xml`,
    
    // Blog posts
    `${baseUrl}/sitemap-blog.xml`,
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
