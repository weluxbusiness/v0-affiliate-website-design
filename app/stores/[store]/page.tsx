import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CapitalOnePromo } from "@/components/capital-one-promo"
import { PageContainer } from "@/components/layout/page-container"
import { getDealsByStore } from "@/lib/deals"
import { getStoreInfo, getProductImageUrl, formatStoreName, storeToSlug } from "@/lib/deal-types"
import { 
  SeoContentBlock, 
  generateStoreSeoContent, 
  getStoreRelatedLinks 
} from "@/components/seo-content-block"
import { CrossLinkSection } from "@/components/internal-links"
import { FAQSection, storeFAQs, generateFAQSchema } from "@/components/seo/faq-section"
import { TrustBadges, UpdatedTodayBadge } from "@/components/seo/trust-badges"
import { getStoreBySlug, getStoreSlugs, getCategoriesForStore, getBrandSlugs } from "@/lib/seo-data"
import { Store, Tag, ChevronRight, Clock } from "lucide-react"

interface PageProps {
  params: Promise<{ store: string }>
}

// Fallback store list for SSG when DB is empty
const FALLBACK_STORES = [
  'amazon', 'best-buy', 'nike', 'target', 'apple', 'dyson',
  'adidas', 'levis', 'walmart', 'costco', 'macys', 'nordstrom',
  'home-depot', 'lowes', 'wayfair', 'ikea', 'sephora', 'ulta'
]

// Dynamic params from database with fallback
export async function generateStaticParams() {
  const storeSlugs = await getStoreSlugs()
  const slugs = storeSlugs.length > 0 ? storeSlugs : FALLBACK_STORES
  return slugs.map(store => ({ store }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { store } = await params
  const storeName = formatStoreName(store)
  
  return {
    title: `${storeName} Deals & Coupons | SaveSmart`,
    description: `Find the latest deals and discounts from ${storeName}. Save money with verified coupons and exclusive offers.`,
    openGraph: {
      title: `${storeName} Deals & Coupons | SaveSmart`,
      description: `Find the latest deals and discounts from ${storeName}. Save money with verified coupons and exclusive offers.`,
      type: 'website',
      url: `https://savesmart.bio/stores/${store}`,
    },
    alternates: {
      canonical: `/stores/${store}`,
    },
  }
}

export const revalidate = 3600

export default async function StorePage({ params }: PageProps) {
  const { store } = await params
  
  // Fetch store data from Supabase
  const storeData = await getStoreBySlug(store)
  const storeName = storeData?.name || formatStoreName(store)
  
  // Fetch deals from deals table
  const deals = await getDealsByStore(store, 50)
  
  // Get categories available for this store for internal linking
  const storeCategories = await getCategoriesForStore(store, 10)
  
  // Get related stores for cross-linking
  const relatedStores = FALLBACK_STORES.filter(s => s !== store).slice(0, 8)
  
  // Get popular brands for internal linking
  const popularBrands = (await getBrandSlugs()).slice(0, 8)
  
  if (deals.length === 0) {
    notFound()
  }

  const storeInfo = storeData ? {
    rating: storeData.rating,
    reviewCount: storeData.review_count,
    color: storeData.color || 'from-blue-600 to-blue-700',
  } : getStoreInfo(storeName)
  
  const featuredDeals = deals.slice(0, 6)
  const remainingDeals = deals.slice(6)

  // Generate timestamp for "Last Updated"
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  // Structured data for SEO - CollectionPage with ItemList
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${storeName} Deals`,
    url: `https://savesmart.bio/stores/${store}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: deals.length,
    },
  }

  // FAQ schema for rich snippets
  const faqs = storeFAQs(storeName)
  const faqSchema = generateFAQSchema(faqs)

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
        <section className={`relative bg-gradient-to-br ${storeInfo.color} text-white py-14 md:py-16 overflow-hidden`}>
          <PageContainer>
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
                {storeName}
              </span>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Store className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium uppercase tracking-wider text-white/90">Store</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
              {storeName} Deals
            </h1>
            
            <p className="text-lg text-white/90 max-w-2xl mb-6">
              Find the latest deals and discounts from {storeName}. Save money with verified coupons and exclusive offers.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Badge className="bg-white/20 text-white border-0 text-sm">
                {deals.length} Active Deals
              </Badge>
              <span className="flex items-center gap-1.5 text-sm text-white/70">
                <Clock className="h-4 w-4" />
                Last updated: {lastUpdated}
              </span>
            </div>
            
            {/* Trust Badges */}
            <div className="mt-6">
              <TrustBadges variant="inline" className="text-white/80" />
            </div>
          </PageContainer>
        </section>

        {/* Capital One Promo */}
        <section className="py-8">
          <PageContainer>
            <CapitalOnePromo variant="inline" />
          </PageContainer>
        </section>

        {/* Popular Categories at Store - Links to /stores/{store}/{category} */}
        {storeCategories.length > 0 && (
          <section className="py-10 md:py-12 border-b border-border">
            <PageContainer>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Popular Categories at {storeName}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {storeCategories.map((categorySlug) => {
                  // Format slug to display name (e.g., "home-kitchen" -> "Home Kitchen")
                  const displayName = categorySlug
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')
                  return (
                    <Link
                      key={categorySlug}
                      href={`/stores/${store}/${categorySlug}`}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
                    >
                      {displayName}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  )
                })}
              </div>
            </PageContainer>
          </section>
        )}

        {/* Featured Deals */}
        {featuredDeals.length > 0 && (
          <section className="py-10 md:py-12">
            <PageContainer>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Top {storeName} Deals
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredDeals.map((deal) => (
                  <Link 
                    key={deal.id} 
                    href={`/deal/${deal.slug || deal.id}`}
                    className="group"
                  >
                    <Card className="overflow-hidden border-border/50 transition-all hover:shadow-lg h-full">
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
                        <p className="text-xs text-muted-foreground mb-1">{deal.category}</p>
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
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </PageContainer>
          </section>
        )}

        {/* All Deals */}
        {remainingDeals.length > 0 && (
          <section className="bg-muted/30 py-10 md:py-12">
            <PageContainer>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                All {storeName} Deals
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {remainingDeals.map((deal) => (
                  <Link 
                    key={deal.id} 
                    href={`/deal/${deal.slug || deal.id}`}
                    className="group"
                  >
                    <Card className="overflow-hidden border-border/50 transition-all hover:shadow-md h-full">
                      <div className="relative aspect-square bg-muted">
                        <Image
                          src={getProductImageUrl(deal)}
                          alt={deal.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-secondary text-secondary-foreground text-xs">
                            {deal.discount_percentage}% OFF
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <p className="text-xs text-muted-foreground mb-1">{deal.category}</p>
                        <h3 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                          {deal.title}
                        </h3>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="font-bold text-secondary">
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
            </PageContainer>
          </section>
        )}

        {/* Popular Brands at Store */}
        {popularBrands.length > 0 && (
          <section className="py-10 md:py-12 border-t border-border">
            <PageContainer>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Popular Brands at {storeName}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {popularBrands.map((brandSlug) => {
                  const displayName = brandSlug
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')
                  return (
                    <Link
                      key={brandSlug}
                      href={`/brands/${brandSlug}`}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors"
                    >
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      {displayName}
                    </Link>
                  )
                })}
              </div>
            </PageContainer>
          </section>
        )}

        {/* SEO Content Block */}
        <SeoContentBlock
          title={`About ${storeName} Deals`}
          content={generateStoreSeoContent(storeName)}
          relatedLinks={[
            { label: `${storeName} Coupons`, href: `/coupons/${store}` },
            ...getStoreRelatedLinks(store, storeName),
          ]}
        />

        {/* Cross Link Section - Internal Linking for SEO */}
        <CrossLinkSection
          storeName={storeName}
          storeSlug={store}
          relatedStores={relatedStores}
          relatedCategories={storeCategories}
        />

        {/* FAQ Section for SEO */}
        <FAQSection
          title={`${storeName} Deals FAQ`}
          faqs={faqs}
          className="border-t border-border bg-muted/30"
        />
      </main>

      <Footer />
    </div>
  )
}
