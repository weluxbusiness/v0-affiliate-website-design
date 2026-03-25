"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageContainer } from "@/components/layout/page-container"
import { Bell, Mail, Check, Sparkles, Zap, Loader2 } from "lucide-react"

export function DealAlertsSignup() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email,
          // Default preferences - user can customize later
          preferences: {
            electronics: true,
            fashion: true,
            home: true,
            gaming: true,
            smartphones: true,
          },
          frequency: 'daily',
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Subscription failed")
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Subscription failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 sm:py-24">
        <PageContainer narrow className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 mb-6">
            <Check className="h-8 w-8 text-secondary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">You&apos;re All Set!</h2>
          <p className="text-muted-foreground">
            We&apos;ll send personalized deal alerts to <strong>{email}</strong>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Check your inbox to customize your preferences.
          </p>
        </PageContainer>
      </section>
    )
  }

  return (
    <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 sm:py-24">
      <PageContainer narrow>
        <div className="text-center mb-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-4">
            <Bell className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Never Miss a Deal
          </h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Get the best deals delivered straight to your inbox. Join 50,000+ smart shoppers.
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-900/80 overflow-hidden max-w-lg mx-auto">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  Your Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 bg-white dark:bg-gray-800 border-border/50 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
              
              <Button 
                type="submit" 
                size="lg" 
                disabled={isLoading}
                className="w-full gap-2 h-12 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4" />
                    Get Free Deal Alerts
                  </>
                )}
              </Button>
              
              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}
              
              <p className="text-xs text-muted-foreground text-center">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </form>
            
            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-2 pt-4 mt-4 border-t border-border/30">
              <Badge className="gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 border-0">
                <Sparkles className="h-3 w-3" />
                Personalized Picks
              </Badge>
              <Badge className="gap-1.5 bg-secondary/10 text-secondary hover:bg-secondary/20 border-0">
                <Zap className="h-3 w-3" />
                Flash Sale Alerts
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-foreground">50K+</p>
            <p className="text-sm text-muted-foreground">Subscribers</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">$2.4M</p>
            <p className="text-sm text-muted-foreground">Saved This Month</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">500+</p>
            <p className="text-sm text-muted-foreground">Daily Deals</p>
          </div>
        </div>
      </PageContainer>
    </section>
  )
}
