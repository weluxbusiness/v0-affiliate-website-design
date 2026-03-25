import { ShieldCheck, Users, Clock, RefreshCw, Award, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface TrustBadgesProps {
  variant?: "inline" | "row" | "compact"
  showUsers?: boolean
  showVerified?: boolean
  showUpdated?: boolean
  className?: string
}

export function TrustBadges({ 
  variant = "inline",
  showUsers = true,
  showVerified = true,
  showUpdated = true,
  className = ""
}: TrustBadgesProps) {
  const now = new Date()
  const formattedDate = now.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })

  if (variant === "compact") {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        {showVerified && (
          <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">
            <ShieldCheck className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )}
        {showUpdated && (
          <Badge variant="outline" className="text-xs text-blue-600 border-blue-200 bg-blue-50">
            <RefreshCw className="h-3 w-3 mr-1" />
            Updated Today
          </Badge>
        )}
      </div>
    )
  }

  if (variant === "row") {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-6 py-6 px-4 bg-muted/30 rounded-lg ${className}`}>
        {showUsers && (
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-foreground">2M+ Users</span>
          </div>
        )}
        {showVerified && (
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-foreground">Verified Deals</span>
          </div>
        )}
        {showUpdated && (
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-foreground">Updated {formattedDate}</span>
          </div>
        )}
      </div>
    )
  }

  // Inline variant (default)
  return (
    <div className={`flex flex-wrap items-center gap-4 text-sm text-muted-foreground ${className}`}>
      {showUsers && (
        <span className="flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          2M+ users trust us
        </span>
      )}
      {showVerified && (
        <span className="flex items-center gap-1.5 text-green-600">
          <ShieldCheck className="h-4 w-4" />
          Verified codes
        </span>
      )}
      {showUpdated && (
        <span className="flex items-center gap-1.5 text-blue-600">
          <RefreshCw className="h-4 w-4" />
          Updated today
        </span>
      )}
    </div>
  )
}

// Hero Trust Section - for page headers
interface HeroTrustSectionProps {
  stats?: {
    users?: string
    deals?: string
    savings?: string
  }
  className?: string
}

export function HeroTrustSection({ 
  stats = { users: "2M+", deals: "10K+", savings: "$50M+" },
  className = ""
}: HeroTrustSectionProps) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-8 py-4 ${className}`}>
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-foreground">
          <Users className="h-6 w-6 text-primary" />
          {stats.users}
        </div>
        <p className="text-sm text-muted-foreground">Active Users</p>
      </div>
      <div className="h-10 w-px bg-border hidden sm:block" />
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-foreground">
          <Award className="h-6 w-6 text-secondary" />
          {stats.deals}
        </div>
        <p className="text-sm text-muted-foreground">Verified Deals</p>
      </div>
      <div className="h-10 w-px bg-border hidden sm:block" />
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-foreground">
          <Star className="h-6 w-6 text-amber-500" />
          {stats.savings}
        </div>
        <p className="text-sm text-muted-foreground">Total Saved</p>
      </div>
    </div>
  )
}

// Page Header Badge - small badge for top of pages
export function UpdatedTodayBadge({ className = "" }: { className?: string }) {
  return (
    <Badge 
      variant="outline" 
      className={`text-xs font-medium text-green-600 border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800 ${className}`}
    >
      <RefreshCw className="h-3 w-3 mr-1" />
      Updated Today
    </Badge>
  )
}

export function VerifiedBadge({ className = "" }: { className?: string }) {
  return (
    <Badge 
      variant="outline" 
      className={`text-xs font-medium text-green-600 border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800 ${className}`}
    >
      <ShieldCheck className="h-3 w-3 mr-1" />
      Verified
    </Badge>
  )
}
