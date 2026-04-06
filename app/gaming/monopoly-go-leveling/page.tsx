import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GuidePageTemplate } from "@/components/gaming/guide-page-template"
import { getGameBySlug } from "@/lib/gaming-data"
import { getGuideContent } from "@/lib/guide-content"
import { notFound } from "next/navigation"

const GAME_SLUG = 'monopoly-go'

export const metadata: Metadata = {
  title: "Monopoly GO Leveling Guide 2026 | SaveSmart",
  description: "Fast progression guide for Monopoly GO 2026. Learn efficient board advancement, net worth building, and album completion. Updated daily.",
  keywords: ["Monopoly GO leveling", "Monopoly GO progression 2026", "Monopoly GO fast leveling", "Monopoly GO board guide"],
  alternates: {
    canonical: `/gaming/${GAME_SLUG}-leveling`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function MonopolyGOLevelingPage() {
  const game = getGameBySlug(GAME_SLUG)
  const guideContent = getGuideContent(GAME_SLUG)
  
  if (!game || !guideContent) {
    notFound()
  }

  return (
    <>
      <Header />
      <GuidePageTemplate
        game={game}
        guideType="leveling"
        title={guideContent.leveling.title}
        description={guideContent.leveling.description}
        heroSubtitle={guideContent.leveling.heroSubtitle}
        sections={guideContent.leveling.sections}
      />
      <Footer />
    </>
  )
}
