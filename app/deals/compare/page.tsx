import type { Metadata } from "next"
import Link from "next/link"
import { Scale, ChevronRight, Shirt, Laptop, Headphones, Home, ShoppingBag, Sparkles } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { PageContainer, SectionHeading } from "@/components/layout/page-container"
import { formatDisplayName } from "@/data/deal-pages"

export const metadata: Metadata = {
  title: "Compare Deals – Brand vs Brand Comparisons | SaveSmart",
  description: "Compare deals from top brands side by side. Nike vs Adidas, Apple vs Samsung, and more. Find the best value and biggest savings.",
  openGraph: {
    title: "Compare Brand Deals | SaveSmart",
    description: "Side-by-side brand comparisons to help you find the best deals.",
    type: "website",
  },
  alternates: {
    canonical: "/deals/compare",
  },
}

// Comparison categories
const COMPARISON_CATEGORIES = [
  {
    name: "Fashion & Sports",
    icon: Shirt,
    comparisons: [
      { slug: "nike-vs-adidas", label: "Nike vs Adidas" },
      { slug: "north-face-vs-patagonia", label: "North Face vs Patagonia" },
      { slug: "new-balance-vs-nike", label: "New Balance vs Nike" },
      { slug: "puma-vs-adidas", label: "Puma vs Adidas" },
      { slug: "under-armour-vs-nike", label: "Under Armour vs Nike" },
    ],
  },
  {
    name: "Electronics",
    icon: Laptop,
    comparisons: [
      { slug: "apple-vs-samsung", label: "Apple vs Samsung" },
      { slug: "macbook-vs-dell", label: "MacBook vs Dell" },
      { slug: "dell-vs-hp", label: "Dell vs HP" },
      { slug: "lenovo-vs-dell", label: "Lenovo vs Dell" },
      { slug: "lg-vs-samsung", label: "LG vs Samsung" },
    ],
  },
  {
    name: "Audio",
    icon: Headphones,
    comparisons: [
      { slug: "sony-vs-bose", label: "Sony vs Bose" },
      { slug: "beats-vs-airpods", label: "Beats vs AirPods" },
      { slug: "jbl-vs-bose", label: "JBL vs Bose" },
      { slug: "sennheiser-vs-sony", label: "Sennheiser vs Sony" },
    ],
  },
  {
    name: "Home & Appliances",
    icon: Home,
    comparisons: [
      { slug: "dyson-vs-shark", label: "Dyson vs Shark" },
      { slug: "roomba-vs-dyson", label: "Roomba vs Dyson" },
      { slug: "kitchenaid-vs-cuisinart", label: "KitchenAid vs Cuisinart" },
      { slug: "ninja-vs-vitamix", label: "Ninja vs Vitamix" },
    ],
  },
  {
    name: "Gaming",
    icon: ShoppingBag,
    comparisons: [
      { slug: "playstation-vs-xbox", label: "PlayStation vs Xbox" },
      { slug: "nintendo-vs-playstation", label: "Nintendo vs PlayStation" },
      { slug: "razer-vs-logitech", label: "Razer vs Logitech" },
    ],
  },
  {
    name: "Retailers",
    icon: Sparkles,
    comparisons: [
      { slug: "amazon-vs-walmart", label: "Amazon vs Walmart" },
      { slug: "target-vs-walmart", label: "Target vs Walmart" },
      { slug: "best-buy-vs-amazon", label: "Best Buy vs Amazon" },
      { slug: "costco-vs-walmart", label: "Costco vs Walmart" },
    ],
  },
]

// Featured comparisons
const FEATURED = [
  { slug: "nike-vs-adidas", category: "Fashion" },
  { slug: "apple-vs-samsung", category: "Electronics" },
  { slug: "dyson-vs-shark", category: "Home" },
  { slug: "playstation-vs-xbox", category: "Gaming" },
]

export default function DealsComparePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8 md:py-12">
        <PageContainer>
          {/* Hero */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Scale className="h-3 w-3 mr-1" />
              Deal Comparisons
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Compare Brand Deals
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Side-by-side brand comparisons with real-time pricing. Find out which brand offers 
              better value, bigger discounts, and more deals.
            </p>
          </div>

          {/* Featured */}
          <section className="mb-12">
            <SectionHeading description="Most popular brand comparisons">
              Featured Comparisons
            </SectionHeading>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {FEATURED.map((item) => {
                const parts = item.slug.split("-vs-")
                return (
                  <Link
                    key={item.slug}
                    href={`/deals/compare/${item.slug}`}
                    className="group p-6 rounded-xl border border-border bg-card hover:border-primary hover:shadow-lg transition-all"
                  >
                    <Badge variant="outline" className="mb-3">{item.category}</Badge>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                      {formatDisplayName(parts[0])} vs {formatDisplayName(parts[1])}
                    </h3>
                    <div className="flex items-center text-sm text-primary font-medium">
                      Compare Deals
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>

          {/* All Comparisons by Category */}
          <section>
            <SectionHeading description="Browse all brand deal comparisons">
              Compare by Category
            </SectionHeading>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {COMPARISON_CATEGORIES.map((category) => (
                <Card key={category.name} className="border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <category.icon className="h-5 w-5" />
                      </div>
                      <h2 className="text-lg font-semibold text-foreground">{category.name}</h2>
                    </div>
                    <div className="space-y-2">
                      {category.comparisons.map((comparison) => (
                        <Link
                          key={comparison.slug}
                          href={`/deals/compare/${comparison.slug}`}
                          className="group flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <span className="text-foreground group-hover:text-primary transition-colors">
                            {comparison.label}
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Looking for Specific Deals?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Browse our deal categories or use our AI-powered Deal Finder to discover personalized recommendations.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/deals/today"
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Today&apos;s Deals
              </Link>
              <Link
                href="/deal-finder"
                className="px-6 py-3 rounded-lg border border-border bg-background font-medium hover:bg-muted transition-colors"
              >
                AI Deal Finder
              </Link>
            </div>
          </section>
        </PageContainer>
      </main>

      <Footer />
    </div>
  )
}
