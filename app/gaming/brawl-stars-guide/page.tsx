import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GuidePageTemplate } from "@/components/gaming/guide-page-template"
import { getGameBySlug } from "@/lib/gaming-data"
import { getGuideContent } from "@/lib/guide-content"
import { notFound } from "next/navigation"

const GAME_SLUG = 'brawl-stars'

export const metadata: Metadata = {
  title: "Brawl Stars Beginner Guide 2026 | SaveSmart",
  description: "Complete Brawl Stars beginner guide for 2026. Learn brawler basics, game modes, and trophy climbing strategies. Updated daily.",
  keywords: ["Brawl Stars guide", "Brawl Stars guide 2026", "Brawl Stars beginner", "Brawl Stars tips"],
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

export default function BrawlStarsGuidePage() {
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
