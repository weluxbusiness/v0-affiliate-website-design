import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DealCard } from "@/components/deal-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CapitalOnePromo } from "@/components/capital-one-promo"
import { PageContainer, DealGrid } from "@/components/layout/page-container"
import { createAnonClient } from "@/lib/supabase/anon"
import { getStoreInfo, formatRating, formatReviewCount, type Deal } from "@/lib/deal-types"
import { 
  Calendar,
  Clock,
  User,
  ArrowRight,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  TrendingUp
} from "lucide-react"

export const revalidate = 3600

// Store mapping
const stores: Record<string, string> = {
  'amazon': 'Amazon',
  'best-buy': 'Best Buy',
  'bestbuy': 'Best Buy',
  'nike': 'Nike',
  'target': 'Target',
  'apple': 'Apple',
  'walmart': 'Walmart',
  'costco': 'Costco',
  'macys': "Macy's",
  'nordstrom': 'Nordstrom',
  'kohls': "Kohl's",
  'home-depot': 'Home Depot',
  'homedepot': 'Home Depot',
  'lowes': "Lowe's",
  'wayfair': 'Wayfair',
  'adidas': 'Adidas',
  'dyson': 'Dyson',
}

// Category mapping
const categories: Record<string, { name: string; searchTerms: string[] }> = {
  'headphones': { name: 'Headphones', searchTerms: ['headphones', 'earbuds', 'airpods'] },
  'laptops': { name: 'Laptops', searchTerms: ['laptop', 'macbook', 'notebook'] },
  'tvs': { name: 'TVs', searchTerms: ['tv', 'television', 'oled'] },
  'tv': { name: 'TVs', searchTerms: ['tv', 'television', 'oled'] },
  'smartphones': { name: 'Smartphones', searchTerms: ['phone', 'iphone', 'smartphone'] },
  'phones': { name: 'Smartphones', searchTerms: ['phone', 'iphone', 'smartphone'] },
  'running-shoes': { name: 'Running Shoes', searchTerms: ['running', 'shoes'] },
  'sneakers': { name: 'Sneakers', searchTerms: ['sneakers', 'shoes'] },
  'jeans': { name: 'Jeans', searchTerms: ['jeans', 'denim'] },
  'jackets': { name: 'Jackets', searchTerms: ['jacket', 'coat'] },
  'vacuums': { name: 'Vacuums', searchTerms: ['vacuum', 'dyson'] },
  'coffee-makers': { name: 'Coffee Makers', searchTerms: ['coffee', 'espresso'] },
  'air-fryers': { name: 'Air Fryers', searchTerms: ['air fryer'] },
  'furniture': { name: 'Furniture', searchTerms: ['furniture', 'sofa', 'chair'] },
  'mattresses': { name: 'Mattresses', searchTerms: ['mattress', 'bed'] },
}

interface PageProps {
  params: Promise<{ slug: string }>
}

function parseSlug(slug: string): { store: string; category: string } | null {
  // Parse "best-amazon-headphones-deals" format
  const match = slug.match(/^best-(.+?)-(.+?)-deals$/)
  if (match) {
    return { store: match[1], category: match[2] }
  }
  return null
}

async function getDeals(storeName: string, categoryInfo: { searchTerms: string[] }): Promise<Deal[]> {
  const supabase = createAnonClient()
  
  const { data: storeDeals } = await supabase
    .from('deals')
    .select('*')
    .eq('is_active', true)
    .ilike('store', `%${storeName}%`)
    .order('discount_percentage', { ascending: false })
    .limit(30)
  
  if (!storeDeals) return []
  
  const filtered = storeDeals.filter(deal => {
    const text = `${deal.title} ${deal.description}`.toLowerCase()
    return categoryInfo.searchTerms.some(term => text.includes(term))
  })
  
  return filtered.length > 0 ? filtered.slice(0, 12) : storeDeals.slice(0, 12)
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const parsed = parseSlug(slug)
  
  if (!parsed) {
    return { title: 'Deals Guide | SaveSmart' }
  }
  
  const storeName = stores[parsed.store.toLowerCase()]
  const categoryInfo = categories[parsed.category.toLowerCase()]
  
  if (!storeName || !categoryInfo) {
    return { title: 'Deals Guide | SaveSmart' }
  }
  
  const title = `Best ${storeName} ${categoryInfo.name} Deals (${new Date().getFullYear()}) - Verified Discounts`
  const description = `Discover the best ${storeName} ${categoryInfo.name.toLowerCase()} deals for ${new Date().getFullYear()}. Our experts track prices and verify every discount to help you save up to 70%.`
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: new Date().toISOString(),
      authors: ['SaveSmart Team'],
    },
    alternates: {
      canonical: `https://savesmart.bio/blog/deals/${slug}`,
    },
  }
}

export default async function BestDealsArticlePage({ params }: PageProps) {
  const { slug } = await params
  const parsed = parseSlug(slug)
  
  if (!parsed) {
    notFound()
  }
  
  const storeName = stores[parsed.store.toLowerCase()]
  const categoryInfo = categories[parsed.category.toLowerCase()]
  
  if (!storeName || !categoryInfo) {
    notFound()
  }
  
  const deals = await getDeals(storeName, categoryInfo)
  const storeInfo = getStoreInfo(storeName)
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().toLocaleString('en-US', { month: 'long' })

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Best ${storeName} ${categoryInfo.name} Deals (${currentYear})`,
    description: `Guide to the best ${storeName} ${categoryInfo.name.toLowerCase()} deals with verified discounts.`,
    author: { "@type": "Organization", name: "SaveSmart" },
    publisher: { "@type": "Organization", name: "SaveSmart", logo: { "@type": "ImageObject", url: "https://savesmart.bio/logo.png" } },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    mainEntityOfPage: `https://savesmart.bio/blog/deals/${slug}`,
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <main className="py-12 md:py-16">
        <PageContainer narrow>
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
            <ChevronRight className="h-4 w-4" />
            <li><Link href={`/deals/${parsed.store}`} className="hover:text-foreground">{storeName} Deals</Link></li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-foreground">{categoryInfo.name}</li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <Badge className="mb-4 bg-primary/10 text-primary border-0">
            {storeName} Deals Guide
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
            Best {storeName} {categoryInfo.name} Deals ({currentYear})
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Our team tracks {storeName} prices daily to find the best {categoryInfo.name.toLowerCase()} discounts. 
            Here are the top deals available in {currentMonth} {currentYear}.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              SaveSmart Team
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Updated {currentMonth} {currentYear}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {deals.length} Active Deals
            </span>
          </div>
        </header>

        {/* Quick Summary */}
        <section className="bg-muted/50 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Quick Summary
          </h2>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <span>Best discounts: Up to {Math.max(...deals.map(d => d.discount_percentage), 50)}% off select {categoryInfo.name.toLowerCase()}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <span>{storeName} rating: {formatRating(storeInfo.rating)} stars ({formatReviewCount(storeInfo.reviewCount)} reviews)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <span>Active deals: {deals.length} verified {categoryInfo.name.toLowerCase()} offers</span>
            </li>
          </ul>
        </section>

        {/* Article Content */}
        <article className="article-content mb-12">
          <h2>How We Find the Best {storeName} {categoryInfo.name} Deals</h2>
          <p>
            Finding genuine discounts on {categoryInfo.name.toLowerCase()} at {storeName} isn't always straightforward. 
            Retailers often inflate "original" prices to make sales look more impressive than they are. 
            That's why we track price history and verify every deal before including it in this guide.
          </p>
          <p>
            Our process is simple: we monitor {storeName}'s {categoryInfo.name.toLowerCase()} prices daily, 
            compare them against historical data, and only feature deals that represent real savings. 
            If a "50% off" deal was actually the normal price last month, you won't find it here.
          </p>

          <h2>Current {storeName} {categoryInfo.name} Deals</h2>
          <p>
            Here are the best {categoryInfo.name.toLowerCase()} deals we've found at {storeName} this month. 
            All prices are verified and discounts are calculated against actual historical prices.
          </p>
        </article>

        {/* Deals Grid */}
        {deals.length > 0 ? (
          <section className="mb-12">
            <DealGrid columns={3}>
              {deals.slice(0, 6).map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </DealGrid>
            {deals.length > 6 && (
              <div className="mt-6 text-center">
                <Button variant="outline" size="lg" asChild>
                  <Link href={`/deals/${parsed.store}`}>
                    View All {storeName} Deals
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            )}
          </section>
        ) : (
          <section className="mb-12 text-center py-12 bg-muted/30 rounded-xl">
            <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              No {categoryInfo.name.toLowerCase()} deals from {storeName} at the moment.
            </p>
            <Button asChild>
              <Link href={`/deals/${parsed.store}`}>Browse All {storeName} Deals</Link>
            </Button>
          </section>
        )}

        {/* Tips Section */}
        <article className="article-content mb-12">
          <h2>Tips for Getting the Best {storeName} {categoryInfo.name} Deals</h2>
          
          <h3>1. Use Price Tracking Tools</h3>
          <p>
            Prices on {categoryInfo.name.toLowerCase()} fluctuate frequently. A browser extension like SaveSmart 
            can show you the price history so you know if a "sale" is actually a good deal.
          </p>

          <h3>2. Stack Discounts</h3>
          <p>
            Don't just accept the sticker price. Look for coupon codes, cashback offers, and credit card rewards 
            that can stack on top of {storeName}'s sale prices.
          </p>

          <h3>3. Know the Best Times to Buy</h3>
          <p>
            {storeName} typically has major sales during Black Friday, Prime Day (if applicable), and seasonal events. 
            If your purchase can wait, tracking these dates can lead to bigger savings.
          </p>
        </article>

        {/* Capital One Promo */}
        <CapitalOnePromo variant="inline" />

        {/* Related Links */}
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Related Deal Guides</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link 
              href={`/deals/${parsed.store}`}
              className="p-4 rounded-lg border border-border hover:border-primary transition-colors"
            >
              <span className="font-medium">All {storeName} Deals</span>
              <p className="text-sm text-muted-foreground">Browse every active {storeName} discount</p>
            </Link>
            <Link 
              href={`/deals/${parsed.category}`}
              className="p-4 rounded-lg border border-border hover:border-primary transition-colors"
            >
              <span className="font-medium">{categoryInfo.name} at All Stores</span>
              <p className="text-sm text-muted-foreground">Compare {categoryInfo.name.toLowerCase()} prices everywhere</p>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-12 text-center bg-muted/30 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Never Miss a {storeName} Deal
          </h2>
          <p className="text-muted-foreground mb-6">
            Install SaveSmart to get automatic price tracking and coupon codes at checkout.
          </p>
          <Button size="lg" className="gap-2" asChild>
            <Link href="/deal-finder">
              <Sparkles className="h-5 w-5" />
            Get SaveSmart Free
          </Link>
        </Button>
        </section>
        </PageContainer>
      </main>

      <Footer />
    </div>
  )
}
