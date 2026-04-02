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
import { PopularCategories } from "@/components/popular-categories"
import { PageContainer, DealGrid, SectionHeading } from "@/components/layout/page-container"
import { getDealsByCategory, searchDeals } from "@/lib/deals"
import { getStoreInfo } from "@/lib/deal-types"
import { 
  SeoContentBlock, 
  generateCategorySeoContent, 
  getCategoryRelatedLinks 
} from "@/components/seo-content-block"
import { CategoryCrossLinks } from "@/components/internal-links"
import { getCategoryBySlug, getCategorySlugs, getStoresForCategory, getBrandSlugs } from "@/lib/seo-data"
import { formatBrandName } from "@/lib/seo/content"
import { getPopularCities, formatCityName } from "@/lib/cities"
import { 
  Tag,
  Sparkles,
  Headphones,
  Shirt,
  Home,
  Laptop,
  ShoppingBag,
  ArrowRight,
  Clock,
  MapPin,
  Award
} from "lucide-react"

// Revalidate pages every hour
export const revalidate = 3600

// Known stores for navigation
const knownStores: Record<string, string> = {
  'amazon': 'Amazon',
  'best-buy': 'Best Buy',
  'nike': 'Nike',
  'target': 'Target',
  'apple': 'Apple',
  'dyson': 'Dyson',
  'walmart': 'Walmart',
  'costco': 'Costco',
}

// Product categories with search terms and icons
const productCategories: Record<string, { name: string; searchTerms: string[]; icon: typeof Headphones }> = {
  'headphones': { name: 'Headphones', searchTerms: ['headphones', 'earbuds', 'airpods'], icon: Headphones },
  'running-shoes': { name: 'Running Shoes', searchTerms: ['running', 'shoes'], icon: ShoppingBag },
  'laptops': { name: 'Laptops', searchTerms: ['laptop', 'macbook', 'notebook'], icon: Laptop },
  'tvs': { name: 'TVs', searchTerms: ['tv', 'television', 'oled', 'qled'], icon: Laptop },
  'smartphones': { name: 'Smartphones', searchTerms: ['phone', 'iphone', 'android', 'smartphone'], icon: Laptop },
  'smartwatches': { name: 'Smartwatches', searchTerms: ['watch', 'smartwatch', 'apple watch'], icon: Laptop },
  'jeans': { name: 'Jeans', searchTerms: ['jeans', 'denim'], icon: Shirt },
  'jackets': { name: 'Jackets', searchTerms: ['jacket', 'coat', 'parka'], icon: Shirt },
  'sneakers': { name: 'Sneakers', searchTerms: ['sneakers', 'shoes', 'trainers'], icon: ShoppingBag },
  'coffee-makers': { name: 'Coffee Makers', searchTerms: ['coffee', 'espresso'], icon: Home },
  'air-fryers': { name: 'Air Fryers', searchTerms: ['air fryer', 'ninja'], icon: Home },
  'vacuums': { name: 'Vacuums', searchTerms: ['vacuum', 'dyson', 'roomba'], icon: Home },
  'blenders': { name: 'Blenders', searchTerms: ['blender', 'vitamix'], icon: Home },
  'sunglasses': { name: 'Sunglasses', searchTerms: ['sunglasses', 'ray-ban'], icon: Shirt },
  'kitchen': { name: 'Kitchen', searchTerms: ['kitchen', 'cookware', 'appliance'], icon: Home },
  'electronics': { name: 'Electronics', searchTerms: ['electronics', 'tech', 'gadget'], icon: Laptop },
  'fashion': { name: 'Fashion', searchTerms: ['fashion', 'clothing', 'apparel'], icon: Shirt },
  'home-kitchen': { name: 'Home & Kitchen', searchTerms: ['home', 'kitchen', 'furniture'], icon: Home },
}

interface PageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params
  const categorySlug = category.toLowerCase()
  const categoryInfo = productCategories[categorySlug]
  const categoryName = categoryInfo?.name || categorySlug.replace(/-/g, ' ')
  const month = new Date().toLocaleString('default', { month: 'long' })
  const year = new Date().getFullYear()
  
  return {
    title: `${categoryName} Deals ${month} ${year} - Save 50-70% Today | Limited Time`,
    description: `Best ${categoryName.toLowerCase()} deals ending soon! Compare prices from Amazon, Best Buy, Target & Walmart. Save 50-70% with verified coupons. Updated hourly - shop now!`,
    keywords: [
      `${categoryName.toLowerCase()} deals`, `best ${categoryName.toLowerCase()} deals ${year}`,
      `${categoryName.toLowerCase()} sale`, `${categoryName.toLowerCase()} discount`,
      `cheap ${categoryName.toLowerCase()}`, `${categoryName.toLowerCase()} coupon codes`,
      `${categoryName.toLowerCase()} deals ${month} ${year}`, `${categoryName.toLowerCase()} deals today`,
    ],
    openGraph: {
      title: `${categoryName} Deals ${month} ${year} - Up to 70% Off Today | SaveSmart`,
      description: `Compare ${categoryName.toLowerCase()} prices from top retailers. Limited-time deals updated hourly. Shop now!`,
      type: 'website',
      url: `https://savesmart.bio/deals/${categorySlug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryName} Deals ${month} ${year} - Up to 70% Off`,
      description: `Best ${categoryName.toLowerCase()} deals from Amazon, Best Buy & more. Limited time!`,
    },
    alternates: {
      canonical: `/deals/${categorySlug}`,
    },
  }
}

// Dynamic params from database with fallback
export async function generateStaticParams() {
  const categorySlugs = await getCategorySlugs()
  const fallbackCategories = Object.keys(productCategories)
  const slugs = categorySlugs.length > 0 ? categorySlugs : fallbackCategories
  return slugs.map(category => ({ category }))
}

export default async function CategoryDealsPage({ params }: PageProps) {
  const { category } = await params
  const categorySlug = category.toLowerCase()
  
  // Try to get category from database first
  const dbCategory = await getCategoryBySlug(categorySlug)
  const categoryInfo = productCategories[categorySlug]
  const categoryName = dbCategory?.name || categoryInfo?.name || categorySlug.replace(/-/g, ' ')
  const searchTerms = categoryInfo?.searchTerms || [categoryName]
  
  // Get stores that have deals in this category for internal linking
  const storesForCategory = await getStoresForCategory(categorySlug, 10)
  
  // Get related categories for cross-linking
  const relatedCategorySlugs = Object.keys(productCategories).filter(c => c !== categorySlug).slice(0, 8)
  
  // Get popular brands for internal linking to /deals/{category}/{brand}
  const popularBrands = (await getBrandSlugs()).slice(0, 8)
  
  // Try searching by search terms first
  const searchResults = await Promise.all(searchTerms.map(term => searchDeals(term, 8)))
  let deals = [...new Map(searchResults.flat().map(d => [d.id, d])).values()].slice(0, 20)
  
  // If no results, fall back to category search
  if (deals.length === 0) {
    deals = await getDealsByCategory(categoryName, 20)
  }
  
  // Check if this is actually a store slug (redirect to store page)
  if (knownStores[categorySlug]) {
    notFound()
  }
  
  const featuredDeals = deals.slice(0, 3)
  const regularDeals = deals.slice(3)
  
  const relatedStores = Object.entries(knownStores).slice(0, 8)
  const relatedCategories = Object.entries(productCategories).slice(0, 8)
  
  const Icon = categoryInfo?.icon || Tag
  
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
    name: `${categoryName} Deals`,
    url: `https://savesmart.bio/deals/${categorySlug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: deals.length,
    },
  }

  // FAQ structured data for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What are the best ${categoryName.toLowerCase()} deals today?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `We currently have ${deals.length} active ${categoryName.toLowerCase()} deals from top retailers like Amazon, Best Buy, Target and more. Our deals are sorted by discount percentage, so the best savings appear first. Check back often as new deals are added throughout the day.`,
        },
      },
      {
        "@type": "Question",
        name: "How often are deals updated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our deals are refreshed every hour to ensure you see the most current prices and discounts. Each listing shows when it was last verified, so you know you're getting up-to-date information.",
        },
      },
      {
        "@type": "Question",
        name: `Which stores offer the biggest ${categoryName.toLowerCase()} discounts?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `For ${categoryName.toLowerCase()}, we track deals from Amazon, Best Buy, Target, Walmart, and specialty retailers. Discount percentages vary by store and product, but we highlight the best savings so you can compare easily.`,
        },
      },
      {
        "@type": "Question",
        name: "How do I know if a deal is legitimate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "All deals on SaveSmart are verified against retailer websites. We show the original price, sale price, and discount percentage for transparency. Click any deal to be taken directly to the retailer's product page where you can confirm pricing.",
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
        <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-14 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,white)]" />
          <PageContainer className="relative">
            {/* Breadcrumbs */}
            <nav className="mb-6 flex items-center gap-2 text-sm">
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
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
                {categoryName}
              </span>
            </nav>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-white/70 uppercase tracking-wider text-sm font-medium">Category</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              {categoryName} Deals
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mb-4">
              Compare prices and find the best deals on {categoryName.toLowerCase()} from top retailers.
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

        {/* Featured Deals */}
        {featuredDeals.length > 0 && (
          <section className="py-10 md:py-12">
            <PageContainer>
              <SectionHeading>Top {categoryName} Deals</SectionHeading>
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
            <SectionHeading>All {categoryName} Deals</SectionHeading>
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
                  <p className="text-muted-foreground mb-4">Check back soon for new {categoryName.toLowerCase()} deals!</p>
                  <Button variant="outline" asChild>
                    <Link href="/deals">Browse All Deals</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : null}
          </PageContainer>
        </section>

        {/* Best Deals CTA - Link to /best/{category} */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <Link 
              href={`/best/${categorySlug}`}
              className="block p-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Award className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Best {categoryName} Deals</h2>
                    <p className="text-white/90">Our top picks with the biggest discounts</p>
                  </div>
                </div>
                <ArrowRight className="h-6 w-6 hidden sm:block" />
              </div>
            </Link>
          </PageContainer>
        </section>

        {/* Popular Brands in Category - Internal Links */}
        {popularBrands.length > 0 && (
          <section className="py-10 md:py-12 border-t border-border">
            <PageContainer>
              <h2 className="text-xl font-bold text-foreground mb-6">Popular {categoryName} Brands</h2>
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
                {popularBrands.map((brandSlug) => (
                  <Link
                    key={brandSlug}
                    href={`/deals/${categorySlug}/${brandSlug}`}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground truncate">
                      {formatBrandName(brandSlug)}
                    </span>
                  </Link>
                ))}
              </div>
            </PageContainer>
          </section>
        )}

        {/* Top Stores for Category */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <h2 className="text-xl font-bold text-foreground mb-6">Top Stores for {categoryName}</h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
              {relatedStores.map(([storeSlug, storeName]) => {
                const storeInfo = getStoreInfo(storeName)
                return (
                  <Link
                    key={storeSlug}
                    href={`/stores/${storeSlug}/${categorySlug}`}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <div className={`${storeInfo.color} h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold`}>
                      {storeName.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-foreground text-center">{storeName}</span>
                  </Link>
                )
              })}
            </div>
          </PageContainer>
        </section>

        {/* Internal Links - Categories */}
        <section className="pb-10 md:pb-12">
          <PageContainer>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Shop by Category</h2>
            </div>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
              {relatedCategories.map(([catSlug, cat]) => {
                const CategoryIcon = cat.icon
                const isActive = catSlug === categorySlug
                return (
                  <Link
                    key={catSlug}
                    href={`/deals/${catSlug}`}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors ${
                      isActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <CategoryIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="text-xs font-medium text-foreground text-center">{cat.name}</span>
                  </Link>
                )
              })}
            </div>
          </PageContainer>
        </section>

        {/* City-based Deals - Internal Links for SEO */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <h2 className="text-xl font-bold text-foreground mb-2">
              {categoryName} Deals by City
            </h2>
            <p className="text-muted-foreground mb-6">
              Find {categoryName.toLowerCase()} deals near you
            </p>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {getPopularCities(12).map((city) => (
                <Link
                  key={city}
                  href={`/deals/${categorySlug}/city/${city}`}
                  className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium text-foreground truncate">
                    {formatCityName(city)}
                  </span>
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* SEO Content Block */}
        <SeoContentBlock
          title={`About ${categoryName} Deals`}
          content={generateCategorySeoContent(categoryName)}
          relatedLinks={[
            { label: `Best ${categoryName}`, href: `/best/${categorySlug}` },
            ...getCategoryRelatedLinks(categorySlug, categoryName),
          ]}
        />

        {/* Cross Link Section - Internal Linking for SEO */}
        <CategoryCrossLinks
          categoryName={categoryName}
          categorySlug={categorySlug}
          relatedCategories={relatedCategorySlugs}
          storesWithDeals={storesForCategory}
        />

        <PopularCategories />

        {/* CTA */}
        <section className="py-10 md:py-12 text-center border-t border-border">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground mb-2">Looking for a specific {categoryName.toLowerCase()} deal?</h2>
            <p className="text-muted-foreground mb-6">Our AI can help you find exactly what you need at the best price.</p>
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
