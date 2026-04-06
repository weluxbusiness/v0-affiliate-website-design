import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { GamePageTemplate } from "@/components/gaming/game-page-template"
import { getGameBySlug, getRelatedGames } from "@/lib/gaming-data"

const gameSlug = "roblox"

export async function generateMetadata(): Promise<Metadata> {
  const game = getGameBySlug(gameSlug)
  if (!game) return { title: "Game Not Found" }

  const currentYear = new Date().getFullYear()
  const currentMonth = "April"
  
  return {
    title: `Roblox Codes ${currentMonth} ${currentYear} - Free Robux & Items`,
    description: `All working Roblox promo codes for ${currentMonth} ${currentYear}. Get free items, accessories, and rewards with the latest codes. Updated daily.`,
    keywords: [
      `roblox codes ${currentMonth.toLowerCase()} ${currentYear}`,
      "roblox promo codes",
      "roblox free items",
      "roblox codes today",
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
      title: `Roblox Codes ${currentMonth} ${currentYear}`,
      description: `All working Roblox promo codes for ${currentMonth} ${currentYear}. Free items & rewards.`,
      type: "website",
    },
  }
}

export default function RobloxCodesApril2026Page() {
  const game = getGameBySlug(gameSlug)
  
  if (!game) {
    redirect("/gaming")
  }

  const relatedGames = getRelatedGames(game, 6)

  return (
    <GamePageTemplate 
      game={game} 
      relatedGames={relatedGames}
      pageSlug="roblox-codes-april-2026"
    />
  )
}
