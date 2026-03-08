import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CapitalOnePromo } from "@/components/capital-one-promo"
import { PageContainer, SectionHeading } from "@/components/layout/page-container"
import { getDealsByStoreAndCategory } from "@/lib/deals"
import { getStoreInfo, getProductImageUrl, formatStoreName } from "@/lib/deal-types"
import { SeoContentBlock } from "@/components/seo-content-block"
import { getStoreBySlug, getStoreSlugs, getCategorySlugs, getCategoriesForStore } from "@/lib/seo-data"
import { generateStoreCategoryIntroContent, formatCategoryName } from "@/lib/seo/content"
import { Store as StoreIcon, Tag, ChevronRight, Clock, Sparkles, ArrowRight } from "lucide-react"

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
  const storeSlugs = await getStoreSlugs()
  const categorySlugs = await getCategorySlugs()
  
  const stores = storeSlugs.length > 0 ? storeSlugs.slice(0, 20) : KNOWN_STORES
  const categories = categorySlugs.length > 0 ? categorySlugs : CATEGORIES.map(c => c.slug)
  
  const params: { store: string; category: string }[] = []
  for (const store of stores) {
    for (const category of categories) {
      params.push({ store, category })
    }
  }
  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { store, category } = await params
  const storeName = formatStoreName(store)
  const categoryName = formatCategoryName(category)
  
  return {
    title: `${categoryName} Deals at ${storeName} | SaveSmart`,
    description: `Browse the latest ${categoryName.toLowerCase()} deals at ${storeName}. Compare discounts, coupons and price drops updated daily.`,
    openGraph: {
      title: `${categoryName} Deals at ${storeName} | SaveSmart`,
      description: `Find the best ${categoryName.toLowerCase()} deals and discounts at ${storeName}. Prices updated hourly.`,
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
  const storeSlug = store.toLowerCase()
  const categorySlug = category.toLowerCase()
  
  // Fetch store data from database
  const storeData = await getStoreBySlug(storeSlug)
  const storeName = storeData?.name || formatStoreName(storeSlug)
  const categoryName = formatCategoryName(categorySlug)
  
  // Fetch deals filtered by both store and category
  const deals = await getDealsByStoreAndCategory(storeSlug, categorySlug, 50)
  
  // Get other categories at this store for internal linking
  const otherCategories = (await getCategoriesForStore(storeSlug, 12))
    .filter(c => c.toLowerCase().replace(/\s+/g, '-') !== categorySlug)
    .slice(0, 8)
  
  // Get other stores for this category
  const otherStores = KNOWN_STORES.filter(s => s !== storeSlug).slice(0, 8)
  
  const storeInfo = storeData ? {
    color: storeData.color || 'from-blue-600 to-blue-700',
  } : getStoreInfo(storeName)
  
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
  
  // Generate intro content (150-250 words)
  const introContent = generateStoreCategoryIntroContent(storeName, categoryName)

  // Structured data - Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://savesmart.bio"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: storeName,
        item: `https://savesmart.bio/stores/${storeSlug}`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: categoryName,
        item: `https://savesmart.bio/stores/${storeSlug}/${categorySlug}`
      }
    ]
  }

  // Structured data - CollectionPage
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${categoryName} Deals at ${storeName}`,
    url: `https://savesmart.bio/stores/${storeSlug}/${categorySlug}`,
    description: `Browse ${categoryName.toLowerCase()} deals and discounts at ${storeName}.`,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
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
                href={`/stores/${storeSlug}`}
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
                <StoreIcon className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium uppercase tracking-wider text-white/90">
                Store + Category
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
              {categoryName} Deals at {storeName}
            </h1>
            
            <p className="text-lg text-white/90 max-w-2xl mb-6">
              Find the best {categoryName.toLowerCase()} deals and discounts from {storeName}. Compare prices and save on your next purchase.
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

        {/* Intro Content - Avoids Thin Content (150-250 words) */}
        <section className="py-8 md:py-10 border-b border-border">
          <PageContainer>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg whitespace-pre-line">
                {introContent}
              </p>
            </div>
          </PageContainer>
        </section>

        {/* No Deals Message */}
        {deals.length === 0 && (
          <section className="py-16">
            <PageContainer>
              <Card className="border-border/50">
                <CardContent className="py-12 text-center">
                  <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No deals found</h3>
                  <p className="text-muted-foreground mb-4">
                    Check back soon for new {categoryName.toLowerCase()} deals at {storeName}!
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button variant="outline" asChild>
                      <Link href={`/stores/${storeSlug}`}>Browse All {storeName} Deals</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/deals/${categorySlug}`}>Browse All {categoryName} Deals</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </PageContainer>
          </section>
        )}

        {/* Featured Deals */}
        {featuredDeals.length > 0 && (
          <section className="py-10 md:py-12">
            <PageContainer>
              <SectionHeading>
                Top {categoryName} Deals at {storeName}
              </SectionHeading>
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
              <SectionHeading>
                All {categoryName} Deals at {storeName}
              </SectionHeading>
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

        {/* Popular Categories at Store - Internal Linking */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <h2 className="text-xl font-bold text-foreground mb-6">
              Popular Categories at {storeName}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {otherCategories.map((cat) => {
                const catSlug = cat.toLowerCase().replace(/\s+/g, '-')
                return (
                  <Link
                    key={catSlug}
                    href={`/stores/${storeSlug}/${catSlug}`}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
                  >
                    {formatCategoryName(cat)}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                )
              })}
              <Link
                href={`/stores/${storeSlug}`}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-primary text-primary hover:bg-primary/5 text-sm font-medium transition-colors"
              >
                All {storeName}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </PageContainer>
        </section>

        {/* Top Stores for Category - Internal Linking */}
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <h2 className="text-xl font-bold text-foreground mb-6">
              Top Stores for {categoryName}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {otherStores.map((otherStore) => {
                const otherStoreInfo = getStoreInfo(formatStoreName(otherStore))
                return (
                  <Link
                    key={otherStore}
                    href={`/stores/${otherStore}/${categorySlug}`}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <div className={`${otherStoreInfo.color} h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                      {formatStoreName(otherStore).charAt(0)}
                    </div>
                    <span className="text-xs font-medium text-foreground text-center">
                      {formatStoreName(otherStore)}
                    </span>
                  </Link>
                )
              })}
            </div>
          </PageContainer>
        </section>

        {/* Related Links */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <h2 className="text-xl font-bold text-foreground mb-6">
              Related Pages
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href={`/stores/${storeSlug}`}
                className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <StoreIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">{storeName} Deals</p>
                  <p className="text-sm text-muted-foreground">All deals from {storeName}</p>
                </div>
              </Link>
              <Link
                href={`/deals/${categorySlug}`}
                className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Tag className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">{categoryName} Deals</p>
                  <p className="text-sm text-muted-foreground">All {categoryName.toLowerCase()} deals</p>
                </div>
              </Link>
              <Link
                href={`/coupons/${storeSlug}`}
                className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Tag className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">{storeName} Coupons</p>
                  <p className="text-sm text-muted-foreground">Promo codes for {storeName}</p>
                </div>
              </Link>
              <Link
                href={`/best/${categorySlug}`}
                className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Sparkles className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Best {categoryName}</p>
                  <p className="text-sm text-muted-foreground">Top-rated {categoryName.toLowerCase()}</p>
                </div>
              </Link>
            </div>
          </PageContainer>
        </section>

        {/* CTA */}
        <section className="py-10 md:py-12 text-center border-t border-border">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Looking for a specific deal?
            </h2>
            <p className="text-muted-foreground mb-6">
              Our AI can help you find exactly what you need at the best price.
            </p>
            <Button size="lg" className="gap-2" asChild>
              <Link href="/deal-finder">
                <Sparkles className="h-5 w-5" />
                Ask AI Deal Finder
              </Link>
            </Button>
          </PageContainer>
        </section>
      </main>

      <Footer />
    </div>
  )
}
