import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GuidePageTemplate } from "@/components/gaming/guide-page-template"
import { getGameBySlug } from "@/lib/gaming-data"
import { getGuideContent } from "@/lib/guide-content"
import { notFound } from "next/navigation"

const GAME_SLUG = 'afk-arena'

export const metadata: Metadata = {
  title: "AFK Arena Pro Tips 2026 | SaveSmart",
  description: "Advanced AFK Arena tips and strategies for 2026. Optimize hero investment, master game modes, and progress efficiently. Updated daily.",
  keywords: ["AFK Arena tips", "AFK Arena tips 2026", "AFK Arena strategies", "AFK Arena pro tips"],
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

export default function AFKArenaTipsPage() {
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
