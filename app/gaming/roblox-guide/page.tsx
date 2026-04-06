import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GuidePageTemplate } from "@/components/gaming/guide-page-template"
import { getGameBySlug } from "@/lib/gaming-data"
import { getGuideContent } from "@/lib/guide-content"
import { notFound } from "next/navigation"

const GAME_SLUG = 'roblox'

export const metadata: Metadata = {
  title: "Roblox Beginner Guide 2026 | SaveSmart",
  description: "Complete Roblox beginner guide for 2026. Learn platform basics, popular games, safety settings, and avatar customization. Updated daily.",
  keywords: ["Roblox guide", "Roblox guide 2026", "Roblox beginner", "Roblox tips"],
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

export default function RobloxGuidePage() {
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
