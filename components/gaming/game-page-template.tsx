import Link from "next/link"
import Image from "next/image"
import { 
  ChevronRight, 
  Gamepad2, 
  Gift, 
  Users, 
  Calendar,
  ExternalLink,
  HelpCircle,
  Zap,
  Tag,
  Trophy,
  Star,
  Flame,
  Play
} from "lucide-react"
import { PageContainer } from "@/components/layout/page-container"
import { PromoCodeCard } from "@/components/gaming/promo-code-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Game, PromoCode, GameReward } from "@/lib/gaming-data"
import { getBestPromoCode, getActivePromoCodes, sortPromoCodesByValue, getGameLogoUrl, getGameAffiliateUrl, hasExternalAffiliateLink } from "@/lib/gaming-data"

// ============================================
// TYPES
// ============================================

interface InternalLink {
  href: string
  label: string
}

interface GamePageTemplateProps {
  game: Game
  relatedGames: Game[]
  categoryLinks: InternalLink[]
}

// ============================================
// SCHEMA GENERATION
// ============================================

export function generateGameSchemaMarkup(game: Game, codes: PromoCode[]) {
  const baseUrl = "https://savesmart.bio"
  const pageUrl = `${baseUrl}/gaming/${game.slug}`

  // FAQPage schema
  const faqSchema = game.faqs && game.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: game.faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  } : null

  // ItemList schema for promo codes
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${game.name} Promo Codes`,
    description: `Active promo codes and rewards for ${game.name}`,
    numberOfItems: codes.length,
    itemListElement: codes.slice(0, 10).map((code, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Offer",
        name: code.code,
        description: code.reward,
        url: pageUrl
      }
    }))
  }

  // WebPage schema
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${game.name} Promo Codes & Rewards`,
    description: game.description,
    url: pageUrl,
    mainEntity: {
      "@type": "VideoGame",
      name: game.name,
      description: game.description,
      gamePlatform: game.platforms,
      genre: game.categories,
      publisher: {
        "@type": "Organization",
        name: game.publisher
      },
      developer: {
        "@type": "Organization", 
        name: game.developer
      }
    }
  }

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Gaming",
        item: `${baseUrl}/gaming`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: game.name,
        item: pageUrl
      }
    ]
  }

  return { faqSchema, itemListSchema, webPageSchema, breadcrumbSchema }
}

// ============================================
// SUB-COMPONENTS
// ============================================

function RewardCard({ reward, affiliateUrl, isExternal }: { reward: GameReward; affiliateUrl: string; isExternal: boolean }) {
  const typeColors: Record<GameReward['type'], string> = {
    'Free': 'bg-green-500/10 text-green-600',
    'New Player': 'bg-primary/10 text-primary',
    'Daily': 'bg-blue-500/10 text-blue-600',
    'Event': 'bg-amber-500/10 text-amber-600',
    'Referral': 'bg-pink-500/10 text-pink-600',
    'Achievement': 'bg-purple-500/10 text-purple-600',
  }

  return (
    <Card className="border-border/50 hover:border-green-500/30 hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
            <Gift className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-foreground">
                {reward.title}
              </h4>
              <Badge variant="outline" className={typeColors[reward.type]}>
                {reward.type}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {reward.description}
            </p>
            {reward.value && (
              <p className="text-sm font-semibold text-green-600 mt-1">
                {reward.value}
              </p>
            )}
          </div>
        </div>
        {/* Get Reward CTA */}
        <Button 
          asChild 
          size="sm"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.01] transition-all"
        >
          <a 
            href={reward.link || affiliateUrl} 
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
          >
            <Gift className="h-4 w-4 mr-2" />
            Get Reward
            {isExternal && <ExternalLink className="h-3 w-3 ml-2" />}
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}

// ============================================
// MAIN TEMPLATE
// ============================================

export function GamePageTemplate({
  game,
  relatedGames,
  categoryLinks
}: GamePageTemplateProps) {
  const activeCodes = sortPromoCodesByValue(getActivePromoCodes(game.promoCodes))
  const bestCode = getBestPromoCode(game.promoCodes)
  const schemas = generateGameSchemaMarkup(game, activeCodes)

  return (
    <main className="min-h-screen bg-background">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumbSchema) }}
      />
      {schemas.faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faqSchema) }}
        />
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/90 to-primary text-white py-12 md:py-16 overflow-hidden">
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
              {game.shortName || game.name}
            </span>
          </nav>

          {/* Game Info with Logo */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Game Logo - Large Visual Anchor */}
            <div className="relative h-24 w-24 md:h-28 md:w-28 shrink-0 rounded-2xl overflow-hidden ring-4 ring-white/20 shadow-2xl bg-white/10">
              {game.logoUrl ? (
                <Image
                  src={getGameLogoUrl(game)}
                  alt={game.name}
                  width={112}
                  height={112}
                  className="rounded-2xl object-cover"
                  priority
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-white/10">
                  <Gamepad2 className="h-12 w-12 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              {/* Category Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {game.categories.slice(0, 3).map(cat => (
                  <Badge key={cat} className="bg-white/10 text-white border-0">
                    {cat}
                  </Badge>
                ))}
                {game.playerCount && (
                  <Badge variant="outline" className="border-white/30 text-white">
                    <Users className="h-3 w-3 mr-1" />
                    {game.playerCount}
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
                {game.name} Promo Codes & Rewards
              </h1>

              {/* Description */}
              <p className="text-lg text-white/80 max-w-2xl mb-6">
                {game.description}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                  <Tag className="h-4 w-4" />
                  <span>{activeCodes.length} Active Codes</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                  <Trophy className="h-4 w-4" />
                  <span>{game.rewards.length} Rewards</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                  <Calendar className="h-4 w-4" />
                  <span>Updated {new Date(game.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Primary CTA - Play Now (Affiliate) */}
            <div className="shrink-0 flex flex-col gap-2">
              <Button 
                size="lg" 
                asChild 
                className="gap-2 bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all text-lg px-8 py-6"
              >
                <a 
                  href={getGameAffiliateUrl(game)} 
                  target={hasExternalAffiliateLink(game) ? "_blank" : undefined}
                  rel={hasExternalAffiliateLink(game) ? "noopener noreferrer" : undefined}
                >
                  <Play className="h-6 w-6 fill-current" />
                  Play {game.shortName || game.name}
                  {hasExternalAffiliateLink(game) && <ExternalLink className="h-4 w-4" />}
                </a>
              </Button>
              <p className="text-xs text-white/60 text-center">Free to play</p>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Best Code Highlight */}
      {bestCode && (
        <section className="py-8 border-b border-border bg-muted/30">
          <PageContainer>
            <div className="max-w-2xl mx-auto">
              <PromoCodeCard code={bestCode} game={game} variant="featured" />
            </div>
          </PageContainer>
        </section>
      )}

      {/* Promo Codes Section */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Tag className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              All {game.name} Promo Codes
            </h2>
          </div>

          {activeCodes.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {activeCodes.map((code) => (
                <PromoCodeCard key={code.id} code={code} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Tag className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No active codes right now
                </h3>
                <p className="text-muted-foreground mb-4">
                  Check back soon - we update codes daily!
                </p>
              </CardContent>
            </Card>
          )}
        </PageContainer>
      </section>

      {/* Rewards Section */}
      {game.rewards.length > 0 && (
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                <Gift className="h-5 w-5 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Free Rewards & Bonuses
              </h2>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {game.rewards.map((reward) => (
                <RewardCard 
                  key={reward.id} 
                  reward={reward} 
                  affiliateUrl={getGameAffiliateUrl(game)}
                  isExternal={hasExternalAffiliateLink(game)}
                />
              ))}
            </div>
          </PageContainer>
        </section>
      )}

      {/* FAQ Section */}
      {game.faqs && game.faqs.length > 0 && (
        <section className="py-10 md:py-12">
          <PageContainer>
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <HelpCircle className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-4">
                {game.faqs.map((faq, index) => (
                  <Card key={index} className="border-border/50">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-foreground mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </PageContainer>
        </section>
      )}

      {/* Related Games */}
      {relatedGames.length > 0 && (
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Star className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Similar Games with Codes
              </h2>
            </div>

            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {relatedGames.map((relatedGame) => {
                const relatedLogoUrl = getGameLogoUrl(relatedGame)
                const hasRelatedLogo = relatedGame.logoUrl
                const relatedCodeCount = getActivePromoCodes(relatedGame.promoCodes).length
                const relatedAffiliateUrl = getGameAffiliateUrl(relatedGame)
                const relatedIsExternal = hasExternalAffiliateLink(relatedGame)
                
                return (
                  <div
                    key={relatedGame.id}
                    className="flex flex-col p-4 rounded-xl border border-border bg-card hover:border-green-500/30 hover:shadow-md transition-all duration-200"
                  >
                    {/* Game Logo + Name */}
                    <Link href={`/gaming/${relatedGame.slug}`} className="flex items-center gap-3 mb-3">
                      <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden ring-2 ring-border/50 shadow-sm bg-muted/50">
                        {hasRelatedLogo ? (
                          <Image
                            src={relatedLogoUrl}
                            alt={relatedGame.name}
                            width={40}
                            height={40}
                            className="rounded-lg object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-primary/10">
                            <Gamepad2 className="h-5 w-5 text-primary" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                          {relatedGame.shortName || relatedGame.name}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {relatedCodeCount} codes
                        </span>
                      </div>
                    </Link>
                    {/* Play CTA */}
                    <Button 
                      asChild 
                      size="sm"
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-sm hover:shadow-md hover:scale-[1.01] transition-all"
                    >
                      <a 
                        href={relatedAffiliateUrl} 
                        target={relatedIsExternal ? "_blank" : undefined}
                        rel={relatedIsExternal ? "noopener noreferrer" : undefined}
                      >
                        <Play className="h-4 w-4 mr-1 fill-current" />
                        Play
                      </a>
                    </Button>
                  </div>
                )
              })}
            </div>
          </PageContainer>
        </section>
      )}

      {/* Category Links */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          <h3 className="text-xl font-bold text-foreground mb-6">
            Explore More Gaming Deals
          </h3>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/gaming/promo-codes"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium text-foreground transition-colors"
            >
              <Tag className="h-4 w-4" />
              All Promo Codes
            </Link>
            <Link
              href="/gaming/free-rewards"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium text-foreground transition-colors"
            >
              <Gift className="h-4 w-4" />
              Free Rewards
            </Link>
            <Link
              href="/gaming/new-player-deals"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium text-foreground transition-colors"
            >
              <Zap className="h-4 w-4" />
              New Player Deals
            </Link>
            <Link
              href="/gaming/today"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium text-foreground transition-colors"
            >
              <Calendar className="h-4 w-4" />
              Today&apos;s Codes
            </Link>
            {categoryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </PageContainer>
      </section>
    </main>
  )
}
