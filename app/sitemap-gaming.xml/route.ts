import { gamesData, getGameSlugsForSitemap } from "@/lib/gaming-data"
import { getAllGames } from "@/lib/gaming-server"

const BASE_URL = "https://savesmart.bio"

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
    
    const now = new Date().toISOString()

    // Static gaming pages
    const staticPages = [
      { url: "/gaming", priority: "0.9", changefreq: "daily" },
      { url: "/gaming/promo-codes", priority: "0.8", changefreq: "daily" },
      { url: "/gaming/free-rewards", priority: "0.8", changefreq: "daily" },
      { url: "/gaming/new-player-deals", priority: "0.8", changefreq: "daily" },
      { url: "/gaming/today", priority: "0.9", changefreq: "hourly" },
    ]

    // Dynamic game pages - /gaming/[game], /gaming/[game]/codes, /gaming/[game]/rewards
    const gamePages = gameSlugs.flatMap(({ slug, lastUpdated }) => [
      {
        url: `/gaming/${slug}`,
        lastmod: lastUpdated,
        priority: "0.7",
        changefreq: "daily",
      },
      {
        url: `/gaming/${slug}/codes`,
        lastmod: lastUpdated,
        priority: "0.7",
        changefreq: "daily",
      },
      {
        url: `/gaming/${slug}/rewards`,
        lastmod: lastUpdated,
        priority: "0.6",
        changefreq: "weekly",
      },
    ])

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${now}</lastmod>
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
