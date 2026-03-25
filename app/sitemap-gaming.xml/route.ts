import { gamesData, getGameSlugsForSitemap } from "@/lib/gaming-data"

const BASE_URL = "https://savesmart.bio"

export async function GET(): Promise<Response> {
  const gameSlugs = getGameSlugsForSitemap()
  const now = new Date().toISOString()

  // Static gaming pages
  const staticPages = [
    { url: "/gaming", priority: "0.9", changefreq: "daily" },
    { url: "/gaming/promo-codes", priority: "0.8", changefreq: "daily" },
    { url: "/gaming/free-rewards", priority: "0.8", changefreq: "daily" },
    { url: "/gaming/new-player-deals", priority: "0.8", changefreq: "daily" },
    { url: "/gaming/today", priority: "0.9", changefreq: "hourly" },
  ]

  // Dynamic game pages
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
}
