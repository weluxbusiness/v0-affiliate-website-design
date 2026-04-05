"use client"

import { memo, useState, useCallback } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Tag, 
  ShoppingBag, 
  Star,
  ExternalLink,
  Copy,
  Check
} from "lucide-react"
import { Deal, getStoreInfo, formatRating, formatReviewCount, getProductImageUrl } from "@/lib/deal-types"
import { getDealsAffiliateUrl } from "@/lib/gaming-data"
import { CountdownTimer } from "@/components/countdown-timer"

interface DealCardProps {
  deal: Deal
  variant?: "default" | "compact" | "featured"
}

const ProductImage = memo(function ProductImage({ deal, className = "" }: { deal: Deal; className?: string }) {
  const [imageError, setImageError] = useState(false)
  const imageUrl = getProductImageUrl(deal)

  const handleError = useCallback(() => setImageError(true), [])

  if (imageError) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <ShoppingBag className="h-10 w-10" />
          <span className="text-xs font-medium">{deal.store}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={imageUrl}
        alt={deal.title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        onError={handleError}
      />
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  )
})

export const DealCard = memo(function DealCard({ deal, variant = "default" }: DealCardProps) {
  const [copied, setCopied] = useState(false)
  const storeInfo = getStoreInfo(deal.store)
  const savings = deal.original_price - deal.deal_price

  const copyCode = useCallback(() => {
    if (deal.coupon_code) {
      navigator.clipboard.writeText(deal.coupon_code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [deal.coupon_code])

  if (variant === "compact") {
    return (
      <Card className="overflow-hidden border-border/50 transition-all duration-300 hover:shadow-md hover:border-primary/20 group h-full">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl shadow-sm">
              <ProductImage deal={deal} className="h-full w-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-foreground text-sm leading-tight line-clamp-1">
                    {deal.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{deal.store}</p>
                </div>
                <Badge className="bg-secondary text-secondary-foreground text-xs shrink-0">
                  {deal.discount_percentage}% OFF
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-muted-foreground line-through text-xs">${deal.original_price.toFixed(2)}</span>
                <span className="font-bold text-secondary">${deal.deal_price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === "featured") {
    return (
      <Card className="overflow-hidden border-border/50 transition-all duration-300 hover:shadow-xl group h-full flex flex-col">
        <div className="relative aspect-video">
          <ProductImage deal={deal} className="h-full w-full" />
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-secondary text-secondary-foreground font-bold shadow-lg">
              {deal.discount_percentage}% OFF
            </Badge>
          </div>
          <div className="absolute top-3 right-3 z-10">
            <CountdownTimer expiresAt={deal.expires_at} compact />
          </div>
          {/* Store badge */}
          <div className="absolute bottom-3 left-3 z-10">
            <div className={`${storeInfo.color} text-white text-xs font-semibold px-2 py-1 rounded shadow-lg`}>
              {deal.store}
            </div>
          </div>
        </div>
        <CardContent className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs">{deal.category}</Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {formatRating(storeInfo.rating)} ({formatReviewCount(storeInfo.reviewCount)})
            </div>
          </div>
          <h3 className="font-semibold text-foreground leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {deal.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{deal.description}</p>
          
          <div className="flex-1" />
          {/* Price comparison */}
          <div className="bg-muted/50 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Original Price</span>
              <span className="text-sm text-muted-foreground line-through">${deal.original_price.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Deal Price</span>
              <span className="text-lg font-bold text-secondary">${deal.deal_price.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-xs font-medium text-foreground">You Save</span>
              <span className="text-sm font-bold text-primary">${savings.toFixed(2)}</span>
            </div>
          </div>

          {deal.coupon_code && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 flex items-center gap-2 border border-dashed border-primary/50 rounded-lg px-3 py-2 bg-primary/5">
                <Tag className="h-4 w-4 text-primary" />
                <code className="text-sm font-mono font-semibold text-primary">{deal.coupon_code}</code>
              </div>
              <Button size="sm" variant="outline" onClick={copyCode} className="shrink-0">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          )}

          <Button className="w-full gap-2" asChild>
            <a href={deal.affiliate_link || getDealsAffiliateUrl()} target="_blank" rel="nofollow sponsored noopener">
              <ShoppingBag className="h-4 w-4" />
              Get This Deal
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Default variant
  return (
    <Card className="overflow-hidden border-border/50 transition-all duration-300 hover:shadow-lg group h-full flex flex-col">
      <div className="relative aspect-video">
        <ProductImage deal={deal} className="h-full w-full" />
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-secondary text-secondary-foreground text-xs shadow-lg">
            {deal.discount_percentage}% OFF
          </Badge>
        </div>
        {/* Store badge */}
        <div className="absolute bottom-2 left-2 z-10">
          <div className={`${storeInfo.color} text-white text-xs font-semibold px-2 py-1 rounded shadow`}>
            {deal.store}
          </div>
        </div>
      </div>
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant="outline" className="text-xs">{deal.category}</Badge>
          <CountdownTimer expiresAt={deal.expires_at} compact />
        </div>
        <h4 className="font-semibold text-foreground leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {deal.title}
        </h4>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span>{formatRating(storeInfo.rating)}</span>
          <span className="text-border">|</span>
          <span>{formatReviewCount(storeInfo.reviewCount)} reviews</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2 mb-3">
          <span className="text-muted-foreground line-through text-sm">${deal.original_price.toFixed(2)}</span>
          <span className="font-bold text-secondary text-lg">${deal.deal_price.toFixed(2)}</span>
          <span className="text-xs text-muted-foreground ml-auto">Save ${savings.toFixed(2)}</span>
        </div>
        {deal.coupon_code && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1.5 border border-dashed border-primary/50 rounded px-2 py-1 bg-primary/5 flex-1">
              <Tag className="h-3 w-3 text-primary" />
              <code className="text-xs font-mono font-semibold text-primary">{deal.coupon_code}</code>
            </div>
            <Button size="sm" variant="ghost" onClick={copyCode} className="h-7 w-7 p-0">
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
        )}
        <Button className="w-full gap-2" size="sm" asChild>
          <a href={deal.affiliate_link || getDealsAffiliateUrl()} target="_blank" rel="nofollow sponsored noopener">
            <ShoppingBag className="h-4 w-4" />
            Get Deal
          </a>
        </Button>
      </CardContent>
    </Card>
  )
})

export function DealCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border/50">
      <div className="aspect-video bg-muted animate-pulse" />
      <CardContent className="p-4 space-y-3">
        <div className="h-4 w-20 bg-muted rounded animate-pulse" />
        <div className="h-5 w-full bg-muted rounded animate-pulse" />
        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-muted rounded animate-pulse" />
          <div className="h-6 w-20 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-9 w-full bg-muted rounded animate-pulse" />
      </CardContent>
    </Card>
  )
}
