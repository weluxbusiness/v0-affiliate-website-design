import Link from "next/link"

/**
 * Contextual Internal Links
 * Renders natural-sounding internal links within content
 * For SEO internal link injection
 */

interface ContextualLink {
  href: string
  text: string
  prefix?: string
  suffix?: string
}

interface ContextualLinksProps {
  links: ContextualLink[]
  className?: string
}

// Pre-defined link templates for different page types
export const dealContextualLinks: ContextualLink[] = [
  { href: '/deals/price/laptops-under-1000', text: 'laptops under $1000', prefix: 'Also check our' },
  { href: '/deals/today', text: "today's best deals", prefix: 'Browse' },
  { href: '/deals/trending', text: 'trending deals', prefix: 'See what&apos;s popular in our' },
  { href: '/guides', text: 'buying guides', prefix: 'Need help? Read our expert' },
  { href: '/deals/price/headphones-under-100', text: 'headphones under $100', prefix: 'Looking for audio? See' },
]

export const gamingContextualLinks: ContextualLink[] = [
  { href: '/gaming/best-codes', text: 'best gaming codes', prefix: 'Check out the' },
  { href: '/gaming/free-rewards', text: 'free rewards', prefix: 'Get more' },
  { href: '/gaming/today', text: "today's codes", prefix: 'See all of' },
  { href: '/gaming/promo-codes', text: 'all promo codes', prefix: 'Browse' },
  { href: '/gaming/genshin-impact/codes', text: 'Genshin Impact codes', prefix: 'Popular:' },
]

export const brandContextualLinks: ContextualLink[] = [
  { href: '/brands', text: 'all brands', prefix: 'Explore' },
  { href: '/brands/apple', text: 'Apple deals', prefix: 'Check out' },
  { href: '/brands/nike', text: 'Nike deals', prefix: 'See' },
  { href: '/deals/today', text: "today's deals", prefix: 'Browse' },
  { href: '/categories', text: 'all categories', prefix: 'Shop by' },
]

/**
 * Renders contextual internal links as a styled list
 */
export function ContextualLinksList({ links, className = '' }: ContextualLinksProps) {
  return (
    <div className={`mt-6 p-4 bg-muted/50 rounded-lg ${className}`}>
      <p className="text-sm font-medium text-foreground mb-3">Related content:</p>
      <ul className="space-y-2 text-sm">
        {links.slice(0, 5).map((link, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-primary mt-0.5">→</span>
            <span className="text-muted-foreground">
              {link.prefix && <span>{link.prefix} </span>}
              <Link 
                href={link.href} 
                className="text-primary hover:underline font-medium"
              >
                {link.text}
              </Link>
              {link.suffix && <span> {link.suffix}</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Renders contextual links as inline text paragraphs
 */
export function ContextualLinksInline({ links, className = '' }: ContextualLinksProps) {
  return (
    <div className={`text-sm text-muted-foreground leading-relaxed ${className}`}>
      {links.slice(0, 5).map((link, index) => (
        <span key={index}>
          {link.prefix && <span>{link.prefix} </span>}
          <Link 
            href={link.href} 
            className="text-primary hover:underline"
          >
            {link.text}
          </Link>
          {link.suffix && <span> {link.suffix}</span>}
          {index < links.length - 1 && <span className="mx-2">•</span>}
        </span>
      ))}
    </div>
  )
}

/**
 * Get contextual links based on page type and current path
 */
export function getContextualLinks(
  pageType: 'deals' | 'gaming' | 'brand' | 'category',
  currentPath?: string
): ContextualLink[] {
  let links: ContextualLink[] = []
  
  switch (pageType) {
    case 'gaming':
      links = gamingContextualLinks
      break
    case 'brand':
      links = brandContextualLinks
      break
    case 'deals':
    case 'category':
    default:
      links = dealContextualLinks
      break
  }
  
  // Filter out current path
  if (currentPath) {
    links = links.filter(link => link.href !== currentPath)
  }
  
  return links
}
