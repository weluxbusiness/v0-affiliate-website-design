import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GuidePageTemplate } from "@/components/gaming/guide-page-template"
import { getGameBySlug } from "@/lib/gaming-data"
import { getGuideContent } from "@/lib/guide-content"
import { notFound } from "next/navigation"

const GAME_SLUG = 'brawl-stars'

export const metadata: Metadata = {
  title: "Brawl Stars Leveling Guide 2026 | SaveSmart",
  description: "Fast progression guide for Brawl Stars 2026. Unlock brawlers, power up efficiently, and climb trophies faster. Updated daily.",
  keywords: ["Brawl Stars leveling", "Brawl Stars progression 2026", "Brawl Stars trophy pushing", "Brawl Stars fast leveling"],
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

export default function BrawlStarsLevelingPage() {
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
