import Link from "next/link"
import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DealCard } from "@/components/deal-card"
import { Badge } from "@/components/ui/badge"
import { CapitalOnePromo } from "@/components/capital-one-promo"
import { PageContainer, DealGrid, SectionHeading } from "@/components/layout/page-container"
import { getDealsByBrandPaginated, DEALS_PER_PAGE } from "@/lib/deals"
import { Pagination } from "@/components/pagination"
import { getBrandSlugs } from "@/lib/seo-data"
import { formatBrandName } from "@/lib/seo/content"
import { Tag, Clock } from "lucide-react"

export const revalidate = 3600

const POPULAR_BRANDS = [
  "apple", "samsung", "nike", "adidas", "sony", "lg", "dell", "hp",
  "lenovo", "bose", "beats", "microsoft", "nintendo", "dyson"
]

interface PageProps {
  params: Promise<{ brand: string; page: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brand, page } = await params
  const pageNum = parseInt(page, 10)
  const brandName = formatBrandName(brand)
  
  return {
    title: `${brandName} Deals - Page ${pageNum} | SaveSmart`,
    description: `Browse ${brandName} deals and discounts. Page ${pageNum} of our collection.`,
    alternates: {
      canonical: `/brands/${brand}/page/${pageNum}`,
    },
    robots: {
      index: pageNum <= 10,
      follow: true,
    },
  }
}

export async function generateStaticParams() {
  const brandSlugs = await getBrandSlugs()
  const brands = brandSlugs.length > 0 ? brandSlugs : POPULAR_BRANDS
  
  const params: { brand: string; page: string }[] = []
  for (const brand of brands.slice(0, 10)) {
    for (let page = 2; page <= 5; page++) {
      params.push({ brand, page: String(page) })
    }
  }
  return params
}

export default async function BrandPaginatedPage({ params }: PageProps) {
  const { brand, page } = await params
  const pageNum = parseInt(page, 10)
  
  if (pageNum === 1) {
    redirect(`/brands/${brand}`)
  }
  
  if (isNaN(pageNum) || pageNum < 1) {
    notFound()
  }
  
  const brandName = formatBrandName(brand)
  
  const { deals, totalCount, totalPages, hasNextPage, hasPrevPage } = 
    await getDealsByBrandPaginated(brand.replace(/-/g, " "), pageNum)
  
  // Redirect to main page if this page shouldn't exist
  // Page 2+ only valid if there are enough deals to fill page 1
  if (totalPages <= 1 || pageNum > totalPages) {
    redirect(`/brands/${brand}`)
  }
  
  // Calculate correct range for display
  const startItem = (pageNum - 1) * DEALS_PER_PAGE + 1
  const endItem = Math.min(pageNum * DEALS_PER_PAGE, totalCount)
  
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
    name: `${brandName} Deals - Page ${pageNum}`,
    url: `https://savesmart.bio/brands/${brand}/page/${pageNum}`,
    isPartOf: {
      "@type": "CollectionPage",
      name: `${brandName} Deals`,
      url: `https://savesmart.bio/brands/${brand}`,
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
          href={pageNum === 2 ? `/brands/${brand}` : `/brands/${brand}/page/${pageNum - 1}`} 
        />
      )}
      {hasNextPage && (
        <link rel="next" href={`/brands/${brand}/page/${pageNum + 1}`} />
      )}
      
      <main className="pt-16">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-slate-800 to-slate-900 text-white py-12 md:py-14 overflow-hidden">
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
              <Link 
                href={`/brands/${brand}`}
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                {brandName}
              </Link>
              <span className="text-white/50">/</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
                Page {pageNum}
              </span>
            </nav>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <Tag className="h-6 w-6" />
              </div>
              <span className="text-white/70 uppercase tracking-wider text-sm font-medium">Brand</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              {brandName} Deals - Page {pageNum}
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mb-4">
              Showing {startItem} - {endItem} of {totalCount} deals
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
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
            <SectionHeading>{brandName} Deals</SectionHeading>
            <DealGrid columns={4}>
              {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </DealGrid>
            
            {/* Pagination */}
            <Pagination 
              currentPage={pageNum} 
              totalPages={totalPages} 
              baseUrl={`/brands/${brand}`} 
            />
          </PageContainer>
        </section>
      </main>

      <Footer />
    </div>
  )
}
