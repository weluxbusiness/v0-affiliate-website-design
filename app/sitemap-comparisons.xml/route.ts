// Sitemap for product comparison pages: /compare/[slug]
// Generates popular brand and product comparisons

import { getBrandSlugs } from '@/lib/seo-data'

const baseUrl = 'https://savesmart.bio'

// Empty sitemap XML for fallback
const EMPTY_SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`

export const revalidate = 3600 // ISR: revalidate every hour

// Popular product/brand comparison pairs (static fallback)
const POPULAR_COMPARISONS = [
  // Tech comparisons
  'macbook-air-vs-dell-xps',
  'iphone-vs-samsung-galaxy',
  'airpods-vs-sony-wf',
  'airpods-pro-vs-bose-quietcomfort',
  'playstation-vs-xbox',
  'nintendo-switch-vs-steam-deck',
  'apple-watch-vs-fitbit',
  'apple-watch-vs-samsung-galaxy-watch',
  'macbook-pro-vs-dell-xps',
  'ipad-vs-samsung-tab',
  'bose-vs-sony-headphones',
  'samsung-vs-lg-tv',
  'roku-vs-fire-tv',
  'google-pixel-vs-iphone',
  
  // Home appliance comparisons
  'dyson-vs-shark',
  'roomba-vs-dyson',
  'ninja-vs-vitamix',
  'keurig-vs-nespresso',
  'instant-pot-vs-ninja-foodi',
  'kitchenaid-vs-cuisinart',
  
  // Fashion/footwear comparisons
  'nike-vs-adidas',
  'new-balance-vs-nike',
  'north-face-vs-patagonia',
  'levis-vs-wrangler',
  'ray-ban-vs-oakley',
  'under-armour-vs-nike',
]

export async function GET() {
  try {
    const now = new Date().toISOString().split('T')[0]
    
    // Get brand slugs for dynamic comparisons (with error handling)
    let brands: string[] = []
    try {
      brands = await getBrandSlugs()
    } catch (err) {
      console.error('[sitemap-comparisons] Error fetching brand slugs:', err)
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
    const allComparisons = [...new Set([...POPULAR_COMPARISONS, ...dynamicComparisons])].slice(0, 50000)
    
    // Return empty sitemap if no comparisons (don't 404)
    if (!allComparisons || allComparisons.length === 0) {
      return new Response(EMPTY_SITEMAP, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      })
    }
    
    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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
    console.error('[sitemap-comparisons] Unhandled error:', error)
    return new Response(EMPTY_SITEMAP, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  }
}
