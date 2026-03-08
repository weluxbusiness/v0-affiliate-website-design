"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DealCard } from "@/components/deal-card"
import { PageContainer, DealGrid } from "@/components/layout/page-container"
import { Deal } from "@/lib/deal-types"
import { TrendingUp, ArrowRight, Sparkles } from "lucide-react"

interface TrendingDealsProps {
  deals: Deal[]
}

export function TrendingDeals({ deals }: TrendingDealsProps) {
  return (
    <section className="bg-gradient-to-b from-background to-muted/30 py-16 sm:py-24">
      <PageContainer>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary uppercase tracking-wider">Hot Right Now</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Trending Deals
            </h2>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
              The most popular deals our users are loving right now. Don't miss out!
            </p>
          </div>
          <Button variant="outline" className="gap-2 shrink-0" asChild>
            <Link href="/deals">
              View All Deals
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {deals.length > 0 ? (
          <DealGrid columns={3}>
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </DealGrid>
        ) : (
          <div className="text-center py-12">
            <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No trending deals available right now. Check back soon!</p>
          </div>
        )}

        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Want personalized deal recommendations?
          </p>
          <Button className="gap-2" asChild>
            <Link href="/deal-finder">
              <Sparkles className="h-4 w-4" />
              Try AI Deal Finder
            </Link>
          </Button>
        </div>
      </PageContainer>
    </section>
  )
}
