import Link from "next/link"
import { ArrowRight, Gamepad2, Tag, TrendingUp, DollarSign, Sparkles } from "lucide-react"

/**
 * Internal Links Widget
 * Automatically shows 4-6 related pages based on current page type
 * Improves internal link structure for SEO
 */

type PageType = 'gaming' | 'deals' | 'brand' | 'category' | 'general'

interface InternalLinksWidgetProps {
  pageType: PageType
  currentSlug?: string
  category?: string
  priceRange?: number
  className?: string
}

// Gaming-related pages
const gamingPages = [
  { href: '/gaming/genshin-impact/codes', label: 'Genshin Impact Codes', icon: Gamepad2 },
  { href: '/gaming/roblox/codes', label: 'Roblox Promo Codes', icon: Gamepad2 },
  { href: '/gaming/honkai-star-rail/codes', label: 'Honkai Star Rail Codes', icon: Gamepad2 },
  { href: '/gaming/blox-fruits/codes', label: 'Blox Fruits Codes', icon: Gamepad2 },
  { href: '/gaming/raid-shadow-legends/codes', label: 'Raid Shadow Legends Codes', icon: Gamepad2 },
  { href: '/gaming/best-codes', label: 'Best Gaming Codes', icon: TrendingUp },
  { href: '/gaming/free-rewards', label: 'Free Rewards', icon: Sparkles },
  { href: '/gaming/today', label: "Today's Gaming Codes", icon: Sparkles },
]

// Deal pages by category
const dealPages = {
  electronics: [
    { href: '/deals/price/laptops-under-500', label: 'Laptops Under $500', icon: Tag },
    { href: '/deals/price/laptops-under-1000', label: 'Laptops Under $1000', icon: Tag },
    { href: '/deals/price/headphones-under-100', label: 'Headphones Under $100', icon: Tag },
    { href: '/deals/price/tvs-under-500', label: 'TVs Under $500', icon: Tag },
    { href: '/deals/price/monitors-under-200', label: 'Monitors Under $200', icon: Tag },
    { href: '/deals/top/electronics', label: 'Top Electronics Deals', icon: TrendingUp },
  ],
  fashion: [
    { href: '/deals/cheap/sneakers', label: 'Cheap Sneakers', icon: DollarSign },
    { href: '/deals/cheap/jackets', label: 'Cheap Jackets', icon: DollarSign },
    { href: '/deals/price/sneakers-under-100', label: 'Sneakers Under $100', icon: Tag },
    { href: '/deals/top/fashion', label: 'Top Fashion Deals', icon: TrendingUp },
    { href: '/brands/nike', label: 'Nike Deals', icon: Tag },
    { href: '/brands/adidas', label: 'Adidas Deals', icon: Tag },
  ],
  home: [
    { href: '/deals/price/air-fryers-under-100', label: 'Air Fryers Under $100', icon: Tag },
    { href: '/deals/price/vacuums-under-200', label: 'Vacuums Under $200', icon: Tag },
    { href: '/deals/top/home', label: 'Top Home Deals', icon: TrendingUp },
    { href: '/deals/cheap/furniture', label: 'Cheap Furniture', icon: DollarSign },
  ],
  gaming: [
    { href: '/deals/top/gaming', label: 'Top Gaming Deals', icon: TrendingUp },
    { href: '/deals/price/gaming-headsets-under-100', label: 'Gaming Headsets Under $100', icon: Tag },
    { href: '/deals/cheap/controllers', label: 'Cheap Controllers', icon: DollarSign },
  ],
  default: [
    { href: '/deals/today', label: "Today's Deals", icon: Sparkles },
    { href: '/deals/trending', label: 'Trending Deals', icon: TrendingUp },
    { href: '/deals/top/laptops', label: 'Top Laptop Deals', icon: TrendingUp },
    { href: '/deals/price/headphones-under-100', label: 'Headphones Under $100', icon: Tag },
    { href: '/deals/cheap/sneakers', label: 'Cheap Sneakers', icon: DollarSign },
    { href: '/guides', label: 'Buying Guides', icon: Tag },
  ],
}

// Brand pages
const brandPages = [
  { href: '/brands/apple', label: 'Apple Deals', icon: Tag },
  { href: '/brands/samsung', label: 'Samsung Deals', icon: Tag },
  { href: '/brands/nike', label: 'Nike Deals', icon: Tag },
  { href: '/brands/sony', label: 'Sony Deals', icon: Tag },
  { href: '/brands/dyson', label: 'Dyson Deals', icon: Tag },
  { href: '/brands/bose', label: 'Bose Deals', icon: Tag },
]

function getRelatedPages(
  pageType: PageType, 
  currentSlug?: string, 
  category?: string
): { href: string; label: string; icon: typeof Tag }[] {
  switch (pageType) {
    case 'gaming':
      return gamingPages.filter(p => !currentSlug || !p.href.includes(currentSlug))
    
    case 'deals':
      // Get category-specific deals if available
      const categoryKey = category?.toLowerCase() as keyof typeof dealPages
      const categoryDeals = dealPages[categoryKey] || dealPages.default
      return categoryDeals.filter(p => !currentSlug || !p.href.includes(currentSlug))
    
    case 'brand':
      return brandPages.filter(p => !currentSlug || !p.href.includes(currentSlug))
    
    case 'category':
      return dealPages.default.filter(p => !currentSlug || !p.href.includes(currentSlug))
    
    default:
      return [
        ...gamingPages.slice(0, 2),
        ...dealPages.default.slice(0, 2),
        ...brandPages.slice(0, 2),
      ]
  }
}

export function InternalLinksWidget({ 
  pageType, 
  currentSlug, 
  category,
  className = '' 
}: InternalLinksWidgetProps) {
  const relatedPages = getRelatedPages(pageType, currentSlug, category).slice(0, 6)

  if (relatedPages.length === 0) return null

  return (
    <div className={`bg-muted/30 rounded-xl p-4 sm:p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        Related Pages
      </h3>
      <div className="grid gap-2 sm:grid-cols-2">
        {relatedPages.map((page) => {
          const Icon = page.icon
          return (
            <Link
              key={page.href}
              href={page.href}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors group"
            >
              <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                {page.label}
              </span>
              <ArrowRight className="h-3 w-3 ml-auto text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Compact version for inline use
 */
export function InternalLinksCompact({ 
  pageType, 
  currentSlug,
  limit = 4,
}: { 
  pageType: PageType
  currentSlug?: string
  limit?: number
}) {
  const relatedPages = getRelatedPages(pageType, currentSlug).slice(0, limit)

  return (
    <div className="flex flex-wrap gap-2">
      {relatedPages.map((page) => (
        <Link
          key={page.href}
          href={page.href}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-accent/50 hover:bg-accent rounded-full transition-colors"
        >
          {page.label}
        </Link>
      ))}
    </div>
  )
}
