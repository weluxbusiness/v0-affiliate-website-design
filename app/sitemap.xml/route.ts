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
  // QUALITY-FIRST APPROACH:
  // Submit sitemap-quality.xml directly to GSC - contains ONLY pages
  // with custom SEO content (50-100 high-quality URLs)
  //
  // MANUAL SUBMISSION (submit these to GSC):
  //   1. sitemap-quality.xml (PRIMARY - only pages with SEO content)
  //   2. sitemap-gaming.xml (gaming promo codes - fast traffic)
  //
  // Secondary sitemaps for broader coverage once quality pages rank.
  // ============================================================

  // Quality-first sitemap ordering
  // ONLY include sitemaps with verified high-quality content
  const sitemaps = [
    // === PRIMARY: Quality pages with custom SEO content ===
    `${baseUrl}/sitemap-quality.xml`,       // SUBMIT FIRST - only pages with SEO content
    `${baseUrl}/sitemap-gaming.xml`,        // Gaming promo codes (high engagement)
    
    // === SECONDARY: Auto-discovered after quality pages indexed ===
    `${baseUrl}/sitemap-guides.xml`,        // Buying guides (authority content)
    `${baseUrl}/sitemap-comparisons.xml`,   // Comparison pages (high intent)
    `${baseUrl}/sitemap-brands.xml`,        // Brand pages
    `${baseUrl}/sitemap-categories.xml`,    // Category pages
    `${baseUrl}/sitemap-stores.xml`,        // Store pages
  ]
  
  // EXCLUDED from index for quality-first strategy:
  // - sitemap-programmatic.xml (too many pages without unique content)
  // - sitemap-deal-seo.xml (programmatic, lower quality)
  // - sitemap-blog-deals.xml (auto-generated)
  // - sitemap-pages.xml (static pages)
  // - sitemap-today.xml (time-sensitive)
  // - sitemap-trending.xml (trending pages)
  // - sitemap-deal-finder.xml (AI deal finder)
  // - sitemap-deal-compare.xml (comparisons)
  // - sitemap-cities.xml (local SEO)
  // - sitemap-price.xml (price range pages)
  // - sitemap-deals-variants.xml (cheap/top variants)
  // - All pagination sitemaps

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
