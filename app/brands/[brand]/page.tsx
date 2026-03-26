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
import { PopularCategories } from "@/components/popular-categories"
import { PageContainer, DealGrid, SectionHeading } from "@/components/layout/page-container"
import { getDealsByBrand } from "@/lib/deals"
import { SeoContentBlock } from "@/components/seo-content-block"
import { getBrandBySlug, getBrandSlugs, getStoreSlugs, getCategorySlugs } from "@/lib/seo-data"
import { generateBrandMetadata } from "@/lib/seo/metadata"
import { 
  generateBrandSchema, 
  generateBrandFAQSchema,
  generateBreadcrumbSchema 
} from "@/lib/seo/structured-data"
import { generateBrandIntroContent, formatBrandName } from "@/lib/seo/content"
import { 
  Tag,
  Sparkles,
  Clock,
  Store,
  ArrowRight,
  Award
} from "lucide-react"

// Revalidate pages every hour
export const revalidate = 3600

// Popular brands for static generation - expanded for SEO coverage
const POPULAR_BRANDS = [
  // Tech Giants
  "apple", "samsung", "google", "microsoft", "amazon", "sony", "lg",
  // Computer Brands
  "dell", "hp", "lenovo", "asus", "acer", "msi", "razer",
  // Audio Brands
  "bose", "beats", "sony", "sennheiser", "jbl", "sonos", "bang-olufsen", "skullcandy",
  // Gaming Brands
  "nintendo", "playstation", "xbox", "razer", "logitech", "steelseries", "corsair", "hyperx",
  // Camera Brands
  "canon", "nikon", "sony", "gopro", "dji", "fujifilm", "panasonic",
  // Fitness & Wearables
  "fitbit", "garmin", "whoop", "oura", "polar", "suunto",
  // Home & Kitchen
  "dyson", "kitchenaid", "cuisinart", "ninja", "instant-pot", "keurig", "nespresso",
  "shark", "roomba", "vitamix", "breville", "oxo", "le-creuset",
  // Streaming & Smart Home
  "roku", "amazon", "google", "apple", "ring", "nest", "ecobee", "philips-hue",
  // Fashion - Athletic
  "nike", "adidas", "under-armour", "new-balance", "puma", "reebok", "asics", "brooks",
  // Fashion - Casual
  "converse", "vans", "jordan", "yeezy", "crocs", "birkenstock", "allbirds",
  // Fashion - Outdoor
  "north-face", "columbia", "patagonia", "arcteryx", "rei", "marmot",
  // Fashion - Denim & Basics
  "levis", "gap", "old-navy", "uniqlo", "h-m", "zara",
  // Eyewear
  "ray-ban", "oakley", "costa", "maui-jim", "warby-parker",
  // Personal Care
  "philips", "braun", "oral-b", "dyson", "theragun", "hyperice",
  // Luxury
  "apple", "bose", "bang-olufsen", "marshall", "bowers-wilkins"
]

interface PageProps {
  params: Promise<{ brand: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brand } = await params
  const brandSlug = brand.toLowerCase()
  
  // Check if brand exists in DB
  const dbBrand = await getBrandBySlug(brandSlug)
  const brandName = dbBrand?.name || formatBrandName(brandSlug)
  
  // Use custom meta if available, otherwise generate
  if (dbBrand?.meta_title && dbBrand?.meta_description) {
    return {
      title: dbBrand.meta_title,
      description: dbBrand.meta_description,
      alternates: {
        canonical: `/brands/${brandSlug}`,
      },
    }
  }
  
  return generateBrandMetadata(brandSlug, brandName)
}

// Generate static params for popular brands
export async function generateStaticParams() {
  const dbBrands = await getBrandSlugs()
  const brands = dbBrands.length > 0 ? dbBrands : POPULAR_BRANDS
  return brands.map(brand => ({ brand }))
}

export default async function BrandPage({ params }: PageProps) {
  const { brand } = await params
  const brandSlug = brand.toLowerCase()
  
  // Get brand data from DB (optional - will fallback to generated data)
  const dbBrand = await getBrandBySlug(brandSlug)
  const brandName = dbBrand?.name || formatBrandName(brandSlug)
  
  // Fetch deals for this brand
  const deals = await getDealsByBrand(brandSlug.replace(/-/g, " "), 50)
  
  // If no deals found and brand not in DB, 404
  if (deals.length === 0 && !dbBrand && !POPULAR_BRANDS.includes(brandSlug)) {
    notFound()
  }
  
  const featuredDeals = deals.slice(0, 3)
  const regularDeals = deals.slice(3)
  
  // Get related stores and categories for internal linking
  const relatedStores = (await getStoreSlugs()).slice(0, 8)
  const relatedCategories = (await getCategorySlugs()).slice(0, 8)
  
  // Generate timestamp for "Last Updated"
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
  
  // Structured data for SEO
  const brandSchema = generateBrandSchema(
    brandName,
    brandSlug,
    deals.length,
    dbBrand?.description || undefined
  )
  const faqSchema = generateBrandFAQSchema(brandName, deals.length)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Brands", url: "/brands" },
    { name: brandName, url: `/brands/${brandSlug}` },
  ])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(brandSchema) }}
      />
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
        <section className="relative bg-gradient-to-br from-slate-800 to-slate-900 text-white py-14 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,white)]" />
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
                href="/brands" 
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                Brands
              </Link>
              <span className="text-white/50">/</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
                {brandName}
              </span>
            </nav>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <Tag className="h-6 w-6" />
              </div>
              <span className="text-white/70 uppercase tracking-wider text-sm font-medium">Brand</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              {brandName} Deals
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mb-4">
              Find the best deals on {brandName} products from top retailers. Compare prices and save.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {deals.length} Active Deals
              </Badge>
              <span className="flex items-center gap-1.5 text-sm text-white/70">
                <Clock className="h-4 w-4" />
                Last updated: {lastUpdated}
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
              <SectionHeading>Top {brandName} Deals</SectionHeading>
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
            <SectionHeading>All {brandName} Deals</SectionHeading>
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
                  <p className="text-muted-foreground mb-4">Check back soon for new {brandName} deals!</p>
                  <Button variant="outline" asChild>
                    <Link href="/deals">Browse All Deals</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : null}
          </PageContainer>
        </section>

        {/* Best Brand Deals CTA - Links to /best/category/brand pages */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <div className="p-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Award className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">Best {brandName} Deals</h2>
                  <p className="text-white/90">Shop the best {brandName} deals by category</p>
                </div>
              </div>
              <div className="grid gap-2 grid-cols-2 sm:grid-cols-4">
                {relatedCategories.slice(0, 4).map((catSlug) => (
                  <Link
                    key={catSlug}
                    href={`/best/${catSlug}/${brandSlug}`}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    <span className="text-sm font-medium truncate">
                      Best {formatBrandName(catSlug)}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </PageContainer>
        </section>

        {/* Shop by Store - Internal Links */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <h2 className="text-xl font-bold text-foreground mb-6">
              Shop {brandName} at Top Stores
            </h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
              {relatedStores.map((storeSlug) => (
                <Link
                  key={storeSlug}
                  href={`/stores/${storeSlug}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground truncate">
                    {formatBrandName(storeSlug)}
                  </span>
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Popular Categories for Brand - Internal Links to /deals/{category}/{brand} */}
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <h2 className="text-xl font-bold text-foreground mb-6">
              Popular Categories for {brandName}
            </h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
              {relatedCategories.map((catSlug) => (
                <Link
                  key={catSlug}
                  href={`/deals/${catSlug}/${brandSlug}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground truncate">
                    {formatBrandName(catSlug)}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Top Stores for Brand - Internal Links */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <h2 className="text-xl font-bold text-foreground mb-6">
              Top Stores for {brandName}
            </h2>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
              {relatedStores.map((storeSlug) => (
                <Link
                  key={storeSlug}
                  href={`/stores/${storeSlug}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground truncate">
                    {formatBrandName(storeSlug)}
                  </span>
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* SEO Content Block */}
        <SeoContentBlock
          title={`About ${brandName} Deals`}
          content={generateBrandIntroContent(brandName)}
          relatedLinks={[
            ...relatedStores.slice(0, 3).map(s => ({
              label: `${formatBrandName(s)} Deals`,
              href: `/stores/${s}`,
            })),
            ...relatedCategories.slice(0, 2).map(c => ({
              label: `${formatBrandName(c)} Deals`,
              href: `/deals/${c}`,
            })),
          ]}
        />

        <PopularCategories />

        {/* CTA */}
        <section className="py-10 md:py-12 text-center border-t border-border">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground mb-2">Looking for a specific {brandName} product?</h2>
            <p className="text-muted-foreground mb-6">Our AI can help you find exactly what you need at the best price.</p>
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
