import { Download, ShoppingBag, Zap } from "lucide-react"
import { PageContainer } from "@/components/layout/page-container"

const steps = [
  {
    icon: Download,
    step: "Step 1",
    title: "Install the browser extension",
    description: "Add SaveSmart to Chrome, Firefox, or Edge in just one click. It takes less than 30 seconds.",
  },
  {
    icon: ShoppingBag,
    step: "Step 2",
    title: "Shop at your favorite online stores",
    description: "Browse and shop normally at any of the 30,000+ supported online stores.",
  },
  {
    icon: Zap,
    step: "Step 3",
    title: "Coupons and better prices are applied automatically",
    description: "SaveSmart automatically finds and applies the best coupons and deals at checkout.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background py-16 sm:py-24">
      <PageContainer>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Start saving in three simple steps. No complicated setup required.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((item, index) => (
            <div
              key={item.title}
              className="group relative rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="absolute -top-4 left-8">
                <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  {item.step}
                </span>
              </div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <item.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-muted-foreground">
                {item.description}
              </p>
              {index < steps.length - 1 && (
                <div className="absolute -right-4 top-1/2 hidden h-0.5 w-8 -translate-y-1/2 bg-border md:block" />
              )}
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  )
}
