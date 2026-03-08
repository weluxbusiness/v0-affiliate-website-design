import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CapitalOnePromo } from "@/components/capital-one-promo"
import { PageContainer } from "@/components/layout/page-container"
import { getDealsByStorePaginated, DEALS_PER_PAGE } from "@/lib/deals"
import { Pagination } from "@/components/pagination"
import { getStoreInfo, getProductImageUrl, formatStoreName } from "@/lib/deal-types"
import { getStoreSlugs } from "@/lib/seo-data"
import { Store, Clock } from "lucide-react"

export const revalidate = 3600

const FALLBACK_STORES = [
  'amazon', 'best-buy', 'nike', 'target', 'apple', 'dyson',
  'adidas', 'levis', 'walmart', 'costco', 'macys', 'nordstrom'
]

interface PageProps {
  params: Promise<{ store: string; page: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { store, page } = await params
  const pageNum = parseInt(page, 10)
  const storeName = formatStoreName(store)
  
  return {
    title: `${storeName} Deals - Page ${pageNum} | SaveSmart`,
    description: `Browse ${storeName} deals and discounts. Page ${pageNum} of our collection.`,
    alternates: {
      canonical: `/stores/${store}/page/${pageNum}`,
    },
    robots: {
      index: pageNum <= 10,
      follow: true,
    },
  }
}

export async function generateStaticParams() {
  const storeSlugs = await getStoreSlugs()
  const stores = storeSlugs.length > 0 ? storeSlugs : FALLBACK_STORES
  
  const params: { store: string; page: string }[] = []
  for (const store of stores.slice(0, 10)) {
    for (let page = 2; page <= 5; page++) {
      params.push({ store, page: String(page) })
    }
  }
  return params
}

export default async function StorePaginatedPage({ params }: PageProps) {
  const { store, page } = await params
  const pageNum = parseInt(page, 10)
  
  if (pageNum === 1) {
    redirect(`/stores/${store}`)
  }
  
  if (isNaN(pageNum) || pageNum < 1) {
    notFound()
  }
  
  const storeName = formatStoreName(store)
  
  const { deals, totalCount, totalPages, hasNextPage, hasPrevPage } = 
    await getDealsByStorePaginated(store, pageNum)
  
  // Redirect to main page if this page shouldn't exist
  // Page 2+ only valid if there are enough deals to fill page 1
  if (totalPages <= 1 || pageNum > totalPages) {
    redirect(`/stores/${store}`)
  }
  
  // Calculate correct range for display
  const startItem = (pageNum - 1) * DEALS_PER_PAGE + 1
  const endItem = Math.min(pageNum * DEALS_PER_PAGE, totalCount)
  
  const storeInfo = getStoreInfo(storeName)
  
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
    name: `${storeName} Deals - Page ${pageNum}`,
    url: `https://savesmart.bio/stores/${store}/page/${pageNum}`,
    isPartOf: {
      "@type": "CollectionPage",
      name: `${storeName} Deals`,
      url: `https://savesmart.bio/stores/${store}`,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: deals.length,
    },
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {hasPrevPage && (
        <link 
          rel="prev" 
          href={pageNum === 2 ? `/stores/${store}` : `/stores/${store}/page/${pageNum - 1}`} 
        />
      )}
      {hasNextPage && (
        <link rel="next" href={`/stores/${store}/page/${pageNum + 1}`} />
      )}
      
      <main className="pt-16">
        {/* Hero */}
        <section className={`relative bg-gradient-to-br ${storeInfo.color} text-white py-12 md:py-14 overflow-hidden`}>
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
              <Link 
                href={`/stores/${store}`}
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                {storeName}
              </Link>
              <span className="text-white/50">/</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
                Page {pageNum}
              </span>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Store className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium uppercase tracking-wider text-white/90">Store</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {storeName} Deals - Page {pageNum}
            </h1>
            
            <p className="text-lg text-white/90 max-w-2xl mb-4">
              Showing {startItem} - {endItem} of {totalCount} deals
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Badge className="bg-white/20 text-white border-0 text-sm">
                Page {pageNum} of {totalPages}
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

        {/* Deals Grid */}
        <section className="py-10 md:py-12">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {storeName} Deals
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {deals.map((deal) => (
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
            
            {/* Pagination */}
            <Pagination 
              currentPage={pageNum} 
              totalPages={totalPages} 
              baseUrl={`/stores/${store}`} 
            />
          </PageContainer>
        </section>
      </main>

      <Footer />
    </div>
  )
}
