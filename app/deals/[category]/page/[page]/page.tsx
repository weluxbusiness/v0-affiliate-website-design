import Link from "next/link"
import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DealCard } from "@/components/deal-card"
import { Badge } from "@/components/ui/badge"
import { CapitalOnePromo } from "@/components/capital-one-promo"
import { PageContainer, DealGrid, SectionHeading } from "@/components/layout/page-container"
import { getDealsByCategoryPaginated, DEALS_PER_PAGE } from "@/lib/deals"
import { Pagination } from "@/components/pagination"
import { getCategorySlugs } from "@/lib/seo-data"
import { 
  Tag,
  Headphones,
  Shirt,
  Home,
  Laptop,
  ShoppingBag,
  Clock
} from "lucide-react"

export const revalidate = 3600

// Product categories with names and icons
const productCategories: Record<string, { name: string; icon: typeof Headphones }> = {
  'headphones': { name: 'Headphones', icon: Headphones },
  'running-shoes': { name: 'Running Shoes', icon: ShoppingBag },
  'laptops': { name: 'Laptops', icon: Laptop },
  'tvs': { name: 'TVs', icon: Laptop },
  'smartphones': { name: 'Smartphones', icon: Laptop },
  'smartwatches': { name: 'Smartwatches', icon: Laptop },
  'jeans': { name: 'Jeans', icon: Shirt },
  'jackets': { name: 'Jackets', icon: Shirt },
  'sneakers': { name: 'Sneakers', icon: ShoppingBag },
  'coffee-makers': { name: 'Coffee Makers', icon: Home },
  'air-fryers': { name: 'Air Fryers', icon: Home },
  'vacuums': { name: 'Vacuums', icon: Home },
  'blenders': { name: 'Blenders', icon: Home },
  'sunglasses': { name: 'Sunglasses', icon: Shirt },
  'kitchen': { name: 'Kitchen', icon: Home },
  'electronics': { name: 'Electronics', icon: Laptop },
  'fashion': { name: 'Fashion', icon: Shirt },
  'home-kitchen': { name: 'Home & Kitchen', icon: Home },
}

interface PageProps {
  params: Promise<{ category: string; page: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, page } = await params
  const pageNum = parseInt(page, 10)
  const categorySlug = category.toLowerCase()
  const categoryInfo = productCategories[categorySlug]
  const categoryName = categoryInfo?.name || categorySlug.replace(/-/g, ' ')
  
  return {
    title: `${categoryName} Deals - Page ${pageNum} | SaveSmart`,
    description: `Browse ${categoryName.toLowerCase()} deals and discounts. Page ${pageNum} of our collection.`,
    alternates: {
      canonical: `/deals/${categorySlug}/page/${pageNum}`,
    },
    robots: {
      index: pageNum <= 5, // Only index first 5 pages (crawl budget optimization)
      follow: true, // Always follow for internal link equity
    },
  }
}

export async function generateStaticParams() {
  const categorySlugs = await getCategorySlugs()
  const fallbackCategories = Object.keys(productCategories)
  const categories = categorySlugs.length > 0 ? categorySlugs : fallbackCategories
  
  // Generate first 5 pages for each category
  const params: { category: string; page: string }[] = []
  for (const category of categories.slice(0, 10)) {
    for (let page = 2; page <= 5; page++) {
      params.push({ category, page: String(page) })
    }
  }
  return params
}

export default async function CategoryPaginatedPage({ params }: PageProps) {
  const { category, page } = await params
  const pageNum = parseInt(page, 10)
  const categorySlug = category.toLowerCase()
  
  // Redirect page 1 to main category page (canonical)
  if (pageNum === 1) {
    redirect(`/deals/${categorySlug}`)
  }
  
  // Validate page number
  if (isNaN(pageNum) || pageNum < 1) {
    notFound()
  }
  
  const categoryInfo = productCategories[categorySlug]
  const categoryName = categoryInfo?.name || categorySlug.replace(/-/g, ' ')
  
  // Get paginated deals
  const { deals, totalCount, totalPages, hasNextPage, hasPrevPage } = 
    await getDealsByCategoryPaginated(categoryName, pageNum)
  
  // Redirect to main page if this page shouldn't exist
  // Page 2+ only valid if there are enough deals to fill page 1
  if (totalPages <= 1 || pageNum > totalPages) {
    redirect(`/deals/${categorySlug}`)
  }
  
  // Calculate correct range for display
  const startItem = (pageNum - 1) * DEALS_PER_PAGE + 1
  const endItem = Math.min(pageNum * DEALS_PER_PAGE, totalCount)
  
  const Icon = categoryInfo?.icon || Tag
  
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  
  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${categoryName} Deals - Page ${pageNum}`,
    url: `https://savesmart.bio/deals/${categorySlug}/page/${pageNum}`,
    isPartOf: {
      "@type": "CollectionPage",
      name: `${categoryName} Deals`,
      url: `https://savesmart.bio/deals/${categorySlug}`,
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
      
      {/* Link tags for pagination SEO */}
      {hasPrevPage && (
        <link 
          rel="prev" 
          href={pageNum === 2 ? `/deals/${categorySlug}` : `/deals/${categorySlug}/page/${pageNum - 1}`} 
        />
      )}
      {hasNextPage && (
        <link rel="next" href={`/deals/${categorySlug}/page/${pageNum + 1}`} />
      )}
      
      <main className="pt-16">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-12 md:py-14 overflow-hidden">
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
              <Link 
                href={`/deals/${categorySlug}`}
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                {categoryName}
              </Link>
              <span className="text-white/50">/</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
                Page {pageNum}
              </span>
            </nav>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-white/70 uppercase tracking-wider text-sm font-medium">Category</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              {categoryName} Deals - Page {pageNum}
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
            <SectionHeading>{categoryName} Deals</SectionHeading>
            <DealGrid columns={4}>
              {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </DealGrid>
            
            {/* Pagination */}
            <Pagination 
              currentPage={pageNum} 
              totalPages={totalPages} 
              baseUrl={`/deals/${categorySlug}`} 
            />
          </PageContainer>
        </section>
      </main>

      <Footer />
    </div>
  )
}
