"use client"

import { memo, useState, useCallback } from "react"
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
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { PromoCode, Game } from "@/lib/gaming-data"

interface PromoCodeCardProps {
  code: PromoCode
  game?: Game
  variant?: "default" | "compact" | "featured"
  showGame?: boolean
  onCopy?: (code: string) => void
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
  onCopy
}: PromoCodeCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code.code)
    setCopied(true)
    onCopy?.(code.code)
    setTimeout(() => setCopied(false), 2000)
  }, [code.code, onCopy])

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
    return (
      <Card className="overflow-hidden border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardContent className="p-5">
          {/* Best Code Badge */}
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-primary text-primary-foreground">
              <Zap className="h-3 w-3 mr-1" />
              Best Code Today
            </Badge>
            {code.isVerified && (
              <Badge variant="outline" className="text-secondary border-secondary/50">
                <ShieldCheck className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>

          {/* Code Display */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 flex items-center gap-2 border-2 border-dashed border-primary/30 rounded-lg px-4 py-3 bg-background">
              <Gift className="h-5 w-5 text-primary" />
              <code className="text-lg font-mono font-bold text-primary tracking-wider">
                {code.code}
              </code>
            </div>
            <Button onClick={handleCopy} className="shrink-0 h-12 px-5">
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
          <div className="mb-3">
            <p className="font-medium text-foreground">{code.reward}</p>
            {showGame && game && (
              <p className="text-sm text-muted-foreground mt-1">
                For {game.name}
              </p>
            )}
          </div>

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
                <Sparkles className="h-3 w-3 text-secondary" />
                {code.successRate}% success rate
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default variant
  return (
    <Card className={cn(
      "overflow-hidden border-border/50 transition-all duration-300 hover:shadow-md hover:border-primary/20 group",
      code.isExclusive && "border-secondary/30 bg-secondary/5"
    )}>
      <CardContent className="p-4">
        {/* Header Badges */}
        <div className="flex items-center gap-2 mb-3">
          {code.isVerified && (
            <Badge variant="outline" className="text-secondary border-secondary/50 text-xs">
              <ShieldCheck className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
          {code.isExclusive && (
            <Badge className="bg-secondary/20 text-secondary border-0 text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Exclusive
            </Badge>
          )}
          {expiringSoon && (
            <Badge variant="destructive" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Expiring Soon
            </Badge>
          )}
        </div>

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
            variant={copied ? "secondary" : "default"} 
            onClick={handleCopy}
            className="shrink-0"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Reward Description */}
        <p className="font-medium text-foreground text-sm mb-2">
          {code.reward}
        </p>

        {/* Game Name (if showing) */}
        {showGame && game && (
          <p className="text-xs text-muted-foreground mb-2">
            {game.name}
          </p>
        )}

        {/* Footer Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
          {code.expiresAt ? (
            <span className={cn(
              "flex items-center gap-1",
              expiringSoon && "text-destructive"
            )}>
              <Clock className="h-3 w-3" />
              {formatTimeRemaining(code.expiresAt)}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-secondary">
              <ShieldCheck className="h-3 w-3" />
              No expiration
            </span>
          )}
          {code.successRate && (
            <span>{code.successRate}% success</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
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
