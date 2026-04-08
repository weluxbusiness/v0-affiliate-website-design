"use client"

import { Clock, RefreshCw, CheckCircle2, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface LastUpdatedBannerProps {
  codeCount: number
  variant?: "default" | "compact" | "minimal"
  showDate?: boolean
  showTime?: boolean
  className?: string
}

export function LastUpdatedBanner({ 
  codeCount, 
  variant = "default",
  showDate = true,
  showTime = true,
  className = ""
}: LastUpdatedBannerProps) {
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  const monthYear = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  
  if (variant === "minimal") {
    return (
      <span className={`inline-flex items-center gap-1.5 text-sm text-muted-foreground ${className}`}>
        <RefreshCw className="h-3.5 w-3.5" />
        Updated {timeStr}
      </span>
    )
  }
  
  if (variant === "compact") {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-0">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          {codeCount} Working Codes
        </Badge>
        {showTime && (
          <Badge variant="outline" className="text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            Updated {timeStr}
          </Badge>
        )}
      </div>
    )
  }
  
  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 text-sm ${className}`}>
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-600 font-medium">
        <CheckCircle2 className="h-4 w-4" />
        {codeCount} Working Codes
      </span>
      {showDate && (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {monthYear}
        </span>
      )}
      {showTime && (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground">
          <Clock className="h-4 w-4" />
          Last updated {timeStr}
        </span>
      )}
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600">
        <RefreshCw className="h-4 w-4" />
        Updated Daily
      </span>
    </div>
  )
}

// Static version for SSR pages (no real-time clock)
export function LastUpdatedBannerStatic({ 
  codeCount, 
  monthYear,
  className = ""
}: { 
  codeCount: number
  monthYear: string
  className?: string 
}) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 text-sm ${className}`}>
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-600 font-medium">
        <CheckCircle2 className="h-4 w-4" />
        {codeCount} Working Codes
      </span>
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground">
        <Calendar className="h-4 w-4" />
        {monthYear}
      </span>
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600">
        <RefreshCw className="h-4 w-4" />
        Updated Daily
      </span>
    </div>
  )
}
