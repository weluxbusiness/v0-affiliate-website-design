import { getAllGeneratedBlogSlugs } from "@/lib/seo/blog-generator"

export const revalidate = 86400 // Revalidate daily

export async function GET() {
  const baseUrl = "https://savesmart.bio"
  const slugs = getAllGeneratedBlogSlugs()
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${slugs.map(slug => `
  <url>
    <loc>${baseUrl}/blog/deals/${slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
