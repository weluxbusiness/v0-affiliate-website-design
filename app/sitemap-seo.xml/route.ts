import { getAllSeoSlugs } from '@/lib/seo/seo-slug-parser'

const baseUrl = 'https://savesmart.bio'

// Determine SEO priority and changefreq based on URL pattern
function getSeoMetadata(slug: string): { priority: string; changefreq: string } {
  // HIGH PRIORITY: best-* pages (e.g., best-laptops, best-headphones)
  // These are high-intent, curated content pages
  if (slug.startsWith('best-')) {
    return { priority: '0.9', changefreq: 'daily' }
  }
  
  // MEDIUM PRIORITY: [category]-under-[price] pages (e.g., laptops-under-500)
  // Price-filtered pages with good search intent
  if (slug.includes('-under-')) {
    return { priority: '0.7', changefreq: 'weekly' }
  }
  
  // LOW PRIORITY: [brand]-[category] pages (e.g., dyson-tablets)
  // Brand x category combinations, more niche traffic
  return { priority: '0.5', changefreq: 'monthly' }
}

export async function GET() {
  const now = new Date().toISOString().split('T')[0]
  
  // Get all programmatic SEO slugs
  const seoSlugs = getAllSeoSlugs()
  
  // Respect Google's 50k URL limit per sitemap
  const limitedSlugs = seoSlugs.slice(0, 50000)

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${limitedSlugs.map(slug => {
  const { priority, changefreq } = getSeoMetadata(slug)
  return `  <url>
    <loc>${baseUrl}/promo/${slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
