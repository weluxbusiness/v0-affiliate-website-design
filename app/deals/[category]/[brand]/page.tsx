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
import { getDealsByCategoryAndBrandPaginated, getCategoryBrandCombinations, DEALS_PER_PAGE } from "@/lib/deals"
import { getBrandSlugs, getCategorySlugs, getStoreSlugs } from "@/lib/seo-data"
import { 
  formatBrandName, 
  formatCategoryName, 
  generateCategoryBrandIntroContent 
} from "@/lib/seo/content"
import { Pagination } from "@/components/pagination"
import { 
  Tag,
  Sparkles,
  Clock,
  Store,
  ArrowRight,
  Headphones,
  Shirt,
  Home,
  Laptop,
  ShoppingBag
} from "lucide-react"

export const revalidate = 3600

// Product categories with icons
const CATEGORY_ICONS: Record<string, typeof Headphones> = {
  'headphones': Headphones,
  'electronics': Laptop,
  'laptops': Laptop,
  'smartphones': Laptop,
  'tvs': Laptop,
  'fashion': Shirt,
  'sneakers': ShoppingBag,
  'clothing': Shirt,
  'home-kitchen': Home,
  'kitchen': Home,
}

// Fallback brands
const POPULAR_BRANDS = [
  "apple", "samsung", "nike", "adidas", "sony", "lg", "dell", "hp",
  "lenovo", "bose", "beats", "microsoft", "nintendo", "dyson"
]

interface PageProps {
  params: Promise<{ category: string; brand: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const category = resolvedParams?.category || ''
    const brand = resolvedParams?.brand || ''
    
    if (!category || !brand) {
      return {
        title: 'Deals | SaveSmart',
        description: 'Find the best deals on top brands.',
      }
    }
    
    const brandName = formatBrandName(brand)
    const categoryName = formatCategoryName(category)
    
    return {
      title: `${brandName} ${categoryName} Deals – Best Prices & Discounts | SaveSmart`,
      description: `Find the best deals on ${brandName} ${categoryName.toLowerCase()}. Compare prices, discounts, and coupons from top retailers.`,
      openGraph: {
        title: `${brandName} ${categoryName} Deals – Best Prices & Discounts`,
        description: `Discover amazing deals on ${brandName} ${categoryName.toLowerCase()}. Compare prices from Amazon, Best Buy, and more.`,
        type: 'website',
        url: `https://savesmart.bio/deals/${category}/${brand}`,
      },
      alternates: {
        canonical: `/deals/${category}/${brand}`,
      },
    }
  } catch {
    return {
      title: 'Deals | SaveSmart',
      description: 'Find the best deals on top brands.',
    }
  }
}

export async function generateStaticParams() {
  // Get combinations where deals actually exist
  const combinations = await getCategoryBrandCombinations()
  
  if (combinations.length > 0) {
    return combinations.slice(0, 100) // Limit for build performance
  }
  
  // Fallback: generate a subset of popular combinations
  const categorySlugs = await getCategorySlugs()
  const categories = categorySlugs.length > 0 ? categorySlugs.slice(0, 8) : ['electronics', 'laptops', 'headphones', 'fashion']
  
  const params: { category: string; brand: string }[] = []
  for (const category of categories) {
    for (const brand of POPULAR_BRANDS.slice(0, 5)) {
      params.push({ category, brand })
    }
  }
  return params
}

export default async function CategoryBrandPage({ params }: PageProps) {
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
  
  if (!category || !brand) {
    notFound()
  }
  
  const categorySlug = category.toLowerCase()
  const brandSlug = brand.toLowerCase()
  
  const brandName = formatBrandName(brandSlug)
  const categoryName = formatCategoryName(categorySlug)
  
  // Fetch paginated deals (page 1) with error handling
  let result
  try {
    result = await getDealsByCategoryAndBrandPaginated(categorySlug, brandSlug, 1)
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
  const relatedStores = (await getStoreSlugs()).slice(0, 6)
  const relatedCategories = (await getCategorySlugs())
    .filter(c => c !== categorySlug)
    .slice(0, 6)
  const relatedBrands = (await getBrandSlugs())
    .filter(b => b !== brandSlug)
    .slice(0, 6)
  
  // Use fallback brands if none from DB
  const brandsForLinks = relatedBrands.length > 0 ? relatedBrands : POPULAR_BRANDS.filter(b => b !== brandSlug).slice(0, 6)
  
  // Generate timestamp
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
  
  const Icon = CATEGORY_ICONS[categorySlug] || Tag
  
  // Structured data - CollectionPage
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${brandName} ${categoryName} Deals`,
    url: `https://savesmart.bio/deals/${categorySlug}/${brandSlug}`,
    description: `Best deals for ${brandName} ${categoryName.toLowerCase()}`,
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
    ],
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
      
      <main className="pt-16">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-emerald-700 to-teal-800 text-white py-14 md:py-16 overflow-hidden">
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
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
                {brandName}
              </span>
            </nav>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-white/70 uppercase tracking-wider text-sm font-medium">
                Category + Brand
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4 text-balance">
              {brandName} {categoryName} Deals
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mb-4">
              Find the best deals on {brandName} {categoryName.toLowerCase()} from top retailers.
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
                {generateCategoryBrandIntroContent(categoryName, brandName)}
              </p>
            </div>
          </PageContainer>
        </section>

        {/* Featured Deals */}
        {featuredDeals.length > 0 && (
          <section className="py-10 md:py-12">
            <PageContainer>
              <SectionHeading>Top {brandName} {categoryName} Deals</SectionHeading>
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
            <SectionHeading>All {brandName} {categoryName} Deals</SectionHeading>
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
                  baseUrl={`/deals/${categorySlug}/${brandSlug}`}
                />
              </div>
            )}
          </PageContainer>
        </section>

        {/* Shop by Store - Internal Links */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <h2 className="text-xl font-bold text-foreground mb-6">
              Shop {brandName} {categoryName} at Top Stores
            </h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {relatedStores.map((storeSlug) => (
                <Link
                  key={storeSlug}
                  href={`/stores/${storeSlug}/${categorySlug}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground truncate">
                    {formatBrandName(storeSlug)}
                  </span>
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* More Brands in this Category */}
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <h2 className="text-xl font-bold text-foreground mb-6">
              More {categoryName} Brands
            </h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {brandsForLinks.map((relBrandSlug) => (
                <Link
                  key={relBrandSlug}
                  href={`/deals/${categorySlug}/${relBrandSlug}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground truncate">
                    {formatBrandName(relBrandSlug)}
                  </span>
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* More Categories from this Brand */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <h2 className="text-xl font-bold text-foreground mb-6">
              More {brandName} Categories
            </h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {relatedCategories.map((catSlug) => (
                <Link
                  key={catSlug}
                  href={`/deals/${catSlug}/${brandSlug}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground truncate">
                    {formatCategoryName(catSlug)}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
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
                href={`/brands/${brandSlug}`}
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Tag className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">{brandName} Deals</p>
                  <p className="text-sm text-muted-foreground">All {brandName} deals</p>
                </div>
              </Link>
              <Link
                href={`/best/${categorySlug}`}
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Sparkles className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Best {categoryName}</p>
                  <p className="text-sm text-muted-foreground">Top-rated {categoryName.toLowerCase()}</p>
                </div>
              </Link>
              <Link
                href={`/brands/${brandSlug}/${categorySlug}`}
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Store className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">{brandName} {categoryName}</p>
                  <p className="text-sm text-muted-foreground">Via brand page</p>
                </div>
              </Link>
            </div>
          </PageContainer>
        </section>

        {/* CTA */}
        <section className="py-10 md:py-12 text-center border-t border-border">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Looking for a specific {brandName} product?
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
