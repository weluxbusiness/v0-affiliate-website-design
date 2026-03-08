import Link from "next/link"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer, SectionHeading } from "@/components/layout/page-container"
import { PopularCategories } from "@/components/popular-categories"
import { getBrandSlugs, getAllBrandsFromDb } from "@/lib/seo-data"
import { formatBrandName } from "@/lib/seo/content"
import { Tag, ArrowRight } from "lucide-react"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Shop by Brand - Find Deals on Top Brands | SaveSmart",
  description: "Browse deals from top brands including Apple, Samsung, Nike, Sony, and more. Compare prices across retailers and find the best discounts.",
  openGraph: {
    title: "Shop by Brand | SaveSmart",
    description: "Find deals from your favorite brands. Compare prices from Amazon, Best Buy, Target and more.",
    type: "website",
    url: "https://savesmart.bio/brands",
  },
  alternates: {
    canonical: "/brands",
  },
}

// Popular brands for display
const POPULAR_BRANDS = [
  { slug: "apple", name: "Apple" },
  { slug: "samsung", name: "Samsung" },
  { slug: "nike", name: "Nike" },
  { slug: "sony", name: "Sony" },
  { slug: "lg", name: "LG" },
  { slug: "dell", name: "Dell" },
  { slug: "hp", name: "HP" },
  { slug: "lenovo", name: "Lenovo" },
  { slug: "bose", name: "Bose" },
  { slug: "microsoft", name: "Microsoft" },
  { slug: "dyson", name: "Dyson" },
  { slug: "kitchenaid", name: "KitchenAid" },
  { slug: "adidas", name: "Adidas" },
  { slug: "under-armour", name: "Under Armour" },
  { slug: "new-balance", name: "New Balance" },
  { slug: "canon", name: "Canon" },
  { slug: "nintendo", name: "Nintendo" },
  { slug: "north-face", name: "The North Face" },
  { slug: "ray-ban", name: "Ray-Ban" },
  { slug: "levis", name: "Levi's" },
]

// Group brands by first letter
function groupBrandsByLetter(brands: { slug: string; name: string }[]) {
  const groups: Record<string, { slug: string; name: string }[]> = {}
  
  for (const brand of brands) {
    const letter = brand.name.charAt(0).toUpperCase()
    if (!groups[letter]) {
      groups[letter] = []
    }
    groups[letter].push(brand)
  }
  
  return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]))
}

export default async function BrandsPage() {
  // Get brands from DB
  const dbBrands = await getAllBrandsFromDb()
  
  // Merge with popular brands fallback
  const allBrands = dbBrands.length > 0 
    ? dbBrands.map(b => ({ slug: b.slug, name: b.name }))
    : POPULAR_BRANDS
  
  const groupedBrands = groupBrandsByLetter(allBrands)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
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
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
                Brands
              </span>
            </nav>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <Tag className="h-6 w-6" />
              </div>
              <span className="text-white/70 uppercase tracking-wider text-sm font-medium">Browse</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Shop by Brand
            </h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Find the best deals from your favorite brands. We track prices across all major retailers.
            </p>
          </PageContainer>
        </section>

        {/* Popular Brands */}
        <section className="py-10 md:py-12">
          <PageContainer>
            <SectionHeading>Popular Brands</SectionHeading>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 lg:grid-cols-5">
              {POPULAR_BRANDS.slice(0, 10).map((brand) => (
                <Link
                  key={brand.slug}
                  href={`/brands/${brand.slug}`}
                  className="group flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {brand.name}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* All Brands A-Z */}
        <section className="bg-muted/30 py-10 md:py-12">
          <PageContainer>
            <SectionHeading>All Brands A-Z</SectionHeading>
            <div className="space-y-8">
              {groupedBrands.map(([letter, brands]) => (
                <div key={letter}>
                  <h3 className="text-2xl font-bold text-foreground mb-4 border-b border-border pb-2">
                    {letter}
                  </h3>
                  <div className="grid gap-2 grid-cols-2 sm:grid-cols-4 lg:grid-cols-6">
                    {brands.map((brand) => (
                      <Link
                        key={brand.slug}
                        href={`/brands/${brand.slug}`}
                        className="px-3 py-2 rounded-lg hover:bg-primary/10 text-sm font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {brand.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </PageContainer>
        </section>

        <PopularCategories />
      </main>

      <Footer />
    </div>
  )
}
