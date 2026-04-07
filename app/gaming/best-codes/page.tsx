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
  Tag, 
  ChevronRight,
  Gamepad2,
  Gift,
  Zap,
  Trophy,
  ArrowRight,
  Flame,
  Star,
  Play,
  ExternalLink
} from "lucide-react"
import { 
  gamesData,
  getActivePromoCodes,
  getBestPromoCode,
  sortPromoCodesByValue,
  getGameLogoUrl,
  getGameAffiliateUrl,
  hasExternalAffiliateLink
} from "@/lib/gaming-data"

export const revalidate = 300

export const metadata: Metadata = {
  title: "Best Gaming Promo Codes 2026 - Highest Value Rewards | SaveSmart",
  description: "Discover the best and highest value promo codes for popular games. Get maximum free rewards, rare items, and exclusive bonuses. Updated daily with verified codes.",
  keywords: [
    "best gaming promo codes",
    "best game codes 2026",
    "highest value game codes",
    "rare game rewards",
    "top promo codes",
    "best free rewards gaming"
  ],
  openGraph: {
    title: "Best Gaming Promo Codes 2026 | SaveSmart",
    description: "Discover the highest value promo codes for popular games. Maximum rewards, verified daily.",
    url: "https://savesmart.bio/gaming/best-codes",
  },
  alternates: {
    canonical: "/gaming/best-codes",
  },
}

// Schema for SEO
const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Best Gaming Promo Codes 2026",
  description: "Curated list of highest value promo codes for popular games",
  itemListElement: gamesData
    .filter(game => getBestPromoCode(game.promoCodes))
    .slice(0, 20)
    .map((game, index) => {
      const bestCode = getBestPromoCode(game.promoCodes)
      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Offer",
          name: `${game.name} - ${bestCode?.code}`,
          description: bestCode?.reward,
          url: `https://savesmart.bio/gaming/${game.slug}`
        }
      }
    })
}

export default function BestCodesPage() {
  // Get games with their best codes, sorted by value
  const gamesWithBestCodes = gamesData
    .map(game => ({
      game,
      bestCode: getBestPromoCode(game.promoCodes),
      allCodes: sortPromoCodesByValue(getActivePromoCodes(game.promoCodes))
    }))
    .filter((item): item is typeof item & { bestCode: NonNullable<typeof item.bestCode> } => 
      item.bestCode !== null
    )
    .sort((a, b) => {
      // Sort by estimated value (parsing from reward description)
      const getValueScore = (reward: string) => {
        const match = reward.match(/(\d+)/g)
        if (match) {
          return Math.max(...match.map(Number))
        }
        return 0
      }
      return getValueScore(b.bestCode.reward) - getValueScore(a.bestCode.reward)
    })
    .slice(0, 20)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-600 to-amber-500 text-white py-12 md:py-16 overflow-hidden">
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
              Best Codes
            </span>
          </nav>

          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium">
              <Trophy className="h-3 w-3 mr-1" />
              Highest Value
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full border border-white/30 text-white text-sm font-medium">
              <Star className="h-3 w-3 mr-1" />
              Top {gamesWithBestCodes.length} Codes
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            Best Gaming Promo Codes 2026
          </h1>

          <p className="text-lg text-white/90 max-w-2xl mb-6">
            We&apos;ve handpicked the highest value promo codes from each game. 
            These codes offer the best rewards, rare items, and exclusive bonuses. 
            All codes are verified and working.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <Trophy className="h-4 w-4" />
              <span>{gamesWithBestCodes.length} Best Codes</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <Gift className="h-4 w-4" />
              <span>Maximum Value Rewards</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <Zap className="h-4 w-4" />
              <span>Updated Daily</span>
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
              href="/gaming/all-codes"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium transition-colors"
            >
              <Tag className="h-4 w-4" />
              All Codes
            </Link>
            <Link
              href="/gaming/top-games"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium transition-colors"
            >
              <Flame className="h-4 w-4" />
              Top Games
            </Link>
            <Link
              href="/gaming/free-rewards"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium transition-colors"
            >
              <Gift className="h-4 w-4" />
              Free Rewards
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* Best Codes Section */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <div className="space-y-6">
            {gamesWithBestCodes.map(({ game, bestCode, allCodes }, index) => {
              const logoUrl = getGameLogoUrl(game)
              const hasLogo = game.logoUrl
              const affiliateUrl = getGameAffiliateUrl(game)
              const isExternal = hasExternalAffiliateLink(game)
              
              return (
                <Card key={game.id} className="overflow-hidden border-border/50 hover:border-amber-500/30 transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Rank Badge */}
                      <div className="flex items-center justify-center lg:justify-start">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full font-bold text-lg ${
                          index === 0 ? 'bg-amber-500 text-white' :
                          index === 1 ? 'bg-gray-300 text-gray-800' :
                          index === 2 ? 'bg-amber-700 text-white' :
                          'bg-muted text-foreground'
                        }`}>
                          #{index + 1}
                        </div>
                      </div>

                      {/* Game Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <Link href={`/gaming/${game.slug}`} className="flex items-center gap-3 group">
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
                                <div className="h-full w-full flex items-center justify-center bg-primary/10">
                                  <Gamepad2 className="h-6 w-6 text-primary" />
                                </div>
                              )}
                            </div>
                            <div>
                              <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                {game.shortName || game.name}
                              </h2>
                              <p className="text-sm text-muted-foreground">
                                {allCodes.length} codes available | {game.categories[0]}
                              </p>
                            </div>
                          </Link>
                        </div>

                        {/* Best Code */}
                        {bestCode && (
                          <div className="mb-4">
                            <Badge variant="outline" className="mb-2 bg-amber-500/10 text-amber-600 border-amber-500/30">
                              <Trophy className="h-3 w-3 mr-1" />
                              Best Code
                            </Badge>
                            <PromoCodeCard code={bestCode} variant="featured" />
                          </div>
                        )}

                        {/* View More Link */}
                        <div className="flex items-center gap-4 mt-4">
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/gaming/${game.slug}`}>
                              View All {allCodes.length} Codes
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                          </Button>
                          {affiliateUrl && (
                            <Button 
                              asChild 
                              size="sm"
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
                          )}
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

      {/* How to Use Section - SEO Content */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              How to Find and Use the Best Gaming Promo Codes
            </h2>
            <div className="prose prose-gray dark:prose-invert">
              <p className="text-muted-foreground mb-4">
                Gaming promo codes are special codes released by game developers that give players free in-game rewards, 
                currency, items, and bonuses. We track and verify codes from official sources to ensure you get the 
                highest value rewards.
              </p>
              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Tips for Maximizing Your Rewards</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Check back daily - new codes are released frequently during events and updates</li>
                <li>Redeem codes quickly - some codes have limited uses or expire fast</li>
                <li>Follow official social media for exclusive code announcements</li>
                <li>Create a new account to stack new player bonuses with promo codes</li>
              </ul>
              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Why Our Codes Are the Best</h3>
              <p className="text-muted-foreground">
                We curate the highest value codes from each game based on reward value, rarity, and player feedback. 
                Every code is tested before being added to our list, and we remove expired codes within hours.
              </p>
            </div>
          </div>
        </PageContainer>
      </section>

      <Footer />
    </div>
  )
}
