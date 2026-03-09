// Sitemap for product comparison pages
// Currently returns empty sitemap - compare pages not yet implemented

const EMPTY_SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`

export const revalidate = 3600 // ISR: revalidate every hour

export async function GET() {
  // Compare feature not yet implemented - return empty sitemap
  return new Response(EMPTY_SITEMAP, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
