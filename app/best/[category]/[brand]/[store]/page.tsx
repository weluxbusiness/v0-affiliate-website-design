import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CapitalOnePromo } from "@/components/capital-one-promo"
import { PageContainer, DealGrid, SectionHeading } from "@/components/layout/page-container"
import { getBestDealsForCategoryBrandStore } from "@/lib/deals"
import { getProductImageUrl } from "@/lib/deal-types"
import { SeoContentBlock } from "@/components/seo-content-block"
import { getCategorySlugs, getBrandSlugs, getStoreSlugs } from "@/lib/seo-data"
import { 
  formatCategoryName, 
  formatBrandName,
  generateBestCategoryBrandStoreIntroContent 
} from "@/lib/seo/content"
import { 
  Award,
  Clock,
  Star,
  TrendingUp,
  CheckCircle,
  Store,
  ArrowRight
} from "lucide-react"

interface PageProps {
  params: Promise<{ category: string; brand: string; store: string }>
}

export const revalidate = 3600

// Minimum deals required for this page
const MIN_DEALS_REQUIRED = 5

export async function generateStaticParams() {
  const categories = await getCategorySlugs()
  const brands = await getBrandSlugs()
  const stores = await getStoreSlugs()
  
  // Generate combinations (limit to avoid too many pages)
  const params: { category: string; brand: string; store: string }[] = []
  for (const category of categories.slice(0, 10)) {
    for (const brand of brands.slice(0, 8)) {
      for (const store of stores.slice(0, 5)) {
        params.push({ category, brand, store })
      }
    }
  }
  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const category = resolvedParams?.category || ''
  const brand = resolvedParams?.brand || ''
  const store = resolvedParams?.store || ''
  
  const categoryName = formatCategoryName(category)
  const brandName = formatBrandName(brand)
  const storeName = formatBrandName(store)
  const currentYear = new Date().getFullYear()
  
  return {
    title: `Best ${brandName} ${categoryName} Deals at ${storeName} ${currentYear} | SaveSmart`,
    description: `Find the best ${brandName} ${categoryName.toLowerCase()} deals at ${storeName} in ${currentYear}. Compare prices and save up to 70%.`,
    openGraph: {
      title: `Best ${brandName} ${categoryName} Deals at ${storeName} ${currentYear}`,
      description: `Compare the best ${brandName} ${categoryName.toLowerCase()} deals at ${storeName}.`,
      type: 'website',
      url: `https://savesmart.bio/best/${category}/${brand}/${store}`,
    },
    alternates: {
      canonical: `/best/${category}/${brand}/${store}`,
    },
  }
}

export default async function BestCategoryBrandStorePage({ params }: PageProps) {
  const resolvedParams = await params
  const category = resolvedParams?.category
  const brand = resolvedParams?.brand
  const store = resolvedParams?.store
  
  if (!category || !brand || !store) {
    notFound()
  }
  
  const categorySlug = category.toLowerCase()
  const brandSlug = brand.toLowerCase()
  const storeSlug = store.toLowerCase()
  const categoryName = formatCategoryName(categorySlug)
  const brandName = formatBrandName(brandSlug)
  const storeName = formatBrandName(storeSlug)
  
  // Fetch best deals for this combination
  const deals = await getBestDealsForCategoryBrandStore(categorySlug, brandSlug, storeSlug, 20)
  
  // Return 404 if fewer than minimum required deals
  if (!deals || deals.length < MIN_DEALS_REQUIRED) {
    notFound()
  }
  
  const topDeals = deals.slice(0, 5)
  const moreDeals = deals.slice(5)
  
  const currentYear = new Date().getFullYear()
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  
  // Get other stores for internal linking
  const stores = await getStoreSlugs()
  const otherStores = stores.filter(s => s !== storeSlug).slice(0, 6)
  
  // Generate intro content
  const introContent = generateBestCategoryBrandStoreIntroContent(categoryName, brandName, storeName)
  
  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Does ${storeName} have good deals on ${brandName} ${categoryName.toLowerCase()}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, ${storeName} regularly offers competitive prices on ${brandName} ${categoryName.toLowerCase()}. We track ${storeName}'s prices daily to find the best discounts.`,
        },
      },
      {
        "@type": "Question",
        name: `When does ${storeName} have sales on ${brandName} ${categoryName.toLowerCase()}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${storeName} typically offers the best ${brandName} ${categoryName.toLowerCase()} deals during Black Friday, Prime Day, and holiday sales. We track all sales events.`,
        },
      },
      {
        "@type": "Question",
        name: `Is ${storeName} an authorized ${brandName} retailer?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${storeName} is an authorized retailer for ${brandName} products, ensuring you receive genuine ${brandName} ${categoryName.toLowerCase()} with full warranty coverage.`,
        },
      },
    ],
  }
  
  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://savesmart.bio" },
      { "@type": "ListItem", position: 2, name: "Best Deals", item: "https://savesmart.bio/best" },
      { "@type": "ListItem", position: 3, name: `Best ${categoryName}`, item: `https://savesmart.bio/best/${categorySlug}` },
      { "@type": "ListItem", position: 4, name: `Best ${brandName} ${categoryName}`, item: `https://savesmart.bio/best/${categorySlug}/${brandSlug}` },
      { "@type": "ListItem", position: 5, name: `at ${storeName}`, item: `https://savesmart.bio/best/${categorySlug}/${brandSlug}/${storeSlug}` },
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="pt-16">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-amber-500 to-orange-600 text-white py-14 md:py-16 overflow-hidden">
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
                href={`/best/${categorySlug}`}
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                Best {categoryName}
              </Link>
              <span className="text-white/50">/</span>
              <Link 
                href={`/best/${categorySlug}/${brandSlug}`}
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                {brandName}
              </Link>
              <span className="text-white/50">/</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
                {storeName}
              </span>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Award className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium uppercase tracking-wider text-white/90">Best Deals</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
              Best {brandName} {categoryName} Deals at {storeName}
            </h1>
            
            <p className="text-lg text-white/90 max-w-2xl mb-6">
              Find the best {brandName} {categoryName.toLowerCase()} deals at {storeName}. Save up to {Math.max(...deals.map(d => d.discount_percentage), 0)}% with verified discounts.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Badge className="bg-white/20 text-white border-0 text-sm">
                <Star className="h-3.5 w-3.5 mr-1 fill-current" />
                {deals.length} Best Deals
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

        {/* SEO Intro Content */}
        <section className="py-8 border-b border-border">
          <PageContainer>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              {introContent.split('\n\n').map((paragraph, i) => (
                <p key={i} className="mb-4 last:mb-0">{paragraph}</p>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Top Deals */}
        <section className="py-10 md:py-12">
          <PageContainer>
            <SectionHeading>
              <Award className="h-6 w-6 text-amber-500 inline mr-2" />
              Top {brandName} {categoryName} Deals at {storeName}
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
                      <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                        {deal.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">
                          ${deal.deal_price}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          ${deal.original_price}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </DealGrid>
          </PageContainer>
        </section>

        {/* More Deals */}
        {moreDeals.length > 0 && (
          <section className="py-10 md:py-12 bg-muted/30">
            <PageContainer>
              <SectionHeading>More {brandName} {categoryName} Deals at {storeName}</SectionHeading>
              <DealGrid columns={4}>
                {moreDeals.map((deal) => (
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
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-secondary text-secondary-foreground text-xs">
                            {deal.discount_percentage}% OFF
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <p className="text-xs text-muted-foreground mb-1">{deal.store}</p>
                        <h3 className="font-medium text-sm text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                          {deal.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-primary">${deal.deal_price}</span>
                          <span className="text-xs text-muted-foreground line-through">${deal.original_price}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </DealGrid>
            </PageContainer>
          </section>
        )}

        {/* Shop at Other Stores */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <SectionHeading>
              <Store className="h-5 w-5 inline mr-2" />
              Shop {brandName} {categoryName} at Other Stores
            </SectionHeading>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {otherStores.map((otherStore) => (
                <Link
                  key={otherStore}
                  href={`/best/${categorySlug}/${brandSlug}/${otherStore}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground truncate">
                    {formatBrandName(otherStore)}
                  </span>
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Related Links */}
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <SeoContentBlock
              title={`Best ${brandName} ${categoryName} Deals at ${storeName}`}
              content={`Find more ${brandName} deals at ${storeName} and other retailers. Compare prices across multiple stores to ensure you're getting the best value on ${brandName} products.`}
              relatedLinks={[
                { label: `Best ${brandName} ${categoryName}`, href: `/best/${categorySlug}/${brandSlug}` },
                { label: `Best ${categoryName}`, href: `/best/${categorySlug}` },
                { label: `${storeName} Deals`, href: `/stores/${storeSlug}` },
                { label: `${brandName} Deals`, href: `/brands/${brandSlug}` },
              ]}
            />
          </PageContainer>
        </section>
      </main>

      <Footer />
    </div>
  )
}
