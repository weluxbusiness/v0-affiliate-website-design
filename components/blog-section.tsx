import Link from "next/link"
import { ArrowRight, BookOpen, Lightbulb, Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/layout/page-container"

const articles = [
  {
    icon: Lightbulb,
    category: "Tips & Tricks",
    title: "10 Smart Ways to Save Money While Shopping Online",
    excerpt: "Discover proven strategies that savvy shoppers use to cut their online spending by up to 40%.",
    color: "bg-amber-500",
    slug: "10-smart-ways-to-save-money-while-shopping-online",
  },
  {
    icon: Search,
    category: "Tools",
    title: "Best Browser Extensions for Online Shopping in 2026",
    excerpt: "A comprehensive comparison of the top shopping extensions that help you find the best deals.",
    color: "bg-blue-500",
    slug: "best-browser-extensions-for-online-shopping-2026",
  },
  {
    icon: BookOpen,
    category: "Guides",
    title: "How to Find Hidden Coupon Codes for Any Store",
    excerpt: "Learn the secret techniques to uncover coupon codes that aren't publicly advertised.",
    color: "bg-green-500",
    slug: "how-to-find-hidden-coupon-codes",
  },
  {
    icon: Sparkles,
    category: "Trends",
    title: "The Ultimate Guide to Black Friday Shopping 2026",
    excerpt: "Prepare for the biggest shopping day with our comprehensive strategy guide.",
    color: "bg-pink-500",
    slug: "ultimate-guide-to-black-friday-shopping",
  },
]

export function BlogSection() {
  return (
    <section id="blog" className="bg-background py-16 sm:py-24">
      <PageContainer>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Shopping Tips & Guides
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Expert advice to help you save more on every purchase.
            </p>
          </div>
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/blog">
              View All Articles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((article) => (
            <Link
              key={article.title}
              href={`/blog/${article.slug}`}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-lg"
            >
              <div className={`${article.color} flex h-36 items-center justify-center`}>
                <article.icon className="h-12 w-12 text-white" />
              </div>
              <div className="p-5">
                <span className="text-xs font-medium uppercase tracking-wider text-primary">
                  {article.category}
                </span>
                <h3 className="mt-2 font-semibold text-foreground transition-colors group-hover:text-primary">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                  Read More
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </PageContainer>
    </section>
  )
}
