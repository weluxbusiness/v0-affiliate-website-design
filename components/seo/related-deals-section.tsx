import Link from "next/link"
import { ArrowRight, Sparkles, Store, Tag, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Deal, formatStoreName } from "@/lib/deal-types"
import { DealCard } from "@/components/deal-card"

interface RelatedDealsSectionProps {
  title: string
  subtitle?: string
  deals: Deal[]
  viewAllLink?: string
  viewAllText?: string
  variant?: "cards" | "compact" | "list"
  maxItems?: number
  icon?: "sparkles" | "store" | "tag" | "flame"
}

export function RelatedDealsSection({
  title,
  subtitle,
  deals,
  viewAllLink,
  viewAllText = "View All",
  variant = "cards",
  maxItems = 6,
  icon = "sparkles"
}: RelatedDealsSectionProps) {
  const displayDeals = deals.slice(0, maxItems)
  
  if (displayDeals.length === 0) return null

  const IconComponent = {
    sparkles: Sparkles,
    store: Store,
    tag: Tag,
    flame: Flame
  }[icon]

  return (
    <section className="py-10 md:py-12 border-t border-border">
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <IconComponent className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary uppercase tracking-wider">Related</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            {subtitle && (
              <p className="mt-1 text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {viewAllLink && (
            <Button variant="outline" className="gap-2 shrink-0" asChild>
              <Link href={viewAllLink}>
                {viewAllText}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        {/* Deal Cards */}
        {variant === "cards" && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {displayDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}

        {/* Compact List */}
        {variant === "compact" && (
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
            {displayDeals.map((deal) => (
              <a 
                key={deal.id}
                href={deal.affiliate_link}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="overflow-hidden border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-200 group">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {deal.title}
                        </h3>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {deal.discount_percentage}% OFF
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{deal.store}</span>
                        <span className="text-border">|</span>
                        <span className="text-secondary font-semibold">${deal.deal_price.toFixed(2)}</span>
                        <span className="line-through">${deal.original_price.toFixed(2)}</span>
                      </div>
                    </div>
                    <Button size="sm" className="shrink-0">
                      Get Deal
                    </Button>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        )}

        {/* Simple List */}
        {variant === "list" && (
          <div className="flex flex-wrap gap-3">
            {displayDeals.map((deal) => (
              <a
                key={deal.id}
                href={deal.affiliate_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:border-primary/50 hover:bg-muted text-sm font-medium text-foreground transition-colors"
              >
                <Tag className="h-4 w-4 text-primary" />
                {deal.title.slice(0, 40)}{deal.title.length > 40 ? "..." : ""}
                <Badge variant="secondary" className="text-xs">
                  {deal.discount_percentage}% OFF
                </Badge>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// Similar Stores Section
interface SimilarStoresSectionProps {
  currentStore: string
  stores: string[]
  maxItems?: number
}

export function SimilarStoresSection({
  currentStore,
  stores,
  maxItems = 8
}: SimilarStoresSectionProps) {
  const filteredStores = stores.filter(s => s !== currentStore).slice(0, maxItems)
  
  if (filteredStores.length === 0) return null

  return (
    <section className="py-10 md:py-12 border-t border-border bg-muted/30">
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="flex items-center gap-2 mb-6">
          <Store className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Similar Stores to {formatStoreName(currentStore)}</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {filteredStores.map(store => (
            <Link
              key={store}
              href={`/stores/${store}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-background border border-border hover:border-primary/50 hover:shadow-md transition-all text-sm font-medium"
            >
              <Store className="h-4 w-4 text-muted-foreground" />
              {formatStoreName(store)} Deals
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// Trending in Category Section
interface TrendingInCategorySectionProps {
  category: string
  categorySlug: string
  deals: Deal[]
  maxItems?: number
}

export function TrendingInCategorySection({
  category,
  categorySlug,
  deals,
  maxItems = 4
}: TrendingInCategorySectionProps) {
  const displayDeals = deals.slice(0, maxItems)
  
  if (displayDeals.length === 0) return null

  return (
    <RelatedDealsSection
      title={`Trending in ${category}`}
      subtitle={`Popular ${category.toLowerCase()} deals right now`}
      deals={displayDeals}
      viewAllLink={`/deals/${categorySlug}`}
      viewAllText={`All ${category} Deals`}
      icon="flame"
      variant="compact"
    />
  )
}
