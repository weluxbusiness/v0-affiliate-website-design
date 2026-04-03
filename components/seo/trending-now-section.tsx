import Link from "next/link"
import { Flame, Gamepad2, Tag, ArrowRight, Clock } from "lucide-react"

/**
 * SEO Boost Section - "Trending Now"
 * Visible above the fold to maximize internal link equity
 * Links to high-priority pages for Google crawl boost
 */

// High-volume gaming searches - links to main game pages for better SEO
const trendingGamingPages = [
  { 
    href: '/gaming/genshin-impact', 
    label: 'Genshin Impact Codes',
    description: 'Free Primogems & rewards',
  },
  { 
    href: '/gaming/raid-shadow-legends', 
    label: 'RAID Shadow Legends Codes',
    description: 'Free shards & energy',
  },
  { 
    href: '/gaming/roblox', 
    label: 'Roblox Promo Codes',
    description: 'Free items & accessories',
  },
  { 
    href: '/gaming/fortnite', 
    label: 'Fortnite Codes',
    description: 'Free V-Bucks & skins',
  },
]

const trendingDealPages = [
  { 
    href: '/deals/price/laptops-under-500', 
    label: 'Laptops Under $500',
    description: 'Best budget laptops',
  },
  { 
    href: '/deals/price/headphones-under-100', 
    label: 'Headphones Under $100',
    description: 'Top-rated audio deals',
  },
  { 
    href: '/deals/price/tvs-under-500', 
    label: 'TVs Under $500',
    description: '4K TV deals',
  },
  { 
    href: '/deals/price/sneakers-under-100', 
    label: 'Sneakers Under $100',
    description: 'Top shoe deals',
  },
]

export function TrendingNowSection() {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-b from-background to-muted/30 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Trending Now
            </h2>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Updated: {currentDate}</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Gaming Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Gamepad2 className="h-4 w-4 text-emerald-500" />
              <span>Hot Gaming Codes</span>
            </div>
            <div className="space-y-2">
              {trendingGamingPages.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:border-primary/50 hover:bg-accent/50 transition-all group"
                >
                  <div>
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {page.label}
                    </span>
                    <p className="text-xs text-muted-foreground">{page.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* Deals Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Tag className="h-4 w-4 text-blue-500" />
              <span>Top Deal Pages</span>
            </div>
            <div className="space-y-2">
              {trendingDealPages.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:border-primary/50 hover:bg-accent/50 transition-all group"
                >
                  <div>
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {page.label}
                    </span>
                    <p className="text-xs text-muted-foreground">{page.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links Footer - More gaming links for SEO */}
        <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-3 text-sm">
          <Link href="/gaming" className="text-muted-foreground hover:text-primary transition-colors font-medium">
            All Gaming Codes
          </Link>
          <span className="text-border">|</span>
          <Link href="/gaming/promo-codes" className="text-muted-foreground hover:text-primary transition-colors">
            Promo Codes
          </Link>
          <span className="text-border">|</span>
          <Link href="/gaming/today" className="text-muted-foreground hover:text-primary transition-colors">
            Today&apos;s Codes
          </Link>
          <span className="text-border">|</span>
          <Link href="/gaming/free-rewards" className="text-muted-foreground hover:text-primary transition-colors">
            Free Rewards
          </Link>
          <span className="text-border">|</span>
          <Link href="/deals/today" className="text-muted-foreground hover:text-primary transition-colors">
            Today&apos;s Deals
          </Link>
          <span className="text-border">|</span>
          <Link href="/trending-deals" className="text-muted-foreground hover:text-primary transition-colors">
            Trending Deals
          </Link>
        </div>
      </div>
    </section>
  )
}
