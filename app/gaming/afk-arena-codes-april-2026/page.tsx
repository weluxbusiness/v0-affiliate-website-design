import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { GamePageTemplate } from "@/components/gaming/game-page-template"
import { getGameBySlug, getRelatedGames } from "@/lib/gaming-data"

const gameSlug = "afk-arena"

export async function generateMetadata(): Promise<Metadata> {
  const game = getGameBySlug(gameSlug)
  if (!game) return { title: "Game Not Found" }

  const currentYear = new Date().getFullYear()
  const currentMonth = "April"
  
  return {
    title: `AFK Arena Codes ${currentMonth} ${currentYear} - Free Diamonds & Scrolls`,
    description: `All working AFK Arena codes for ${currentMonth} ${currentYear}. Get free diamonds, scrolls, and heroes with the latest promo codes. Updated daily.`,
    keywords: [
      `afk arena codes ${currentMonth.toLowerCase()} ${currentYear}`,
      "afk arena free diamonds",
      "afk arena codes today",
      "afk arena redemption codes",
    ],
    alternates: {
      canonical: `/gaming/${gameSlug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      title: `AFK Arena Codes ${currentMonth} ${currentYear}`,
      description: `All working AFK Arena codes for ${currentMonth} ${currentYear}. Free diamonds & scrolls.`,
      type: "website",
    },
  }
}

export default function AFKArenaCodesApril2026Page() {
  const game = getGameBySlug(gameSlug)
  
  if (!game) {
    redirect("/gaming")
  }

  const relatedGames = getRelatedGames(game, 6)

  return (
    <GamePageTemplate 
      game={game} 
      relatedGames={relatedGames}
      pageSlug="afk-arena-codes-april-2026"
    />
  )
}
