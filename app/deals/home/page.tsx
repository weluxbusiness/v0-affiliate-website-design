import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DealCard } from "@/components/deal-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getDealsByCategory } from "@/lib/deals"
import { getStoreInfo, formatRating, formatReviewCount } from "@/lib/deal-types"
import { PageContainer, DealGrid } from "@/components/layout/page-container"
import { 
  Home,
  ChefHat,
  Sofa,
  Lamp,
  Bath,
  Bed,
  ArrowRight,
  Sparkles,
  Star
} from "lucide-react"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Home & Kitchen Deals & Discounts",
  description: "Transform your home for less! Find deals on kitchen appliances, furniture, decor, and more from Amazon, Williams Sonoma, and Target.",
  openGraph: {
    title: "Home & Kitchen Deals & Discounts | SaveSmart",
    description: "Find the best deals on kitchen appliances, furniture, and home decor. Updated hourly.",
    type: "website",
    url: "https://savesmart.bio/deals/home",
  },
  alternates: {
    canonical: "/deals/home",
  },
}

const subcategories = [
  { name: "Kitchen", icon: ChefHat },
  { name: "Furniture", icon: Sofa },
  { name: "Lighting", icon: Lamp },
  { name: "Bathroom", icon: Bath },
  { name: "Bedroom", icon: Bed },
  { name: "Decor", icon: Home },
]

const topStores = ["Amazon", "Williams Sonoma", "Target"]

export default async function HomeDealsPage() {
  const deals = await getDealsByCategory("Home", 12)
  const featuredDeals = deals.slice(0, 3)
  const regularDeals = deals.slice(3)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-amber-500 to-orange-600 text-white py-12 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,white)]" />
          <PageContainer className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <Home className="h-6 w-6" />
              </div>
              <span className="text-amber-200 uppercase tracking-wider text-sm font-medium">Category</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Home & Kitchen Deals
            </h1>
            <p className="text-xl text-amber-100 max-w-2xl mb-8">
              Make your house a home for less! Amazing discounts on appliances, furniture, and decor.
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
            <div className="flex flex-wrap items-center gap-6 justify-center">
              <span className="text-sm text-muted-foreground">Top Home & Kitchen Stores:</span>
              {topStores.map((storeName) => {
                const store = getStoreInfo(storeName)
                return (
                  <div key={storeName} className="flex items-center gap-2">
                    <div className={`${store.color} h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                      {storeName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{storeName}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {formatRating(store.rating)} ({formatReviewCount(store.reviewCount)})
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </PageContainer>
        </section>

        {/* Featured Deals */}
        {featuredDeals.length > 0 && (
          <section className="py-12 md:py-16">
            <PageContainer>
              <h2 className="text-2xl font-bold text-foreground mb-6">Featured Home & Kitchen Deals</h2>
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
              <h2 className="text-2xl font-bold text-foreground">All Home & Kitchen Deals</h2>
              <Button variant="outline" className="gap-2" asChild>
                <Link href="/deals?category=home">
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
            <h2 className="text-2xl font-bold text-foreground mb-2">Need help finding the perfect item?</h2>
            <p className="text-muted-foreground mb-6">Our AI can help you discover home deals tailored to your needs.</p>
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
