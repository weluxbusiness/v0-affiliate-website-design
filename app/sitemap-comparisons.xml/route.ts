// Sitemap for product comparison pages: /compare/[slug]
// Generates popular brand and product comparisons

import { getBrandSlugs } from '@/lib/seo-data'

const baseUrl = 'https://savesmart.bio'

// Empty sitemap XML for fallback
const EMPTY_SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`

export const revalidate = 3600 // ISR: revalidate every hour

// Popular product/brand comparison pairs (static)
const POPULAR_COMPARISONS = [
  'macbook-air-vs-dell-xps',
  'iphone-vs-samsung-galaxy',
  'airpods-vs-sony-wf',
  'playstation-vs-xbox',
  'nintendo-switch-vs-steam-deck',
  'apple-watch-vs-fitbit',
  'dyson-vs-shark',
  'roomba-vs-dyson',
  'nike-vs-adidas',
  'new-balance-vs-nike',
  'bose-vs-sony-headphones',
  'samsung-vs-lg-tv',
]

export async function GET() {
  try {
    const now = new Date().toISOString().split('T')[0]
    
    // Get brand slugs for dynamic comparisons
    let brands: string[] = []
    try {
      brands = await getBrandSlugs()
    } catch {
      brands = []
    }
    
    const popularBrands = brands.slice(0, 15)
    
    // Generate brand vs brand combinations
    const dynamicComparisons: string[] = []
    for (let i = 0; i < popularBrands.length; i++) {
      for (let j = i + 1; j < popularBrands.length; j++) {
        dynamicComparisons.push(`${popularBrands[i]}-vs-${popularBrands[j]}`)
      }
    }
    
    // Combine static and dynamic, remove duplicates, limit to 50k
    const allComparisons = [...new Set([...POPULAR_COMPARISONS, ...dynamicComparisons])].slice(0, 49999)
    
    if (!allComparisons || allComparisons.length === 0) {
      return new Response(EMPTY_SITEMAP, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      })
    }
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/compare</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
${allComparisons.map(slug => `  <url>
    <loc>${baseUrl}/compare/${slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('[sitemap-comparisons] Error:', error)
    return new Response(EMPTY_SITEMAP, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  }
}
