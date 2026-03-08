import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CapitalOnePromo } from "@/components/capital-one-promo"
import { PageContainer, DealGrid, SectionHeading } from "@/components/layout/page-container"
import { DealCard } from "@/components/deal-card"
import { searchDeals, getDealsByCategory } from "@/lib/deals"
import { getStoreInfo, getProductImageUrl, formatStoreName } from "@/lib/deal-types"
import { SeoContentBlock, generateBestProductSeoContent, getBestProductRelatedLinks } from "@/components/seo-content-block"
import { CategoryCrossLinks } from "@/components/internal-links"
import { getCategoryBySlug, getCategorySlugs, getStoresForCategory } from "@/lib/seo-data"
import { 
  Award,
  Clock,
  Star,
  TrendingUp,
  CheckCircle,
  Headphones,
  Laptop,
  Tv,
  Smartphone,
  Watch,
  Shirt,
  Footprints,
  Home,
  Sparkles,
  ArrowRight
} from "lucide-react"

interface PageProps {
  params: Promise<{ category: string }>
}

// Comprehensive product categories for programmatic SEO
const PRODUCT_CATEGORIES: Record<string, {
  name: string
  searchTerms: string[]
  icon: typeof Headphones
  description: string
  relatedCategories: string[]
}> = {
  'headphones': {
    name: 'Headphones',
    searchTerms: ['headphones', 'earbuds', 'airpods', 'wireless headphones'],
    icon: Headphones,
    description: 'Discover the best headphone deals including wireless earbuds, over-ear headphones, and noise-canceling options from top brands like Sony, Bose, Apple, and Beats.',
    relatedCategories: ['earbuds', 'speakers', 'audio-equipment'],
  },
  'earbuds': {
    name: 'Earbuds',
    searchTerms: ['earbuds', 'airpods', 'wireless earbuds', 'true wireless'],
    icon: Headphones,
    description: 'Find the best wireless earbuds deals including AirPods, Galaxy Buds, and premium true wireless options with active noise cancellation.',
    relatedCategories: ['headphones', 'airpods', 'audio-equipment'],
  },
  'laptops': {
    name: 'Laptops',
    searchTerms: ['laptop', 'macbook', 'chromebook', 'notebook'],
    icon: Laptop,
    description: 'Compare the best laptop deals from Apple, Dell, HP, Lenovo, and ASUS. Find discounts on MacBooks, gaming laptops, and business notebooks.',
    relatedCategories: ['macbooks', 'gaming-laptops', 'chromebooks'],
  },
  'macbooks': {
    name: 'MacBooks',
    searchTerms: ['macbook', 'macbook pro', 'macbook air', 'apple laptop'],
    icon: Laptop,
    description: 'Find the best MacBook deals including MacBook Air and MacBook Pro models. Save on Apple laptops with verified discounts.',
    relatedCategories: ['laptops', 'apple', 'tablets'],
  },
  'gaming-laptops': {
    name: 'Gaming Laptops',
    searchTerms: ['gaming laptop', 'rog', 'alienware', 'razer'],
    icon: Laptop,
    description: 'Discover deals on gaming laptops from ASUS ROG, Alienware, Razer, and MSI. High-performance laptops for gaming at discounted prices.',
    relatedCategories: ['laptops', 'gaming', 'monitors'],
  },
  'tvs': {
    name: 'TVs',
    searchTerms: ['tv', 'television', 'oled', 'qled', '4k tv', '8k tv'],
    icon: Tv,
    description: 'Compare TV deals on OLED, QLED, and LED TVs from Samsung, LG, Sony, and TCL. Find 4K and 8K smart TV discounts.',
    relatedCategories: ['oled-tvs', 'soundbars', 'streaming-devices'],
  },
  'oled-tvs': {
    name: 'OLED TVs',
    searchTerms: ['oled', 'oled tv', 'lg oled', 'sony oled'],
    icon: Tv,
    description: 'Find the best OLED TV deals from LG, Sony, and Samsung. Premium picture quality at discounted prices.',
    relatedCategories: ['tvs', 'qled-tvs', 'soundbars'],
  },
  'smartphones': {
    name: 'Smartphones',
    searchTerms: ['phone', 'iphone', 'samsung phone', 'smartphone', 'android'],
    icon: Smartphone,
    description: 'Discover smartphone deals on iPhone, Samsung Galaxy, Google Pixel, and OnePlus devices. Unlocked phones at discounted prices.',
    relatedCategories: ['iphones', 'samsung-phones', 'phone-accessories'],
  },
  'iphones': {
    name: 'iPhones',
    searchTerms: ['iphone', 'iphone 15', 'iphone 14', 'apple phone'],
    icon: Smartphone,
    description: 'Find the best iPhone deals including iPhone 15, iPhone 14, and older models. Save on Apple smartphones.',
    relatedCategories: ['smartphones', 'apple', 'phone-cases'],
  },
  'smartwatches': {
    name: 'Smartwatches',
    searchTerms: ['smartwatch', 'apple watch', 'galaxy watch', 'fitness tracker'],
    icon: Watch,
    description: 'Compare smartwatch deals on Apple Watch, Samsung Galaxy Watch, Garmin, and Fitbit. Track fitness and stay connected for less.',
    relatedCategories: ['apple-watch', 'fitness-trackers', 'wearables'],
  },
  'apple-watch': {
    name: 'Apple Watch',
    searchTerms: ['apple watch', 'watch ultra', 'watch se'],
    icon: Watch,
    description: 'Find Apple Watch deals including Series 9, Ultra, and SE models. Save on Apple smartwatches with verified discounts.',
    relatedCategories: ['smartwatches', 'apple', 'fitness-trackers'],
  },
  'sneakers': {
    name: 'Sneakers',
    searchTerms: ['sneakers', 'shoes', 'nike shoes', 'adidas shoes', 'running shoes'],
    icon: Footprints,
    description: 'Discover the best sneaker deals from Nike, Adidas, New Balance, and more. Running shoes, lifestyle sneakers, and athletic footwear.',
    relatedCategories: ['running-shoes', 'basketball-shoes', 'nike'],
  },
  'running-shoes': {
    name: 'Running Shoes',
    searchTerms: ['running shoes', 'running', 'marathon', 'joggers'],
    icon: Footprints,
    description: 'Find running shoe deals from Nike, ASICS, Brooks, and Hoka. Performance running shoes at discounted prices.',
    relatedCategories: ['sneakers', 'fitness', 'workout-gear'],
  },
  'jeans': {
    name: 'Jeans',
    searchTerms: ['jeans', 'denim', 'levis', 'skinny jeans', 'straight jeans'],
    icon: Shirt,
    description: 'Compare jeans deals from Levi\'s, Wrangler, Gap, and premium denim brands. Men\'s and women\'s jeans at great prices.',
    relatedCategories: ['fashion', 'levis', 'pants'],
  },
  'jackets': {
    name: 'Jackets',
    searchTerms: ['jacket', 'coat', 'parka', 'bomber', 'winter jacket'],
    icon: Shirt,
    description: 'Find jacket deals from North Face, Patagonia, Columbia, and more. Winter coats, rain jackets, and lightweight layers.',
    relatedCategories: ['outerwear', 'north-face', 'winter-gear'],
  },
  'air-fryers': {
    name: 'Air Fryers',
    searchTerms: ['air fryer', 'ninja', 'instant pot air fryer', 'philips air fryer'],
    icon: Home,
    description: 'Discover air fryer deals from Ninja, Instant Pot, and Philips. Cook healthier meals with discounted air fryers.',
    relatedCategories: ['kitchen-appliances', 'instant-pot', 'cooking'],
  },
  'vacuums': {
    name: 'Vacuums',
    searchTerms: ['vacuum', 'dyson', 'roomba', 'cordless vacuum', 'robot vacuum'],
    icon: Home,
    description: 'Find vacuum deals on Dyson, Roomba, Shark, and Bissell. Cordless stick vacuums and robot vacuums at great prices.',
    relatedCategories: ['dyson', 'robot-vacuums', 'home-cleaning'],
  },
  'coffee-makers': {
    name: 'Coffee Makers',
    searchTerms: ['coffee maker', 'espresso', 'keurig', 'nespresso', 'breville'],
    icon: Home,
    description: 'Compare coffee maker deals from Breville, Keurig, Nespresso, and De\'Longhi. Espresso machines and drip coffee makers.',
    relatedCategories: ['espresso-machines', 'kitchen-appliances', 'coffee'],
  },
  'monitors': {
    name: 'Monitors',
    searchTerms: ['monitor', 'gaming monitor', '4k monitor', 'ultrawide'],
    icon: Laptop,
    description: 'Find monitor deals on gaming monitors, 4K displays, and ultrawide screens from Samsung, LG, Dell, and ASUS.',
    relatedCategories: ['gaming-monitors', 'computer-accessories', 'office'],
  },
  'tablets': {
    name: 'Tablets',
    searchTerms: ['tablet', 'ipad', 'samsung tablet', 'android tablet'],
    icon: Smartphone,
    description: 'Discover tablet deals including iPad, Samsung Galaxy Tab, and Fire tablets. Portable devices at discounted prices.',
    relatedCategories: ['ipads', 'e-readers', 'accessories'],
  },
  'ipads': {
    name: 'iPads',
    searchTerms: ['ipad', 'ipad pro', 'ipad air', 'ipad mini'],
    icon: Smartphone,
    description: 'Find iPad deals including iPad Pro, iPad Air, and iPad Mini models. Save on Apple tablets with verified discounts.',
    relatedCategories: ['tablets', 'apple', 'apple-pencil'],
  },
}

// All category slugs for static generation
const ALL_CATEGORIES = Object.keys(PRODUCT_CATEGORIES)

// Dynamic params from database with fallback
export async function generateStaticParams() {
  const categorySlugs = await getCategorySlugs()
  const slugs = categorySlugs.length > 0 ? categorySlugs : ALL_CATEGORIES
  return slugs.map(category => ({ category }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params
  const categoryInfo = PRODUCT_CATEGORIES[category]
  
  if (!categoryInfo) {
    return {
      title: 'Best Deals | SaveSmart',
    }
  }
  
  const currentYear = new Date().getFullYear()
  
  return {
    title: `Best ${categoryInfo.name} Deals ${currentYear} - Top Discounts | SaveSmart`,
    description: `Find the best ${categoryInfo.name.toLowerCase()} deals in ${currentYear}. Compare prices from Amazon, Best Buy, Target & more. Save up to 70% with verified discounts.`,
    openGraph: {
      title: `Best ${categoryInfo.name} Deals ${currentYear}`,
      description: `Compare the best ${categoryInfo.name.toLowerCase()} deals from top retailers. Prices updated hourly.`,
      type: 'website',
      url: `https://savesmart.bio/best/${category}`,
    },
    alternates: {
      canonical: `/best/${category}`,
    },
    keywords: [
      `best ${categoryInfo.name.toLowerCase()} deals`,
      `${categoryInfo.name.toLowerCase()} deals ${currentYear}`,
      `cheap ${categoryInfo.name.toLowerCase()}`,
      `${categoryInfo.name.toLowerCase()} discounts`,
      `${categoryInfo.name.toLowerCase()} sale`,
      ...categoryInfo.searchTerms.map(t => `best ${t} deals`),
    ],
  }
}

export const revalidate = 3600

export default async function BestCategoryPage({ params }: PageProps) {
  const { category } = await params
  
  // Try to get category from database first
  const dbCategory = await getCategoryBySlug(category)
  const categoryInfo = PRODUCT_CATEGORIES[category]
  
  // Use database name if available, otherwise fallback to static config
  const categoryName = dbCategory?.name || categoryInfo?.name || category.replace(/-/g, ' ')
  
  if (!categoryInfo && !dbCategory) {
    notFound()
  }
  
  // Get stores that have deals in this category for internal linking
  const storesForCategory = await getStoresForCategory(category, 10)
  
  // Get related categories for cross-linking
  const relatedCategorySlugs = Object.keys(PRODUCT_CATEGORIES).filter(c => c !== category).slice(0, 8)
  
  // Search for deals using category search terms
  const searchTerms = categoryInfo?.searchTerms || [categoryName]
  const searchResults = await Promise.all(
    searchTerms.map(term => searchDeals(term, 15))
  )
  
  // Deduplicate and sort by discount
  let deals = [...new Map(searchResults.flat().map(d => [d.id, d])).values()]
    .sort((a, b) => b.discount_percentage - a.discount_percentage)
    .slice(0, 30)
  
  // Fallback to category search if no results
  if (deals.length === 0) {
    deals = await getDealsByCategory(categoryName, 30)
  }
  
  const topDeals = deals.slice(0, 6)
  const moreDeals = deals.slice(6)
  
  const currentYear = new Date().getFullYear()
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  
  const Icon = categoryInfo?.icon || Award
  const description = categoryInfo?.description || dbCategory?.description || `Find the best ${categoryName.toLowerCase()} deals and discounts.`

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Best ${categoryName} Deals`,
    description: description,
    url: `https://savesmart.bio/best/${category}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: deals.length,
      itemListElement: topDeals.map((deal, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: deal.title,
          offers: {
            "@type": "Offer",
            price: deal.deal_price,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
        },
      })),
    },
  }

  // Buying guide FAQ - use categoryName which is always defined
  const categoryNameLower = categoryName.toLowerCase()
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What are the best ${categoryNameLower} to buy in ${currentYear}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `We track prices on hundreds of ${categoryNameLower} to find the best values. Our top picks are based on discount percentage, brand reputation, and customer reviews. Check our constantly updated list for the current best deals.`,
        },
      },
      {
        "@type": "Question",
        name: `Where can I find the cheapest ${categoryNameLower}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The best prices on ${categoryNameLower} are often found at Amazon, Best Buy, Target, and manufacturer websites during sales events. SaveSmart compares prices across all major retailers so you don't have to.`,
        },
      },
      {
        "@type": "Question",
        name: `When is the best time to buy ${categoryNameLower}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The best times to buy ${categoryNameLower} are during Black Friday, Prime Day, and after new product releases when older models are discounted. However, flash sales happen year-round - we track them all.`,
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
        <section className="relative bg-gradient-to-br from-amber-500 to-orange-600 text-white py-14 md:py-16 overflow-hidden">
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
                Best {categoryName}
              </span>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Award className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium uppercase tracking-wider text-white/90">Best Deals</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
              Best {categoryName} Deals {currentYear}
            </h1>
            
            <p className="text-lg text-white/90 max-w-2xl mb-6">
              {description}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Badge className="bg-white/20 text-white border-0 text-sm">
                <Star className="h-3.5 w-3.5 mr-1 fill-current" />
                {deals.length} Top Deals
              </Badge>
              <Badge className="bg-white/20 text-white border-0 text-sm">
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                Up to {Math.max(...deals.map(d => d.discount_percentage), 0)}% Off
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

        {/* Top Rated Deals */}
        {topDeals.length > 0 && (
          <section className="py-10 md:py-12">
            <PageContainer>
              <SectionHeading>
                <Award className="h-6 w-6 text-amber-500 inline mr-2" />
                Top {categoryName} Deals
              </SectionHeading>
              <DealGrid columns={3}>
                {topDeals.map((deal, index) => (
                  <Link 
                    key={deal.id} 
                    href={`/deal/${deal.slug || deal.id}`}
                    className="group"
                  >
                    <Card className="overflow-hidden border-border/50 transition-all hover:shadow-lg h-full relative">
                      {index < 3 && (
                        <div className="absolute top-3 left-3 z-10">
                          <Badge className="bg-amber-500 text-white">
                            <Award className="h-3 w-3 mr-1" />
                            #{index + 1} Best Deal
                          </Badge>
                        </div>
                      )}
                      <div className="relative aspect-[4/3] bg-muted">
                        <Image
                          src={getProductImageUrl(deal)}
                          alt={deal.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-secondary text-secondary-foreground">
                            {deal.discount_percentage}% OFF
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {deal.store}
                        </p>
                        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                          {deal.title}
                        </h3>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xl font-bold text-secondary">
                            ${deal.deal_price.toFixed(2)}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            ${deal.original_price.toFixed(2)}
                          </span>
                          <Badge variant="outline" className="ml-auto text-green-600 border-green-200 bg-green-50">
                            Save ${(deal.original_price - deal.deal_price).toFixed(2)}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </DealGrid>
            </PageContainer>
          </section>
        )}

        {/* More Deals */}
        {moreDeals.length > 0 && (
          <section className="bg-muted/30 py-10 md:py-12">
            <PageContainer>
              <SectionHeading>More {categoryName} Deals</SectionHeading>
              <DealGrid columns={4}>
                {moreDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </DealGrid>
            </PageContainer>
          </section>
        )}

        {/* No deals message */}
        {deals.length === 0 && (
          <section className="py-16">
            <PageContainer>
              <Card className="border-border/50">
                <CardContent className="py-12 text-center">
                  <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No deals found</h3>
                  <p className="text-muted-foreground mb-4">Check back soon for new {categoryInfo.name.toLowerCase()} deals!</p>
                  <Button variant="outline" asChild>
                    <Link href="/deals">Browse All Deals</Link>
                  </Button>
                </CardContent>
              </Card>
            </PageContainer>
          </section>
        )}

        {/* Related Categories */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground mb-6">Related Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {categoryInfo.relatedCategories.map((relatedSlug) => {
                const related = PRODUCT_CATEGORIES[relatedSlug]
                if (!related) return null
                const RelatedIcon = related.icon
                return (
                  <Link
                    key={relatedSlug}
                    href={`/best/${relatedSlug}`}
                    className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <RelatedIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Best {related.name}</span>
                      <p className="text-xs text-muted-foreground">View Deals</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </PageContainer>
        </section>

        {/* Browse All Best Deals */}
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground mb-6">Browse All Best Deals</h2>
            <div className="flex flex-wrap gap-3">
              {ALL_CATEGORIES.filter(c => c !== category).slice(0, 16).map((catSlug) => {
                const cat = PRODUCT_CATEGORIES[catSlug]
                return (
                  <Link
                    key={catSlug}
                    href={`/best/${catSlug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background hover:bg-muted text-sm font-medium text-foreground transition-colors"
                  >
                    Best {cat.name}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )
              })}
            </div>
          </PageContainer>
        </section>

        {/* SEO Content */}
        <SeoContentBlock
          title={`About Best ${categoryName} Deals`}
          content={generateBestProductSeoContent(categoryName)}
          relatedLinks={getBestProductRelatedLinks(category, categoryName)}
        />

        {/* Cross Link Section - Internal Linking for SEO */}
        <CategoryCrossLinks
          categoryName={categoryName}
          categorySlug={category}
          relatedCategories={relatedCategorySlugs}
          storesWithDeals={storesForCategory}
        />

        {/* AI Deal Finder CTA */}
        <section className="py-10 md:py-12 text-center border-t border-border">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Looking for a specific {categoryName.toLowerCase()} deal?
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
