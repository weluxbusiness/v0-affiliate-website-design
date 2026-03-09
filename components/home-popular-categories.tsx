import Link from "next/link"
import { PageContainer } from "@/components/layout/page-container"
import { 
  Laptop, 
  Headphones, 
  ShoppingBag, 
  Tv, 
  Home, 
  Shirt,
  Watch,
  Camera
} from "lucide-react"

// Popular categories for homepage internal linking
// These link to /deals/{category} pages to improve crawl paths
const POPULAR_CATEGORIES = [
  { slug: "laptops", name: "Laptop Deals", icon: Laptop },
  { slug: "headphones", name: "Headphone Deals", icon: Headphones },
  { slug: "sneakers", name: "Sneaker Deals", icon: ShoppingBag },
  { slug: "electronics", name: "Electronics Deals", icon: Tv },
  { slug: "home-kitchen", name: "Home & Kitchen Deals", icon: Home },
  { slug: "fashion", name: "Fashion Deals", icon: Shirt },
  { slug: "smartwatches", name: "Smartwatch Deals", icon: Watch },
  { slug: "tvs", name: "TV Deals", icon: Camera },
]

export function HomePopularCategories() {
  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <PageContainer>
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Popular Categories
          </h2>
          <p className="text-muted-foreground">
            Browse deals by category to find exactly what you need
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {POPULAR_CATEGORIES.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.slug}
                href={`/deals/${category.slug}`}
                className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-border bg-background hover:border-primary hover:shadow-md transition-all"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground text-center">
                  {category.name}
                </span>
              </Link>
            )
          })}
        </div>
      </PageContainer>
    </section>
  )
}
