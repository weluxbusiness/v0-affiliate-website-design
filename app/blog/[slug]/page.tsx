import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, Calendar, Clock, User } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageContainer } from "@/components/layout/page-container"
import { 
  TipBox, 
  ExtensionCTA, 
  ShareButtons, 
  NewsletterSignup,
  TableOfContents,
  Divider
} from "@/components/blog/article-components"
import { BlogSidebar } from "@/components/blog/blog-sidebar"
import { articles, categories, getArticleBySlug, getRecentArticles } from "@/lib/blog-data"
import { getTrendingDeals } from "@/lib/deals"

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    return {
      title: "Article Not Found | SaveSmart",
    }
  }

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author.name],
    },
  }
}

// Extract headings for table of contents
function extractHeadings(content: string): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = []
  const lines = content.split('\n')
  
  lines.forEach((line) => {
    const h2Match = line.match(/^## (.+)$/)
    const h3Match = line.match(/^### (.+)$/)
    
    if (h2Match) {
      const text = h2Match[1].trim()
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      headings.push({ id, text, level: 2 })
    } else if (h3Match) {
      const text = h3Match[1].trim()
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      headings.push({ id, text, level: 3 })
    }
  })
  
  return headings
}

// Format article content with enhanced styling and internal links
function formatContent(content: string): string {
  let html = content
    // Add IDs to headings for anchor links
    .replace(/^### (.*$)/gm, (_, text) => {
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      return `<h3 id="${id}">${text}</h3>`
    })
    .replace(/^## (.*$)/gm, (_, text) => {
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      return `<h2 id="${id}">${text}</h2>`
    })
    .replace(/^# (.*$)/gm, "<h1>$1</h1>")
    // Bold
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // Links - convert markdown links [text](url) to HTML
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Auto-link internal pages for better SEO
    .replace(/\bSaveSmart extension\b/gi, '<a href="/deal-finder">SaveSmart extension</a>')
    .replace(/\bbrowse deals\b/gi, '<a href="/deals">browse deals</a>')
    .replace(/\belectronics deals\b/gi, '<a href="/deals/electronics">electronics deals</a>')
    .replace(/\bfashion deals\b/gi, '<a href="/deals/fashion">fashion deals</a>')
    .replace(/\bhome deals\b/gi, '<a href="/deals/home-kitchen">home deals</a>')
    // Lists
    .replace(/^- (.*$)/gm, "<li>$1</li>")
    // Tables (basic support)
    .replace(/\|([^|]+)\|/g, (match) => {
      const cells = match.split("|").filter(Boolean)
      return "<tr>" + cells.map((cell) => `<td>${cell.trim()}</td>`).join("") + "</tr>"
    })
    // Paragraphs
    .split("\n\n")
    .map((para) => {
      if (
        para.startsWith("<h") ||
        para.startsWith("<li") ||
        para.startsWith("<tr") ||
        para.trim() === ""
      ) {
        return para
      }
      // Wrap lists
      if (para.includes("<li>")) {
        return `<ul>${para}</ul>`
      }
      return `<p>${para}</p>`
    })
    .join("\n")

  return html
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const category = categories.find((c) => c.slug === article.category)
  const relatedArticles = getRecentArticles(6).filter((a) => a.slug !== article.slug)
  const headings = extractHeadings(article.content)
  
  // Fetch trending deals for sidebar
  let trendingDeals: Awaited<ReturnType<typeof getTrendingDeals>> = []
  try {
    trendingDeals = await getTrendingDeals(4)
  } catch {
    // Continue without deals if fetch fails
  }

  const articleUrl = `https://savesmart.bio/blog/${article.slug}`

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Article Hero */}
        <section className="border-b border-border bg-gradient-to-b from-muted/50 to-background py-12 md:py-16">
          <PageContainer narrow>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Blog
            </Link>

            {/* Category & Meta */}
            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <Link
                href={`/blog/category/${article.category}`}
                className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium text-white transition-opacity hover:opacity-90 ${
                  category?.color || "bg-primary"
                }`}
              >
                {category?.name}
              </Link>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(article.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {article.readTime}
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance leading-tight">
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="mt-6 text-xl text-muted-foreground leading-relaxed text-pretty max-w-3xl">
              {article.excerpt}
            </p>

            {/* Author */}
            <div className="mt-10 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{article.author.name}</p>
                  <p className="text-sm text-muted-foreground">{article.author.role}</p>
                </div>
              </div>
              <ShareButtons url={articleUrl} title={article.title} />
            </div>
          </PageContainer>
        </section>

        {/* Article Content + Sidebar */}
        <section className="py-12 md:py-16">
          <PageContainer>
            <div className="flex gap-12">
              {/* Main Content */}
              <div className="min-w-0 flex-1 max-w-3xl">
                {/* Table of Contents - Mobile */}
                <div className="lg:hidden">
                  <TableOfContents items={headings} />
                </div>

                {/* Article Body */}
                <article className="article-content">
                  <div dangerouslySetInnerHTML={{ __html: formatContent(article.content) }} />
                </article>

                {/* Tip Box Example */}
                <TipBox variant="tip" title="Quick Tip">
                  Want to save even more? Install the SaveSmart browser extension to automatically find and apply coupon codes at checkout.
                </TipBox>

                <Divider />

                {/* Extension CTA */}
                <ExtensionCTA />

                {/* Article Footer */}
                <div className="mt-12 space-y-8">
                  {/* Share & Tags */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-border">
                    <ShareButtons url={articleUrl} title={article.title} />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Tags:</span>
                      <Badge variant="secondary">{category?.name}</Badge>
                    </div>
                  </div>

                  {/* Newsletter Signup */}
                  <NewsletterSignup />
                </div>
              </div>

              {/* Sidebar - Desktop */}
              <BlogSidebar 
                popularDeals={trendingDeals} 
                relatedPosts={relatedArticles.slice(0, 3)} 
              />
            </div>
          </PageContainer>
        </section>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="border-t border-border bg-muted/30 py-12 md:py-16">
            <PageContainer>
              <h2 className="text-2xl font-bold text-foreground">Continue Reading</h2>

              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedArticles.slice(0, 6).map((relatedArticle) => {
                  const relatedCategory = categories.find((c) => c.slug === relatedArticle.category)
                  return (
                    <Link
                      key={relatedArticle.slug}
                      href={`/blog/${relatedArticle.slug}`}
                      className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                      <div
                        className={`${relatedCategory?.color || "bg-primary"} flex h-36 items-center justify-center`}
                      >
                        <Calendar className="h-10 w-10 text-white/80" />
                      </div>
                      <div className="p-5">
                        <Badge
                          variant="secondary"
                          className={`${relatedCategory?.color || "bg-primary"} text-white border-0`}
                        >
                          {relatedCategory?.name}
                        </Badge>
                        <h3 className="mt-3 font-semibold text-foreground transition-colors group-hover:text-primary line-clamp-2">
                          {relatedArticle.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {relatedArticle.excerpt}
                        </p>
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
      </main>

      <Footer />
    </div>
  )
}
