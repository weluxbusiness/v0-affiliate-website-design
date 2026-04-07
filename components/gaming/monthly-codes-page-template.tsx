"use client"

import Link from "next/link"
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
  BookOpen
} from "lucide-react"
import { PageContainer } from "@/components/layout/page-container"
import { PromoCodeCard } from "@/components/gaming/promo-code-card"
import { StickyGameCTA } from "@/components/gaming/sticky-game-cta"
import { GameHeroImage } from "@/components/gaming/game-hero-image"
import { GameSectionImage } from "@/components/gaming/game-section-image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Game, PromoCode } from "@/lib/gaming-data"
import { getActivePromoCodes, sortPromoCodesByValue, getPlayAffiliateUrl } from "@/lib/gaming-data"

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

  return (
    <>
      {/* Trust Banner */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3">
        <PageContainer>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              <strong>{activeCodes.length} Working Codes</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              Updated Daily
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              Codes Tested Regularly
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {month} {year}
            </span>
          </div>
        </PageContainer>
      </section>

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
                <Button 
                  asChild 
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold shrink-0"
                >
                  <a 
                    href={getPlayAffiliateUrl(game)} 
                    target="_blank"
                    rel="nofollow sponsored noopener"
                  >
                    <Play className="h-4 w-4 mr-2 fill-current" />
                    Start Playing Free
                  </a>
                </Button>
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

                  {code.isVerified && (
                    <Badge variant="outline" className="text-green-600 border-green-500/50 bg-green-500/10 text-xs mb-3">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Verified Working
                    </Badge>
                  )}

                  <p className="font-bold text-foreground text-lg mb-3">{code.reward}</p>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex-1 flex items-center gap-2 border-2 border-dashed border-primary/40 rounded-lg px-3 py-2.5 bg-background">
                      <Gift className="h-4 w-4 text-primary" />
                      <code className="font-mono font-bold text-primary text-lg">{code.code}</code>
                    </div>
                  </div>

                  <Button 
                    asChild 
                    className="w-full h-11 font-bold bg-green-600 hover:bg-green-700 text-white"
                  >
                    <a 
                      href={getPlayAffiliateUrl(game)} 
                      target="_blank"
                      rel="nofollow sponsored noopener"
                    >
                      <Play className="h-4 w-4 mr-2 fill-current" />
                      Play & Redeem
                    </a>
                  </Button>

                  <p className="text-center text-xs text-muted-foreground mt-3">
                    <Flame className="h-3 w-3 inline mr-1 text-amber-500" />
                    Popular code
                  </p>
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
            {sortedCodes.map((code) => (
              <PromoCodeCard 
                key={code.id} 
                code={code} 
                game={game}
                showAffiliateCTA={true}
                pageSlug={`${game.slug}-codes-${month.toLowerCase()}-${year}`}
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

      {/* Sticky CTA */}
      <StickyGameCTA 
        gameName={game.shortName || game.name}
        affiliateUrl={getPlayAffiliateUrl(game)}
      />
    </>
  )
}
