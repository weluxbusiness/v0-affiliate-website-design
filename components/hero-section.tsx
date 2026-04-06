"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/layout/page-container"
import { Shield, Star, Users } from "lucide-react"
import { ExtensionCTAButton } from "@/components/extension-cta-button"

// Store badges with brand colors
const stores = [
  { name: "Amazon", color: "bg-orange-500" },
  { name: "Nike", color: "bg-black" },
  { name: "Best Buy", color: "bg-blue-600" },
  { name: "Target", color: "bg-red-600" },
  { name: "Walmart", color: "bg-blue-500" },
]

// Animated coupon examples for mockup
const coupons = [
  { code: "SAVE20", discount: "-$20.00" },
  { code: "FREESHIP", discount: "-$8.99" },
  { code: "EXTRA15", discount: "-$15.00" },
]

export function HeroSection() {
  const [activeCouponIndex, setActiveCouponIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Animate through coupons
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setActiveCouponIndex((prev) => (prev + 1) % coupons.length)
        setIsAnimating(false)
      }, 200)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section 
      className="relative overflow-hidden pt-16 py-16 sm:py-24 lg:py-32"
      style={{
        backgroundColor: 'hsl(var(--background))',
        backgroundImage: 'linear-gradient(to bottom, hsl(var(--background)), hsl(var(--muted) / 0.3))',
      }}
    >
      <PageContainer>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-start">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary-foreground">
              <Star className="h-4 w-4 fill-secondary text-secondary" />
              <span className="text-foreground">Trusted by 2M+ shoppers</span>
            </div>
            
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Save Money Automatically While Shopping Online
            </h1>
            
            <p className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground sm:text-xl">
              This free shopping assistant finds coupons, compares prices and helps you save money at thousands of online stores.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <ExtensionCTAButton 
                size="lg" 
                className="gap-2 bg-primary px-8 text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
              >
                Start Saving Now
              </ExtensionCTAButton>
              <span className="text-sm text-muted-foreground">
                Save up to 30% automatically at checkout
              </span>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-secondary" />
                <span className="text-sm text-muted-foreground">100% Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-secondary" />
                <span className="text-sm text-muted-foreground">2M+ Users</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-1 text-sm text-muted-foreground">4.8/5 Rating</span>
              </div>
            </div>

            <div className="mt-10">
              <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Works with your favorite stores
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {stores.map((store) => (
                  <span 
                    key={store.name}
                    className={`${store.color} text-white text-xs font-semibold px-3 py-1.5 rounded-full`}
                  >
                    {store.name}
                  </span>
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  +30,000 more
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl border border-border bg-card p-4 shadow-2xl shadow-primary/10">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 rounded-md bg-muted px-3 py-1.5 text-center text-xs text-muted-foreground">
                  amazon.com/checkout
                </div>
              </div>
              
              {/* SaveSmart popup simulation */}
              <div className="mt-4 space-y-4">
                <div className="rounded-xl border-2 border-dashed border-secondary/50 bg-secondary/5 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <span className="text-lg font-bold text-secondary-foreground">S</span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">SaveSmart Found 3 Coupons!</p>
                        <p className="text-sm text-muted-foreground">Click to apply the best one</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Animated coupon list */}
                  <div className="mt-4 space-y-2">
                    {coupons.map((coupon, index) => (
                      <div 
                        key={coupon.code}
                        className={`flex items-center justify-between rounded-lg p-3 transition-all duration-300 ${
                          index === activeCouponIndex 
                            ? 'bg-secondary/20 ring-2 ring-secondary scale-[1.02]' 
                            : 'bg-card'
                        } ${isAnimating && index === activeCouponIndex ? 'opacity-80' : 'opacity-100'}`}
                      >
                        <div className="flex items-center gap-2">
                          {index === activeCouponIndex && (
                            <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                          )}
                          <span className="font-mono text-sm text-foreground">{coupon.code}</span>
                        </div>
                        <span className={`font-semibold ${index === activeCouponIndex ? 'text-secondary' : 'text-muted-foreground'}`}>
                          {coupon.discount}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between rounded-lg bg-secondary/10 p-3">
                    <span className="text-sm font-medium text-foreground">Best savings found:</span>
                    <span className="text-lg font-bold text-secondary">
                      {coupons[activeCouponIndex].discount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative blurs */}
            <div className="absolute -right-4 -top-4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-4 -left-4 h-48 w-48 rounded-full bg-secondary/10 blur-3xl" />
          </div>
        </div>
      </PageContainer>
    </section>
  )
}
