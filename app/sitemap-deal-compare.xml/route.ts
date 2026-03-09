// Sitemap for deal comparison pages: /deals/compare/[slug]
// Brand vs Brand deal comparisons

const baseUrl = 'https://savesmart.bio'

export const revalidate = 3600

// Popular brand comparisons
const DEAL_COMPARISONS = [
  // Fashion & Sports
  'nike-vs-adidas',
  'north-face-vs-patagonia',
  'new-balance-vs-nike',
  'puma-vs-adidas',
  'under-armour-vs-nike',
  'levis-vs-gap',
  'converse-vs-vans',
  
  // Electronics
  'apple-vs-samsung',
  'macbook-vs-dell',
  'dell-vs-hp',
  'lenovo-vs-dell',
  'lg-vs-samsung',
  'sony-vs-lg',
  'asus-vs-acer',
  
  // Audio
  'sony-vs-bose',
  'beats-vs-airpods',
  'jbl-vs-bose',
  'sennheiser-vs-sony',
  'jabra-vs-bose',
  
  // Home & Appliances
  'dyson-vs-shark',
  'roomba-vs-dyson',
  'kitchenaid-vs-cuisinart',
  'ninja-vs-vitamix',
  'instant-pot-vs-ninja',
  
  // Gaming
  'playstation-vs-xbox',
  'nintendo-vs-playstation',
  'razer-vs-logitech',
  'corsair-vs-razer',
  
  // Retailers
  'amazon-vs-walmart',
  'target-vs-walmart',
  'best-buy-vs-amazon',
  'costco-vs-walmart',
  'home-depot-vs-lowes',
]

export async function GET() {
  const now = new Date().toISOString().split('T')[0]
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/deals/compare</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
${DEAL_COMPARISONS.map(slug => `  <url>
    <loc>${baseUrl}/deals/compare/${slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
