import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/layout/page-container"
import { PromoCodeCard } from "@/components/gaming/promo-code-card"
import { GameCardCompact, GamingCategoryFilter } from "@/components/gaming/gaming-internal-links"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Gamepad2, 
  Tag, 
  Gift, 
  Zap, 
  TrendingUp,
  Calendar,
  ChevronRight,
  ArrowRight
} from "lucide-react"
import { 
  gamesData, 
  getPopularGames,
  getTrendingCodes,
  getActivePromoCodes,
  getAllCategories,
  getTotalActiveCodesCount
} from "@/lib/gaming-data"

export const revalidate = 300 // Revalidate every 5 minutes

export const metadata: Metadata = {
  title: "Gaming Promo Codes & Free Rewards | SaveSmart",
  description: "Find working promo codes, free rewards, and new player deals for popular games like Genshin Impact, Fortnite, RAID, Roblox, and more. Updated daily.",
  keywords: [
    "gaming promo codes",
    "free game rewards",
    "game codes",
    "genshin impact codes",
    "fortnite codes",
    "roblox codes",
    "mobile game codes",
    "new player deals"
  ],
  openGraph: {
    title: "Gaming Promo Codes & Free Rewards | SaveSmart",
    description: "Find working promo codes and free rewards for popular games. Updated daily.",
    url: "https://savesmart.bio/gaming",
    type: "website",
  },
  alternates: {
    canonical: "/gaming",
  },
}

export default function GamingPage() {
  const popularGames = getPopularGames(12)
  const trendingCodes = getTrendingCodes(6)
  const categories = getAllCategories()
  const totalCodes = getTotalActiveCodesCount()

  // Get featured games (top 4 by popularity)
  const featuredGames = popularGames.slice(0, 4)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/90 to-primary text-white py-14 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <PageContainer>
          {/* Breadcrumbs */}
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm">
            <Link 
              href="/" 
              className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-white/50" />
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
              Gaming
            </span>
          </nav>

          {/* Hero Content */}
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-white/10 text-white border-0">
                <Gamepad2 className="h-3 w-3 mr-1" />
                Gaming Deals
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white">
                {totalCodes}+ Active Codes
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
              Gaming Promo Codes & Free Rewards
            </h1>

            <p className="text-xl text-white/80 mb-8 max-w-2xl">
              Discover working promo codes, in-game rewards, and exclusive bonuses for your favorite games. 
              We verify codes daily so you never miss out on free loot.
            </p>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-3">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/gaming/promo-codes">
                  <Tag className="h-5 w-5 mr-2" />
                  All Promo Codes
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                <Link href="/gaming/free-rewards">
                  <Gift className="h-5 w-5 mr-2" />
                  Free Rewards
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                <Link href="/gaming/new-player-deals">
                  <Zap className="h-5 w-5 mr-2" />
                  New Player Deals
                </Link>
              </Button>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Trending Codes Section */}
      <section className="py-10 md:py-12 border-b border-border">
        <PageContainer>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Trending Codes Today
              </h2>
            </div>
            <Link 
              href="/gaming/today"
              className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {trendingCodes.map(({ game, code }) => (
              <PromoCodeCard 
                key={`${game.id}-${code.id}`}
                code={code}
                game={game}
                showGame={true}
              />
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Featured Games */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                <Gamepad2 className="h-5 w-5 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Featured Games
              </h2>
            </div>
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {featuredGames.map((game) => {
              const codeCount = getActivePromoCodes(game.promoCodes).length
              return (
                <Card key={game.id} className="overflow-hidden border-border/50 hover:border-primary/30 transition-colors group">
                  <CardContent className="p-0">
                    <Link href={`/gaming/${game.slug}`} className="block">
                      <div className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <Gamepad2 className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {game.shortName || game.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {game.categories[0]} | {game.platforms[0]}
                            </p>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {game.description.slice(0, 100)}...
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              <Tag className="h-3 w-3 mr-1" />
                              {codeCount} codes
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Gift className="h-3 w-3 mr-1" />
                              {game.rewards.length} rewards
                            </Badge>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </PageContainer>
      </section>

      {/* Browse by Category */}
      <section className="py-10 md:py-12 border-b border-border">
        <PageContainer>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Tag className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Browse by Category
            </h2>
          </div>

          <GamingCategoryFilter categories={categories} />
        </PageContainer>
      </section>

      {/* All Games List */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Gamepad2 className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              All Games with Promo Codes
            </h2>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {popularGames.map((game) => (
              <GameCardCompact 
                key={game.id}
                game={game}
                codeCount={getActivePromoCodes(game.promoCodes).length}
              />
            ))}
          </div>

          {gamesData.length > 12 && (
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" asChild>
                <Link href="/gaming/promo-codes">
                  View All {gamesData.length} Games
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          )}
        </PageContainer>
      </section>

      {/* Quick Links Footer */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          <h3 className="text-xl font-bold text-foreground mb-6">
            Explore Gaming Deals
          </h3>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <Link 
              href="/gaming/promo-codes"
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors"
            >
              <Tag className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">All Promo Codes</p>
                <p className="text-xs text-muted-foreground">{totalCodes}+ codes</p>
              </div>
            </Link>
            <Link 
              href="/gaming/free-rewards"
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors"
            >
              <Gift className="h-5 w-5 text-secondary" />
              <div>
                <p className="font-medium text-foreground">Free Rewards</p>
                <p className="text-xs text-muted-foreground">Daily bonuses</p>
              </div>
            </Link>
            <Link 
              href="/gaming/new-player-deals"
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors"
            >
              <Zap className="h-5 w-5 text-amber-500" />
              <div>
                <p className="font-medium text-foreground">New Player Deals</p>
                <p className="text-xs text-muted-foreground">Starter bonuses</p>
              </div>
            </Link>
            <Link 
              href="/gaming/today"
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors"
            >
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium text-foreground">Today&apos;s Codes</p>
                <p className="text-xs text-muted-foreground">Latest updates</p>
              </div>
            </Link>
          </div>
        </PageContainer>
      </section>

      <Footer />
    </div>
  )
}
