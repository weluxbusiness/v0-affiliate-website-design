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
import { PageContainer, DealGrid, SectionHeading } from "@/components/layout/page-container"
import { getTodaysDealsByEntity } from "@/lib/deals"
import { getStoreInfo } from "@/lib/deal-types"
import { 
  brands, 
  categories, 
  formatDisplayName,
  getRelatedBrands,
  getRelatedCategories,
  priceRanges
} from "@/data/deal-pages"
import { 
  Clock,
  Sparkles,
  ArrowRight,
  Calendar,
  Zap,
  TrendingUp,
  Tag,
  HelpCircle,
  ChevronRight
} from "lucide-react"

// Revalidate every 15 minutes for fresh deals
export const revalidate = 900

const baseUrl = "https://savesmart.bio"

interface PageProps {
  params: Promise<{ entity: string }>
}

// Price filter ranges
const priceFilters = [
  { value: 50, label: 'Under $50' },
  { value: 100, label: 'Under $100' },
  { value: 200, label: 'Under $200' },
  { value: 500, label: 'Under $500' },
]

// Determine if entity is a brand or category
function getEntityType(entity: string): 'brand' | 'category' | null {
  const normalizedEntity = entity.toLowerCase()
  if (brands.includes(normalizedEntity as typeof brands[number])) {
    return 'brand'
  }
  if (categories.includes(normalizedEntity as typeof categories[number])) {
    return 'category'
  }
  return null
}

// Generate dynamic intro content for entity
function generateEntityTodayIntro(entity: string, type: 'brand' | 'category', dealCount: number): string {
  const displayName = formatDisplayName(entity)
  const today = new Date()
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' })
  const monthDay = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  
  if (type === 'brand') {
    return `Looking for the best ${displayName} deals today? You've come to the right place. On ${dayName}, ${monthDay}, we've curated ${dealCount > 0 ? `${dealCount} active ${displayName} deals` : `the freshest ${displayName} discounts`} from across the web. Our deal hunters monitor Amazon, Best Buy, Target, Walmart, and the official ${displayName} store for the latest price drops and promotions.

Every ${displayName} deal on this page has been verified within the last 24 hours. We track flash sales, limited-time offers, and exclusive discounts to help you save on your favorite ${displayName} products. Whether you're shopping for gifts or treating yourself, today's ${displayName} deals offer exceptional value.`
  }
  
  return `Discover today's best ${displayName.toLowerCase()} deals, updated ${dayName}, ${monthDay}. Our team has compiled ${dealCount > 0 ? `${dealCount} verified ${displayName.toLowerCase()} discounts` : `the latest ${displayName.toLowerCase()} offers`} from top retailers including Amazon, Best Buy, Walmart, and specialty stores. From budget-friendly options to premium picks, find the perfect ${displayName.toLowerCase()} at a price you'll love.

All ${displayName.toLowerCase()} deals are verified hourly and include both instant discounts and coupon codes. We compare prices across 100+ retailers to surface the deepest savings on ${displayName.toLowerCase()} today. Browse our curated selection and find your perfect deal.`
}

// Generate FAQs for entity today's deals
function generateEntityTodayFAQs(entity: string, type: 'brand' | 'category') {
  const displayName = formatDisplayName(entity)
  const today = new Date()
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' })
  
  if (type === 'brand') {
    return [
      {
        question: `What are the best ${displayName} deals today?`,
        answer: `Today's best ${displayName} deals feature discounts of up to 70% off on popular products. We highlight the deepest discounts at the top of the page and update our listings every 15 minutes to ensure you see the freshest ${displayName} offers.`
      },
      {
        question: `Does ${displayName} have any sales today?`,
        answer: `Yes, we track all ${displayName} sales and promotions in real-time. This includes official ${displayName} store sales, retailer promotions from Amazon, Best Buy, and Target, as well as exclusive coupon codes and flash deals.`
      },
      {
        question: `How do I find ${displayName} coupon codes?`,
        answer: `Many ${displayName} deals on SaveSmart include coupon codes displayed on the deal card. We verify all codes before listing to ensure they're active and working. Some deals apply automatically at checkout without a code.`
      },
      {
        question: `Are ${displayName} deals on ${dayName} different from other days?`,
        answer: `${displayName} deals vary daily based on retailer promotions and inventory. ${dayName} may feature different offers than other days. We recommend checking back frequently or signing up for deal alerts to catch the best ${displayName} discounts.`
      },
      {
        question: `Can I get ${displayName} products with free shipping today?`,
        answer: `Many ${displayName} deals qualify for free shipping, especially from retailers like Amazon Prime, Best Buy, and the official ${displayName} store. Shipping eligibility is noted on individual deal listings.`
      }
    ]
  }
  
  return [
    {
      question: `What are the best ${displayName.toLowerCase()} deals today?`,
      answer: `Today's best ${displayName.toLowerCase()} deals span multiple brands and retailers, with discounts up to 70% off. We feature deals from trusted brands and highlight the biggest savings at the top of the page.`
    },
    {
      question: `Which stores have ${displayName.toLowerCase()} on sale today?`,
      answer: `We track ${displayName.toLowerCase()} sales from Amazon, Best Buy, Walmart, Target, and specialty retailers. Each deal shows the store name and current price so you can compare options across retailers.`
    },
    {
      question: `How do I choose the best ${displayName.toLowerCase()} deal?`,
      answer: `Consider factors like brand reputation, features, warranty, and total price including shipping. Our deal cards show discount percentages and original prices to help you evaluate the savings. Higher discount percentages often indicate exceptional value.`
    },
    {
      question: `Are today's ${displayName.toLowerCase()} deals available online or in-store?`,
      answer: `Most deals we feature are available online with options for home delivery or store pickup. Some retailers also match online prices in-store. Check individual deal listings for availability details.`
    },
    {
      question: `How often do ${displayName.toLowerCase()} deals change?`,
      answer: `${displayName} deals can change multiple times daily as retailers adjust prices and run flash sales. We update our listings every 15 minutes to reflect the latest offers. Popular deals may sell out quickly.`
    }
  ]
}

// Generate structured data
function generateStructuredData(
  entity: string,
  type: 'brand' | 'category',
  dealCount: number,
  faqs: { question: string; answer: string }[]
) {
  const displayName = formatDisplayName(entity)
  const today = new Date().toISOString().split('T')[0]
  
  const collectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${displayName} Deals Today`,
    description: `Today's best ${displayName} deals and discounts. Updated every 15 minutes.`,
    url: `${baseUrl}/deals/today/${entity}`,
    dateModified: today,
    numberOfItems: dealCount,
    provider: {
      "@type": "Organization",
      name: "SaveSmart",
      url: baseUrl
    }
  }
  
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  }
  
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Deals",
        item: `${baseUrl}/deals`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Today",
        item: `${baseUrl}/deals/today`
      },
      {
        "@type": "ListItem",
        position: 4,
        name: displayName,
        item: `${baseUrl}/deals/today/${entity}`
      }
    ]
  }
  
  return { collectionPage, faqSchema, breadcrumbSchema }
}

// Generate static params for popular entities
export async function generateStaticParams() {
  const popularCategories = [
    'laptops', 'headphones', 'tvs', 'sneakers', 'smartphones',
    'gaming-consoles', 'vacuums', 'air-fryers', 'watches', 'tablets'
  ]
  
  const popularBrands = [
    'amazon', 'nike', 'apple', 'samsung', 'sony',
    'best-buy', 'target', 'walmart', 'adidas', 'dyson'
  ]
  
  return [...popularCategories, ...popularBrands].map((entity) => ({
    entity,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { entity } = await params
  const entitySlug = entity.toLowerCase()
  const type = getEntityType(entitySlug)
  
  if (!type) {
    return {
      title: "Deals Today | SaveSmart",
      description: "Today's best deals and discounts."
    }
  }
  
  const displayName = formatDisplayName(entitySlug)
  const today = new Date()
  const monthYear = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  
  const title = `Best ${displayName} Deals Today (${monthYear}) | SaveSmart`
  const description = type === 'brand'
    ? `Today's best ${displayName} deals and discounts. Save up to 70% on ${displayName} products from Amazon, Best Buy, Target, and more. Updated every 15 minutes.`
    : `Today's best ${displayName.toLowerCase()} deals from top brands. Compare prices across 100+ retailers. Fresh discounts updated every 15 minutes.`
  
  return {
    title,
    description,
    openGraph: {
      title: `${displayName} Deals Today | SaveSmart`,
      description,
      type: "website",
      url: `${baseUrl}/deals/today/${entitySlug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${displayName} Deals Today | SaveSmart`,
      description,
    },
    alternates: {
      canonical: `${baseUrl}/deals/today/${entitySlug}`,
    },
    keywords: [
      `${displayName} deals today`,
      `${displayName} sales`,
      `${displayName} discounts`,
      `best ${displayName} deals`,
      `${displayName} coupon codes`,
      type === 'brand' ? `${displayName} promotions` : `cheap ${displayName.toLowerCase()}`,
    ],
  }
}

export default async function EntityDealsToday({ params }: PageProps) {
  const { entity } = await params
  const entitySlug = entity.toLowerCase()
  const type = getEntityType(entitySlug)
  
  // Validate entity
  if (!type) {
    notFound()
  }
  
  const displayName = formatDisplayName(entitySlug)
  const deals = await getTodaysDealsByEntity(entitySlug, type, 36)
  const intro = generateEntityTodayIntro(entitySlug, type, deals.length)
  const faqs = generateEntityTodayFAQs(entitySlug, type)
  const schemas = generateStructuredData(entitySlug, type, deals.length, faqs)
  
  const featuredDeals = deals.slice(0, 4)
  const regularDeals = deals.slice(4)
  
  // Get current time for freshness display
  const now = new Date()
  const lastUpdated = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  
  // Get related links
  const relatedEntities = type === 'brand' 
    ? getRelatedBrands(entitySlug, 6)
    : getRelatedCategories(entitySlug, 6)
  
  // Hero color based on type
  const heroGradient = type === 'brand' 
    ? 'from-blue-600 to-indigo-700' 
    : 'from-emerald-500 to-teal-600'
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Schema markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.collectionPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumbSchema) }}
      />
      
      <main className="pt-16">
        {/* Hero */}
        <section className={`relative bg-gradient-to-br ${heroGradient} text-white py-14 md:py-16 overflow-hidden`}>
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,white)]" />
          <PageContainer className="relative">
            {/* Breadcrumbs */}
            <nav className="mb-6 flex items-center gap-2 text-sm flex-wrap">
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
              <Link 
                href="/deals/today" 
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                Today
              </Link>
              <span className="text-white/50">/</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
                {displayName}
              </span>
            </nav>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <Zap className="h-6 w-6" />
              </div>
              <span className="text-white/70 uppercase tracking-wider text-sm font-medium">
                {type === 'brand' ? 'Brand' : 'Category'} Deals Today
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Best {displayName} Deals Today
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mb-4">
              {type === 'brand' 
                ? `Today's hottest ${displayName} discounts from authorized retailers.`
                : `Fresh ${displayName.toLowerCase()} deals from top brands and stores.`
              }
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="bg-white/20 text-white border-0 gap-1.5">
                <TrendingUp className="h-3.5 w-3.5" />
                {deals.length} Active Deals
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-0 gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Updated {lastUpdated}
              </Badge>
            </div>
          </PageContainer>
        </section>

        {/* Price Filters - Link to SEO pages */}
        <section className="py-6 border-b border-border">
          <PageContainer>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Tag className="h-4 w-4" />
                {displayName} by Price:
              </span>
              <div className="flex flex-wrap gap-2">
                {priceFilters.map((filter) => (
                  <Link
                    key={filter.value}
                    href={`/deals/seo/${entitySlug}-under-${filter.value}`}
                    className="px-4 py-2 rounded-full border border-border text-sm font-medium hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    {filter.label}
                  </Link>
                ))}
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
              <div className="flex items-center justify-between mb-6">
                <SectionHeading className="mb-0">Top {displayName} Deals Today</SectionHeading>
                <Badge variant="outline" className="gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Featured
                </Badge>
              </div>
              <DealGrid columns={4}>
                {featuredDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} variant="featured" showFreshness />
                ))}
              </DealGrid>
            </PageContainer>
          </section>
        )}

        {/* All Today's Deals */}
        <section className="bg-muted/30 py-10 md:py-12">
          <PageContainer>
            <SectionHeading>All {displayName} Deals Today</SectionHeading>
            {regularDeals.length > 0 ? (
              <DealGrid columns={4}>
                {regularDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} showFreshness />
                ))}
              </DealGrid>
            ) : featuredDeals.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No {displayName} deals found today</h3>
                  <p className="text-muted-foreground mb-4">Check back soon or browse all deals.</p>
                  <Button asChild>
                    <Link href="/deals/today">View All Today's Deals</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : null}
          </PageContainer>
        </section>

        {/* SEO Content Section */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                About {displayName} Deals Today
              </h2>
              <div className="prose prose-muted max-w-none space-y-4">
                {intro.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </PageContainer>
        </section>

        {/* Related Entity Links */}
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                More {type === 'brand' ? 'Brand' : 'Category'} Deals Today
              </h2>
            </div>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
              {relatedEntities.map((related) => (
                <Link
                  key={related}
                  href={`/deals/today/${related}`}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground">{formatDisplayName(related)}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Price Range Internal Links */}
        <section className="py-10 md:py-12">
          <PageContainer>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">{displayName} by Price Range</h2>
            </div>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
              {priceRanges.slice(0, 6).map((price) => (
                <Link
                  key={price}
                  href={`/deals/seo/${entitySlug}-under-${price}`}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground">Under ${price}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* FAQ Section */}
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-primary" />
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index} className="border-border/50">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-foreground mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </PageContainer>
        </section>

        {/* CTA */}
        <section className="py-10 md:py-12 text-center border-t border-border">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground mb-2">Looking for a specific {displayName} deal?</h2>
            <p className="text-muted-foreground mb-6">Our AI can help you find exactly what you need at the best price.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/deal-finder">
                  <Sparkles className="h-5 w-5" />
                  Ask AI Deal Finder
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/deals/today">
                  <ArrowRight className="h-5 w-5" />
                  All Today's Deals
                </Link>
              </Button>
            </div>
          </PageContainer>
        </section>
      </main>

      <Footer />
    </div>
  )
}
