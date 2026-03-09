// Main sitemap index - hierarchical structure for 100k+ pages
// Architecture: 3 top-level groups for optimal crawl efficiency
// Each sub-sitemap respects 50k URL limit per Google guidelines
const baseUrl = 'https://savesmart.bio'

export const revalidate = 3600 // ISR: revalidate every hour

// Check if pagination sitemap has any URLs
async function hasPaginationUrls(): Promise<boolean> {
  try {
    const response = await fetch(`${baseUrl}/sitemap-pagination.xml`, {
      method: 'HEAD',
      cache: 'no-store',
    })
    // Returns 404 when empty, 200 when has URLs
    return response.ok
  } catch {
    // If fetch fails, assume no pagination URLs to avoid broken sitemap reference
    return false
  }
}

export async function GET() {
  const now = new Date().toISOString().split('T')[0]
  
  // Check if pagination sitemap has URLs
  const includePagination = await hasPaginationUrls()
  
  // Sitemap priority order (Google crawls in order listed)
  // Priority: Category > Store > Brand > Comparison > Programmatic > Pagination
  const sitemaps = [
    // 1. HIGHEST PRIORITY: Category pages (main navigation, high search volume)
    `${baseUrl}/sitemap-categories.xml`,
    
    // 2. Store pages (brand authority, conversion pages)
    `${baseUrl}/sitemap-stores.xml`,
    
    // 3. Brand pages (product discovery)
    `${baseUrl}/sitemap-brands.xml`,
    
    // 4. Comparison pages (high-intent keywords)
    `${baseUrl}/sitemap-comparisons.xml`,
    
    // 5. Core pages: homepage, static pages, blog
    `${baseUrl}/sitemap-core.xml`,
    
    // 6. Programmatic pages: cities, price ranges, brand-categories
    `${baseUrl}/sitemap-programmatic.xml`,
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
}
