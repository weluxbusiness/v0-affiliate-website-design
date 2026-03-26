import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Tag, ArrowRight, Clock, Store, DollarSign } from "lucide-react"

import { getDealsUnderPrice } from "@/lib/deals"
import { getStoreInfo, getProductImageUrl, formatCategoryName } from "@/lib/deal-types"
import { PageContainer } from "@/components/layout/page-container"
import { DealCard } from "@/components/deal-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Parse slug like "laptops-under-500" or "sneakers-under-100"
function parsePriceSlug(slug: string): { category: string; price: number } | null {
  const match = slug.match(/^(.+)-under-(\d+)$/)
  if (!match) return null
  
  const category = match[1].replace(/-/g, ' ')
  const price = parseInt(match[2], 10)
  
  if (isNaN(price) || price <= 0) return null
  
  return { category, price }
}

// Format category for display
function formatCategory(category: string): string {
  return category.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

// Comprehensive categories for price pages
const PRICE_CATEGORIES = [
  'laptops', 'headphones', 'sneakers', 'electronics', 'fashion', 'gaming',
  'tvs', 'smartphones', 'tablets', 'watches', 'earbuds', 'monitors',
  'air-fryers', 'vacuums', 'coffee-makers', 'furniture', 'mattresses',
  'jackets', 'jeans', 'running-shoes', 'backpacks', 'cameras'
]

// All price points including lower budget options
const PRICE_POINTS = [25, 50, 100, 200, 300, 500, 1000]

// Static params for common price pages
export async function generateStaticParams() {
  return PRICE_CATEGORIES.flatMap(category => 
    PRICE_POINTS.map(price => ({ slug: `${category}-under-${price}` }))
  )
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const parsed = parsePriceSlug(slug)
  
  if (!parsed) {
    return { title: "Deals | SaveSmart" }
  }
  
  const { category, price } = parsed
  const categoryName = formatCategory(category)
  
  return {
    title: `Best ${categoryName} Deals Under $${price} | SaveSmart`,
    description: `Browse the best ${categoryName.toLowerCase()} deals under $${price} from Amazon, Best Buy, Target and other top retailers. Updated daily with verified discounts.`,
    openGraph: {
      title: `${categoryName} Deals Under $${price}`,
      description: `Find amazing ${categoryName.toLowerCase()} deals under $${price}. Compare prices and save big.`,
      url: `https://savesmart.bio/deals/price/${slug}`,
    },
    alternates: {
      canonical: `/deals/price/${slug}`,
    },
  }
}

export default async function PriceDealsPage({ params }: PageProps) {
  const { slug } = await params
  const parsed = parsePriceSlug(slug)
  
  if (!parsed) {
    notFound()
  }
  
  const { category, price } = parsed
  const categoryName = formatCategory(category)
  const categorySlug = category.replace(/\s+/g, '-').toLowerCase()
  
  const deals = await getDealsUnderPrice(price, category, undefined, 50)
  
  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${categoryName} Deals Under $${price}`,
    url: `https://savesmart.bio/deals/price/${slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: deals.length,
    },
  }
  
  // Related price ranges
  const priceRanges = [100, 200, 300, 500, 1000].filter(p => p !== price)
  
  // Related categories
  const relatedCategories = ['laptops', 'headphones', 'sneakers', 'electronics', 'fashion', 'gaming']
    .filter(c => c !== categorySlug)
    .slice(0, 4)
  
  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-600 to-emerald-800 text-white py-14 md:py-16 overflow-hidden">
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
              href="/deals" 
              className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
            >
              Deals
            </Link>
            <span className="text-white/50">/</span>
            <Link 
              href={`/deals/${categorySlug}`}
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
              <DollarSign className="h-5 w-5 text-emerald-300" />
              <span className="text-sm font-semibold text-white uppercase tracking-wide">
                Budget Deals
              </span>
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            {categoryName} Deals Under ${price}
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-6">
            Browse the best {categoryName.toLowerCase()} deals under ${price} from top retailers.
          </p>
          
          {/* Deal count */}
          <Badge variant="secondary" className="bg-white/20 text-white border-0">
            {deals.length} Active Deals
          </Badge>
        </PageContainer>
      </section>
      
      {/* Price Range Filter */}
      <section className="py-6 border-b border-border">
        <PageContainer>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Price:</span>
            {[25, 50, 100, 200, 300, 500, 1000].map((p) => (
              <Link
                key={p}
                href={`/deals/price/${categorySlug}-under-${p}`}
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
            Top {categoryName} Deals Under ${price}
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
                  We couldn&apos;t find any {categoryName.toLowerCase()} deals under ${price} right now.
                </p>
                <Button asChild>
                  <Link href={`/deals/${categorySlug}`}>
                    View All {categoryName} Deals
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
              About {categoryName} Deals Under ${price}
            </h2>
            <div className="prose prose-muted max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {categoryName} deals under ${price} are a great option for budget-conscious shoppers looking for quality products without breaking the bank. 
                SaveSmart scours hundreds of retailers including Amazon, Best Buy, Walmart, and Target to find verified discounts on top-rated {categoryName.toLowerCase()} products. 
                Our deals typically feature savings of 20-60% off retail prices, with many items including free shipping. 
                We use AI-powered price tracking to monitor price fluctuations and alert you when items reach their lowest price point. 
                Whether you&apos;re a student, first-time buyer, or simply looking for great value, our under ${price} {categoryName.toLowerCase()} collection offers 
                excellent options from trusted brands. All deals are verified and updated hourly to ensure you&apos;re seeing accurate pricing information.
              </p>
            </div>
          </div>
        </PageContainer>
      </section>
      
      {/* Related Links */}
      <section className="py-10 md:py-12 border-t border-border">
        <PageContainer>
          <h3 className="text-xl font-bold text-foreground mb-6">More Deals to Explore</h3>
          
          {/* Other Price Ranges */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              Other {categoryName} Price Ranges
            </h4>
            <div className="flex flex-wrap gap-3">
              {priceRanges.map((p) => (
                <Link
                  key={p}
                  href={`/deals/price/${categorySlug}-under-${p}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
                >
                  {categoryName} Under ${p}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
          
          {/* Other Categories */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              Other Categories Under ${price}
            </h4>
            <div className="flex flex-wrap gap-3">
              {relatedCategories.map((cat) => (
                <Link
                  key={cat}
                  href={`/deals/price/${cat}-under-${price}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
                >
                  {formatCategory(cat)} Under ${price}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
          
          {/* Store Links */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              Shop {categoryName} by Store
            </h4>
            <div className="flex flex-wrap gap-3">
              {['amazon', 'best-buy', 'target', 'walmart'].map((store) => (
                <Link
                  key={store}
                  href={`/stores/${store}/${categorySlug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
                >
                  {store.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} {categoryName}
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
