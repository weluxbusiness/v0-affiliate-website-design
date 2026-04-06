import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { GamePageTemplate } from "@/components/gaming/game-page-template"
import { getGameBySlug, getRelatedGames } from "@/lib/gaming-data"

const gameSlug = "raid-shadow-legends"

export async function generateMetadata(): Promise<Metadata> {
  const game = getGameBySlug(gameSlug)
  if (!game) return { title: "Game Not Found" }

  const currentYear = new Date().getFullYear()
  const currentMonth = "April"
  
  return {
    title: `RAID Shadow Legends Codes ${currentMonth} ${currentYear} - All Working Codes`,
    description: `All working RAID Shadow Legends codes for ${currentMonth} ${currentYear}. Get free champions, silver, and energy with the latest promo codes. Updated daily.`,
    keywords: [
      `raid shadow legends codes ${currentMonth.toLowerCase()} ${currentYear}`,
      "raid codes today",
      "raid promo codes",
      "raid shadow legends free rewards",
      "raid codes working",
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
      title: `RAID Shadow Legends Codes ${currentMonth} ${currentYear}`,
      description: `All working RAID codes for ${currentMonth} ${currentYear}. Free champions, silver & energy.`,
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
    <GamePageTemplate 
      game={game} 
      relatedGames={relatedGames}
      pageSlug="raid-shadow-legends-codes-april-2026"
    />
  )
}
