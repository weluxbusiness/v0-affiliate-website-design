import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DealCard } from "@/components/deal-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CapitalOnePromo } from "@/components/capital-one-promo"
import { PageContainer, DealGrid, SectionHeading } from "@/components/layout/page-container"
import { getDealsByCategoryBrandStorePaginated, DEALS_PER_PAGE } from "@/lib/deals"
import { getBrandSlugs, getCategorySlugs, getStoreSlugs } from "@/lib/seo-data"
import { 
  formatBrandName, 
  formatCategoryName, 
  formatStoreName,
  generateCategoryBrandStoreIntroContent 
} from "@/lib/seo/content"
import { Pagination } from "@/components/pagination"
import { 
  Tag,
  Sparkles,
  Clock,
  Store,
  ArrowRight
} from "lucide-react"

export const revalidate = 3600

// Fallback data
const POPULAR_BRANDS = ["apple", "samsung", "nike", "sony", "lg", "dell", "hp", "lenovo"]
const POPULAR_STORES = ["amazon", "best-buy", "target", "walmart", "costco"]

interface PageProps {
  params: Promise<{ category: string; brand: string; store: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const category = resolvedParams?.category || ''
    const brand = resolvedParams?.brand || ''
    const store = resolvedParams?.store || ''
    
    if (!category || !brand || !store) {
      return { title: 'Deals | SaveSmart' }
    }
    
    const brandName = formatBrandName(brand)
    const categoryName = formatCategoryName(category)
    const storeName = formatStoreName(store)
    
    return {
      title: `Best ${brandName} ${categoryName} Deals at ${storeName} | SaveSmart`,
      description: `Compare the latest ${brandName} ${categoryName.toLowerCase()} deals available at ${storeName}. Find discounts, coupons, and price drops updated daily.`,
      openGraph: {
        title: `Best ${brandName} ${categoryName} Deals at ${storeName}`,
        description: `Find ${brandName} ${categoryName.toLowerCase()} deals at ${storeName}. Compare prices and save.`,
        type: 'website',
        url: `https://savesmart.bio/deals/${category}/${brand}/${store}`,
      },
      alternates: {
        canonical: `/deals/${category}/${brand}/${store}`,
      },
    }
  } catch {
    return { title: 'Deals | SaveSmart' }
  }
}

export async function generateStaticParams() {
  const categorySlugs = await getCategorySlugs()
  const brandSlugs = await getBrandSlugs()
  const storeSlugs = await getStoreSlugs()
  
  const categories = categorySlugs.length > 0 ? categorySlugs.slice(0, 5) : ['electronics', 'laptops', 'headphones']
  const brands = brandSlugs.length > 0 ? brandSlugs.slice(0, 3) : POPULAR_BRANDS.slice(0, 3)
  const stores = storeSlugs.length > 0 ? storeSlugs.slice(0, 3) : POPULAR_STORES.slice(0, 3)
  
  const params: { category: string; brand: string; store: string }[] = []
  for (const category of categories) {
    for (const brand of brands) {
      for (const store of stores) {
        params.push({ category, brand, store })
      }
    }
  }
  return params.slice(0, 50) // Limit for build performance
}

export default async function CategoryBrandStorePage({ params }: PageProps) {
  // Safely resolve params
  let resolvedParams
  try {
    resolvedParams = await params
  } catch {
    notFound()
  }
  
  // Validate params exist
  const category = resolvedParams?.category
  const brand = resolvedParams?.brand
  const store = resolvedParams?.store
  
  if (!category || !brand || !store) {
    notFound()
  }
  
  const categorySlug = category.toLowerCase()
  const brandSlug = brand.toLowerCase()
  const storeSlug = store.toLowerCase()
  
  const brandName = formatBrandName(brandSlug)
  const categoryName = formatCategoryName(categorySlug)
  const storeName = formatStoreName(storeSlug)
  
  // Fetch paginated deals (page 1) with error handling
  let result
  try {
    result = await getDealsByCategoryBrandStorePaginated(categorySlug, brandSlug, storeSlug, 1)
  } catch {
    notFound()
  }
  
  // Validate result
  if (!result || !result.deals) {
    notFound()
  }
  
  const { deals, totalCount, totalPages } = result
  
  // Return 404 if no deals exist for this combination
  if (!deals || deals.length === 0 || totalCount === 0) {
    notFound()
  }
  
  const featuredDeals = deals.slice(0, 3)
  const regularDeals = deals.slice(3)
  
  // Get related data for internal linking
  const relatedStores = (await getStoreSlugs())
    .filter(s => s !== storeSlug)
    .slice(0, 6)
  const relatedBrands = (await getBrandSlugs())
    .filter(b => b !== brandSlug)
    .slice(0, 6)
  
  // Use fallback if no DB results
  const storesForLinks = relatedStores.length > 0 ? relatedStores : POPULAR_STORES.filter(s => s !== storeSlug).slice(0, 6)
  const brandsForLinks = relatedBrands.length > 0 ? relatedBrands : POPULAR_BRANDS.filter(b => b !== brandSlug).slice(0, 6)
  
  // Generate timestamp
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
  
  // Structured data - CollectionPage
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${brandName} ${categoryName} Deals at ${storeName}`,
    url: `https://savesmart.bio/deals/${categorySlug}/${brandSlug}/${storeSlug}`,
    description: `Best deals for ${brandName} ${categoryName.toLowerCase()} at ${storeName}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: totalCount,
    },
  }

  // Structured data - BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://savesmart.bio" },
      { "@type": "ListItem", position: 2, name: "Deals", item: "https://savesmart.bio/deals" },
      { "@type": "ListItem", position: 3, name: categoryName, item: `https://savesmart.bio/deals/${categorySlug}` },
      { "@type": "ListItem", position: 4, name: brandName, item: `https://savesmart.bio/deals/${categorySlug}/${brandSlug}` },
      { "@type": "ListItem", position: 5, name: storeName, item: `https://savesmart.bio/deals/${categorySlug}/${brandSlug}/${storeSlug}` },
    ],
  }

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Where to buy ${brandName} ${categoryName.toLowerCase()} at ${storeName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `You can buy ${brandName} ${categoryName.toLowerCase()} directly from ${storeName}'s website. SaveSmart tracks all ${brandName} ${categoryName.toLowerCase()} deals at ${storeName} and links directly to the product pages where you can complete your purchase. ${storeName} offers authentic ${brandName} products with standard warranty coverage.`
        }
      },
      {
        "@type": "Question",
        name: `Are ${brandName} ${categoryName.toLowerCase()} deals at ${storeName} updated daily?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, SaveSmart updates ${brandName} ${categoryName.toLowerCase()} deals at ${storeName} hourly to ensure you always see the most current prices. Our deal-tracking system monitors price changes, new promotions, and coupon availability throughout the day.`
        }
      }
    ]
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <main className="pt-16">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-violet-700 to-purple-800 text-white py-14 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,white)]" />
          <PageContainer className="relative">
            {/* Breadcrumbs */}
            <nav className="mb-6 flex items-center gap-2 text-sm flex-wrap">
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
              <Link 
                href={`/deals/${categorySlug}/${brandSlug}`}
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                {brandName}
              </Link>
              <span className="text-white/50">/</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
                {storeName}
              </span>
            </nav>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <Store className="h-6 w-6" />
              </div>
              <span className="text-white/70 uppercase tracking-wider text-sm font-medium">
                Category + Brand + Store
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4 text-balance">
              Best {brandName} {categoryName} Deals at {storeName}
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mb-4">
              Compare the latest {brandName} {categoryName.toLowerCase()} deals available at {storeName}.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {totalCount} Active Deals
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

        {/* SEO Intro Content */}
        <section className="py-8 border-b border-border">
          <PageContainer>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {generateCategoryBrandStoreIntroContent(categoryName, brandName, storeName)}
              </p>
            </div>
          </PageContainer>
        </section>

        {/* Featured Deals */}
        {featuredDeals.length > 0 && (
          <section className="py-10 md:py-12">
            <PageContainer>
              <SectionHeading>Top {brandName} {categoryName} Deals at {storeName}</SectionHeading>
              <DealGrid columns={3}>
                {featuredDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} variant="featured" />
                ))}
              </DealGrid>
            </PageContainer>
          </section>
        )}

        {/* All Deals */}
        <section className="bg-muted/30 py-10 md:py-12">
          <PageContainer>
            <SectionHeading>All {brandName} {categoryName} Deals at {storeName}</SectionHeading>
            {regularDeals.length > 0 ? (
              <DealGrid columns={4}>
                {regularDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </DealGrid>
            ) : null}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={1}
                  totalPages={totalPages}
                  baseUrl={`/deals/${categorySlug}/${brandSlug}/${storeSlug}`}
                />
              </div>
            )}
          </PageContainer>
        </section>

        {/* FAQ Section */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <h2 className="text-xl font-bold text-foreground mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    Where to buy {brandName} {categoryName.toLowerCase()} at {storeName}?
                  </h3>
                  <p className="text-muted-foreground">
                    You can buy {brandName} {categoryName.toLowerCase()} directly from {storeName}'s website. 
                    SaveSmart tracks all {brandName} {categoryName.toLowerCase()} deals at {storeName} and links 
                    directly to the product pages where you can complete your purchase.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    Are {brandName} {categoryName.toLowerCase()} deals at {storeName} updated daily?
                  </h3>
                  <p className="text-muted-foreground">
                    Yes, SaveSmart updates {brandName} {categoryName.toLowerCase()} deals at {storeName} hourly 
                    to ensure you always see the most current prices. Our deal-tracking system monitors 
                    price changes and new promotions throughout the day.
                  </p>
                </CardContent>
              </Card>
            </div>
          </PageContainer>
        </section>

        {/* Shop at Other Stores - Internal Links */}
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <h2 className="text-xl font-bold text-foreground mb-6">
              Shop {brandName} {categoryName} at Other Stores
            </h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {storesForLinks.map((otherStore) => (
                <Link
                  key={otherStore}
                  href={`/deals/${categorySlug}/${brandSlug}/${otherStore}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground truncate">
                    {formatStoreName(otherStore)}
                  </span>
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Other Brands at this Store */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <h2 className="text-xl font-bold text-foreground mb-6">
              Other {categoryName} Brands at {storeName}
            </h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {brandsForLinks.map((otherBrand) => (
                <Link
                  key={otherBrand}
                  href={`/deals/${categorySlug}/${otherBrand}/${storeSlug}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground truncate">
                    {formatBrandName(otherBrand)}
                  </span>
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Related Pages */}
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <h2 className="text-xl font-bold text-foreground mb-6">
              Related Pages
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href={`/deals/${categorySlug}/${brandSlug}`}
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Tag className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">{brandName} {categoryName}</p>
                  <p className="text-sm text-muted-foreground">All stores</p>
                </div>
              </Link>
              <Link
                href={`/stores/${storeSlug}`}
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Store className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">{storeName} Deals</p>
                  <p className="text-sm text-muted-foreground">All {storeName} deals</p>
                </div>
              </Link>
              <Link
                href={`/deals/${categorySlug}`}
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Tag className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">{categoryName} Deals</p>
                  <p className="text-sm text-muted-foreground">All {categoryName.toLowerCase()} deals</p>
                </div>
              </Link>
              <Link
                href={`/stores/${storeSlug}/${categorySlug}`}
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">{categoryName} at {storeName}</p>
                  <p className="text-sm text-muted-foreground">All brands</p>
                </div>
              </Link>
            </div>
          </PageContainer>
        </section>

        {/* CTA */}
        <section className="py-10 md:py-12 text-center border-t border-border">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Looking for a specific {brandName} product at {storeName}?
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
