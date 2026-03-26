import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/layout/page-container"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Tag, 
  ChevronRight,
  Gamepad2,
  Gift,
  Trophy,
  Users,
  ArrowRight,
  Flame,
  Star,
  TrendingUp,
  Play,
  ExternalLink
} from "lucide-react"
import { 
  gamesData,
  getActivePromoCodes,
  getPopularGames,
  getGameLogoUrl,
  getGameAffiliateUrl,
  hasExternalAffiliateLink
} from "@/lib/gaming-data"

export const revalidate = 300

export const metadata: Metadata = {
  title: "Top 20 Games with Promo Codes 2026 - Most Popular | SaveSmart",
  description: "Discover the top 20 most popular games with active promo codes. Find codes for Genshin Impact, Fortnite, RAID Shadow Legends, Roblox and more trending games.",
  keywords: [
    "top games with promo codes",
    "most popular game codes",
    "best games with codes",
    "trending games promo codes",
    "top mobile games codes",
    "popular pc game codes"
  ],
  openGraph: {
    title: "Top 20 Games with Promo Codes 2026 | SaveSmart",
    description: "Discover the most popular games with active promo codes. Updated daily.",
    url: "https://savesmart.bio/gaming/top-games",
  },
  alternates: {
    canonical: "/gaming/top-games",
  },
}

export default function TopGamesPage() {
  // Get top 20 games by popularity
  const topGames = getPopularGames(20)

  // Schema
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Top 20 Games with Promo Codes 2026",
    description: "Most popular games with active promo codes",
    numberOfItems: topGames.length,
    itemListElement: topGames.map((game, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "VideoGame",
        name: game.name,
        description: game.description,
        gamePlatform: game.platforms,
        genre: game.categories,
        url: `https://savesmart.bio/gaming/${game.slug}`
      }
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-600 to-orange-500 text-white py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <PageContainer>
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="relative z-10 mb-6 flex flex-wrap items-center gap-2 text-sm">
            <Link 
              href="/" 
              className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-white/50" />
            <Link 
              href="/gaming" 
              className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
            >
              Gaming
            </Link>
            <ChevronRight className="h-4 w-4 text-white/50" />
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
              Top Games
            </span>
          </nav>

          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium">
              <TrendingUp className="h-3 w-3 mr-1" />
              Most Popular
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-white/30 text-white text-sm font-medium">
              <Gamepad2 className="h-3 w-3 mr-1" />
              Top {topGames.length} Games
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            Top Games with Promo Codes 2026
          </h1>

          <p className="text-lg text-white/90 max-w-2xl mb-6">
            The most popular games that offer promo codes for free rewards. 
            These games have the most active codes and best rewards for players.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <Gamepad2 className="h-4 w-4" />
              <span>{topGames.length} Top Games</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <Users className="h-4 w-4" />
              <span>Millions of Players</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <Gift className="h-4 w-4" />
              <span>Free Rewards Available</span>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Quick Navigation */}
      <section className="py-6 border-b border-border bg-muted/30">
        <PageContainer>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/gaming"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium transition-colors"
            >
              <Gamepad2 className="h-4 w-4" />
              All Games
            </Link>
            <Link
              href="/gaming/best-codes"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium transition-colors"
            >
              <Trophy className="h-4 w-4" />
              Best Codes
            </Link>
            <Link
              href="/gaming/all-codes"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium transition-colors"
            >
              <Tag className="h-4 w-4" />
              All Codes
            </Link>
            <Link
              href="/gaming/new-player-deals"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium transition-colors"
            >
              <Star className="h-4 w-4" />
              New Player Deals
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* Top Games List */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <div className="space-y-6">
            {topGames.map((game, index) => {
              const codeCount = getActivePromoCodes(game.promoCodes).length
              const logoUrl = getGameLogoUrl(game)
              const hasLogo = game.logoUrl
              const affiliateUrl = getGameAffiliateUrl(game)
              const isExternal = hasExternalAffiliateLink(game)
              
              return (
                <Card key={game.id} className="overflow-hidden border-border/50 hover:border-orange-500/30 transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Rank Badge */}
                      <div className="flex items-center justify-center lg:justify-start">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-full font-bold text-xl ${
                          index === 0 ? 'bg-amber-500 text-white ring-4 ring-amber-500/30' :
                          index === 1 ? 'bg-gray-300 text-gray-800 ring-4 ring-gray-300/30' :
                          index === 2 ? 'bg-amber-700 text-white ring-4 ring-amber-700/30' :
                          'bg-muted text-foreground'
                        }`}>
                          #{index + 1}
                        </div>
                      </div>

                      {/* Game Info */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start gap-4 mb-4">
                          <Link href={`/gaming/${game.slug}`} className="flex items-center gap-4 group">
                            <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden ring-2 ring-border/50 shadow-md bg-muted/50">
                              {hasLogo ? (
                                <Image
                                  src={logoUrl}
                                  alt={game.name}
                                  width={64}
                                  height={64}
                                  className="rounded-xl object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-primary/10">
                                  <Gamepad2 className="h-8 w-8 text-primary" />
                                </div>
                              )}
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                                {game.name}
                              </h2>
                              <p className="text-sm text-muted-foreground">
                                by {game.developer} | {game.platforms.join(', ')}
                              </p>
                            </div>
                          </Link>
                        </div>

                        {/* Description */}
                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {game.description}
                        </p>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                            <Tag className="h-3 w-3 mr-1" />
                            {codeCount} Active Codes
                          </Badge>
                          <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-0">
                            <Gift className="h-3 w-3 mr-1" />
                            {game.rewards.length} Rewards
                          </Badge>
                          {game.categories.slice(0, 2).map(cat => (
                            <Badge key={cat} variant="outline" className="text-muted-foreground">
                              {cat}
                            </Badge>
                          ))}
                          {game.playerCount && (
                            <Badge variant="outline" className="text-muted-foreground">
                              <Users className="h-3 w-3 mr-1" />
                              {game.playerCount}
                            </Badge>
                          )}
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-wrap items-center gap-3">
                          <Button asChild variant="outline">
                            <Link href={`/gaming/${game.slug}`}>
                              View Codes
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                          </Button>
                          <Button 
                            asChild 
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <a 
                              href={affiliateUrl} 
                              target={isExternal ? "_blank" : undefined}
                              rel={isExternal ? "noopener noreferrer" : undefined}
                            >
                              <Play className="h-4 w-4 mr-1 fill-current" />
                              Play Now
                              {isExternal && <ExternalLink className="h-3 w-3 ml-1" />}
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </PageContainer>
      </section>

      {/* SEO Content Section */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Why These Are the Top Games for Promo Codes
            </h2>
            <div className="prose prose-gray dark:prose-invert">
              <p className="text-muted-foreground mb-4">
                We rank games based on multiple factors: the number of active promo codes, frequency of new code releases, 
                total reward value, player base size, and user engagement. Games at the top of our list consistently 
                offer the best value for players looking for free rewards.
              </p>
              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">What Makes a Game Great for Codes?</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><strong>Regular Updates:</strong> Top games release new codes during events, updates, and milestones</li>
                <li><strong>Generous Rewards:</strong> The best games offer valuable currency, items, and exclusive content</li>
                <li><strong>Active Community:</strong> Large player bases mean more code sharing and faster discovery</li>
                <li><strong>Developer Engagement:</strong> Studios that actively engage with players release more codes</li>
              </ul>
              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Getting Started with a New Game</h3>
              <p className="text-muted-foreground">
                If you&apos;re new to any of these games, check our new player deals page for exclusive starter bonuses. 
                Many games offer special welcome rewards that can give you a significant head start.
              </p>
            </div>
          </div>
        </PageContainer>
      </section>

      <Footer />
    </div>
  )
}
