"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, X, Gift, Copy, Check, Sparkles, Gamepad2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExitIntentPopupProps {
  gameName: string
  gameShortName?: string
  affiliateUrl: string
  bestCode: string
  bestCodeReward: string
  ctaLabel?: string
  ctaRel?: string
  isAffiliate?: boolean
  trustText?: string
}

export function ExitIntentPopup({ 
  gameName, 
  gameShortName,
  affiliateUrl, 
  bestCode,
  bestCodeReward,
  ctaLabel = 'Play & Get Rewards',
  ctaRel = 'noopener noreferrer',
  isAffiliate = false,
  trustText
}: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(bestCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [bestCode])

  useEffect(() => {
    // Check if already shown this session
    const shown = sessionStorage.getItem(`exit-popup-${gameName}`)
    if (shown) {
      setHasShown(true)
      return
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves from the top of the page
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true)
        setHasShown(true)
        sessionStorage.setItem(`exit-popup-${gameName}`, "true")
      }
    }

    // Also trigger on back button attempt (mobile)
    const handlePopState = () => {
      if (!hasShown) {
        setIsVisible(true)
        setHasShown(true)
        sessionStorage.setItem(`exit-popup-${gameName}`, "true")
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("popstate", handlePopState)

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("popstate", handlePopState)
    }
  }, [gameName, hasShown])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsVisible(false)}
      />
      
      {/* Popup */}
      <Card className={cn(
        "relative z-10 w-full max-w-md border-2 border-primary/50 shadow-2xl",
        "animate-in zoom-in-95 fade-in duration-300"
      )}>
        <CardContent className="p-6">
          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 mb-4">
              <Gift className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Before you go — here&apos;s a popular code
            </h3>
            <p className="text-muted-foreground">
              Save this {gameShortName || gameName} code for free rewards
            </p>
          </div>

          {/* Best Code Highlight */}
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-4 mb-6 border border-primary/20">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Badge className="bg-primary text-primary-foreground">
                <Sparkles className="h-3 w-3 mr-1" />
                Best Code
              </Badge>
            </div>
            
            {/* Code Display */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-primary/40 rounded-lg px-4 py-3 bg-background">
                <code className="text-lg font-mono font-bold text-primary tracking-wider">
                  {bestCode}
                </code>
              </div>
              <Button 
                onClick={handleCopy} 
                variant={copied ? "default" : "outline"}
                size="lg"
                className={copied ? "shrink-0 bg-green-600 hover:bg-green-600 text-white" : "shrink-0"}
              >
                {copied ? (
                  <><Check className="h-5 w-5" /> Copied</>
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </Button>
            </div>
            
            {/* Copy confirmation */}
            {copied ? (
              <p className="text-center text-sm font-medium text-green-600">
                Code copied — open the game to redeem it
              </p>
            ) : (
              <p className="text-center text-sm font-medium text-foreground">
                {bestCodeReward}
              </p>
            )}
          </div>

          {/* CTA */}
          <Button
            asChild
            size="lg"
            className={cn(
              "w-full h-14 font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all text-base",
              isAffiliate 
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            )}
          >
            <a
              href={affiliateUrl}
              target="_blank"
              rel={ctaRel}
            >
              {isAffiliate ? (
                <Gift className="h-5 w-5 mr-2" />
              ) : (
                <Gamepad2 className="h-5 w-5 mr-2" />
              )}
              {ctaLabel}
            </a>
          </Button>
          
          {/* Trust text */}
          {isAffiliate && trustText && (
            <p className="text-center text-xs text-muted-foreground mt-2">
              {trustText}
            </p>
          )}

          {/* Secondary action */}
          <button
            onClick={() => setIsVisible(false)}
            className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Maybe later
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
