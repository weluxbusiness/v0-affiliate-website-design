import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GuidePageTemplate } from "@/components/gaming/guide-page-template"
import { getGameBySlug } from "@/lib/gaming-data"
import { getGuideContent } from "@/lib/guide-content"
import { notFound } from "next/navigation"

const GAME_SLUG = 'roblox'

export const metadata: Metadata = {
  title: "Roblox Leveling Guide 2026 | SaveSmart",
  description: "Fast progression guide for popular Roblox games 2026. Learn efficient grinding in Blox Fruits, Pet Simulator X, and more. Updated daily.",
  keywords: ["Roblox leveling", "Roblox progression 2026", "Blox Fruits leveling", "Pet Simulator X tips"],
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

export default function RobloxLevelingPage() {
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
