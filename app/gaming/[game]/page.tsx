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
  const codeCount = game.promoCodes.length
  
  // SEO-optimized title targeting "[game] promo codes" and "[game] codes" searches
  const title = game.metaTitle || 
    `${game.name} Promo Codes ${currentMonth} ${currentYear} - ${codeCount}+ Working Codes`
  
  // Description targeting featured snippets with specific value propositions
  const description = game.metaDescription || 
    `Get ${codeCount}+ working ${game.name} promo codes for ${currentMonth} ${currentYear}. Free gems, rewards & bonuses. All codes verified daily - redeem now before they expire!`
  
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
      title: `${game.name} Promo Codes ${currentMonth} ${currentYear} | SaveSmart`,
      description: `${codeCount}+ working ${game.name} codes. Free gems, rewards & bonuses. Updated daily!`,
      url: `https://savesmart.bio/gaming/${game.slug}`,
      type: "website",
      siteName: "SaveSmart",
      images: [
        {
          url: game.logoUrl || `https://savesmart.bio/og/gaming/${game.slug}.jpg`,
          width: 1200,
          height: 630,
          alt: `${game.name} Promo Codes`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${game.name} Promo Codes ${currentMonth} ${currentYear}`,
      description: `${codeCount}+ working codes. Free gems & rewards!`,
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
