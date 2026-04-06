import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GuidePageTemplate } from "@/components/gaming/guide-page-template"
import { getGameBySlug } from "@/lib/gaming-data"
import { getGuideContent } from "@/lib/guide-content"
import { notFound } from "next/navigation"

const GAME_SLUG = 'brawl-stars'

export const metadata: Metadata = {
  title: "Brawl Stars Pro Tips 2026 | SaveSmart",
  description: "Advanced Brawl Stars tips and strategies for 2026. Master map control, team composition, and competitive play. Updated daily.",
  keywords: ["Brawl Stars tips", "Brawl Stars tips 2026", "Brawl Stars strategies", "Brawl Stars pro tips"],
  alternates: {
    canonical: `/gaming/${GAME_SLUG}-tips`,
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

export default function BrawlStarsTipsPage() {
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
        guideType="tips"
        title={guideContent.tips.title}
        description={guideContent.tips.description}
        heroSubtitle={guideContent.tips.heroSubtitle}
        sections={guideContent.tips.sections}
      />
      <Footer />
    </>
  )
}
