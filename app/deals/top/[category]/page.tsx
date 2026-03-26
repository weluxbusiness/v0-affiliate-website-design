import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Award, ArrowRight, Clock, TrendingUp, Star, CheckCircle, Sparkles } from "lucide-react"

import { searchDeals, getDealsByCategory } from "@/lib/deals"
import { getProductImageUrl } from "@/lib/deal-types"
import { PageContainer, DealGrid } from "@/components/layout/page-container"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DealCard } from "@/components/deal-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Top categories configuration
const TOP_CATEGORIES: Record<string, { name: string; searchTerms: string[]; description: string }> = {
  'headphones': { 
    name: 'Headphones', 
    searchTerms: ['headphones', 'earbuds', 'airpods'],
    description: 'Premium headphones from Sony, Bose, Apple, and more with the biggest discounts.'
  },
  'laptops': { 
    name: 'Laptops', 
    searchTerms: ['laptop', 'macbook', 'notebook'],
    description: 'Top-rated laptops from Apple, Dell, HP, and Lenovo at discounted prices.'
  },
  'tvs': { 
    name: 'TVs', 
    searchTerms: ['tv', 'television', 'oled', 'qled'],
    description: 'Best TV deals on OLED, QLED, and smart TVs from Samsung, LG, and Sony.'
  },
  'smartphones': { 
    name: 'Smartphones', 
    searchTerms: ['phone', 'iphone', 'samsung', 'smartphone'],
    description: 'Top smartphone deals on iPhone, Samsung Galaxy, and Pixel devices.'
  },
  'sneakers': { 
    name: 'Sneakers', 
    searchTerms: ['sneakers', 'shoes', 'nike', 'adidas'],
    description: 'Best sneaker deals from Nike, Adidas, New Balance, and Jordan.'
  },
  'gaming': { 
    name: 'Gaming', 
    searchTerms: ['gaming', 'playstation', 'xbox', 'nintendo'],
    description: 'Top gaming deals on consoles, games, and accessories.'
  },
  'tablets': { 
    name: 'Tablets', 
    searchTerms: ['tablet', 'ipad', 'galaxy tab'],
    description: 'Best tablet deals including iPad, Samsung Galaxy Tab, and Fire tablets.'
  },
  'watches': { 
    name: 'Smartwatches', 
    searchTerms: ['smartwatch', 'apple watch', 'galaxy watch'],
    description: 'Top smartwatch deals from Apple, Samsung, and Garmin.'
  },
  'cameras': { 
    name: 'Cameras', 
    searchTerms: ['camera', 'dslr', 'mirrorless'],
    description: 'Best camera deals on DSLRs, mirrorless cameras, and action cams.'
  },
  'monitors': { 
    name: 'Monitors', 
    searchTerms: ['monitor', 'gaming monitor', '4k'],
    description: 'Top monitor deals on gaming monitors, 4K displays, and ultrawide screens.'
  },
  'vacuums': { 
    name: 'Vacuums', 
    searchTerms: ['vacuum', 'dyson', 'roomba'],
    description: 'Best vacuum deals including Dyson, Roomba, and Shark.'
  },
  'air-fryers': { 
    name: 'Air Fryers', 
    searchTerms: ['air fryer', 'ninja', 'instant'],
    description: 'Top air fryer deals from Ninja, Instant Pot, and Philips.'
  },
}

export async function generateStaticParams() {
  return Object.keys(TOP_CATEGORIES).map(category => ({ category }))
}

interface PageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params
  const config = TOP_CATEGORIES[category]
  
  if (!config) {
    return { title: "Top Deals | SaveSmart" }
  }
  
  const year = new Date().getFullYear()
  
  return {
    title: `Top ${config.name} Deals ${year} - Best Discounts Today | SaveSmart`,
    description: `Discover the top ${config.name.toLowerCase()} deals with the biggest discounts. ${config.description} Updated hourly.`,
    keywords: [
      `top ${config.name.toLowerCase()} deals`,
      `best ${config.name.toLowerCase()} deals`,
      `${config.name.toLowerCase()} discounts ${year}`,
      `${config.name.toLowerCase()} sale`,
      `biggest ${config.name.toLowerCase()} deals`,
    ],
    openGraph: {
      title: `Top ${config.name} Deals ${year}`,
      description: config.description,
      url: `https://savesmart.bio/deals/top/${category}`,
    },
    alternates: {
      canonical: `/deals/top/${category}`,
    },
  }
}

export const revalidate = 1800 // 30 minutes for top deals

export default async function TopDealsPage({ params }: PageProps) {
  const { category } = await params
  const config = TOP_CATEGORIES[category]
  
  if (!config) {
    notFound()
  }
  
  // Search for deals with all terms
  const searchResults = await Promise.all(
    config.searchTerms.map(term => searchDeals(term, 20))
  )
  
  // Combine, dedupe, and sort by discount (highest first)
  let allDeals = [...new Map(searchResults.flat().map(d => [d.id, d])).values()]
    .filter(d => d.discount_percentage >= 15) // Only show real discounts
    .sort((a, b) => b.discount_percentage - a.discount_percentage)
    .slice(0, 30)
  
  // Fallback if needed
  if (allDeals.length < 10) {
    const categoryDeals = await getDealsByCategory(config.name, 30)
    allDeals = [...new Map([...allDeals, ...categoryDeals].map(d => [d.id, d])).values()]
      .sort((a, b) => b.discount_percentage - a.discount_percentage)
      .slice(0, 30)
  }
  
  const year = new Date().getFullYear()
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
  
  const maxDiscount = Math.max(...allDeals.map(d => d.discount_percentage), 0)
  
  // Related categories
  const relatedCategories = Object.entries(TOP_CATEGORIES)
    .filter(([slug]) => slug !== category)
    .slice(0, 6)
  
  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Top ${config.name} Deals`,
    description: config.description,
    url: `https://savesmart.bio/deals/top/${category}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: allDeals.length,
      itemListElement: allDeals.slice(0, 10).map((deal, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: deal.title,
          offers: {
            "@type": "Offer",
            price: deal.deal_price,
            priceCurrency: "USD",
          }
        }
      }))
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
        <section className="relative bg-gradient-to-br from-amber-500 to-orange-600 text-white py-14 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <PageContainer className="relative">
            {/* Breadcrumbs */}
            <nav className="mb-6 flex items-center gap-2 text-sm">
              <Link href="/" className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors">
                Home
              </Link>
              <span className="text-white/50">/</span>
              <Link href="/deals" className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors">
                Deals
              </Link>
              <span className="text-white/50">/</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
                Top {config.name}
              </span>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Award className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium uppercase tracking-wider text-white/90">Top Deals</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
              Top {config.name} Deals {year}
            </h1>
            
            <p className="text-lg text-white/90 max-w-2xl mb-6">
              {config.description}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Badge className="bg-white/20 text-white border-0 text-sm">
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                Up to {maxDiscount}% Off
              </Badge>
              <Badge className="bg-white/20 text-white border-0 text-sm">
                <Star className="h-3.5 w-3.5 mr-1 fill-current" />
                {allDeals.length} Top Deals
              </Badge>
              <span className="flex items-center gap-1.5 text-sm text-white/70">
                <Clock className="h-4 w-4" />
                Updated: {lastUpdated}
              </span>
            </div>
          </PageContainer>
        </section>
        
        {/* Featured Deals */}
        {allDeals.length > 0 && (
          <section className="py-10 md:py-12">
            <PageContainer>
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="h-6 w-6 text-amber-500" />
                <h2 className="text-2xl font-bold text-foreground">
                  #1 Best {config.name} Deals
                </h2>
              </div>
              
              {/* Top 3 featured */}
              <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mb-8">
                {allDeals.slice(0, 3).map((deal, index) => (
                  <Link key={deal.id} href={`/deal/${deal.slug || deal.id}`} className="group">
                    <Card className="overflow-hidden border-2 border-amber-500/30 hover:border-amber-500 transition-all h-full">
                      <div className="relative aspect-[4/3] bg-muted">
                        <Image
                          src={getProductImageUrl(deal)}
                          alt={deal.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-amber-500 text-white">
                            <Award className="h-3 w-3 mr-1" />
                            #{index + 1} Top Deal
                          </Badge>
                        </div>
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-secondary text-secondary-foreground">
                            {deal.discount_percentage}% OFF
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {deal.store}
                        </p>
                        <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                          {deal.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-foreground">${deal.deal_price.toFixed(2)}</span>
                          <span className="text-sm text-muted-foreground line-through">${deal.original_price.toFixed(2)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              
              {/* Rest of deals */}
              {allDeals.length > 3 && (
                <>
                  <h3 className="text-xl font-semibold text-foreground mb-4">More Top Deals</h3>
                  <DealGrid columns={4}>
                    {allDeals.slice(3).map((deal) => (
                      <DealCard key={deal.id} deal={deal} />
                    ))}
                  </DealGrid>
                </>
              )}
            </PageContainer>
          </section>
        )}
        
        {allDeals.length === 0 && (
          <section className="py-16">
            <PageContainer>
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <Award className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No top deals found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Check back soon - we update deals hourly!
                  </p>
                  <Button asChild>
                    <Link href="/deals">Browse All Deals</Link>
                  </Button>
                </CardContent>
              </Card>
            </PageContainer>
          </section>
        )}
        
        {/* SEO Content */}
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                How We Find the Top {config.name} Deals
              </h2>
              <div className="prose prose-muted max-w-none space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Our team uses advanced price tracking technology to monitor {config.name.toLowerCase()} prices 
                  across hundreds of retailers in real-time. We compare current prices against historical data 
                  to identify genuine discounts - not inflated &quot;sales&quot; that aren&apos;t really savings.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The deals featured on this page represent the biggest verified discounts we&apos;ve found on 
                  {config.name.toLowerCase()}. We prioritize deals with discount percentages of 15% or higher, 
                  from trusted retailers with good return policies.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We update this page multiple times daily to ensure you always see the latest and greatest deals. 
                  Pro tip: The best {config.name.toLowerCase()} deals often appear during Black Friday, Prime Day, 
                  and after new product releases when older models are discounted.
                </p>
              </div>
            </div>
          </PageContainer>
        </section>
        
        {/* Related Categories */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <h3 className="text-xl font-bold text-foreground mb-6">More Top Deals by Category</h3>
            <div className="flex flex-wrap gap-3">
              {relatedCategories.map(([slug, cat]) => (
                <Link
                  key={slug}
                  href={`/deals/top/${slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
                >
                  Top {cat.name} Deals
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
            
            <div className="mt-8">
              <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                Other {config.name} Pages
              </h4>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/best/${category}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
                >
                  Best {config.name}
                </Link>
                <Link
                  href={`/deals/cheap/${category}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
                >
                  Cheap {config.name}
                </Link>
                <Link
                  href={`/deals/price/${category}-under-500`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
                >
                  {config.name} Under $500
                </Link>
              </div>
            </div>
          </PageContainer>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
