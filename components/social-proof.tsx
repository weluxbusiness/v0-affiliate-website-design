import { Star, Quote } from "lucide-react"
import { PageContainer } from "@/components/layout/page-container"

const testimonials = [
  {
    name: "Sarah M.",
    avatar: "S",
    rating: 5,
    text: "Saved over $120 in one month! I can't believe I was shopping without this for so long.",
    savings: "$120+",
  },
  {
    name: "James K.",
    avatar: "J",
    rating: 5,
    text: "I never shop online without it now. It's like having a personal coupon hunter.",
    savings: "$89",
  },
  {
    name: "Emily R.",
    avatar: "E",
    rating: 5,
    text: "The price comparison feature alone has saved me hundreds. Absolutely essential!",
    savings: "$340+",
  },
]

const stats = [
  { value: "4.8", label: "Average Rating", icon: Star },
  { value: "$127", label: "Avg. Monthly Savings", icon: null },
  { value: "2M+", label: "Active Users", icon: null },
  { value: "30K+", label: "Supported Stores", icon: null },
]

export function SocialProof() {
  return (
    <section className="bg-muted/30 py-16 sm:py-24">
      <PageContainer>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Loved by Millions of Shoppers
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Join over 2 million people who save money every day with SaveSmart.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-6 text-center"
            >
              <div className="flex items-center justify-center gap-1">
                {stat.icon && <stat.icon className="h-6 w-6 fill-yellow-400 text-yellow-400" />}
                <span className="text-3xl font-bold text-foreground">{stat.value}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="relative rounded-2xl border border-border bg-card p-6"
            >
              <Quote className="absolute right-6 top-6 h-8 w-8 text-primary/10" />
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">{testimonial.text}</p>
              <div className="mt-4 inline-flex items-center rounded-full bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary">
                Saved {testimonial.savings}
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  )
}
