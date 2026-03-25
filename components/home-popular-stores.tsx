import Link from "next/link"
import { Store, ArrowRight, Star, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageContainer } from "@/components/layout/page-container"
import { getStoreInfo, formatStoreName } from "@/lib/deal-types"

// Popular stores for internal linking
const popularStores = [
  { slug: "amazon", name: "Amazon", deals: 150 },
  { slug: "nike", name: "Nike", deals: 45 },
  { slug: "best-buy", name: "Best Buy", deals: 80 },
  { slug: "target", name: "Target", deals: 65 },
  { slug: "walmart", name: "Walmart", deals: 95 },
  { slug: "apple", name: "Apple", deals: 25 },
  { slug: "adidas", name: "Adidas", deals: 35 },
  { slug: "macys", name: "Macy's", deals: 55 },
]

export function HomePopularStores() {
  return (
    <section className="py-16 sm:py-20 border-t border-border">
      <PageContainer>
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Store className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary uppercase tracking-wider">Stores</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Popular Stores
            </h2>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
              Browse deals from your favorite retailers. We partner with hundreds of top stores.
            </p>
          </div>
          <Button variant="outline" className="gap-2 shrink-0" asChild>
            <Link href="/deals">
              All Stores
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Store Grid */}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
          {popularStores.map((store) => {
            const storeInfo = getStoreInfo(store.name)
            return (
              <Link
                key={store.slug}
                href={`/stores/${store.slug}`}
                className="group flex flex-col items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-200"
              >
                <div className={`${storeInfo.color} h-14 w-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-110 transition-transform`}>
                  {store.name.charAt(0)}
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {store.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {store.deals}+ deals
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Trust Badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            Verified codes
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="h-4 w-4 text-amber-500" />
            2M+ users trust us
          </span>
          <Badge variant="outline" className="text-xs">
            Updated today
          </Badge>
        </div>
      </PageContainer>
    </section>
  )
}
