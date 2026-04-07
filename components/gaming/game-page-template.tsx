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
  Play,
  ShieldCheck,
  Sparkles
} from "lucide-react"
import { PageContainer } from "@/components/layout/page-container"
import { PromoCodeCard } from "@/components/gaming/promo-code-card"
import { StickyGameCTA } from "@/components/gaming/sticky-game-cta"
import { ExitIntentPopup } from "@/components/gaming/exit-intent-popup"
import { GameHeroImage } from "@/components/gaming/game-hero-image"
import { GameSectionImage } from "@/components/gaming/game-section-image"
import { CopyCodeButton, CopyProvider, PostCopyStickyBar } from "@/components/gaming/copy-code-button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Game, PromoCode, GameReward } from "@/lib/gaming-data"
import { getBestPromoCode, getActivePromoCodes, getExpiredPromoCodes, sortPromoCodesByValue, getGameLogoUrl, getGameCtaInfo, hasGameSpecificAffiliateLinks, getRewardAffiliateUrl } from "@/lib/gaming-data"
import { cn } from "@/lib/utils"
import { getSeoUrl } from "@/lib/seo-routes"
import { Clock, AlertCircle, BookOpen, CheckCircle2, ArrowRight, TrendingUp } from "lucide-react"

// Game-specific image configurations
const gameImages: Record<string, {
  hero: string
  rewards: string
  gameplay: string
  characters: string
}> = {
  "raid-shadow-legends": {
    hero: "/images/gaming/raid-hero.jpg",
    rewards: "/images/gaming/raid-rewards.jpg",
    gameplay: "/images/gaming/raid-gameplay.jpg",
    characters: "/images/gaming/raid-characters.jpg",
  },
}

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
  categoryLinks?: InternalLink[]
  pageSlug?: string
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
    dateModified: game.lastUpdated || new Date().toISOString(),
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

function RewardCard({ reward, rewardAffiliateUrl }: { reward: GameReward; rewardAffiliateUrl?: string }) {
  const typeColors: Record<GameReward['type'], string> = {
    'Free': 'bg-green-500/10 text-green-600',
    'New Player': 'bg-primary/10 text-primary',
    'Daily': 'bg-blue-500/10 text-blue-600',
    'Event': 'bg-amber-500/10 text-amber-600',
    'Referral': 'bg-pink-500/10 text-pink-600',
    'Achievement': 'bg-purple-500/10 text-purple-600',
  }

  // Use reward-specific link if available, otherwise use affiliate fallback
  const ctaLink = reward.link || rewardAffiliateUrl || '#'

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
        {/* CTA - always shows with fallback monetization */}
        <Button 
          asChild 
          size="sm"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.01] transition-all"
        >
          <a 
            href={ctaLink} 
            target="_blank"
            rel="nofollow sponsored noopener"
          >
            <Gift className="h-4 w-4 mr-2" />
            View Rewards
            <ExternalLink className="h-3 w-3 ml-2" />
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
  categoryLinks = [],
  pageSlug
}: GamePageTemplateProps) {
  const activeCodes = sortPromoCodesByValue(getActivePromoCodes(game.promoCodes))
  const expiredCodes = getExpiredPromoCodes(game.promoCodes)
  const bestCode = getBestPromoCode(game.promoCodes)
  const schemas = generateGameSchemaMarkup(game, activeCodes)
  const currentMonth = new Date().toLocaleString('default', { month: 'long' })
  const currentYear = new Date().getFullYear()
  
  // Get game CTA info (affiliate vs official link)
  const ctaInfo = getGameCtaInfo(game)
  
  // Get game-specific images if available
  const images = gameImages[game.slug]

  return (
    <CopyProvider>
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

      {/* Intent Match Block - Compact on mobile */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 md:py-4">
        <PageContainer>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 md:gap-2 min-w-0">
              <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-green-200 shrink-0" />
              <span className="font-bold text-sm md:text-lg truncate">
                {game.shortName || game.name} Codes
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5 md:px-3 md:py-1 text-xs md:text-sm">
                <Tag className="h-3 w-3 md:h-3.5 md:w-3.5" />
                {activeCodes.length}
              </span>
              <span className="hidden sm:flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-sm">
                <Clock className="h-3.5 w-3.5" />
                Updated daily
              </span>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Hero Section - Compact on mobile */}
      <section className="relative bg-gradient-to-br from-primary/90 to-primary text-white py-4 md:py-12 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />
        <PageContainer className="px-4 relative z-10">
          {/* Hero Image - Visual anchor for CRO with high-impact overlay */}
          {images && (
            <div className="mb-4 md:mb-8">
              <GameHeroImage
                src={images.hero}
                alt={`${game.name} working codes ${currentMonth.toLowerCase()} ${currentYear} free rewards`}
                gameName={game.shortName || game.name}
                month={currentMonth}
                year={currentYear}
                codeCount={activeCodes.length}
                showOverlayText={true}
                priority={true}
              />
            </div>
          )}

          {/* Mobile: Compact header with logo + title + CTAs */}
          <div className="md:hidden">
            {/* Game Logo + Title Row */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden ring-2 ring-white/20 shadow-lg bg-white/10">
                {game.logoUrl ? (
                  <Image
                    src={getGameLogoUrl(game)}
                    alt={game.name}
                    width={48}
                    height={48}
                    className="rounded-xl object-cover"
                    priority
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <Gamepad2 className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-bold tracking-tight truncate">
                  {game.shortName || game.name} Codes
                </h1>
                <p className="text-xs text-white/80">
                  {activeCodes.length} codes · {currentMonth} {currentYear}
                </p>
              </div>
            </div>

            {/* Mobile CTAs - Optimized for conversion */}
            <div className="flex flex-col gap-2 mb-4 relative z-20">
              {/* Best Code Signal */}
              {bestCode && ctaInfo.isAffiliate && (
                <div className="flex items-center justify-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span className="text-sm text-white/90">
                    Best code right now: <code className="font-mono font-bold text-amber-300">{bestCode.code}</code>
                  </span>
                </div>
              )}
              
              {/* 1. Primary CTA - Affiliate (biggest, most prominent) */}
              {ctaInfo.isAffiliate && ctaInfo.url && (
                <Button 
                  size="lg" 
                  asChild 
                  className="w-full font-bold shadow-lg text-base h-14 bg-green-500 hover:bg-green-600 text-white"
                >
                  <a 
                    href={ctaInfo.url} 
                    target="_blank"
                    rel={ctaInfo.rel}
                  >
                    <Gift className="h-5 w-5 mr-2" />
                    {ctaInfo.labelShort}
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              )}
              
              {/* Urgency + Trust text (for affiliate) */}
              {ctaInfo.isAffiliate && (
                <div className="text-center space-y-0.5">
                  {ctaInfo.urgencyText && (
                    <p className="text-xs text-amber-300 font-medium">
                      {ctaInfo.urgencyText}
                    </p>
                  )}
                  {ctaInfo.trustText && (
                    <p className="text-xs text-white/60">
                      {ctaInfo.trustText}
                    </p>
                  )}
                </div>
              )}
              
              {/* 2. Secondary row - Official Game first, then Copy Code (lower priority) */}
              <div className="flex gap-2">
                {ctaInfo.isAffiliate && ctaInfo.officialUrl && (
                  <Button 
                    size="sm" 
                    asChild 
                    variant="outline"
                    className="flex-1 font-medium text-sm h-9 bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    <a 
                      href={ctaInfo.officialUrl} 
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Gamepad2 className="h-4 w-4 mr-1.5" />
                      Official Game
                    </a>
                  </Button>
                )}
                {/* 3. Copy Code - smallest, least prominent */}
                {bestCode && (
                  <CopyCodeButton 
                    code={bestCode.code}
                    className="flex-1 bg-white/5 text-white/80 hover:bg-white/10 font-medium text-xs h-9 border border-white/20"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    Copy Code
                  </CopyCodeButton>
                )}
                {/* Non-affiliate: just show Play Free button */}
                {!ctaInfo.isAffiliate && ctaInfo.url && (
                  <Button 
                    size="lg" 
                    asChild 
                    className="flex-1 font-bold shadow-lg text-sm h-11 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <a 
                      href={ctaInfo.url} 
                      target="_blank"
                      rel={ctaInfo.rel}
                    >
                      <Gamepad2 className="h-4 w-4 mr-1.5" />
                      {ctaInfo.label}
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Desktop: Full layout */}
          <div className="hidden md:block">
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
            <div className="flex gap-6 items-start relative z-10">
              {/* Game Logo - Large Visual Anchor */}
              <div className="relative h-28 w-28 shrink-0 rounded-2xl overflow-hidden ring-4 ring-white/20 shadow-2xl bg-white/10">
                {game.logoUrl ? (
                  <Image
                    src={getGameLogoUrl(game)}
                    alt={`${game.name} codes ${currentMonth} ${currentYear} - free rewards`}
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
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
                  {game.name} Promo Codes {currentMonth} {currentYear}
                </h1>

                {/* Subtitle with value proposition */}
                <p className="text-xl text-white/90 font-medium mb-2">
                  {activeCodes.length}+ Working Codes - Free Rewards & Bonuses
                </p>

                {/* Description */}
                <p className="text-lg text-white/80 max-w-2xl mb-6">
                  Get all active {game.name} promo codes and redeem free in-game rewards. All codes verified and updated daily.
                </p>

                {/* Stats + Freshness Signals */}
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                    <Tag className="h-4 w-4" />
                    <span>{activeCodes.length} Active Codes</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                    <Trophy className="h-4 w-4" />
                    <span>{game.rewards.length} Rewards</span>
                  </div>
                  <div className="flex items-center gap-2 bg-green-500/20 text-green-100 rounded-full px-4 py-2 border border-green-400/30">
                    <Calendar className="h-4 w-4" />
                    <span>Updated: {currentMonth} {currentYear}</span>
                  </div>
                </div>
              </div>

              {/* Primary CTA - Desktop */}
              {ctaInfo.url && (
                <div className="shrink-0 flex flex-col gap-3 relative z-20">
                  {/* Best Code Signal */}
                  {bestCode && ctaInfo.isAffiliate && (
                    <div className="flex items-center justify-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                      <Sparkles className="h-4 w-4 text-amber-300" />
                      <span className="text-sm text-white/90">
                        Best code: <code className="font-mono font-bold text-amber-300">{bestCode.code}</code>
                      </span>
                    </div>
                  )}
                  
                  {/* Primary CTA - Affiliate (larger, more prominent) */}
                  <Button 
                    size="lg" 
                    asChild 
                    className={cn(
                      "gap-2 font-bold shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all px-10 py-7 text-lg",
                      ctaInfo.buttonStyle === 'affiliate' 
                        ? "bg-green-500 hover:bg-green-600 text-white" 
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    )}
                  >
                    <a 
                      href={ctaInfo.url} 
                      target="_blank"
                      rel={ctaInfo.rel}
                    >
                      {ctaInfo.isAffiliate ? (
                        <Gift className="h-6 w-6" />
                      ) : (
                        <Gamepad2 className="h-6 w-6" />
                      )}
                      {ctaInfo.label}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  
                  {/* Urgency + Trust text (for affiliate) */}
                  {ctaInfo.isAffiliate && (
                    <div className="text-center space-y-0.5">
                      {ctaInfo.urgencyText && (
                        <p className="text-xs text-amber-300 font-medium">
                          {ctaInfo.urgencyText}
                        </p>
                      )}
                      {ctaInfo.trustText && (
                        <p className="text-xs text-white/60">
                          {ctaInfo.trustText}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* Secondary CTA - Official Game (for affiliate games only) */}
                  {ctaInfo.isAffiliate && ctaInfo.officialUrl && (
                    <Button 
                      size="sm" 
                      asChild 
                      variant="outline"
                      className="gap-2 font-medium bg-white/10 border-white/30 text-white hover:bg-white/20"
                    >
                      <a 
                        href={ctaInfo.officialUrl} 
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Gamepad2 className="h-4 w-4" />
                        Official Game
                      </a>
                    </Button>
                  )}
                  
                  {/* Non-affiliate: show sublabel */}
                  {!ctaInfo.isAffiliate && ctaInfo.sublabel && (
                    <p className="text-xs text-white/70 text-center font-medium">
                      {ctaInfo.sublabel}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Best Codes Section - Above the Fold for Maximum Conversions */}
      {activeCodes.length > 0 && (
        <section className="py-6 md:py-10 border-b border-border bg-gradient-to-b from-primary/5 to-muted/30">
          <PageContainer className="px-4">
            {/* Visual Hook - Compact on mobile */}
            <div className="text-center mb-4 md:mb-8">
              <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1 md:mb-2">
                Claim Your Free Rewards
              </h2>
              <p className="text-sm md:text-lg text-muted-foreground">
                Copy a code below and redeem it in-game
              </p>
            </div>

            <div className="text-center mb-4 md:mb-6">
              <Badge className="bg-primary text-primary-foreground mb-2 md:mb-3 text-xs md:text-sm">
                <Flame className="h-3 w-3 mr-1" />
                Top Codes
              </Badge>
              <h3 className="text-lg md:text-xl font-bold text-foreground">
                Best Codes ({currentMonth} {currentYear})
              </h3>
              <p className="text-xs md:text-sm text-amber-600 mt-1 flex items-center justify-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Codes expire without notice
              </p>
            </div>
            
            {/* Top 3 Best Codes */}
            <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
              {sortPromoCodesByValue(activeCodes).slice(0, 3).map((code, index) => (
                <Card key={code.id} className={cn(
                  "relative overflow-hidden border-2 transition-all hover:shadow-xl",
                  index === 0 && "border-primary/50 bg-gradient-to-br from-primary/10 to-secondary/5",
                  index === 1 && "border-secondary/50 bg-secondary/5",
                  index === 2 && "border-amber-500/50 bg-amber-500/5"
                )}>
                  <CardContent className="p-5">
                    {/* Rank Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge className={cn(
                        "text-xs",
                        index === 0 && "bg-green-600 text-white",
                        index === 1 && "bg-secondary text-secondary-foreground",
                        index === 2 && "bg-amber-500 text-white"
                      )}>
                        {index === 0 ? (
                          <><Trophy className="h-3 w-3 mr-1" />#1 Recommended</>
                        ) : (
                          `#${index + 1} Best`
                        )}
                      </Badge>
                    </div>
                    
                    {/* Verification + Urgency */}
                    <div className="flex items-center gap-2 mb-3">
                      {code.isVerified && (
                        <Badge variant="outline" className="text-green-600 border-green-500/50 bg-green-500/10 text-xs">
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          Verified Working
                        </Badge>
                      )}
                      {code.isExclusive && (
                        <Badge className="bg-purple-500/20 text-purple-600 border-0 text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          New Players
                        </Badge>
                      )}
                    </div>
                    
                    {/* Reward */}
                    <p className="font-bold text-foreground text-lg mb-3">
                      {code.reward}
                    </p>
                    
                    {/* Code Box */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex-1 flex items-center gap-2 border-2 border-dashed border-primary/40 rounded-lg px-3 py-2.5 bg-background">
                        <Gift className="h-4 w-4 text-primary" />
                        <code className="font-mono font-bold text-primary text-lg">
                          {code.code}
                        </code>
                      </div>
                    </div>
                    
                    {/* CTA */}
                    {ctaInfo.url && (
                      <Button 
                        asChild 
                        className={cn(
                          "w-full h-12 font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all",
                          ctaInfo.buttonStyle === 'affiliate' 
                            ? "bg-green-600 hover:bg-green-700 text-white" 
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        )}
                      >
                        <a 
                          href={ctaInfo.url} 
                          target="_blank"
                          rel={ctaInfo.rel}
                        >
                          {ctaInfo.isAffiliate ? (
                            <Gift className="h-5 w-5 mr-2" />
                          ) : (
                            <Gamepad2 className="h-5 w-5 mr-2" />
                          )}
                          {ctaInfo.label}
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                    )}
                    
                    {/* Urgency + Trust text for affiliate */}
                    {ctaInfo.isAffiliate && (
                      <div className="text-center mt-2 space-y-0.5">
                        {ctaInfo.urgencyText && (
                          <p className="text-xs text-amber-600 font-medium">
                            {ctaInfo.urgencyText}
                          </p>
                        )}
                        {ctaInfo.trustText && (
                          <p className="text-xs text-muted-foreground">
                            {ctaInfo.trustText}
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Value Block - What You Get */}
            <div className="mt-8 max-w-2xl mx-auto">
              <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
                <CardContent className="p-5">
                  <h3 className="font-bold text-foreground text-center mb-4">
                    What you get with these codes:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Gift className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-foreground">Free Champions</p>
                      <p className="text-xs text-muted-foreground">Worth $20+ value</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <Star className="h-5 w-5 text-amber-500" />
                      </div>
                      <p className="text-sm font-medium text-foreground">Silver Rewards</p>
                      <p className="text-xs text-muted-foreground">In-game currency</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-blue-500" />
                      </div>
                      <p className="text-sm font-medium text-foreground">Energy Boosts</p>
                      <p className="text-xs text-muted-foreground">Play more, progress faster</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA Block - Want More Rewards? */}
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h4 className="font-bold text-foreground text-lg">Want more rewards?</h4>
                  <p className="text-muted-foreground text-sm">Unlock more in-game items with exclusive deals</p>
                </div>
                <Link
                  href="/deals"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors shrink-0"
                >
                  <Gift className="h-5 w-5" />
                  Browse All Deals
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
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
                  <PromoCodeCard 
                    key={code.id} 
                    code={code}
showAffiliateCTA={!!ctaInfo.url}
                affiliateUrl={ctaInfo.url || ''}
                affiliateLabel={ctaInfo.isAffiliate ? `Play ${game.shortName || game.name} & Redeem` : `Play ${game.shortName || game.name}`}
                affiliateRel={ctaInfo.rel}
                  />
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Link 
                  href={getSeoUrl(game.slug, 'codes')}
                  className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                >
                  View All Codes
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

          {/* Regular Codes (non-exclusive) */}
          {(() => {
            const regularCodes = activeCodes.filter(code => !code.isExclusive)
            const exclusiveCodes = activeCodes.filter(code => code.isExclusive)
            
            return (
              <>
                {regularCodes.length > 0 ? (
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-10">
                    {regularCodes.map((code) => (
                      <PromoCodeCard 
                        key={code.id} 
                        code={code}
                        showAffiliateCTA={!!ctaInfo.url}
                        affiliateUrl={ctaInfo.url || ''}
                        affiliateLabel={ctaInfo.isAffiliate ? `Play ${game.shortName || game.name} & Redeem` : `Play ${game.shortName || game.name}`}
                        affiliateRel={ctaInfo.rel}
                      />
                    ))}
                  </div>
                ) : activeCodes.length === 0 ? (
                  <Card className="border-dashed mb-10">
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
                ) : null}

                {/* New Player / Exclusive Codes Section */}
                {exclusiveCodes.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-border">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                        <Zap className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">
                          New Player Codes
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          For accounts under 7 days old - Choose your best code!
                        </p>
                      </div>
                    </div>
                    
                    {/* Warning Banner */}
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-amber-700 mb-1">Important: You Can Only Use ONE New Player Code</h4>
                          <p className="text-sm text-amber-700/80">
                            New player codes are exclusive - once you redeem one, you cannot use another. 
                            Choose wisely! We recommend codes that give Legendary champions.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Best New Player Code Highlight */}
                    {(() => {
                      const bestNewPlayerCode = sortPromoCodesByValue(exclusiveCodes)[0]
                      if (!bestNewPlayerCode) return null
                      
                      return (
                        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-xl p-5 mb-6">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className="bg-purple-600 text-white">
                              <Star className="h-3 w-3 mr-1" />
                              Best New Player Code
                            </Badge>
                            <Badge variant="outline" className="text-green-600 border-green-500/50">
                              <ShieldCheck className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          </div>
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex-1">
                              <p className="font-bold text-xl text-foreground mb-2">
                                {bestNewPlayerCode.reward}
                              </p>
                              <div className="flex items-center gap-2 border-2 border-dashed border-purple-500/40 rounded-lg px-4 py-2.5 bg-background w-fit">
                                <Gift className="h-5 w-5 text-purple-600" />
                                <code className="font-mono font-bold text-purple-600 text-xl">
                                  {bestNewPlayerCode.code}
                                </code>
                              </div>
                            </div>
                            {ctaInfo.url && (
                              <Button 
                                asChild 
                                size="lg"
                                className={cn(
                                  "h-12 font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all",
                                  ctaInfo.buttonStyle === 'affiliate' 
                                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                                )}
                              >
                                <a 
                                  href={ctaInfo.url} 
                                  target="_blank"
                                  rel={ctaInfo.rel}
                                >
                                  {ctaInfo.isAffiliate ? (
                                    <Play className="h-5 w-5 mr-2 fill-current" />
                                  ) : (
                                    <Gamepad2 className="h-5 w-5 mr-2" />
                                  )}
                                  {ctaInfo.isAffiliate ? 'Play & Get Legendary Champion' : 'Play Free'}
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })()}
                    
                    {/* Other New Player Codes */}
                    <p className="text-sm font-medium text-muted-foreground mb-4">Other new player codes:</p>
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      {exclusiveCodes.slice(1).map((code) => (
                        <PromoCodeCard 
                          key={code.id} 
                          code={code}
                          showAffiliateCTA={!!ctaInfo.url}
                          affiliateUrl={ctaInfo.url || ''}
                          affiliateLabel={ctaInfo.isAffiliate ? `Play ${game.shortName || game.name} & Redeem` : `Play ${game.shortName || game.name}`}
                          affiliateRel={ctaInfo.rel}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )
          })()}
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

      {/* Visual CRO: Rewards, Gameplay, Characters Images */}
      {images && (
        <section className="py-10 bg-muted/30">
          <PageContainer>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                What You Can Get in {game.shortName || game.name}
              </h2>
              <p className="text-muted-foreground">
                Redeem codes to unlock these rewards and bonuses
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              <GameSectionImage
                src={images.rewards}
                alt={`${game.name} free rewards - silver, champions, energy`}
                badge="free-rewards"
                title="Silver, Energy & More"
              />
              <GameSectionImage
                src={images.gameplay}
                alt={`${game.name} gameplay and battle system`}
                badge="gameplay"
                title="Turn-Based Combat"
              />
              <GameSectionImage
                src={images.characters}
                alt={`${game.name} champions and characters collection`}
                badge="characters"
                title="800+ Champions"
              />
            </div>
            
            {/* New Player CTA */}
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <Badge className="bg-purple-600 text-white mb-2">
                    <Sparkles className="h-3 w-3 mr-1" />
                    New Player Bonuses
                  </Badge>
                  <h3 className="font-bold text-foreground text-lg">First time playing {game.shortName || game.name}?</h3>
                  <p className="text-muted-foreground text-sm">Use code GOFAST or MONKEYKING for a free Legendary champion</p>
                </div>
                {ctaInfo.url && (
                  <Button 
                    asChild 
                    className={cn(
                      "font-semibold shrink-0",
                      ctaInfo.isAffiliate 
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    )}
                  >
                    <a 
                      href={ctaInfo.url} 
                      target="_blank"
                      rel={ctaInfo.rel}
                    >
                      {ctaInfo.isAffiliate ? (
                        <Play className="h-4 w-4 mr-2 fill-current" />
                      ) : (
                        <Gamepad2 className="h-4 w-4 mr-2" />
                      )}
                      {ctaInfo.isAffiliate ? 'Start Playing Free' : 'Play Free'}
                    </a>
                  </Button>
                )}
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
                  rewardAffiliateUrl={getRewardAffiliateUrl(game) || undefined}
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

      {/* Deals Cross-Link Section - Internal Linking for SEO + Monetization */}
      <section className="py-8 border-t border-border bg-gradient-to-r from-primary/5 to-secondary/5">
        <PageContainer>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-xl border border-primary/20 bg-card">
            <div>
              <h3 className="text-lg font-bold text-foreground">Looking for real savings?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Check the latest deals and discounts available now.
              </p>
            </div>
            <Button asChild variant="default" className="shrink-0">
              <Link href="/deals">
                See All Deals
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
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
                  const relatedCtaInfo = getGameCtaInfo(relatedGame)
                
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
                            alt={`${relatedGame.name} codes ${currentMonth} ${currentYear}`}
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
                    {relatedCtaInfo.url ? (
                      <Button 
                        asChild 
                        size="sm"
                        className={cn(
                          "w-full font-semibold shadow-sm hover:shadow-md hover:scale-[1.01] transition-all",
                          relatedCtaInfo.buttonStyle === 'affiliate' 
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        )}
                      >
                        <a 
                          href={relatedCtaInfo.url} 
                          target="_blank"
                          rel={relatedCtaInfo.rel}
                        >
                          {relatedCtaInfo.isAffiliate ? (
                            <Play className="h-4 w-4 mr-1 fill-current" />
                          ) : (
                            <Gamepad2 className="h-4 w-4 mr-1" />
                          )}
                          {relatedCtaInfo.label}
                        </a>
                      </Button>
                    ) : (
                      <Button 
                        asChild 
                        size="sm"
                        variant="outline"
                        className="w-full font-semibold"
                      >
                        <Link href={`/gaming/${relatedGame.slug}`}>
                          <Tag className="h-4 w-4 mr-1" />
                          View Codes
                        </Link>
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          </PageContainer>
        </section>
      )}

      {/* More Ways to Get Rewards - PRIMARY MONETIZATION SECTION */}
      <section className="py-10 md:py-12 bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-b border-border">
        <PageContainer>
          <div className="text-center mb-8">
            <Badge className="bg-green-600 text-white mb-3">
              <Gift className="h-3 w-3 mr-1" />
              More Free Rewards
            </Badge>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              More Ways to Get {game.shortName || game.name} Rewards
            </h3>
            <p className="text-muted-foreground">
              Don&apos;t stop here — discover more ways to earn free items
            </p>
          </div>
          
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 max-w-3xl mx-auto">
            {/* Primary: Deals Page */}
            <Link
              href="/deals"
              className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/10 hover:border-green-500/50 hover:shadow-lg transition-all text-center"
            >
              <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center">
                <Tag className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-foreground">Best Deals & Bonuses</p>
                <p className="text-sm text-muted-foreground">Exclusive offers & savings</p>
              </div>
              <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                Browse Deals <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            
            {/* Secondary: Free Rewards */}
            <Link
              href={`/gaming/${game.slug}/free-rewards`}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all text-center"
            >
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Gift className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="font-bold text-foreground">Get More Free Rewards</p>
                <p className="text-sm text-muted-foreground">Additional free items</p>
              </div>
              <span className="text-primary text-sm font-medium flex items-center gap-1">
                View Rewards <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            
            {/* Tertiary: Redeem Guide */}
            <Link
              href={`/gaming/${game.slug}/redeem-codes`}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all text-center"
            >
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-foreground">How to Redeem Codes</p>
                <p className="text-sm text-muted-foreground">Step-by-step guide</p>
              </div>
              <span className="text-primary text-sm font-medium flex items-center gap-1">
                Read Guide <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* Game Guides - Internal Linking for SEO */}
      <section className="py-10 md:py-12 border-b border-border">
        <PageContainer>
          <h3 className="text-xl font-bold text-foreground mb-2">
            More {game.shortName || game.name} Guides
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            Learn more about {game.shortName || game.name} with our helpful guides
          </p>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href={getSeoUrl(game.slug, 'redeem-codes')}
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">How to Redeem Codes</p>
                <p className="text-xs text-muted-foreground">Step-by-step guide</p>
              </div>
            </Link>
            <Link
              href={`/gaming/${game.slug}`}
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all"
            >
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                <Gift className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{game.shortName || game.name} Rewards</p>
                <p className="text-xs text-muted-foreground">All free rewards</p>
              </div>
            </Link>
            <Link
              href={`/gaming/${game.slug}`}
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all"
            >
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Beginner Guide</p>
                <p className="text-xs text-muted-foreground">Tips for new players</p>
              </div>
            </Link>
            <Link
              href={`/gaming/${game.slug}`}
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all"
            >
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                <Trophy className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Leveling Tips</p>
                <p className="text-xs text-muted-foreground">Progress faster</p>
              </div>
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* Popular Games - Top Internal Linking for SEO */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          {/* Popular Games - Hardcoded top performers */}
          <h3 className="text-xl font-bold text-foreground mb-4">
            Popular Games
          </h3>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-5 mb-8">
            {[
              { slug: 'raid-shadow-legends', name: 'RAID' },
              { slug: 'monopoly-go', name: 'Monopoly GO' },
              { slug: 'brawl-stars', name: 'Brawl Stars' },
              { slug: 'afk-arena', name: 'AFK Arena' },
              { slug: 'roblox', name: 'Roblox' },
            ].filter(g => g.slug !== game.slug).map((topGame) => (
              <Link
                key={topGame.slug}
                href={`/gaming/${topGame.slug}`}
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary/50 hover:shadow-md text-sm font-medium text-foreground transition-all"
              >
                <Gamepad2 className="h-5 w-5 text-primary shrink-0" />
                <span>{topGame.name} Codes</span>
              </Link>
            ))}
          </div>

          {/* Latest Guides */}
          <h3 className="text-xl font-bold text-foreground mb-4">
            Latest Guides
          </h3>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-3 mb-8">
            <Link
              href={`/gaming/${game.slug}-guide`}
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all"
            >
              <BookOpen className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="font-medium text-foreground text-sm">{game.shortName || game.name} Guide</p>
                <p className="text-xs text-muted-foreground">Beginner friendly</p>
              </div>
            </Link>
            <Link
              href={`/gaming/${game.slug}-tips`}
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all"
            >
              <Star className="h-5 w-5 text-amber-500 shrink-0" />
              <div>
                <p className="font-medium text-foreground text-sm">{game.shortName || game.name} Tips</p>
                <p className="text-xs text-muted-foreground">Pro strategies</p>
              </div>
            </Link>
            <Link
              href={`/gaming/${game.slug}-leveling`}
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all"
            >
              <TrendingUp className="h-5 w-5 text-green-600 shrink-0" />
              <div>
                <p className="font-medium text-foreground text-sm">{game.shortName || game.name} Leveling</p>
                <p className="text-xs text-muted-foreground">Progress faster</p>
              </div>
            </Link>
          </div>

          {/* Related Games */}
          {relatedGames.length > 0 && (
            <>
              <h4 className="text-lg font-semibold text-foreground mb-3">
                Similar Games
              </h4>
              <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-8">
                {relatedGames.slice(0, 6).map((relatedGame) => (
                  <Link
                    key={relatedGame.slug}
                    href={`/gaming/${relatedGame.slug}`}
                    className="flex items-center gap-2 p-3 rounded-lg border border-border bg-background hover:border-green-500/50 hover:bg-green-500/5 text-sm font-medium text-foreground transition-colors"
                  >
                    <Gamepad2 className="h-4 w-4 text-green-600 shrink-0" />
                    <span className="truncate">{relatedGame.shortName || relatedGame.name}</span>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Hub Links */}
          <h4 className="text-lg font-semibold text-foreground mb-3">
            Explore More
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
              href="/gaming/best-codes"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border hover:border-primary/50 text-sm font-medium text-foreground transition-colors"
            >
              <Trophy className="h-4 w-4" />
              Best Codes
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

          {/* Global Monetization CTA */}
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-foreground text-lg">Want to save money?</h4>
                <p className="text-muted-foreground text-sm">Discover deals, discounts & cashback on products you love</p>
              </div>
              <Link
                href="/deals"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-colors shrink-0"
              >
                <Gift className="h-5 w-5" />
                Browse All Deals
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Sticky CTA - Mobile & Desktop */}
      {ctaInfo.url && (
        <StickyGameCTA
          gameName={game.shortName || game.name}
          affiliateUrl={ctaInfo.url}
          ctaLabel={ctaInfo.label}
          ctaRel={ctaInfo.rel}
          isAffiliate={ctaInfo.isAffiliate}
          trustText={ctaInfo.trustText}
          urgencyText={ctaInfo.urgencyText}
        />
      )}

      {/* Exit Intent Popup */}
      {bestCode && ctaInfo.url && (
        <ExitIntentPopup
          gameName={game.name}
          gameShortName={game.shortName}
          affiliateUrl={ctaInfo.url}
          bestCode={bestCode.code}
          bestCodeReward={bestCode.reward}
          ctaLabel={ctaInfo.label}
          ctaRel={ctaInfo.rel}
          isAffiliate={ctaInfo.isAffiliate}
          trustText={ctaInfo.trustText}
          urgencyText={ctaInfo.urgencyText}
        />
      )}
      
      {/* Post-Copy Sticky Bar - appears after user copies a code */}
      {ctaInfo.isAffiliate && ctaInfo.url && (
        <PostCopyStickyBar
          gameName={game.shortName || game.name}
          affiliateUrl={ctaInfo.url}
          ctaRel={ctaInfo.rel}
          isAffiliate={ctaInfo.isAffiliate}
        />
      )}
    </main>
    </CopyProvider>
  )
}
