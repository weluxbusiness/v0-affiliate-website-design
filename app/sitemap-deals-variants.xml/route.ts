const BASE_URL = "https://savesmart.bio"

export const dynamic = "force-dynamic"
export const revalidate = 86400 // 24 hours

// Cheap deal categories - expanded for SEO
const CHEAP_CATEGORIES = [
  // Electronics
  'headphones', 'earbuds', 'wireless-earbuds', 'laptops', 'chromebooks',
  'tablets', 'fire-tablets', 'monitors', 'tvs', 'speakers', 'bluetooth-speakers',
  'keyboards', 'mice', 'webcams', 'phone-cases', 'chargers', 'power-banks',
  'smartwatches', 'fitness-trackers',
  // Fashion
  'sneakers', 'running-shoes', 'jeans', 'jackets', 't-shirts', 'hoodies',
  'shorts', 'backpacks', 'watches', 'sunglasses',
  // Home & Kitchen
  'air-fryers', 'coffee-makers', 'blenders', 'vacuums', 'pillows', 'bedding',
  // Gaming
  'gaming-headsets', 'controllers', 'gaming-mice'
]

// Top deal categories - expanded for SEO
const TOP_CATEGORIES = [
  'headphones', 'laptops', 'tvs', 'smartphones', 'sneakers', 'gaming',
  'tablets', 'watches', 'cameras', 'monitors', 'vacuums', 'air-fryers',
  'earbuds', 'speakers', 'keyboards', 'mattresses', 'coffee-makers',
  'fitness', 'home-office', 'outdoor', 'beauty', 'toys'
]

// Price-based categories with all price points - expanded for SEO
const PRICE_CATEGORIES = [
  // Electronics
  'laptops', 'gaming-laptops', 'chromebooks', 'macbooks',
  'headphones', 'wireless-headphones', 'gaming-headsets', 'earbuds', 'wireless-earbuds',
  'tvs', '4k-tvs', 'smart-tvs', 'oled-tvs',
  'smartphones', 'iphones', 'android-phones', 'samsung-phones',
  'tablets', 'ipads', 'android-tablets',
  'monitors', 'gaming-monitors', '4k-monitors', 'ultrawide-monitors',
  'cameras', 'dslr-cameras', 'mirrorless-cameras', 'action-cameras',
  'smartwatches', 'fitness-trackers', 'apple-watches',
  'speakers', 'bluetooth-speakers', 'soundbars', 'home-theater',
  'keyboards', 'mechanical-keyboards', 'gaming-keyboards',
  'mice', 'gaming-mice', 'wireless-mice',
  'webcams', 'microphones', 'streaming-gear',
  // Gaming
  'gaming', 'gaming-chairs', 'gaming-desks', 'gaming-pcs', 'graphics-cards',
  'ps5-games', 'xbox-games', 'nintendo-switch-games', 'pc-games',
  'controllers', 'gaming-accessories',
  // Fashion
  'fashion', 'sneakers', 'running-shoes', 'basketball-shoes', 'casual-shoes',
  'jackets', 'winter-jackets', 'rain-jackets', 'puffer-jackets',
  'jeans', 'pants', 'shorts', 'activewear',
  'backpacks', 'luggage', 'bags', 'wallets',
  'sunglasses', 'watches', 'jewelry',
  // Home & Kitchen
  'home', 'furniture', 'mattresses', 'bedding', 'pillows',
  'air-fryers', 'instant-pots', 'blenders', 'coffee-makers', 'espresso-machines',
  'vacuums', 'robot-vacuums', 'air-purifiers', 'humidifiers',
  'cookware', 'kitchen-appliances', 'small-appliances',
  // Sports & Outdoors
  'sports', 'fitness', 'workout-equipment', 'yoga-mats', 'dumbbells',
  'bikes', 'e-bikes', 'scooters',
  'camping', 'hiking', 'outdoor-gear',
  // Office
  'office', 'desks', 'office-chairs', 'standing-desks', 'printers'
]

const PRICE_POINTS = [25, 50, 75, 100, 150, 200, 300, 400, 500, 750, 1000, 1500, 2000]

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
