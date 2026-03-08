import { BadgePercent, ArrowLeftRight, Gift, Store, CheckCircle } from "lucide-react"
import { PageContainer } from "@/components/layout/page-container"

const benefits = [
  {
    icon: BadgePercent,
    title: "Automatic Coupon Codes",
    description: "We automatically test and apply hundreds of coupon codes at checkout to find the one that saves you the most.",
  },
  {
    icon: ArrowLeftRight,
    title: "Price Comparison",
    description: "Instantly see if the product you're viewing is available cheaper at another trusted retailer.",
  },
  {
    icon: Gift,
    title: "Cashback & Rewards",
    description: "Earn cashback on your purchases at thousands of stores. Redeem your rewards via PayPal or gift cards.",
  },
  {
    icon: Store,
    title: "Works on 30,000+ Stores",
    description: "From major retailers to niche boutiques, SaveSmart works wherever you love to shop online.",
  },
  {
    icon: CheckCircle,
    title: "Completely Free",
    description: "No hidden fees, no premium plans. SaveSmart is 100% free to use, forever.",
  },
]

export function BenefitsSection() {
  return (
    <section id="benefits" className="bg-muted/30 py-16 sm:py-24">
      <PageContainer>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Why Shoppers Love SaveSmart
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Discover all the ways SaveSmart helps you keep more money in your pocket.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-secondary/30 hover:shadow-lg hover:shadow-secondary/5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary group-hover:text-secondary-foreground">
                <benefit.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {benefit.title}
              </h3>
              <p className="mt-2 text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  )
}
