import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/layout/page-container"
import { SectionHeading } from "@/components/layout/page-container"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DEAL_FINDER_PAGES } from "@/lib/seo/deal-ranking"
import { generateBreadcrumbSchema } from "@/lib/seo/structured-data"
import { 
  DollarSign, 
  Percent, 
  Tag, 
  Store, 
  Zap, 
  ChevronRight,
  Search,
  TrendingDown
} from "lucide-react"

export const metadata: Metadata = {
  title: "Deal Finder - Find the Best Deals & Discounts | SaveSmart",
  description: "Use our deal finder to discover the best deals by price, discount percentage, category, or store. Find deals under $50, $100, or 50%+ off from top retailers.",
  keywords: [
    "deal finder",
    "find deals",
    "best deals",
    "discount finder",
    "deal search",
    "bargain finder",
  ],
  openGraph: {
    title: "Deal Finder - Find the Best Deals & Discounts",
    description: "Discover amazing deals by price, discount, category, or store. Updated hourly.",
    type: "website",
    url: "https://savesmart.bio/deals-finder",
  },
  alternates: {
    canonical: "/deals-finder",
  },
}

// Group pages by type
function groupPages() {
  const pricePages = DEAL_FINDER_PAGES.filter(p => p.filter.maxPrice)
  const discountPages = DEAL_FINDER_PAGES.filter(p => p.filter.minDiscount)
  const categoryPages = DEAL_FINDER_PAGES.filter(p => p.filter.category)
  const storePages = DEAL_FINDER_PAGES.filter(p => p.filter.store)
  const otherPages = DEAL_FINDER_PAGES.filter(p => 
    !p.filter.maxPrice && !p.filter.minDiscount && !p.filter.category && !p.filter.store
  )
  
  return { pricePages, discountPages, categoryPages, storePages, otherPages }
}

export default function DealFinderIndexPage() {
  const { pricePages, discountPages, categoryPages, storePages, otherPages } = groupPages()
  
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Deal Finder", url: "/deals-finder" },
  ])
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary/5 to-background py-12">
          <PageContainer className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Deal Finder
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Find the best deals by price, discount percentage, category, or store. 
              Our ranking algorithm surfaces the top deals first.
            </p>
          </PageContainer>
        </section>
        
        {/* Featured Deals */}
        {otherPages.length > 0 && (
          <section className="py-10 md:py-12">
            <PageContainer>
              <SectionHeading description="Popular deal collections updated hourly">
                Featured Deal Collections
              </SectionHeading>
              
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {otherPages.map((page) => (
                  <Link
                    key={page.slug}
                    href={`/deals-finder/${page.slug}`}
                    className="group"
                  >
                    <Card className="h-full border-border hover:border-primary transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Zap className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {page.h1}
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                              {page.description}
                            </p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </PageContainer>
          </section>
        )}
        
        {/* By Price */}
        <section className="py-10 md:py-12 border-t border-border bg-muted/30">
          <PageContainer>
            <SectionHeading description="Find deals within your budget">
              <DollarSign className="h-5 w-5 inline mr-2 text-green-600" />
              Deals by Price
            </SectionHeading>
            
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
              {pricePages.map((page) => (
                <Link
                  key={page.slug}
                  href={`/deals-finder/${page.slug}`}
                  className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-background hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground">
                    Under ${page.filter.maxPrice}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {page.filter.maxPrice && page.filter.maxPrice <= 50 ? "Budget" : 
                     page.filter.maxPrice && page.filter.maxPrice <= 100 ? "Value" : "Premium"}
                  </Badge>
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>
        
        {/* By Discount */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <SectionHeading description="Maximize your savings with deep discounts">
              <Percent className="h-5 w-5 inline mr-2 text-red-500" />
              Deals by Discount
            </SectionHeading>
            
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
              {discountPages.map((page) => (
                <Link
                  key={page.slug}
                  href={`/deals-finder/${page.slug}`}
                  className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-background hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground">
                    {page.filter.minDiscount}%+ Off
                  </span>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>
        
        {/* By Category */}
        <section className="py-10 md:py-12 border-t border-border bg-muted/30">
          <PageContainer>
            <SectionHeading description="Browse deals in your favorite categories">
              <Tag className="h-5 w-5 inline mr-2 text-blue-500" />
              Deals by Category
            </SectionHeading>
            
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {categoryPages.map((page) => (
                <Link
                  key={page.slug}
                  href={`/deals-finder/${page.slug}`}
                  className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-background hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground">
                    {page.h1.replace("Best ", "").replace(" Deals", "")}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>
        
        {/* By Store */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <SectionHeading description="Shop deals from your favorite retailers">
              <Store className="h-5 w-5 inline mr-2 text-amber-500" />
              Deals by Store
            </SectionHeading>
            
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
              {storePages.map((page) => (
                <Link
                  key={page.slug}
                  href={`/deals-finder/${page.slug}`}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg border border-border bg-background hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors"
                >
                  <Store className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium text-foreground">
                    {page.filter.store?.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ")}
                  </span>
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>
        
        {/* SEO Content */}
        <section className="py-10 md:py-12 border-t border-border bg-muted/30">
          <PageContainer>
            <div className="prose prose-neutral dark:prose-invert max-w-3xl mx-auto">
              <h2>How Our Deal Finder Works</h2>
              <p>
                SaveSmart's Deal Finder uses a proprietary ranking algorithm to surface the best deals first. 
                We analyze deals based on:
              </p>
              <ul>
                <li><strong>Discount Percentage (40%)</strong> - Higher discounts score better</li>
                <li><strong>Store Reputation (20%)</strong> - Trusted retailers get priority</li>
                <li><strong>Price Value (20%)</strong> - Better value deals rank higher</li>
                <li><strong>Savings Amount (10%)</strong> - Bigger savings = better score</li>
                <li><strong>Recency (10%)</strong> - Fresh deals get a slight boost</li>
              </ul>
              <p>
                Our deal finder pages are updated hourly to ensure you always see the most current prices 
                and discounts. Click any deal to verify pricing on the retailer's website.
              </p>
            </div>
          </PageContainer>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
