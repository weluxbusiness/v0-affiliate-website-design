import { Header } from "@/components/header"
import { DealCardSkeleton } from "@/components/deal-card"
import { PageContainer, DealGrid } from "@/components/layout/page-container"

export default function DealsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero skeleton */}
        <section className="bg-gradient-to-b from-primary/5 to-background border-b border-border py-12 md:py-16">
          <PageContainer>
            <div className="h-10 w-64 bg-muted rounded animate-pulse mx-auto mb-4" />
            <div className="h-6 w-96 max-w-full bg-muted rounded animate-pulse mx-auto" />
          </PageContainer>
        </section>

        {/* Filters skeleton */}
        <section className="border-b border-border bg-card py-12 md:py-16">
          <PageContainer>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-9 w-24 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Deals grid skeleton */}
        <section className="py-12 md:py-16">
          <PageContainer>
            <div className="h-5 w-32 bg-muted rounded animate-pulse mb-6" />
            <DealGrid>
              {Array.from({ length: 8 }).map((_, i) => (
                <DealCardSkeleton key={i} />
              ))}
            </DealGrid>
          </PageContainer>
        </section>
      </main>
    </div>
  )
}
