import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GuidePageTemplate } from "@/components/gaming/guide-page-template"
import { getGameBySlug } from "@/lib/gaming-data"
import { getGuideContent } from "@/lib/guide-content"
import { notFound } from "next/navigation"

const GAME_SLUG = 'afk-arena'

export const metadata: Metadata = {
  title: "AFK Arena Leveling Guide 2026 | SaveSmart",
  description: "Fast progression guide for AFK Arena 2026. Learn efficient leveling, campaign pushing, and resource optimization. Updated daily.",
  keywords: ["AFK Arena leveling", "AFK Arena progression 2026", "AFK Arena fast leveling", "AFK Arena campaign guide"],
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

export default function AFKArenaLevelingPage() {
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
