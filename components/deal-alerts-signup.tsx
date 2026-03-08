"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { PageContainer } from "@/components/layout/page-container"
import { Bell, Mail, Check, Sparkles, Zap, Tag } from "lucide-react"

export function DealAlertsSignup() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [preferences, setPreferences] = useState({
    electronics: true,
    fashion: false,
    home: false,
    daily: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    // In production, this would call an API to save the subscription
    setSubmitted(true)
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
                  <div className="grid grid-cols-2 gap-2.5">
                    <label className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-all ${preferences.electronics ? 'border-primary/60 bg-primary/5' : 'border-border hover:border-border/80 hover:bg-muted/20'}`}>
                      <Checkbox 
                        checked={preferences.electronics}
                        onCheckedChange={() => togglePreference("electronics")}
                        className="h-4 w-4 rounded border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span className="text-sm">Electronics</span>
                    </label>
                    <label className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-all ${preferences.fashion ? 'border-primary/60 bg-primary/5' : 'border-border hover:border-border/80 hover:bg-muted/20'}`}>
                      <Checkbox 
                        checked={preferences.fashion}
                        onCheckedChange={() => togglePreference("fashion")}
                        className="h-4 w-4 rounded border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span className="text-sm">Fashion</span>
                    </label>
                    <label className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-all ${preferences.home ? 'border-primary/60 bg-primary/5' : 'border-border hover:border-border/80 hover:bg-muted/20'}`}>
                      <Checkbox 
                        checked={preferences.home}
                        onCheckedChange={() => togglePreference("home")}
                        className="h-4 w-4 rounded border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span className="text-sm">Home & Kitchen</span>
                    </label>
                    <label className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-all ${preferences.daily ? 'border-primary/60 bg-primary/5' : 'border-border hover:border-border/80 hover:bg-muted/20'}`}>
                      <Checkbox 
                        checked={preferences.daily}
                        onCheckedChange={() => togglePreference("daily")}
                        className="h-4 w-4 rounded border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <span className="text-sm">Daily Digest</span>
                    </label>
                  </div>
                  
                  {/* Subscribe Button */}
                  <Button type="submit" size="lg" className="w-full gap-2 h-12 mt-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
                    <Bell className="h-4 w-4" />
                    Subscribe to Alerts
                  </Button>
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
