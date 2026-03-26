// Visual breadcrumb navigation with JSON-LD schema
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { BreadcrumbSchema } from './structured-data'

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
  className?: string
}

export function BreadcrumbNav({ items, className = '' }: BreadcrumbNavProps) {
  // Always include Home as the first item
  const allItems: BreadcrumbItem[] = [
    { name: 'Home', url: '/' },
    ...items,
  ]

  return (
    <>
      {/* JSON-LD Schema */}
      <BreadcrumbSchema items={allItems} />
      
      {/* Visual Breadcrumb */}
      <nav 
        aria-label="Breadcrumb" 
        className={`flex items-center gap-1 text-sm text-muted-foreground ${className}`}
      >
        <ol className="flex items-center gap-1 flex-wrap">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1
            
            return (
              <li key={item.url} className="flex items-center gap-1">
                {index === 0 ? (
                  // Home icon for first item
                  <Link 
                    href={item.url}
                    className="flex items-center hover:text-foreground transition-colors"
                    aria-label="Home"
                  >
                    <Home className="h-4 w-4" />
                  </Link>
                ) : isLast ? (
                  // Current page (not a link)
                  <span 
                    className="text-foreground font-medium truncate max-w-[200px]"
                    aria-current="page"
                  >
                    {item.name}
                  </span>
                ) : (
                  // Middle items (links)
                  <Link 
                    href={item.url}
                    className="hover:text-foreground transition-colors truncate max-w-[150px]"
                  >
                    {item.name}
                  </Link>
                )}
                
                {!isLast && (
                  <ChevronRight className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}

// Helper to generate common breadcrumb patterns
export function generateDealsBreadcrumbs(
  category?: string,
  categoryName?: string,
  brand?: string,
  brandName?: string,
  store?: string,
  storeName?: string
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { name: 'Deals', url: '/deals' },
  ]

  if (category && categoryName) {
    items.push({ name: categoryName, url: `/deals/${category}` })
  }

  if (brand && brandName) {
    const brandUrl = category ? `/deals/${category}/${brand}` : `/brands/${brand}`
    items.push({ name: brandName, url: brandUrl })
  }

  if (store && storeName) {
    const storeUrl = category && brand 
      ? `/deals/${category}/${brand}/${store}`
      : `/stores/${store}`
    items.push({ name: storeName, url: storeUrl })
  }

  return items
}

export function generateStoreBreadcrumbs(
  store: string,
  storeName: string,
  category?: string,
  categoryName?: string
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { name: 'Stores', url: '/stores' },
    { name: storeName, url: `/stores/${store}` },
  ]

  if (category && categoryName) {
    items.push({ name: categoryName, url: `/stores/${store}/${category}` })
  }

  return items
}

export function generateBrandBreadcrumbs(
  brand: string,
  brandName: string,
  category?: string,
  categoryName?: string
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { name: 'Brands', url: '/brands' },
    { name: brandName, url: `/brands/${brand}` },
  ]

  if (category && categoryName) {
    items.push({ name: categoryName, url: `/brands/${brand}/${category}` })
  }

  return items
}

export function generateBlogBreadcrumbs(
  slug?: string,
  title?: string,
  categorySlug?: string,
  categoryName?: string
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { name: 'Blog', url: '/blog' },
  ]

  if (categorySlug && categoryName) {
    items.push({ name: categoryName, url: `/blog/category/${categorySlug}` })
  }

  if (slug && title) {
    items.push({ name: title, url: `/blog/${slug}` })
  }

  return items
}

export function generateGamingBreadcrumbs(
  game?: string,
  gameName?: string,
  page?: 'codes' | 'rewards'
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { name: 'Gaming', url: '/gaming' },
  ]

  if (game && gameName) {
    items.push({ name: gameName, url: `/gaming/${game}` })
  }

  if (page) {
    const pageName = page === 'codes' ? 'Promo Codes' : 'Free Rewards'
    items.push({ name: pageName, url: `/gaming/${game}/${page}` })
  }

  return items
}
