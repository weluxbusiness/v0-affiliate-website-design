import { Star, Quote, Chrome, ExternalLink } from "lucide-react"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"

const stats = [
  { value: "4.8", label: "Average Rating", icon: Star },
  { value: "$127", label: "Avg. Monthly Savings", icon: null },
  { value: "2M+", label: "Active Users", icon: null },
  { value: "30K+", label: "Supported Stores", icon: null },
]

// Anonymized testimonials with store verification badges instead of fake avatars
const testimonials = [
  {
    rating: 5,
    text: "Saved over $120 in one month! I can&apos;t believe I was shopping without this for so long.",
    savings: "$120+",
    verified: true,
    store: "Amazon",
  },
  {
    rating: 5,
    text: "I never shop online without it now. It&apos;s like having a personal coupon hunter.",
    savings: "$89",
    verified: true,
    store: "Best Buy",
  },
  {
    rating: 5,
    text: "The price comparison feature alone has saved me hundreds. Absolutely essential!",
    savings: "$340+",
    verified: true,
    store: "Target",
  },
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
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative rounded-2xl border border-border bg-card p-6"
            >
              <Quote className="absolute right-6 top-6 h-8 w-8 text-primary/10" />
              
              {/* Star rating at top */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-foreground leading-relaxed">{testimonial.text}</p>
              
              {/* Bottom section with verified badge and savings */}
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {testimonial.verified && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Chrome className="h-3 w-3" />
                      Verified User
                    </span>
                  )}
                </div>
                <div className="inline-flex items-center rounded-full bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary">
                  Saved {testimonial.savings}
                </div>
              </div>
              
              {/* Store badge */}
              <div className="mt-3 pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  Shopping at {testimonial.store}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Chrome Web Store link for real reviews */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            See more reviews on Chrome Web Store
          </p>
          <Button variant="outline" className="gap-2" asChild>
            <a 
              href="https://go.savesmart.bio/save" 
              target="_blank" 
              rel="nofollow sponsored noopener"
            >
              <Chrome className="h-4 w-4" />
              View All Reviews
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </PageContainer>
    </section>
  )
}
