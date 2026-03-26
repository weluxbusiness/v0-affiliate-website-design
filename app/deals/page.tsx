import Link from "next/link"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DealCard } from "@/components/deal-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CapitalOnePromo } from "@/components/capital-one-promo"
import { PopularCategories } from "@/components/popular-categories"
import { PageContainer, DealGrid, SectionHeading } from "@/components/layout/page-container"
import { FAQSection } from "@/components/seo"
import { getAllDeals } from "@/lib/deals"
import { getStoreInfo } from "@/lib/deal-types"
import { 
  Tag,
  Sparkles,
  Headphones,
  Shirt,
  Home,
  Laptop,
  ShoppingBag,
  ArrowRight
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

export const metadata: Metadata = {
  title: 'Today\'s Best Deals & Coupons 2026 - Up to 70% Off | SaveSmart',
  description: 'Browse 1000+ verified deals from Amazon, Best Buy, Target, Walmart & more. Save up to 70% on electronics, fashion, home goods. Updated every hour. Free!',
  keywords: [
    'deals today', 'best deals 2026', 'coupon codes', 'online deals',
    'Amazon deals', 'Best Buy deals', 'Target deals', 'Walmart deals',
    'electronics deals', 'fashion deals', 'home deals', 'discount codes'
  ],
  openGraph: {
    title: 'Today\'s Best Deals - Save Up to 70% | SaveSmart',
    description: 'Discover 1000+ verified deals updated hourly. Shop smart and save big on electronics, fashion, and more.',
    type: 'website',
    url: 'https://savesmart.bio/deals',
  },
  alternates: {
    canonical: '/deals',
  },
}

export default async function AllDealsPage() {
  const deals = await getAllDeals(24) ?? []
  
  const featuredDeals = deals.slice(0, 3)
  const regularDeals = deals.slice(3)
  
  const relatedStores = Object.entries(knownStores).slice(0, 8)
  const relatedCategories = Object.entries(productCategories).slice(0, 8)
  
  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: 'All Deals',
    description: 'Browse all the latest deals and discounts from top retailers.',
    url: 'https://savesmart.bio/deals',
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
        <section className="relative bg-gradient-to-br from-primary to-primary/80 text-white py-14 md:py-16 overflow-hidden">
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
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
                Deals
              </span>
            </nav>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <Tag className="h-6 w-6" />
              </div>
              <span className="text-white/70 uppercase tracking-wider text-sm font-medium">All Deals</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              All Deals
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mb-4">
              Browse all the latest deals and discounts from top retailers.
            </p>
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              {deals.length} Active Deals
            </Badge>
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
              <SectionHeading>Top Deals</SectionHeading>
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
                  <p className="text-muted-foreground mb-4">Check back soon for new deals!</p>
                </CardContent>
              </Card>
            ) : null}
          </PageContainer>
        </section>

        {/* Internal Links - Related Stores */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Shop by Store</h2>
              <Link href="/deals" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
              {relatedStores.map(([storeSlug, storeName]) => {
                const storeInfo = getStoreInfo(storeName)
                return (
                  <Link
                    key={storeSlug}
                    href={`/deals/store/${storeSlug}`}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <div className={`${storeInfo.color} h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                      {storeName.charAt(0)}
                    </div>
                    <span className="text-xs font-medium text-foreground text-center">{storeName}</span>
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
              {relatedCategories.map(([categorySlug, category]) => {
                const CategoryIcon = category.icon
                return (
                  <Link
                    key={categorySlug}
                    href={`/deals/${categorySlug}`}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <CategoryIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="text-xs font-medium text-foreground text-center">{category.name}</span>
                  </Link>
                )
              })}
            </div>
          </PageContainer>
        </section>

        <PopularCategories />

        {/* FAQ Section for SEO */}
        <FAQSection
          title="Deals FAQ"
          subtitle="Common questions about finding and using deals on SaveSmart"
          faqs={[
            {
              question: "How do I find the best deals on SaveSmart?",
              answer: "Browse our deals page sorted by discount percentage to see the biggest savings first. Use filters to narrow by category or store. Our AI Deal Finder can also help you search for specific products across all retailers to find the lowest price.",
            },
            {
              question: "Are all deals verified?",
              answer: "Yes, every deal on SaveSmart is verified against the retailer's website before being listed. We display the original price, sale price, and discount percentage so you can confirm the savings. Deals are updated multiple times per hour to ensure accuracy.",
            },
            {
              question: "How often do new deals get added?",
              answer: "New deals are added throughout the day as we discover them. During major sales events like Black Friday or Prime Day, we add hundreds of new deals per hour. Sign up for deal alerts to get notified when deals matching your interests go live.",
            },
            {
              question: "Can I stack coupons with these deals?",
              answer: "Many deals can be combined with store coupons for additional savings. Check the deal details page for available coupon codes. Some stores also offer cashback through credit cards or shopping portals that can stack with our deals.",
            },
            {
              question: "What if a deal expires or sells out?",
              answer: "Deals can expire or sell out quickly, especially during sales events. We mark expired deals and remove them from our listings. If you see a deal you like, we recommend acting fast. Bookmark this page and check back often for fresh deals.",
            },
          ]}
          className="border-t border-border"
        />

        {/* CTA */}
        <section className="py-10 md:py-12 text-center border-t border-border">
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
