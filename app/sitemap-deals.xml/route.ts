import { createAnonClient } from '@/lib/supabase/anon'

const baseUrl = 'https://savesmart.bio'

// Fallback URL to ensure sitemap is never empty
const homepageUrl = `  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`

export async function GET() {
  const supabase = createAnonClient()
  
  let dealUrls: string[] = []
  
  try {
    const { data: deals, error } = await supabase
      .from('deals')
      .select('slug, updated_at')
      .eq('is_active', true)
      .not('slug', 'is', null)
      .order('updated_at', { ascending: false })
      .limit(50000)

    if (!error && deals && deals.length > 0) {
      dealUrls = deals
        .filter(deal => deal.slug)
        .map(deal => {
          const lastmod = deal.updated_at 
            ? new Date(deal.updated_at).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0]
          return `  <url>
    <loc>${baseUrl}/deal/${deal.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
        })
    }
  } catch (err) {
    console.error('Sitemap deals error:', err)
  }

  // If no deals found, include homepage to ensure valid non-empty sitemap
  const urlsContent = dealUrls.length > 0 ? dealUrls.join('\n') : homepageUrl

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsContent}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
