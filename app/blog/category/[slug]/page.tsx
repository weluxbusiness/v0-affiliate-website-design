import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, Calendar, Clock, Tag } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer } from "@/components/layout/page-container"
import { categories, getArticlesByCategory, getCategoryBySlug } from "@/lib/blog-data"

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)

  if (!category) {
    return {
      title: "Category Not Found | SaveSmart",
    }
  }

  return {
    title: `${category.name} - Shopping Tips & Guides | SaveSmart`,
    description: category.description,
  }
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const articles = getArticlesByCategory(slug)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Category Header */}
        <section className="border-b border-border bg-muted/30 py-12 md:py-16">
          <PageContainer>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              All Articles
            </Link>

            <div className="mt-6 flex items-center gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${category.color}`}
              >
                <Tag className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {category.name}
                </h1>
                <p className="mt-1 text-muted-foreground">{category.description}</p>
              </div>
            </div>
          </PageContainer>
        </section>

        {/* Categories Navigation */}
        <section className="border-b border-border py-6">
          <PageContainer>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/blog"
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                All Posts
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/blog/category/${cat.slug}`}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    cat.slug === slug
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Articles Grid */}
        <section className="py-12 md:py-16">
          <PageContainer>
            {articles.length === 0 ? (
              <div className="py-12 text-center">
                <Tag className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-lg font-medium text-foreground">No articles yet</h2>
                <p className="mt-2 text-muted-foreground">
                  Check back soon for articles in this category.
                </p>
                <Link
                  href="/blog"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to all articles
                </Link>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  {articles.length} article{articles.length !== 1 ? "s" : ""} in this category
                </p>

                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {articles.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/blog/${article.slug}`}
                      className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-lg"
                    >
                      <div
                        className={`${category.color} flex h-40 items-center justify-center`}
                      >
                        <Tag className="h-10 w-10 text-white/80" />
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(article.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {article.readTime}
                          </span>
                        </div>
                        <h3 className="mt-3 font-semibold text-foreground transition-colors group-hover:text-primary line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                          {article.excerpt}
                        </p>
                        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                          Read Article
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </PageContainer>
        </section>
      </main>

      <Footer />
    </div>
  )
}
