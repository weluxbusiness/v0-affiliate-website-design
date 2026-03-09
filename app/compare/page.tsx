import type { Metadata } from "next"
import Link from "next/link"
import { Scale, ChevronRight, Laptop, Headphones, Smartphone, Tv, ShoppingBag, Dumbbell } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { PageContainer, SectionHeading } from "@/components/layout/page-container"

export const metadata: Metadata = {
  title: "Product Comparisons | Compare Prices & Features | SaveSmart",
  description: "Compare products side by side. Find the best deals on laptops, phones, headphones, TVs and more with our detailed comparison guides.",
  openGraph: {
    title: "Product Comparisons | SaveSmart",
    description: "Compare products side by side and find the best deals.",
    type: "website",
  },
  alternates: {
    canonical: "/compare",
  },
}

// Popular comparisons organized by category
const COMPARISON_CATEGORIES = [
  {
    name: "Laptops & Computers",
    icon: Laptop,
    comparisons: [
      { slug: "macbook-air-vs-dell-xps", label: "MacBook Air vs Dell XPS" },
      { slug: "macbook-pro-vs-dell-xps", label: "MacBook Pro vs Dell XPS" },
      { slug: "dell-vs-hp-laptops", label: "Dell vs HP Laptops" },
      { slug: "lenovo-vs-asus-laptops", label: "Lenovo vs ASUS Laptops" },
      { slug: "macbook-vs-surface", label: "MacBook vs Surface" },
      { slug: "gaming-laptop-vs-desktop", label: "Gaming Laptop vs Desktop" },
    ],
  },
  {
    name: "Smartphones",
    icon: Smartphone,
    comparisons: [
      { slug: "iphone-vs-samsung-galaxy", label: "iPhone vs Samsung Galaxy" },
      { slug: "iphone-vs-google-pixel", label: "iPhone vs Google Pixel" },
      { slug: "samsung-vs-google-pixel", label: "Samsung vs Google Pixel" },
      { slug: "iphone-15-vs-iphone-14", label: "iPhone 15 vs iPhone 14" },
      { slug: "samsung-galaxy-vs-oneplus", label: "Samsung Galaxy vs OnePlus" },
    ],
  },
  {
    name: "Headphones & Audio",
    icon: Headphones,
    comparisons: [
      { slug: "airpods-vs-sony-wf", label: "AirPods vs Sony WF" },
      { slug: "airpods-pro-vs-airpods", label: "AirPods Pro vs AirPods" },
      { slug: "bose-vs-sony-headphones", label: "Bose vs Sony Headphones" },
      { slug: "beats-vs-airpods", label: "Beats vs AirPods" },
      { slug: "sony-wh-vs-bose-qc", label: "Sony WH-1000XM vs Bose QC" },
    ],
  },
  {
    name: "TVs & Displays",
    icon: Tv,
    comparisons: [
      { slug: "samsung-vs-lg-tv", label: "Samsung vs LG TV" },
      { slug: "oled-vs-qled", label: "OLED vs QLED" },
      { slug: "samsung-vs-sony-tv", label: "Samsung vs Sony TV" },
      { slug: "lg-vs-sony-oled", label: "LG vs Sony OLED" },
      { slug: "tcl-vs-hisense", label: "TCL vs Hisense" },
    ],
  },
  {
    name: "Gaming",
    icon: ShoppingBag,
    comparisons: [
      { slug: "playstation-vs-xbox", label: "PlayStation vs Xbox" },
      { slug: "nintendo-switch-vs-steam-deck", label: "Nintendo Switch vs Steam Deck" },
      { slug: "ps5-vs-xbox-series-x", label: "PS5 vs Xbox Series X" },
      { slug: "gaming-pc-vs-console", label: "Gaming PC vs Console" },
    ],
  },
  {
    name: "Fashion & Sports",
    icon: Dumbbell,
    comparisons: [
      { slug: "nike-vs-adidas", label: "Nike vs Adidas" },
      { slug: "new-balance-vs-nike", label: "New Balance vs Nike" },
      { slug: "apple-watch-vs-fitbit", label: "Apple Watch vs Fitbit" },
      { slug: "garmin-vs-apple-watch", label: "Garmin vs Apple Watch" },
    ],
  },
]

// Featured comparisons for hero section
const FEATURED_COMPARISONS = [
  { slug: "macbook-air-vs-dell-xps", label: "MacBook Air vs Dell XPS", category: "Laptops" },
  { slug: "iphone-vs-samsung-galaxy", label: "iPhone vs Samsung Galaxy", category: "Phones" },
  { slug: "airpods-vs-sony-wf", label: "AirPods vs Sony WF", category: "Audio" },
  { slug: "playstation-vs-xbox", label: "PlayStation vs Xbox", category: "Gaming" },
]

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8 md:py-12">
        <PageContainer>
          {/* Hero Section */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Scale className="h-3 w-3 mr-1" />
              Product Comparisons
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Compare Products & Find the Best Deals
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Side-by-side product comparisons with real-time pricing from top retailers. 
              Make informed decisions and save money.
            </p>
          </div>

          {/* Featured Comparisons */}
          <section className="mb-12">
            <SectionHeading description="Most popular product comparisons">
              Featured Comparisons
            </SectionHeading>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {FEATURED_COMPARISONS.map((comparison) => (
                <Link
                  key={comparison.slug}
                  href={`/compare/${comparison.slug}`}
                  className="group p-6 rounded-xl border border-border bg-card hover:border-primary hover:shadow-lg transition-all"
                >
                  <Badge variant="outline" className="mb-3">{comparison.category}</Badge>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    {comparison.label}
                  </h3>
                  <div className="flex items-center text-sm text-primary font-medium">
                    Compare Now
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* All Comparisons by Category */}
          <section>
            <SectionHeading description="Browse all product comparisons">
              Compare by Category
            </SectionHeading>
            
            <div className="grid md:grid-cols-2 gap-6">
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
                          href={`/compare/${comparison.slug}`}
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

          {/* CTA Section */}
          <section className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Browse our deal categories or use our AI-powered Deal Finder to discover personalized recommendations.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/deals"
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Browse All Deals
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
