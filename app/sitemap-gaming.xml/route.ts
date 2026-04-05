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
    
    // Use the most recent game update for freshness signal
    const currentDate = new Date()
    const mostRecentGameUpdate = gameSlugs.length > 0 
      ? gameSlugs.reduce((latest, game) => 
          new Date(game.lastUpdated) > new Date(latest) ? game.lastUpdated : latest, 
          gameSlugs[0].lastUpdated
        )
      : currentDate.toISOString()
    const lastModified = mostRecentGameUpdate

    // Static gaming pages - SEO priority pages (boosted for better indexing)
    const staticPages = [
      { url: "/gaming", priority: "0.95", changefreq: "daily" },
      { url: "/gaming/promo-codes", priority: "0.9", changefreq: "daily" },
      { url: "/gaming/free-rewards", priority: "0.9", changefreq: "daily" },
      { url: "/gaming/new-player-deals", priority: "0.9", changefreq: "daily" },
      { url: "/gaming/today", priority: "0.95", changefreq: "hourly" },
      // SEO entry pages for high-intent keywords
      { url: "/gaming/best-codes", priority: "0.9", changefreq: "daily" },
      { url: "/gaming/all-codes", priority: "0.85", changefreq: "daily" },
      { url: "/gaming/top-games", priority: "0.85", changefreq: "daily" },
    ]

    // Get current month info for monthly code pages
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
    const currentMonth = months[currentDate.getMonth()]
    const currentYear = currentDate.getFullYear()
    const nextMonth = months[(currentDate.getMonth() + 1) % 12]
    const nextMonthYear = currentDate.getMonth() === 11 ? currentYear + 1 : currentYear

    // Dynamic game pages - boosted priorities for better indexing
    // Individual game pages are key landing pages for "[game] promo codes" searches
    const gamePages = gameSlugs.flatMap(({ slug, lastUpdated }) => [
      // Main game overview page (nested URL - stays nested)
      {
        url: `/gaming/${slug}`,
        lastmod: lastUpdated,
        priority: "0.85",
        changefreq: "daily",
      },
      {
        url: `/gaming/${slug}/codes`,
        lastmod: lastUpdated,
        priority: "0.8",
        changefreq: "daily",
      },
      {
        url: `/gaming/${slug}/rewards`,
        lastmod: lastUpdated,
        priority: "0.75",
        changefreq: "weekly",
      },
      // === FLAT SEO URLs (primary, canonical) ===
      // These are the canonical URLs that match search intent
      // Example: /raid-shadow-legends-working-codes
      
      // Codes today - targets "[game] codes today" searches
      {
        url: `/${slug}-codes-today`,
        lastmod: lastModified,
        priority: "0.95", // Highest priority - matches exact search queries
        changefreq: "hourly",
      },
      // Working codes - targets "[game] working codes" searches
      {
        url: `/${slug}-working-codes`,
        lastmod: lastModified,
        priority: "0.95",
        changefreq: "hourly",
      },
      // New codes - targets "[game] new codes" searches
      {
        url: `/${slug}-new-codes`,
        lastmod: lastModified,
        priority: "0.95",
        changefreq: "hourly",
      },
      // Free rewards - targets "[game] free rewards" searches
      {
        url: `/${slug}-free-rewards`,
        lastmod: lastModified,
        priority: "0.9",
        changefreq: "daily",
      },
      // Redeem codes guide - targets "how to redeem [game] codes" searches
      {
        url: `/${slug}-redeem-codes`,
        lastmod: lastUpdated,
        priority: "0.9",
        changefreq: "weekly",
      },
      // Monthly codes pages - target "[game] codes [month] [year]" searches
      {
        url: `/gaming/${slug}/codes-${currentMonth}-${currentYear}`,
        lastmod: lastModified,
        priority: "0.8",
        changefreq: "daily",
      },
      {
        url: `/gaming/${slug}/codes-${nextMonth}-${nextMonthYear}`,
        lastmod: lastModified,
        priority: "0.7",
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
