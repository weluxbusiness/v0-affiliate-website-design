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

        <Card className="border-border/50 shadow-lg">
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Email Input */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Your Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12"
                  />
                  <p className="text-xs text-muted-foreground">
                    We respect your privacy. Unsubscribe anytime.
                  </p>
                </div>

                {/* Preferences */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    Deal Categories
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors">
                      <Checkbox 
                        checked={preferences.electronics}
                        onCheckedChange={() => togglePreference("electronics")}
                      />
                      <span className="text-sm">Electronics</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors">
                      <Checkbox 
                        checked={preferences.fashion}
                        onCheckedChange={() => togglePreference("fashion")}
                      />
                      <span className="text-sm">Fashion</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors">
                      <Checkbox 
                        checked={preferences.home}
                        onCheckedChange={() => togglePreference("home")}
                      />
                      <span className="text-sm">Home & Kitchen</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors">
                      <Checkbox 
                        checked={preferences.daily}
                        onCheckedChange={() => togglePreference("daily")}
                      />
                      <span className="text-sm">Daily Digest</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    Personalized Picks
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <Zap className="h-3 w-3" />
                    Flash Sale Alerts
                  </Badge>
                </div>
                <Button type="submit" size="lg" className="gap-2 w-full sm:w-auto">
                  <Bell className="h-4 w-4" />
                  Subscribe to Alerts
                </Button>
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
