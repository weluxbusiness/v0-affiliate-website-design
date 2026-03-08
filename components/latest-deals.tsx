import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageContainer, DealGrid } from "@/components/layout/page-container"
import { ArrowRight, Clock } from "lucide-react"
import type { Deal } from "@/lib/deal-types"
import { getProductImageUrl } from "@/lib/deal-types"

interface LatestDealsProps {
  deals: Deal[]
}

export function LatestDeals({ deals }: LatestDealsProps) {
  if (deals.length === 0) return null

  return (
    <section className="py-16 bg-muted/30">
      <PageContainer>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              Latest Deals
            </h2>
            <p className="text-muted-foreground mt-1">
              Fresh deals added to our collection
            </p>
          </div>
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link href="/deals">
              View All Deals
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {deals.slice(0, 10).map((deal) => (
            <Link 
              key={deal.id} 
              href={`/deal/${deal.slug || deal.id}`}
              className="group"
            >
              <Card className="h-full overflow-hidden border-border/50 transition-all hover:shadow-lg hover:border-primary/30">
                <div className="relative aspect-square bg-muted">
                  <Image
                    src={getProductImageUrl(deal)}
                    alt={deal.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-secondary text-secondary-foreground text-xs">
                      {deal.discount_percentage}% OFF
                    </Badge>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-background/90 text-xs gap-1">
                      <Clock className="h-3 w-3" />
                      New
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground">{deal.store}</p>
                  <h3 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors mt-0.5">
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

        <div className="mt-6 text-center sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/deals">
              View All Deals
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </PageContainer>
    </section>
  )
}
