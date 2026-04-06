import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { MonthlyCodesPageTemplate } from "@/components/gaming/monthly-codes-page-template"
import { getGameBySlug, getRelatedGames, getActivePromoCodes } from "@/lib/gaming-data"

const gameSlug = "raid-shadow-legends"
const month = "April"
const year = 2026

export async function generateMetadata(): Promise<Metadata> {
  const game = getGameBySlug(gameSlug)
  if (!game) return { title: "Game Not Found" }

  const activeCodes = getActivePromoCodes(game.promoCodes)
  
  return {
    title: `RAID Shadow Legends Codes (${month} ${year}) – ${activeCodes.length}+ Working Codes + Free Rewards`,
    description: `All working RAID Shadow Legends codes for ${month} ${year}. Get free champions, silver & energy. ${activeCodes.length}+ verified codes. Updated daily.`,
    keywords: [
      `raid shadow legends codes ${month.toLowerCase()} ${year}`,
      "raid codes today",
      "raid promo codes working",
      "raid shadow legends free rewards",
      "raid codes ${year}",
      "working raid codes",
      "raid shadow legends redeem codes",
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
      title: `RAID Shadow Legends Codes (${month} ${year}) – ${activeCodes.length}+ Working Codes`,
      description: `All working RAID codes for ${month} ${year}. Free champions, silver & energy. Updated daily.`,
      type: "website",
    },
  }
}

export default function RAIDCodesApril2026Page() {
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
