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
import { getDealsByStore } from "@/lib/deals"
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

// Product categories for navigation
const productCategories: Record<string, { name: string; icon: typeof Headphones }> = {
  'headphones': { name: 'Headphones', icon: Headphones },
  'running-shoes': { name: 'Running Shoes', icon: ShoppingBag },
  'laptops': { name: 'Laptops', icon: Laptop },
  'tvs': { name: 'TVs', icon: Laptop },
  'smartphones': { name: 'Smartphones', icon: Laptop },
  'jeans': { name: 'Jeans', icon: Shirt },
  'jackets': { name: 'Jackets', icon: Shirt },
  'sneakers': { name: 'Sneakers', icon: ShoppingBag },
  'coffee-makers': { name: 'Coffee Makers', icon: Home },
  'vacuums': { name: 'Vacuums', icon: Home },
  'kitchen': { name: 'Kitchen', icon: Home },
  'electronics': { name: 'Electronics', icon: Laptop },
  'fashion': { name: 'Fashion', icon: Shirt },
  'home-kitchen': { name: 'Home & Kitchen', icon: Home },
}

interface PageProps {
  params: Promise<{ store: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { store } = await params
  const storeSlug = store.toLowerCase()
  const storeName = knownStores[storeSlug] || storeSlug.replace(/-/g, ' ')
  
  return {
    title: `${storeName} Deals & Coupons - Up to 70% Off | SaveSmart`,
    description: `Find the best ${storeName} deals, discounts, and coupon codes. Save money on your favorite products with verified offers updated daily.`,
    openGraph: {
      title: `${storeName} Deals & Coupons | SaveSmart`,
      description: `Discover exclusive ${storeName} deals and save up to 70%. Verified coupons and discounts updated hourly.`,
      type: 'website',
    },
    alternates: {
      canonical: `/deals/store/${storeSlug}`,
    },
  }
}

export async function generateStaticParams() {
  return Object.keys(knownStores).map((store) => ({
    store,
  }))
}

export default async function StoreDealsPage({ params }: PageProps) {
  const { store } = await params
  const storeSlug = store.toLowerCase()
  const storeName = knownStores[storeSlug]
  
  // Only allow known stores
  if (!storeName) {
    notFound()
  }
  
  const deals = await getDealsByStore(storeName, 20)
  
  const featuredDeals = deals.slice(0, 3)
  const regularDeals = deals.slice(3)
  
  const storeInfo = getStoreInfo(storeName)
  
  // Color mapping for store hero
  const colorMap: Record<string, string> = {
    'bg-[#FF9900]': 'from-[#FF9900] to-[#e88a00]',
    'bg-[#0046BE]': 'from-[#0046BE] to-[#003699]',
    'bg-black': 'from-zinc-800 to-zinc-900',
    'bg-[#CC0000]': 'from-[#CC0000] to-[#aa0000]',
  }
  const bgColor = colorMap[storeInfo.color] || 'from-primary to-primary/80'
  
  const relatedStores = Object.entries(knownStores).slice(0, 8)
  const relatedCategories = Object.entries(productCategories).slice(0, 12)
  
  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${storeName} Deals`,
    description: `Save big on your favorite products from ${storeName}. Verified deals and coupon codes updated daily.`,
    url: `https://savesmart.bio/deals/store/${storeSlug}`,
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
        <section className={`relative bg-gradient-to-br ${bgColor} text-white py-14 md:py-16 overflow-hidden`}>
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
                {storeName}
              </span>
            </nav>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <Store className="h-6 w-6" />
              </div>
              <span className="text-white/70 uppercase tracking-wider text-sm font-medium">Store</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              {storeName} Deals
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mb-4">
              Save big on your favorite products from {storeName}. Verified deals and coupon codes updated daily.
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
        <section className="py-8">
          <PageContainer>
            <CapitalOnePromo variant="inline" />
          </PageContainer>
        </section>

        {/* Featured Deals */}
        {featuredDeals.length > 0 && (
          <section className="py-10 md:py-12">
            <PageContainer>
              <SectionHeading>Top {storeName} Deals</SectionHeading>
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
            <SectionHeading>All {storeName} Deals</SectionHeading>
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
                  <p className="text-muted-foreground mb-4">Check back soon for new {storeName} deals!</p>
                  <Button variant="outline" asChild>
                    <Link href="/deals">Browse All Deals</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : null}
          </PageContainer>
        </section>

        {/* Store + Category Cross Links */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <h2 className="text-xl font-bold text-foreground mb-6">
              {storeName} Deals by Category
            </h2>
            <div className="flex flex-wrap gap-2">
              {relatedCategories.map(([catSlug, cat]) => (
                <Link
                  key={catSlug}
                  href={`/deals/store/${storeSlug}/${catSlug}`}
                  className="px-4 py-2 rounded-full border border-border text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {storeName} {cat.name}
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Internal Links - Related Stores */}
        <section className="pb-10 md:pb-12">
          <PageContainer>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Shop by Store</h2>
              <Link href="/deals" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
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
                    href={`/deals/store/${slug}`}
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

        <PopularCategories />

        {/* CTA */}
        <section className="py-10 md:py-12 text-center border-t border-border">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground mb-2">Looking for a specific {storeName} deal?</h2>
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
