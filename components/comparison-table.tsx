import { Check, X } from "lucide-react"
import { PageContainer } from "@/components/layout/page-container"

const tools = [
  {
    name: "SaveSmart",
    highlight: true,
    coupons: true,
    priceComparison: true,
    rewards: true,
    free: true,
  },
  {
    name: "Honey",
    highlight: false,
    coupons: true,
    priceComparison: false,
    rewards: true,
    free: true,
  },
  {
    name: "RetailMeNot",
    highlight: false,
    coupons: true,
    priceComparison: false,
    rewards: false,
    free: true,
  },
  {
    name: "Capital One Shopping",
    highlight: false,
    coupons: true,
    priceComparison: true,
    rewards: true,
    free: true,
  },
]

const features = [
  { key: "coupons", label: "Automatic Coupons" },
  { key: "priceComparison", label: "Price Comparison" },
  { key: "rewards", label: "Cashback Rewards" },
  { key: "free", label: "Free to Use" },
]

export function ComparisonTable() {
  return (
    <section className="bg-muted/30 py-16 sm:py-24">
      <PageContainer>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How We Compare
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            See how SaveSmart stacks up against other popular shopping tools.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Tool
                  </th>
                  {features.map((feature) => (
                    <th
                      key={feature.key}
                      className="px-6 py-4 text-center text-sm font-semibold text-foreground"
                    >
                      {feature.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tools.map((tool, index) => (
                  <tr
                    key={tool.name}
                    className={`border-b border-border last:border-b-0 ${
                      tool.highlight ? "bg-primary/5" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold ${
                            tool.highlight ? "text-primary" : "text-foreground"
                          }`}
                        >
                          {tool.name}
                        </span>
                        {tool.highlight && (
                          <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                            Best
                          </span>
                        )}
                      </div>
                    </td>
                    {features.map((feature) => (
                      <td key={feature.key} className="px-6 py-4 text-center">
                        {tool[feature.key as keyof typeof tool] ? (
                          <Check className="mx-auto h-5 w-5 text-secondary" />
                        ) : (
                          <X className="mx-auto h-5 w-5 text-muted-foreground/50" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PageContainer>
    </section>
  )
}
