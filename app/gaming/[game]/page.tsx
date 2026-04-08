import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GamePageTemplate } from "@/components/gaming/game-page-template"
import { 
  gamesData,
  getGameBySlug,
  getRelatedGames,
  getAllGameSlugs
} from "@/lib/gaming-data"

// Revalidate every hour for fresh codes
export const revalidate = 3600

// Generate static params for all games
export async function generateStaticParams() {
  return getAllGameSlugs().map(slug => ({ game: slug }))
}

interface PageProps {
  params: Promise<{ game: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { game: gameSlug } = await params
  const game = getGameBySlug(gameSlug)
  
  if (!game) {
    return {
      title: "Game Not Found | SaveSmart Gaming",
      description: "The requested game could not be found."
    }
  }
  
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().toLocaleString('default', { month: 'long' })
  const shortMonth = new Date().toLocaleString('default', { month: 'short' })
  const codeCount = game.promoCodes.length
  
  // Get primary reward type for game-specific benefits
  const primaryReward = game.promoCodes[0]?.rewardType || 'Rewards'
  const rewardBenefits: Record<string, string> = {
    'Primogems': 'Free Primogems',
    'Gems': 'Free Gems',
    'V-Bucks': 'Free V-Bucks',
    'Robux': 'Free Robux',
    'Coins': 'Free Coins',
    'Skins': 'Free Skins',
    'Currency': 'Free Currency',
    'CP': 'Free CP',
    'Items': 'Free Items',
    'Other': 'Free Rewards',
    'Rewards': 'Free Rewards',
  }
  const benefit = rewardBenefits[primaryReward] || 'Free Rewards'
  
  // SEO-optimized title: keyword-first, count, benefit, urgency - under 60 chars
  const title = game.metaTitle || 
    // CTR-optimized title: [GAME] Codes (Month Year) – X Working Codes + Free Rewards
    `${game.shortName || game.name} Codes (${currentMonth} ${currentYear}) – ${codeCount} Working Codes + Free Rewards`
  
  // CTR-optimized description: number of codes, "updated today", "free rewards"
  const description = game.metaDescription || 
    `${codeCount} working ${game.name} codes for ${currentMonth} ${currentYear}. Updated today with verified codes. Redeem for FREE rewards, gems & exclusive items!`
  
  return {
    title,
    description,
    keywords: [
      // Primary keywords (high intent)
      `${game.name} promo codes`,
      `${game.name} codes`,
      `${game.name} redeem codes`,
      `${game.name} codes ${currentYear}`,
      `${game.name} codes ${currentMonth.toLowerCase()} ${currentYear}`,
      `${game.name} codes today`,
      // Secondary keywords
      `${game.name} free rewards`,
      `${game.name} free gems`,
      `${game.name} gift codes`,
      `working ${game.name} codes`,
      // Category keywords
      ...game.categories.map(cat => `${cat.toLowerCase()} game codes`),
    ],
    openGraph: {
      // OG title with "WORKING CODES" + month/year + code count
      title: `${game.name} WORKING CODES (${currentMonth} ${currentYear}) – ${codeCount} Free Rewards`,
      description: `${codeCount} verified working codes. Updated today! FREE rewards, gems & items.`,
      url: `https://savesmart.bio/gaming/${game.slug}`,
      type: "website",
      siteName: "SaveSmart",
      images: [
        {
          url: game.logoUrl 
            ? `https://savesmart.bio${game.logoUrl}` 
            : `https://savesmart.bio/og/gaming/${game.slug}.jpg`,
          width: 256,
          height: 256,
          alt: `${game.name} WORKING CODES ${currentMonth} ${currentYear} - ${codeCount} free rewards`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${game.name} WORKING CODES – ${codeCount} Free Rewards`,
      description: `${codeCount} verified codes. Updated today! FREE rewards & gems.`,
    },
    alternates: {
      canonical: `/gaming/${game.slug}`,
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
}

export default async function GamePage({ params }: PageProps) {
  const { game: gameSlug } = await params
  const game = getGameBySlug(gameSlug)
  
  if (!game) {
    notFound()
  }
  
  const relatedGames = getRelatedGames(game, 6)
  
  // Generate category links
  const categoryLinks = game.categories.map(category => ({
    href: `/gaming?category=${category.toLowerCase()}`,
    label: `${category} Games`
  }))
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <GamePageTemplate 
        game={game}
        relatedGames={relatedGames}
        categoryLinks={categoryLinks}
      />
      
      <Footer />
    </div>
  )
}
