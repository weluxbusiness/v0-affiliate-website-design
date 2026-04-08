"use client"

import { memo, useState, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Copy, 
  Check, 
  Clock, 
  Sparkles,
  ShieldCheck,
  Gift,
  Zap,
  Flame,
  Star,
  ExternalLink,
  Play,
  Crown,
  Trophy
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useGamingAnalytics } from "@/hooks/use-gaming-analytics"
import { GameLogo } from "@/components/gaming/game-logo"
import { useCopyContext } from "@/components/gaming/copy-code-button"
import type { PromoCode, Game } from "@/lib/gaming-data"
import { getGameCtaInfo, hasGameSpecificAffiliateLinks } from "@/lib/gaming-data"

// Extended type to support both static data and database records
export type PromoCodeWithId = PromoCode & {
  id?: string
  game_id?: string
}

interface PromoCodeCardProps {
  code: PromoCodeWithId
  game?: Game & { id?: string }
  variant?: "default" | "compact" | "featured"
  showGame?: boolean
  showAffiliateCTA?: boolean // Show affiliate CTA even when showGame is false
  affiliateUrl?: string // Direct affiliate URL override
  affiliateLabel?: string // Custom CTA label like "Play RAID"
  affiliateRel?: string // Custom rel attribute for affiliate link
  onCopy?: (code: string) => void
  pageSlug?: string
  isBestCode?: boolean // Show "Best Code" badge
  isMostPopular?: boolean // Show "Most Popular" badge
  rank?: number // Code rank (1, 2, 3) for badge display
}

function formatTimeRemaining(expiresAt: string): string {
  const now = new Date().getTime()
  const expiry = new Date(expiresAt).getTime()
  const diff = expiry - now

  if (diff <= 0) return "Expired"

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 30) return `${Math.floor(days / 30)} months left`
  if (days > 0) return `${days}d ${hours}h left`
  if (hours > 0) return `${hours}h left`
  
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${minutes}m left`
}

function isExpiringSoon(expiresAt?: string): boolean {
  if (!expiresAt) return false
  const now = new Date().getTime()
  const expiry = new Date(expiresAt).getTime()
  const threeDays = 3 * 24 * 60 * 60 * 1000
  return expiry - now < threeDays && expiry > now
}

export const PromoCodeCard = memo(function PromoCodeCard({ 
  code, 
  game,
  variant = "default",
  showGame = false,
  showAffiliateCTA = false,
  affiliateUrl: affiliateUrlProp,
  affiliateLabel,
  affiliateRel: affiliateRelProp,
  onCopy,
  pageSlug,
  isBestCode = false,
  isMostPopular = false,
  rank
}: PromoCodeCardProps) {
  const [copied, setCopied] = useState(false)
  const { trackCodeCopy } = useGamingAnalytics()
  const copyContext = useCopyContext()
  
  // Compute CTA info from game or use prop overrides
  const gameCtaInfo = game ? getGameCtaInfo(game) : null
  const computedAffiliateUrl = affiliateUrlProp || gameCtaInfo?.url || null
  const computedAffiliateRel = affiliateRelProp || gameCtaInfo?.rel || 'noopener noreferrer'

  const handleCopy = useCallback(() => {
    if (copied) return
    
    navigator.clipboard.writeText(code.code)
    setCopied(true)
    onCopy?.(code.code)
    
    // Notify context for PostCopyStickyBar
    copyContext?.setHasCopied(true, code.code)
    
    // Track the copy event
    trackCodeCopy({
      game_id: code.game_id || game?.id,
      promo_code_id: code.id,
      code: code.code,
      page_slug: pageSlug,
    })
    
    setTimeout(() => setCopied(false), 5000)
  }, [code.code, code.id, code.game_id, game?.id, pageSlug, onCopy, trackCodeCopy, copied, copyContext])

  const expiringSoon = isExpiringSoon(code.expiresAt)

  if (variant === "compact") {
    return (
      <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          {code.isVerified && (
            <ShieldCheck className="h-4 w-4 text-secondary shrink-0" />
          )}
          <div className="min-w-0">
            <code className="font-mono font-semibold text-sm text-foreground">
              {code.code}
            </code>
            <p className="text-xs text-muted-foreground truncate">
              {code.reward}
            </p>
          </div>
        </div>
        <Button size="sm" variant="outline" onClick={handleCopy} className="shrink-0 h-8">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>
    )
  }

  if (variant === "featured") {
    const featuredCtaInfo = game ? getGameCtaInfo(game) : null
    const affiliateUrl = featuredCtaInfo?.url || null
    const isExternal = game ? hasGameSpecificAffiliateLinks(game) : false

    return (
      <Card className="overflow-hidden border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-secondary/5 hover:shadow-xl transition-all duration-300">
        <CardContent className="p-5">
          {/* Game Logo + Best Code Badge */}
          <div className="flex items-center gap-3 mb-4">
            {showGame && game && (
              <GameLogo 
                src={game.logoUrl} 
                alt={game.name} 
                size="xl"
                className="shadow-md ring-2 ring-primary/20"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-primary text-primary-foreground">
                  <Zap className="h-3 w-3 mr-1" />
                  Best Code
                </Badge>
                {code.isVerified && (
                  <Badge variant="outline" className="text-secondary border-secondary/50">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              {showGame && game && (
                <p className="text-lg font-bold text-foreground">
                  {game.name}
                </p>
              )}
            </div>
          </div>

          {/* Code Display */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 flex items-center gap-2 border-2 border-dashed border-primary/30 rounded-lg px-4 py-3 bg-background">
              <Gift className="h-5 w-5 text-primary" />
              <code className="text-lg font-mono font-bold text-primary tracking-wider">
                {code.code}
              </code>
            </div>
            <Button onClick={handleCopy} variant="outline" className="shrink-0 h-12 px-5">
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>

          {/* Reward */}
          <div className="mb-4">
            <p className="font-semibold text-foreground text-lg">{code.reward}</p>
          </div>

          {/* Primary CTA - Play Now (Falconix affiliate network) */}
          {showGame && game && affiliateUrl && (
            <Button 
              asChild 
              className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700 text-white mb-4 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
                  <a
                    href={affiliateUrl}
                    target="_blank"
                    rel={featuredCtaInfo?.rel || 'noopener noreferrer'}
                  >
                    <Play className="h-5 w-5 mr-2 fill-current" />
                    {featuredCtaInfo?.isAffiliate ? `Play ${game.shortName || game.name}` : `Play ${game.shortName || game.name}`}
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
            </Button>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {code.expiresAt && (
              <span className={cn(
                "flex items-center gap-1",
                expiringSoon && "text-destructive"
              )}>
                <Clock className="h-3 w-3" />
                {formatTimeRemaining(code.expiresAt)}
              </span>
            )}
            {code.successRate && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-amber-500" />
                {code.successRate}% success rate
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default variant - with game logo for visual hierarchy
  const affiliateUrl = computedAffiliateUrl
  const affiliateRel = computedAffiliateRel
  const shouldShowCTA = showAffiliateCTA || (showGame && game && affiliateUrl)

  const cardContent = (
    <Card className={cn(
      "overflow-hidden border-border/50 transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:scale-[1.02] group",
      code.isExclusive && "border-secondary/30 bg-secondary/5"
    )}>
      <CardContent className="p-4">
        {/* Game Logo + Header */}
        {showGame && game && (
          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border/50">
            <GameLogo 
              src={game.logoUrl} 
              alt={game.name} 
              size="lg"
              className="shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">
                {game.shortName || game.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {game.categories[0]}
              </p>
            </div>
            {code.isVerified && (
              <Badge variant="outline" className="text-secondary border-secondary/50 text-xs shrink-0">
                <ShieldCheck className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
        )}

        {/* Header Badges (when not showing game) - Trust + Urgency Signals */}
        {!showGame && (
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {/* Best Code Badge - Priority */}
            {isBestCode && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs">
                <Crown className="h-3 w-3 mr-1" />
                Best Code
              </Badge>
            )}
            {/* Rank Badge */}
            {rank && rank <= 3 && !isBestCode && (
              <Badge className={`text-xs ${
                rank === 1 ? "bg-green-600 text-white" :
                rank === 2 ? "bg-blue-600 text-white" :
                "bg-amber-500 text-white"
              }`}>
                <Trophy className="h-3 w-3 mr-1" />
                #{rank} Recommended
              </Badge>
            )}
            {/* Most Popular Badge */}
            {isMostPopular && (
              <Badge variant="outline" className="text-amber-600 border-amber-500/50 bg-amber-500/10 text-xs">
                <Flame className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
            )}
            {code.isVerified && (
              <Badge variant="outline" className="text-green-600 border-green-500/50 bg-green-500/10 text-xs">
                <ShieldCheck className="h-3 w-3 mr-1" />
                Verified Working
              </Badge>
            )}
            {code.isExclusive && (
              <Badge className="bg-purple-500/20 text-purple-600 border-0 text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                Exclusive
              </Badge>
            )}
            {expiringSoon && (
              <Badge variant="outline" className="text-xs text-amber-600 border-amber-500/50 bg-amber-500/10">
                <Clock className="h-3 w-3 mr-1" />
                Limited-time
              </Badge>
            )}
          </div>
        )}

        {/* Badges when showing game */}
        {showGame && (
          <div className="flex items-center gap-2 mb-3">
            {code.isExclusive && (
              <Badge className="bg-secondary/20 text-secondary border-0 text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                Exclusive
              </Badge>
            )}
            {expiringSoon && (
              <Badge variant="outline" className="text-xs text-amber-600 border-amber-500/50 bg-amber-500/10">
                <Clock className="h-3 w-3 mr-1" />
                Limited-time
              </Badge>
            )}
          </div>
        )}

        {/* Reward - Highlight First */}
        <p className="font-semibold text-foreground mb-3">
          {code.reward}
        </p>

        {/* Code Box */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 border border-dashed border-primary/40 rounded-lg px-3 py-2 bg-primary/5">
            <Gift className="h-4 w-4 text-primary" />
            <code className="font-mono font-semibold text-primary">
              {code.code}
            </code>
          </div>
          <Button 
            size="sm" 
            variant={copied ? "default" : "outline"}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleCopy()
            }}
            className={cn("shrink-0 transition-all", copied && "bg-green-600 hover:bg-green-600 text-white")}
          >
            {copied ? (
              <><Check className="h-4 w-4 mr-1" /> Copied</>
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Copy Confirmation + Open Game CTA with Step Indicator */}
        {copied && shouldShowCTA && affiliateUrl ? (
          <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg animate-in fade-in slide-in-from-top-2">
            <p className="text-sm text-green-700 font-medium mb-2 flex items-center gap-2">
              <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs font-bold">Step 1/2</span>
              Code copied! Now open the game to redeem.
            </p>
            <Button 
              asChild 
              className="w-full h-10 font-bold bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all"
              size="sm"
            >
              <a
                href={affiliateUrl}
                target="_blank"
                rel={affiliateRel}
                onClick={(e) => e.stopPropagation()}
              >
                <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs mr-2">Step 2</span>
                Continue → Claim Rewards
                <ExternalLink className="h-3 w-3 ml-2" />
              </a>
            </Button>
          </div>
        ) : copied ? (
          <div className="p-2 bg-green-50 border border-green-200 rounded-lg animate-in fade-in mb-2">
            <p className="text-xs text-green-700 font-medium flex items-center gap-2">
              <span className="bg-green-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">Step 1/2</span>
              Code copied! Open the game to redeem.
            </p>
          </div>
        ) : null}

        {/* Primary CTA - Play & Redeem (affiliate) - Only show when not copied */}
        {!copied && shouldShowCTA && affiliateUrl && (
          <Button 
            asChild 
            className="w-full h-11 font-bold bg-green-600 hover:bg-green-700 text-white mb-3 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            size="sm"
          >
            <a 
              href={affiliateUrl} 
              target="_blank"
              rel={affiliateRel}
              onClick={(e) => e.stopPropagation()}
            >
              <Play className="h-4 w-4 mr-2 fill-current" />
              {affiliateLabel || "Play & Redeem Code"}
              <ExternalLink className="h-3 w-3 ml-2" />
            </a>
          </Button>
        )}

        {/* Footer Info - Trust Signals (Compliance-Safe) */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
          <div className="flex items-center gap-3">
            {code.expiresAt ? (
              <span className={cn(
                "flex items-center gap-1",
                expiringSoon && "text-amber-600 font-medium"
              )}>
                <Clock className="h-3 w-3" />
                {formatTimeRemaining(code.expiresAt)}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-green-600">
                <ShieldCheck className="h-3 w-3" />
                No expiration
              </span>
            )}
            {/* Compliant social proof - no fake numbers */}
            {code.isVerified && (
              <span className="flex items-center gap-1 text-blue-600">
                <Flame className="h-3 w-3" />
                Popular code
              </span>
            )}
          </div>
          {code.successRate && (
            <span className="flex items-center gap-1 text-green-600 font-medium">
              <Star className="h-3 w-3 text-amber-500" />
              {code.successRate}% success
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )

  // Wrap in Link to internal page for navigation (affiliate is separate button)
  if (showGame && game) {
    return (
      <Link href={`/gaming/${game.slug}`} className="block">
        {cardContent}
      </Link>
    )
  }

  return cardContent
})

export function PromoCodeCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border/50">
      <CardContent className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-muted rounded animate-pulse" />
          <div className="h-5 w-20 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-10 w-full bg-muted rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
        <div className="flex justify-between">
          <div className="h-3 w-20 bg-muted rounded animate-pulse" />
          <div className="h-3 w-16 bg-muted rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}
