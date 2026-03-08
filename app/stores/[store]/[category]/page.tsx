import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CapitalOnePromo } from "@/components/capital-one-promo"
import { PageContainer } from "@/components/layout/page-container"
import { getDealsByStoreAndCategory } from "@/lib/deals"
import { getStoreInfo, getProductImageUrl, formatStoreName, formatCategoryName } from "@/lib/deal-types"
import { 
  SeoContentBlock, 
  generateStoreCategorySeoContent, 
  getStoreCategoryRelatedLinks 
} from "@/components/seo-content-block"
import { Store, Tag, ChevronRight, Clock } from "lucide-react"

interface PageProps {
  params: Promise<{ store: string; category: string }>
}

// Static store and category lists for SSG
const KNOWN_STORES = [
  'amazon', 'best-buy', 'nike', 'target', 'apple', 'dyson',
  'adidas', 'levis', 'walmart', 'costco', 'macys', 'nordstrom'
]

const CATEGORIES = [
  { slug: 'electronics', name: 'Electronics' },
  { slug: 'fashion', name: 'Fashion' },
  { slug: 'home', name: 'Home & Kitchen' },
  { slug: 'laptops', name: 'Laptops' },
  { slug: 'headphones', name: 'Headphones' },
  { slug: 'sneakers', name: 'Sneakers' },
  { slug: 'fitness', name: 'Fitness' },
  { slug: 'beauty', name: 'Beauty' },
]

export async function generateStaticParams() {
  const params: { store: string; category: string }[] = []
  for (const store of KNOWN_STORES) {
    for (const category of CATEGORIES) {
      params.push({ store, category: category.slug })
    }
  }
  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { store, category } = await params
  const storeName = formatStoreName(store)
  const categoryName = formatCategoryName(category)
  
  return {
    title: `${storeName} ${categoryName} Deals | SaveSmart`,
    description: `Find the best ${categoryName.toLowerCase()} deals from ${storeName}. Save money with verified coupons and exclusive offers.`,
    openGraph: {
      title: `${storeName} ${categoryName} Deals | SaveSmart`,
      description: `Find the best ${categoryName.toLowerCase()} deals from ${storeName}. Save money with verified coupons and exclusive offers.`,
      type: 'website',
      url: `https://savesmart.bio/stores/${store}/${category}`,
    },
    alternates: {
      canonical: `/stores/${store}/${category}`,
    },
  }
}

export const revalidate = 3600

export default async function StoreCategoryPage({ params }: PageProps) {
  const { store, category } = await params
  const storeName = formatStoreName(store)
  const categoryName = formatCategoryName(category)
  const deals = await getDealsByStoreAndCategory(store, category, 50)
  
  const storeInfo = getStoreInfo(storeName)
  const featuredDeals = deals.slice(0, 6)
  const remainingDeals = deals.slice(6)

  // Generate timestamp for "Last Updated"
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  // Structured data for SEO - CollectionPage with ItemList
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${storeName} ${categoryName} Deals`,
    url: `https://savesmart.bio/stores/${store}/${category}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: deals.length,
    },
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="pt-16">
        {/* Hero */}
        <section className={`relative bg-gradient-to-br ${storeInfo.color} text-white py-14 md:py-16 overflow-hidden`}>
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
                href={`/stores/${store}`}
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                {storeName}
              </Link>
              <span className="text-white/50">/</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
                {categoryName}
              </span>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Tag className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium uppercase tracking-wider text-white/90">
                {storeName} + {categoryName}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
              {storeName} {categoryName} Deals
            </h1>
            
            <p className="text-lg text-white/90 max-w-2xl mb-6">
              Find the best {categoryName.toLowerCase()} deals from {storeName}. Save money with verified coupons and exclusive offers.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Badge className="bg-white/20 text-white border-0 text-sm">
                {deals.length} Active Deals
              </Badge>
              <span className="flex items-center gap-1.5 text-sm text-white/70">
                <Clock className="h-4 w-4" />
                Last updated: {lastUpdated}
              </span>
            </div>
          </PageContainer>
        </section>

        {/* Capital One Promo */}
        <section className="py-8">
          <PageContainer>
            <CapitalOnePromo variant="inline" />
          </PageContainer>
        </section>

        {/* No Deals Message */}
        {deals.length === 0 && (
          <section className="py-16">
            <PageContainer>
              <div className="text-center">
                <Tag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">No Deals Available</h2>
                <p className="text-muted-foreground mb-6">
                  We don't have any {categoryName.toLowerCase()} deals from {storeName} right now.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link
                    href={`/stores/${store}`}
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors"
                  >
                    View All {storeName} Deals
                  </Link>
                  <Link
                    href={`/deals/${category}`}
                    className="inline-flex items-center px-4 py-2 rounded-lg border border-border hover:bg-muted font-medium transition-colors"
                  >
                    View All {categoryName} Deals
                  </Link>
                </div>
              </div>
            </PageContainer>
          </section>
        )}

        {/* Featured Deals */}
        {featuredDeals.length > 0 && (
          <section className="py-10 md:py-12">
            <PageContainer>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Top {storeName} {categoryName} Deals
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredDeals.map((deal) => (
                  <Link 
                    key={deal.id} 
                    href={`/deal/${deal.slug || deal.id}`}
                    className="group"
                  >
                    <Card className="overflow-hidden border-border/50 transition-all hover:shadow-lg h-full">
                      <div className="relative aspect-[4/3] bg-muted">
                        <Image
                          src={getProductImageUrl(deal)}
                          alt={deal.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-secondary text-secondary-foreground">
                            {deal.discount_percentage}% OFF
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                          {deal.title}
                        </h3>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xl font-bold text-secondary">
                            ${deal.deal_price.toFixed(2)}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            ${deal.original_price.toFixed(2)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </PageContainer>
          </section>
        )}

        {/* All Deals */}
        {remainingDeals.length > 0 && (
          <section className="bg-muted/30 py-10 md:py-12">
            <PageContainer>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                All {storeName} {categoryName} Deals
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {remainingDeals.map((deal) => (
                  <Link 
                    key={deal.id} 
                    href={`/deal/${deal.slug || deal.id}`}
                    className="group"
                  >
                    <Card className="overflow-hidden border-border/50 transition-all hover:shadow-md h-full">
                      <div className="relative aspect-square bg-muted">
                        <Image
                          src={getProductImageUrl(deal)}
                          alt={deal.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-secondary text-secondary-foreground text-xs">
                            {deal.discount_percentage}% OFF
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                          {deal.title}
                        </h3>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="font-bold text-secondary">
                            ${deal.deal_price.toFixed(2)}
                          </span>
                          <span className="text-xs text-muted-foreground line-through">
                            ${deal.original_price.toFixed(2)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </PageContainer>
          </section>
        )}

        {/* SEO Content Block */}
        <SeoContentBlock
          title={`About ${storeName} ${categoryName} Deals`}
          content={generateStoreCategorySeoContent(storeName, categoryName)}
          relatedLinks={getStoreCategoryRelatedLinks(store, storeName, category, categoryName)}
        />

        {/* Related Links - Other Categories */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              More {storeName} Categories
            </h2>
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.filter(c => c.slug !== category).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/stores/${store}/${cat.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-muted text-sm font-medium text-foreground transition-colors"
                >
                  {storeName} {cat.name}
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Related Links - Other Stores for Category */}
        <section className="pb-10 md:pb-12">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              More {categoryName} Deals
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/deals/${category}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors"
              >
                All {categoryName} Deals
              </Link>
              {KNOWN_STORES.filter(s => s !== store).slice(0, 6).map((otherStore) => (
                <Link
                  key={otherStore}
                  href={`/stores/${otherStore}/${category}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-muted text-sm font-medium text-foreground transition-colors"
                >
                  {formatStoreName(otherStore)} {categoryName}
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>
      </main>

      <Footer />
    </div>
  )
}
