import Link from "next/link"
import { ArrowRight, Tag, TrendingUp, Newspaper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Deal } from "@/lib/deal-types"
import type { Article } from "@/lib/blog-data"

interface BlogSidebarProps {
  popularDeals?: Deal[]
  relatedPosts?: Article[]
}

// Trending stores with colors
const trendingStores = [
  { name: "Amazon", slug: "amazon", color: "bg-orange-500" },
  { name: "Best Buy", slug: "best-buy", color: "bg-blue-600" },
  { name: "Nike", slug: "nike", color: "bg-black" },
  { name: "Target", slug: "target", color: "bg-red-600" },
  { name: "Apple", slug: "apple", color: "bg-gray-600" },
]

export function BlogSidebar({ popularDeals = [], relatedPosts = [] }: BlogSidebarProps) {
  return (
    <aside className="hidden lg:block lg:w-80 xl:w-96">
      <div className="sticky top-24 space-y-8">
        {/* Popular Deals */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-foreground">Popular Deals</h3>
          </div>
          <div className="space-y-4">
            {popularDeals.length > 0 ? (
              popularDeals.slice(0, 4).map((deal) => (
                <Link 
                  key={deal.id} 
                  href={`/deal/${deal.slug || deal.id}`}
                  className="group block"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {deal.image_url ? (
                        <img 
                          src={deal.image_url} 
                          alt={deal.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Tag className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {deal.title}
                      </p>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-sm font-bold text-primary">
                          ${deal.deal_price.toFixed(2)}
                        </span>
                        <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                          {deal.discount_percentage}% OFF
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              // Placeholder deals when none available
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3 animate-pulse">
                    <div className="h-14 w-14 shrink-0 rounded-lg bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-full rounded bg-muted" />
                      <div className="h-4 w-2/3 rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Link href="/deals">
            <Button variant="ghost" size="sm" className="mt-4 w-full gap-2">
              View All Deals
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Trending Stores */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-foreground">Trending Stores</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingStores.map((store) => (
              <Link
                key={store.slug}
                href={`/deals/${store.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <span className={`h-2 w-2 rounded-full ${store.color}`} />
                {store.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Newspaper className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground">Related Articles</h3>
            </div>
            <div className="space-y-4">
              {relatedPosts.slice(0, 3).map((post) => (
                <Link 
                  key={post.slug} 
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {post.readTime}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Install Extension Banner */}
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-5 text-primary-foreground">
          <h3 className="font-bold text-lg">Save More Today</h3>
          <p className="mt-2 text-sm text-primary-foreground/80">
            Install SaveSmart and start saving automatically on every purchase.
          </p>
          <Button 
            size="sm" 
            variant="secondary" 
            className="mt-4 w-full bg-white text-primary hover:bg-white/90"
          >
            Add Free Extension
          </Button>
        </div>
      </div>
    </aside>
  )
}
