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
import { Clock, Tag, ArrowRight } from "lucide-react"
import { getLatestDeals } from "@/lib/deals"
import { getProductImageUrl } from "@/lib/deal-types"

export const metadata: Metadata = {
  title: "Latest Deals & Discounts | SaveSmart",
  description: "Browse the newest deals and discounts discovered by SaveSmart. Fresh savings added daily from top retailers.",
  openGraph: {
    title: "Latest Deals & Discounts | SaveSmart",
    description: "Browse the newest deals and discounts discovered by SaveSmart. Fresh savings added daily from top retailers.",
    type: "website",
    url: "https://savesmart.bio/latest-deals",
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
