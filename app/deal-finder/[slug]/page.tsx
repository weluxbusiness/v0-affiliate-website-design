import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight, Tag, Percent, DollarSign, Clock, Store, TrendingUp, Flame, Sparkles } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DealCard } from "@/components/deal-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageContainer, SectionHeading } from "@/components/layout/page-container"
import { CapitalOnePromo } from "@/components/capital-one-promo"
import { SeoLinkGraph } from "@/components/seo/seo-link-graph"
import { 
  getDealFinderPage, 
  getAllDealFinderSlugs, 
  getDealsForFinderPage,
  generateDealFinderFAQs,
  generateItemListSchema,
  DEAL_FINDER_PAGES,
} from "@/lib/seo/deal-ranking"

export const revalidate = 3600 // ISR: revalidate hourly

type Params = Promise<{ slug: string }>

// Generate static params for all deal finder pages
export async function generateStaticParams() {
  const slugs = getAllDealFinderSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const page = getDealFinderPage(slug)

  if (!page) {
    return { title: "Deal Finder | SaveSmart" }
  }

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords.join(", "),
    openGraph: {
      title: page.h1,
      description: page.description,
      type: "website",
      url: `https://savesmart.bio/deal-finder/${slug}`,
    },
    alternates: {
      canonical: `/deal-finder/${slug}`,
    },
  }
}

// Icon mapping for visual variety
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'electronics': <Sparkles className="h-5 w-5" />,
  'gaming': <Flame className="h-5 w-5" />,
  'smartphone': <TrendingUp className="h-5 w-5" />,
  'laptop': <TrendingUp className="h-5 w-5" />,
  'tv': <TrendingUp className="h-5 w-5" />,
  'headphone': <TrendingUp className="h-5 w-5" />,
  'fashion': <Tag className="h-5 w-5" />,
  'home': <Store className="h-5 w-5" />,
}

function getPageIcon(filter: { category?: string; minDiscount?: number; maxPrice?: number; store?: string }) {
  if (filter.category && CATEGORY_ICONS[filter.category]) {
    return CATEGORY_ICONS[filter.category]
  }
  if (filter.minDiscount) {
    return <Percent className="h-5 w-5" />
  }
  if (filter.maxPrice) {
    return <DollarSign className="h-5 w-5" />
  }
  if (filter.store) {
    return <Store className="h-5 w-5" />
  }
  return <Tag className="h-5 w-5" />
}

export default async function DealFinderSlugPage({ params }: { params: Params }) {
  const { slug } = await params
  const page = getDealFinderPage(slug)

  if (!page) {
    notFound()
  }

  // Fetch deals based on page filter
  const deals = await getDealsForFinderPage(page.filter, 48)
  
  // Generate FAQ content
  const faqs = generateDealFinderFAQs(page, deals.length)
  
  // Generate structured data
  const itemListSchema = generateItemListSchema(deals, page.h1, `/deal-finder/${slug}`)
  
  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://savesmart.bio" },
      { "@type": "ListItem", position: 2, name: "Deal Finder", item: "https://savesmart.bio/deal-finder" },
      { "@type": "ListItem", position: 3, name: page.h1, item: `https://savesmart.bio/deal-finder/${slug}` },
    ],
  }

  // Get related deal finder pages
  const relatedPages = DEAL_FINDER_PAGES
    .filter(p => p.slug !== slug)
    .slice(0, 6)

  // Calculate stats
  const avgDiscount = deals.length > 0 
    ? Math.round(deals.reduce((sum, d) => sum + d.discount_percentage, 0) / deals.length)
    : 0
  const minPrice = deals.length > 0 ? Math.min(...deals.map(d => d.deal_price)) : 0
  const maxPrice = deals.length > 0 ? Math.max(...deals.map(d => d.deal_price)) : 0

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="py-8 md:py-12">
        <PageContainer>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/deal-finder" className="hover:text-foreground">Deal Finder</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{page.h1}</span>
          </nav>

          {/* Hero Section */}
          <div className="mb-8 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/20 text-primary">
                {getPageIcon(page.filter)}
              </div>
              <Badge variant="secondary">
                <Clock className="h-3 w-3 mr-1" />
                Updated hourly
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
              {page.h1}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl text-balance">
              {page.description}
            </p>
            
            {/* Stats */}
            {deals.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/80">
                  <span className="text-2xl font-bold text-foreground">{deals.length}</span>
                  <span className="text-sm text-muted-foreground">Active Deals</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/80">
                  <span className="text-2xl font-bold text-red-500">{avgDiscount}%</span>
                  <span className="text-sm text-muted-foreground">Avg. Discount</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/80">
                  <span className="text-2xl font-bold text-green-600">${minPrice.toFixed(0)}</span>
                  <span className="text-sm text-muted-foreground">Lowest Price</span>
                </div>
              </div>
            )}
          </div>

          {/* Capital One Promo */}
          <div className="mb-8">
            <CapitalOnePromo />
          </div>

          {/* Deals Grid */}
          {deals.length > 0 ? (
            <section className="mb-12">
              <SectionHeading description={`${deals.length} deals ranked by value`}>
                Top Deals
              </SectionHeading>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {deals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            </section>
          ) : (
            <section className="mb-12 text-center py-16">
              <div className="p-4 rounded-full bg-muted inline-block mb-4">
                <Tag className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">No Deals Found</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find deals matching these criteria right now. Check back soon or browse other categories.
              </p>
              <Button asChild>
                <Link href="/deal-finder">Browse All Deals</Link>
              </Button>
            </section>
          )}

          {/* FAQ Section */}
          <section className="mb-12">
            <SectionHeading description="Common questions answered">
              Frequently Asked Questions
            </SectionHeading>
            <div className="grid md:grid-cols-2 gap-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="border-border/50">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Related Deal Finder Pages */}
          <section className="mb-12">
            <SectionHeading description="Explore more ways to save">
              More Deal Categories
            </SectionHeading>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {relatedPages.map((relatedPage) => (
                <Link
                  key={relatedPage.slug}
                  href={`/deal-finder/${relatedPage.slug}`}
                  className="group flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                      {getPageIcon(relatedPage.filter)}
                    </div>
                    <span className="font-medium text-foreground truncate">{relatedPage.h1}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </section>

          {/* SEO Link Graph */}
          <SeoLinkGraph 
            pageType="trending"
            maxLinksPerCluster={6}
            maxTotalLinks={40}
          />
        </PageContainer>
      </main>

      <Footer />
    </div>
  )
}
