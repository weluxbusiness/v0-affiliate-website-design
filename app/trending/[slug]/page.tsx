import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/layout/page-container"
import { CapitalOnePromo } from "@/components/capital-one-promo"
import { SeoLinkGraph } from "@/components/seo/seo-link-graph"
import { 
  TrendingUp, Tag, ArrowRight, Flame, Calendar, Percent, 
  Star, Zap, Sparkles, Clock
} from "lucide-react"
import { getProductImageUrl, storeToSlug } from "@/lib/deal-types"
import {
  getTrendingPageBySlug,
  getAllTrendingPageSlugs,
  getTrendingDealsFiltered,
  getTrendingPageStats,
  TRENDING_PAGES,
} from "@/lib/seo/trending-algorithm"

export const revalidate = 300 // 5 minutes for fresh trending data

// Map icon names to components
const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp,
  Calendar,
  Percent,
  Flame,
  Star,
  Zap,
  Tag,
  Sparkles,
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllTrendingPageSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = getTrendingPageBySlug(slug)
  
  if (!page) {
    return { title: "Page Not Found | SaveSmart" }
  }
  
  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    openGraph: {
      title: page.h1,
      description: page.description,
      type: "website",
      url: `https://savesmart.bio/trending/${page.slug}`,
    },
    alternates: {
      canonical: `/trending/${page.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function TrendingSlugPage({ params }: PageProps) {
  const { slug } = await params
  const page = getTrendingPageBySlug(slug)
  
  if (!page) {
    notFound()
  }
  
  const [deals, stats] = await Promise.all([
    getTrendingDealsFiltered(page.filter, 50),
    getTrendingPageStats(page.filter),
  ])
  
  const IconComponent = ICONS[page.icon] || TrendingUp
  
  // Structured data - ItemList with Product items
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: page.h1,
    description: page.description,
    url: `https://savesmart.bio/trending/${page.slug}`,
    numberOfItems: deals.length,
    itemListElement: deals.slice(0, 20).map((deal, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: deal.title,
        description: `${deal.discount_percentage}% off at ${deal.store}`,
        image: getProductImageUrl(deal),
        offers: {
          "@type": "Offer",
          price: deal.deal_price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: deal.store,
          },
        },
      },
    })),
  }
  
  // FAQ structured data
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `How often are ${page.h1.toLowerCase()} updated?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our trending deals are updated every 5 minutes using real-time data from major retailers including Amazon, Best Buy, Walmart, and more.",
        },
      },
      {
        "@type": "Question",
        name: `How do you rank ${page.h1.toLowerCase()}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "We use a proprietary algorithm that considers discount percentage, deal freshness, store reputation, and price value to surface the best deals.",
        },
      },
      {
        "@type": "Question",
        name: "Are these deals verified?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, all deals link directly to authorized retailers. We verify prices are accurate at the time of posting and update listings as prices change.",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
      
      <main className="pt-16">
        {/* Hero */}
        <section className={`relative bg-gradient-to-br ${page.heroGradient} text-white py-14 md:py-16 overflow-hidden`}>
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
              <Link 
                href="/trending-deals" 
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                Trending
              </Link>
              <span className="text-white/50">/</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
                {page.h1}
              </span>
            </nav>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <IconComponent className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium uppercase tracking-wider text-white/80">
                Updated every 5 minutes
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {page.h1}
            </h1>
            <p className="text-lg text-white/80 max-w-2xl">
              {page.description}
            </p>
            
            <div className="mt-6 flex flex-wrap gap-3">
              <Badge className="bg-white/20 text-white border-0">
                {stats.totalDeals} Deals
              </Badge>
              <Badge className="bg-white/20 text-white border-0">
                Avg. {stats.avgDiscount}% Off
              </Badge>
              <Badge className="bg-white/20 text-white border-0">
                Top Store: {stats.topStore}
              </Badge>
            </div>
          </PageContainer>
        </section>
        
        {/* Related Trending Pages */}
        <section className="py-6 border-b border-border">
          <PageContainer>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">More trending:</span>
              {TRENDING_PAGES.filter(p => p.slug !== slug).slice(0, 5).map((p) => {
                const Icon = ICONS[p.icon] || TrendingUp
                return (
                  <Link
                    key={p.slug}
                    href={`/trending/${p.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border hover:border-primary hover:bg-primary/5 text-sm font-medium transition-colors"
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {p.h1}
                  </Link>
                )
              })}
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{page.h1}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Updated just now</span>
              </div>
            </div>
            
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
                      {/* Trending score indicator */}
                      <div className="absolute bottom-2 left-2">
                        <Badge variant="secondary" className="bg-background/90 text-xs gap-1">
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          {deal.trendingScore}
                        </Badge>
                      </div>
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
                <h2 className="text-xl font-semibold mb-2">No deals found</h2>
                <p className="text-muted-foreground mb-6">Check back soon for fresh deals!</p>
                <Button asChild>
                  <Link href="/trending-deals">
                    View All Trending
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </PageContainer>
        </section>
        
        {/* SEO Link Graph */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <SeoLinkGraph pageType="category" pageSlug={slug} />
          </PageContainer>
        </section>
        
        {/* FAQ Section */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4 max-w-3xl">
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-semibold mb-2">How often are {page.h1.toLowerCase()} updated?</h3>
                <p className="text-muted-foreground">
                  Our trending deals are updated every 5 minutes using real-time data from major retailers including Amazon, Best Buy, Walmart, and more.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-semibold mb-2">How do you rank {page.h1.toLowerCase()}?</h3>
                <p className="text-muted-foreground">
                  We use a proprietary algorithm that considers discount percentage, deal freshness, store reputation, and price value to surface the best deals.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <h3 className="font-semibold mb-2">Are these deals verified?</h3>
                <p className="text-muted-foreground">
                  Yes, all deals link directly to authorized retailers. We verify prices are accurate at the time of posting and update listings as prices change.
                </p>
              </div>
            </div>
          </PageContainer>
        </section>
        
        {/* CTA */}
        <section className="py-10 md:py-12 text-center border-t border-border">
          <PageContainer>
            <h2 className="text-2xl font-bold mb-4">Want Personalized Deal Alerts?</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Tell us what you're looking for and we'll notify you when matching deals go live.
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
