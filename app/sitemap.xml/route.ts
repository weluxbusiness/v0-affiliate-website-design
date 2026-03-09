// Main sitemap index - hierarchical structure for 100k+ pages
// Architecture: top-level groups for optimal crawl efficiency
// Each sub-sitemap respects 50k URL limit per Google guidelines
const baseUrl = 'https://savesmart.bio'

// Empty sitemap index for fallback
const EMPTY_SITEMAP_INDEX = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</sitemapindex>`

export const revalidate = 3600 // ISR: revalidate every hour

// Check if pagination sitemap has any URLs (with timeout)
async function hasPaginationUrls(): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5s timeout
    
    const response = await fetch(`${baseUrl}/sitemap-pagination.xml`, {
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    // Returns 404 when empty, 200 when has URLs
    return response.ok
  } catch {
    // If fetch fails or times out, assume no pagination URLs
    return false
  }
}

export async function GET() {
  try {
    const now = new Date().toISOString().split('T')[0]
    
    // Check if pagination sitemap has URLs
    let includePagination = false
    try {
      includePagination = await hasPaginationUrls()
    } catch {
      includePagination = false
    }
  
  // Sitemap priority order (Google crawls in order listed)
  // All sitemaps respect 50k URL limit per Google guidelines
  const sitemaps = [
    // 1. Static pages: homepage, about, privacy, terms, blog index
    `${baseUrl}/sitemap-pages.xml`,
    
    // 2. Category pages (main navigation, high search volume)
    `${baseUrl}/sitemap-categories.xml`,
    
    // 3. Brand pages (product discovery)
    `${baseUrl}/sitemap-brands.xml`,
    
    // 4. Store pages (conversion pages)
    `${baseUrl}/sitemap-stores.xml`,
    
    // 5. City pages (local SEO)
    `${baseUrl}/sitemap-cities.xml`,
    
    // 6. Price range pages
    `${baseUrl}/sitemap-price.xml`,
    
    // 7. Buying guides (topical authority content)
    `${baseUrl}/sitemap-guides.xml`,
    
    // 8. Comparison pages (high-intent keywords)
    `${baseUrl}/sitemap-comparisons.xml`,
    
    // 9. Deal Finder pages (high-intent search terms)
    `${baseUrl}/sitemap-deal-finder.xml`,
    
    // 10. Trending pages (time-sensitive, high-traffic)
    `${baseUrl}/sitemap-trending.xml`,
    
    // 11. Programmatic pages: brand-categories, store-categories, category-brands, best, deals
    `${baseUrl}/sitemap-programmatic.xml`,
    
    // 12. Deal SEO pages: /deals/seo/[slug] (brand × price + category × price)
    // 6,660+ pages auto-generated from deal-pages dataset
    `${baseUrl}/sitemap-deal-seo.xml`,
    
    // 13. Today's deals pages: /deals/today, /deals/today/[entity]
    // Fresh content updated daily for categories and brands
    `${baseUrl}/sitemap-today.xml`,
    
    // 14. Deal comparison pages: /deals/compare/[brandA]-vs-[brandB]
    // Brand vs Brand deal comparisons with pros/cons
    `${baseUrl}/sitemap-deal-compare.xml`,
  ]
  
  // Only include pagination sitemap if it has URLs (lowest priority)
  if (includePagination) {
    sitemaps.push(`${baseUrl}/sitemap-pagination.xml`)
  }

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
