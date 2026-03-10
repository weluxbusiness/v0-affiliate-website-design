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
import { HomePopularCategories } from "@/components/home-popular-categories"
import { HomeBestDeals } from "@/components/home-best-deals"
import { getTrendingDeals, getDailyDeals, getLatestDeals } from "@/lib/deals"

// Organization schema for rich search results
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SaveSmart",
  url: "https://savesmart.bio",
  logo: {
    "@type": "ImageObject",
    url: "https://savesmart.bio/logo.png",
    width: 512,
    height: 512
  },
  description: "SaveSmart helps you find the best deals, discounts, and coupons from top retailers. Compare prices and save money on electronics, fashion, home goods, and more.",
  foundingDate: "2024",
  sameAs: [
    "https://www.instagram.com/savesmart.bio/",
    "https://twitter.com/savesmartdeals",
    "https://facebook.com/savesmartdeals",
    "https://pinterest.com/savesmartdeals",
    "https://linkedin.com/company/savesmart"
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@savesmart.bio",
    contactType: "customer service",
    availableLanguage: ["English"]
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "US"
  }
}

// WebSite schema with SearchAction for sitelinks search box
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SaveSmart",
  url: "https://savesmart.bio",
  description: "Find the best deals, coupons, and discounts from hundreds of top retailers.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://savesmart.bio/deal-finder?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}

export default async function HomePage() {
  // Fetch data at server level - keeps server-only code separate from client components
  const [trendingDeals, dailyDeals, latestDeals] = await Promise.all([
    getTrendingDeals(6),
    getDailyDeals(4),
    getLatestDeals(10),
  ])

  return (
    <>
      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {/* WebSite Schema with SearchAction */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <HeroSection />
          <TrendingDeals deals={trendingDeals} />
          <HomePopularCategories />
          <HomeBestDeals />
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
    </>
  )
}
