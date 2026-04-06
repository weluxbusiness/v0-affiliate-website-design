import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { GamePageTemplate } from "@/components/gaming/game-page-template"
import { getGameBySlug, getRelatedGames } from "@/lib/gaming-data"

const gameSlug = "monopoly-go"

export async function generateMetadata(): Promise<Metadata> {
  const game = getGameBySlug(gameSlug)
  if (!game) return { title: "Game Not Found" }

  const currentYear = new Date().getFullYear()
  const currentMonth = "April"
  
  return {
    title: `Monopoly GO Codes ${currentMonth} ${currentYear} - Free Dice & Stickers`,
    description: `All working Monopoly GO codes for ${currentMonth} ${currentYear}. Get free dice rolls, stickers, and cash with the latest promo codes. Updated daily.`,
    keywords: [
      `monopoly go codes ${currentMonth.toLowerCase()} ${currentYear}`,
      "monopoly go free dice",
      "monopoly go codes today",
      "monopoly go promo codes",
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
      title: `Monopoly GO Codes ${currentMonth} ${currentYear}`,
      description: `All working Monopoly GO codes for ${currentMonth} ${currentYear}. Free dice & stickers.`,
      type: "website",
    },
  }
}

export default function MonopolyGOCodesApril2026Page() {
  const game = getGameBySlug(gameSlug)
  
  if (!game) {
    redirect("/gaming")
  }

  const relatedGames = getRelatedGames(game, 6)

  return (
    <GamePageTemplate 
      game={game} 
      relatedGames={relatedGames}
      pageSlug="monopoly-go-codes-april-2026"
    />
  )
}
