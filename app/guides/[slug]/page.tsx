import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, Clock, ChevronRight, Tag, Store, Award } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageContainer } from "@/components/layout/page-container"
import { SeoLinkGraph } from "@/components/seo/seo-link-graph"
import { 
  getGuideBySlug, 
  getAllGuideSlugs, 
  getRelatedGuides,
  GUIDE_TOPICS,
  type BuyingGuide 
} from "@/lib/seo/guide-generator"
import { generateFAQSchema, generateBreadcrumbSchema } from "@/lib/seo/structured-data"

type Params = Promise<{ slug: string }>

// Generate static params for all guides
export async function generateStaticParams() {
  const slugs = getAllGuideSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const guide = getGuideBySlug(slug)

  if (!guide) {
    return { title: "Guide Not Found | SaveSmart" }
  }

  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      type: "article",
      modifiedTime: guide.lastUpdated,
    },
    alternates: {
      canonical: `/guides/${slug}`,
    },
  }
}

// Format content with headings, links, and styling
function formatGuideContent(content: string): string {
  return content
    // Headings with IDs for anchor links
    .replace(/^### (.*$)/gm, (_, text) => {
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      return `<h3 id="${id}" class="text-xl font-semibold text-foreground mt-8 mb-4">${text}</h3>`
    })
    .replace(/^## (.*$)/gm, (_, text) => {
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      return `<h2 id="${id}" class="text-2xl font-bold text-foreground mt-10 mb-6">${text}</h2>`
    })
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl md:text-4xl font-bold text-foreground mb-6">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // Links - convert markdown [text](url) to styled HTML
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline font-medium">$1</a>')
    // Lists
    .replace(/^- (.*$)/gm, '<li class="ml-4 mb-2">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, (match) => `<ul class="list-disc list-inside mb-6 text-muted-foreground">${match}</ul>`)
    // Paragraphs
    .split('\n\n')
    .map(p => {
      if (p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<li') || p.trim() === '') {
        return p
      }
      return `<p class="text-muted-foreground leading-relaxed mb-4">${p}</p>`
    })
    .join('\n')
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

// Format category name
function formatCategoryName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default async function GuidePage({ params }: { params: Params }) {
  const { slug } = await params
  const guide = getGuideBySlug(slug)

  if (!guide) {
    notFound()
  }

  const relatedGuides = getRelatedGuides(guide.category, slug, 4)
  const headings = extractHeadings(guide.content)
  const formattedContent = formatGuideContent(guide.content)

  // Generate structured data
  const faqSchema = generateFAQSchema(guide.faqs)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Guides', url: '/guides' },
    { name: guide.title, url: `/guides/${slug}` },
  ])

  // Article schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    dateModified: guide.lastUpdated,
    datePublished: guide.lastUpdated,
    author: {
      "@type": "Organization",
      name: "SaveSmart",
      url: "https://savesmart.bio",
    },
    publisher: {
      "@type": "Organization",
      name: "SaveSmart",
      logo: {
        "@type": "ImageObject",
        url: "https://savesmart.bio/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://savesmart.bio/guides/${slug}`,
    },
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="py-8 md:py-12">
        <PageContainer>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/guides" className="hover:text-foreground">Guides</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{formatCategoryName(guide.category)}</span>
          </nav>

          <div className="grid lg:grid-cols-[1fr_280px] gap-8">
            {/* Main Content */}
            <article>
              {/* Category Badge */}
              <Badge variant="secondary" className="mb-4">
                {formatCategoryName(guide.category)}
              </Badge>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Updated {new Date(guide.lastUpdated).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>15 min read</span>
                </div>
              </div>

              {/* Article Content */}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: formattedContent }}
              />

              {/* Internal Linking Section */}
              <div className="mt-12 pt-8 border-t border-border">
                <h2 className="text-2xl font-bold text-foreground mb-6">Shop Deals by Category</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Link 
                    href={`/deals/${guide.category}`}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Tag className="h-5 w-5 text-primary" />
                      <span className="font-medium">{formatCategoryName(guide.category)} Deals</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Link>
                  {guide.relatedStores.slice(0, 3).map(store => (
                    <Link 
                      key={store}
                      href={`/stores/${store}/${guide.category}`}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Store className="h-5 w-5 text-green-600" />
                        <span className="font-medium">{formatCategoryName(store)} {formatCategoryName(guide.category)}</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Brand Links */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">Shop by Brand</h3>
                <div className="flex flex-wrap gap-2">
                  {guide.relatedBrands.map(brand => (
                    <Link
                      key={brand}
                      href={`/deals/${guide.category}/${brand}`}
                      className="px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
                    >
                      {formatCategoryName(brand)}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Price Segment Links */}
              {guide.priceRange && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Shop by Price</h3>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/deals/price/${guide.priceRange.label.toLowerCase().replace(/\s/g, '-').replace(/\$/g, '')}`}
                      className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                    >
                      {guide.priceRange.label}
                    </Link>
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {/* Table of Contents */}
                <div className="p-4 rounded-lg border border-border bg-card">
                  <h3 className="font-semibold text-foreground mb-4">Table of Contents</h3>
                  <nav className="space-y-2">
                    {headings.filter(h => h.level === 2).map((heading) => (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </div>

                {/* CTA */}
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <Award className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Track Prices</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Set up alerts and get notified when prices drop.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/deal-finder">Set Price Alert</Link>
                  </Button>
                </div>

                {/* Related Guides */}
                {relatedGuides.length > 0 && (
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <h3 className="font-semibold text-foreground mb-4">Related Guides</h3>
                    <div className="space-y-3">
                      {relatedGuides.map((related) => (
                        <Link
                          key={related.slug}
                          href={`/guides/${related.slug}`}
                          className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {related.title.replace(/in \d{4}:?/, '').trim()}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </PageContainer>

        {/* SEO Link Graph - Full Width */}
        <div className="mt-12 border-t border-border pt-12">
          <PageContainer>
            <SeoLinkGraph 
              pageType="category"
              categorySlug={guide.category}
              maxLinksPerCluster={8}
              maxTotalLinks={60}
            />
          </PageContainer>
        </div>
      </main>

      <Footer />
    </div>
  )
}
