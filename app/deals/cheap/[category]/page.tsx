import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { DollarSign, ArrowRight, Clock, TrendingDown, Star, CheckCircle } from "lucide-react"

import { getDealsUnderPrice, searchDeals } from "@/lib/deals"
import { getProductImageUrl, formatCategoryName } from "@/lib/deal-types"
import { PageContainer, DealGrid } from "@/components/layout/page-container"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DealCard } from "@/components/deal-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Categories with cheap deal focus - expanded for SEO coverage
const CHEAP_CATEGORIES: Record<string, { name: string; maxPrice: number; searchTerms: string[] }> = {
  // Electronics
  'headphones': { name: 'Headphones', maxPrice: 50, searchTerms: ['headphones', 'earbuds'] },
  'earbuds': { name: 'Earbuds', maxPrice: 30, searchTerms: ['earbuds', 'wireless earbuds'] },
  'wireless-earbuds': { name: 'Wireless Earbuds', maxPrice: 40, searchTerms: ['wireless earbuds', 'bluetooth earbuds'] },
  'laptops': { name: 'Laptops', maxPrice: 300, searchTerms: ['laptop', 'chromebook'] },
  'chromebooks': { name: 'Chromebooks', maxPrice: 200, searchTerms: ['chromebook'] },
  'tablets': { name: 'Tablets', maxPrice: 150, searchTerms: ['tablet', 'fire tablet'] },
  'fire-tablets': { name: 'Fire Tablets', maxPrice: 80, searchTerms: ['fire tablet', 'amazon tablet'] },
  'monitors': { name: 'Monitors', maxPrice: 150, searchTerms: ['monitor', 'display'] },
  'tvs': { name: 'TVs', maxPrice: 300, searchTerms: ['tv', 'television'] },
  'speakers': { name: 'Speakers', maxPrice: 50, searchTerms: ['speaker', 'bluetooth speaker'] },
  'bluetooth-speakers': { name: 'Bluetooth Speakers', maxPrice: 40, searchTerms: ['bluetooth speaker', 'portable speaker'] },
  'keyboards': { name: 'Keyboards', maxPrice: 50, searchTerms: ['keyboard', 'mechanical'] },
  'mice': { name: 'Computer Mice', maxPrice: 30, searchTerms: ['mouse', 'gaming mouse'] },
  'webcams': { name: 'Webcams', maxPrice: 50, searchTerms: ['webcam', 'web camera'] },
  'phone-cases': { name: 'Phone Cases', maxPrice: 20, searchTerms: ['phone case', 'iphone case'] },
  'chargers': { name: 'Chargers', maxPrice: 25, searchTerms: ['charger', 'cable', 'usb-c'] },
  'power-banks': { name: 'Power Banks', maxPrice: 30, searchTerms: ['power bank', 'portable charger'] },
  'smartwatches': { name: 'Smartwatches', maxPrice: 100, searchTerms: ['smartwatch', 'fitness tracker'] },
  'fitness-trackers': { name: 'Fitness Trackers', maxPrice: 50, searchTerms: ['fitness tracker', 'fitness band'] },
  // Fashion
  'sneakers': { name: 'Sneakers', maxPrice: 60, searchTerms: ['sneakers', 'shoes'] },
  'running-shoes': { name: 'Running Shoes', maxPrice: 70, searchTerms: ['running shoes', 'athletic shoes'] },
  'jeans': { name: 'Jeans', maxPrice: 40, searchTerms: ['jeans', 'denim'] },
  'jackets': { name: 'Jackets', maxPrice: 50, searchTerms: ['jacket', 'coat'] },
  't-shirts': { name: 'T-Shirts', maxPrice: 20, searchTerms: ['t-shirt', 'tee', 'shirt'] },
  'hoodies': { name: 'Hoodies', maxPrice: 40, searchTerms: ['hoodie', 'sweatshirt'] },
  'shorts': { name: 'Shorts', maxPrice: 25, searchTerms: ['shorts', 'athletic shorts'] },
  'backpacks': { name: 'Backpacks', maxPrice: 40, searchTerms: ['backpack', 'bag'] },
  'watches': { name: 'Watches', maxPrice: 50, searchTerms: ['watch', 'analog watch'] },
  'sunglasses': { name: 'Sunglasses', maxPrice: 30, searchTerms: ['sunglasses', 'shades'] },
  // Home & Kitchen
  'air-fryers': { name: 'Air Fryers', maxPrice: 60, searchTerms: ['air fryer'] },
  'coffee-makers': { name: 'Coffee Makers', maxPrice: 40, searchTerms: ['coffee maker', 'coffee machine'] },
  'blenders': { name: 'Blenders', maxPrice: 40, searchTerms: ['blender', 'mixer'] },
  'vacuums': { name: 'Vacuums', maxPrice: 100, searchTerms: ['vacuum', 'vacuum cleaner'] },
  'pillows': { name: 'Pillows', maxPrice: 30, searchTerms: ['pillow', 'bed pillow'] },
  'bedding': { name: 'Bedding', maxPrice: 50, searchTerms: ['bedding', 'sheets', 'comforter'] },
  // Gaming
  'gaming-headsets': { name: 'Gaming Headsets', maxPrice: 50, searchTerms: ['gaming headset', 'gaming headphones'] },
  'controllers': { name: 'Controllers', maxPrice: 40, searchTerms: ['controller', 'gamepad'] },
  'gaming-mice': { name: 'Gaming Mice', maxPrice: 40, searchTerms: ['gaming mouse'] },
}

export async function generateStaticParams() {
  return Object.keys(CHEAP_CATEGORIES).map(category => ({ category }))
}

interface PageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params
  const config = CHEAP_CATEGORIES[category]
  
  if (!config) {
    return { title: "Cheap Deals | SaveSmart" }
  }
  
  const year = new Date().getFullYear()
  
  return {
    title: `Cheap ${config.name} Deals ${year} - Budget-Friendly Prices | SaveSmart`,
    description: `Find the cheapest ${config.name.toLowerCase()} deals under $${config.maxPrice}. Budget-friendly options from top brands with verified discounts. Updated daily.`,
    keywords: [
      `cheap ${config.name.toLowerCase()}`,
      `${config.name.toLowerCase()} deals`,
      `budget ${config.name.toLowerCase()}`,
      `${config.name.toLowerCase()} under $${config.maxPrice}`,
      `affordable ${config.name.toLowerCase()}`,
    ],
    openGraph: {
      title: `Cheap ${config.name} Deals - Under $${config.maxPrice}`,
      description: `Budget-friendly ${config.name.toLowerCase()} deals from top retailers.`,
      url: `https://savesmart.bio/deals/cheap/${category}`,
    },
    alternates: {
      canonical: `/deals/cheap/${category}`,
    },
  }
}

export const revalidate = 3600

export default async function CheapDealsPage({ params }: PageProps) {
  const { category } = await params
  const config = CHEAP_CATEGORIES[category]
  
  if (!config) {
    notFound()
  }
  
  // Search for deals under max price
  const deals = await getDealsUnderPrice(config.maxPrice, config.searchTerms[0], undefined, 40)
  
  // Also search by other terms if needed
  let allDeals = [...deals]
  if (deals.length < 20 && config.searchTerms.length > 1) {
    for (const term of config.searchTerms.slice(1)) {
      const moreDeals = await searchDeals(term, 20)
      const filtered = moreDeals.filter(d => d.deal_price <= config.maxPrice)
      allDeals = [...allDeals, ...filtered]
    }
  }
  
  // Deduplicate and sort by price (cheapest first)
  allDeals = [...new Map(allDeals.map(d => [d.id, d])).values()]
    .sort((a, b) => a.deal_price - b.deal_price)
    .slice(0, 40)
  
  const year = new Date().getFullYear()
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
  
  // Related cheap categories
  const relatedCategories = Object.entries(CHEAP_CATEGORIES)
    .filter(([slug]) => slug !== category)
    .slice(0, 6)
  
  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Cheap ${config.name} Deals`,
    description: `Budget-friendly ${config.name.toLowerCase()} deals under $${config.maxPrice}`,
    url: `https://savesmart.bio/deals/cheap/${category}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: allDeals.length,
    },
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <main className="pt-16">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-green-600 to-emerald-700 text-white py-14 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <PageContainer className="relative">
            {/* Breadcrumbs */}
            <nav className="mb-6 flex items-center gap-2 text-sm">
              <Link href="/" className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors">
                Home
              </Link>
              <span className="text-white/50">/</span>
              <Link href="/deals" className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors">
                Deals
              </Link>
              <span className="text-white/50">/</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
                Cheap {config.name}
              </span>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <TrendingDown className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium uppercase tracking-wider text-white/90">Budget Deals</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
              Cheap {config.name} Deals {year}
            </h1>
            
            <p className="text-lg text-white/90 max-w-2xl mb-6">
              Find the best budget-friendly {config.name.toLowerCase()} under ${config.maxPrice}. 
              Quality products at prices that won&apos;t break the bank.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Badge className="bg-white/20 text-white border-0 text-sm">
                <DollarSign className="h-3.5 w-3.5 mr-1" />
                Under ${config.maxPrice}
              </Badge>
              <Badge className="bg-white/20 text-white border-0 text-sm">
                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                {allDeals.length} Deals Found
              </Badge>
              <span className="flex items-center gap-1.5 text-sm text-white/70">
                <Clock className="h-4 w-4" />
                Updated: {lastUpdated}
              </span>
            </div>
          </PageContainer>
        </section>
        
        {/* Deals Grid */}
        <section className="py-10 md:py-12">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Cheapest {config.name} Deals
            </h2>
            
            {allDeals.length > 0 ? (
              <DealGrid columns={4}>
                {allDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </DealGrid>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <DollarSign className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No cheap deals found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    We couldn&apos;t find {config.name.toLowerCase()} under ${config.maxPrice} right now.
                  </p>
                  <Button asChild>
                    <Link href={`/deals/price/${category}-under-${config.maxPrice * 2}`}>
                      Try Higher Budget
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </PageContainer>
        </section>
        
        {/* SEO Content */}
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Finding Cheap {config.name} That Don&apos;t Sacrifice Quality
              </h2>
              <div className="prose prose-muted max-w-none space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Looking for {config.name.toLowerCase()} on a budget? You&apos;ve come to the right place. 
                  At SaveSmart, we track prices across hundreds of retailers to find the best cheap {config.name.toLowerCase()} 
                  deals that don&apos;t compromise on quality. Our curated selection includes items under ${config.maxPrice} 
                  from trusted brands.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We verify every deal to ensure you&apos;re getting genuine savings, not inflated &quot;discounts.&quot; 
                  Whether you&apos;re a student, a first-time buyer, or simply looking for great value, these budget-friendly 
                  {config.name.toLowerCase()} options deliver excellent performance without the premium price tag.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Tips for finding the best cheap {config.name.toLowerCase()}: Look for last-generation models which often 
                  offer 90% of the features at 50% of the price. Check refurbished options from official retailers. 
                  And always compare across multiple stores - we do that work for you.
                </p>
              </div>
            </div>
          </PageContainer>
        </section>
        
        {/* Related Categories */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <h3 className="text-xl font-bold text-foreground mb-6">More Cheap Deals by Category</h3>
            <div className="flex flex-wrap gap-3">
              {relatedCategories.map(([slug, cat]) => (
                <Link
                  key={slug}
                  href={`/deals/cheap/${slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
                >
                  Cheap {cat.name}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
            
            <div className="mt-8">
              <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                Browse by Price
              </h4>
              <div className="flex flex-wrap gap-3">
                {[25, 50, 100, 200].map((price) => (
                  <Link
                    key={price}
                    href={`/deals/price/${category}-under-${price}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
                  >
                    {config.name} Under ${price}
                  </Link>
                ))}
              </div>
            </div>
          </PageContainer>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
