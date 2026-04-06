import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GuidePageTemplate } from "@/components/gaming/guide-page-template"
import { getGameBySlug } from "@/lib/gaming-data"
import { getGuideContent } from "@/lib/guide-content"
import { notFound } from "next/navigation"

const GAME_SLUG = 'raid-shadow-legends'

export const metadata: Metadata = {
  title: "RAID Shadow Legends Leveling Guide 2026 | SaveSmart",
  description: "Fast leveling guide for RAID Shadow Legends 2026. Learn efficient XP farming, champion ranking, and progression strategies. Updated daily.",
  keywords: ["RAID Shadow Legends leveling", "RAID leveling guide 2026", "RAID fast leveling", "RAID champion leveling"],
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

export default function RAIDLevelingPage() {
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
