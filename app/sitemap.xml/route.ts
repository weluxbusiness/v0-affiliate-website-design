// Main sitemap index - optimized for SEO crawl efficiency
// Architecture: only high-value sitemaps for faster indexing
// Each sub-sitemap respects 50k URL limit per Google guidelines
const baseUrl = 'https://savesmart.bio'

// Empty sitemap index for fallback
const EMPTY_SITEMAP_INDEX = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</sitemapindex>`

export const revalidate = 3600 // ISR: revalidate every hour

export async function GET() {
  try {
    const now = new Date().toISOString().split('T')[0]
  
  // ============================================================
  // SITEMAP STRATEGY FOR GOOGLE SEARCH CONSOLE
  // ============================================================
  // 
  // MANUAL SUBMISSION (submit these 4 directly in GSC):
  //   1. sitemap.xml (this file - the index)
  //   2. sitemap-programmatic.xml
  //   3. sitemap-deal-seo.xml  
  //   4. sitemap-gaming.xml
  //
  // Google will auto-discover all other sitemaps from this index.
  // ============================================================

  // All sitemaps included - Google discovers secondary ones automatically
  // Order: HIGH priority first, then MEDIUM, then LOW
  const sitemaps = [
    // === HIGH PRIORITY: Submit manually to GSC ===
    `${baseUrl}/sitemap-programmatic.xml`,  // Main deal pages (highest traffic)
    `${baseUrl}/sitemap-deal-seo.xml`,      // Brand × price combinations
    `${baseUrl}/sitemap-gaming.xml`,        // Gaming promo codes (high engagement)
    
    // === MEDIUM PRIORITY: Auto-discovered by Google ===
    `${baseUrl}/sitemap-blog-deals.xml`,    // Auto-generated blog posts
    `${baseUrl}/sitemap-guides.xml`,        // Buying guides
    `${baseUrl}/sitemap-comparisons.xml`,   // Comparison pages
    `${baseUrl}/sitemap-categories.xml`,    // Category pages
    `${baseUrl}/sitemap-brands.xml`,        // Brand pages
    `${baseUrl}/sitemap-stores.xml`,        // Store pages
    
    // === LOW PRIORITY: Auto-discovered, lower crawl priority ===
    `${baseUrl}/sitemap-pages.xml`,         // Static pages
    `${baseUrl}/sitemap-today.xml`,         // Today's deals
    `${baseUrl}/sitemap-trending.xml`,      // Trending pages
    `${baseUrl}/sitemap-deal-finder.xml`,   // AI deal finder
    `${baseUrl}/sitemap-deal-compare.xml`,  // Brand vs brand
  ]
  
  // NOT included in index (files exist for direct access if needed):
  // - sitemap-cities.xml (local SEO, very low priority)
  // - sitemap-price.xml (price range pages)
  // - sitemap-deals-variants.xml (cheap/top variants)
  // - sitemap-pagination.xml (pagination pages)
  // - sitemap-store-pages.xml (store pagination)
  // - sitemap-category-pages.xml (category pagination)
  // - sitemap-brand-pages.xml (brand pagination)
  // - sitemap-core.xml (redundant)

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
  } catch (error) {
    console.error('[sitemap.xml] Unhandled error:', error)
    return new Response(EMPTY_SITEMAP_INDEX, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  }
}
