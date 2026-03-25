import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/layout/page-container"
import { PromoCodeCard } from "@/components/gaming/promo-code-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Zap, 
  ChevronRight,
  Gamepad2,
  Tag,
  Gift,
  Calendar,
  ArrowRight,
  Sparkles,
  Flame,
  Play,
  ExternalLink
} from "lucide-react"
import { 
  gamesData,
  getGamesWithNewPlayerDeals,
  getActivePromoCodes,
  sortPromoCodesByValue,
  getGameLogoUrl,
  getGameAffiliateUrl,
  hasExternalAffiliateLink
} from "@/lib/gaming-data"

export const revalidate = 300

export const metadata: Metadata = {
  title: "New Player Gaming Deals - Starter Bonuses & Welcome Rewards | SaveSmart",
  description: "Get the best start in your favorite games with new player deals, starter packs, and welcome bonuses. Free characters, currency, and exclusive rewards for beginners.",
  keywords: [
    "new player deals",
    "starter pack codes",
    "welcome bonus games",
    "beginner rewards",
    "free starter pack",
    "new account rewards",
    "first time player bonus"
  ],
  openGraph: {
    title: "New Player Gaming Deals | SaveSmart",
    description: "Get the best start in your favorite games with new player deals and welcome bonuses.",
    url: "https://savesmart.bio/gaming/new-player-deals",
  },
  alternates: {
    canonical: "/gaming/new-player-deals",
  },
}

export default function NewPlayerDealsPage() {
  const gamesWithNewPlayerDeals = getGamesWithNewPlayerDeals()

  // Get new player specific codes and rewards
  const newPlayerData = gamesWithNewPlayerDeals.map(game => {
    const newPlayerCodes = sortPromoCodesByValue(
      getActivePromoCodes(game.promoCodes).filter(
        code => 
          code.reward.toLowerCase().includes('new player') || 
          code.reward.toLowerCase().includes('starter') ||
          code.reward.toLowerCase().includes('beginner') ||
          code.isExclusive
      )
    )

    const newPlayerRewards = game.rewards.filter(
      r => r.type === 'New Player' || r.title.toLowerCase().includes('starter')
    )

    return {
      game,
      codes: newPlayerCodes.length > 0 ? newPlayerCodes : sortPromoCodesByValue(getActivePromoCodes(game.promoCodes)).slice(0, 2),
      rewards: newPlayerRewards
    }
  }).filter(item => item.codes.length > 0 || item.rewards.length > 0)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-500/90 to-amber-600 text-white py-12 md:py-16 overflow-hidden">
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
            <Link 
              href="/gaming" 
              className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
            >
              Gaming
            </Link>
            <ChevronRight className="h-4 w-4 text-white/50" />
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
              New Player Deals
            </span>
          </nav>

          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-white/10 text-white border-0">
              <Zap className="h-3 w-3 mr-1" />
              New Player Deals
            </Badge>
            <Badge variant="outline" className="border-white/30 text-white">
              {newPlayerData.length}+ Games
            </Badge>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            New Player Deals & Starter Bonuses
          </h1>

          <p className="text-lg text-white/80 max-w-2xl">
            Starting a new game? Get the best head start with exclusive new player codes, 
            starter packs, and welcome bonuses. Free characters, currency, and items for beginners.
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
              Promo Codes
            </Link>
            <Link
              href="/gaming/free-rewards"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium transition-colors"
            >
              <Gift className="h-4 w-4" />
              Free Rewards
            </Link>
            <Link
              href="/gaming/today"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium transition-colors"
            >
              <Calendar className="h-4 w-4" />
              Today&apos;s Codes
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* New Player Deals by Game */}
      <section className="py-10 md:py-12">
        <PageContainer>
          {newPlayerData.length > 0 ? (
            <div className="space-y-12">
              {newPlayerData.map(({ game, codes, rewards }) => {
                const logoUrl = getGameLogoUrl(game)
                const hasLogo = game.logoUrl
                const affiliateUrl = getGameAffiliateUrl(game)
                const isExternal = hasExternalAffiliateLink(game)
                
                return (
                  <div key={game.id} className="bg-card rounded-xl border border-border/50 p-6 hover:border-amber-500/20 transition-colors">
                    {/* Game Header with Logo */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <Link 
                        href={`/gaming/${game.slug}`}
                        className="flex items-center gap-4 group"
                      >
                        {/* Game Logo - Primary Visual */}
                        <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden ring-2 ring-amber-500/30 shadow-md bg-muted/50">
                          {hasLogo ? (
                            <Image
                              src={logoUrl}
                              alt={game.name}
                              width={56}
                              height={56}
                              className="rounded-xl object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-amber-500/10">
                              <Sparkles className="h-7 w-7 text-amber-500" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                              {game.shortName || game.name}
                            </h2>
                            <Badge variant="secondary" className="text-xs bg-amber-500/10 text-amber-600 border-0">
                              <Zap className="h-3 w-3 mr-1" />
                              Starter
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {codes.length} starter codes | {game.categories[0]}
                          </p>
                        </div>
                      </Link>
                      <div className="flex items-center gap-3">
                        {/* Play Now CTA */}
                        <Button 
                          asChild 
                          className="h-10 font-semibold bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                        >
                          <a 
                            href={affiliateUrl} 
                            target={isExternal ? "_blank" : undefined}
                            rel={isExternal ? "noopener noreferrer" : undefined}
                          >
                            <Play className="h-4 w-4 mr-2 fill-current" />
                            Play Now
                            {isExternal && <ExternalLink className="h-3.5 w-3.5 ml-2" />}
                          </a>
                        </Button>
                        <Link 
                          href={`/gaming/${game.slug}`}
                          className="text-sm font-medium text-primary hover:underline flex items-center gap-1 group"
                        >
                          View Codes
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>

                  {/* New Player Rewards Info */}
                  {rewards.length > 0 && (
                    <div className="mb-4 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-amber-500" />
                        <span className="font-medium text-foreground">New Player Bonuses</span>
                      </div>
                      <div className="space-y-1">
                        {rewards.map((reward, idx) => (
                          <p key={idx} className="text-sm text-muted-foreground">
                            {reward.title}: <span className="text-foreground">{reward.value || reward.description}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                    {/* Codes Grid */}
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      {codes.slice(0, 3).map((code) => (
                        <PromoCodeCard key={code.id} code={code} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Zap className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No new player deals right now
                </h3>
                <p className="text-muted-foreground mb-4">
                  Check back soon or browse all promo codes.
                </p>
                <Button asChild>
                  <Link href="/gaming/promo-codes">
                    Browse All Codes
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </PageContainer>
      </section>

      {/* Tips Section */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Tips for New Players
            </h2>

            <div className="space-y-4">
              <Card className="border-border/50">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-foreground mb-2">
                    1. Redeem Codes Before Playing
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Enter promo codes as soon as you create your account. Many starter codes are only valid for new accounts within the first few days.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-foreground mb-2">
                    2. Don&apos;t Rush Through Tutorials
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Many games give substantial rewards for completing tutorial missions. Take your time to maximize these one-time bonuses.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-foreground mb-2">
                    3. Check for Referral Programs
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    If a friend invited you, use their referral code. Both of you often get bonus rewards for completing early milestones together.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* CTA Section */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground mb-4">
              Looking for more codes?
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" asChild>
                <Link href="/gaming/promo-codes">
                  <Tag className="h-5 w-5 mr-2" />
                  All Promo Codes
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/gaming/free-rewards">
                  <Gift className="h-5 w-5 mr-2" />
                  Free Rewards
                </Link>
              </Button>
            </div>
          </div>
        </PageContainer>
      </section>

      <Footer />
    </div>
  )
}
