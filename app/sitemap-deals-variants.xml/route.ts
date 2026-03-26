const BASE_URL = "https://savesmart.bio"

export const dynamic = "force-dynamic"
export const revalidate = 86400 // 24 hours

// Cheap deal categories
const CHEAP_CATEGORIES = [
  'headphones', 'earbuds', 'laptops', 'tablets', 'sneakers', 'jeans',
  'jackets', 't-shirts', 'backpacks', 'watches', 'speakers', 'keyboards',
  'mice', 'phone-cases', 'chargers'
]

// Top deal categories
const TOP_CATEGORIES = [
  'headphones', 'laptops', 'tvs', 'smartphones', 'sneakers', 'gaming',
  'tablets', 'watches', 'cameras', 'monitors', 'vacuums', 'air-fryers'
]

// Price-based categories with all price points
const PRICE_CATEGORIES = [
  'laptops', 'headphones', 'sneakers', 'electronics', 'fashion', 'gaming',
  'tvs', 'smartphones', 'tablets', 'watches', 'earbuds', 'monitors',
  'air-fryers', 'vacuums', 'coffee-makers', 'furniture', 'mattresses',
  'jackets', 'jeans', 'running-shoes', 'backpacks', 'cameras'
]

const PRICE_POINTS = [25, 50, 100, 200, 300, 500, 1000]

export async function GET(): Promise<Response> {
  const now = new Date().toISOString()

  // Cheap deal pages
  const cheapPages = CHEAP_CATEGORIES.map(category => ({
    url: `/deals/cheap/${category}`,
    priority: "0.7",
    changefreq: "daily",
  }))

  // Top deal pages
  const topPages = TOP_CATEGORIES.map(category => ({
    url: `/deals/top/${category}`,
    priority: "0.8",
    changefreq: "hourly",
  }))

  // Price-based pages
  const pricePages = PRICE_CATEGORIES.flatMap(category =>
    PRICE_POINTS.map(price => ({
      url: `/deals/price/${category}-under-${price}`,
      priority: "0.6",
      changefreq: "daily",
    }))
  )

  const allPages = [...cheapPages, ...topPages, ...pricePages]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
