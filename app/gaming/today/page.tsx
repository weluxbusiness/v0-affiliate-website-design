import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/layout/page-container"
import { PromoCodeCard } from "@/components/gaming/promo-code-card"
import { GameCardCompact } from "@/components/gaming/gaming-internal-links"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
  ChevronRight,
  Gamepad2,
  Tag,
  Gift,
  Zap,
  Clock,
  TrendingUp,
  RefreshCw,
  Star,
  Flame,
  Play,
  ExternalLink,
  ArrowRight
} from "lucide-react"
import { 
  gamesData,
  getTrendingCodes,
  getRecentlyUpdatedGames,
  getActivePromoCodes,
  getBestPromoCode,
  getGameLogoUrl,
  getGameAffiliateUrl,
  hasExternalAffiliateLink
} from "@/lib/gaming-data"

// ISR with 5 minute revalidation for "daily" updates
export const revalidate = 300

export const metadata: Metadata = {
  title: "Today's Gaming Promo Codes - Latest Updates | SaveSmart",
  description: "Today's trending gaming promo codes and recently updated games. Fresh codes verified and added daily for Genshin Impact, Fortnite, RAID, and more.",
  keywords: [
    "today game codes",
    "latest promo codes",
    "new game codes",
    "trending game codes",
    "daily updated codes",
    "fresh game codes"
  ],
  openGraph: {
    title: "Today's Gaming Promo Codes | SaveSmart",
    description: "Today's trending gaming promo codes and recently updated games.",
    url: "https://savesmart.bio/gaming/today",
  },
  alternates: {
    canonical: "/gaming/today",
  },
}

export default function GamingTodayPage() {
  const trendingCodes = getTrendingCodes(12)
  const recentlyUpdatedGames = getRecentlyUpdatedGames(8)
  const lastUpdated = new Date().toISOString()

  // Get games with best codes for "Highlights" section
  const highlights = gamesData
    .map(game => ({
      game,
      bestCode: getBestPromoCode(game.promoCodes)
    }))
    .filter(item => item.bestCode)
    .sort((a, b) => (b.bestCode?.rewardValue || 0) - (a.bestCode?.rewardValue || 0))
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600/90 to-blue-700 text-white py-12 md:py-16 overflow-hidden">
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
              Today
            </span>
          </nav>

          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium">
              <Calendar className="h-3 w-3 mr-1" />
              Today&apos;s Codes
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-white/30 text-white text-sm font-medium">
              <RefreshCw className="h-3 w-3 mr-1" />
              Updated {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            Today&apos;s Gaming Promo Codes
          </h1>

          <p className="text-lg text-white/80 max-w-2xl">
            Fresh promo codes and recently updated games. 
            We verify codes multiple times daily so you get working codes when you need them.
          </p>
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
              href="/gaming/promo-codes"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium transition-colors"
            >
              <Tag className="h-4 w-4" />
              All Promo Codes
            </Link>
            <Link
              href="/gaming/free-rewards"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium transition-colors"
            >
              <Gift className="h-4 w-4" />
              Free Rewards
            </Link>
            <Link
              href="/gaming/new-player-deals"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium transition-colors"
            >
              <Zap className="h-4 w-4" />
              New Player Deals
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* Best Codes Highlights */}
      {highlights.length > 0 && (
        <section className="py-10 md:py-12 bg-primary/5">
          <PageContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Best Codes Today
                </h2>
                <p className="text-sm text-muted-foreground">
                  Highest value codes across all games
                </p>
              </div>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {highlights.map(({ game, bestCode }) => (
                <PromoCodeCard 
                  key={`highlight-${game.id}`}
                  code={bestCode!}
                  game={game}
                  variant="featured"
                  showGame={true}
                />
              ))}
            </div>
          </PageContainer>
        </section>
      )}

      {/* Trending Codes */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
              <TrendingUp className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Trending Codes
              </h2>
              <p className="text-sm text-muted-foreground">
                Most popular codes being redeemed today
              </p>
            </div>
          </div>

          {trendingCodes.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {trendingCodes.map(({ game, code }) => (
                <PromoCodeCard 
                  key={`trending-${game.id}-${code.id}`}
                  code={code}
                  game={game}
                  showGame={true}
                />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Tag className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No trending codes right now
                </h3>
                <p className="text-muted-foreground">
                  Check back soon - we update codes throughout the day!
                </p>
              </CardContent>
            </Card>
          )}
        </PageContainer>
      </section>

      {/* Recently Updated Games */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Recently Updated
              </h2>
              <p className="text-sm text-muted-foreground">
                Games with recently verified codes
              </p>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {recentlyUpdatedGames.map((game) => {
              const codeCount = getActivePromoCodes(game.promoCodes).length
              const logoUrl = getGameLogoUrl(game)
              const hasLogo = game.logoUrl
              const affiliateUrl = getGameAffiliateUrl(game)
              const isExternal = hasExternalAffiliateLink(game)
              
              return (
                <Card key={game.id} className="overflow-hidden border-border/50 hover:border-blue-500/30 hover:shadow-lg transition-all duration-200 group">
                  <CardContent className="p-4">
                    {/* Game Logo */}
                    <Link href={`/gaming/${game.slug}`} className="flex items-center gap-3 mb-3">
                      <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden ring-2 ring-border/50 shadow-md bg-muted/50">
                        {hasLogo ? (
                          <Image
                            src={logoUrl}
                            alt={game.name}
                            width={48}
                            height={48}
                            className="rounded-xl object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-blue-500/10">
                            <Clock className="h-6 w-6 text-blue-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                          {game.shortName || game.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {codeCount} codes
                        </p>
                      </div>
                    </Link>

                    {/* Play Now CTA */}
                    <Button 
                      asChild 
                      className="w-full h-9 font-semibold bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                      size="sm"
                    >
                      <a 
                        href={affiliateUrl} 
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                      >
                        <Play className="h-4 w-4 mr-1.5 fill-current" />
                        Play Now
                        {isExternal && <ExternalLink className="h-3.5 w-3.5 ml-1.5" />}
                      </a>
                    </Button>

                    {/* View Codes Link */}
                    <Link 
                      href={`/gaming/${game.slug}`}
                      className="flex items-center justify-center gap-1 mt-2 text-xs font-medium text-primary hover:underline"
                    >
                      View Codes
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </PageContainer>
      </section>

      {/* Update Info */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <RefreshCw className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Last updated: {new Date(lastUpdated).toLocaleString()}
              </span>
            </div>
            <p className="text-muted-foreground">
              This page is automatically updated every 5 minutes to ensure you always have access to the freshest codes. 
              We verify codes across all games multiple times per day.
            </p>
          </div>
        </PageContainer>
      </section>

      <Footer />
    </div>
  )
}
