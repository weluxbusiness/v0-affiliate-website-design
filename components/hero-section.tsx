import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/layout/page-container"
import { Chrome, Shield, Star, Users } from "lucide-react"

export function HeroSection() {
  return (
    <section 
      className="relative overflow-hidden pt-16 py-16 sm:py-24 lg:py-32"
      style={{
        // Safe fallback background for iOS Safari and Instagram browser
        backgroundColor: 'hsl(var(--background))',
        backgroundImage: 'linear-gradient(to bottom, hsl(var(--background)), hsl(var(--muted) / 0.3))',
      }}
    >
      <PageContainer>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-start">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-sm font-medium text-secondary-foreground">
              <Star className="h-4 w-4 fill-secondary text-secondary" />
              <span className="text-foreground">Trusted by 2M+ shoppers</span>
            </div>
            
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Save Money Automatically While Shopping Online
            </h1>
            
            <p className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground sm:text-xl">
              This free shopping assistant finds coupons, compares prices and helps you save money at thousands of online stores.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button size="lg" className="gap-2 bg-primary px-8 text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90" asChild>
                <a href="https://chrome.google.com/webstore" target="_blank" rel="noopener noreferrer">
                  <Chrome className="h-5 w-5" />
                  Add Free Shopping Assistant
                </a>
              </Button>
              <span className="text-sm text-muted-foreground">
                Free forever • No credit card required
              </span>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-secondary" />
                <span className="text-sm text-muted-foreground">100% Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-secondary" />
                <span className="text-sm text-muted-foreground">2M+ Users</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-1 text-sm text-muted-foreground">4.8/5 Rating</span>
              </div>
            </div>

            <div className="mt-10">
              <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Works with your favorite stores
              </p>
              <div className="flex flex-wrap items-center gap-6 opacity-70 grayscale">
                <span className="text-lg font-bold text-foreground">Amazon</span>
                <span className="text-lg font-bold text-foreground">Nike</span>
                <span className="text-lg font-bold text-foreground">Best Buy</span>
                <span className="text-lg font-bold text-foreground">Target</span>
                <span className="text-lg font-bold text-foreground">Walmart</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl border border-border bg-card p-4 shadow-2xl shadow-primary/10">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 rounded-md bg-muted px-3 py-1.5 text-center text-xs text-muted-foreground">
                  shop.example.com/checkout
                </div>
              </div>
              <div className="mt-4 space-y-4">
                <div className="rounded-xl border-2 border-dashed border-secondary/50 bg-secondary/5 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <span className="text-lg font-bold text-secondary-foreground">S</span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">SaveSmart Found 3 Coupons!</p>
                        <p className="text-sm text-muted-foreground">Click to apply the best one</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between rounded-lg bg-card p-3">
                      <span className="font-mono text-sm text-foreground">SAVE20OFF</span>
                      <span className="font-semibold text-secondary">-$20.00</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-card p-3">
                      <span className="font-mono text-sm text-foreground">FREESHIP</span>
                      <span className="font-semibold text-secondary">-$8.99</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-card p-3">
                      <span className="font-mono text-sm text-foreground">EXTRA10</span>
                      <span className="font-semibold text-secondary">-$10.00</span>
                    </div>
                  </div>
                  <Button className="mt-4 w-full bg-secondary text-secondary-foreground hover:bg-secondary/90" asChild>
                    <a href="https://chrome.google.com/webstore" target="_blank" rel="noopener noreferrer">
                      Apply Best Coupon (-$20.00)
                    </a>
                  </Button>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 -top-4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-4 -left-4 h-48 w-48 rounded-full bg-secondary/10 blur-3xl" />
          </div>
        </div>
      </PageContainer>
    </section>
  )
}
