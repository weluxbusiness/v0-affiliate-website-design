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
import { getDealsByStoreAndCategory, getDealsByStore } from "@/lib/deals"
import { getStoreInfo, formatRating, formatReviewCount } from "@/lib/deal-types"
import { 
  Store,
  Sparkles,
  Star,
  Headphones,
  Shirt,
  Home,
  Laptop,
  ShoppingBag,
  ArrowRight
} from "lucide-react"

// Revalidate pages every hour
export const revalidate = 3600

// Known stores (slug -> display name)
const knownStores: Record<string, string> = {
  'amazon': 'Amazon',
  'best-buy': 'Best Buy',
  'nike': 'Nike',
  'target': 'Target',
  'apple': 'Apple',
  'dyson': 'Dyson',
  'adidas': 'Adidas',
  'levis': "Levi's",
  'williams-sonoma': 'Williams Sonoma',
  'sunglass-hut': 'Sunglass Hut',
  'north-face': 'The North Face',
  'the-north-face': 'The North Face',
  'starbucks': 'Starbucks',
  'patagonia': 'Patagonia',
  'walmart': 'Walmart',
  'costco': 'Costco',
  'macys': "Macy's",
  'nordstrom': 'Nordstrom',
  'kohls': "Kohl's",
  'home-depot': 'Home Depot',
  'lowes': "Lowe's",
  'wayfair': 'Wayfair',
  'ikea': 'IKEA',
  'gap': 'Gap',
  'old-navy': 'Old Navy',
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
  params: Promise<{ store: string; category: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { store, category } = await params
  const storeSlug = store.toLowerCase()
  const categorySlug = category.toLowerCase()
  
  const storeName = knownStores[storeSlug] || storeSlug.replace(/-/g, ' ')
  const categoryInfo = productCategories[categorySlug]
  const categoryName = categoryInfo?.name || categorySlug.replace(/-/g, ' ')
  
  return {
    title: `Best ${storeName} ${categoryName} Deals ${new Date().getFullYear()} | SaveSmart`,
    description: `Discover the best ${categoryName.toLowerCase()} deals from ${storeName}. Compare discounts, find coupons, and save money with SaveSmart.`,
    openGraph: {
      title: `${storeName} ${categoryName} Deals | SaveSmart`,
      description: `Find exclusive ${categoryName.toLowerCase()} deals at ${storeName}. Up to 70% off with verified coupon codes.`,
      type: 'website',
    },
    alternates: {
      canonical: `/deals/store/${storeSlug}/${categorySlug}`,
    },
  }
}

export async function generateStaticParams() {
  const stores = ['amazon', 'best-buy', 'nike', 'target', 'walmart', 'apple']
  const categories = ['headphones', 'laptops', 'sneakers', 'smartphones', 'tvs', 'kitchen']
  
  const combinations: { store: string; category: string }[] = []
  
  for (const store of stores) {
    for (const category of categories) {
      combinations.push({ store, category })
    }
  }
  
  return combinations
}

export default async function StoreCategoryDealsPage({ params }: PageProps) {
  const { store, category } = await params
  const storeSlug = store.toLowerCase()
  const categorySlug = category.toLowerCase()
  
  const storeName = knownStores[storeSlug]
  const categoryInfo = productCategories[categorySlug]
  const categoryName = categoryInfo?.name || categorySlug.replace(/-/g, ' ')
  
  // Only allow known stores
  if (!storeName) {
    notFound()
  }
  
  // Try direct store+category match first
  let deals = await getDealsByStoreAndCategory(storeName, categoryName, 20)
  
  // If no exact matches, try broader search with search terms
  if (deals.length === 0 && categoryInfo) {
    const storeDeals = await getDealsByStore(storeName, 50)
    deals = storeDeals.filter(deal => 
      categoryInfo.searchTerms.some(term => 
        deal.title.toLowerCase().includes(term.toLowerCase()) ||
        deal.description?.toLowerCase().includes(term.toLowerCase()) ||
        deal.category.toLowerCase().includes(term.toLowerCase())
      )
    ).slice(0, 20)
  }
  
  const featuredDeals = deals.slice(0, 3)
  const regularDeals = deals.slice(3)
  
  const storeInfo = getStoreInfo(storeName)
  const Icon = categoryInfo?.icon || Store
  
  // Color mapping for store hero
  const colorMap: Record<string, string> = {
    'bg-[#FF9900]': 'from-[#FF9900] to-[#e88a00]',
    'bg-[#0046BE]': 'from-[#0046BE] to-[#003699]',
    'bg-black': 'from-zinc-800 to-zinc-900',
    'bg-[#CC0000]': 'from-[#CC0000] to-[#aa0000]',
  }
  const bgColor = colorMap[storeInfo.color] || 'from-primary to-primary/80'
  
  const relatedStores = Object.entries(knownStores).slice(0, 8)
  const relatedCategories = Object.entries(productCategories).slice(0, 8)
  
  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${storeName} ${categoryName} Deals`,
    description: `Find the best ${categoryName.toLowerCase()} deals at ${storeName}. Compare prices, discover coupons, and save money.`,
    url: `https://savesmart.bio/deals/store/${storeSlug}/${categorySlug}`,
    numberOfItems: deals.length,
    itemListElement: deals.slice(0, 10).map((deal, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: deal.title,
        description: deal.description,
        offers: {
          "@type": "Offer",
          price: deal.deal_price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        url: deal.slug ? `https://savesmart.bio/deal/${deal.slug}` : undefined,
      },
    })),
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
        <section className={`relative bg-gradient-to-br ${bgColor} text-white py-12 md:py-16 overflow-hidden`}>
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,white)]" />
          <PageContainer className="relative">
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
                href={`/deals/store/${storeSlug}`}
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
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-white/70 uppercase tracking-wider text-sm font-medium">
                {storeName} + {categoryName}
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              {storeName} {categoryName} Deals
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mb-4">
              Find the best {categoryName.toLowerCase()} deals at {storeName}. Compare prices, discover coupons, and save money.
            </p>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {deals.length} Active Deals
              </Badge>
              <div className="flex items-center gap-1 text-white/80">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm">
                  {formatRating(storeInfo.rating)} ({formatReviewCount(storeInfo.reviewCount)} reviews)
                </span>
              </div>
            </div>
          </PageContainer>
        </section>

        {/* Capital One Promo */}
        <section className="py-8 md:py-10">
          <PageContainer>
            <CapitalOnePromo variant="inline" />
          </PageContainer>
        </section>

        {/* Featured Deals */}
        {featuredDeals.length > 0 && (
          <section className="py-12 md:py-16">
            <PageContainer>
              <SectionHeading>Top {storeName} {categoryName} Deals</SectionHeading>
              <DealGrid columns={3}>
                {featuredDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} variant="featured" />
                ))}
              </DealGrid>
            </PageContainer>
          </section>
        )}

        {/* All Deals */}
        <section className="bg-muted/30 py-12 md:py-16">
          <PageContainer>
            <SectionHeading>All Deals</SectionHeading>
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
                    We don't have {categoryName.toLowerCase()} deals from {storeName} right now.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button variant="outline" asChild>
                      <Link href={`/deals/store/${storeSlug}`}>
                        View All {storeName} Deals
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/deals/${categorySlug}`}>
                        View All {categoryName} Deals
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </PageContainer>
        </section>

        {/* Internal Links - Related Stores */}
        <section className="py-12 md:py-16 border-t border-border">
          <PageContainer>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Shop {categoryName} by Store</h2>
              <Link href={`/deals/${categorySlug}`} className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
              {relatedStores.map(([slug, name]) => {
                const info = getStoreInfo(name)
                const isActive = slug === storeSlug
                return (
                  <Link
                    key={slug}
                    href={`/deals/store/${slug}/${categorySlug}`}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors ${
                      isActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    <div className={`${info.color} h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                      {name.charAt(0)}
                    </div>
                    <span className="text-xs font-medium text-foreground text-center">{name}</span>
                  </Link>
                )
              })}
            </div>
          </PageContainer>
        </section>

        {/* Internal Links - Categories */}
        <section className="pb-12 md:pb-16">
          <PageContainer>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">{storeName} by Category</h2>
              <Link href={`/deals/store/${storeSlug}`} className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
              {relatedCategories.map(([catSlug, cat]) => {
                const CategoryIcon = cat.icon
                const isActive = catSlug === categorySlug
                return (
                  <Link
                    key={catSlug}
                    href={`/deals/store/${storeSlug}/${catSlug}`}
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

        <PopularCategories />

        {/* CTA */}
        <section className="py-12 md:py-16 text-center border-t border-border">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground mb-2">Can't find what you're looking for?</h2>
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
