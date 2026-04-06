import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { GamePageTemplate } from "@/components/gaming/game-page-template"
import { getGameBySlug, gamesData, getRelatedGames } from "@/lib/gaming-data"

const gameSlug = "brawl-stars"

export async function generateMetadata(): Promise<Metadata> {
  const game = getGameBySlug(gameSlug)
  if (!game) return { title: "Game Not Found" }

  const currentYear = new Date().getFullYear()
  const currentMonth = "April"
  
  return {
    title: `Brawl Stars Codes ${currentMonth} ${currentYear} - Free Gems & Coins`,
    description: `All working Brawl Stars codes for ${currentMonth} ${currentYear}. Get free gems, coins, and brawler skins with the latest promo codes. Updated daily.`,
    keywords: [
      `brawl stars codes ${currentMonth.toLowerCase()} ${currentYear}`,
      "brawl stars free gems",
      "brawl stars codes today",
      "brawl stars promo codes",
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
      title: `Brawl Stars Codes ${currentMonth} ${currentYear}`,
      description: `All working Brawl Stars codes for ${currentMonth} ${currentYear}. Free gems & coins.`,
      type: "website",
    },
  }
}

export default function BrawlStarsCodesApril2026Page() {
  const game = getGameBySlug(gameSlug)
  
  if (!game) {
    redirect("/gaming")
  }

  const relatedGames = getRelatedGames(game, gamesData)

  return (
    <GamePageTemplate 
      game={game} 
      relatedGames={relatedGames}
      pageSlug="brawl-stars-codes-april-2026"
    />
  )
}
