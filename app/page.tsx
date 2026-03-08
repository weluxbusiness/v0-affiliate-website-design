import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { HowItWorks } from "@/components/how-it-works"
import { BenefitsSection } from "@/components/benefits-section"
import { TrendingDeals } from "@/components/trending-deals"
import { DailyDeals } from "@/components/daily-deals"
import { LatestDeals } from "@/components/latest-deals"
import { DealAlertsSignup } from "@/components/deal-alerts-signup"
import { SocialProof } from "@/components/social-proof"
import { BlogSection } from "@/components/blog-section"
import { ComparisonTable } from "@/components/comparison-table"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"
import { getTrendingDeals, getDailyDeals, getLatestDeals } from "@/lib/deals"

export default async function HomePage() {
  // Fetch data at server level - keeps server-only code separate from client components
  const [trendingDeals, dailyDeals, latestDeals] = await Promise.all([
    getTrendingDeals(6),
    getDailyDeals(4),
    getLatestDeals(10),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <TrendingDeals deals={trendingDeals} />
        <DailyDeals deals={dailyDeals} />
        <LatestDeals deals={latestDeals} />
        <HowItWorks />
        <BenefitsSection />
        <DealAlertsSignup />
        <SocialProof />
        <BlogSection />
        <ComparisonTable />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
