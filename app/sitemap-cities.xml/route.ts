import { getCategorySlugs } from '@/lib/seo-data'
import { cities, getPopularCities } from '@/lib/cities'

const baseUrl = 'https://savesmart.bio'

// Revalidate sitemap every hour
export const revalidate = 3600

// Fallback categories
const FALLBACK_CATEGORIES = [
  'electronics', 'fashion', 'home-kitchen', 'laptops', 'headphones',
  'sneakers', 'tvs', 'smartphones', 'gaming', 'fitness', 'beauty',
  'vacuums', 'kitchen', 'outdoor', 'smartwatches', 'jackets', 'jeans'
]

export async function GET() {
  // Get categories from database with fallback
  let categories = await getCategorySlugs()
  if (categories.length === 0) {
    categories = FALLBACK_CATEGORIES
  }
  
  // Use popular cities for the sitemap to keep it manageable
  // This generates category × city combinations
  const popularCities = getPopularCities(100)
  
  const now = new Date().toISOString()
  
  // Generate URLs for all category + city combinations
  const urls: string[] = []
  
  for (const category of categories.slice(0, 20)) {
    for (const city of popularCities) {
      urls.push(`
    <url>
      <loc>${baseUrl}/deals/${category}/city/${city}</loc>
      <lastmod>${now}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.6</priority>
    </url>`)
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join('')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
