import Link from "next/link"
import { 
  Tag, 
  TrendingUp, 
  Clock, 
  Sparkles, 
  Gamepad2, 
  BookOpen,
  Store,
  Folder,
  Flame,
  Gift,
  ArrowRight
} from "lucide-react"

interface RelatedLink {
  href: string
  label: string
  icon?: typeof Tag
  description?: string
  badge?: string
}

interface RelatedDealsSectionProps {
  title?: string
  subtitle?: string
  className?: string
  variant?: 'default' | 'compact' | 'grid'
  excludeLinks?: string[]
  showDescription?: boolean
}

// Standard related pages for site-wide internal linking
const defaultRelatedLinks: RelatedLink[] = [
  { 
    href: "/deals", 
    label: "All Deals", 
    icon: Tag,
    description: "Browse 1,000+ verified deals",
    badge: "Popular"
  },
  { 
    href: "/trending-deals", 
    label: "Trending Deals", 
    icon: TrendingUp,
    description: "Hot deals selling fast",
    badge: "Hot"
  },
  { 
    href: "/latest-deals", 
    label: "Latest Deals", 
    icon: Clock,
    description: "Newest deals added today"
  },
  { 
    href: "/deals/today", 
    label: "Today's Deals", 
    icon: Flame,
    description: "Limited time offers"
  },
  { 
    href: "/deal-finder", 
    label: "AI Deal Finder", 
    icon: Sparkles,
    description: "Personalized deal search",
    badge: "AI"
  },
  { 
    href: "/gaming", 
    label: "Gaming Codes", 
    icon: Gamepad2,
    description: "Free promo codes & rewards"
  },
  { 
    href: "/categories", 
    label: "Categories", 
    icon: Folder,
    description: "Browse by category"
  },
  { 
    href: "/compare", 
    label: "Compare Products", 
    icon: Store,
    description: "Side-by-side comparisons"
  },
  { 
    href: "/guides", 
    label: "Buying Guides", 
    icon: BookOpen,
    description: "Expert recommendations"
  },
  { 
    href: "/blog", 
    label: "Savings Tips", 
    icon: Gift,
    description: "Money-saving strategies"
  },
]

// Icon color mapping for visual variety
const iconColors: Record<string, string> = {
  "/deals": "text-blue-500",
  "/trending-deals": "text-orange-500",
  "/latest-deals": "text-green-500",
  "/deals/today": "text-red-500",
  "/deal-finder": "text-purple-500",
  "/gaming": "text-emerald-500",
  "/categories": "text-indigo-500",
  "/compare": "text-cyan-500",
  "/guides": "text-amber-500",
  "/blog": "text-pink-500",
}

// Badge color mapping
const badgeColors: Record<string, string> = {
  "Popular": "bg-blue-500/10 text-blue-600",
  "Hot": "bg-orange-500/10 text-orange-600",
  "AI": "bg-purple-500/10 text-purple-600",
  "New": "bg-green-500/10 text-green-600",
}

export function RelatedDealsSection({
  title = "Explore More Deals",
  subtitle,
  className = "",
  variant = 'default',
  excludeLinks = [],
  showDescription = false,
}: RelatedDealsSectionProps) {
  const links = defaultRelatedLinks.filter(
    link => !excludeLinks.includes(link.href)
  )

  if (variant === 'compact') {
    return (
      <section className={`py-8 border-t border-border ${className}`}>
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <h2 className="text-lg font-semibold text-foreground mb-4">{title}</h2>
          <div className="flex flex-wrap gap-2">
            {links.slice(0, 8).map((link) => {
              const Icon = link.icon || Tag
              const iconColor = iconColors[link.href] || "text-primary"
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border hover:border-primary/50 hover:bg-primary/5 text-sm font-medium text-foreground transition-colors"
                >
                  <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'grid') {
    return (
      <section className={`py-10 md:py-12 border-t border-border bg-muted/30 ${className}`}>
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            {subtitle && (
              <p className="mt-2 text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {links.slice(0, 10).map((link) => {
              const Icon = link.icon || Tag
              const iconColor = iconColors[link.href] || "text-primary"
              const badgeColor = link.badge ? badgeColors[link.badge] : ""
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary hover:shadow-md transition-all"
                >
                  <div className={`p-3 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors`}>
                    <Icon className={`h-6 w-6 ${iconColor}`} />
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {link.label}
                    </span>
                    {link.badge && (
                      <span className={`ml-2 inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold ${badgeColor}`}>
                        {link.badge}
                      </span>
                    )}
                  </div>
                  {showDescription && link.description && (
                    <p className="text-xs text-muted-foreground text-center line-clamp-2">
                      {link.description}
                    </p>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  // Default variant - horizontal scroll on mobile, grid on desktop
  return (
    <section className={`py-10 md:py-12 border-t border-border ${className}`}>
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <Link 
            href="/deals" 
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            View All Deals
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {links.slice(0, 6).map((link) => {
            const Icon = link.icon || Tag
            const iconColor = iconColors[link.href] || "text-primary"
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Icon className={`h-5 w-5 ${iconColor}`} />
                <span className="text-sm font-medium text-foreground text-center">
                  {link.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Store-specific related links
export function StoreRelatedDeals({ 
  storeName, 
  storeSlug,
  className = "" 
}: { 
  storeName: string
  storeSlug: string
  className?: string 
}) {
  const storeLinks: RelatedLink[] = [
    { href: `/stores/${storeSlug}`, label: `${storeName} Deals`, icon: Store },
    { href: `/coupons/${storeSlug}`, label: `${storeName} Coupons`, icon: Tag },
    { href: "/trending-deals", label: "Trending Deals", icon: TrendingUp },
    { href: "/latest-deals", label: "Latest Deals", icon: Clock },
    { href: "/deal-finder", label: "AI Deal Finder", icon: Sparkles },
    { href: "/categories", label: "All Categories", icon: Folder },
  ]

  return (
    <section className={`py-10 md:py-12 border-t border-border ${className}`}>
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <h2 className="text-xl font-bold text-foreground mb-6">
          More Ways to Save at {storeName}
        </h2>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {storeLinks.map((link) => {
            const Icon = link.icon || Tag
            const iconColor = iconColors[link.href] || "text-primary"
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Icon className={`h-5 w-5 ${iconColor}`} />
                <span className="text-sm font-medium text-foreground text-center">
                  {link.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Category-specific related links
export function CategoryRelatedDeals({ 
  categoryName, 
  categorySlug,
  className = "" 
}: { 
  categoryName: string
  categorySlug: string
  className?: string 
}) {
  const categoryLinks: RelatedLink[] = [
    { href: `/deals/${categorySlug}`, label: `${categoryName} Deals`, icon: Tag },
    { href: `/best/${categorySlug}`, label: `Best ${categoryName}`, icon: TrendingUp },
    { href: `/deals/cheap/${categorySlug}`, label: `Cheap ${categoryName}`, icon: Gift },
    { href: "/trending-deals", label: "Trending Deals", icon: Flame },
    { href: "/deal-finder", label: "AI Deal Finder", icon: Sparkles },
    { href: "/guides", label: "Buying Guides", icon: BookOpen },
  ]

  return (
    <section className={`py-10 md:py-12 border-t border-border ${className}`}>
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <h2 className="text-xl font-bold text-foreground mb-6">
          More {categoryName} Savings
        </h2>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {categoryLinks.map((link) => {
            const Icon = link.icon || Tag
            const iconColor = iconColors[link.href] || "text-primary"
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Icon className={`h-5 w-5 ${iconColor}`} />
                <span className="text-sm font-medium text-foreground text-center">
                  {link.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Popular game links for internal linking
const popularGameLinks: RelatedLink[] = [
  { href: "/gaming/genshin-impact", label: "Genshin Impact Codes", icon: Gamepad2 },
  { href: "/gaming/raid-shadow-legends", label: "RAID Codes", icon: Gamepad2 },
  { href: "/gaming/fortnite", label: "Fortnite Codes", icon: Gamepad2 },
  { href: "/gaming/roblox", label: "Roblox Codes", icon: Gamepad2 },
  { href: "/gaming/call-of-duty-mobile", label: "COD Mobile Codes", icon: Gamepad2 },
  { href: "/gaming/honkai-star-rail", label: "Star Rail Codes", icon: Gamepad2 },
]

// Gaming-specific internal links for cross-linking
export function GamingRelatedLinks({ 
  currentGameSlug,
  className = "" 
}: { 
  currentGameSlug?: string
  className?: string 
}) {
  // Filter out current game if provided
  const gameLinks = currentGameSlug 
    ? popularGameLinks.filter(link => !link.href.includes(currentGameSlug))
    : popularGameLinks

  const hubLinks: RelatedLink[] = [
    { href: "/gaming", label: "All Gaming Codes", icon: Gamepad2 },
    { href: "/gaming/promo-codes", label: "Promo Codes", icon: Tag },
    { href: "/gaming/today", label: "Today's Codes", icon: Clock },
    { href: "/gaming/free-rewards", label: "Free Rewards", icon: Gift },
  ]

  return (
    <section className={`py-10 md:py-12 border-t border-border ${className}`}>
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        {/* Popular Games */}
        <h2 className="text-xl font-bold text-foreground mb-4">
          Popular Game Codes
        </h2>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-8">
          {gameLinks.slice(0, 6).map((link) => {
            const Icon = link.icon || Gamepad2
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-emerald-500 hover:bg-emerald-500/5 transition-colors"
              >
                <Icon className="h-5 w-5 text-emerald-500" />
                <span className="text-sm font-medium text-foreground text-center">
                  {link.label}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Hub Links */}
        <h3 className="text-lg font-semibold text-foreground mb-3">
          Explore Gaming Deals
        </h3>
        <div className="flex flex-wrap gap-2">
          {hubLinks.map((link) => {
            const Icon = link.icon || Tag
            return (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border hover:border-emerald-500/50 hover:bg-emerald-500/5 text-sm font-medium text-foreground transition-colors"
              >
                <Icon className="h-3.5 w-3.5 text-emerald-500" />
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
