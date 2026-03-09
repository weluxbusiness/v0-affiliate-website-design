import Link from "next/link"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DealCard } from "@/components/deal-card"
import { Badge } from "@/components/ui/badge"
import { PageContainer, DealGrid, SectionHeading } from "@/components/layout/page-container"
import { getDealsByCategoryAndBrandPaginated, DEALS_PER_PAGE } from "@/lib/deals"
import { formatBrandName, formatCategoryName } from "@/lib/seo/content"
import { Pagination } from "@/components/pagination"
import { Tag, Clock, Headphones, Shirt, Home, Laptop, ShoppingBag } from "lucide-react"

export const revalidate = 3600

// Product categories with icons
const CATEGORY_ICONS: Record<string, typeof Headphones> = {
  'headphones': Headphones,
  'electronics': Laptop,
  'laptops': Laptop,
  'smartphones': Laptop,
  'tvs': Laptop,
  'fashion': Shirt,
  'sneakers': ShoppingBag,
  'clothing': Shirt,
  'home-kitchen': Home,
  'kitchen': Home,
}

interface PageProps {
  params: Promise<{ category: string; brand: string; page: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params
    const category = resolvedParams?.category || ''
    const brand = resolvedParams?.brand || ''
    const page = resolvedParams?.page || '1'
    
    if (!category || !brand) {
      return { title: 'Deals | SaveSmart' }
    }
    
    const pageNum = parseInt(page, 10) || 1
    const brandName = formatBrandName(brand)
    const categoryName = formatCategoryName(category)
    
    return {
      title: `${brandName} ${categoryName} Deals - Page ${pageNum} | SaveSmart`,
      description: `Page ${pageNum} of ${brandName} ${categoryName.toLowerCase()} deals. Compare prices and discounts from top retailers.`,
      robots: {
        index: pageNum <= 5, // Only index first 5 pages
        follow: true,
      },
      alternates: {
        canonical: `/deals/${category}/${brand}/page/${pageNum}`,
      },
    }
  } catch {
    return { title: 'Deals | SaveSmart' }
  }
}

export async function generateStaticParams() {
  // Only generate page 2-3 for popular combinations during build
  // Other pages will be generated on-demand
  return [
    { category: 'laptops', brand: 'apple', page: '2' },
    { category: 'headphones', brand: 'sony', page: '2' },
  ]
}

export default async function CategoryBrandPaginationPage({ params }: PageProps) {
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
  const page = resolvedParams?.page
  
  if (!category || !brand || !page) {
    redirect('/deals')
  }
  
  const categorySlug = category.toLowerCase()
  const brandSlug = brand.toLowerCase()
  const pageNum = parseInt(page, 10) || 1
  
  // Redirect page 1 to base URL
  if (pageNum === 1 || isNaN(pageNum) || pageNum < 1) {
    redirect(`/deals/${categorySlug}/${brandSlug}`)
  }
  
  const brandName = formatBrandName(brandSlug)
  const categoryName = formatCategoryName(categorySlug)
  
  // Fetch paginated deals with error handling
  let result
  try {
    result = await getDealsByCategoryAndBrandPaginated(categorySlug, brandSlug, pageNum)
  } catch {
    redirect(`/deals/${categorySlug}/${brandSlug}`)
  }
  
  // Validate result
  if (!result || !result.deals) {
    redirect(`/deals/${categorySlug}/${brandSlug}`)
  }
  
  const { deals, totalCount, totalPages } = result
  
  // Redirect to main page if this page shouldn't exist
  if (!deals || deals.length === 0 || totalPages <= 1 || pageNum > totalPages) {
    redirect(`/deals/${categorySlug}/${brandSlug}`)
  }
  
  // Calculate range for display
  const startItem = (pageNum - 1) * DEALS_PER_PAGE + 1
  const endItem = Math.min(pageNum * DEALS_PER_PAGE, totalCount)
  
  // Generate timestamp
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
  
  const Icon = CATEGORY_ICONS[categorySlug] || Tag

  // Structured data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://savesmart.bio" },
      { "@type": "ListItem", position: 2, name: "Deals", item: "https://savesmart.bio/deals" },
      { "@type": "ListItem", position: 3, name: categoryName, item: `https://savesmart.bio/deals/${categorySlug}` },
      { "@type": "ListItem", position: 4, name: brandName, item: `https://savesmart.bio/deals/${categorySlug}/${brandSlug}` },
      { "@type": "ListItem", position: 5, name: `Page ${pageNum}`, item: `https://savesmart.bio/deals/${categorySlug}/${brandSlug}/page/${pageNum}` },
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <main className="pt-16">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-emerald-700 to-teal-800 text-white py-12 md:py-14 overflow-hidden">
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
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
                Page {pageNum}
              </span>
            </nav>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <Icon className="h-6 w-6" />
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                Page {pageNum} of {totalPages}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-balance">
              {brandName} {categoryName} Deals
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mb-4">
              Showing {startItem} - {endItem} of {totalCount} deals
            </p>
            <span className="flex items-center gap-1.5 text-sm text-white/70">
              <Clock className="h-4 w-4" />
              Last updated: {lastUpdated}
            </span>
          </PageContainer>
        </section>

        {/* Deals Grid */}
        <section className="py-10 md:py-12">
          <PageContainer>
            <SectionHeading>{brandName} {categoryName} Deals - Page {pageNum}</SectionHeading>
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
                baseUrl={`/deals/${categorySlug}/${brandSlug}`}
              />
            </div>
          </PageContainer>
        </section>

        {/* Back to Main Page */}
        <section className="py-8 border-t border-border">
          <PageContainer>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href={`/deals/${categorySlug}/${brandSlug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-medium"
              >
                View All {brandName} {categoryName} Deals
              </Link>
              <Link
                href={`/deals/${categorySlug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-medium"
              >
                All {categoryName} Deals
              </Link>
              <Link
                href={`/brands/${brandSlug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-medium"
              >
                All {brandName} Deals
              </Link>
            </div>
          </PageContainer>
        </section>
      </main>

      <Footer />
    </div>
  )
}
