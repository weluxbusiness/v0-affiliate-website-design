"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, X, Gift } from "lucide-react"
import { cn } from "@/lib/utils"

interface StickyGameCTAProps {
  gameName: string
  affiliateUrl: string
  className?: string
}

export function StickyGameCTA({ gameName, affiliateUrl, className }: StickyGameCTAProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Show sticky CTA after scrolling 500px
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsVisible(scrollY > 500 && !isDismissed)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isDismissed])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300",
        isVisible ? "translate-y-0" : "translate-y-full",
        className
      )}
    >
      <div className="bg-gradient-to-r from-green-600 to-green-700 shadow-2xl border-t border-green-500/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left side - Message */}
            <div className="flex items-center gap-3 text-white">
              <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Gift className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm sm:text-base">
                  Play {gameName} + Get Free Rewards
                </p>
                <p className="text-xs text-white/80 hidden sm:block">
                  Redeem promo codes for free in-game items
                </p>
              </div>
            </div>

            {/* Right side - CTA + Close */}
            <div className="flex items-center gap-2">
              <Button
                asChild
                size="lg"
                className="bg-white text-green-700 hover:bg-white/90 font-bold shadow-lg hover:scale-105 transition-all"
              >
                <a
                  href={affiliateUrl}
                  target="_blank"
                  rel="nofollow sponsored noopener"
                >
                  <Play className="h-4 w-4 mr-2 fill-current" />
                  Play Now
                </a>
              </Button>
              <button
                onClick={() => setIsDismissed(true)}
                className="p-2 text-white/70 hover:text-white transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
