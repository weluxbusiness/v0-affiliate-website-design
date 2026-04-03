import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/layout/page-container"
import { CapitalOnePromo } from "@/components/capital-one-promo"
import { Clock, Tag, ArrowRight, Flame, Sparkles, TrendingUp } from "lucide-react"
import { getLatestDeals } from "@/lib/deals"
import { getProductImageUrl } from "@/lib/deal-types"
import { FAQSection } from "@/components/seo"
import { latestDealsFAQs } from "@/lib/seo/faq-data"

export const metadata: Metadata = {
  title: "Latest Deals April 2026 - New Discounts Added Every Hour",
  description: "Be first to shop 100+ new deals added today! Fresh discounts from Amazon, Target, Best Buy & more. Updated hourly - grab new savings before anyone else!",
  keywords: [
    "latest deals", "new deals today", "fresh discounts",
    "newest deals 2026", "just added deals", "new arrivals"
  ],
  openGraph: {
    title: "Latest Deals April 2026 - New Discounts Added Hourly | SaveSmart",
    description: "100+ new deals added today from top retailers. Be first to grab fresh savings updated every hour!",
    type: "website",
    url: "https://savesmart.bio/latest-deals",
  },
  alternates: {
    canonical: "/latest-deals",
  },
}

// Revalidate every 5 minutes for fresh deals
export const revalidate = 300

export default async function LatestDealsPage() {
  const deals = await getLatestDeals(100)

  // Structured data for SEO - CollectionPage with ItemList
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Latest Deals & Discounts",
    url: "https://savesmart.bio/latest-deals",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="pt-16">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-primary to-primary/80 text-white py-14 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
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
                Latest Deals
              </span>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <Clock className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium uppercase tracking-wider text-white/80">
                Fresh Deals
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Latest Deals
            </h1>
            <p className="text-lg text-white/80 max-w-2xl">
              Discover the newest deals and discounts from top retailers. Updated continuously throughout the day.
            </p>

            <div className="mt-6">
              <Badge className="bg-white/20 text-white border-0">
                {deals.length} Active Deals
              </Badge>
            </div>
          </PageContainer>
        </section>

        {/* Capital One Promo */}
        <section className="py-8">
          <PageContainer>
            <CapitalOnePromo variant="inline" />
          </PageContainer>
        </section>

        {/* Deals Grid */}
        <section className="py-10 md:py-12">
          <PageContainer>
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {deals.map((deal) => (
                <Link 
                  key={deal.id} 
                  href={`/deal/${deal.slug || deal.id}`}
                  className="group"
                >
                  <Card className="h-full overflow-hidden border-border/50 transition-all hover:shadow-lg hover:border-primary/30">
                    <div className="relative aspect-square bg-muted">
                      <Image
                        src={getProductImageUrl(deal)}
                        alt={deal.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-secondary text-secondary-foreground text-xs">
                          {deal.discount_percentage}% OFF
                        </Badge>
                      </div>
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary" className="bg-background/90 text-xs gap-1">
                          <Clock className="h-3 w-3" />
                          New
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <p className="text-xs text-muted-foreground">{deal.store}</p>
                      <h3 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors mt-0.5">
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

            {deals.length === 0 && (
              <div className="text-center py-16">
                <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">No deals found</h2>
                <p className="text-muted-foreground mb-6">Check back soon for new deals!</p>
                <Button asChild>
                  <Link href="/deals">
                    Browse All Deals
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </PageContainer>
        </section>

        {/* Related Deals Section */}
        <section className="py-10 md:py-12 border-t border-border bg-muted/30">
          <PageContainer>
            <h2 className="text-xl font-bold mb-6">Explore More Deals</h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              <Link
                href="/trending-deals"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium text-foreground text-center">Trending Deals</span>
              </Link>
              <Link
                href="/deals"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Tag className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-foreground text-center">All Deals</span>
              </Link>
              <Link
                href="/deals/today"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Flame className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium text-foreground text-center">Today&apos;s Deals</span>
              </Link>
              <Link
                href="/deal-finder"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Sparkles className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium text-foreground text-center">AI Deal Finder</span>
              </Link>
              <Link
                href="/gaming"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Tag className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-foreground text-center">Gaming Codes</span>
              </Link>
              <Link
                href="/categories"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Tag className="h-5 w-5 text-pink-500" />
                <span className="text-sm font-medium text-foreground text-center">Categories</span>
              </Link>
            </div>
          </PageContainer>
        </section>

        {/* FAQ Section */}
        <FAQSection
          title="Latest Deals FAQ"
          subtitle="Common questions about our newest deals"
          faqs={latestDealsFAQs}
          className="border-t border-border"
        />

        {/* CTA */}
        <section className="py-10 md:py-12 text-center border-t border-border">
          <PageContainer>
            <h2 className="text-2xl font-bold mb-4">Never Miss a Deal</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Get instant notifications when we discover new deals matching your interests.
            </p>
            <Button size="lg" asChild>
              <Link href="/deal-finder">
                Try AI Deal Finder
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </PageContainer>
        </section>
      </main>

      <Footer />
    </div>
  )
}
