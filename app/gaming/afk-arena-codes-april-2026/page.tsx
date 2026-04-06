import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { MonthlyCodesPageTemplate } from "@/components/gaming/monthly-codes-page-template"
import { getGameBySlug, getRelatedGames, getActivePromoCodes } from "@/lib/gaming-data"

const gameSlug = "afk-arena"
const month = "April"
const year = 2026

export async function generateMetadata(): Promise<Metadata> {
  const game = getGameBySlug(gameSlug)
  if (!game) return { title: "Game Not Found" }

  const activeCodes = getActivePromoCodes(game.promoCodes)
  
  return {
    title: `AFK Arena Codes (${month} ${year}) – ${activeCodes.length}+ Working Codes + Free Diamonds`,
    description: `All working AFK Arena codes for ${month} ${year}. Get free diamonds, scrolls & heroes. ${activeCodes.length}+ verified codes. Updated daily.`,
    keywords: [
      `afk arena codes ${month.toLowerCase()} ${year}`,
      "afk arena free diamonds",
      "afk arena codes today",
      "afk arena redemption codes working",
      "working afk arena codes",
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
      title: `AFK Arena Codes (${month} ${year}) – ${activeCodes.length}+ Working Codes`,
      description: `All working AFK Arena codes for ${month} ${year}. Free diamonds & scrolls. Updated daily.`,
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
    <MonthlyCodesPageTemplate 
      game={game} 
      month={month}
      year={year}
      relatedGames={relatedGames}
    />
  )
}
