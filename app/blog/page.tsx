import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/layout/page-container"
import { articles, categories, getFeaturedArticles, getRecentArticles } from "@/lib/blog-data"
import { NewsletterForm } from "@/components/newsletter-form"

export const metadata: Metadata = {
  title: "Shopping Tips & Savings Blog 2026 - Expert Money-Saving Guides",
  description: "Learn proven strategies to save 50%+ on every purchase. Expert guides on coupons, cashback, price tracking & more. 50,000+ readers trust our tips!",
  keywords: [
    "shopping tips", "savings blog", "coupon strategies",
    "money saving tips", "deal hunting guide", "how to save money shopping"
  ],
  openGraph: {
    title: "Shopping Tips & Savings Blog 2026 | SaveSmart",
    description: "Expert money-saving guides trusted by 50,000+ readers. Start saving more today!",
    type: "website",
  },
  alternates: {
    canonical: "/blog",
  },
}

export default function BlogPage() {
  const featuredArticles = getFeaturedArticles()
  const recentArticles = getRecentArticles(6)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="border-b border-border bg-muted/30 py-16 sm:py-20">
          <PageContainer>
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Shopping Tips & Savings Blog
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Expert guides, strategies, and insights to help you save more money on every online purchase.
              </p>
            </div>
          </PageContainer>
        </section>

        {/* Categories Section */}
        <section className="border-b border-border py-8">
          <PageContainer>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/blog"
                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                All Posts
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/blog/category/${category.slug}`}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <section className="py-12 sm:py-16">
            <PageContainer>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Featured Articles</h2>
                <span className="text-sm font-medium text-primary">Editor&apos;s Picks</span>
              </div>

              <div className="mt-8 grid gap-8 lg:grid-cols-2">
                {featuredArticles.map((article, index) => {
                  const category = categories.find((c) => c.slug === article.category)
                  return (
                    <Link
                      key={article.slug}
                      href={`/blog/${article.slug}`}
                      className={`group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-xl ${
                        index === 0 ? "lg:row-span-2" : ""
                      }`}
                    >
                      <div
                        className={`${category?.color || "bg-primary"} flex items-center justify-center ${
                          index === 0 ? "h-64" : "h-40"
                        }`}
                      >
                        <Tag className={`${index === 0 ? "h-16 w-16" : "h-12 w-12"} text-white/80`} />
                      </div>
                      <div className={`p-6 ${index === 0 ? "lg:p-8" : ""}`}>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${
                              category?.color || "bg-primary"
                            }`}
                          >
                            {category?.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {article.readTime}
                          </span>
                        </div>
                        <h3
                          className={`mt-3 font-bold text-foreground transition-colors group-hover:text-primary ${
                            index === 0 ? "text-2xl" : "text-lg"
                          }`}
                        >
                          {article.title}
                        </h3>
                        <p className="mt-2 text-muted-foreground line-clamp-2">{article.excerpt}</p>
                        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                          Read Article
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </PageContainer>
          </section>
        )}

        {/* All Articles Grid */}
        <section className="bg-muted/30 py-12 sm:py-16">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground">Recent Articles</h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentArticles.map((article) => {
                const category = categories.find((c) => c.slug === article.category)
                return (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-lg"
                  >
                    <div
                      className={`${category?.color || "bg-primary"} flex h-40 items-center justify-center`}
                    >
                      <Tag className="h-10 w-10 text-white/80" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${
                            category?.color || "bg-primary"
                          }`}
                        >
                          {category?.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(article.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <h3 className="mt-3 font-semibold text-foreground transition-colors group-hover:text-primary line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
                      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                        Read More
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {articles.length > 6 && (
              <div className="mt-10 text-center">
                <Button variant="outline" size="lg" className="gap-2">
                  Load More Articles
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </PageContainer>
        </section>

        {/* Newsletter Section */}
        <section className="py-12 sm:py-16">
          <PageContainer>
            <div className="rounded-2xl bg-primary px-6 py-12 text-center sm:px-12 sm:py-16">
              <h2 className="text-2xl font-bold text-primary-foreground sm:text-3xl">
                Get Weekly Savings Tips
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
                Join 50,000+ smart shoppers who get our best deals, tips, and guides delivered to their inbox every week.
              </p>
              <NewsletterForm variant="primary" />
              <p className="mt-3 text-xs text-primary-foreground/60">
                No spam, unsubscribe anytime. Read our privacy policy.
              </p>
            </div>
          </PageContainer>
        </section>
      </main>

      <Footer />
    </div>
  )
}
