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
import { getDealsByBrandAndCategory } from "@/lib/deals"
import { SeoContentBlock } from "@/components/seo-content-block"
import { getBrandSlugs, getCategorySlugs, getStoreSlugs } from "@/lib/seo-data"
import { 
  formatBrandName, 
  formatCategoryName, 
  generateBrandCategoryIntroContent 
} from "@/lib/seo/content"
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

// Popular brands for static generation
const POPULAR_BRANDS = [
  "apple", "samsung", "nike", "adidas", "sony", "lg", "dell", "hp",
  "lenovo", "bose", "beats", "microsoft", "nintendo", "dyson"
]

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

interface PageProps {
  params: Promise<{ brand: string; category: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brand, category } = await params
  const brandName = formatBrandName(brand)
  const categoryName = formatCategoryName(category)
  
  return {
    title: `${brandName} ${categoryName} Deals & Discounts | SaveSmart`,
    description: `Find the best ${brandName} ${categoryName.toLowerCase()} deals and discounts from top retailers. Compare prices and save.`,
    openGraph: {
      title: `${brandName} ${categoryName} Deals | SaveSmart`,
      description: `Discover amazing deals on ${brandName} ${categoryName.toLowerCase()}. Compare prices from Amazon, Best Buy, and more.`,
      type: 'website',
      url: `https://savesmart.bio/brands/${brand}/${category}`,
    },
    alternates: {
      canonical: `/brands/${brand}/${category}`,
    },
  }
}

export async function generateStaticParams() {
  const brandSlugs = await getBrandSlugs()
  const categorySlugs = await getCategorySlugs()
  
  const brands = brandSlugs.length > 0 ? brandSlugs.slice(0, 15) : POPULAR_BRANDS
  const categories = categorySlugs.slice(0, 10)
  
  // Generate a subset of brand × category combinations
  const params: { brand: string; category: string }[] = []
  for (const brand of brands.slice(0, 10)) {
    for (const category of categories.slice(0, 5)) {
      params.push({ brand, category })
    }
  }
  return params
}

export default async function BrandCategoryPage({ params }: PageProps) {
  const { brand, category } = await params
  const brandSlug = brand.toLowerCase()
  const categorySlug = category.toLowerCase()
  
  const brandName = formatBrandName(brandSlug)
  const categoryName = formatCategoryName(categorySlug)
  
  // Fetch deals for this brand + category
  const deals = await getDealsByBrandAndCategory(
    brandSlug.replace(/-/g, " "),
    categorySlug.replace(/-/g, " "),
    50
  )
  
  // If no deals found, still show the page but with a no-results message
  // This is better for SEO than 404ing on valid combinations
  
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
  
  // Generate timestamp
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
  
  const Icon = CATEGORY_ICONS[categorySlug] || Tag
  
  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${brandName} ${categoryName} Deals`,
    url: `https://savesmart.bio/brands/${brandSlug}/${categorySlug}`,
    description: `Find the best ${brandName} ${categoryName.toLowerCase()} deals`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: deals.length,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://savesmart.bio" },
        { "@type": "ListItem", position: 2, name: "Brands", item: "https://savesmart.bio/brands" },
        { "@type": "ListItem", position: 3, name: brandName, item: `https://savesmart.bio/brands/${brandSlug}` },
        { "@type": "ListItem", position: 4, name: categoryName, item: `https://savesmart.bio/brands/${brandSlug}/${categorySlug}` },
      ],
    },
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What are the best ${brandName} ${categoryName.toLowerCase()} deals today?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `We currently have ${deals.length} active ${brandName} ${categoryName.toLowerCase()} deals from top retailers. Our deals are sorted by discount percentage to show you the best savings first.`,
        },
      },
      {
        "@type": "Question",
        name: `Which stores sell ${brandName} ${categoryName.toLowerCase()}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${brandName} ${categoryName.toLowerCase()} products are available at major retailers including Amazon, Best Buy, Target, Walmart, and authorized ${brandName} dealers. We compare prices across all these stores to find you the best deals.`,
        },
      },
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <main className="pt-16">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-indigo-700 to-purple-800 text-white py-14 md:py-16 overflow-hidden">
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
                href="/brands" 
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                Brands
              </Link>
              <span className="text-white/50">/</span>
              <Link 
                href={`/brands/${brandSlug}`}
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                {brandName}
              </Link>
              <span className="text-white/50">/</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
                {categoryName}
              </span>
            </nav>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-white/70 uppercase tracking-wider text-sm font-medium">
                Brand + Category
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

        {/* SEO Intro Content */}
        <section className="py-8 border-b border-border">
          <PageContainer>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {generateBrandCategoryIntroContent(brandName, categoryName)}
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
            ) : featuredDeals.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="py-12 text-center">
                  <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No deals found</h3>
                  <p className="text-muted-foreground mb-4">
                    Check back soon for new {brandName} {categoryName.toLowerCase()} deals!
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Button variant="outline" asChild>
                      <Link href={`/brands/${brandSlug}`}>All {brandName} Deals</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/deals/${categorySlug}`}>All {categoryName} Deals</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </PageContainer>
        </section>

        {/* Shop by Store - Internal Links */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <h2 className="text-xl font-bold text-foreground mb-6">
              Shop {brandName} at Top Stores
            </h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {relatedStores.map((storeSlug) => (
                <Link
                  key={storeSlug}
                  href={`/stores/${storeSlug}`}
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

        {/* More Categories from this Brand */}
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <h2 className="text-xl font-bold text-foreground mb-6">
              More {brandName} Categories
            </h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {relatedCategories.map((catSlug) => (
                <Link
                  key={catSlug}
                  href={`/brands/${brandSlug}/${catSlug}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors"
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

        {/* Related Brands */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <h2 className="text-xl font-bold text-foreground mb-6">
              More {categoryName} Brands
            </h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {relatedBrands.map((relBrandSlug) => (
                <Link
                  key={relBrandSlug}
                  href={`/brands/${relBrandSlug}/${categorySlug}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
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
