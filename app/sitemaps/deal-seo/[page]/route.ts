/**
 * Paginated sub-sitemap for /deals/seo/* pages
 * Each sub-sitemap contains up to 5000 URLs
 * Called from sitemap-deal-seo.xml index
 */
import { getDealSeoUrlsSlice, getDealSeoSitemapStats } from '@/lib/sitemaps/dealSeo'

export const revalidate = 3600 // ISR: revalidate every hour

export async function GET(
  request: Request,
  { params }: { params: Promise<{ page: string }> }
) {
  const { page: pageStr } = await params
  const page = parseInt(pageStr, 10)
  const now = new Date().toISOString().split('T')[0]
  
  // Validate page number
  const stats = getDealSeoSitemapStats()
  if (isNaN(page) || page < 1 || page > stats.sitemapCount) {
    return new Response('Not Found', { status: 404 })
  }
  
  // Get URLs for this page
  const urls = getDealSeoUrlsSlice(page)
  
  if (urls.length === 0) {
    return new Response('Not Found', { status: 404 })
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

/**
 * Generate static params for all sub-sitemaps
 */
export function generateStaticParams() {
  const stats = getDealSeoSitemapStats()
  return Array.from({ length: stats.sitemapCount }, (_, i) => ({
    page: String(i + 1),
  }))
}
