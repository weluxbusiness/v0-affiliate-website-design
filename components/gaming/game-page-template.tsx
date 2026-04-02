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
import { getBestPromoCode, getActivePromoCodes, getExpiredPromoCodes, sortPromoCodesByValue, getGameLogoUrl, getGameAffiliateUrl, hasExternalAffiliateLink } from "@/lib/gaming-data"
import { Clock, AlertCircle, BookOpen, CheckCircle2 } from "lucide-react"

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
  const expiredCodes = getExpiredPromoCodes(game.promoCodes)
  const bestCode = getBestPromoCode(game.promoCodes)
  const schemas = generateGameSchemaMarkup(game, activeCodes)
  const currentMonth = new Date().toLocaleString('default', { month: 'long' })
  const currentYear = new Date().getFullYear()

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

              {/* Title - Keyword optimized H1 */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
                {game.name} Promo Codes {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}
              </h1>

              {/* Subtitle with value proposition */}
              <p className="text-xl text-white/90 font-medium mb-2">
                {activeCodes.length}+ Working Codes - Free Rewards & Bonuses
              </p>

              {/* Description */}
              <p className="text-lg text-white/80 max-w-2xl mb-6 hero-description">
                Get all active {game.name} promo codes and redeem free in-game rewards. All codes verified and updated daily.
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

      {/* Latest Working Codes Today - New Section for SEO */}
      {(() => {
        const today = new Date()
        const recentCodes = activeCodes.filter(code => {
          const addedDate = new Date(code.addedAt)
          const daysDiff = (today.getTime() - addedDate.getTime()) / (1000 * 60 * 60 * 24)
          return daysDiff <= 7
        }).slice(0, 3)
        
        if (recentCodes.length === 0) return null
        
        return (
          <section className="py-10 md:py-12 bg-gradient-to-b from-emerald-500/5 to-transparent border-b border-border">
            <PageContainer>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Flame className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Latest {game.name} Codes Added This Week
                  </h2>
                  <Badge variant="outline" className="mt-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                    New Codes - Working Now
                  </Badge>
                </div>
              </div>
              <p className="text-muted-foreground mb-6 ml-13">
                These codes were added in the last 7 days. Redeem them before they expire!
              </p>
              
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {recentCodes.map((code) => (
                  <PromoCodeCard key={code.id} code={code} />
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Link 
                  href={`/gaming/${game.slug}/codes-today`}
                  className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                >
                  View All Today&apos;s Codes
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </PageContainer>
          </section>
        )
      })()}

      {/* Promo Codes Section */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Tag className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Active {game.name} Promo Codes ({currentMonth} {currentYear})
            </h2>
          </div>
          <p className="text-muted-foreground mb-6 ml-13">
            All {activeCodes.length} working codes verified and tested. Copy any code below and redeem it in-game for free rewards.
          </p>

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

      {/* How to Redeem Section - SEO Content */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                How to Redeem {game.name} Codes
              </h2>
            </div>

            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p className="text-base leading-relaxed mb-4">
                Redeeming promo codes in {game.name} is quick and easy. Follow these simple steps to claim your free rewards:
              </p>
              
              <div className="grid gap-4 md:grid-cols-2 mb-6">
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white font-bold text-sm">1</div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Copy the Code</h4>
                        <p className="text-sm text-muted-foreground">Click on any code above to copy it to your clipboard automatically.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white font-bold text-sm">2</div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Open {game.shortName || game.name}</h4>
                        <p className="text-sm text-muted-foreground">Launch the game and navigate to the Settings or Redeem Code section.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white font-bold text-sm">3</div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Paste & Redeem</h4>
                        <p className="text-sm text-muted-foreground">Paste the code in the redemption field and tap Confirm to claim your rewards.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500 text-white font-bold text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Check Your Inbox</h4>
                        <p className="text-sm text-muted-foreground">Rewards are usually sent to your in-game mailbox within seconds.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Important Tips</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Codes are case-sensitive - enter them exactly as shown</li>
                      <li>Each code can only be redeemed once per account</li>
                      <li>Some codes expire quickly - redeem them as soon as possible</li>
                      <li>Make sure you&apos;re logged into the correct account</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Best Rewards You Can Get - Scannable List for SEO */}
      {activeCodes.length > 0 && (
        <section className="py-10 md:py-12 bg-gradient-to-b from-amber-500/5 to-transparent">
          <PageContainer>
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <Trophy className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Best {game.name} Rewards You Can Get Right Now
                  </h2>
                  <p className="text-sm text-muted-foreground">From current working codes</p>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <ul className="space-y-3">
                  {sortPromoCodesByValue(activeCodes).slice(0, 8).map((code) => (
                    <li key={code.id} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/10 mt-0.5">
                        <Gift className="h-3.5 w-3.5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-foreground">{code.reward}</span>
                        <span className="text-muted-foreground"> - Use code </span>
                        <code className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono text-primary">{code.code}</code>
                      </div>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {activeCodes.length} total codes available
                  </p>
                  <Link 
                    href={`/gaming/${game.slug}/rewards`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    View All Free Rewards
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </PageContainer>
        </section>
      )}

      {/* Rewards Section */}
      {game.rewards.length > 0 && (
        <section className="py-10 md:py-12">
          <PageContainer>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <Gift className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {game.name} Free Rewards & Bonuses
              </h2>
            </div>
            <p className="text-muted-foreground mb-6 ml-13">
              Beyond promo codes, here are other ways to get free rewards in {game.name}.
            </p>

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

      {/* Expired Codes Section */}
      {expiredCodes.length > 0 && (
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Expired {game.name} Codes
                </h2>
              </div>
              <p className="text-muted-foreground mb-6 ml-13">
                These codes have expired and no longer work. We keep them listed for reference.
              </p>

              <div className="space-y-2">
                {expiredCodes.slice(0, 10).map((code) => (
                  <div 
                    key={code.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <code className="font-mono text-sm text-muted-foreground line-through">
                        {code.code}
                      </code>
                      <span className="text-sm text-muted-foreground">
                        {code.reward}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30">
                      Expired
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </PageContainer>
        </section>
      )}

      {/* About Game Section - Additional SEO Content */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              About {game.name}
            </h2>
            <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
              <p className="text-base leading-relaxed">
                {game.description}
              </p>
              <p className="text-base leading-relaxed">
                {game.name} is developed by {game.developer} and published by {game.publisher}. 
                The game is available on {game.platforms.join(', ')} and has been downloaded by {game.playerCount || 'millions of players'} worldwide.
                {game.categories.length > 0 && ` It falls under the ${game.categories.join(', ')} game categories.`}
              </p>
              <p className="text-base leading-relaxed">
                We update our {game.name} promo codes list multiple times per day to ensure you always have access to the latest working codes. 
                Bookmark this page and check back regularly for new codes and exclusive rewards.
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-4 rounded-lg bg-background border border-border">
                <div className="text-2xl font-bold text-primary">{activeCodes.length}</div>
                <div className="text-sm text-muted-foreground">Active Codes</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-background border border-border">
                <div className="text-2xl font-bold text-green-600">{game.rewards.length}</div>
                <div className="text-sm text-muted-foreground">Free Rewards</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-background border border-border">
                <div className="text-2xl font-bold text-blue-600">{game.platforms.length}</div>
                <div className="text-sm text-muted-foreground">Platforms</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-background border border-border">
                <div className="text-2xl font-bold text-amber-600">{expiredCodes.length}</div>
                <div className="text-sm text-muted-foreground">Expired Codes</div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Related Games */}
      {relatedGames.length > 0 && (
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Star className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                More Games with Promo Codes
              </h2>
            </div>
            <p className="text-muted-foreground mb-6 ml-13">
              Like {game.shortName || game.name}? Check out these similar games with active promo codes.
            </p>

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

      {/* Category Links & Popular Games - Internal Linking for SEO */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          {/* Popular Games Internal Links */}
          <h3 className="text-xl font-bold text-foreground mb-4">
            More Popular Game Codes
          </h3>
          <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-8">
            {[
              { href: '/gaming/genshin-impact', label: 'Genshin Impact' },
              { href: '/gaming/raid-shadow-legends', label: 'RAID Shadow Legends' },
              { href: '/gaming/fortnite', label: 'Fortnite' },
              { href: '/gaming/roblox', label: 'Roblox' },
              { href: '/gaming/call-of-duty-mobile', label: 'COD Mobile' },
              { href: '/gaming/honkai-star-rail', label: 'Honkai Star Rail' },
            ].filter(link => !link.href.includes(game.slug)).slice(0, 6).map((gameLink) => (
              <Link
                key={gameLink.href}
                href={gameLink.href}
                className="flex items-center gap-2 p-3 rounded-lg border border-border bg-background hover:border-green-500/50 hover:bg-green-500/5 text-sm font-medium text-foreground transition-colors"
              >
                <Gamepad2 className="h-4 w-4 text-green-600 shrink-0" />
                <span className="truncate">{gameLink.label} Codes</span>
              </Link>
            ))}
          </div>

          {/* Hub Links */}
          <h4 className="text-lg font-semibold text-foreground mb-3">
            Explore Gaming Deals
          </h4>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/gaming"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium text-foreground transition-colors"
            >
              <Gamepad2 className="h-4 w-4" />
              All Games
            </Link>
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
