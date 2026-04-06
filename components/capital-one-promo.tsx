"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageContainer } from "@/components/layout/page-container"
import { X, CreditCard, DollarSign, Bell, ShoppingCart, ExternalLink, Sparkles } from "lucide-react"

// Centralized Capital One / SaveSmart affiliate link
const SAVESMART_AFFILIATE_LINK = "https://go.savesmart.bio/save"

interface CapitalOnePromoProps {
  variant?: "banner" | "sidebar" | "inline"
  dismissible?: boolean
}

export function CapitalOnePromo({ variant = "banner", dismissible = true }: CapitalOnePromoProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  const affiliateLink = SAVESMART_AFFILIATE_LINK

  if (isDismissed) return null

  if (variant === "sidebar") {
    return (
      <Card className="overflow-hidden border-blue-200 bg-gradient-to-br from-blue-50 to-white">
        <CardContent className="p-4">
          {dismissible && (
            <button 
              onClick={() => setIsDismissed(true)}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Capital One Shopping</p>
              <Badge className="bg-green-600 text-white text-xs">Free Tool</Badge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Automatically find and apply coupon codes at checkout. Works on 30,000+ sites.
          </p>
          <Button size="sm" className="w-full gap-2 bg-blue-600 hover:bg-blue-700" asChild>
            <a href={affiliateLink} target="_blank" rel="nofollow sponsored noopener">
              Add to Browser
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Sponsored - Free browser extension
          </p>
        </CardContent>
      </Card>
    )
  }

  if (variant === "inline") {
    return (
      <div className="relative flex items-center gap-4 p-4 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-white">
        {dismissible && (
          <button 
            onClick={() => setIsDismissed(true)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
          <CreditCard className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-foreground">
            Save even more with Capital One Shopping
          </p>
          <p className="text-sm text-muted-foreground">
            Free browser extension that automatically finds the best price and applies coupons.
          </p>
        </div>
        <Button className="shrink-0 gap-2 bg-blue-600 hover:bg-blue-700" asChild>
          <a href={affiliateLink} target="_blank" rel="nofollow sponsored noopener">
            Get It Free
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
    )
  }

  // Default: banner variant
  return (
    <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 text-white py-6">
      {dismissible && (
        <button 
          onClick={() => setIsDismissed(true)}
          className="absolute top-3 right-3 text-white/70 hover:text-white z-10"
          aria-label="Dismiss"
        >
          <X className="h-5 w-5" />
        </button>
      )}
      <PageContainer>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <CreditCard className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold">Capital One Shopping</h3>
                <Badge className="bg-green-500 text-white">Free</Badge>
              </div>
              <p className="text-blue-100">
                Never miss a coupon code. This free browser extension automatically finds and applies the best discounts.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-400" />
                <span>Price tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-amber-400" />
                <span>Price alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-pink-400" />
                <span>Auto-apply codes</span>
              </div>
            </div>
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 gap-2 shrink-0" asChild>
              <a href={affiliateLink} target="_blank" rel="nofollow sponsored noopener">
                <Sparkles className="h-5 w-5" />
                Add to Browser - It's Free
              </a>
            </Button>
          </div>
        </div>
      </PageContainer>
      <p className="text-center text-xs text-blue-200 pb-2 mt-4">
        Sponsored Content - Capital One Shopping is a free browser extension.
      </p>
    </div>
  )
}

// Floating promo that appears after scrolling
export function FloatingCapitalOnePromo() {
  const [isDismissed, setIsDismissed] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  // Show after scrolling 50% down the page
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      setIsVisible(scrollPercent > 50 && !isDismissed)
    })
  }

  if (!isVisible || isDismissed) return null

  const affiliateLink = SAVESMART_AFFILIATE_LINK

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-4 fade-in">
      <Card className="overflow-hidden border-blue-300 shadow-lg">
        <CardContent className="p-4">
          <button 
            onClick={() => setIsDismissed(true)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm mb-1">
                Stop paying full price!
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Capital One Shopping finds coupons automatically.
              </p>
              <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700" asChild>
                <a href={affiliateLink} target="_blank" rel="nofollow sponsored noopener">
                  Get It Free
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
