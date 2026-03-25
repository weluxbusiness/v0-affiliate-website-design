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
  
  const title = game.metaTitle || `${game.name} Promo Codes & Free Rewards ${new Date().getFullYear()} | SaveSmart`
  const description = game.metaDescription || 
    `Get working ${game.name} promo codes, free rewards, and in-game bonuses. ${game.promoCodes.length}+ verified codes updated daily. ${game.description.slice(0, 100)}...`
  
  return {
    title,
    description,
    keywords: [
      `${game.name} codes`,
      `${game.name} promo codes`,
      `${game.name} redeem codes`,
      `${game.name} free rewards`,
      `${game.name} codes ${new Date().getFullYear()}`,
      `${game.name} codes today`,
      ...game.categories.map(cat => `${cat} game codes`),
    ],
    openGraph: {
      title: `${game.name} Promo Codes & Rewards | SaveSmart`,
      description: `Get working ${game.name} promo codes and free rewards. Updated daily.`,
      url: `https://savesmart.bio/gaming/${game.slug}`,
      type: "website",
      siteName: "SaveSmart",
    },
    twitter: {
      card: "summary_large_image",
      title: `${game.name} Promo Codes`,
      description: `Working ${game.name} codes and free rewards.`,
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
