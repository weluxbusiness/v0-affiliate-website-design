import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/layout/page-container"
import { SectionHeading } from "@/components/layout/page-container"
import { DealCard } from "@/components/deal-card"
import { SeoLinkGraph } from "@/components/seo/seo-link-graph"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  getDealFinderPage, 
  getAllDealFinderSlugs, 
  getDealsForFinderPage,
  generateItemListSchema,
  generateAggregateOfferSchema,
  generateDealFinderFAQs,
  calculateDealScore,
  DEAL_FINDER_PAGES
} from "@/lib/seo/deal-ranking"
import { generateFAQSchema, generateBreadcrumbSchema } from "@/lib/seo/structured-data"
import { 
  Tag, 
  Percent, 
  DollarSign, 
  TrendingDown, 
  ChevronRight,
  Award,
  Zap,
  Filter
} from "lucide-react"

interface PageProps {
  params: Promise<{ slug: string }>
}

// Generate static params for all deal finder pages
export async function generateStaticParams() {
  return getAllDealFinderSlugs().map(slug => ({ slug }))
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = getDealFinderPage(slug)
  
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
      url: `https://savesmart.bio/deals-finder/${slug}`,
    },
    alternates: {
      canonical: `/deals-finder/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

// Helper to get filter description
function getFilterDescription(page: ReturnType<typeof getDealFinderPage>) {
  if (!page) return ""
  
  const parts: string[] = []
  
  if (page.filter.maxPrice) {
    parts.push(`under $${page.filter.maxPrice}`)
  }
  if (page.filter.minDiscount) {
    parts.push(`${page.filter.minDiscount}%+ off`)
  }
  if (page.filter.category) {
    parts.push(page.filter.category)
  }
  if (page.filter.store) {
    parts.push(`at ${page.filter.store.replace(/-/g, " ")}`)
  }
  
  return parts.join(" • ")
}

// Get icon for deal type
function getDealTypeIcon(page: ReturnType<typeof getDealFinderPage>) {
  if (!page) return DollarSign
  
  if (page.filter.maxPrice) return DollarSign
  if (page.filter.minDiscount) return Percent
  if (page.filter.category) return Tag
  if (page.filter.store) return Award
  
  return Zap
}

export default async function DealFinderPage({ params }: PageProps) {
  const { slug } = await params
  const page = getDealFinderPage(slug)
  
  if (!page) {
    notFound()
  }
  
  // Fetch deals based on filter
  const deals = await getDealsForFinderPage(page.filter, 24)
  
  // Generate structured data
  const itemListSchema = generateItemListSchema(deals, page.h1, `/deals-finder/${slug}`)
  const aggregateOfferSchema = generateAggregateOfferSchema(deals, page.h1)
  const faqs = generateDealFinderFAQs(page, deals.length)
  const faqSchema = generateFAQSchema(faqs)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Deal Finder", url: "/deals-finder" },
    { name: page.h1, url: `/deals-finder/${slug}` },
  ])
  
  const Icon = getDealTypeIcon(page)
  const filterDesc = getFilterDescription(page)
  
  // Get related deal finder pages for internal linking
  const relatedPages = DEAL_FINDER_PAGES
    .filter(p => p.slug !== slug)
    .slice(0, 8)
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      {aggregateOfferSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateOfferSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <main className="flex-1 pt-16">
        {/* Breadcrumbs */}
        <section className="border-b border-border bg-muted/30 py-3">
          <PageContainer>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/deals-finder" className="hover:text-foreground transition-colors">Deal Finder</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">{page.h1}</span>
            </nav>
          </PageContainer>
        </section>
        
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 to-background py-12">
          <PageContainer className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              {page.h1}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              {page.description}
            </p>
            
            {/* Filter badges */}
            {filterDesc && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Filter className="h-3 w-3" />
                  {filterDesc}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <TrendingDown className="h-3 w-3" />
                  {deals.length} deals found
                </Badge>
              </div>
            )}
          </PageContainer>
        </section>
        
        {/* Deals Grid */}
        <section className="py-10 md:py-12">
          <PageContainer>
            <SectionHeading description={`Ranked by our deal score algorithm - discount, value, and store reputation`}>
              Top Ranked Deals
            </SectionHeading>
            
            {deals.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {deals.map((deal, index) => (
                  <div key={deal.id} className="relative">
                    {/* Rank badge for top 3 */}
                    {index < 3 && (
                      <div className="absolute -top-2 -left-2 z-10">
                        <Badge className={`${
                          index === 0 ? "bg-amber-500" :
                          index === 1 ? "bg-slate-400" :
                          "bg-amber-700"
                        } text-white font-bold`}>
                          #{index + 1}
                        </Badge>
                      </div>
                    )}
                    <DealCard deal={deal} />
                    {/* Deal score indicator */}
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Deal Score: {calculateDealScore(deal)}/100</span>
                      <span>{deal.discount_percentage}% off</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No deals match your criteria right now. Check back soon!</p>
                <Button asChild className="mt-4">
                  <Link href="/deals-finder/todays-best-deals">View All Deals</Link>
                </Button>
              </div>
            )}
          </PageContainer>
        </section>
        
        {/* Related Deal Finder Pages */}
        <section className="py-10 md:py-12 border-t border-border bg-muted/30">
          <PageContainer>
            <SectionHeading description="Explore more ways to find great deals">
              More Deal Finders
            </SectionHeading>
            
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
              {relatedPages.map((relatedPage) => (
                <Link
                  key={relatedPage.slug}
                  href={`/deals-finder/${relatedPage.slug}`}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground truncate">
                    {relatedPage.h1}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>
        
        {/* FAQ Section */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <SectionHeading description="Common questions about finding the best deals">
              Frequently Asked Questions
            </SectionHeading>
            
            <div className="space-y-4 max-w-3xl">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group rounded-lg border border-border bg-background p-4"
                >
                  <summary className="flex cursor-pointer items-center justify-between font-medium text-foreground">
                    {faq.question}
                    <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </PageContainer>
        </section>
        
        {/* SEO Link Graph */}
        <SeoLinkGraph
          pageType="price"
          className="border-t border-border"
        />
      </main>
      
      <Footer />
    </div>
  )
}
