import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GuidePageTemplate } from "@/components/gaming/guide-page-template"
import { getGameBySlug } from "@/lib/gaming-data"
import { getGuideContent } from "@/lib/guide-content"
import { notFound } from "next/navigation"

const GAME_SLUG = 'monopoly-go'

export const metadata: Metadata = {
  title: "Monopoly GO Beginner Guide 2026 | SaveSmart",
  description: "Complete Monopoly GO beginner guide for 2026. Learn dice management, sticker trading, and event strategies. Updated daily.",
  keywords: ["Monopoly GO guide", "Monopoly GO guide 2026", "Monopoly GO beginner", "Monopoly GO tips"],
  alternates: {
    canonical: `/gaming/${GAME_SLUG}-guide`,
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

export default function MonopolyGOGuidePage() {
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
        guideType="guide"
        title={guideContent.guide.title}
        description={guideContent.guide.description}
        heroSubtitle={guideContent.guide.heroSubtitle}
        sections={guideContent.guide.sections}
      />
      <Footer />
    </>
  )
}
