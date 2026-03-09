"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Check, ChevronDown, ChevronUp } from "lucide-react"

interface CategoryPreferences {
  electronics: boolean
  fashion: boolean
  home: boolean
  gaming: boolean
  smartphones: boolean
}

interface NewsletterFormEnhancedProps {
  variant?: "primary" | "default" | "compact"
  showPreferences?: boolean
  defaultExpanded?: boolean
  title?: string
  description?: string
}

const CATEGORIES = [
  { key: 'electronics', label: 'Electronics', description: 'Laptops, TVs, headphones' },
  { key: 'fashion', label: 'Fashion', description: 'Shoes, clothing, accessories' },
  { key: 'home', label: 'Home & Kitchen', description: 'Appliances, decor, furniture' },
  { key: 'gaming', label: 'Gaming', description: 'Consoles, games, accessories' },
  { key: 'smartphones', label: 'Smartphones', description: 'Phones, tablets, wearables' },
] as const

export function NewsletterFormEnhanced({ 
  variant = "default",
  showPreferences = true,
  defaultExpanded = false,
  title,
  description
}: NewsletterFormEnhancedProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [preferencesExpanded, setPreferencesExpanded] = useState(defaultExpanded)
  const [preferences, setPreferences] = useState<CategoryPreferences>({
    electronics: true,
    fashion: false,
    home: false,
    gaming: false,
    smartphones: false,
  })
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'instant'>('daily')

  const togglePreference = (key: keyof CategoryPreferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const selectedCount = Object.values(preferences).filter(Boolean).length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) return
    
    setStatus("loading")
    setErrorMessage("")

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email,
          preferences: showPreferences ? preferences : undefined,
          frequency: showPreferences ? frequency : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Subscription failed")
      }

      setStatus("success")
      setEmail("")
    } catch (error) {
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Subscription failed. Please try again.")
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 mb-4">
          <Check className="h-6 w-6 text-emerald-600" />
        </div>
        <h3 className="font-semibold text-foreground mb-1">You&apos;re subscribed!</h3>
        <p className="text-sm text-muted-foreground">
          {showPreferences && selectedCount > 0 
            ? `We'll send you personalized ${selectedCount === 1 ? 'deal' : 'deals'} in your selected categories.`
            : "Check your inbox for the best deals."}
        </p>
      </div>
    )
  }

  const isPrimary = variant === "primary"
  const isCompact = variant === "compact"

  return (
    <div className="space-y-4">
      {title && (
        <div className="text-center mb-4">
          <h3 className={`font-bold ${isPrimary ? 'text-white' : 'text-foreground'} ${isCompact ? 'text-lg' : 'text-xl'}`}>
            {title}
          </h3>
          {description && (
            <p className={`text-sm mt-1 ${isPrimary ? 'text-white/70' : 'text-muted-foreground'}`}>
              {description}
            </p>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input Row */}
        <div className={`flex ${isCompact ? 'flex-col sm:flex-row' : 'flex-col sm:flex-row'} gap-3`}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === "loading"}
            className={`flex-1 rounded-lg border-0 px-4 py-3 focus:outline-none focus:ring-2 disabled:opacity-50 ${
              isPrimary
                ? "bg-white text-gray-900 placeholder:text-gray-500 focus:ring-white/50"
                : "bg-background text-foreground border border-input placeholder:text-muted-foreground focus:ring-primary/50"
            }`}
          />
          <Button
            type="submit"
            disabled={status === "loading"}
            className={`${isPrimary ? "bg-gray-900 text-white hover:bg-gray-800" : ""} ${isCompact ? 'w-full sm:w-auto' : ''}`}
          >
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subscribing...
              </>
            ) : (
              "Subscribe"
            )}
          </Button>
        </div>

        {/* Error Message */}
        {status === "error" && (
          <p className={`text-sm ${isPrimary ? "text-white/80" : "text-destructive"}`}>
            {errorMessage}
          </p>
        )}

        {/* Preferences Section */}
        {showPreferences && (
          <div className={`rounded-lg ${isPrimary ? 'bg-white/10' : 'bg-muted/50'} overflow-hidden`}>
            <button
              type="button"
              onClick={() => setPreferencesExpanded(!preferencesExpanded)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors ${
                isPrimary ? 'text-white hover:bg-white/5' : 'text-foreground hover:bg-muted'
              }`}
            >
              <span>
                Customize your deal alerts
                {selectedCount > 0 && (
                  <span className={`ml-2 text-xs ${isPrimary ? 'text-white/60' : 'text-muted-foreground'}`}>
                    ({selectedCount} {selectedCount === 1 ? 'category' : 'categories'} selected)
                  </span>
                )}
              </span>
              {preferencesExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            
            {preferencesExpanded && (
              <div className={`px-4 pb-4 space-y-4 border-t ${isPrimary ? 'border-white/10' : 'border-border/50'}`}>
                {/* Category Checkboxes */}
                <div className="pt-4">
                  <p className={`text-xs font-medium mb-3 ${isPrimary ? 'text-white/70' : 'text-muted-foreground'}`}>
                    Select categories you&apos;re interested in:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {CATEGORIES.map(({ key, label, description: desc }) => (
                      <label 
                        key={key}
                        className={`flex items-start gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                          preferences[key as keyof CategoryPreferences]
                            ? isPrimary ? 'border-white/30 bg-white/10' : 'border-primary bg-primary/5'
                            : isPrimary ? 'border-white/10 hover:bg-white/5' : 'border-border hover:bg-muted/50'
                        }`}
                      >
                        <Checkbox 
                          checked={preferences[key as keyof CategoryPreferences]}
                          onCheckedChange={() => togglePreference(key as keyof CategoryPreferences)}
                          className={`h-4 w-4 mt-0.5 rounded border-muted-foreground/40 ${
                            isPrimary 
                              ? 'data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-gray-900'
                              : 'data-[state=checked]:bg-primary data-[state=checked]:border-primary'
                          }`}
                        />
                        <div>
                          <span className={`text-sm font-medium ${isPrimary ? 'text-white' : 'text-foreground'}`}>
                            {label}
                          </span>
                          <p className={`text-xs ${isPrimary ? 'text-white/50' : 'text-muted-foreground'}`}>
                            {desc}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Frequency Selection */}
                <div className={`pt-3 border-t ${isPrimary ? 'border-white/10' : 'border-border/50'}`}>
                  <p className={`text-xs font-medium mb-3 ${isPrimary ? 'text-white/70' : 'text-muted-foreground'}`}>
                    How often would you like to hear from us?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'instant', label: 'Instant' },
                      { value: 'daily', label: 'Daily' },
                      { value: 'weekly', label: 'Weekly' },
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFrequency(value as typeof frequency)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          frequency === value
                            ? isPrimary 
                              ? 'bg-white text-gray-900' 
                              : 'bg-primary text-primary-foreground'
                            : isPrimary
                              ? 'bg-white/10 text-white hover:bg-white/20'
                              : 'bg-muted text-foreground hover:bg-muted/80'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  )
}
