import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`text-sm ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-1">
        {/* Home */}
        <li className="flex items-center">
          <Link 
            href="/" 
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        
        <li className="flex items-center">
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 mx-1" />
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1
          
          return (
            <li key={index} className="flex items-center">
              {item.href && !isLast ? (
                <Link 
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span 
                  className={isLast ? "text-foreground font-medium" : "text-muted-foreground"}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              
              {!isLast && (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 mx-1" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// Generate schema.org BreadcrumbList JSON-LD
export function generateBreadcrumbSchema(items: BreadcrumbItem[], baseUrl: string = "https://savesmart.bio") {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.label,
        item: item.href ? `${baseUrl}${item.href}` : undefined
      }))
    ]
  }
}

// Pre-built breadcrumb configs for common pages
export function getGameBreadcrumbs(gameName: string, gameSlug: string): BreadcrumbItem[] {
  return [
    { label: "Gaming", href: "/gaming" },
    { label: gameName }
  ]
}

export function getGameCodesTodayBreadcrumbs(gameName: string, gameSlug: string): BreadcrumbItem[] {
  return [
    { label: "Gaming", href: "/gaming" },
    { label: gameName, href: `/gaming/${gameSlug}` },
    { label: "Codes Today" }
  ]
}

export function getGameMonthlyBreadcrumbs(gameName: string, gameSlug: string, monthYear: string): BreadcrumbItem[] {
  return [
    { label: "Gaming", href: "/gaming" },
    { label: gameName, href: `/gaming/${gameSlug}` },
    { label: `${monthYear} Codes` }
  ]
}

export function getAllGamesBreadcrumbs(): BreadcrumbItem[] {
  return [
    { label: "Gaming", href: "/gaming" },
    { label: "All Games" }
  ]
}
