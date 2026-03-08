import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/layout/page-container"
import { CapitalOnePromo } from "@/components/capital-one-promo"
import { TrendingUp, Tag, ArrowRight, Flame, Laptop, Headphones, Footprints, Tv, Shirt, Home, Gamepad2, Clock } from "lucide-react"
import { getDealsByCategory } from "@/lib/deals"
import { getProductImageUrl, storeToSlug } from "@/lib/deal-types"

// Define supported trending categories with metadata
const TRENDING_CATEGORIES: Record<string, {
  name: string
  singular: string
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  accentColor: string
  description: string
  stores: string[]
  relatedCategories: string[]
}> = {
  laptops: {
    name: "Laptops",
    singular: "Laptop",
    icon: Laptop,
    gradient: "from-blue-600 to-indigo-700",
    accentColor: "blue-600",
    description: "The hottest laptop deals with the biggest savings. From MacBooks to gaming rigs, find your perfect laptop at an unbeatable price.",
    stores: ["Apple", "Best Buy", "Amazon", "Dell", "HP", "Lenovo"],
    relatedCategories: ["Electronics", "Headphones", "Gaming", "Monitors", "Tablets"],
  },
  sneakers: {
    name: "Sneakers",
    singular: "Sneaker",
    icon: Footprints,
    gradient: "from-emerald-600 to-teal-700",
    accentColor: "emerald-600",
    description: "Score the best sneaker deals from top brands. Nike, Adidas, New Balance and more at prices that won't break the bank.",
    stores: ["Nike", "Adidas", "Foot Locker", "Finish Line", "GOAT", "StockX"],
    relatedCategories: ["Fashion", "Fitness", "Sports", "Apparel", "Accessories"],
  },
  headphones: {
    name: "Headphones",
    singular: "Headphone",
    icon: Headphones,
    gradient: "from-purple-600 to-violet-700",
    accentColor: "purple-600",
    description: "Premium audio at discount prices. AirPods, Sony, Bose and more headphones with massive savings.",
    stores: ["Apple", "Best Buy", "Amazon", "Sony", "Bose", "Audio-Technica"],
    relatedCategories: ["Electronics", "Laptops", "Gaming", "Speakers", "Audio"],
  },
  electronics: {
    name: "Electronics",
    singular: "Electronics",
    icon: Tv,
    gradient: "from-cyan-600 to-blue-700",
    accentColor: "cyan-600",
    description: "Top deals on TVs, tablets, cameras and more. Find the latest tech at the lowest prices.",
    stores: ["Best Buy", "Amazon", "Walmart", "Target", "B&H Photo", "Newegg"],
    relatedCategories: ["Laptops", "Headphones", "Gaming", "Smart Home", "Cameras"],
  },
  fashion: {
    name: "Fashion",
    singular: "Fashion",
    icon: Shirt,
    gradient: "from-pink-600 to-rose-700",
    accentColor: "pink-600",
    description: "Designer styles at outlet prices. Clothing, accessories and apparel deals from top brands.",
    stores: ["Nordstrom", "Macy's", "ASOS", "Zara", "H&M", "Gap"],
    relatedCategories: ["Sneakers", "Accessories", "Beauty", "Watches", "Bags"],
  },
  home: {
    name: "Home & Kitchen",
    singular: "Home",
    icon: Home,
    gradient: "from-amber-600 to-orange-700",
    accentColor: "amber-600",
    description: "Transform your space for less. Furniture, appliances, decor and kitchen essentials at great prices.",
    stores: ["Amazon", "Wayfair", "Target", "IKEA", "Williams Sonoma", "Bed Bath"],
    relatedCategories: ["Kitchen", "Furniture", "Outdoor", "Appliances", "Decor"],
  },
  gaming: {
    name: "Gaming",
    singular: "Gaming",
    icon: Gamepad2,
    gradient: "from-red-600 to-rose-700",
    accentColor: "red-600",
    description: "Level up your setup for less. Gaming consoles, accessories, and gear with massive discounts.",
    stores: ["Best Buy", "Amazon", "GameStop", "Walmart", "Target", "Newegg"],
    relatedCategories: ["Electronics", "Laptops", "Headphones", "Monitors", "Accessories"],
  },
}

type Props = {
  params: Promise<{ category: string }>
}

export async function generateStaticParams() {
  return Object.keys(TRENDING_CATEGORIES).map((category) => ({
    category,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const config = TRENDING_CATEGORIES[category]
  
  if (!config) {
    return {
      title: "Trending Deals | SaveSmart",
    }
  }

  return {
    title: `Trending ${config.name} Deals - Best ${config.singular} Discounts | SaveSmart`,
    description: `Shop trending ${config.name.toLowerCase()} deals with massive discounts. ${config.description}`,
    openGraph: {
      title: `Trending ${config.name} Deals - Best ${config.singular} Discounts | SaveSmart`,
      description: `Shop trending ${config.name.toLowerCase()} deals with massive discounts. ${config.description}`,
      type: "website",
      url: `https://savesmart.bio/trending/${category}`,
    },
    alternates: {
      canonical: `/trending/${category}`,
    },
  }
}

export const revalidate = 300

export default async function TrendingCategoryPage({ params }: Props) {
  const { category } = await params
  const config = TRENDING_CATEGORIES[category]
  
  if (!config) {
    notFound()
  }

  const deals = await getDealsByCategory(category, 50)
  const IconComponent = config.icon

  // Generate timestamp for "Last Updated"
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Trending ${config.name} Deals`,
    url: `https://savesmart.bio/trending/${category}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: deals.length,
    },
  }

  // FAQ structured data for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What are the best ${config.name.toLowerCase()} deals today?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `We currently have ${deals.length} trending ${config.name.toLowerCase()} deals with the biggest discounts. Our trending deals are sorted by discount percentage, featuring savings from top stores like ${config.stores.slice(0, 3).join(', ')} and more.`,
        },
      },
      {
        "@type": "Question",
        name: "How often are deals updated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Trending deals are refreshed every 5 minutes to ensure you see the hottest discounts as they happen. Each listing shows when it was last verified, so you know you're getting real-time savings.",
        },
      },
      {
        "@type": "Question",
        name: `Which stores offer the biggest ${config.name.toLowerCase()} discounts?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `For ${config.name.toLowerCase()}, we track deals from ${config.stores.join(', ')}. These stores frequently offer competitive discounts, and we highlight the best savings so you can compare easily.`,
        },
      },
      {
        "@type": "Question",
        name: "What makes a deal 'trending'?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Trending deals are selected based on discount percentage - the bigger the savings, the higher it ranks. We feature deals with the most significant price drops from verified retailers to help you find the best value.",
        },
      },
    ],
  }

  // Get other trending categories for navigation
  const otherCategories = Object.entries(TRENDING_CATEGORIES)
    .filter(([key]) => key !== category)
    .slice(0, 4)
    .map(([key, value]) => ({
      slug: key,
      name: value.name,
    }))

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="pt-16">
        {/* Hero */}
        <section className={`relative bg-gradient-to-br ${config.gradient} text-white py-14 md:py-16 overflow-hidden`}>
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <PageContainer className="relative">
            <nav className="mb-6 flex items-center gap-2 text-sm">
              <Link 
                href="/" 
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                Home
              </Link>
              <span className="text-white/50">/</span>
              <Link 
                href="/trending-deals" 
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                Trending
              </Link>
              <span className="text-white/50">/</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
                {config.name}
              </span>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <IconComponent className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium uppercase tracking-wider text-white/80">
                Trending {config.name}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Trending {config.name} Deals
            </h1>
            <p className="text-lg text-white/80 max-w-2xl">
              {config.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Badge className="bg-white/20 text-white border-0">
                {deals.length} {config.name} Deals
              </Badge>
              <span className="flex items-center gap-1.5 text-sm text-white/70">
                <Clock className="h-4 w-4" />
                Last updated: {lastUpdated}
              </span>
            </div>
          </PageContainer>
        </section>

        {/* Related Trending Links */}
        <section className="py-6 border-b border-border">
          <PageContainer>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">More trending:</span>
              <Link
                href="/trending-deals"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border hover:border-primary hover:bg-primary/5 text-sm font-medium transition-colors"
              >
                <Flame className="h-4 w-4 text-orange-500" />
                All Trending
              </Link>
              {otherCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/trending/${cat.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border hover:border-primary hover:bg-primary/5 text-sm font-medium transition-colors"
                >
                  <Flame className="h-4 w-4 text-orange-500" />
                  {cat.name}
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Capital One Promo */}
        <section className="py-8">
          <PageContainer>
            <CapitalOnePromo variant="inline" />
          </PageContainer>
        </section>

        {/* Deals Grid */}
        <section className="py-10 md:py-12">
          <PageContainer>
            <h2 className="text-2xl font-bold mb-6">Top {config.name} Deals</h2>
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {deals.map((deal, index) => (
                <Link 
                  key={deal.id} 
                  href={`/deal/${deal.slug || deal.id}`}
                  className="group"
                >
                  <Card className="h-full overflow-hidden border-border/50 transition-all hover:shadow-lg hover:border-primary/30">
                    <div className="relative aspect-square bg-muted">
                      <Image
                        src={getProductImageUrl(deal)}
                        alt={deal.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className={`bg-${config.accentColor} text-white text-xs`}>
                          {deal.discount_percentage}% OFF
                        </Badge>
                      </div>
                      {index < 5 && (
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="bg-background/90 text-xs gap-1">
                            <TrendingUp className={`h-3 w-3 text-${config.accentColor}`} />
                            #{index + 1}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <p className="text-xs text-muted-foreground">{deal.store}</p>
                      <h3 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors mt-0.5">
                        {deal.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`font-bold text-${config.accentColor}`}>
                          ${deal.deal_price.toFixed(2)}
                        </span>
                        <span className="text-xs text-muted-foreground line-through">
                          ${deal.original_price.toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {deals.length === 0 && (
              <div className="text-center py-16">
                <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">No {config.name.toLowerCase()} deals found</h2>
                <p className="text-muted-foreground mb-6">Check back soon!</p>
                <Button asChild>
                  <Link href="/trending-deals">
                    View All Trending
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </PageContainer>
        </section>

        {/* Internal Links - Stores */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <h2 className="text-xl font-bold mb-6">Shop {config.name} by Store</h2>
            <div className="flex flex-wrap gap-3">
              {config.stores.map((store) => (
                <Link
                  key={store}
                  href={`/stores/${storeToSlug(store)}/${category}`}
                  className="inline-flex items-center px-4 py-2 rounded-full border border-border hover:bg-muted text-sm font-medium text-foreground transition-colors"
                >
                  {store} {config.name}
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Internal Links - Categories */}
        <section className="pb-10 md:pb-12">
          <PageContainer>
            <h2 className="text-xl font-bold mb-6">More Deals</h2>
            <div className="flex flex-wrap gap-3">
              {config.relatedCategories.map((cat) => (
                <Link
                  key={cat}
                  href={`/deals/${cat.toLowerCase()}`}
                  className="inline-flex items-center px-4 py-2 rounded-full border border-border hover:bg-muted text-sm font-medium text-foreground transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* CTA */}
        <section className="py-10 md:py-12 text-center border-t border-border">
          <PageContainer>
            <h2 className="text-2xl font-bold mb-4">Looking for Something Specific?</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Tell our AI what you need and we&apos;ll find the best {config.name.toLowerCase()} deals for you.
            </p>
            <Button size="lg" asChild>
              <Link href="/deal-finder">
                Try AI Deal Finder
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </PageContainer>
        </section>
      </main>

      <Footer />
    </div>
  )
}
