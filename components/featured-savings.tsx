import { Tag } from "lucide-react"
import { PageContainer, DealGrid } from "@/components/layout/page-container"

const savings = [
  {
    product: "Nike Air Max 270",
    category: "Footwear",
    originalPrice: "$150",
    savedAmount: "$25",
    store: "Nike.com",
    color: "bg-orange-500",
  },
  {
    product: "Dell XPS 15 Laptop",
    category: "Electronics",
    originalPrice: "$1,299",
    savedAmount: "$70",
    store: "Dell.com",
    color: "bg-blue-500",
  },
  {
    product: "HyperX Gaming Headset",
    category: "Gaming",
    originalPrice: "$79",
    savedAmount: "$15",
    store: "Amazon.com",
    color: "bg-red-500",
  },
  {
    product: "Levi's 501 Jeans",
    category: "Apparel",
    originalPrice: "$89",
    savedAmount: "$22",
    store: "Levi.com",
    color: "bg-indigo-500",
  },
]

export function FeaturedSavings() {
  return (
    <section className="bg-background py-12 md:py-16">
      <PageContainer>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Recent Savings by Our Users
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Real savings from real shoppers. See how much others have saved this week.
          </p>
        </div>

        <DealGrid className="mt-16" columns={4}>
          {savings.map((item) => (
            <div
              key={item.product}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-lg"
            >
              <div className={`${item.color} flex h-32 items-center justify-center`}>
                <Tag className="h-12 w-12 text-white" />
              </div>
              <div className="p-5">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {item.category}
                </span>
                <h3 className="mt-1 font-semibold text-foreground">
                  {item.product}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.store}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground line-through">
                    {item.originalPrice}
                  </span>
                  <span className="rounded-full bg-secondary/10 px-3 py-1 text-sm font-semibold text-secondary">
                    Saved {item.savedAmount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </DealGrid>
      </PageContainer>
    </section>
  )
}
