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
import { TrendingUp, Tag, ArrowRight, Flame, Sparkles } from "lucide-react"
import { getTrendingDeals } from "@/lib/deals"
import { getProductImageUrl, storeToSlug } from "@/lib/deal-types"
import { FAQSection } from "@/components/seo"
import { trendingDealsFAQs } from "@/lib/seo/faq-data"

export const metadata: Metadata = {
  title: "Trending Deals April 2026 - Save 50-70% on Hot Items Today",
  description: "Shop the hottest trending deals before they sell out! Save 50-70% on laptops, sneakers, headphones & more. 500+ deals updated hourly - grab them now!",
  keywords: [
    "trending deals", "hot deals 2026", "best discounts today",
    "popular deals", "viral deals", "selling fast", "limited stock"
  ],
  openGraph: {
    title: "Trending Deals April 2026 - Save 50-70% Today | SaveSmart",
    description: "Hottest deals selling fast! Save 50-70% on laptops, sneakers, headphones & more. Shop now before they're gone!",
    type: "website",
    url: "https://savesmart.bio/trending-deals",
  },
  alternates: {
    canonical: "/trending-deals",
  },
}

export const revalidate = 300

export default async function TrendingDealsPage() {
  const deals = await getTrendingDeals(50)

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Trending Deals",
    url: "https://savesmart.bio/trending-deals",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: deals.length,
    },
  }

  const trendingCategories = [
    { slug: "laptops", label: "Laptops", href: "/trending/laptops" },
    { slug: "sneakers", label: "Sneakers", href: "/trending/sneakers" },
    { slug: "headphones", label: "Headphones", href: "/trending/headphones" },
    { slug: "electronics", label: "Electronics", href: "/trending/electronics" },
    { slug: "fashion", label: "Fashion", href: "/trending/fashion" },
    { slug: "gaming", label: "Gaming", href: "/trending/gaming" },
  ]

  const popularStores = ["Amazon", "Nike", "Best Buy", "Target", "Apple", "Walmart"]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="pt-16">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-orange-600 to-red-600 text-white py-14 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <PageContainer className="relative">
            <nav className="mb-6 flex items-center gap-2 text-sm">
              <Link 
                href="/" 
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                Home
              </Link>
              <span className="text-white/50">/</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
                Trending Deals
              </span>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <TrendingUp className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium uppercase tracking-wider text-white/80">
                Hot Right Now
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Trending Deals
            </h1>
            <p className="text-lg text-white/80 max-w-2xl">
              The hottest deals with the biggest discounts. These top-rated savings are flying off the shelves.
            </p>

            <div className="mt-6">
              <Badge className="bg-white/20 text-white border-0">
                {deals.length} Trending Deals
              </Badge>
            </div>
          </PageContainer>
        </section>

        {/* Trending Category Links */}
        <section className="py-6 border-b border-border">
          <PageContainer>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Browse by category:</span>
              {trendingCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={cat.href}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border hover:border-primary hover:bg-primary/5 text-sm font-medium transition-colors"
                >
                  <Flame className="h-4 w-4 text-orange-500" />
                  {cat.label}
                </Link>
              ))}
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
            <h2 className="text-2xl font-bold mb-6">Top Trending Deals</h2>
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {deals.map((deal, index) => (
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
                        <Badge className="bg-orange-500 text-white text-xs">
                          {deal.discount_percentage}% OFF
                        </Badge>
                      </div>
                      {index < 5 && (
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="bg-background/90 text-xs gap-1">
                            <Flame className="h-3 w-3 text-orange-500" />
                            #{index + 1}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <p className="text-xs text-muted-foreground">{deal.store}</p>
                      <h3 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors mt-0.5">
                        {deal.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="font-bold text-orange-600">
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
                <h2 className="text-xl font-semibold mb-2">No trending deals found</h2>
                <p className="text-muted-foreground mb-6">Check back soon for hot deals!</p>
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

        {/* Internal Links - Categories */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <h2 className="text-xl font-bold mb-6">Shop by Category</h2>
            <div className="flex flex-wrap gap-3">
              {["Electronics", "Fashion", "Home & Kitchen", "Laptops", "Headphones", "Sneakers"].map((category) => (
                <Link
                  key={category}
                  href={`/deals/${category.toLowerCase().replace(' & ', '-')}`}
                  className="inline-flex items-center px-4 py-2 rounded-full border border-border hover:bg-muted text-sm font-medium text-foreground transition-colors"
                >
                  {category}
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Internal Links - Stores */}
        <section className="pb-10 md:pb-12">
          <PageContainer>
            <h2 className="text-xl font-bold mb-6">Shop by Store</h2>
            <div className="flex flex-wrap gap-3">
              {popularStores.map((store) => (
                <Link
                  key={store}
                  href={`/stores/${storeToSlug(store)}`}
                  className="inline-flex items-center px-4 py-2 rounded-full border border-border hover:bg-muted text-sm font-medium text-foreground transition-colors"
                >
                  {store}
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Related Deals Section */}
        <section className="py-10 md:py-12 border-t border-border bg-muted/30">
          <PageContainer>
            <h2 className="text-xl font-bold mb-6">Explore More Deals</h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              <Link
                href="/latest-deals"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Tag className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground text-center">Latest Deals</span>
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
                <Flame className="h-5 w-5 text-orange-500" />
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
                href="/blog"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Tag className="h-5 w-5 text-pink-500" />
                <span className="text-sm font-medium text-foreground text-center">Savings Tips</span>
              </Link>
            </div>
          </PageContainer>
        </section>

        {/* FAQ Section */}
        <FAQSection
          title="Trending Deals FAQ"
          subtitle="Common questions about trending deals on SaveSmart"
          faqs={trendingDealsFAQs}
          className="border-t border-border"
        />

        {/* CTA */}
        <section className="py-10 md:py-12 text-center border-t border-border">
          <PageContainer>
            <h2 className="text-2xl font-bold mb-4">Want Personalized Deal Alerts?</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Tell us what you&apos;re looking for and we&apos;ll notify you when matching deals go live.
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
