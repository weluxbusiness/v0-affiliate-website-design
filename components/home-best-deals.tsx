import Link from "next/link"
import { Award, ArrowRight } from "lucide-react"

const BEST_CATEGORIES = [
  { slug: "laptops", name: "Laptops" },
  { slug: "headphones", name: "Headphones" },
  { slug: "sneakers", name: "Sneakers" },
  { slug: "tvs", name: "TVs" },
  { slug: "smartphones", name: "Smartphones" },
  { slug: "smartwatches", name: "Smartwatches" },
  { slug: "air-fryers", name: "Air Fryers" },
  { slug: "vacuums", name: "Vacuums" },
]

export function HomeBestDeals() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Award className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Best Deals</h2>
              <p className="text-sm text-muted-foreground">Top discounts handpicked by our team</p>
            </div>
          </div>
          <Link 
            href="/best/laptops"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View All Best Deals
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
          {BEST_CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/best/${category.slug}`}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-background border border-border hover:border-amber-500 hover:bg-amber-500/5 transition-colors"
            >
              <Award className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-foreground truncate">
                Best {category.name}
              </span>
            </Link>
          ))}
        </div>
        
        <div className="mt-6 text-center sm:hidden">
          <Link 
            href="/best/laptops"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View All Best Deals
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
