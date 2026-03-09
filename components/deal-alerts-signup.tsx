"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { PageContainer } from "@/components/layout/page-container"
import { Bell, Mail, Check, Sparkles, Zap, Tag, Loader2 } from "lucide-react"

export function DealAlertsSignup() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [preferences, setPreferences] = useState({
    electronics: true,
    fashion: false,
    home: false,
    gaming: false,
    smartphones: false,
  })
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'instant'>('daily')

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
          preferences: {
            electronics: preferences.electronics,
            fashion: preferences.fashion,
            home: preferences.home,
            gaming: preferences.gaming,
            smartphones: preferences.smartphones,
          },
          frequency,
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

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
  }

  if (submitted) {
    return (
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 sm:py-24">
        <PageContainer narrow className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 mb-6">
            <Check className="h-8 w-8 text-secondary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">You're All Set!</h2>
          <p className="text-muted-foreground">
            We'll send personalized deal alerts to <strong>{email}</strong>
          </p>
          <Button 
            variant="outline" 
            className="mt-6"
            onClick={() => {
              setSubmitted(false)
              setEmail("")
            }}
          >
            Update Preferences
          </Button>
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
            Get personalized deal alerts delivered straight to your inbox. Choose your categories and how often you want to hear from us.
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-900/80 overflow-hidden">
          <CardContent className="p-0">
            <form onSubmit={handleSubmit}>
              <div className="grid lg:grid-cols-2">
                {/* Email Input - Left Side */}
                <div className="p-6 sm:p-8 space-y-4 bg-primary/5">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    Your Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 bg-white dark:bg-gray-800 border-border/50 shadow-sm focus:border-primary focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground">
                    We respect your privacy. Unsubscribe anytime.
                  </p>
                  
                  {/* Badges moved here */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge className="gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 border-0">
                      <Sparkles className="h-3 w-3" />
                      Personalized Picks
                    </Badge>
                    <Badge className="gap-1.5 bg-secondary/10 text-secondary hover:bg-secondary/20 border-0">
                      <Zap className="h-3 w-3" />
                      Flash Sale Alerts
                    </Badge>
                  </div>
                </div>

                {/* Preferences - Right Side */}
                <div className="p-6 sm:p-8 space-y-4 border-t lg:border-t-0 lg:border-l border-border/30">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10">
                      <Tag className="h-4 w-4 text-secondary" />
                    </div>
                    Deal Categories
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${preferences.electronics ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}>
                      <Checkbox 
                        checked={preferences.electronics}
                        onCheckedChange={() => togglePreference("electronics")}
                        className="h-4 w-4 rounded border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span className="text-sm font-medium">Electronics</span>
                    </label>
                    <label className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${preferences.fashion ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}>
                      <Checkbox 
                        checked={preferences.fashion}
                        onCheckedChange={() => togglePreference("fashion")}
                        className="h-4 w-4 rounded border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span className="text-sm font-medium">Fashion</span>
                    </label>
                    <label className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${preferences.home ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}>
                      <Checkbox 
                        checked={preferences.home}
                        onCheckedChange={() => togglePreference("home")}
                        className="h-4 w-4 rounded border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span className="text-sm font-medium">Home & Kitchen</span>
                    </label>
                    <label className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${preferences.gaming ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}>
                      <Checkbox 
                        checked={preferences.gaming}
                        onCheckedChange={() => togglePreference("gaming")}
                        className="h-4 w-4 rounded border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span className="text-sm font-medium">Gaming</span>
                    </label>
                    <label className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${preferences.smartphones ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}`}>
                      <Checkbox 
                        checked={preferences.smartphones}
                        onCheckedChange={() => togglePreference("smartphones")}
                        className="h-4 w-4 rounded border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span className="text-sm font-medium">Smartphones</span>
                    </label>
                  </div>
                  
                  {/* Email Frequency */}
                  <div className="pt-4 border-t border-border/30">
                    <label className="text-sm font-semibold text-foreground mb-3 block">
                      How often should we email you?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setFrequency('instant')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          frequency === 'instant' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted hover:bg-muted/80 text-foreground'
                        }`}
                      >
                        Instant Alerts
                      </button>
                      <button
                        type="button"
                        onClick={() => setFrequency('daily')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          frequency === 'daily' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted hover:bg-muted/80 text-foreground'
                        }`}
                      >
                        Daily Digest
                      </button>
                      <button
                        type="button"
                        onClick={() => setFrequency('weekly')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          frequency === 'weekly' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted hover:bg-muted/80 text-foreground'
                        }`}
                      >
                        Weekly Roundup
                      </button>
                    </div>
                  </div>
                  
                  {/* Subscribe Button */}
                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={isLoading}
                    className="w-full gap-2 h-12 mt-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <Bell className="h-4 w-4" />
                        Subscribe to Alerts
                      </>
                    )}
                  </Button>
                  {error && (
                    <p className="text-sm text-red-500 text-center mt-2">{error}</p>
                  )}
                </div>
              </div>
            </form>
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
