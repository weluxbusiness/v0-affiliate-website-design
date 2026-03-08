"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { calculateTimeRemaining } from "@/lib/deal-types"

interface CountdownTimerProps {
  expiresAt: string
  compact?: boolean
}

export function CountdownTimer({ expiresAt, compact = false }: CountdownTimerProps) {
  // Initialize with null to prevent hydration mismatch - time differs between server and client
  const [timeRemaining, setTimeRemaining] = useState<ReturnType<typeof calculateTimeRemaining> | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTimeRemaining(calculateTimeRemaining(expiresAt))
    
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(expiresAt))
    }, 1000)

    return () => clearInterval(interval)
  }, [expiresAt])

  // Show loading skeleton during SSR and initial mount to prevent hydration mismatch
  if (!mounted || !timeRemaining) {
    return (
      <span className="text-xs text-muted-foreground flex items-center gap-1">
        <Clock className="h-3 w-3" />
        <span className="w-12 h-3 bg-muted animate-pulse rounded" />
      </span>
    )
  }

  if (timeRemaining.expired) {
    return (
      <span className="text-destructive text-xs font-medium">
        Expired
      </span>
    )
  }

  if (compact) {
    if (timeRemaining.days > 0) {
      return (
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {timeRemaining.days}d left
        </span>
      )
    }
    return (
      <span className="text-xs text-amber-600 flex items-center gap-1 font-medium">
        <Clock className="h-3 w-3" />
        {timeRemaining.hours}h {timeRemaining.minutes}m
      </span>
    )
  }

  return (
    <div className="flex items-center gap-1.5">
      <Clock className="h-4 w-4 text-muted-foreground" />
      <div className="flex items-center gap-1 text-sm">
        {timeRemaining.days > 0 && (
          <>
            <TimeUnit value={timeRemaining.days} label="d" />
            <span className="text-muted-foreground">:</span>
          </>
        )}
        <TimeUnit value={timeRemaining.hours} label="h" />
        <span className="text-muted-foreground">:</span>
        <TimeUnit value={timeRemaining.minutes} label="m" />
        <span className="text-muted-foreground">:</span>
        <TimeUnit value={timeRemaining.seconds} label="s" />
      </div>
    </div>
  )
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <span className="font-mono font-semibold text-foreground">
      {value.toString().padStart(2, "0")}
      <span className="text-muted-foreground text-xs">{label}</span>
    </span>
  )
}

export function CountdownBadge({ expiresAt }: { expiresAt: string }) {
  // Initialize with null to prevent hydration mismatch
  const [timeRemaining, setTimeRemaining] = useState<ReturnType<typeof calculateTimeRemaining> | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTimeRemaining(calculateTimeRemaining(expiresAt))
    
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(expiresAt))
    }, 1000)

    return () => clearInterval(interval)
  }, [expiresAt])

  // Show loading skeleton during SSR to prevent hydration mismatch
  if (!mounted || !timeRemaining) {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium shadow-md border border-border/50">
        <Clock className="h-3 w-3" />
        <span className="w-16 h-3 bg-muted animate-pulse rounded" />
      </div>
    )
  }

  if (timeRemaining.expired) {
    return (
      <div className="inline-flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-1 text-xs font-medium text-white shadow-md">
        Expired
      </div>
    )
  }

  const isUrgent = timeRemaining.days === 0 && timeRemaining.hours < 24

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium shadow-md ${
      isUrgent 
        ? "bg-amber-500 text-white" 
        : "bg-white/95 text-foreground backdrop-blur-sm border border-border/50"
    }`}>
      <Clock className="h-3 w-3" />
      {timeRemaining.days > 0 ? (
        <span>{timeRemaining.days}d {timeRemaining.hours}h left</span>
      ) : (
        <span>{timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s</span>
      )}
    </div>
  )
}
