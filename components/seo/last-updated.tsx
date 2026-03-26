import { Clock, RefreshCw } from "lucide-react"

/**
 * Last Updated Component
 * Displays freshness signal for SEO pages
 * Auto-generates current date for content freshness
 */

interface LastUpdatedProps {
  /** Optional specific date, otherwise uses current date */
  date?: Date | string
  /** Show refresh icon */
  showRefreshIcon?: boolean
  /** Additional CSS classes */
  className?: string
  /** Compact mode for smaller displays */
  compact?: boolean
}

export function LastUpdated({ 
  date, 
  showRefreshIcon = false,
  className = '',
  compact = false
}: LastUpdatedProps) {
  // Use provided date or current date
  const displayDate = date ? new Date(date) : new Date()
  
  // Format for display
  const formattedDate = displayDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  
  // ISO format for metadata
  const isoDate = displayDate.toISOString().split('T')[0]

  if (compact) {
    return (
      <span 
        className={`inline-flex items-center gap-1 text-xs text-muted-foreground ${className}`}
        title={`Last updated: ${formattedDate}`}
      >
        <Clock className="h-3 w-3" />
        <time dateTime={isoDate}>{formattedDate}</time>
      </span>
    )
  }

  return (
    <div className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}>
      {showRefreshIcon ? (
        <RefreshCw className="h-4 w-4" />
      ) : (
        <Clock className="h-4 w-4" />
      )}
      <span>Last updated:</span>
      <time dateTime={isoDate} className="font-medium text-foreground">
        {formattedDate}
      </time>
    </div>
  )
}

/**
 * Inline version for use within paragraphs
 */
export function LastUpdatedInline({ date, className = '' }: { date?: Date | string; className?: string }) {
  const displayDate = date ? new Date(date) : new Date()
  const formattedDate = displayDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const isoDate = displayDate.toISOString().split('T')[0]

  return (
    <time dateTime={isoDate} className={`text-muted-foreground ${className}`}>
      {formattedDate}
    </time>
  )
}

/**
 * Get current date string for metadata
 */
export function getCurrentDateISO(): string {
  return new Date().toISOString().split('T')[0]
}

/**
 * Get formatted current date for display
 */
export function getCurrentDateFormatted(): string {
  return new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}
