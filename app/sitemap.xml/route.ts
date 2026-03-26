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
  
  // Sitemap priority order (Google crawls in order listed)
  // Only HIGH and MEDIUM priority sitemaps for maximum crawl efficiency
  const sitemaps = [
    // === HIGH PRIORITY: Core revenue-driving pages ===
    
    // 1. Main deal pages and programmatic content (highest traffic)
    `${baseUrl}/sitemap-programmatic.xml`,
    
    // 2. Gaming section: promo codes and free rewards (high engagement)
    `${baseUrl}/sitemap-gaming.xml`,
    
    // 3. Deal SEO pages: brand × price + category × price combinations
    `${baseUrl}/sitemap-deal-seo.xml`,
    
    // === MEDIUM PRIORITY: Authority & discovery pages ===
    
    // 4. Auto-generated blog posts (topical authority)
    `${baseUrl}/sitemap-blog-deals.xml`,
    
    // 5. Buying guides (topical authority content)
    `${baseUrl}/sitemap-guides.xml`,
    
    // 6. Comparison pages (high-intent keywords)
    `${baseUrl}/sitemap-comparisons.xml`,
    
    // 7. Category pages (main navigation, high search volume)
    `${baseUrl}/sitemap-categories.xml`,
    
    // 8. Brand pages (product discovery)
    `${baseUrl}/sitemap-brands.xml`,
    
    // 9. Store pages (conversion pages)
    `${baseUrl}/sitemap-stores.xml`,
  ]
  
  // REMOVED from index (files still exist for direct access):
  // LOW PRIORITY - moved to secondary:
  // - sitemap-cities.xml (local SEO, lower priority)
  // - sitemap-price.xml (price range pages)
  // - sitemap-deals-variants.xml (cheap/top variants)
  // - sitemap-pages.xml (static pages - already linked from homepage)
  // - sitemap-today.xml (time-sensitive, changes daily)
  // - sitemap-deal-compare.xml (brand vs brand)
  // - sitemap-deal-finder.xml (AI deal finder)
  // - sitemap-trending.xml (trending pages)
  // PAGINATION - excluded for crawl efficiency:
  // - sitemap-pagination.xml
  // - sitemap-store-pages.xml
  // - sitemap-category-pages.xml
  // - sitemap-brand-pages.xml
  // - sitemap-core.xml

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
