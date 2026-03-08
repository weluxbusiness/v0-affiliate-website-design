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
import { getDealsByCategory, searchDeals } from "@/lib/deals"
import { SeoContentBlock } from "@/components/seo-content-block"
import { cities, formatCityName, getPopularCities } from "@/lib/cities"
import { getCategoryBySlug, getCategorySlugs } from "@/lib/seo-data"
import { 
  MapPin,
  Sparkles,
  Headphones,
  Shirt,
  Home,
  Laptop,
  ShoppingBag,
  Tag,
  Clock,
  ArrowRight
} from "lucide-react"

// Revalidate pages every hour
export const revalidate = 3600

// Product categories with search terms and icons
const productCategories: Record<string, { name: string; searchTerms: string[]; icon: typeof Headphones }> = {
  'headphones': { name: 'Headphones', searchTerms: ['headphones', 'earbuds', 'airpods'], icon: Headphones },
  'running-shoes': { name: 'Running Shoes', searchTerms: ['running', 'shoes'], icon: ShoppingBag },
  'laptops': { name: 'Laptops', searchTerms: ['laptop', 'macbook', 'notebook'], icon: Laptop },
  'tvs': { name: 'TVs', searchTerms: ['tv', 'television', 'oled', 'qled'], icon: Laptop },
  'smartphones': { name: 'Smartphones', searchTerms: ['phone', 'iphone', 'android', 'smartphone'], icon: Laptop },
  'smartwatches': { name: 'Smartwatches', searchTerms: ['watch', 'smartwatch', 'apple watch'], icon: Laptop },
  'jeans': { name: 'Jeans', searchTerms: ['jeans', 'denim'], icon: Shirt },
  'jackets': { name: 'Jackets', searchTerms: ['jacket', 'coat', 'parka'], icon: Shirt },
  'sneakers': { name: 'Sneakers', searchTerms: ['sneakers', 'shoes', 'trainers'], icon: ShoppingBag },
  'coffee-makers': { name: 'Coffee Makers', searchTerms: ['coffee', 'espresso'], icon: Home },
  'air-fryers': { name: 'Air Fryers', searchTerms: ['air fryer', 'ninja'], icon: Home },
  'vacuums': { name: 'Vacuums', searchTerms: ['vacuum', 'dyson', 'roomba'], icon: Home },
  'blenders': { name: 'Blenders', searchTerms: ['blender', 'vitamix'], icon: Home },
  'sunglasses': { name: 'Sunglasses', searchTerms: ['sunglasses', 'ray-ban'], icon: Shirt },
  'kitchen': { name: 'Kitchen', searchTerms: ['kitchen', 'cookware', 'appliance'], icon: Home },
  'electronics': { name: 'Electronics', searchTerms: ['electronics', 'tech', 'gadget'], icon: Laptop },
  'fashion': { name: 'Fashion', searchTerms: ['fashion', 'clothing', 'apparel'], icon: Shirt },
  'home-kitchen': { name: 'Home & Kitchen', searchTerms: ['home', 'kitchen', 'furniture'], icon: Home },
  'gaming': { name: 'Gaming', searchTerms: ['gaming', 'playstation', 'xbox', 'nintendo'], icon: Laptop },
  'fitness': { name: 'Fitness', searchTerms: ['fitness', 'gym', 'workout'], icon: ShoppingBag },
  'beauty': { name: 'Beauty', searchTerms: ['beauty', 'makeup', 'skincare'], icon: Shirt },
  'outdoor': { name: 'Outdoor', searchTerms: ['outdoor', 'camping', 'hiking'], icon: Home },
}

interface PageProps {
  params: Promise<{ category: string; city: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, city } = await params
  const categorySlug = category.toLowerCase()
  const citySlug = city.toLowerCase()
  
  // Validate city exists
  if (!cities.includes(citySlug)) {
    return { title: 'Page Not Found | SaveSmart' }
  }
  
  const categoryInfo = productCategories[categorySlug]
  const categoryName = categoryInfo?.name || categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const cityName = formatCityName(citySlug)
  const currentYear = new Date().getFullYear()
  
  return {
    title: `Best ${categoryName} Deals in ${cityName} ${currentYear} | SaveSmart`,
    description: `Find the best ${categoryName.toLowerCase()} deals in ${cityName}. Compare prices from Amazon, Best Buy, Target & more. Updated daily with the latest discounts.`,
    openGraph: {
      title: `Best ${categoryName} Deals in ${cityName} | SaveSmart`,
      description: `Compare ${categoryName.toLowerCase()} deals from top retailers in ${cityName}. Prices updated hourly.`,
      type: 'website',
      url: `https://savesmart.bio/deals/${categorySlug}/${citySlug}`,
    },
    alternates: {
      canonical: `/deals/${categorySlug}/${citySlug}`,
    },
    keywords: [
      `${categoryName.toLowerCase()} deals ${cityName}`,
      `best ${categoryName.toLowerCase()} ${cityName}`,
      `${categoryName.toLowerCase()} discounts ${cityName}`,
      `cheap ${categoryName.toLowerCase()} ${cityName}`,
      `${categoryName.toLowerCase()} sale ${cityName}`,
      `buy ${categoryName.toLowerCase()} ${cityName}`,
    ],
  }
}

// Generate static params for all category + city combinations
export async function generateStaticParams() {
  const categorySlugs = await getCategorySlugs()
  const fallbackCategories = Object.keys(productCategories)
  const allCategories = categorySlugs.length > 0 ? categorySlugs : fallbackCategories
  
  // Generate params for all combinations
  // For build performance, we'll limit to popular cities for static generation
  const popularCities = getPopularCities(50)
  
  const params: { category: string; city: string }[] = []
  
  for (const category of allCategories.slice(0, 20)) {
    for (const city of popularCities) {
      params.push({ category, city })
    }
  }
  
  return params
}

export default async function CityDealsPage({ params }: PageProps) {
  const { category, city } = await params
  const categorySlug = category.toLowerCase()
  const citySlug = city.toLowerCase()
  
  // Validate city exists
  if (!cities.includes(citySlug)) {
    notFound()
  }
  
  // Try to get category from database first
  const dbCategory = await getCategoryBySlug(categorySlug)
  const categoryInfo = productCategories[categorySlug]
  
  // If neither database nor static config has this category, 404
  if (!categoryInfo && !dbCategory) {
    notFound()
  }
  
  const categoryName = dbCategory?.name || categoryInfo?.name || categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const cityName = formatCityName(citySlug)
  const searchTerms = categoryInfo?.searchTerms || [categoryName]
  
  // Get deals - same as category page (deals are national, just localized messaging)
  const searchResults = await Promise.all(searchTerms.map(term => searchDeals(term, 8)))
  let deals = [...new Map(searchResults.flat().map(d => [d.id, d])).values()].slice(0, 20)
  
  // If no results, fall back to category search
  if (deals.length === 0) {
    deals = await getDealsByCategory(categoryName, 20)
  }
  
  const featuredDeals = deals.slice(0, 3)
  const regularDeals = deals.slice(3)
  
  const Icon = categoryInfo?.icon || Tag
  const currentYear = new Date().getFullYear()
  
  // Get other popular cities for internal linking
  const otherCities = getPopularCities(12).filter(c => c !== citySlug)
  
  // Get other categories for internal linking
  const otherCategories = Object.entries(productCategories)
    .filter(([slug]) => slug !== categorySlug)
    .slice(0, 8)
  
  // Generate timestamp for "Last Updated"
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  
  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${categoryName} Deals in ${cityName}`,
    description: `Find the best ${categoryName.toLowerCase()} deals in ${cityName}`,
    url: `https://savesmart.bio/deals/${categorySlug}/${citySlug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: deals.length,
    },
    areaServed: {
      "@type": "City",
      name: cityName,
    },
  }

  // Local business FAQ schema for featured snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Where can I find the best ${categoryName.toLowerCase()} deals in ${cityName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `SaveSmart tracks ${categoryName.toLowerCase()} deals from major retailers like Amazon, Best Buy, Target, and Walmart that ship to ${cityName}. We compare prices across all these stores to find you the best discounts, typically ranging from 10-50% off retail prices.`,
        },
      },
      {
        "@type": "Question",
        name: `Do these ${categoryName.toLowerCase()} deals ship to ${cityName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes! All deals listed here are from major national retailers that offer shipping to ${cityName}. Many also offer in-store pickup options at local stores in the ${cityName} area.`,
        },
      },
      {
        "@type": "Question",
        name: `How often are ${categoryName.toLowerCase()} deals updated for ${cityName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `We update our ${categoryName.toLowerCase()} deals for ${cityName} hourly to ensure you always see the most current prices and discounts. Check back frequently as new deals are added throughout the day.`,
        },
      },
    ],
  }

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
        <section className="relative bg-gradient-to-br from-emerald-600 to-emerald-800 text-white py-14 md:py-16 overflow-hidden">
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
                href={`/deals/${categorySlug}`}
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                {categoryName}
              </Link>
              <span className="text-white/50">/</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
                <MapPin className="h-3 w-3 mr-1" />
                {cityName}
              </span>
            </nav>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-2 text-white/70 uppercase tracking-wider text-sm font-medium">
                <MapPin className="h-4 w-4" />
                {cityName}
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 text-balance">
              Best {categoryName} Deals in {cityName}
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-4">
              Compare prices and find the best deals on {categoryName.toLowerCase()} from top retailers shipping to {cityName}.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {deals.length} Active Deals
              </Badge>
              <span className="flex items-center gap-1.5 text-sm text-white/70">
                <Clock className="h-4 w-4" />
                Updated: {lastUpdated}
              </span>
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
              <SectionHeading>Top {categoryName} Deals in {cityName}</SectionHeading>
              <DealGrid columns={3}>
                {featuredDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} variant="featured" />
                ))}
              </DealGrid>
            </PageContainer>
          </section>
        )}

        {/* All Deals */}
        <section className="bg-muted/30 py-10 md:py-12">
          <PageContainer>
            <SectionHeading>All {categoryName} Deals</SectionHeading>
            {regularDeals.length > 0 ? (
              <DealGrid columns={4}>
                {regularDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </DealGrid>
            ) : featuredDeals.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="py-12 text-center">
                  <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No deals found</h3>
                  <p className="text-muted-foreground mb-4">Check back soon for new {categoryName.toLowerCase()} deals in {cityName}!</p>
                  <Button variant="outline" asChild>
                    <Link href={`/deals/${categorySlug}`}>Browse All {categoryName} Deals</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : null}
          </PageContainer>
        </section>

        {/* Other Cities for this Category */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <h2 className="text-xl font-bold text-foreground mb-6">
              {categoryName} Deals in Other Cities
            </h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {otherCities.map((otherCity) => (
                <Link
                  key={otherCity}
                  href={`/deals/${categorySlug}/${otherCity}`}
                  className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium text-foreground truncate">
                    {formatCityName(otherCity)}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link 
                href={`/deals/${categorySlug}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View all {categoryName} deals nationwide
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </PageContainer>
        </section>

        {/* Other Categories in this City */}
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <h2 className="text-xl font-bold text-foreground mb-6">
              More Deals in {cityName}
            </h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
              {otherCategories.map(([catSlug, cat]) => {
                const CategoryIcon = cat.icon
                return (
                  <Link
                    key={catSlug}
                    href={`/deals/${catSlug}/${citySlug}`}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <CategoryIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="text-xs font-medium text-foreground text-center">{cat.name}</span>
                  </Link>
                )
              })}
            </div>
          </PageContainer>
        </section>

        {/* SEO Content Block */}
        <SeoContentBlock
          title={`About ${categoryName} Deals in ${cityName}`}
          content={`Looking for the best ${categoryName.toLowerCase()} deals in ${cityName}? SaveSmart compares prices across all major retailers including Amazon, Best Buy, Target, Walmart, and more to find you the biggest discounts on ${categoryName.toLowerCase()}. All deals listed here ship directly to ${cityName}, with many retailers offering same-day or next-day delivery options. Our prices are updated hourly to ensure you always see the most current discounts available. Whether you're shopping for a gift or treating yourself, we help ${cityName} shoppers save money on ${categoryName.toLowerCase()} every day.`}
          relatedLinks={[
            { label: `All ${categoryName} Deals`, href: `/deals/${categorySlug}` },
            { label: `Best ${categoryName}`, href: `/best/${categorySlug}` },
            ...otherCities.slice(0, 3).map(c => ({
              label: `${categoryName} in ${formatCityName(c)}`,
              href: `/deals/${categorySlug}/${c}`,
            })),
          ]}
        />

        {/* CTA */}
        <section className="py-10 md:py-12 text-center border-t border-border">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Looking for a specific deal in {cityName}?
            </h2>
            <p className="text-muted-foreground mb-6">
              Our AI can help you find exactly what you need at the best price.
            </p>
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
