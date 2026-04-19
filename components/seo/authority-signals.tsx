/**
 * Authority signals components for SEO
 * Display trust badges like "Updated today", "Verified codes", etc.
 */

import { CheckCircle2, Clock, Shield, Users, TrendingUp, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AuthorityBadgeProps {
  className?: string
}

/**
 * "Updated Today" badge - shows freshness signal
 */
export function UpdatedTodayBadge({ className }: AuthorityBadgeProps) {
  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium',
        className
      )}
    >
      <Clock className="h-4 w-4" />
      <span>Updated {today}</span>
    </div>
  )
}

/**
 * "Verified Codes" badge - shows codes have been tested
 */
export function VerifiedCodesBadge({ 
  count, 
  className 
}: { 
  count: number 
  className?: string 
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium',
        className
      )}
    >
      <CheckCircle2 className="h-4 w-4" />
      <span>{count} Verified Codes</span>
    </div>
  )
}

/**
 * "X Codes Working" badge - shows active code count
 */
export function WorkingCodesBadge({ 
  count, 
  className 
}: { 
  count: number 
  className?: string 
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium',
        className
      )}
    >
      <Shield className="h-4 w-4" />
      <span>{count} Codes Working</span>
    </div>
  )
}

/**
 * "Trusted by X Shoppers" badge - social proof
 */
export function TrustedByBadge({ 
  count = '2M+', 
  className 
}: { 
  count?: string 
  className?: string 
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium',
        className
      )}
    >
      <Users className="h-4 w-4" />
      <span>Trusted by {count} Shoppers</span>
    </div>
  )
}

/**
 * "Trending" badge - shows popularity
 */
export function TrendingBadge({ className }: AuthorityBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-sm font-medium',
        className
      )}
    >
      <TrendingUp className="h-4 w-4" />
      <span>Trending Now</span>
    </div>
  )
}

/**
 * "X Active Deals" badge - shows deal count
 */
export function ActiveDealsBadge({ 
  count, 
  className 
}: { 
  count: number 
  className?: string 
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-medium',
        className
      )}
    >
      <Star className="h-4 w-4" />
      <span>{count} Active Deals</span>
    </div>
  )
}

/**
 * Combined authority signals row for pages
 */
interface AuthoritySignalsRowProps {
  type: 'gaming' | 'deals' | 'store'
  codeCount?: number
  dealCount?: number
  showTrending?: boolean
  className?: string
}

export function AuthoritySignalsRow({
  type,
  codeCount = 0,
  dealCount = 0,
  showTrending = false,
  className,
}: AuthoritySignalsRowProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <UpdatedTodayBadge />
      
      {type === 'gaming' && codeCount > 0 && (
        <>
          <VerifiedCodesBadge count={codeCount} />
          <WorkingCodesBadge count={codeCount} />
        </>
      )}
      
      {(type === 'deals' || type === 'store') && dealCount > 0 && (
        <ActiveDealsBadge count={dealCount} />
      )}
      
      {showTrending && <TrendingBadge />}
    </div>
  )
}

/**
 * Compact inline authority signals (for use in headers)
 */
export function AuthoritySignalsInline({
  type,
  count = 0,
  className,
}: {
  type: 'codes' | 'deals'
  count?: number
  className?: string
}) {
  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className={cn('flex items-center gap-3 text-sm text-muted-foreground', className)}>
      <span className="flex items-center gap-1">
        <Clock className="h-3.5 w-3.5" />
        Updated {today}
      </span>
      <span className="text-muted-foreground/50">|</span>
      <span className="flex items-center gap-1">
        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
        {count} {type === 'codes' ? 'verified codes' : 'active deals'}
      </span>
    </div>
  )
}

/**
 * Last verified timestamp for code tables
 */
export function LastVerifiedBadge({ 
  date,
  className 
}: { 
  date?: Date | string 
  className?: string 
}) {
  const displayDate = date 
    ? new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Today'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400',
        className
      )}
    >
      <CheckCircle2 className="h-3 w-3" />
      Verified {displayDate}
    </span>
  )
}
