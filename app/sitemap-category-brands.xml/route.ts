import { getCategoryBrandCombinations, getDealsByCategoryAndBrandPaginated } from '@/lib/deals'

const baseUrl = 'https://savesmart.bio'

export const revalidate = 3600

export async function GET() {
  const now = new Date().toISOString().split('T')[0]
  
  // Get all category × brand combinations where deals exist
  const combinations = await getCategoryBrandCombinations()
  
  const urls: string[] = []
  
  // Generate URLs for each combination (with pagination if needed)
  for (const { category, brand } of combinations.slice(0, 1000)) {
    // Add base page
    urls.push(`  <url>
    <loc>${baseUrl}/deals/${category}/${brand}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`)
    
    // Check if pagination pages exist
    const { totalPages } = await getDealsByCategoryAndBrandPaginated(category, brand, 1)
    
    // Add pagination pages (2+) if they exist
    if (totalPages > 1) {
      for (let page = 2; page <= Math.min(totalPages, 10); page++) {
        urls.push(`  <url>
    <loc>${baseUrl}/deals/${category}/${brand}/page/${page}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.5</priority>
  </url>`)
      }
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
