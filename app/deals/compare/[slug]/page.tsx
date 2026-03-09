import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageContainer, SectionHeading, DealGrid } from "@/components/layout/page-container"
import { DealCard } from "@/components/deal-card"
import { CapitalOnePromo } from "@/components/capital-one-promo"
import { searchDeals, getDealsByBrand } from "@/lib/deals"
import { brands, categories, formatDisplayName } from "@/data/deal-pages"
import { 
  Check, 
  X, 
  ArrowRight, 
  Scale, 
  Sparkles, 
  DollarSign,
  Tag,
  Store,
  TrendingUp,
  HelpCircle,
  ChevronRight
} from "lucide-react"

export const revalidate = 3600

interface PageProps {
  params: Promise<{ slug: string }>
}

// Parse comparison slug: "nike-vs-adidas" → { brandA: "nike", brandB: "adidas" }
function parseComparisonSlug(slug: string): { brandA: string; brandB: string } | null {
  const parts = slug.split("-vs-")
  if (parts.length !== 2) return null
  return { brandA: parts[0], brandB: parts[1] }
}

// Check if entity is a brand
function isBrand(entity: string): boolean {
  return brands.includes(entity.toLowerCase() as typeof brands[number])
}

// Check if entity is a category
function isCategory(entity: string): boolean {
  return categories.includes(entity.toLowerCase() as typeof categories[number])
}

// Brand semantic data for intros and pros/cons
const brandSemantics: Record<string, {
  tagline: string
  strengths: string[]
  considerations: string[]
  priceRange: string
  bestFor: string[]
}> = {
  'nike': {
    tagline: 'Just Do It',
    strengths: ['Iconic brand recognition', 'Innovative athletic technology', 'Wide product selection', 'Strong resale value', 'Exclusive collaborations'],
    considerations: ['Premium pricing', 'Limited budget options', 'High demand items sell out quickly'],
    priceRange: 'Mid to Premium',
    bestFor: ['Athletes', 'Sneaker enthusiasts', 'Fashion-forward shoppers']
  },
  'adidas': {
    tagline: 'Impossible Is Nothing',
    strengths: ['Sustainable materials', 'Classic designs', 'Comfortable Boost technology', 'Affordable options available', 'Strong lifestyle appeal'],
    considerations: ['Sizing can vary', 'Some styles less durable', 'Limited high-performance options'],
    priceRange: 'Budget to Premium',
    bestFor: ['Casual wearers', 'Eco-conscious shoppers', 'Soccer enthusiasts']
  },
  'apple': {
    tagline: 'Think Different',
    strengths: ['Premium build quality', 'Seamless ecosystem integration', 'Long software support', 'Strong resale value', 'Industry-leading security'],
    considerations: ['Premium pricing', 'Limited customization', 'Proprietary accessories'],
    priceRange: 'Premium',
    bestFor: ['Creative professionals', 'Ecosystem users', 'Privacy-focused users']
  },
  'samsung': {
    tagline: 'Do What You Can\'t',
    strengths: ['Cutting-edge displays', 'Wide price range', 'Innovative features', 'Strong Android customization', 'Frequent sales'],
    considerations: ['Software bloatware', 'Inconsistent updates', 'Some models have plastic builds'],
    priceRange: 'Budget to Premium',
    bestFor: ['Tech enthusiasts', 'Android power users', 'Display quality seekers']
  },
  'sony': {
    tagline: 'Be Moved',
    strengths: ['Industry-leading audio quality', 'Excellent cameras', 'Premium build quality', 'Strong gaming ecosystem', 'Professional-grade products'],
    considerations: ['Higher price points', 'Slower software updates', 'Limited budget options'],
    priceRange: 'Mid to Premium',
    bestFor: ['Audiophiles', 'Photographers', 'Gamers']
  },
  'bose': {
    tagline: 'Better Sound Through Research',
    strengths: ['Superior noise cancellation', 'Comfortable fit', 'Premium audio quality', 'Excellent customer support', 'Durable construction'],
    considerations: ['Premium pricing', 'Fewer budget options', 'Conservative design'],
    priceRange: 'Premium',
    bestFor: ['Frequent travelers', 'Audiophiles', 'Remote workers']
  },
  'dyson': {
    tagline: 'Engineered for Performance',
    strengths: ['Innovative technology', 'Powerful suction', 'Premium design', 'Long-lasting products', 'Excellent customer service'],
    considerations: ['Very high prices', 'Expensive replacement parts', 'Limited budget alternatives'],
    priceRange: 'Premium',
    bestFor: ['Tech enthusiasts', 'Quality seekers', 'Design-conscious buyers']
  },
  'amazon': {
    tagline: 'Work Hard. Have Fun. Make History.',
    strengths: ['Vast selection', 'Competitive pricing', 'Fast Prime shipping', 'Easy returns', 'Frequent deals'],
    considerations: ['Quality varies by seller', 'Counterfeit concerns', 'Overwhelming choices'],
    priceRange: 'Budget to Premium',
    bestFor: ['Convenience seekers', 'Prime members', 'Deal hunters']
  },
  'walmart': {
    tagline: 'Save Money. Live Better.',
    strengths: ['Everyday low prices', 'Wide availability', 'In-store pickup', 'Price matching', 'Grocery integration'],
    considerations: ['Variable quality', 'Crowded stores', 'Limited premium selection'],
    priceRange: 'Budget to Mid',
    bestFor: ['Budget shoppers', 'One-stop shoppers', 'Families']
  },
  'target': {
    tagline: 'Expect More. Pay Less.',
    strengths: ['Trendy products', 'Clean store experience', 'RedCard savings', 'Quality private labels', 'Good return policy'],
    considerations: ['Higher than Walmart', 'Limited bulk options', 'Fewer locations'],
    priceRange: 'Budget to Mid',
    bestFor: ['Style-conscious shoppers', 'Young families', 'Home decor enthusiasts']
  },
  'best-buy': {
    tagline: 'Expert Service. Unbeatable Prices.',
    strengths: ['Expert advice', 'Price matching', 'Geek Squad support', 'Open-box deals', 'Wide tech selection'],
    considerations: ['Can be pricey without deals', 'Pushy upselling', 'Limited non-tech items'],
    priceRange: 'Mid to Premium',
    bestFor: ['Tech buyers', 'Those needing support', 'Electronics enthusiasts']
  },
  'dell': {
    tagline: 'The Power To Do More',
    strengths: ['Customizable options', 'Business reliability', 'Strong support', 'Good value laptops', 'Frequent sales'],
    considerations: ['Bloatware on consumer models', 'Design less premium', 'Customer service varies'],
    priceRange: 'Budget to Premium',
    bestFor: ['Business users', 'Budget buyers', 'Customization seekers']
  },
  'hp': {
    tagline: 'Keep Reinventing',
    strengths: ['Wide product range', 'Good print solutions', 'Reliable performance', 'Business-focused options', 'Affordable entry points'],
    considerations: ['Inconsistent quality', 'Bloatware issues', 'Some design flaws'],
    priceRange: 'Budget to Premium',
    bestFor: ['Office users', 'Students', 'Printer needs']
  },
  'macbook': {
    tagline: 'Apple Silicon Power',
    strengths: ['Incredible battery life', 'Seamless macOS experience', 'Premium build quality', 'M-series chip performance', 'Long software support'],
    considerations: ['Very premium pricing', 'Limited ports', 'No touchscreen'],
    priceRange: 'Premium',
    bestFor: ['Creative professionals', 'Apple ecosystem users', 'Developers']
  },
}

// Get semantics for an entity (with fallback)
function getEntitySemantics(entity: string) {
  const normalized = entity.toLowerCase()
  return brandSemantics[normalized] || {
    tagline: '',
    strengths: ['Quality products', 'Competitive pricing', 'Wide selection'],
    considerations: ['Research before buying', 'Compare prices'],
    priceRange: 'Varies',
    bestFor: ['General shoppers']
  }
}

// Generate comparison intro
function generateComparisonIntro(brandA: string, brandB: string, typeA: string, typeB: string): string {
  const nameA = formatDisplayName(brandA)
  const nameB = formatDisplayName(brandB)
  const semanticsA = getEntitySemantics(brandA)
  const semanticsB = getEntitySemantics(brandB)
  const year = new Date().getFullYear()
  
  if (typeA === 'brand' && typeB === 'brand') {
    return `In ${year}, choosing between ${nameA} and ${nameB} comes down to your priorities, budget, and shopping preferences. ${nameA}${semanticsA.tagline ? ` (${semanticsA.tagline})` : ''} offers ${semanticsA.strengths[0]?.toLowerCase() || 'quality products'}, while ${nameB}${semanticsB.tagline ? ` (${semanticsB.tagline})` : ''} is known for ${semanticsB.strengths[0]?.toLowerCase() || 'competitive offerings'}.

SaveSmart tracks deals from both ${nameA} and ${nameB} across hundreds of retailers, comparing prices in real-time to help you find the best value. Whether you're looking for the lowest price or the biggest percentage discount, our comparison shows you exactly where to save.

Both brands have loyal followings for good reason. ${nameA} appeals to ${semanticsA.bestFor?.slice(0, 2).join(' and ').toLowerCase() || 'many shoppers'}, while ${nameB} is perfect for ${semanticsB.bestFor?.slice(0, 2).join(' and ').toLowerCase() || 'various buyers'}. Let's break down the deals and help you decide.`
  }
  
  return `Compare ${nameA} vs ${nameB} deals side by side. SaveSmart tracks prices across 100+ retailers to help you find the best value on ${nameA} and ${nameB} products in ${year}.`
}

// Generate FAQs for comparison
function generateComparisonFAQs(brandA: string, brandB: string): { question: string; answer: string }[] {
  const nameA = formatDisplayName(brandA)
  const nameB = formatDisplayName(brandB)
  const semanticsA = getEntitySemantics(brandA)
  const semanticsB = getEntitySemantics(brandB)
  
  return [
    {
      question: `Which is better: ${nameA} or ${nameB}?`,
      answer: `The better choice depends on your priorities. ${nameA} excels at ${semanticsA.strengths[0]?.toLowerCase() || 'certain features'}, while ${nameB} is known for ${semanticsB.strengths[0]?.toLowerCase() || 'other strengths'}. Consider your budget, specific needs, and which brand's strengths align with your priorities.`
    },
    {
      question: `Where can I find the best ${nameA} and ${nameB} deals?`,
      answer: `SaveSmart compares prices from Amazon, Walmart, Target, Best Buy, and 100+ other retailers in real-time. Check our comparison above for the latest deals on both ${nameA} and ${nameB} products, updated hourly.`
    },
    {
      question: `Is ${nameA} more expensive than ${nameB}?`,
      answer: `${nameA} typically falls in the ${semanticsA.priceRange.toLowerCase()} price range, while ${nameB} is ${semanticsB.priceRange.toLowerCase()}. However, deals and sales can significantly affect final prices—SaveSmart tracks discounts up to 70% off on both brands.`
    },
    {
      question: `Should I wait for ${nameA} or ${nameB} sales?`,
      answer: `Both brands offer significant discounts during major sales events like Black Friday, Prime Day, and holiday sales. SaveSmart tracks historical pricing and alerts you when products reach their lowest prices. Sign up for deal alerts to never miss a sale.`
    },
    {
      question: `Can I price match between ${nameA} and ${nameB} retailers?`,
      answer: `Many retailers offer price matching policies. Best Buy, Target, and Walmart will often match competitor prices. Use SaveSmart's comparison data to identify the lowest price, then request a price match at your preferred retailer.`
    }
  ]
}

// Popular brand comparisons for static generation
const POPULAR_DEAL_COMPARISONS = [
  'nike-vs-adidas',
  'apple-vs-samsung',
  'macbook-vs-dell',
  'sony-vs-bose',
  'dyson-vs-shark',
  'amazon-vs-walmart',
  'target-vs-walmart',
  'best-buy-vs-amazon',
  'dell-vs-hp',
  'playstation-vs-xbox',
  'nintendo-vs-playstation',
  'north-face-vs-patagonia',
  'lg-vs-samsung',
  'lenovo-vs-dell',
  'beats-vs-airpods',
]

export async function generateStaticParams() {
  return POPULAR_DEAL_COMPARISONS.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const parsed = parseComparisonSlug(slug)
  
  if (!parsed) {
    return { title: "Brand Comparison | SaveSmart" }
  }
  
  const brandA = formatDisplayName(parsed.brandA)
  const brandB = formatDisplayName(parsed.brandB)
  const year = new Date().getFullYear()
  
  return {
    title: `${brandA} vs ${brandB} Deals (${year}) – Compare & Save | SaveSmart`,
    description: `Compare ${brandA} vs ${brandB} deals side by side. Find the best prices, biggest discounts, and see which brand offers better value for your budget.`,
    openGraph: {
      title: `${brandA} vs ${brandB} – Which Has Better Deals?`,
      description: `Side-by-side comparison of ${brandA} and ${brandB} deals. Compare prices, discounts, and find the best value.`,
      type: "website",
      url: `https://savesmart.bio/deals/compare/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${brandA} vs ${brandB} Deals Comparison`,
      description: `Compare deals and find the best prices on ${brandA} and ${brandB} products.`,
    },
    alternates: {
      canonical: `/deals/compare/${slug}`,
    },
    keywords: [
      `${brandA} vs ${brandB}`,
      `${brandA} deals`,
      `${brandB} deals`,
      `${brandA} or ${brandB}`,
      `compare ${brandA} ${brandB}`,
      `${brandA} vs ${brandB} ${year}`,
    ],
  }
}

export default async function DealComparisonPage({ params }: PageProps) {
  const { slug } = await params
  const parsed = parseComparisonSlug(slug)
  
  if (!parsed) {
    notFound()
  }
  
  const brandAName = formatDisplayName(parsed.brandA)
  const brandBName = formatDisplayName(parsed.brandB)
  
  const typeA = isBrand(parsed.brandA) ? 'brand' : isCategory(parsed.brandA) ? 'category' : 'unknown'
  const typeB = isBrand(parsed.brandB) ? 'brand' : isCategory(parsed.brandB) ? 'category' : 'unknown'
  
  // Fetch deals for both brands
  const [dealsA, dealsB] = await Promise.all([
    searchDeals(parsed.brandA.replace(/-/g, " "), 16),
    searchDeals(parsed.brandB.replace(/-/g, " "), 16),
  ])
  
  // Calculate stats
  const statsA = {
    dealCount: dealsA.length,
    avgPrice: dealsA.length > 0 ? Math.round(dealsA.reduce((sum, d) => sum + (d.deal_price || 0), 0) / dealsA.length) : 0,
    avgDiscount: dealsA.length > 0 ? Math.round(dealsA.reduce((sum, d) => sum + (d.discount_percentage || 0), 0) / dealsA.length) : 0,
    lowestPrice: dealsA.length > 0 ? Math.min(...dealsA.map(d => d.deal_price || Infinity)) : 0,
    highestDiscount: dealsA.length > 0 ? Math.max(...dealsA.map(d => d.discount_percentage || 0)) : 0,
    stores: [...new Set(dealsA.map(d => d.store).filter(Boolean))],
  }
  
  const statsB = {
    dealCount: dealsB.length,
    avgPrice: dealsB.length > 0 ? Math.round(dealsB.reduce((sum, d) => sum + (d.deal_price || 0), 0) / dealsB.length) : 0,
    avgDiscount: dealsB.length > 0 ? Math.round(dealsB.reduce((sum, d) => sum + (d.discount_percentage || 0), 0) / dealsB.length) : 0,
    lowestPrice: dealsB.length > 0 ? Math.min(...dealsB.map(d => d.deal_price || Infinity)) : 0,
    highestDiscount: dealsB.length > 0 ? Math.max(...dealsB.map(d => d.discount_percentage || 0)) : 0,
    stores: [...new Set(dealsB.map(d => d.store).filter(Boolean))],
  }
  
  const semanticsA = getEntitySemantics(parsed.brandA)
  const semanticsB = getEntitySemantics(parsed.brandB)
  const intro = generateComparisonIntro(parsed.brandA, parsed.brandB, typeA, typeB)
  const faqs = generateComparisonFAQs(parsed.brandA, parsed.brandB)
  
  // Structured data - CollectionPage schema
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${brandAName} vs ${brandBName} Deals`,
    description: `Compare ${brandAName} and ${brandBName} deals - prices, discounts, and best offers`,
    url: `https://savesmart.bio/deals/compare/${slug}`,
    numberOfItems: dealsA.length + dealsB.length,
    provider: {
      "@type": "Organization",
      name: "SaveSmart",
      url: "https://savesmart.bio"
    },
  }
  
  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  }
  
  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://savesmart.bio"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Deals",
        item: "https://savesmart.bio/deals"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Compare",
        item: "https://savesmart.bio/deals/compare"
      },
      {
        "@type": "ListItem",
        position: 4,
        name: `${brandAName} vs ${brandBName}`,
        item: `https://savesmart.bio/deals/compare/${slug}`
      }
    ]
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted/50 to-background py-10 md:py-14">
          <PageContainer>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/deals" className="hover:text-foreground transition-colors">Deals</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">{brandAName} vs {brandBName}</span>
            </nav>
            
            <div className="text-center">
              <Badge variant="secondary" className="mb-4">
                <Scale className="h-3 w-3 mr-1" />
                Deal Comparison
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
                {brandAName} vs {brandBName} Deals
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Compare prices, discounts, and find the best value on {brandAName} and {brandBName} products from top retailers.
              </p>
            </div>
          </PageContainer>
        </section>
        
        {/* Quick Stats Comparison */}
        <section className="py-8 border-b border-border">
          <PageContainer>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Brand A Stats */}
              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{brandAName}</CardTitle>
                  {semanticsA.tagline && (
                    <p className="text-sm text-muted-foreground italic">&quot;{semanticsA.tagline}&quot;</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 rounded-lg bg-background">
                      <DollarSign className="h-5 w-5 mx-auto text-primary mb-1" />
                      <p className="text-2xl font-bold">${statsA.lowestPrice || 'N/A'}</p>
                      <p className="text-xs text-muted-foreground">Lowest Price</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background">
                      <Tag className="h-5 w-5 mx-auto text-red-500 mb-1" />
                      <p className="text-2xl font-bold">{statsA.highestDiscount}%</p>
                      <p className="text-xs text-muted-foreground">Best Discount</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background">
                      <TrendingUp className="h-5 w-5 mx-auto text-green-500 mb-1" />
                      <p className="text-2xl font-bold">{statsA.dealCount}</p>
                      <p className="text-xs text-muted-foreground">Active Deals</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background">
                      <Store className="h-5 w-5 mx-auto text-blue-500 mb-1" />
                      <p className="text-2xl font-bold">{statsA.stores.length}</p>
                      <p className="text-xs text-muted-foreground">Retailers</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <Button variant="default" className="flex-1" asChild>
                      <Link href={`/deals/seo/${parsed.brandA}-under-100`}>
                        Shop {brandAName}
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/deals/store/${parsed.brandA}`}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Brand B Stats */}
              <Card className="border-2 border-secondary/20 bg-secondary/5">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{brandBName}</CardTitle>
                  {semanticsB.tagline && (
                    <p className="text-sm text-muted-foreground italic">&quot;{semanticsB.tagline}&quot;</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 rounded-lg bg-background">
                      <DollarSign className="h-5 w-5 mx-auto text-primary mb-1" />
                      <p className="text-2xl font-bold">${statsB.lowestPrice || 'N/A'}</p>
                      <p className="text-xs text-muted-foreground">Lowest Price</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background">
                      <Tag className="h-5 w-5 mx-auto text-red-500 mb-1" />
                      <p className="text-2xl font-bold">{statsB.highestDiscount}%</p>
                      <p className="text-xs text-muted-foreground">Best Discount</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background">
                      <TrendingUp className="h-5 w-5 mx-auto text-green-500 mb-1" />
                      <p className="text-2xl font-bold">{statsB.dealCount}</p>
                      <p className="text-xs text-muted-foreground">Active Deals</p>
                    </div>
                    <div className="p-3 rounded-lg bg-background">
                      <Store className="h-5 w-5 mx-auto text-blue-500 mb-1" />
                      <p className="text-2xl font-bold">{statsB.stores.length}</p>
                      <p className="text-xs text-muted-foreground">Retailers</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <Button variant="default" className="flex-1" asChild>
                      <Link href={`/deals/seo/${parsed.brandB}-under-100`}>
                        Shop {brandBName}
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/deals/store/${parsed.brandB}`}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </PageContainer>
        </section>
        
        {/* Comparison Intro */}
        <section className="py-10 md:py-12">
          <PageContainer>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {brandAName} vs {brandBName}: Which Offers Better Value?
              </h2>
              <div className="prose prose-muted max-w-none space-y-4">
                {intro.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </PageContainer>
        </section>
        
        {/* Pros and Cons */}
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              Pros & Cons Comparison
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Brand A Pros/Cons */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  {brandAName}
                </h3>
                <Card>
                  <CardContent className="pt-6">
                    <div className="mb-6">
                      <h4 className="font-medium text-green-600 mb-3 flex items-center gap-2">
                        <Check className="h-4 w-4" /> Strengths
                      </h4>
                      <ul className="space-y-2">
                        {semanticsA.strengths.map((strength, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-600 mb-3 flex items-center gap-2">
                        <X className="h-4 w-4" /> Considerations
                      </h4>
                      <ul className="space-y-2">
                        {semanticsA.considerations.map((con, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <X className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        <strong>Price Range:</strong> {semanticsA.priceRange}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        <strong>Best For:</strong> {semanticsA.bestFor.join(', ')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Brand B Pros/Cons */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  {brandBName}
                </h3>
                <Card>
                  <CardContent className="pt-6">
                    <div className="mb-6">
                      <h4 className="font-medium text-green-600 mb-3 flex items-center gap-2">
                        <Check className="h-4 w-4" /> Strengths
                      </h4>
                      <ul className="space-y-2">
                        {semanticsB.strengths.map((strength, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-600 mb-3 flex items-center gap-2">
                        <X className="h-4 w-4" /> Considerations
                      </h4>
                      <ul className="space-y-2">
                        {semanticsB.considerations.map((con, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <X className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        <strong>Price Range:</strong> {semanticsB.priceRange}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        <strong>Best For:</strong> {semanticsB.bestFor.join(', ')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </PageContainer>
        </section>
        
        {/* CapitalOne Promo */}
        <section className="py-8">
          <PageContainer>
            <CapitalOnePromo variant="inline" />
          </PageContainer>
        </section>
        
        {/* Two-Column Deal Comparison */}
        <section className="py-10 md:py-12">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              Latest Deals Comparison
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Brand A Deals */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    {brandAName} Deals
                  </h3>
                  <Badge variant="outline">{statsA.dealCount} deals</Badge>
                </div>
                <div className="grid gap-4">
                  {dealsA.slice(0, 6).map((deal) => (
                    <DealCard key={deal.id} deal={deal} variant="compact" />
                  ))}
                </div>
                {dealsA.length > 6 && (
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href={`/deals/seo/${parsed.brandA}-under-500`}>
                      View All {brandAName} Deals
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                )}
              </div>
              
              {/* Brand B Deals */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    {brandBName} Deals
                  </h3>
                  <Badge variant="outline">{statsB.dealCount} deals</Badge>
                </div>
                <div className="grid gap-4">
                  {dealsB.slice(0, 6).map((deal) => (
                    <DealCard key={deal.id} deal={deal} variant="compact" />
                  ))}
                </div>
                {dealsB.length > 6 && (
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href={`/deals/seo/${parsed.brandB}-under-500`}>
                      View All {brandBName} Deals
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </PageContainer>
        </section>
        
        {/* Internal Links */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <h2 className="text-xl font-bold text-foreground mb-6">
              Shop by Price Range
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Brand A Price Links */}
              <div>
                <h3 className="font-medium text-muted-foreground mb-3">{brandAName}</h3>
                <div className="flex flex-wrap gap-2">
                  {[50, 100, 200, 500, 1000].map((price) => (
                    <Link
                      key={`${parsed.brandA}-${price}`}
                      href={`/deals/seo/${parsed.brandA}-under-${price}`}
                      className="px-4 py-2 rounded-full border border-border text-sm hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      Under ${price}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Brand B Price Links */}
              <div>
                <h3 className="font-medium text-muted-foreground mb-3">{brandBName}</h3>
                <div className="flex flex-wrap gap-2">
                  {[50, 100, 200, 500, 1000].map((price) => (
                    <Link
                      key={`${parsed.brandB}-${price}`}
                      href={`/deals/seo/${parsed.brandB}-under-${price}`}
                      className="px-4 py-2 rounded-full border border-border text-sm hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      Under ${price}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </PageContainer>
        </section>
        
        {/* FAQ Section */}
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-primary" />
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index}>
                    <CardContent className="py-4">
                      <h3 className="font-semibold text-foreground mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </PageContainer>
        </section>
        
        {/* Related Comparisons */}
        <section className="py-10 md:py-12">
          <PageContainer>
            <SectionHeading description="Explore more brand comparisons">
              Related Comparisons
            </SectionHeading>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {POPULAR_DEAL_COMPARISONS
                .filter(s => s !== slug)
                .slice(0, 8)
                .map((comparison) => {
                  const p = parseComparisonSlug(comparison)
                  if (!p) return null
                  return (
                    <Link
                      key={comparison}
                      href={`/deals/compare/${comparison}`}
                      className="p-4 rounded-lg border border-border bg-card hover:border-primary transition-colors text-center"
                    >
                      <span className="text-sm font-medium">
                        {formatDisplayName(p.brandA)} vs {formatDisplayName(p.brandB)}
                      </span>
                    </Link>
                  )
                })}
            </div>
          </PageContainer>
        </section>
      </main>

      <Footer />
    </div>
  )
}
