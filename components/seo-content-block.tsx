import Link from "next/link"
import { PageContainer } from "@/components/layout/page-container"
import { ArrowRight } from "lucide-react"

interface SeoContentBlockProps {
  title: string
  content: string
  relatedLinks: { label: string; href: string }[]
  className?: string
}

export function SeoContentBlock({ title, content, relatedLinks, className }: SeoContentBlockProps) {
  return (
    <section className={`py-10 md:py-12 border-t border-border ${className ?? ''}`}>
      <PageContainer>
        {/* SEO Content */}
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
          <div className="prose prose-muted max-w-none">
            <p className="text-muted-foreground leading-relaxed">{content}</p>
          </div>
        </div>

        {/* Internal Link Hub */}
        {relatedLinks.length > 0 && (
          <div className="mt-8 pt-8 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">More Deals to Explore</h3>
            <div className="flex flex-wrap gap-3">
              {relatedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
                >
                  {link.label}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </PageContainer>
    </section>
  )
}

// SEO content generators for different page types
export function generateCategorySeoContent(categoryName: string): string {
  return `Discover the best ${categoryName.toLowerCase()} deals curated by SaveSmart. Our team scours hundreds of retailers daily to find genuine discounts on top-rated ${categoryName.toLowerCase()} products. Whether you're looking for premium brands like Apple, Sony, Samsung, or budget-friendly alternatives, we compare prices across Amazon, Best Buy, Target, Walmart, and specialty stores to ensure you get the lowest price available. Our deals typically feature discounts of 20-60% off retail prices, with many items including free shipping. SaveSmart uses AI-powered price tracking to alert you when prices drop, so you never miss a flash sale or limited-time offer. All deals are verified and updated hourly to ensure accuracy.`
}

export function generateStoreSeoContent(storeName: string): string {
  return `Find the latest verified deals and exclusive discounts from ${storeName}. SaveSmart monitors ${storeName}'s inventory and pricing in real-time to surface the best savings opportunities. We track price history to show you whether a deal is truly worth it, comparing current prices against historical lows. Our ${storeName} deals cover electronics, fashion, home goods, and more—all with verified coupon codes and automatic price-match alerts. We update our ${storeName} deals multiple times daily during major sales events like Black Friday, Prime Day, and seasonal clearances, ensuring you're always seeing the freshest discounts available.`
}

export function generateStoreCategorySeoContent(storeName: string, categoryName: string): string {
  return `Browse the best ${categoryName.toLowerCase()} deals currently available at ${storeName}. SaveSmart compares ${storeName}'s ${categoryName.toLowerCase()} prices against competitors to ensure you're getting the best value. We highlight products with the biggest discounts, best reviews, and fastest shipping options. Our AI tracks price fluctuations and alerts you when items reach their lowest price point. Whether you're shopping for everyday essentials or premium ${categoryName.toLowerCase()} products, we help you save money at ${storeName} with verified coupons, cashback offers, and exclusive promo codes that stack for maximum savings.`
}

// Generate related links for different page types
export function getCategoryRelatedLinks(categorySlug: string, categoryName: string): { label: string; href: string }[] {
  const stores = ['amazon', 'best-buy', 'target', 'walmart', 'nike', 'apple']
  const categories = ['electronics', 'fashion', 'laptops', 'headphones', 'sneakers', 'home']
  
  return [
    { label: 'Latest Deals', href: '/latest-deals' },
    { label: 'All Deals', href: '/deals' },
    ...stores.slice(0, 3).map(store => ({
      label: `${store.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} ${categoryName}`,
      href: `/stores/${store}/${categorySlug}`
    })),
    ...categories.filter(c => c !== categorySlug).slice(0, 3).map(cat => ({
      label: `${cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Deals`,
      href: `/deals/${cat}`
    })),
  ]
}

export function getStoreRelatedLinks(storeSlug: string, storeName: string): { label: string; href: string }[] {
  const stores = ['amazon', 'best-buy', 'target', 'walmart', 'nike', 'apple']
  const categories = ['electronics', 'fashion', 'laptops', 'headphones', 'sneakers']
  
  return [
    { label: 'Latest Deals', href: '/latest-deals' },
    { label: 'All Deals', href: '/deals' },
    ...categories.slice(0, 3).map(cat => ({
      label: `${storeName} ${cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`,
      href: `/stores/${storeSlug}/${cat}`
    })),
    ...stores.filter(s => s !== storeSlug).slice(0, 3).map(store => ({
      label: `${store.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Deals`,
      href: `/stores/${store}`
    })),
  ]
}

export function getStoreCategoryRelatedLinks(
  storeSlug: string, 
  storeName: string, 
  categorySlug: string, 
  categoryName: string
): { label: string; href: string }[] {
  const stores = ['amazon', 'best-buy', 'target', 'walmart', 'nike']
  const categories = ['electronics', 'fashion', 'laptops', 'headphones', 'sneakers']
  
  return [
    { label: 'Latest Deals', href: '/latest-deals' },
    { label: `All ${categoryName} Deals`, href: `/deals/${categorySlug}` },
    { label: `All ${storeName} Deals`, href: `/stores/${storeSlug}` },
    ...stores.filter(s => s !== storeSlug).slice(0, 2).map(store => ({
      label: `${store.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} ${categoryName}`,
      href: `/stores/${store}/${categorySlug}`
    })),
    ...categories.filter(c => c !== categorySlug).slice(0, 2).map(cat => ({
      label: `${storeName} ${cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`,
      href: `/stores/${storeSlug}/${cat}`
    })),
  ]
}
