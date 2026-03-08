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
import { getDealsForSeoPage, searchDeals } from "@/lib/deals"
import { parseSeoSlug, getRelatedSeoSlugs, getAllSeoSlugs } from "@/lib/seo/seo-slug-parser"
import { 
  Tag,
  Sparkles,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Store,
  Grid3X3
} from "lucide-react"

// Revalidate pages every hour for fresh deals
export const revalidate = 3600

interface PageProps {
  params: Promise<{ seoSlug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { seoSlug } = await params
  const parsed = parseSeoSlug(seoSlug)
  
  return {
    title: parsed.title,
    description: parsed.description,
    openGraph: {
      title: parsed.h1,
      description: parsed.description,
      type: 'website',
      url: `https://savesmart.bio/promo/${seoSlug}`,
    },
    alternates: {
      canonical: `/promo/${seoSlug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export async function generateStaticParams() {
  // Generate params for the most important SEO pages
  const slugs = getAllSeoSlugs().slice(0, 500) // Limit for build time
  return slugs.map((seoSlug) => ({ seoSlug }))
}

export default async function ProgrammaticSeoPage({ params }: PageProps) {
  const { seoSlug } = await params
  const parsed = parseSeoSlug(seoSlug)
  
  // Build query filters based on parsed slug
  const filters = {
    category: parsed.category,
    brand: parsed.brand,
    maxPrice: parsed.maxPrice,
  }
  
  // Fetch deals matching the SEO query
  let deals = await getDealsForSeoPage(filters, 50)
  
  // If no specific results, try a general search
  if (deals.length === 0) {
    const searchTerm = parsed.category || parsed.brand || seoSlug.replace(/-/g, ' ')
    deals = await searchDeals(searchTerm, 50)
  }
  
  const featuredDeals = deals.slice(0, 4)
  const regularDeals = deals.slice(4)
  const relatedSlugs = getRelatedSeoSlugs(parsed)
  
  // Determine page icon based on type
  const pageIcon = parsed.maxPrice ? DollarSign : parsed.type === 'best' ? TrendingUp : Tag
  const PageIcon = pageIcon
  
  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: parsed.h1,
    description: parsed.description,
    url: `https://savesmart.bio/promo/${seoSlug}`,
    numberOfItems: deals.length,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: deals.length,
      itemListElement: deals.slice(0, 20).map((deal, index) => ({
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
        <section className="relative bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-14 md:py-16 overflow-hidden">
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
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
                {parsed.h1.replace(' Deals', '')}
              </span>
            </nav>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <PageIcon className="h-6 w-6" />
              </div>
              <span className="text-white/70 uppercase tracking-wider text-sm font-medium">
                {parsed.maxPrice ? 'Budget Deals' : parsed.type === 'best' ? 'Top Rated' : parsed.brand ? 'Brand Deals' : 'Deals'}
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              {parsed.h1}
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mb-4">
              {parsed.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {deals.length} Active Deals
              </Badge>
              {parsed.maxPrice && (
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  Max ${parsed.maxPrice}
                </Badge>
              )}
              {parsed.brandDisplay && (
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  {parsed.brandDisplay}
                </Badge>
              )}
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
              <SectionHeading>Top {parsed.categoryDisplay || parsed.brandDisplay || ''} Deals</SectionHeading>
              <DealGrid columns={4}>
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
            <SectionHeading>
              {parsed.maxPrice 
                ? `All Deals Under $${parsed.maxPrice}` 
                : `All ${parsed.h1.replace(' Deals', '')} Deals`}
            </SectionHeading>
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
                  <p className="text-muted-foreground mb-4">We are constantly adding new deals. Check back soon!</p>
                  <Button variant="outline" asChild>
                    <Link href="/deals">Browse All Deals</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : null}
          </PageContainer>
        </section>

        {/* Related SEO Pages - Internal Linking */}
        {relatedSlugs.length > 0 && (
          <section className="py-10 md:py-12 border-t border-border">
            <PageContainer>
              <div className="flex items-center gap-2 mb-6">
                <Grid3X3 className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-bold text-foreground">Related Deals</h2>
              </div>
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                {relatedSlugs.map((slug) => {
                  const relatedParsed = parseSeoSlug(slug)
                  return (
                    <Link
                      key={slug}
                      href={`/promo/${slug}`}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-center"
                    >
                      <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        {relatedParsed.maxPrice ? (
                          <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        ) : relatedParsed.type === 'best' ? (
                          <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Tag className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-foreground line-clamp-2">
                        {relatedParsed.h1.replace(' Deals', '')}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </PageContainer>
          </section>
        )}

        {/* More Price Ranges */}
        {parsed.category && (
          <section className="pb-10 md:pb-12">
            <PageContainer>
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-bold text-foreground">
                  {parsed.categoryDisplay} by Price
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {[200, 300, 500, 750, 1000, 1500, 2000].map((price) => (
                  <Link
                    key={price}
                    href={`/promo/${parsed.category}-under-${price}`}
                    className={`inline-flex items-center px-4 py-2 rounded-full border transition-colors ${
                      parsed.maxPrice === price 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'border-border hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    Under ${price}
                  </Link>
                ))}
              </div>
            </PageContainer>
          </section>
        )}

        {/* Shop by Store */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-bold text-foreground">Shop by Store</h2>
              </div>
              <Link href="/deals" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
              {['Amazon', 'Best Buy', 'Nike', 'Target', 'Walmart', 'Apple'].map((store) => (
                <Link
                  key={store}
                  href={`/stores/${store.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center justify-center gap-2 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground">{store}</span>
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        <PopularCategories />

        {/* CTA */}
        <section className="py-10 md:py-12 text-center border-t border-border">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Can&apos;t find what you&apos;re looking for?
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
