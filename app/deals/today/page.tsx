import Link from "next/link"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DealCard } from "@/components/deal-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CapitalOnePromo } from "@/components/capital-one-promo"
import { PageContainer, DealGrid, SectionHeading } from "@/components/layout/page-container"
import { getTodaysDeals } from "@/lib/deals"
import { getStoreInfo } from "@/lib/deal-types"
import { brands, categories, formatDisplayName } from "@/data/deal-pages"
import { 
  Clock,
  Sparkles,
  ArrowRight,
  Calendar,
  Zap,
  TrendingUp,
  Tag,
  HelpCircle
} from "lucide-react"

// Revalidate every 15 minutes for fresh deals
export const revalidate = 900

const baseUrl = "https://savesmart.bio"

// Popular categories for "Today" pages
const popularTodayCategories = [
  'laptops', 'headphones', 'tvs', 'sneakers', 'smartphones',
  'gaming-consoles', 'vacuums', 'air-fryers', 'watches', 'tablets'
]

// Popular brands for "Today" pages
const popularTodayBrands = [
  'amazon', 'nike', 'apple', 'samsung', 'sony',
  'best-buy', 'target', 'walmart', 'adidas', 'dyson'
]

// Price filter ranges
const priceFilters = [
  { value: 50, label: 'Under $50' },
  { value: 100, label: 'Under $100' },
  { value: 200, label: 'Under $200' },
  { value: 500, label: 'Under $500' },
]

// Generate dynamic intro content
function generateTodayIntro(): string {
  const today = new Date()
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' })
  const monthDay = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  
  return `Welcome to SaveSmart's Daily Deals for ${dayName}, ${monthDay}! Our team has scoured the internet to bring you the freshest discounts and hottest offers available right now. From electronics and fashion to home essentials and gaming, today's collection features verified deals from Amazon, Best Buy, Target, Walmart, and 50+ other top retailers.

Every deal on this page has been added or verified within the last 24 hours, ensuring you're seeing the most current prices and promotions. Our AI-powered system continuously monitors price drops and flash sales, so you can shop with confidence knowing these offers are live and accurate.`
}

// Generate FAQs for today's deals
function generateTodayFAQs() {
  const today = new Date()
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' })
  
  return [
    {
      question: "How often are today's deals updated?",
      answer: "Our deals are updated every 15 minutes throughout the day. Our automated system continuously scans retailers for new discounts, price drops, and flash sales, ensuring you always see the freshest offers."
    },
    {
      question: "Are all deals on this page available right now?",
      answer: "Yes, every deal listed has been verified within the last 24 hours. We automatically remove expired deals and update prices in real-time. However, popular deals can sell out quickly, so we recommend acting fast on items you love."
    },
    {
      question: `What are the best ${dayName} deals?`,
      answer: `The best deals today include top discounts from Amazon, Best Buy, Target, and Walmart. We highlight the deepest discounts at the top of the page, featuring savings of 50% or more on popular products across electronics, fashion, home goods, and more.`
    },
    {
      question: "How can I get notified of new deals?",
      answer: "Sign up for our Deal Alerts to receive instant notifications when new deals match your interests. You can customize alerts by category, brand, or price range to only see deals you care about."
    },
    {
      question: "Do today's deals include coupon codes?",
      answer: "Many deals include automatic discounts at checkout, while others may require a coupon code which we display prominently on the deal card. We verify all codes before listing to ensure they're working."
    }
  ]
}

// Generate structured data
function generateStructuredData(dealCount: number, faqs: { question: string; answer: string }[]) {
  const today = new Date().toISOString().split('T')[0]
  
  const collectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Best Deals Today",
    description: "Today's best deals, discounts, and offers from top retailers. Updated every 15 minutes.",
    url: `${baseUrl}/deals/today`,
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
      }
    ]
  }
  
  return { collectionPage, faqSchema, breadcrumbSchema }
}

export const metadata: Metadata = {
  title: "Best Deals Today - Fresh Daily Discounts | SaveSmart",
  description: "Discover today's best deals and discounts. Fresh offers updated every 15 minutes from Amazon, Best Buy, Target, Walmart, and 50+ retailers. Save up to 70% on electronics, fashion, home goods, and more.",
  openGraph: {
    title: "Best Deals Today | SaveSmart",
    description: "Today's hottest deals and discounts. Updated every 15 minutes.",
    type: "website",
    url: `${baseUrl}/deals/today`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Deals Today | SaveSmart",
    description: "Today's hottest deals and discounts. Updated every 15 minutes.",
  },
  alternates: {
    canonical: `${baseUrl}/deals/today`,
  },
}

export default async function DealsToday() {
  const deals = await getTodaysDeals(36)
  const intro = generateTodayIntro()
  const faqs = generateTodayFAQs()
  const schemas = generateStructuredData(deals.length, faqs)
  
  const featuredDeals = deals.slice(0, 4)
  const regularDeals = deals.slice(4)
  
  // Get current time for freshness display
  const now = new Date()
  const lastUpdated = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  
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
        <section className="relative bg-gradient-to-br from-orange-500 to-red-600 text-white py-14 md:py-16 overflow-hidden">
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
              <Link 
                href="/deals" 
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                Deals
              </Link>
              <span className="text-white/50">/</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
                Today
              </span>
            </nav>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <Zap className="h-6 w-6" />
              </div>
              <span className="text-white/70 uppercase tracking-wider text-sm font-medium">Fresh Daily</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Best Deals Today
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mb-4">
              Today's hottest discounts from top retailers. Updated every 15 minutes.
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

        {/* Price Filters */}
        <section className="py-6 border-b border-border">
          <PageContainer>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Filter by Price:
              </span>
              <div className="flex flex-wrap gap-2">
                {priceFilters.map((filter) => (
                  <Link
                    key={filter.value}
                    href={`/deals/price/under-${filter.value}`}
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
                <SectionHeading className="mb-0">Top Deals Today</SectionHeading>
                <Badge variant="outline" className="gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Featured
                </Badge>
              </div>
              <DealGrid columns={4}>
                {featuredDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} variant="featured" />
                ))}
              </DealGrid>
            </PageContainer>
          </section>
        )}

        {/* All Today's Deals */}
        <section className="bg-muted/30 py-10 md:py-12">
          <PageContainer>
            <SectionHeading>All Deals Today</SectionHeading>
            {regularDeals.length > 0 ? (
              <DealGrid columns={4}>
                {regularDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </DealGrid>
            ) : featuredDeals.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No deals found today</h3>
                  <p className="text-muted-foreground mb-4">Check back soon for fresh deals!</p>
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
                About Today's Deals
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

        {/* Browse by Category Today */}
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Today's Deals by Category</h2>
            </div>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-5">
              {popularTodayCategories.map((category) => (
                <Link
                  key={category}
                  href={`/deals/today/${category}`}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground">{formatDisplayName(category)}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Browse by Brand Today */}
        <section className="py-10 md:py-12">
          <PageContainer>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Today's Deals by Brand</h2>
            </div>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-5">
              {popularTodayBrands.map((brand) => {
                const storeInfo = getStoreInfo(formatDisplayName(brand))
                return (
                  <Link
                    key={brand}
                    href={`/deals/today/${brand}`}
                    className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <div className={`${storeInfo.color} h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-xs`}>
                      {formatDisplayName(brand).charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-foreground">{formatDisplayName(brand)}</span>
                  </Link>
                )
              })}
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
            <h2 className="text-2xl font-bold text-foreground mb-2">Looking for something specific?</h2>
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
