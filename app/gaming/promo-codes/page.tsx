import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/layout/page-container"
import { PromoCodeCard } from "@/components/gaming/promo-code-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Tag, 
  ChevronRight,
  Gamepad2,
  Gift,
  Zap,
  Calendar,
  ArrowRight,
  Flame,
  Play,
  ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  gamesData,
  getActivePromoCodes,
  getTotalActiveCodesCount,
  sortPromoCodesByValue,
  getGameLogoUrl,
  getPlayAffiliateUrl,
  hasGameSpecificAffiliateLinks
} from "@/lib/gaming-data"

export const revalidate = 300

export const metadata: Metadata = {
  title: "All Gaming Promo Codes April 2026 - 500+ Working Codes",
  description: "Browse 500+ verified promo codes for Genshin Impact, Fortnite, RAID, Roblox & 100+ games. Free gems, rewards & bonuses. Updated daily - redeem before codes expire!",
  keywords: [
    "gaming promo codes",
    "game codes 2026",
    "working game codes",
    "free game codes",
    "mobile game codes",
    "pc game codes",
    "all game codes",
    "verified promo codes"
  ],
  openGraph: {
    title: "All Gaming Promo Codes April 2026 - 500+ Working Codes | SaveSmart",
    description: "500+ verified gaming promo codes. Free gems, rewards & bonuses. Redeem now!",
    url: "https://savesmart.bio/gaming/promo-codes",
  },
  alternates: {
    canonical: "/gaming/promo-codes",
  },
}

export default function GamingPromoCodesPage() {
  const totalCodes = getTotalActiveCodesCount()

  // Group codes by game
  const gameCodesMap = gamesData
    .map(game => ({
      game,
      codes: sortPromoCodesByValue(getActivePromoCodes(game.promoCodes))
    }))
    .filter(item => item.codes.length > 0)
    .sort((a, b) => b.game.popularityScore - a.game.popularityScore)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/90 to-primary text-white py-12 md:py-16 overflow-hidden">
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
              Promo Codes
            </span>
          </nav>

          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium">
              <Tag className="h-3 w-3 mr-1" />
              Promo Codes
            </span>
            <Link 
              href="/gaming/today"
              className="inline-flex items-center px-3 py-1 rounded-full border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer"
            >
              {totalCodes}+ Active Codes
            </Link>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            All Gaming Promo Codes
          </h1>

          <p className="text-lg text-white/80 max-w-2xl">
            Browse all working promo codes for {gamesData.length}+ popular games. 
            Every code is verified and updated daily.
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

      {/* Codes by Game */}
      <section className="py-10 md:py-12">
        <PageContainer>
          {gameCodesMap.length > 0 ? (
            <div className="space-y-12">
              {gameCodesMap.map(({ game, codes }) => {
                const logoUrl = getGameLogoUrl(game)
                const hasLogo = game.logoUrl
                const hasRealAffiliate = hasGameSpecificAffiliateLinks(game)
                const affiliateUrl = hasRealAffiliate ? getPlayAffiliateUrl(game) : null
                
                return (
                  <div key={game.id} className="bg-card rounded-xl border border-border/50 p-6 hover:border-green-500/20 transition-colors">
                    {/* Game Header with Logo */}
                    <div className="flex items-center justify-between mb-6">
                      <Link 
                        href={`/gaming/${game.slug}`}
                        className="flex items-center gap-4 group"
                      >
                        {/* Game Logo - Primary Visual */}
                        <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden ring-2 ring-border/50 shadow-md bg-muted/50">
                          {hasLogo ? (
                            <Image
                              src={logoUrl}
                              alt={`${game.name} codes April 2026`}
                              width={48}
                              height={48}
                              className="rounded-xl object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-primary/10">
                              <Gamepad2 className="h-6 w-6 text-primary" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                              {game.shortName || game.name}
                            </h2>
                            {codes.length > 2 && (
                              <Badge variant="secondary" className="text-xs bg-orange-500/10 text-orange-600 border-0">
                                <Flame className="h-3 w-3 mr-1" />
                                Hot
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {codes.length} active codes | {game.categories[0]}
                            {hasRealAffiliate && (
                              <span className="ml-2 text-green-600 font-medium">
                                · Official offer
                              </span>
                            )}
                            {!hasRealAffiliate && (
                              <span className="ml-2 text-blue-600">
                                · Codes & guides
                              </span>
                            )}
                          </p>
                        </div>
                      </Link>
                      
                      {/* Conditional CTA based on affiliate availability */}
                      {hasRealAffiliate && affiliateUrl ? (
                        <Button 
                          asChild 
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                        >
                          <a 
                            href={affiliateUrl} 
                            target="_blank"
                            rel="nofollow sponsored noopener"
                          >
                            <Play className="h-4 w-4 mr-2 fill-current" />
                            Play Now
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </a>
                        </Button>
                      ) : (
                        <Button 
                          asChild 
                          variant="outline"
                          className="font-semibold hover:bg-primary/5 transition-all"
                        >
                          <Link href={`/gaming/${game.slug}`}>
                            <Tag className="h-4 w-4 mr-2" />
                            View Codes
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      )}
                    </div>

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
                <Tag className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No codes available
                </h3>
                <p className="text-muted-foreground">
                  Check back soon - we update codes daily!
                </p>
              </CardContent>
            </Card>
          )}
        </PageContainer>
      </section>

      <Footer />
    </div>
  )
}
