import Link from "next/link"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DealCard } from "@/components/deal-card"
import { Badge } from "@/components/ui/badge"
import { PageContainer, DealGrid, SectionHeading } from "@/components/layout/page-container"
import { getDealsByCategoryBrandStorePaginated, DEALS_PER_PAGE } from "@/lib/deals"
import { 
  formatBrandName, 
  formatCategoryName, 
  formatStoreName 
} from "@/lib/seo/content"
import { Pagination } from "@/components/pagination"
import { Clock, Store } from "lucide-react"

export const revalidate = 3600

interface PageProps {
  params: Promise<{ category: string; brand: string; store: string; page: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const category = resolvedParams?.category || ''
    const brand = resolvedParams?.brand || ''
    const store = resolvedParams?.store || ''
    const page = resolvedParams?.page || '1'
    
    if (!category || !brand || !store) {
      return { title: 'Deals | SaveSmart' }
    }
    
    const pageNum = parseInt(page, 10) || 1
    const brandName = formatBrandName(brand)
    const categoryName = formatCategoryName(category)
    const storeName = formatStoreName(store)
    
    return {
      title: `${brandName} ${categoryName} Deals at ${storeName} - Page ${pageNum} | SaveSmart`,
      description: `Page ${pageNum} of ${brandName} ${categoryName.toLowerCase()} deals at ${storeName}. Compare prices and discounts.`,
      robots: {
        index: pageNum <= 5, // Only index first 5 pages
        follow: true,
      },
      alternates: {
        canonical: `/deals/${category}/${brand}/${store}/page/${pageNum}`,
      },
    }
  } catch {
    return { title: 'Deals | SaveSmart' }
  }
}

export default async function CategoryBrandStorePaginationPage({ params }: PageProps) {
  // Safely resolve params
  let resolvedParams
  try {
    resolvedParams = await params
  } catch {
    redirect('/deals')
  }
  
  // Validate params exist
  const category = resolvedParams?.category
  const brand = resolvedParams?.brand
  const store = resolvedParams?.store
  const page = resolvedParams?.page
  
  if (!category || !brand || !store || !page) {
    redirect('/deals')
  }
  
  const categorySlug = category.toLowerCase()
  const brandSlug = brand.toLowerCase()
  const storeSlug = store.toLowerCase()
  const pageNum = parseInt(page, 10) || 1
  
  // Redirect page 1 to base URL
  if (pageNum === 1 || isNaN(pageNum) || pageNum < 1) {
    redirect(`/deals/${categorySlug}/${brandSlug}/${storeSlug}`)
  }
  
  const brandName = formatBrandName(brandSlug)
  const categoryName = formatCategoryName(categorySlug)
  const storeName = formatStoreName(storeSlug)
  
  // Fetch paginated deals with error handling
  let result
  try {
    result = await getDealsByCategoryBrandStorePaginated(categorySlug, brandSlug, storeSlug, pageNum)
  } catch {
    redirect(`/deals/${categorySlug}/${brandSlug}/${storeSlug}`)
  }
  
  // Validate result
  if (!result || !result.deals) {
    redirect(`/deals/${categorySlug}/${brandSlug}/${storeSlug}`)
  }
  
  const { deals, totalCount, totalPages } = result
  
  // Redirect to main page if this page shouldn't exist
  if (!deals || deals.length === 0 || totalPages <= 1 || pageNum > totalPages) {
    redirect(`/deals/${categorySlug}/${brandSlug}/${storeSlug}`)
  }
  
  // Calculate correct range for display
  const startItem = (pageNum - 1) * DEALS_PER_PAGE + 1
  const endItem = Math.min(pageNum * DEALS_PER_PAGE, totalCount)
  
  // Generate timestamp
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-violet-700 to-purple-800 text-white py-14 md:py-16 overflow-hidden">
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
                href={`/deals/${categorySlug}`}
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                {categoryName}
              </Link>
              <span className="text-white/50">/</span>
              <Link 
                href={`/deals/${categorySlug}/${brandSlug}`}
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                {brandName}
              </Link>
              <span className="text-white/50">/</span>
              <Link 
                href={`/deals/${categorySlug}/${brandSlug}/${storeSlug}`}
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
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <Store className="h-6 w-6" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4 text-balance">
              {brandName} {categoryName} at {storeName}
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
                Updated: {lastUpdated}
              </span>
            </div>
          </PageContainer>
        </section>

        {/* Deals Grid */}
        <section className="py-10 md:py-12">
          <PageContainer>
            <SectionHeading>{brandName} {categoryName} Deals at {storeName} - Page {pageNum}</SectionHeading>
            <DealGrid columns={4}>
              {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </DealGrid>
            
            {/* Pagination */}
            <div className="mt-8">
              <Pagination
                currentPage={pageNum}
                totalPages={totalPages}
                baseUrl={`/deals/${categorySlug}/${brandSlug}/${storeSlug}`}
              />
            </div>
          </PageContainer>
        </section>
      </main>

      <Footer />
    </div>
  )
}
