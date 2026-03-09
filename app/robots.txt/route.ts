// robots.txt - Critical for SEO crawling
// Allows full site crawl while blocking low-value paths

export const revalidate = 86400 // Revalidate once per day

export async function GET() {
  const baseUrl = "https://savesmart.bio"
  
  const robotsTxt = `# SaveSmart robots.txt
# Allow all crawlers to index the site

User-agent: *
Allow: /

# Block pagination beyond page 5 (thin content)
Disallow: /*/page/[6-9]
Disallow: /*/page/[1-9][0-9]

# Block search and filter URLs
Disallow: /search?
Disallow: /*?sort=
Disallow: /*?filter=

# Block admin and API routes
Disallow: /api/
Disallow: /admin/

# Crawl delay for politeness (optional, not all bots respect this)
Crawl-delay: 1

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-core.xml
Sitemap: ${baseUrl}/sitemap-programmatic.xml
`

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
