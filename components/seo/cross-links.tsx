import Link from "next/link"
import { ArrowRight, Gamepad2, Tag, TrendingUp, DollarSign, BookOpen } from "lucide-react"

interface CrossLinkProps {
  type: 'gaming' | 'deals' | 'blog' | 'all'
  currentPath?: string
  category?: string
  limit?: number
}

const gamingLinks = [
  { href: '/gaming', label: 'All Gaming Codes', icon: Gamepad2 },
  { href: '/gaming/promo-codes', label: 'Promo Codes', icon: Tag },
  { href: '/gaming/best-codes', label: 'Best Codes', icon: TrendingUp },
  { href: '/gaming/free-rewards', label: 'Free Rewards', icon: Tag },
  { href: '/gaming/today', label: "Today's Codes", icon: Tag },
]

const dealLinks = [
  { href: '/deals', label: 'All Deals', icon: Tag },
  { href: '/deals/trending', label: 'Trending Deals', icon: TrendingUp },
  { href: '/deals/top/headphones', label: 'Top Headphones', icon: TrendingUp },
  { href: '/deals/top/laptops', label: 'Top Laptops', icon: TrendingUp },
  { href: '/deals/cheap/sneakers', label: 'Cheap Sneakers', icon: DollarSign },
  { href: '/deals/price/electronics-under-100', label: 'Electronics Under $100', icon: DollarSign },
]

const blogLinks = [
  { href: '/blog', label: 'Blog', icon: BookOpen },
  { href: '/blog/category/deals', label: 'Deal Guides', icon: BookOpen },
  { href: '/blog/category/tips', label: 'Shopping Tips', icon: BookOpen },
]

export function CrossLinks({ type, currentPath, category, limit = 5 }: CrossLinkProps) {
  const getLinks = () => {
    switch (type) {
      case 'gaming':
        return gamingLinks
      case 'deals':
        return dealLinks
      case 'blog':
        return blogLinks
      case 'all':
        return [...gamingLinks.slice(0, 2), ...dealLinks.slice(0, 2), ...blogLinks.slice(0, 1)]
      default:
        return []
    }
  }

  const links = getLinks()
    .filter(link => link.href !== currentPath)
    .slice(0, limit)

  if (links.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => {
        const Icon = link.icon
        return (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-xs font-medium text-foreground transition-colors"
          >
            <Icon className="h-3 w-3" />
            {link.label}
          </Link>
        )
      })}
    </div>
  )
}

// Compact footer links for end of pages
export function RelatedSectionsFooter({ currentSection }: { currentSection: 'gaming' | 'deals' | 'blog' }) {
  return (
    <div className="border-t border-border pt-8 mt-8">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
        Explore More
      </h3>
      <div className="grid gap-4 sm:grid-cols-3">
        {currentSection !== 'deals' && (
          <Link
            href="/deals"
            className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors"
          >
            <Tag className="h-6 w-6 text-primary" />
            <div>
              <p className="font-medium text-foreground">Shop Deals</p>
              <p className="text-xs text-muted-foreground">Electronics, Fashion & More</p>
            </div>
          </Link>
        )}
        {currentSection !== 'gaming' && (
          <Link
            href="/gaming"
            className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors"
          >
            <Gamepad2 className="h-6 w-6 text-secondary" />
            <div>
              <p className="font-medium text-foreground">Gaming Codes</p>
              <p className="text-xs text-muted-foreground">Free In-Game Rewards</p>
            </div>
          </Link>
        )}
        {currentSection !== 'blog' && (
          <Link
            href="/blog"
            className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors"
          >
            <BookOpen className="h-6 w-6 text-amber-500" />
            <div>
              <p className="font-medium text-foreground">Read Blog</p>
              <p className="text-xs text-muted-foreground">Guides & Tips</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}

// Category-specific cross-links
export function CategoryCrossLinksCompact({ category }: { category: string }) {
  const categorySlug = category.toLowerCase().replace(/\s+/g, '-')
  
  const links = [
    { href: `/best/${categorySlug}`, label: `Best ${category}` },
    { href: `/deals/top/${categorySlug}`, label: `Top ${category} Deals` },
    { href: `/deals/cheap/${categorySlug}`, label: `Cheap ${category}` },
    { href: `/deals/price/${categorySlug}-under-100`, label: `${category} Under $100` },
    { href: `/deals/price/${categorySlug}-under-500`, label: `${category} Under $500` },
  ]
  
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-xs font-medium text-foreground transition-colors"
        >
          {link.label}
          <ArrowRight className="h-3 w-3" />
        </Link>
      ))}
    </div>
  )
}
