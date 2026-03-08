"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageContainer, DealGrid } from "@/components/layout/page-container"
import { Deal, getStoreInfo, formatRating, getProductImageUrl } from "@/lib/deal-types"
import { CountdownBadge } from "@/components/countdown-timer"
import { Clock, Star, ShoppingBag, Zap } from "lucide-react"

interface DailyDealsProps {
  deals: Deal[]
}

export function DailyDeals({ deals }: DailyDealsProps) {
  return (
    <section className="bg-background py-16 sm:py-24 border-y border-border">
      <PageContainer>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                <Zap className="h-4 w-4 text-amber-500" />
              </div>
              <span className="text-sm font-medium text-amber-600 uppercase tracking-wider">Limited Time</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Daily Deals
            </h2>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
              Grab these deals before they expire! Updated daily with fresh savings.
            </p>
          </div>
          <Button variant="outline" className="gap-2 shrink-0" asChild>
            <Link href="/deals?filter=expiring">
              <Clock className="h-4 w-4" />
              All Expiring Deals
            </Link>
          </Button>
        </div>

        {deals.length > 0 ? (
          <DealGrid columns={4}>
            {deals.map((deal) => {
              const storeInfo = getStoreInfo(deal.store)
              const savings = deal.original_price - deal.deal_price

              return (
                <Card key={deal.id} className="overflow-hidden border-border/50 transition-all duration-300 hover:shadow-lg group relative">
                  <div className="absolute top-3 right-3 z-10">
                    <CountdownBadge expiresAt={deal.expires_at} />
                  </div>
                  <div className="relative aspect-[16/9] sm:h-36 sm:aspect-auto overflow-hidden bg-muted">
                    <Image
                      src={getProductImageUrl(deal)}
                      alt={deal.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute bottom-2 left-2">
                      <Badge className={`${storeInfo.color} text-white text-xs`}>
                        {deal.store}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <Badge variant="outline" className="text-xs mb-2">{deal.category}</Badge>
                    <h4 className="font-semibold text-foreground leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                      {deal.title}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                      <span>{deal.store}</span>
                      <span className="text-border">|</span>
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{formatRating(storeInfo.rating)}</span>
                    </div>
                    <div className="bg-secondary/10 rounded-lg p-2 mb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-muted-foreground line-through text-xs block">${deal.original_price.toFixed(2)}</span>
                          <span className="font-bold text-secondary text-lg">${deal.deal_price.toFixed(2)}</span>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-secondary text-secondary-foreground">
                            {deal.discount_percentage}% OFF
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">Save ${savings.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full gap-2" size="sm" asChild>
                      <a href={deal.affiliate_link} target="_blank" rel="noopener noreferrer">
                        <ShoppingBag className="h-4 w-4" />
                        Get Deal
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </DealGrid>
        ) : (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No daily deals available right now. Check back tomorrow!</p>
          </div>
        )}
      </PageContainer>
    </section>
  )
}
