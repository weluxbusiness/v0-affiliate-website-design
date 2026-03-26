import { Suspense } from "react"
import type { Metadata } from "next"
import { HeroSection } from "@/components/hero-section"
import { HowItWorks } from "@/components/how-it-works"
import { BenefitsSection } from "@/components/benefits-section"
import { TrendingDeals } from "@/components/trending-deals"
import { DealAlertsSignup } from "@/components/deal-alerts-signup"
import { SocialProof } from "@/components/social-proof"
import { ComparisonTable } from "@/components/comparison-table"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"
import { HomePopularCategories } from "@/components/home-popular-categories"
import { HomeGamingDeals } from "@/components/home-gaming-deals"
import { FAQSection } from "@/components/seo"
import { TrendingNowSection } from "@/components/seo/trending-now-section"
import { homepageFAQs } from "@/lib/seo/faq-data"
import { getTrendingDeals } from "@/lib/deals"

// Enhanced metadata for better CTR in search results
export const metadata: Metadata = {
  title: "SaveSmart - Best Deals, Coupons & Discounts 2026 | Save Up to 70%",
  description: "Find the best online deals, coupon codes & discounts from 30,000+ stores. Save up to 70% on electronics, fashion, home goods & more. Updated hourly. Free to use!",
  keywords: [
    "deals", "coupons", "discounts", "promo codes", "online shopping",
    "best deals 2026", "coupon codes", "savings", "Amazon deals", 
    "Best Buy deals", "Target deals", "Walmart deals", "shopping deals"
  ],
  openGraph: {
    title: "SaveSmart - Find the Best Deals & Save Up to 70%",
    description: "Discover verified deals from Amazon, Best Buy, Target & 30,000+ stores. Updated every hour.",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
}

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

// Loading fallback for deals section
function DealsLoading() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

async function TrendingDealsSection() {
  const trendingDeals = await getTrendingDeals(6)
  return <TrendingDeals deals={trendingDeals} />
}

export default function HomePage() {
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
        <main>
          {/* Above the fold - critical */}
          <HeroSection />
          
          {/* SEO Boost: Trending Now - Internal links for crawl priority */}
          <TrendingNowSection />
          
          {/* Primary content - deals */}
          <Suspense fallback={<DealsLoading />}>
            <TrendingDealsSection />
          </Suspense>
          
          {/* Gaming Deals */}
          <HomeGamingDeals />
          
          {/* Category navigation */}
          <HomePopularCategories />
          
          {/* Value proposition */}
          <HowItWorks />
          <BenefitsSection />
          
          {/* Lead capture */}
          <DealAlertsSignup />
          
          {/* Trust building */}
          <SocialProof />
          
          {/* Competitive positioning */}
          <ComparisonTable />
          
          {/* FAQ Section for SEO */}
          <FAQSection 
            faqs={homepageFAQs}
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about finding the best deals with SaveSmart"
            className="border-t border-border"
          />
          
          {/* Final conversion */}
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </>
  )
}
