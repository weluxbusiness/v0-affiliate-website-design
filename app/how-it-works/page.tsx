import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/layout/page-container"
import { 
  Download, 
  ShoppingBag, 
  Zap, 
  Shield, 
  DollarSign, 
  Clock, 
  Globe, 
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Star
} from "lucide-react"

export const metadata: Metadata = {
  title: "How It Works | SaveSmart - Automatic Coupons & Price Comparison",
  description: "Learn how SaveSmart helps you save money automatically. Install our free browser extension and start saving on every online purchase in just 3 simple steps.",
  openGraph: {
    title: "How It Works | SaveSmart",
    description: "Learn how SaveSmart helps you save money automatically with our free browser extension.",
  },
}

const steps = [
  {
    icon: Download,
    step: "Step 1",
    title: "Install the Free Extension",
    description: "Add SaveSmart to your browser in one click. Available for Chrome, Firefox, Edge, and Safari. No account required to start saving.",
    details: [
      "Takes less than 30 seconds to install",
      "No credit card or payment info needed",
      "Works on all major browsers",
      "Lightweight - won't slow down your browsing"
    ]
  },
  {
    icon: ShoppingBag,
    step: "Step 2", 
    title: "Shop Normally at Your Favorite Stores",
    description: "Browse and shop at any of our 30,000+ supported online retailers. SaveSmart works quietly in the background.",
    details: [
      "Works on Amazon, eBay, Walmart, Target & more",
      "No need to search for coupons manually",
      "Automatic price tracking and alerts",
      "Compare prices across multiple stores"
    ]
  },
  {
    icon: Zap,
    step: "Step 3",
    title: "Save Automatically at Checkout",
    description: "When you reach checkout, SaveSmart automatically finds and applies the best available coupons and deals for you.",
    details: [
      "Tests all available coupon codes automatically",
      "Shows you the biggest savings option",
      "One-click apply for instant discounts",
      "Price history shows if it's a good deal"
    ]
  },
]

const features = [
  {
    icon: Shield,
    title: "100% Free Forever",
    description: "SaveSmart is completely free to use. No premium tiers, no hidden fees, no tricks."
  },
  {
    icon: DollarSign,
    title: "Real Savings",
    description: "Our users save an average of $126 per month on their online purchases."
  },
  {
    icon: Clock,
    title: "Save Time",
    description: "No more searching for coupon codes. We do all the work automatically."
  },
  {
    icon: Globe,
    title: "30,000+ Stores",
    description: "Works on virtually every major online retailer worldwide."
  },
  {
    icon: Smartphone,
    title: "Price Tracking",
    description: "Get alerts when prices drop on items you're watching."
  },
  {
    icon: Star,
    title: "Trusted by Millions",
    description: "Over 2 million users trust SaveSmart to find them the best deals."
  }
]

const faqs = [
  {
    question: "Is SaveSmart really free?",
    answer: "Yes, SaveSmart is 100% free to use. We make money through affiliate partnerships with retailers, which means you save money and it costs you nothing."
  },
  {
    question: "How does SaveSmart make money?",
    answer: "When you use a deal or coupon through SaveSmart, we may receive a small commission from the retailer. This doesn't affect your price - you still get the same discount."
  },
  {
    question: "Is my data safe with SaveSmart?",
    answer: "Absolutely. We take privacy seriously. We don't sell your personal data, and we only collect the minimum information needed to find you deals. Read our Privacy Policy for details."
  },
  {
    question: "What browsers does SaveSmart work on?",
    answer: "SaveSmart is available for Chrome, Firefox, Microsoft Edge, and Safari. We support all major desktop browsers."
  },
  {
    question: "Will SaveSmart slow down my browser?",
    answer: "No. SaveSmart is designed to be lightweight and only activates when you're shopping. It won't affect your normal browsing speed."
  },
  {
    question: "What if a coupon doesn't work?",
    answer: "We continuously update our coupon database and remove expired codes. If you encounter an issue, our system automatically tries other codes to find one that works."
  }
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="border-b border-border bg-muted/30 py-12 md:py-16">
          <PageContainer className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              How SaveSmart Works
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Start saving money in minutes. Our free browser extension automatically finds and applies the best coupons and deals at checkout.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="gap-2" asChild>
                <a href="https://chrome.google.com/webstore" target="_blank" rel="noopener noreferrer">
                  <Download className="h-5 w-5" />
                  Add to Browser - It&apos;s Free
                </a>
              </Button>
              <p className="text-sm text-muted-foreground">
                No account required • Takes 30 seconds
              </p>
            </div>
          </PageContainer>
        </section>

        {/* Steps Section */}
        <section className="py-12 md:py-16">
          <PageContainer>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Three Simple Steps to Start Saving
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                No complicated setup. No learning curve. Just install and start saving.
              </p>
            </div>

            <div className="mt-16 space-y-16">
              {steps.map((item, index) => (
                <div
                  key={item.title}
                  className={`flex flex-col items-center gap-8 lg:flex-row ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className="flex-1">
                    <div className="inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">
                      {item.step}
                    </div>
                    <h3 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
                      {item.title}
                    </h3>
                    <p className="mt-4 text-lg text-muted-foreground">
                      {item.description}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {item.details.map((detail) => (
                        <li key={detail} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                          <span className="text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-1 items-center justify-center">
                    <div className="flex h-48 w-48 items-center justify-center rounded-3xl bg-primary/10 sm:h-64 sm:w-64">
                      <item.icon className="h-24 w-24 text-primary sm:h-32 sm:w-32" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Features Grid */}
        <section className="border-t border-border bg-muted/30 py-12 md:py-16">
          <PageContainer>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Why Choose SaveSmart?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Join millions of smart shoppers who save time and money with our free extension.
              </p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* FAQ Section */}
        <section className="py-12 md:py-16">
          <PageContainer narrow>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Got questions? We&apos;ve got answers.
              </p>
            </div>

            <div className="mt-12 space-y-6">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-2xl border border-border bg-card p-6"
                >
                  <h3 className="text-lg font-semibold text-foreground">
                    {faq.question}
                  </h3>
                  <p className="mt-3 text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-muted-foreground">
                Still have questions?{" "}
                <Link href="/help-center" className="font-medium text-primary hover:underline">
                  Visit our Help Center
                </Link>
              </p>
            </div>
          </PageContainer>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border bg-primary py-12 md:py-16">
          <PageContainer className="text-center">
            <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">
              Ready to Start Saving?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
              Join over 2 million smart shoppers who save an average of $126/month with SaveSmart.
            </p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" className="gap-2" asChild>
                <a href="https://chrome.google.com/webstore" target="_blank" rel="noopener noreferrer">
                  Add Free Extension
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </PageContainer>
        </section>
      </main>

      <Footer />
    </div>
  )
}
