import Link from "next/link"
import { ChevronRight, Tag, Store, MapPin, DollarSign, Award, Laptop, ArrowRight } from "lucide-react"
import { SITEMAP_CONFIG } from "@/lib/seo/sitemap-config"
import { cities } from "@/lib/cities"

// Link cluster types
interface LinkCluster {
  title: string
  links: { label: string; href: string }[]
  variant: "brands" | "stores" | "cities" | "price" | "categories" | "best" | "comparison"
}

interface SeoLinkGraphProps {
  // Page context to generate relevant links
  pageType: "category" | "brand" | "store" | "city" | "price" | "comparison" | "best"
  // Current page slug(s)
  categorySlug?: string
  brandSlug?: string
  storeSlug?: string
  citySlug?: string
  // Optional: limit total links
  maxLinksPerCluster?: number
  maxTotalLinks?: number
  className?: string
}

// Format helper functions
function formatSlugToName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Get top stores (prioritized)
const TOP_STORES = [
  "amazon", "best-buy", "walmart", "target", "costco",
  "apple", "nike", "samsung", "dell", "hp",
  "home-depot", "lowes", "wayfair", "nordstrom", "macys"
]

// Get top brands
const TOP_BRANDS = [
  "apple", "samsung", "sony", "dell", "hp", "lenovo", "lg",
  "nike", "adidas", "dyson", "bose", "microsoft", "google"
]

// Get top cities
const TOP_CITIES = [
  "new-york", "los-angeles", "chicago", "houston", "phoenix",
  "philadelphia", "san-antonio", "san-diego", "dallas", "san-jose"
]

// Price ranges for linking
const PRICE_RANGES = [
  { slug: "under-50", label: "Under $50" },
  { slug: "under-100", label: "Under $100" },
  { slug: "under-200", label: "Under $200" },
  { slug: "under-500", label: "Under $500" },
  { slug: "under-1000", label: "Under $1000" },
]

// Popular comparisons
const POPULAR_COMPARISONS = [
  { slug: "macbook-air-vs-dell-xps", label: "MacBook Air vs Dell XPS" },
  { slug: "iphone-vs-samsung-galaxy", label: "iPhone vs Samsung Galaxy" },
  { slug: "airpods-vs-sony-wf", label: "AirPods vs Sony WF" },
  { slug: "playstation-vs-xbox", label: "PlayStation vs Xbox" },
  { slug: "nike-vs-adidas", label: "Nike vs Adidas" },
]

// Variant styling configuration
const variantConfig = {
  brands: {
    icon: Tag,
    colorClass: "hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20",
    headerColor: "text-blue-600 dark:text-blue-400",
  },
  stores: {
    icon: Store,
    colorClass: "hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20",
    headerColor: "text-green-600 dark:text-green-400",
  },
  cities: {
    icon: MapPin,
    colorClass: "hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/20",
    headerColor: "text-purple-600 dark:text-purple-400",
  },
  price: {
    icon: DollarSign,
    colorClass: "hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20",
    headerColor: "text-emerald-600 dark:text-emerald-400",
  },
  categories: {
    icon: Laptop,
    colorClass: "hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20",
    headerColor: "text-orange-600 dark:text-orange-400",
  },
  best: {
    icon: Award,
    colorClass: "hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20",
    headerColor: "text-amber-600 dark:text-amber-400",
  },
  comparison: {
    icon: ArrowRight,
    colorClass: "hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/20",
    headerColor: "text-indigo-600 dark:text-indigo-400",
  },
}

// Generate link clusters based on page context
function generateClusters(props: SeoLinkGraphProps): LinkCluster[] {
  const { pageType, categorySlug, brandSlug, storeSlug, maxLinksPerCluster = 10 } = props
  const clusters: LinkCluster[] = []
  
  const categories = SITEMAP_CONFIG.categories.slice(0, 15)
  const stores = TOP_STORES.slice(0, maxLinksPerCluster)
  const brands = TOP_BRANDS.slice(0, maxLinksPerCluster)
  const topCities = TOP_CITIES.slice(0, maxLinksPerCluster)

  switch (pageType) {
    case "category":
      // Brand cluster: /deals/{category}/{brand}
      clusters.push({
        title: `Top ${formatSlugToName(categorySlug || "")} Brands`,
        variant: "brands",
        links: brands.map((brand) => ({
          label: formatSlugToName(brand),
          href: `/deals/${categorySlug}/${brand}`,
        })),
      })

      // City cluster: /deals/{category}/city/{city}
      clusters.push({
        title: `${formatSlugToName(categorySlug || "")} Deals by City`,
        variant: "cities",
        links: topCities.map((city) => ({
          label: formatSlugToName(city),
          href: `/deals/${categorySlug}/city/${city}`,
        })),
      })

      // Price cluster: /deals/price/{range}
      clusters.push({
        title: "Shop by Price",
        variant: "price",
        links: PRICE_RANGES.map((range) => ({
          label: range.label,
          href: `/deals/price/${range.slug}`,
        })),
      })

      // Store cluster: /stores/{store}/{category}
      clusters.push({
        title: `Shop ${formatSlugToName(categorySlug || "")} at Top Stores`,
        variant: "stores",
        links: stores.map((store) => ({
          label: formatSlugToName(store),
          href: `/stores/${store}/${categorySlug}`,
        })),
      })

      // Best deals: /best/{category}
      clusters.push({
        title: "Best Deals",
        variant: "best",
        links: [
          { label: `Best ${formatSlugToName(categorySlug || "")}`, href: `/best/${categorySlug}` },
          ...brands.slice(0, 5).map((brand) => ({
            label: `Best ${formatSlugToName(brand)} ${formatSlugToName(categorySlug || "")}`,
            href: `/best/${categorySlug}/${brand}`,
          })),
        ],
      })

      // Related categories
      clusters.push({
        title: "Related Categories",
        variant: "categories",
        links: categories
          .filter((cat) => cat !== categorySlug)
          .slice(0, maxLinksPerCluster)
          .map((cat) => ({
            label: formatSlugToName(cat),
            href: `/deals/${cat}`,
          })),
      })
      break

    case "brand":
      // Categories for this brand: /deals/{category}/{brand}
      clusters.push({
        title: `${formatSlugToName(brandSlug || "")} Categories`,
        variant: "categories",
        links: categories.slice(0, maxLinksPerCluster).map((cat) => ({
          label: formatSlugToName(cat),
          href: `/deals/${cat}/${brandSlug}`,
        })),
      })

      // Stores selling this brand
      clusters.push({
        title: `Shop ${formatSlugToName(brandSlug || "")} at`,
        variant: "stores",
        links: stores.map((store) => ({
          label: formatSlugToName(store),
          href: `/stores/${store}`,
        })),
      })

      // Best brand deals: /best/{category}/{brand}
      clusters.push({
        title: `Best ${formatSlugToName(brandSlug || "")} Deals`,
        variant: "best",
        links: categories.slice(0, 6).map((cat) => ({
          label: `Best ${formatSlugToName(cat)}`,
          href: `/best/${cat}/${brandSlug}`,
        })),
      })

      // Other brands
      clusters.push({
        title: "Other Popular Brands",
        variant: "brands",
        links: brands
          .filter((b) => b !== brandSlug)
          .slice(0, maxLinksPerCluster)
          .map((brand) => ({
            label: formatSlugToName(brand),
            href: `/brands/${brand}`,
          })),
      })
      break

    case "store":
      // Categories at this store: /stores/{store}/{category}
      clusters.push({
        title: `Shop by Category at ${formatSlugToName(storeSlug || "")}`,
        variant: "categories",
        links: categories.slice(0, maxLinksPerCluster).map((cat) => ({
          label: formatSlugToName(cat),
          href: `/stores/${storeSlug}/${cat}`,
        })),
      })

      // Price ranges at this store: /stores/{store}/price/{range}
      clusters.push({
        title: `${formatSlugToName(storeSlug || "")} Deals by Price`,
        variant: "price",
        links: PRICE_RANGES.map((range) => ({
          label: range.label,
          href: `/stores/${storeSlug}/price/${range.slug}`,
        })),
      })

      // Coupons
      clusters.push({
        title: "Coupons & Promo Codes",
        variant: "stores",
        links: [
          { label: `${formatSlugToName(storeSlug || "")} Coupons`, href: `/coupons/${storeSlug}` },
        ],
      })

      // Other stores
      clusters.push({
        title: "Other Popular Stores",
        variant: "stores",
        links: stores
          .filter((s) => s !== storeSlug)
          .slice(0, maxLinksPerCluster)
          .map((store) => ({
            label: formatSlugToName(store),
            href: `/stores/${store}`,
          })),
      })
      break

    case "city":
      // Categories in this city
      if (categorySlug) {
        clusters.push({
          title: `More ${formatSlugToName(categorySlug)} Deals`,
          variant: "categories",
          links: [
            { label: `All ${formatSlugToName(categorySlug)}`, href: `/deals/${categorySlug}` },
            ...brands.slice(0, 5).map((brand) => ({
              label: formatSlugToName(brand),
              href: `/deals/${categorySlug}/${brand}`,
            })),
          ],
        })
      }

      // Other cities
      clusters.push({
        title: "Deals in Other Cities",
        variant: "cities",
        links: topCities
          .filter((c) => c !== props.citySlug)
          .slice(0, maxLinksPerCluster)
          .map((city) => ({
            label: formatSlugToName(city),
            href: categorySlug ? `/deals/${categorySlug}/city/${city}` : `/deals/electronics/city/${city}`,
          })),
      })

      // Store links
      clusters.push({
        title: "Shop at Top Stores",
        variant: "stores",
        links: stores.map((store) => ({
          label: formatSlugToName(store),
          href: `/stores/${store}`,
        })),
      })
      break

    case "price":
      // Categories
      clusters.push({
        title: "Shop by Category",
        variant: "categories",
        links: categories.slice(0, maxLinksPerCluster).map((cat) => ({
          label: formatSlugToName(cat),
          href: `/deals/${cat}`,
        })),
      })

      // Other price ranges
      clusters.push({
        title: "Other Price Ranges",
        variant: "price",
        links: PRICE_RANGES.map((range) => ({
          label: range.label,
          href: `/deals/price/${range.slug}`,
        })),
      })

      // Stores
      clusters.push({
        title: "Shop at Top Stores",
        variant: "stores",
        links: stores.map((store) => ({
          label: formatSlugToName(store),
          href: `/stores/${store}`,
        })),
      })
      break

    case "comparison":
      // Related comparisons
      clusters.push({
        title: "More Comparisons",
        variant: "comparison",
        links: POPULAR_COMPARISONS.map((comp) => ({
          label: comp.label,
          href: `/compare/${comp.slug}`,
        })),
      })

      // Categories
      clusters.push({
        title: "Shop by Category",
        variant: "categories",
        links: categories.slice(0, maxLinksPerCluster).map((cat) => ({
          label: formatSlugToName(cat),
          href: `/deals/${cat}`,
        })),
      })

      // Best deals
      clusters.push({
        title: "Best Deals",
        variant: "best",
        links: categories.slice(0, 6).map((cat) => ({
          label: `Best ${formatSlugToName(cat)}`,
          href: `/best/${cat}`,
        })),
      })
      break

    case "best":
      // Categories
      clusters.push({
        title: "More Best Deal Categories",
        variant: "best",
        links: categories
          .filter((cat) => cat !== categorySlug)
          .slice(0, maxLinksPerCluster)
          .map((cat) => ({
            label: `Best ${formatSlugToName(cat)}`,
            href: `/best/${cat}`,
          })),
      })

      // Category page
      if (categorySlug) {
        clusters.push({
          title: `All ${formatSlugToName(categorySlug)} Deals`,
          variant: "categories",
          links: [
            { label: `Browse All ${formatSlugToName(categorySlug)}`, href: `/deals/${categorySlug}` },
            ...stores.slice(0, 5).map((store) => ({
              label: `at ${formatSlugToName(store)}`,
              href: `/stores/${store}/${categorySlug}`,
            })),
          ],
        })
      }

      // Stores
      clusters.push({
        title: "Shop at Top Stores",
        variant: "stores",
        links: stores.map((store) => ({
          label: formatSlugToName(store),
          href: `/stores/${store}`,
        })),
      })
      break
  }

  return clusters
}

// Count total links in all clusters
function countTotalLinks(clusters: LinkCluster[]): number {
  return clusters.reduce((total, cluster) => total + cluster.links.length, 0)
}

// Main component
export function SeoLinkGraph(props: SeoLinkGraphProps) {
  const { maxLinksPerCluster = 10, maxTotalLinks = 80, className = "" } = props
  
  let clusters = generateClusters({ ...props, maxLinksPerCluster })
  
  // Trim clusters if we exceed max total links
  let totalLinks = countTotalLinks(clusters)
  if (totalLinks > maxTotalLinks) {
    // Reduce links per cluster proportionally
    const targetPerCluster = Math.floor(maxTotalLinks / clusters.length)
    clusters = clusters.map((cluster) => ({
      ...cluster,
      links: cluster.links.slice(0, Math.min(targetPerCluster, maxLinksPerCluster)),
    }))
  }

  // Ensure minimum of 30 links by padding with more categories if needed
  totalLinks = countTotalLinks(clusters)
  if (totalLinks < 30) {
    const additionalCategories = SITEMAP_CONFIG.categories
      .slice(15, 30)
      .map((cat) => ({
        label: formatSlugToName(cat),
        href: `/deals/${cat}`,
      }))
    
    clusters.push({
      title: "Explore More Categories",
      variant: "categories",
      links: additionalCategories.slice(0, 30 - totalLinks),
    })
  }

  return (
    <nav aria-label="Related pages" className={`space-y-8 ${className}`}>
      {clusters.map((cluster, index) => {
        const config = variantConfig[cluster.variant]
        const Icon = config.icon

        return (
          <section key={index} className="py-4">
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${config.headerColor}`}>
              <Icon className="h-5 w-5" />
              {cluster.title}
            </h2>
            <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {cluster.links.map((link, linkIndex) => (
                <Link
                  key={linkIndex}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background text-sm font-medium transition-colors ${config.colorClass}`}
                >
                  <span className="truncate text-foreground">{link.label}</span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0 ml-auto" />
                </Link>
              ))}
            </div>
          </section>
        )
      })}
      
      {/* Link count indicator for SEO verification (hidden visually) */}
      <div className="sr-only" aria-hidden="true">
        Internal links: {countTotalLinks(clusters)}
      </div>
    </nav>
  )
}

// Export helper for getting link count (useful for SEO audits)
export function getSeoLinkCount(props: SeoLinkGraphProps): number {
  const clusters = generateClusters(props)
  return countTotalLinks(clusters)
}
