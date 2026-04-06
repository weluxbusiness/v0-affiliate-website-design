import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { MonthlyCodesPageTemplate } from "@/components/gaming/monthly-codes-page-template"
import { getGameBySlug, getRelatedGames, getActivePromoCodes } from "@/lib/gaming-data"

const gameSlug = "roblox"
const month = "April"
const year = 2026

export async function generateMetadata(): Promise<Metadata> {
  const game = getGameBySlug(gameSlug)
  if (!game) return { title: "Game Not Found" }

  const activeCodes = getActivePromoCodes(game.promoCodes)
  
  return {
    title: `Roblox Codes (${month} ${year}) – ${activeCodes.length}+ Working Codes + Free Items`,
    description: `All working Roblox promo codes for ${month} ${year}. Get free items, accessories & rewards. ${activeCodes.length}+ verified codes. Updated daily.`,
    keywords: [
      `roblox codes ${month.toLowerCase()} ${year}`,
      "roblox promo codes working",
      "roblox free items",
      "roblox codes today",
      "working roblox codes",
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
      title: `Roblox Codes (${month} ${year}) – ${activeCodes.length}+ Working Codes`,
      description: `All working Roblox promo codes for ${month} ${year}. Free items & rewards. Updated daily.`,
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
    <MonthlyCodesPageTemplate 
      game={game} 
      month={month}
      year={year}
      relatedGames={relatedGames}
    />
  )
}
