import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Tag, ArrowRight, DollarSign } from "lucide-react"

import { getDealsUnderPrice } from "@/lib/deals"
import { getStoreInfo, formatStoreName } from "@/lib/deal-types"
import { PageContainer } from "@/components/layout/page-container"
import { DealCard } from "@/components/deal-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Parse slug like "laptops-under-500"
function parsePriceSlug(slug: string): { category: string; price: number } | null {
  const match = slug.match(/^(.+)-under-(\d+)$/)
  if (!match) return null
  
  const category = match[1].replace(/-/g, ' ')
  const price = parseInt(match[2], 10)
  
  if (isNaN(price) || price <= 0) return null
  
  return { category, price }
}

function formatCategory(category: string): string {
  return category.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

const KNOWN_STORES = ['amazon', 'best-buy', 'target', 'walmart', 'nike', 'apple', 'costco']

export async function generateStaticParams() {
  const categories = ['laptops', 'headphones', 'sneakers', 'electronics']
  const prices = [100, 200, 500]
  
  return KNOWN_STORES.flatMap(store => 
    categories.flatMap(category => 
      prices.map(price => ({ 
        store, 
        slug: `${category}-under-${price}` 
      }))
    )
  )
}

interface PageProps {
  params: Promise<{ store: string; slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { store, slug } = await params
  const parsed = parsePriceSlug(slug)
  
  if (!parsed) {
    return { title: "Deals | SaveSmart" }
  }
  
  const { category, price } = parsed
  const storeName = formatStoreName(store)
  const categoryName = formatCategory(category)
  
  return {
    title: `${storeName} ${categoryName} Deals Under $${price} | SaveSmart`,
    description: `Browse ${storeName} ${categoryName.toLowerCase()} deals under $${price}. Find the best discounts and save big on your favorite products.`,
    openGraph: {
      title: `${storeName} ${categoryName} Under $${price}`,
      description: `Find amazing ${categoryName.toLowerCase()} deals under $${price} at ${storeName}.`,
      url: `https://savesmart.bio/stores/${store}/price/${slug}`,
    },
  }
}

export default async function StorePriceDealsPage({ params }: PageProps) {
  const { store, slug } = await params
  const parsed = parsePriceSlug(slug)
  
  if (!parsed) {
    notFound()
  }
  
  const { category, price } = parsed
  const storeName = formatStoreName(store)
  const categoryName = formatCategory(category)
  const categorySlug = category.replace(/\s+/g, '-').toLowerCase()
  const storeInfo = getStoreInfo(storeName)
  
  const deals = await getDealsUnderPrice(price, category, storeName, 50)
  
  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${storeName} ${categoryName} Deals Under $${price}`,
    url: `https://savesmart.bio/stores/${store}/price/${slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: deals.length,
    },
  }
  
  const priceRanges = [100, 200, 300, 500, 1000].filter(p => p !== price)
  const relatedCategories = ['laptops', 'headphones', 'sneakers', 'electronics', 'fashion']
    .filter(c => c !== categorySlug)
    .slice(0, 4)
  
  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Hero */}
      <section className={`relative bg-gradient-to-br ${storeInfo.color} text-white py-14 md:py-16 overflow-hidden`}>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <PageContainer>
          {/* Breadcrumbs */}
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm">
            <Link 
              href="/" 
              className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
            >
              Home
            </Link>
            <span className="text-white/50">/</span>
            <Link 
              href={`/stores/${store}`} 
              className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
            >
              {storeName}
            </Link>
            <span className="text-white/50">/</span>
            <Link 
              href={`/stores/${store}/${categorySlug}`}
              className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
            >
              {categoryName}
            </Link>
            <span className="text-white/50">/</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
              Under ${price}
            </span>
          </nav>
          
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <DollarSign className="h-5 w-5" />
              <span className="text-sm font-semibold text-white uppercase tracking-wide">
                {storeName} Budget Deals
              </span>
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            {storeName} {categoryName} Under ${price}
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-6">
            Browse {storeName}&apos;s best {categoryName.toLowerCase()} deals under ${price}.
          </p>
          
          <Badge variant="secondary" className="bg-white/20 text-white border-0">
            {deals.length} Active Deals
          </Badge>
        </PageContainer>
      </section>
      
      {/* Price Filter */}
      <section className="py-6 border-b border-border">
        <PageContainer>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Price:</span>
            {[100, 200, 300, 500, 1000].map((p) => (
              <Link
                key={p}
                href={`/stores/${store}/price/${categorySlug}-under-${p}`}
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  p === price 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                }`}
              >
                Under ${p}
              </Link>
            ))}
          </div>
        </PageContainer>
      </section>
      
      {/* Deals Grid */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            {storeName} {categoryName} Deals Under ${price}
          </h2>
          
          {deals.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Tag className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No deals found
                </h3>
                <p className="text-muted-foreground mb-4">
                  We couldn&apos;t find any {storeName} {categoryName.toLowerCase()} deals under ${price} right now.
                </p>
                <Button asChild>
                  <Link href={`/stores/${store}/${categorySlug}`}>
                    View All {storeName} {categoryName} Deals
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </PageContainer>
      </section>
      
      {/* SEO Content */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              About {storeName} {categoryName} Deals Under ${price}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Looking for {categoryName.toLowerCase()} deals under ${price} at {storeName}? SaveSmart monitors {storeName}&apos;s inventory and pricing in real-time 
              to surface the best savings opportunities. We track price history to show you whether a deal is truly worth it, comparing current prices against historical lows. 
              Our {storeName} {categoryName.toLowerCase()} deals are verified and updated hourly to ensure accuracy. Whether you&apos;re looking for everyday essentials or 
              premium products on a budget, we help you find quality {categoryName.toLowerCase()} from {storeName} without overspending. 
              All listed deals include verified coupon codes and cashback offers when available.
            </p>
          </div>
        </PageContainer>
      </section>
      
      {/* Related Links */}
      <section className="py-10 md:py-12 border-t border-border">
        <PageContainer>
          <h3 className="text-xl font-bold text-foreground mb-6">More Deals to Explore</h3>
          
          {/* Other Price Ranges at this Store */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              Other Price Ranges at {storeName}
            </h4>
            <div className="flex flex-wrap gap-3">
              {priceRanges.slice(0, 4).map((p) => (
                <Link
                  key={p}
                  href={`/stores/${store}/price/${categorySlug}-under-${p}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
                >
                  {storeName} {categoryName} Under ${p}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
          
          {/* Other Categories at this Store */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              Other {storeName} Categories Under ${price}
            </h4>
            <div className="flex flex-wrap gap-3">
              {relatedCategories.map((cat) => (
                <Link
                  key={cat}
                  href={`/stores/${store}/price/${cat}-under-${price}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
                >
                  {storeName} {formatCategory(cat)} Under ${price}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
          
          {/* Same Category at Other Stores */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              {categoryName} Under ${price} at Other Stores
            </h4>
            <div className="flex flex-wrap gap-3">
              {KNOWN_STORES.filter(s => s !== store).slice(0, 4).map((s) => (
                <Link
                  key={s}
                  href={`/stores/${s}/price/${categorySlug}-under-${price}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
                >
                  {formatStoreName(s)} {categoryName} Under ${price}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
        </PageContainer>
      </section>
    </main>
  )
}
