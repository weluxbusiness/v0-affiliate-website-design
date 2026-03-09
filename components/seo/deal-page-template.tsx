import Link from "next/link"
import { ArrowRight, Tag, DollarSign, CheckCircle, HelpCircle, Store, ChevronRight } from "lucide-react"
import { PageContainer } from "@/components/layout/page-container"
import { DealCard } from "@/components/deal-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Deal } from "@/lib/deal-types"
import type { ParsedDealSlug } from "@/data/deal-pages"

// ============================================
// TYPES
// ============================================

interface FAQItem {
  question: string
  answer: string
}

interface InternalLink {
  href: string
  label: string
}

interface DealPageTemplateProps {
  parsed: ParsedDealSlug
  deals: Deal[]
  relatedPriceLinks: InternalLink[]
  relatedEntityLinks: InternalLink[]
  crossLinks: InternalLink[]
  storeLinks: InternalLink[]
}

// ============================================
// FAQ GENERATION
// ============================================

export function generateFAQs(parsed: ParsedDealSlug, dealCount: number): FAQItem[] {
  const { type, displayName, price } = parsed
  const currentYear = new Date().getFullYear()
  
  if (type === 'brand') {
    return [
      {
        question: `What are the best ${displayName} deals under $${price}?`,
        answer: `We currently track ${dealCount}+ ${displayName} deals under $${price} from authorized retailers. Our deals are sorted by discount percentage, showing you the biggest savings first. Popular items include accessories, essentials, and seasonal products at budget-friendly prices.`
      },
      {
        question: `How often are ${displayName} deals updated?`,
        answer: `Our ${displayName} deals are refreshed every hour to ensure accuracy. Each listing shows when it was last verified. New deals are added throughout the day, especially during sales events and promotions.`
      },
      {
        question: `Where can I find ${displayName} products under $${price}?`,
        answer: `${displayName} products under $${price} are available from major retailers like Amazon, Walmart, Target, and the official ${displayName} store. SaveSmart compares prices across all retailers to help you find the lowest price.`
      },
      {
        question: `When is the best time to buy ${displayName} products?`,
        answer: `The best times to buy ${displayName} products are during Black Friday, Cyber Monday, Prime Day, and when new product releases happen. However, we find deals year-round - prices under $${price} are available daily.`
      },
      {
        question: `Are these ${displayName} deals verified?`,
        answer: `Yes, all deals on SaveSmart are verified against retailer websites. We show original prices, sale prices, and discount percentages for transparency. Click any deal to verify the current price on the retailer's site.`
      }
    ]
  }
  
  // Category FAQs
  return [
    {
      question: `What are the best ${displayName.toLowerCase()} deals under $${price} in ${currentYear}?`,
      answer: `We track ${dealCount}+ ${displayName.toLowerCase()} deals under $${price} from top retailers including Amazon, Best Buy, Walmart, and Target. Our AI-powered system sorts deals by discount percentage to show you the biggest savings first.`
    },
    {
      question: `How do I find quality ${displayName.toLowerCase()} for under $${price}?`,
      answer: `SaveSmart compares prices across hundreds of retailers to find quality ${displayName.toLowerCase()} under $${price}. Look for deals with higher discount percentages (20%+ off) and check product ratings. Many budget-friendly options come from trusted brands.`
    },
    {
      question: `Which stores have the best ${displayName.toLowerCase()} deals?`,
      answer: `For ${displayName.toLowerCase()} under $${price}, Amazon, Best Buy, Target, and Walmart often have competitive prices. We also track specialty retailers and direct brand stores. Our comparison shows you which retailer offers the lowest price.`
    },
    {
      question: `Are ${displayName.toLowerCase()} under $${price} worth buying?`,
      answer: `Yes! Many quality ${displayName.toLowerCase()} are available under $${price}, especially during sales. Budget options often provide great value for everyday use. Check product reviews and compare features to find the best fit for your needs.`
    },
    {
      question: `How often do ${displayName.toLowerCase()} go on sale?`,
      answer: `${displayName} deals are available year-round, with the biggest discounts during Black Friday, Prime Day, and seasonal sales. Our system updates hourly to catch flash sales and limited-time offers. Sign up for alerts to never miss a deal.`
    }
  ]
}

// ============================================
// SCHEMA GENERATION
// ============================================

export function generateSchemaMarkup(
  parsed: ParsedDealSlug,
  deals: Deal[],
  faqs: FAQItem[]
) {
  const { type, entity, displayName, price } = parsed
  const baseUrl = "https://savesmart.bio"
  const pageUrl = `${baseUrl}/deals/${entity}-under-${price}`
  
  // Collection page schema
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${displayName} Deals Under $${price}`,
    description: `Find the best ${displayName.toLowerCase()} deals under $${price}. Compare prices and save money.`,
    url: pageUrl,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: deals.length,
      itemListElement: deals.slice(0, 10).map((deal, index) => ({
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
            url: deal.affiliate_link || pageUrl
          }
        }
      }))
    }
  }
  
  // FAQ schema
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
  
  // Breadcrumb schema
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
        name: type === 'brand' ? displayName : displayName,
        item: `${baseUrl}/deals/${entity}`
      },
      {
        "@type": "ListItem",
        position: 4,
        name: `Under $${price}`,
        item: pageUrl
      }
    ]
  }
  
  return { collectionSchema, faqSchema, breadcrumbSchema }
}

// ============================================
// MAIN TEMPLATE COMPONENT
// ============================================

export function DealPageTemplate({
  parsed,
  deals,
  relatedPriceLinks,
  relatedEntityLinks,
  crossLinks,
  storeLinks
}: DealPageTemplateProps) {
  const { type, displayName, price, entity } = parsed
  const faqs = generateFAQs(parsed, deals.length)
  const schemas = generateSchemaMarkup(parsed, deals, faqs)
  
  const heroGradient = type === 'brand' 
    ? 'from-blue-600 to-blue-800' 
    : 'from-emerald-600 to-emerald-800'
  
  return (
    <main className="min-h-screen bg-background">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumbSchema) }}
      />
      
      {/* Hero Section */}
      <section className={`relative bg-gradient-to-br ${heroGradient} text-white py-14 md:py-16 overflow-hidden`}>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <PageContainer>
          {/* Breadcrumbs */}
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm">
            <Link 
              href="/" 
              className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-white/50" />
            <Link 
              href="/deals" 
              className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
            >
              Deals
            </Link>
            <ChevronRight className="h-4 w-4 text-white/50" />
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
              {displayName} Under ${price}
            </span>
          </nav>
          
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <DollarSign className="h-5 w-5 text-white/80" />
              <span className="text-sm font-semibold text-white uppercase tracking-wide">
                {type === 'brand' ? 'Brand Deals' : 'Budget Finds'}
              </span>
            </div>
          </div>
          
          {/* H1 Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
            Best {displayName} Deals Under ${price}
          </h1>
          
          {/* Intro Paragraph */}
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-6">
            {type === 'brand' 
              ? `Save big on ${displayName} products under $${price}. Compare prices from Amazon, Walmart, Target, and more retailers.`
              : `Find the best ${displayName.toLowerCase()} deals under $${price}. We compare prices across hundreds of stores to help you save.`
            }
          </p>
          
          {/* Deal Count Badge */}
          <Badge variant="secondary" className="bg-white/20 text-white border-0">
            {deals.length} Active Deals
          </Badge>
        </PageContainer>
      </section>
      
      {/* Price Filter Bar */}
      <section className="py-6 border-b border-border">
        <PageContainer>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Price:</span>
            {relatedPriceLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  link.label.includes(`$${price}`) 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </PageContainer>
      </section>
      
      {/* Deals Grid */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Top {displayName} Deals Under ${price}
          </h2>
          
          {deals.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Tag className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No deals found
                </h3>
                <p className="text-muted-foreground mb-4">
                  We couldn&apos;t find any {displayName.toLowerCase()} deals under ${price} right now.
                </p>
                <Button asChild>
                  <Link href="/deals">
                    Browse All Deals
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </PageContainer>
      </section>
      
      {/* SEO Content Section */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              About {displayName} Deals Under ${price}
            </h2>
            <div className="prose prose-muted max-w-none">
              {type === 'brand' ? (
                <p className="text-muted-foreground leading-relaxed">
                  Looking for {displayName} products that won&apos;t break the bank? Our curated collection of {displayName} deals under ${price} 
                  helps budget-conscious shoppers find quality products at affordable prices. We track prices across Amazon, Walmart, Target, 
                  Best Buy, and dozens of other authorized retailers to ensure you&apos;re getting the best possible deal. Whether you&apos;re shopping 
                  for gifts, everyday essentials, or treating yourself, there&apos;s something for everyone in our under ${price} collection. 
                  All deals are verified hourly and include authentic {displayName} products from authorized sellers.
                </p>
              ) : (
                <p className="text-muted-foreground leading-relaxed">
                  {displayName} deals under ${price} offer exceptional value for budget-conscious shoppers. SaveSmart compares prices 
                  across hundreds of retailers including Amazon, Best Buy, Walmart, and Target to find the best discounts. Our AI-powered 
                  system tracks price fluctuations and alerts you when items reach their lowest price point. Whether you&apos;re a student, 
                  first-time buyer, or simply looking for great value, our under ${price} {displayName.toLowerCase()} collection offers 
                  excellent options from trusted brands. All deals are verified and updated hourly for accuracy.
                </p>
              )}
            </div>
          </div>
        </PageContainer>
      </section>
      
      {/* FAQ Section */}
      <section className="py-10 md:py-12">
        <PageContainer>
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                Frequently Asked Questions
              </h2>
            </div>
            
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
      
      {/* Internal Links Section */}
      <section className="py-10 md:py-12 border-t border-border">
        <PageContainer>
          <h3 className="text-xl font-bold text-foreground mb-6">More Deals to Explore</h3>
          
          {/* Other Price Ranges */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              Other {displayName} Price Ranges
            </h4>
            <div className="flex flex-wrap gap-3">
              {relatedPriceLinks.filter(l => !l.label.includes(`$${price}`)).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
                >
                  {link.label}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
          
          {/* Related Entities (same type) */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              {type === 'brand' ? 'Other Brands' : 'Other Categories'} Under ${price}
            </h4>
            <div className="flex flex-wrap gap-3">
              {relatedEntityLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
                >
                  {link.label}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
          
          {/* Cross-links (categories for brands, brands for categories) */}
          {crossLinks.length > 0 && (
            <div className="mb-8">
              <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                {type === 'brand' ? `Related Categories` : `Related Brands`} Under ${price}
              </h4>
              <div className="flex flex-wrap gap-3">
                {crossLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-sm font-medium text-foreground transition-colors"
                  >
                    {link.label}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Shop by Store */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              Shop by Store
            </h4>
            <div className="flex flex-wrap gap-3">
              {storeLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
                >
                  <Store className="h-3.5 w-3.5" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </PageContainer>
      </section>
      
      {/* Trust Signals */}
      <section className="py-10 md:py-12 bg-muted/30">
        <PageContainer>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Verified Deals</h4>
                <p className="text-sm text-muted-foreground">All prices verified hourly against retailer websites</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Price Comparison</h4>
                <p className="text-sm text-muted-foreground">Compare prices across 100+ trusted retailers</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Tag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Daily Updates</h4>
                <p className="text-sm text-muted-foreground">New deals added throughout the day</p>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>
    </main>
  )
}
