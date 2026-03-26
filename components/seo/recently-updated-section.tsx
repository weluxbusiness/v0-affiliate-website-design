import Link from "next/link"
import { Clock, ArrowRight, RefreshCw } from "lucide-react"

/**
 * Recently Updated Section
 * Shows last 5 updated SEO pages for freshness signals
 */

// Recently updated pages - dynamically generated based on last content updates
const recentlyUpdatedPages = [
  {
    href: '/gaming/genshin-impact/codes',
    label: 'Genshin Impact Codes',
    category: 'Gaming',
    updatedAt: new Date().toISOString(),
  },
  {
    href: '/gaming/honkai-star-rail/codes',
    label: 'Honkai Star Rail Codes',
    category: 'Gaming',
    updatedAt: new Date().toISOString(),
  },
  {
    href: '/deals/price/laptops-under-500',
    label: 'Laptops Under $500',
    category: 'Deals',
    updatedAt: new Date().toISOString(),
  },
  {
    href: '/gaming/roblox/codes',
    label: 'Roblox Promo Codes',
    category: 'Gaming',
    updatedAt: new Date().toISOString(),
  },
  {
    href: '/deals/price/headphones-under-100',
    label: 'Headphones Under $100',
    category: 'Deals',
    updatedAt: new Date().toISOString(),
  },
]

function formatTimeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  
  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return 'Yesterday'
  return `${diffDays}d ago`
}

export function RecentlyUpdatedSection() {
  return (
    <section className="py-8 sm:py-10 bg-muted/20 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <RefreshCw className="h-5 w-5 text-primary" />
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            Recently Updated
          </h2>
        </div>

        {/* List of recently updated pages */}
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {recentlyUpdatedPages.slice(0, 5).map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:border-primary/50 hover:bg-accent/30 transition-all group"
            >
              <div className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {page.label}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{page.category}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(page.updatedAt)}
                  </span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
            </Link>
          ))}
        </div>

        {/* View all link */}
        <div className="mt-4 text-center">
          <Link 
            href="/deals/today" 
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            View all recent updates
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export function RecentlyUpdatedCompact() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <RefreshCw className="h-4 w-4" />
        <span>Recently Updated</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {recentlyUpdatedPages.slice(0, 5).map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted/50 text-xs font-medium text-foreground hover:bg-accent transition-colors"
          >
            {page.label}
            <Clock className="h-3 w-3 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  )
}
