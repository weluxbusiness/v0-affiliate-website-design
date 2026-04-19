import type { Metadata } from "next"
import Link from "next/link"
import { 
  ChevronRight, 
  Gamepad2, 
  Flame,
  Clock,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Tag,
  Sparkles
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/layout/page-container"
import { PromoCodeCard } from "@/components/gaming/promo-code-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  getGameBySlug, 
  getActivePromoCodes, 
  sortPromoCodesByValue
} from "@/lib/gaming-data"

export const revalidate = 1800

const currentMonth = new Date().toLocaleString('default', { month: 'long' })
const currentYear = new Date().getFullYear()

export const metadata: Metadata = {
  title: `New RAID Shadow Legends Codes (${currentMonth} ${currentYear}) – Latest Working Codes`,
  description: `Get the newest RAID Shadow Legends promo codes released this month. All new codes verified daily with free energy, silver, champions & more!`,
  alternates: {
    canonical: "/gaming/raid-shadow-legends/new-codes",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RAIDNewCodesPage() {
  const game = getGameBySlug("raid-shadow-legends")
  
  if (!game) {
    return null
  }

  const activeCodes = sortPromoCodesByValue(getActivePromoCodes(game.promoCodes))
  const today = new Date()
  
  // Filter codes added in the last 30 days
  const newCodes = activeCodes.filter(code => {
    const addedDate = new Date(code.addedAt)
    const daysDiff = (today.getTime() - addedDate.getTime()) / (1000 * 60 * 60 * 24)
    return daysDiff <= 30
  })

  // Codes added in the last 7 days
  const thisWeekCodes = activeCodes.filter(code => {
    const addedDate = new Date(code.addedAt)
    const daysDiff = (today.getTime() - addedDate.getTime()) / (1000 * 60 * 60 * 24)
    return daysDiff <= 7
  })

  const lastUpdated = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric'
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative py-12 md:py-16 bg-gradient-to-b from-amber-900/20 via-amber-900/10 to-background border-b border-border overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/patterns/grid.svg')] opacity-5" />
          <PageContainer className="relative">
            <div className="max-w-4xl">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/gaming" className="hover:text-foreground transition-colors">Gaming</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/raid-shadow-legends-promo-codes" className="hover:text-foreground transition-colors">RAID Codes</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">New Codes</span>
              </nav>

              {/* Freshness Badge */}
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-amber-500 text-white">
                  <Flame className="h-3 w-3 mr-1" />
                  {newCodes.length} New Codes This Month
                </Badge>
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Updated {lastUpdated}
                </Badge>
              </div>

              {/* H1 */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
                New RAID Shadow Legends Codes ({currentMonth} {currentYear})
              </h1>

              {/* Description */}
              <p className="text-xl text-muted-foreground mb-6 max-w-3xl">
                Get all the <strong className="text-foreground">newest RAID Shadow Legends promo codes</strong> released this month. 
                We update this page daily with freshly released codes for free energy, silver, champions, and more.
              </p>

              {/* Back to main page CTA */}
              <Button asChild variant="outline">
                <Link href="/raid-shadow-legends-promo-codes">
                  <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                  View All RAID Codes
                </Link>
              </Button>
            </div>
          </PageContainer>
        </section>

        {/* New Codes This Week */}
        {thisWeekCodes.length > 0 && (
          <section className="py-10 md:py-12 bg-gradient-to-b from-green-500/5 to-transparent">
            <PageContainer>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <Sparkles className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Codes Added This Week
                  </h2>
                  <p className="text-sm text-muted-foreground">Released in the last 7 days</p>
                </div>
              </div>

              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {thisWeekCodes.map((code) => (
                  <PromoCodeCard key={code.id} code={code} game={game} />
                ))}
              </div>
            </PageContainer>
          </section>
        )}

        {/* All New Codes This Month */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  All Codes Added in {currentMonth} {currentYear}
                </h2>
                <p className="text-sm text-muted-foreground">{newCodes.length} codes released this month</p>
              </div>
            </div>

            {newCodes.length > 0 ? (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {newCodes.map((code) => (
                  <PromoCodeCard key={code.id} code={code} game={game} />
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No new codes released this month yet. Check back soon!</p>
                </CardContent>
              </Card>
            )}
          </PageContainer>
        </section>

        {/* Internal Links */}
        <section className="py-10 md:py-12 bg-muted/30 border-t border-border">
          <PageContainer>
            <h2 className="text-xl font-bold text-foreground mb-6">More RAID Shadow Legends Resources</h2>
            
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-8">
              <Link
                href="/raid-shadow-legends-promo-codes"
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Tag className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">All RAID Promo Codes</span>
              </Link>
              <Link
                href="/gaming/raid-shadow-legends/free-rewards"
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Sparkles className="h-5 w-5 text-green-500" />
                <span className="font-medium text-foreground">Free Rewards Guide</span>
              </Link>
              <Link
                href="/gaming/raid-shadow-legends/beginner-guide"
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Gamepad2 className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-foreground">Beginner Guide</span>
              </Link>
            </div>
          </PageContainer>
        </section>
      </main>

      <Footer />
    </div>
  )
}
