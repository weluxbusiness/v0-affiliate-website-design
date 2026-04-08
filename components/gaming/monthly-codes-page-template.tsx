"use client"

import Link from "next/link"
import { useState, useCallback } from "react"
import { 
  Gift, 
  Tag,
  Trophy,
  Star,
  Flame,
  Play,
  ShieldCheck,
  Sparkles,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Clock,
  Gamepad2,
  BookOpen,
  Copy,
  Check,
  ExternalLink,
  Zap,
  Crown
} from "lucide-react"
import { PageContainer } from "@/components/layout/page-container"
import { PromoCodeCard } from "@/components/gaming/promo-code-card"
import { StickyGameCTA } from "@/components/gaming/sticky-game-cta"
import { CopyProvider, PostCopyStickyBar, useCopyContext } from "@/components/gaming/copy-code-button"
import { ExitIntentPopup } from "@/components/gaming/exit-intent-popup"
import { GameHeroImage } from "@/components/gaming/game-hero-image"
import { GameSectionImage } from "@/components/gaming/game-section-image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Game, PromoCode } from "@/lib/gaming-data"
import { getActivePromoCodes, sortPromoCodesByValue, getGameCtaInfo } from "@/lib/gaming-data"

// Game-specific image configurations for SEO and CRO
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

interface MonthlyCodesPageTemplateProps {
  game: Game
  month: string
  year: number
  relatedGames: Game[]
}

// Above-the-Fold Best Code CTA Block Component
function BestCodeCTABlock({ 
  game, 
  bestCode, 
  month, 
  year, 
  ctaInfo 
}: { 
  game: Game
  bestCode: PromoCode
  month: string
  year: number
  ctaInfo: ReturnType<typeof getGameCtaInfo>
}) {
  const [copied, setCopied] = useState(false)
  const copyContext = useCopyContext()
  
  const handleCopy = useCallback(() => {
    if (copied) return
    navigator.clipboard.writeText(bestCode.code)
    setCopied(true)
    copyContext?.setHasCopied(true, bestCode.code)
    setTimeout(() => setCopied(false), 5000)
  }, [bestCode.code, copied, copyContext])

  return (
    <section className="py-6 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-yellow-500/10 border-b-2 border-amber-500/30">
      <PageContainer>
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-4">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white mb-2 px-3 py-1">
              <Crown className="h-3 w-3 mr-1" />
              Best Code Right Now
            </Badge>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              Working {game.shortName || game.name} Codes ({month} {year})
            </h2>
          </div>

          {/* Best Code Card */}
          <Card className="border-2 border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-orange-500/5 shadow-lg overflow-hidden">
            <CardContent className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Code Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-600 text-white text-xs">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Verified Working
                    </Badge>
                    <Badge variant="outline" className="text-amber-600 border-amber-500/50 text-xs">
                      <Flame className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                  <p className="font-bold text-foreground text-lg mb-2">{bestCode.reward}</p>
                  
                  {/* Code Box + Copy */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-2 border-2 border-dashed border-amber-500/50 rounded-lg px-4 py-3 bg-background">
                      <Gift className="h-5 w-5 text-amber-600" />
                      <code className="font-mono font-bold text-amber-600 text-lg tracking-wide">
                        {bestCode.code}
                      </code>
                    </div>
                    <Button 
                      onClick={handleCopy}
                      variant={copied ? "default" : "outline"}
                      className={copied 
                        ? "bg-green-600 hover:bg-green-600 text-white shrink-0 h-12 px-5" 
                        : "shrink-0 h-12 px-5 border-amber-500/50 hover:bg-amber-500/10"
                      }
                    >
                      {copied ? (
                        <><Check className="h-4 w-4 mr-2" /> Copied!</>
                      ) : (
                        <><Copy className="h-4 w-4 mr-2" /> Copy Code</>
                      )}
                    </Button>
                  </div>
                </div>

                {/* CTA */}
                {ctaInfo.url && (
                  <div className="flex flex-col gap-2 lg:w-auto">
                    <Button 
                      asChild 
                      size="lg"
                      className="h-14 px-8 font-bold text-base bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                    >
                      <a href={ctaInfo.url} target="_blank" rel={ctaInfo.rel}>
                        {ctaInfo.isAffiliate ? <Gift className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2 fill-current" />}
                        {ctaInfo.isAffiliate ? "Claim FREE Rewards" : "Play & Redeem"}
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                    {/* Micro Trust Signals */}
                    <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                        No signup
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3 text-amber-500" />
                        30 seconds
                      </span>
                      <span className="flex items-center gap-1">
                        <Gamepad2 className="h-3 w-3 text-blue-500" />
                        iOS & Android
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Post-copy step indicator */}
              {copied && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg animate-in fade-in slide-in-from-top-2">
                  <p className="text-sm text-green-700 font-medium flex items-center gap-2">
                    <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs font-bold">Step 1/2</span>
                    Code copied! Now open the game to redeem it.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </section>
  )
}

export function MonthlyCodesPageTemplate({ 
  game, 
  month, 
  year,
  relatedGames 
}: MonthlyCodesPageTemplateProps) {
  const activeCodes = getActivePromoCodes(game.promoCodes)
  const sortedCodes = sortPromoCodesByValue(activeCodes)
  const lastUpdated = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  })
  
  // Get game-specific images if available
  const images = gameImages[game.slug]
  
  // Get CTA info with fallback logic (affiliate > official > null)
  const ctaInfo = getGameCtaInfo(game)
  
  // Get best code for exit popup
  const bestCode = sortedCodes[0]

  return (
    <CopyProvider>
      {/* Trust Banner with Freshness Signals */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3">
        <PageContainer>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            {/* Updated Today Badge - SEO Freshness Signal */}
            <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full font-bold">
              <CheckCircle2 className="h-4 w-4" />
              Updated Today
            </span>
            <span className="flex items-center gap-1.5">
              <strong>{activeCodes.length} Working Codes</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              Last updated: {lastUpdated}
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              Codes Tested Daily
            </span>
          </div>
        </PageContainer>
      </section>

      {/* ABOVE-THE-FOLD: Best Code CTA Block */}
      {bestCode && (
        <BestCodeCTABlock
          game={game}
          bestCode={bestCode}
          month={month}
          year={year}
          ctaInfo={ctaInfo}
        />
      )}

      {/* Hero Section with Featured Image */}
      <section className="relative bg-gradient-to-br from-primary/90 to-primary text-white py-8 md:py-12">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <PageContainer>
          {/* Hero Image - High-converting visual */}
          {images && (
            <div className="mb-8">
              <GameHeroImage
                src={images.hero}
                alt={`${game.name} codes ${month.toLowerCase()} ${year} - free rewards and working promo codes`}
                title={`Working Codes ${month} ${year}`}
                badge="Working Codes"
                showUpdatedBadge={true}
                priority={true}
              />
            </div>
          )}
          
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="bg-white/20 text-white mb-4">
              <Flame className="h-3 w-3 mr-1" />
              {month} {year} Codes
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {game.shortName || game.name} Codes ({month} {year})
            </h1>
            <p className="text-lg text-white/90 mb-6">
              All {activeCodes.length}+ working {game.name} promo codes for {month} {year}. 
              Get free rewards, bonuses & in-game items. Updated daily.
            </p>
            
            {/* Last Updated */}
            <p className="text-sm text-white/70 mb-6">
              <Clock className="h-4 w-4 inline mr-1" />
              Last updated: {lastUpdated}
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Gift className="h-3 w-3 mr-1" />
                {activeCodes.length} Active Codes
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <ShieldCheck className="h-3 w-3 mr-1" />
                Working Codes Only
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Star className="h-3 w-3 mr-1" />
                Free Rewards
              </Badge>
            </div>
          </div>
        </PageContainer>
      </section>

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
            
            {/* New Player CTA - Enhanced */}
            <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 shadow-lg relative overflow-hidden">
              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full" />
              
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
                <div className="text-center lg:text-left flex-1">
                  <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-start mb-3">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1">
                      <Crown className="h-3 w-3 mr-1" />
                      Best New Player Code
                    </Badge>
                    <Badge variant="outline" className="text-green-600 border-green-500/50">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  <h3 className="font-bold text-foreground text-xl mb-2">First time playing {game.shortName || game.name}?</h3>
                  <p className="text-muted-foreground mb-3">Start with a free Legendary champion to boost your progress!</p>
                  
                  {/* Featured new player code */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                    <Gift className="h-4 w-4 text-purple-600" />
                    <code className="font-mono font-bold text-purple-600 text-lg">GOFAST</code>
                    <span className="text-sm text-muted-foreground">or</span>
                    <code className="font-mono font-bold text-purple-600 text-lg">MONKEYKING</code>
                  </div>
                </div>
                
                {ctaInfo.url && (
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button 
                      asChild 
                      size="lg"
                      className="h-14 px-8 font-bold text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                    >
                      <a 
                        href={ctaInfo.url} 
                        target="_blank"
                        rel={ctaInfo.rel}
                      >
                        {ctaInfo.isAffiliate ? <Gift className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2 fill-current" />}
                        {ctaInfo.isAffiliate ? "Start + Get Rewards" : "Start Playing Free"}
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                    {/* Trust signals */}
                    <p className="text-xs text-center text-muted-foreground">
                      Works on iOS & Android · No credit card
                    </p>
                  </div>
                )}
              </div>
            </div>
          </PageContainer>
        </section>
      )}

      {/* SEO Intro Content - 300-500 words */}
      <section className="py-8 border-b border-border">
        <PageContainer>
          <div className="max-w-3xl mx-auto prose prose-sm">
            <h2 className="text-xl font-bold text-foreground mb-4">
              {game.name} Codes for {month} {year} — Complete List
            </h2>
            <p className="text-muted-foreground mb-4">
              Looking for working {game.name} promo codes in {month} {year}? You&apos;ve come to the right place. 
              We update this page daily with all the latest codes that give you free rewards, 
              in-game currency, and exclusive items.
            </p>
            <p className="text-muted-foreground mb-4">
              {game.name} regularly releases new promo codes through social media, events, and partnerships. 
              These codes typically provide free gems, energy, characters, skins, and other valuable in-game items. 
              Most codes have limited redemptions or expiration dates, so we recommend redeeming them as soon as possible.
            </p>
            <p className="text-muted-foreground mb-4">
              Our team tests every code before adding it to this list to ensure only working codes are shown. 
              Codes marked as &quot;Verified Working&quot; have been confirmed active within the last 24 hours. 
              If a code doesn&apos;t work, it may have expired or reached its redemption limit.
            </p>
            <p className="text-muted-foreground">
              <strong>Pro tip:</strong> Bookmark this page and check back daily for new {month} {year} codes. 
              We add new codes as soon as they&apos;re released by the developers.
            </p>
          </div>
          
          {/* Why Use Codes Block */}
          <div className="max-w-3xl mx-auto mt-8 p-6 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30">
            <h3 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
              <Gift className="h-5 w-5 text-green-600" />
              What You Get With These Codes
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Free Currency</p>
                  <p className="text-xs text-muted-foreground">Gems, coins, energy</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Starter Bonuses</p>
                  <p className="text-xs text-muted-foreground">Characters, items</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Star className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Exclusive Rewards</p>
                  <p className="text-xs text-muted-foreground">Limited-time items</p>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Best Codes Section */}
      <section className="py-10 bg-gradient-to-b from-primary/5 to-muted/30">
        <PageContainer>
          <div className="text-center mb-8">
            <Badge className="bg-primary text-primary-foreground mb-3">
              <Trophy className="h-3 w-3 mr-1" />
              Best {month} {year} Codes
            </Badge>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Top {game.shortName || game.name} Codes Right Now
            </h2>
            <p className="text-muted-foreground">
              Highest value codes verified and working for {month} {year}
            </p>
          </div>

          {/* Top 3 Codes */}
          <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto mb-8">
            {sortedCodes.slice(0, 3).map((code, index) => (
              <Card key={code.id} className={`relative overflow-hidden border-2 transition-all hover:shadow-xl ${
                index === 0 ? "border-green-500/50 bg-gradient-to-br from-green-500/10 to-emerald-500/5" :
                index === 1 ? "border-secondary/50 bg-secondary/5" :
                "border-amber-500/50 bg-amber-500/5"
              }`}>
                <CardContent className="p-5">
                  <div className="absolute top-3 right-3">
                    <Badge className={`text-xs ${
                      index === 0 ? "bg-green-600 text-white" :
                      index === 1 ? "bg-secondary text-secondary-foreground" :
                      "bg-amber-500 text-white"
                    }`}>
                      {index === 0 ? <><Trophy className="h-3 w-3 mr-1" />#1 Recommended</> : `#${index + 1} Best`}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    {code.isVerified && (
                      <Badge variant="outline" className="text-green-600 border-green-500/50 bg-green-500/10 text-xs">
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        Verified Working
                      </Badge>
                    )}
                    {index === 0 && (
                      <Badge variant="outline" className="text-amber-600 border-amber-500/50 bg-amber-500/10 text-xs">
                        <Flame className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    )}
                  </div>

                  <p className="font-bold text-foreground text-lg mb-3">{code.reward}</p>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex-1 flex items-center gap-2 border-2 border-dashed border-primary/40 rounded-lg px-3 py-2.5 bg-background">
                      <Gift className="h-4 w-4 text-primary" />
                      <code className="font-mono font-bold text-primary text-lg">{code.code}</code>
                    </div>
                  </div>

                  {ctaInfo.url && (
                    <>
                      <Button 
                        asChild 
                        className="w-full h-11 font-bold bg-green-600 hover:bg-green-700 text-white"
                      >
                        <a 
                          href={ctaInfo.url} 
                          target="_blank"
                          rel={ctaInfo.rel}
                        >
                          {ctaInfo.isAffiliate ? <Gift className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2 fill-current" />}
                          {ctaInfo.isAffiliate ? "Claim Rewards" : "Play & Redeem"}
                        </a>
                      </Button>
                      {/* Micro Trust Signals */}
                      <p className="text-center text-xs text-muted-foreground mt-2">
                        <CheckCircle2 className="h-3 w-3 inline mr-1 text-green-600" />
                        No signup · Takes 30 seconds
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA: Want More Rewards? */}
          <div className="p-6 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 max-w-2xl mx-auto">
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

      {/* All Codes Section */}
      <section className="py-10 border-b border-border">
        <PageContainer>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            All {game.shortName || game.name} Codes ({month} {year})
          </h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {sortedCodes.map((code, index) => (
              <PromoCodeCard 
                key={code.id} 
                code={code} 
                game={game}
                showAffiliateCTA={true}
                pageSlug={`${game.slug}-codes-${month.toLowerCase()}-${year}`}
                isBestCode={index === 0}
                isMostPopular={index === 0}
                rank={index < 3 ? index + 1 : undefined}
              />
            ))}
          </div>

          {/* Subtle CTA under codes */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            <Sparkles className="h-4 w-4 inline mr-1 text-amber-500" />
            Unlock more rewards inside the game
          </p>
        </PageContainer>
      </section>

      {/* FAQ Section */}
      <section className="py-10 bg-muted/30 border-b border-border">
        <PageContainer>
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            {game.shortName || game.name} Codes FAQ ({month} {year})
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-foreground mb-2">
                  How do I redeem {game.name} codes?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Open {game.name}, go to Settings or the Gift Code section, enter the code exactly as shown, 
                  and tap Redeem. Rewards will be added to your account instantly.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-foreground mb-2">
                  Why isn&apos;t my code working?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Codes may expire, have limited redemptions, or be region-locked. 
                  Make sure you enter the code exactly as shown (codes are case-sensitive). 
                  If a code doesn&apos;t work, check back for new codes.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-foreground mb-2">
                  How often are new codes released?
                </h3>
                <p className="text-muted-foreground text-sm">
                  {game.name} releases new codes during special events, updates, milestones, and holidays. 
                  We update this page daily to include all the latest working codes for {month} {year}.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-foreground mb-2">
                  Are these codes free to use?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Yes! All promo codes listed here are completely free. Simply copy the code and redeem it 
                  in-game to receive free rewards, currency, and items.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold text-foreground mb-2">
                  What rewards can I get from {month} {year} codes?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Current {game.name} codes offer free gems, energy, characters, skins, in-game currency, 
                  and exclusive items. The best codes are highlighted at the top of this page.
                </p>
              </CardContent>
            </Card>
          </div>
        </PageContainer>
      </section>

      {/* More Ways to Get Rewards */}
      <section className="py-10 bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-b border-border">
        <PageContainer>
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-foreground mb-2">
              More Ways to Get {game.shortName || game.name} Rewards
            </h3>
            <p className="text-muted-foreground">
              Don&apos;t stop here — discover more ways to earn free items
            </p>
          </div>
          
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 max-w-3xl mx-auto">
            <Link
              href="/deals"
              className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/10 hover:border-green-500/50 hover:shadow-lg transition-all text-center"
            >
              <Tag className="h-8 w-8 text-green-600" />
              <p className="font-bold text-foreground">Best Deals & Bonuses</p>
              <span className="text-green-600 text-sm font-medium">Browse Deals →</span>
            </Link>
            
            <Link
              href={`/gaming/${game.slug}`}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all text-center"
            >
              <Gift className="h-8 w-8 text-amber-600" />
              <p className="font-bold text-foreground">All {game.shortName || game.name} Codes</p>
              <span className="text-primary text-sm font-medium">View All →</span>
            </Link>
            
            <Link
              href={`/gaming/${game.slug}/redeem-codes`}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all text-center"
            >
              <BookOpen className="h-8 w-8 text-blue-600" />
              <p className="font-bold text-foreground">How to Redeem</p>
              <span className="text-primary text-sm font-medium">Read Guide →</span>
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* Popular Games */}
      <section className="py-10">
        <PageContainer>
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

          {/* Related Games */}
          {relatedGames.length > 0 && (
            <>
              <h4 className="text-lg font-semibold text-foreground mb-3">Similar Games</h4>
              <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
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
        </PageContainer>
      </section>

      {/* Sticky CTA - show if any URL exists */}
      {ctaInfo.url && (
        <StickyGameCTA 
          gameName={game.shortName || game.name}
          affiliateUrl={ctaInfo.url}
        />
      )}
      
      {/* Post-copy sticky bar - appears after user copies a code */}
      {ctaInfo.url && (
        <PostCopyStickyBar
          gameName={game.shortName || game.name}
          affiliateUrl={ctaInfo.url}
          ctaRel={ctaInfo.rel}
          isAffiliate={ctaInfo.isAffiliate}
        />
      )}
      
      {/* Exit Intent Popup */}
      {ctaInfo.url && bestCode && (
        <ExitIntentPopup
          gameName={game.name}
          gameShortName={game.shortName}
          affiliateUrl={ctaInfo.url}
          bestCode={bestCode.code}
          bestCodeReward={bestCode.reward}
          ctaLabel={ctaInfo.isAffiliate ? "Claim FREE Rewards" : "Play Official Game"}
          ctaRel={ctaInfo.rel}
          isAffiliate={ctaInfo.isAffiliate}
          urgencyText="Limited time offer"
          trustText="Free to play · No credit card needed"
        />
      )}
    </CopyProvider>
  )
}
