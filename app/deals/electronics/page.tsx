import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DealCard } from "@/components/deal-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getDealsByCategory } from "@/lib/deals"
import { getStoreInfo, formatRating, formatReviewCount } from "@/lib/deal-types"
import { CapitalOnePromo } from "@/components/capital-one-promo"
import { PageContainer, DealGrid } from "@/components/layout/page-container"
import { 
  Laptop,
  Headphones,
  Tv,
  Smartphone,
  Watch,
  Camera,
  ArrowRight,
  Sparkles,
  Star
} from "lucide-react"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Electronics Deals & Discounts",
  description: "Save big on electronics! Find deals on laptops, TVs, headphones, smartphones, and more from top retailers like Amazon, Best Buy, and Apple.",
  openGraph: {
    title: "Electronics Deals & Discounts | SaveSmart",
    description: "Find the best electronics deals on laptops, TVs, headphones, smartphones and more. Updated hourly.",
    type: "website",
  },
}

const subcategories = [
  { name: "Laptops", icon: Laptop },
  { name: "TVs", icon: Tv },
  { name: "Headphones", icon: Headphones },
  { name: "Smartphones", icon: Smartphone },
  { name: "Smartwatches", icon: Watch },
  { name: "Cameras", icon: Camera },
]

const topStores = ["Amazon", "Best Buy", "Apple"]

export default async function ElectronicsDealsPage() {
  const deals = await getDealsByCategory("Electronics", 12)
  const featuredDeals = deals.slice(0, 3)
  const regularDeals = deals.slice(3)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-12 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,white)]" />
          <PageContainer className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <Laptop className="h-6 w-6" />
              </div>
              <span className="text-blue-200 uppercase tracking-wider text-sm font-medium">Category</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Electronics Deals
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mb-8">
              Save big on the latest tech! From laptops and TVs to headphones and smartwatches.
            </p>
            <div className="flex flex-wrap gap-3">
              {subcategories.map((sub) => (
                <Button key={sub.name} variant="secondary" size="sm" className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <sub.icon className="h-4 w-4" />
                  {sub.name}
                </Button>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Top Stores */}
        <section className="bg-card border-b border-border py-6">
          <PageContainer>
            <p className="text-sm text-muted-foreground text-center mb-4">Top Electronics Stores:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {topStores.map((storeName) => {
                const store = getStoreInfo(storeName)
                return (
                  <Link
                    key={storeName}
                    href={`/stores/${storeName.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex items-center gap-3 bg-background rounded-lg px-4 py-3 border border-border hover:border-primary/50 hover:shadow-sm transition-all min-h-[56px]"
                  >
                    <div className={`${store.color} h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                      {storeName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{storeName}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                        <span>{formatRating(store.rating)} ({formatReviewCount(store.reviewCount)})</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </PageContainer>
        </section>

        {/* Capital One Promo */}
        <CapitalOnePromo variant="banner" />

        {/* Featured Deals */}
        {featuredDeals.length > 0 && (
          <section className="py-12 md:py-16">
            <PageContainer>
              <h2 className="text-2xl font-bold text-foreground mb-6">Featured Electronics Deals</h2>
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">All Electronics Deals</h2>
              <Button variant="outline" className="gap-2" asChild>
                <Link href="/deals?category=electronics">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            {regularDeals.length > 0 ? (
              <DealGrid>
                {regularDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </DealGrid>
            ) : (
              <Card className="border-border/50">
                <CardContent className="py-12 text-center">
                  <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">More deals coming soon!</p>
                </CardContent>
              </Card>
            )}
          </PageContainer>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-16 text-center">
          <PageContainer>
          <h2 className="text-2xl font-bold text-foreground mb-2">Looking for specific electronics?</h2>
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
