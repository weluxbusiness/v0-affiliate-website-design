import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MonthlyCodesPageTemplate } from "@/components/gaming/monthly-codes-page-template"
import { getGameBySlug, getRelatedGames, getActivePromoCodes } from "@/lib/gaming-data"

const gameSlug = "monopoly-go"
const month = "April"
const year = 2026

export async function generateMetadata(): Promise<Metadata> {
  const game = getGameBySlug(gameSlug)
  if (!game) return { title: "Game Not Found" }

  const activeCodes = getActivePromoCodes(game.promoCodes)
  
  return {
    title: `Monopoly GO Codes (${month} ${year}) – ${activeCodes.length}+ Working Codes + Free Dice`,
    description: `All working Monopoly GO codes for ${month} ${year}. Get free dice rolls, stickers & cash. ${activeCodes.length}+ verified codes. Updated daily.`,
    keywords: [
      `monopoly go codes ${month.toLowerCase()} ${year}`,
      "monopoly go free dice",
      "monopoly go codes today",
      "monopoly go promo codes working",
      "working monopoly go codes",
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
      title: `Monopoly GO Codes (${month} ${year}) – ${activeCodes.length}+ Working Codes`,
      description: `All working Monopoly GO codes for ${month} ${year}. Free dice & stickers. Updated daily.`,
      type: "website",
    },
  }
}

export default function MonopolyGOCodesApril2026Page() {
  const game = getGameBySlug(gameSlug)
  
  if (!game) {
    notFound()
  }

  const relatedGames = getRelatedGames(game, 6)

  return (
    <MonthlyCodesPageTemplate 
      game={game} 
      month={month}
      year={year}
      relatedGames={relatedGames}
    />
  )
}
