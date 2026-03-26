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
  // Only high-value sitemaps - removed pagination pages for crawl efficiency
  const sitemaps = [
    // === CORE: High-value deal pages ===
    
    // 1. Static pages: homepage, about, privacy, terms, blog index
    `${baseUrl}/sitemap-pages.xml`,
    
    // 2. Main deal pages and programmatic content
    `${baseUrl}/sitemap-programmatic.xml`,
    
    // 3. Gaming section: /gaming, /gaming/[game], /gaming/[game]/codes, /gaming/[game]/rewards
    `${baseUrl}/sitemap-gaming.xml`,
    
    // 4. Deal SEO pages: /deals/seo/[slug] (brand × price + category × price)
    `${baseUrl}/sitemap-deal-seo.xml`,
    
    // === CONTENT: Authority-building pages ===
    
    // 5. Auto-generated blog posts: /blog/deals/[slug]
    `${baseUrl}/sitemap-blog-deals.xml`,
    
    // 6. Buying guides (topical authority content)
    `${baseUrl}/sitemap-guides.xml`,
    
    // 7. Comparison pages (high-intent keywords)
    `${baseUrl}/sitemap-comparisons.xml`,
    
    // === STRUCTURE: Navigation & discovery ===
    
    // 8. Category pages (main navigation, high search volume)
    `${baseUrl}/sitemap-categories.xml`,
    
    // 9. Brand pages (product discovery)
    `${baseUrl}/sitemap-brands.xml`,
    
    // 10. Store pages (conversion pages)
    `${baseUrl}/sitemap-stores.xml`,
    
    // === SUPPLEMENTAL: Additional high-value pages ===
    
    // 11. Today's deals pages: /deals/today, /deals/today/[entity]
    `${baseUrl}/sitemap-today.xml`,
    
    // 12. Deal comparison pages: /deals/compare/[brandA]-vs-[brandB]
    `${baseUrl}/sitemap-deal-compare.xml`,
    
    // 13. Deal Finder pages (high-intent search terms)
    `${baseUrl}/sitemap-deal-finder.xml`,
    
    // 14. Trending pages (time-sensitive, high-traffic)
    `${baseUrl}/sitemap-trending.xml`,
    
    // 15. Deal variants: cheap, top, price-based pages
    `${baseUrl}/sitemap-deals-variants.xml`,
    
    // 16. City pages (local SEO)
    `${baseUrl}/sitemap-cities.xml`,
    
    // 17. Price range pages
    `${baseUrl}/sitemap-price.xml`,
  ]
  
  // REMOVED from index (files still exist for direct access):
  // - sitemap-pagination.xml (low-value pagination pages)
  // - sitemap-store-pages.xml (store pagination)
  // - sitemap-category-pages.xml (category pagination)
  // - sitemap-brand-pages.xml (brand pagination)
  // - sitemap-core.xml (redundant with other sitemaps)

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
