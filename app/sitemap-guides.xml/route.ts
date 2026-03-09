// Sitemap for buying guide pages
// Currently returns empty sitemap - guides feature not yet implemented

const baseUrl = 'https://savesmart.bio'

// Empty sitemap XML
const EMPTY_SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`

export const revalidate = 86400 // Revalidate daily

export async function GET() {
  // Guides feature not yet implemented - return empty sitemap
  return new Response(EMPTY_SITEMAP, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
