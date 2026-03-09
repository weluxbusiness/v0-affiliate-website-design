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
  
  // Top-level sitemap groups only
  // This keeps the main index small and fast for Google to parse
  const sitemaps = [
    // Core pages: homepage, categories, stores, brands, blog landing
    `${baseUrl}/sitemap-core.xml`,
    
    // Programmatic pages: cities, price ranges, brand-categories, deals
    `${baseUrl}/sitemap-programmatic.xml`,
  ]
  
  // Only include pagination sitemap if it has URLs
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
