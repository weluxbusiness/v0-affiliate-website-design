const baseUrl = 'https://savesmart.bio'

// Categories and price points for programmatic SEO pages
const categories = ['laptops', 'headphones', 'sneakers', 'electronics', 'fashion', 'gaming', 'home', 'fitness']
const prices = [100, 200, 300, 500, 1000]
const stores = ['amazon', 'best-buy', 'target', 'walmart', 'nike', 'apple', 'costco']

export async function GET() {
  const now = new Date().toISOString().split('T')[0]

  // Generate category-under-price pages: /deals/price/laptops-under-500
  const categoryPricePages = categories.flatMap(category =>
    prices.map(price => ({
      path: `/deals/price/${category}-under-${price}`,
      priority: 0.7,
    }))
  )

  // Generate store-category-under-price pages: /stores/amazon/price/laptops-under-500
  const storeCategoryPricePages = stores.flatMap(store =>
    categories.flatMap(category =>
      prices.map(price => ({
        path: `/stores/${store}/price/${category}-under-${price}`,
        priority: 0.6,
      }))
    )
  )

  const allPages = [...categoryPricePages, ...storeCategoryPricePages]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
