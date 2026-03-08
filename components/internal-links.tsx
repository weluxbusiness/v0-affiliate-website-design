import Link from "next/link"
import { Tag, Store, Folder, ArrowRight } from "lucide-react"
import { formatStoreName } from "@/lib/deal-types"

interface InternalLinksProps {
  type: 'stores' | 'categories' | 'coupons' | 'mixed'
  currentSlug?: string
  title?: string
  items: string[]
  maxItems?: number
}

export function InternalLinks({ 
  type, 
  currentSlug, 
  title, 
  items, 
  maxItems = 12 
}: InternalLinksProps) {
  const filteredItems = items
    .filter(item => item !== currentSlug)
    .slice(0, maxItems)
  
  if (filteredItems.length === 0) return null

  const getLink = (slug: string) => {
    switch (type) {
      case 'stores':
        return `/stores/${slug}`
      case 'coupons':
        return `/coupons/${slug}`
      case 'categories':
        return `/deals/${slug}`
      default:
        return `/deals/${slug}`
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'stores':
        return <Store className="h-4 w-4" />
      case 'coupons':
        return <Tag className="h-4 w-4" />
      case 'categories':
        return <Folder className="h-4 w-4" />
      default:
        return <ArrowRight className="h-4 w-4" />
    }
  }

  const getLabel = (slug: string) => {
    const name = formatStoreName(slug)
    switch (type) {
      case 'stores':
        return `${name} Deals`
      case 'coupons':
        return `${name} Coupons`
      case 'categories':
        return name
      default:
        return name
    }
  }

  const defaultTitle = type === 'stores' 
    ? 'More Store Deals' 
    : type === 'coupons' 
    ? 'More Coupon Codes' 
    : 'Related Categories'

  return (
    <section className="py-10 md:py-12 border-t border-border">
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {title || defaultTitle}
        </h2>
        <div className="flex flex-wrap gap-3">
          {filteredItems.map((slug) => (
            <Link
              key={slug}
              href={getLink(slug)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-muted text-sm font-medium text-foreground transition-colors"
            >
              {getIcon()}
              {getLabel(slug)}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

interface CrossLinkSectionProps {
  storeName: string
  storeSlug: string
  relatedStores: string[]
  relatedCategories: string[]
}

export function CrossLinkSection({
  storeName,
  storeSlug,
  relatedStores,
  relatedCategories,
}: CrossLinkSectionProps) {
  return (
    <div className="py-10 md:py-12 border-t border-border bg-muted/30">
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Related Stores */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              Similar Stores
            </h3>
            <div className="flex flex-wrap gap-2">
              {relatedStores.filter(s => s !== storeSlug).slice(0, 8).map(slug => (
                <Link
                  key={slug}
                  href={`/stores/${slug}`}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-background border border-border hover:border-primary/50 transition-colors"
                >
                  {formatStoreName(slug)}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories for this store */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Folder className="h-5 w-5 text-primary" />
              {storeName} Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {relatedCategories.slice(0, 8).map(category => (
                <Link
                  key={category}
                  href={`/stores/${storeSlug}/${category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-background border border-border hover:border-primary/50 transition-colors"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link 
              href={`/coupons/${storeSlug}`}
              className="text-primary hover:underline flex items-center gap-1"
            >
              <Tag className="h-4 w-4" />
              {storeName} Coupon Codes
            </Link>
            <Link 
              href={`/stores/${storeSlug}`}
              className="text-primary hover:underline flex items-center gap-1"
            >
              <Store className="h-4 w-4" />
              All {storeName} Deals
            </Link>
            <Link 
              href="/latest-deals"
              className="text-primary hover:underline"
            >
              Latest Deals
            </Link>
            <Link 
              href="/trending-deals"
              className="text-primary hover:underline"
            >
              Trending Deals
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

interface CategoryCrossLinksProps {
  categoryName: string
  categorySlug: string
  relatedCategories: string[]
  storesWithDeals: string[]
}

export function CategoryCrossLinks({
  categoryName,
  categorySlug,
  relatedCategories,
  storesWithDeals,
}: CategoryCrossLinksProps) {
  return (
    <div className="py-10 md:py-12 border-t border-border bg-muted/30">
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Related Categories */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Folder className="h-5 w-5 text-primary" />
              Related Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {relatedCategories.filter(c => c !== categorySlug).slice(0, 8).map(slug => (
                <Link
                  key={slug}
                  href={`/deals/${slug}`}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-background border border-border hover:border-primary/50 transition-colors"
                >
                  {formatStoreName(slug)}
                </Link>
              ))}
            </div>
          </div>

          {/* Stores with deals in this category */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              Shop {categoryName} At
            </h3>
            <div className="flex flex-wrap gap-2">
              {storesWithDeals.slice(0, 8).map(store => (
                <Link
                  key={store}
                  href={`/stores/${store.toLowerCase().replace(/\s+/g, '-')}/${categorySlug}`}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-background border border-border hover:border-primary/50 transition-colors"
                >
                  {store}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Best Deals Link */}
        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Explore More</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link 
              href={`/best/${categorySlug}`}
              className="text-primary hover:underline flex items-center gap-1"
            >
              Best {categoryName} Deals
            </Link>
            <Link 
              href={`/trending/${categorySlug}`}
              className="text-primary hover:underline"
            >
              Trending {categoryName}
            </Link>
            <Link 
              href="/deals"
              className="text-primary hover:underline"
            >
              All Deals
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
