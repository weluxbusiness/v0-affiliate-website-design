import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight, BookOpen, Calendar, Tag } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { PageContainer } from "@/components/layout/page-container"
import { SectionHeading } from "@/components/layout/page-container"
import { GUIDE_TOPICS } from "@/lib/seo/guide-generator"

export const metadata: Metadata = {
  title: "Buying Guides 2026 - Expert Reviews & Best Deals | SaveSmart",
  description: "100+ expert buying guides for laptops, TVs, phones & more. Compare features, read reviews, and find the best deals. Updated for 2026 - make smarter purchases!",
  keywords: [
    "buying guides", "product reviews", "best laptops 2026",
    "tv buying guide", "smartphone comparison", "shopping guides"
  ],
  openGraph: {
    title: "Expert Buying Guides 2026 - Compare & Save | SaveSmart",
    description: "100+ expert buying guides with reviews and best deals. Make smarter purchases!",
    type: "website",
  },
  alternates: {
    canonical: "/guides",
  },
}

// Group guides by category
function groupByCategory(guides: typeof GUIDE_TOPICS) {
  const grouped: Record<string, typeof GUIDE_TOPICS> = {}
  guides.forEach(guide => {
    if (!grouped[guide.category]) {
      grouped[guide.category] = []
    }
    grouped[guide.category].push(guide)
  })
  return grouped
}

// Format category name
function formatCategoryName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Category display order
const CATEGORY_ORDER = [
  'laptops', 'smartphones', 'gaming', 'tvs', 'headphones', 
  'home-kitchen', 'smart-home', 'fitness', 'electronics',
  'monitors', 'tablets', 'appliances', 'kitchen', 'furniture',
  'sneakers', 'running-shoes', 'outdoor', 'office-supplies', 'cameras'
]

export default function GuidesPage() {
  const groupedGuides = groupByCategory(GUIDE_TOPICS)
  
  // Sort categories by priority
  const sortedCategories = Object.keys(groupedGuides).sort((a, b) => {
    const aIndex = CATEGORY_ORDER.indexOf(a)
    const bIndex = CATEGORY_ORDER.indexOf(b)
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex)
  })

  // Get featured guides (first from each top category)
  const featuredGuides = CATEGORY_ORDER.slice(0, 6)
    .map(cat => groupedGuides[cat]?.[0])
    .filter(Boolean)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8 md:py-12">
        <PageContainer>
          {/* Hero Section */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <BookOpen className="h-3 w-3 mr-1" />
              Expert Buying Guides
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Shopping Guides & Recommendations
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              In-depth buying guides to help you make informed purchasing decisions. 
              Expert picks, price comparisons, and deal recommendations.
            </p>
          </div>

          {/* Featured Guides */}
          <section className="mb-16">
            <SectionHeading description="Our most popular buying guides">
              Featured Guides
            </SectionHeading>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="group p-6 rounded-xl border border-border bg-card hover:border-primary hover:shadow-lg transition-all"
                >
                  <Badge variant="outline" className="mb-3">
                    {formatCategoryName(guide.category)}
                  </Badge>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                    {guide.title.replace(/in \d{4}:?/, '').trim()}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {guide.metaDescription}
                  </p>
                  <div className="flex items-center text-sm text-primary font-medium">
                    Read Guide
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* All Guides by Category */}
          <section>
            <SectionHeading description={`${GUIDE_TOPICS.length} comprehensive guides`}>
              Browse by Category
            </SectionHeading>
            
            <div className="space-y-12">
              {sortedCategories.map(category => (
                <div key={category}>
                  <div className="flex items-center gap-3 mb-4">
                    <Tag className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold text-foreground">
                      {formatCategoryName(category)}
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      ({groupedGuides[category].length} guides)
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {groupedGuides[category].map((guide) => (
                      <Link
                        key={guide.slug}
                        href={`/guides/${guide.slug}`}
                        className="group flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                            {guide.title.replace(/in \d{4}:?/, '').trim()}
                          </h3>
                          {guide.priceRange && (
                            <span className="text-sm text-muted-foreground">
                              {guide.priceRange.label}
                            </span>
                          )}
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors ml-2 shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Browse our deal categories directly or use our Deal Finder to track prices on specific products.
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
                Deal Finder
              </Link>
            </div>
          </section>
        </PageContainer>
      </main>

      <Footer />
    </div>
  )
}
