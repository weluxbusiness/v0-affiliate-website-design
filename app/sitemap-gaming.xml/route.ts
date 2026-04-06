import { getGameSlugsForSitemap } from "@/lib/gaming-data"
import { getAllGames } from "@/lib/gaming-server"

const BASE_URL = "https://savesmart.bio"

// REDUCED SITEMAP - Only high-value pages for better indexing
// Max ~30 URLs to avoid index bloat and soft 404 issues
export const dynamic = "force-dynamic"
export const revalidate = 3600 // 1 hour

export async function GET(): Promise<Response> {
  try {
    // Try to get games from database first, fall back to static data
    let gameSlugs: { slug: string; lastUpdated: string }[] = []
    
    try {
      const dbGames = await getAllGames()
      if (dbGames && dbGames.length > 0) {
        gameSlugs = dbGames.map(game => ({
          slug: game.slug,
          lastUpdated: game.lastUpdated || new Date().toISOString(),
        }))
      }
    } catch (dbError) {
      console.error("Failed to fetch games from DB for sitemap:", dbError)
    }
    
    // Fallback to static data if DB is empty or fails
    if (gameSlugs.length === 0) {
      gameSlugs = getGameSlugsForSitemap()
    }
    
    // LIMIT to top 10 games by most recent update to keep sitemap lean
    const topGames = gameSlugs
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, 10)
    
    const currentDate = new Date()
    const lastModified = currentDate.toISOString()

    // MINIMAL static pages - only essential entry points
    const staticPages = [
      { url: "/gaming", priority: "0.9", changefreq: "daily" },
    ]

    // HIGH-VALUE game pages ONLY
    // Only 2 page types per game: codes + redeem-codes
    // Total: 10 games x 2 pages = 20 game pages + 1 static = 21 URLs max
    const gamePages = topGames.flatMap(({ slug, lastUpdated }) => [
      // Main codes page - targets "[game] codes" searches
      // This is the PRIMARY landing page for each game
      {
        url: `/${slug}-codes`,
        lastmod: lastModified,
        priority: "0.95",
        changefreq: "daily",
      },
      // Redeem codes guide - targets "how to redeem [game] codes" searches
      // Informational content with high search intent
      {
        url: `/${slug}-redeem-codes`,
        lastmod: lastUpdated,
        priority: "0.85",
        changefreq: "weekly",
      },
    ])

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
${gamePages
  .map(
    (page) => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch (error) {
    console.error("Error generating gaming sitemap:", error)
    
    // Return a minimal valid sitemap on error
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/gaming</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`
    
    return new Response(fallbackXml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=300",
      },
    })
  }
}
