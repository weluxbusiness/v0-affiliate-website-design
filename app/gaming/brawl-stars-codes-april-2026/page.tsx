import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { MonthlyCodesPageTemplate } from "@/components/gaming/monthly-codes-page-template"
import { getGameBySlug, getRelatedGames, getActivePromoCodes } from "@/lib/gaming-data"

const gameSlug = "brawl-stars"
const month = "April"
const year = 2026

export async function generateMetadata(): Promise<Metadata> {
  const game = getGameBySlug(gameSlug)
  if (!game) return { title: "Game Not Found" }

  const activeCodes = getActivePromoCodes(game.promoCodes)
  
  return {
    title: `Brawl Stars Codes (${month} ${year}) – ${activeCodes.length}+ Working Codes + Free Gems`,
    description: `All working Brawl Stars codes for ${month} ${year}. Get free gems, coins & brawler skins. ${activeCodes.length}+ verified codes. Updated daily.`,
    keywords: [
      `brawl stars codes ${month.toLowerCase()} ${year}`,
      "brawl stars free gems",
      "brawl stars codes today",
      "brawl stars promo codes working",
      "working brawl stars codes",
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
      title: `Brawl Stars Codes (${month} ${year}) – ${activeCodes.length}+ Working Codes`,
      description: `All working Brawl Stars codes for ${month} ${year}. Free gems & coins. Updated daily.`,
      type: "website",
    },
  }
}

export default function BrawlStarsCodesApril2026Page() {
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
