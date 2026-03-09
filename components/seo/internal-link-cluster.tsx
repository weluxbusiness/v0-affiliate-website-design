"use client"

import Link from "next/link"
import { ChevronRight, Tag, Store, MapPin, Laptop, Award } from "lucide-react"

interface LinkItem {
  label: string
  href: string
  count?: number
}

interface InternalLinkClusterProps {
  title: string
  links: LinkItem[]
  variant?: "brands" | "stores" | "cities" | "categories" | "best"
  maxItems?: number
  className?: string
}

const variantConfig = {
  brands: {
    icon: Tag,
    colorClass: "hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20",
  },
  stores: {
    icon: Store,
    colorClass: "hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20",
  },
  cities: {
    icon: MapPin,
    colorClass: "hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/20",
  },
  categories: {
    icon: Laptop,
    colorClass: "hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20",
  },
  best: {
    icon: Award,
    colorClass: "hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20",
  },
}

export function InternalLinkCluster({
  title,
  links,
  variant = "categories",
  maxItems = 10,
  className = "",
}: InternalLinkClusterProps) {
  const config = variantConfig[variant]
  const Icon = config.icon
  const displayLinks = links.slice(0, maxItems)

  if (displayLinks.length === 0) {
    return null
  }

  return (
    <section className={`py-8 ${className}`}>
      <h2 className="text-lg font-semibold text-foreground mb-4">{title}</h2>
      <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {displayLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background transition-colors ${config.colorClass}`}
          >
            <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm font-medium text-foreground truncate">
              {link.label}
            </span>
            {link.count !== undefined && (
              <span className="ml-auto text-xs text-muted-foreground">
                ({link.count})
              </span>
            )}
            <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0 ml-auto" />
          </Link>
        ))}
      </div>
    </section>
  )
}

// Helper to generate link clusters from data
export function generateBrandLinks(
  categorySlug: string,
  brands: string[],
  formatBrandName: (slug: string) => string
): LinkItem[] {
  return brands.map((brand) => ({
    label: formatBrandName(brand),
    href: `/deals/${categorySlug}/${brand}`,
  }))
}

export function generateStoreLinks(
  categorySlug: string,
  stores: string[],
  formatStoreName: (slug: string) => string
): LinkItem[] {
  return stores.map((store) => ({
    label: formatStoreName(store),
    href: `/stores/${store}/${categorySlug}`,
  }))
}

export function generateCityLinks(
  categorySlug: string,
  cities: string[],
  formatCityName: (slug: string) => string
): LinkItem[] {
  return cities.map((city) => ({
    label: formatCityName(city),
    href: `/deals/${categorySlug}/city/${city}`,
  }))
}

export function generateBestLinks(
  categorySlug: string,
  brands: string[],
  formatBrandName: (slug: string) => string
): LinkItem[] {
  return brands.map((brand) => ({
    label: `Best ${formatBrandName(brand)}`,
    href: `/best/${categorySlug}/${brand}`,
  }))
}
