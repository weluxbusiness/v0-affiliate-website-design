import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DealCard } from "@/components/deal-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageContainer, DealGrid, SectionHeading } from "@/components/layout/page-container"
import { searchDeals, getDealsByCategory } from "@/lib/deals"
import { 
  ArrowRight,
  Tag,
  Sparkles,
  Laptop,
  Headphones,
  Shirt,
  Home,
  Gamepad2,
  Smartphone,
  ShoppingBag,
  ChevronRight,
  DollarSign,
  Store
} from "lucide-react"

// Revalidate every hour
export const revalidate = 3600

// Category hub data with comprehensive info
const categoryHubs: Record<string, {
  name: string
  displayName: string
  description: string
  metaDescription: string
  icon: typeof Laptop
  color: string
  searchTerms: string[]
  priceRanges: number[]
  topBrands: { slug: string; name: string }[]
  relatedCategories: { slug: string; name: string }[]
  faqs: { question: string; answer: string }[]
  introContent: string
}> = {
  'electronics': {
    name: 'electronics',
    displayName: 'Electronics',
    description: 'Laptops, TVs, smartphones, and more tech deals',
    metaDescription: 'Find the best electronics deals in 2026. Compare prices on laptops, TVs, smartphones, tablets, and more from top retailers like Amazon, Best Buy, and Walmart.',
    icon: Laptop,
    color: 'bg-blue-600',
    searchTerms: ['electronics', 'tech', 'gadgets', 'devices'],
    priceRanges: [50, 100, 200, 300, 500, 1000],
    topBrands: [
      { slug: 'apple', name: 'Apple' },
      { slug: 'samsung', name: 'Samsung' },
      { slug: 'sony', name: 'Sony' },
      { slug: 'lg', name: 'LG' },
      { slug: 'dell', name: 'Dell' },
      { slug: 'hp', name: 'HP' },
      { slug: 'lenovo', name: 'Lenovo' },
      { slug: 'bose', name: 'Bose' },
    ],
    relatedCategories: [
      { slug: 'laptops', name: 'Laptops' },
      { slug: 'headphones', name: 'Headphones' },
      { slug: 'tvs', name: 'TVs' },
      { slug: 'smartphones', name: 'Smartphones' },
      { slug: 'tablets', name: 'Tablets' },
      { slug: 'smartwatches', name: 'Smartwatches' },
    ],
    faqs: [
      {
        question: 'What are the best electronics deals available today?',
        answer: 'We track thousands of electronics deals daily from major retailers like Amazon, Best Buy, Walmart, and Target. Our top picks include discounts on laptops, TVs, headphones, and smartphones, with savings up to 60% off retail prices.'
      },
      {
        question: 'How often are electronics deals updated?',
        answer: 'Our electronics deals are refreshed every hour to ensure you see the most current prices and discounts. Each listing shows when it was last verified, so you know you\'re getting accurate, up-to-date information.'
      },
      {
        question: 'Which stores offer the best electronics discounts?',
        answer: 'Amazon, Best Buy, and Walmart typically offer the most competitive electronics prices. However, deals vary by product category—Best Buy often leads on TVs and computers, while Amazon excels on accessories and smart home devices.'
      },
      {
        question: 'How can I find the lowest price on electronics?',
        answer: 'Use our price comparison tool to see prices across multiple retailers instantly. We also show price history where available, helping you determine if a deal is truly a good value or if you should wait for a better discount.'
      },
      {
        question: 'Are refurbished electronics deals worth considering?',
        answer: 'Certified refurbished electronics from authorized sellers can offer 20-40% savings over new items. Look for manufacturer-certified products with warranty coverage for the best combination of savings and peace of mind.'
      },
    ],
    introContent: `Electronics deals have never been better than in 2026. From cutting-edge laptops with the latest processors to stunning 4K OLED TVs, smart home devices, and premium headphones, our curated collection helps you find the perfect tech at the right price.

We compare prices across Amazon, Best Buy, Walmart, Target, Costco, and dozens of specialty retailers to surface the deepest discounts on genuine electronics. Whether you're upgrading your home office, building a gaming setup, or simply looking for everyday tech essentials, our deal hunters work around the clock to find savings.

Browse by price range to stay within budget, or explore by brand to find deals from trusted names like Apple, Samsung, Sony, and more. Every deal is verified hourly for accuracy, and our editorial team highlights the standout values you shouldn't miss.`
  },
  'laptops': {
    name: 'laptops',
    displayName: 'Laptops',
    description: 'Gaming laptops, MacBooks, Chromebooks, and ultrabooks',
    metaDescription: 'Compare laptop deals from top brands. Find discounts on gaming laptops, MacBooks, Chromebooks, and business ultrabooks from Amazon, Best Buy, and more.',
    icon: Laptop,
    color: 'bg-indigo-600',
    searchTerms: ['laptop', 'notebook', 'macbook', 'chromebook', 'ultrabook'],
    priceRanges: [300, 500, 750, 1000, 1500, 2000],
    topBrands: [
      { slug: 'apple', name: 'Apple' },
      { slug: 'dell', name: 'Dell' },
      { slug: 'hp', name: 'HP' },
      { slug: 'lenovo', name: 'Lenovo' },
      { slug: 'asus', name: 'ASUS' },
      { slug: 'acer', name: 'Acer' },
      { slug: 'microsoft', name: 'Microsoft' },
      { slug: 'razer', name: 'Razer' },
    ],
    relatedCategories: [
      { slug: 'gaming-laptops', name: 'Gaming Laptops' },
      { slug: 'chromebooks', name: 'Chromebooks' },
      { slug: 'macbooks', name: 'MacBooks' },
      { slug: 'ultrabooks', name: 'Ultrabooks' },
      { slug: 'tablets', name: 'Tablets' },
      { slug: 'monitors', name: 'Monitors' },
    ],
    faqs: [
      {
        question: 'What is the best laptop deal right now?',
        answer: 'The best laptop deals change daily. Currently, we\'re seeing strong discounts on Dell XPS models, Lenovo ThinkPads, and HP Pavilions. MacBook deals are also available, especially on previous-generation models.'
      },
      {
        question: 'What laptop specs should I look for under $500?',
        answer: 'For laptops under $500, prioritize at least 8GB RAM, a 256GB SSD, and a modern processor (Intel 12th gen or AMD Ryzen 5000 series). These specs handle everyday tasks, web browsing, and light productivity well.'
      },
      {
        question: 'When is the best time to buy a laptop?',
        answer: 'The best laptop deals typically appear during Black Friday, back-to-school season (July-August), Prime Day, and when new models launch. However, we track deals year-round and often find comparable savings outside these windows.'
      },
      {
        question: 'Are gaming laptops worth the premium price?',
        answer: 'Gaming laptops offer dedicated graphics cards essential for gaming and creative work. If you need portability and gaming capability, they\'re worth it. Otherwise, a desktop gaming PC offers better value for pure gaming performance.'
      },
      {
        question: 'Should I buy a laptop online or in-store?',
        answer: 'Online shopping typically offers better prices and selection. However, buying in-store lets you test the keyboard and screen. We recommend researching online, then visiting a store to try your top picks before purchasing wherever offers the best deal.'
      },
    ],
    introContent: `Finding the perfect laptop at the right price requires comparing deals across dozens of retailers. Our laptop hub aggregates discounts from Amazon, Best Buy, Walmart, Costco, and manufacturer stores to help you save on your next portable computer.

From lightweight ultrabooks for business travelers to powerful gaming laptops with RTX graphics, we track every major laptop category. Whether you need a budget Chromebook for basic tasks, a MacBook for creative work, or a high-performance workstation, our deal finders surface the best values daily.

Browse laptops by price range to stay within budget, or filter by brand to find deals on your preferred manufacturer. Our editors highlight standout deals with exceptional value, and every listing shows the original price alongside the discount so you know exactly what you're saving.`
  },
  'headphones': {
    name: 'headphones',
    displayName: 'Headphones',
    description: 'Wireless earbuds, noise-cancelling headphones, and gaming headsets',
    metaDescription: 'Find the best headphone deals in 2026. Compare prices on AirPods, Sony WH-1000XM5, Bose headphones, and wireless earbuds from top retailers.',
    icon: Headphones,
    color: 'bg-purple-600',
    searchTerms: ['headphones', 'earbuds', 'airpods', 'wireless', 'noise-cancelling'],
    priceRanges: [25, 50, 100, 150, 200, 300],
    topBrands: [
      { slug: 'apple', name: 'Apple' },
      { slug: 'sony', name: 'Sony' },
      { slug: 'bose', name: 'Bose' },
      { slug: 'samsung', name: 'Samsung' },
      { slug: 'beats', name: 'Beats' },
      { slug: 'sennheiser', name: 'Sennheiser' },
      { slug: 'jabra', name: 'Jabra' },
      { slug: 'jbl', name: 'JBL' },
    ],
    relatedCategories: [
      { slug: 'wireless-earbuds', name: 'Wireless Earbuds' },
      { slug: 'airpods', name: 'AirPods' },
      { slug: 'noise-cancelling', name: 'Noise-Cancelling' },
      { slug: 'gaming-headsets', name: 'Gaming Headsets' },
      { slug: 'speakers', name: 'Speakers' },
      { slug: 'soundbars', name: 'Soundbars' },
    ],
    faqs: [
      {
        question: 'What are the best headphone deals available now?',
        answer: 'We\'re currently tracking great deals on Sony WH-1000XM5 headphones, Apple AirPods Pro, and Bose QuietComfort models. Budget options from JBL and Anker also offer excellent value under $100.'
      },
      {
        question: 'Are wireless headphones better than wired?',
        answer: 'Wireless headphones offer convenience and freedom of movement. However, wired headphones typically provide better audio quality at the same price point and never need charging. Choose based on your priorities.'
      },
      {
        question: 'What should I look for in noise-cancelling headphones?',
        answer: 'Key features include effective ANC (active noise cancellation), comfortable fit for long wear, good battery life (20+ hours), and quality microphones for calls. Sony, Bose, and Apple lead in ANC technology.'
      },
      {
        question: 'Are AirPods worth the price?',
        answer: 'AirPods offer seamless Apple ecosystem integration, easy pairing, and solid audio quality. If you use Apple devices, they\'re worth considering. Android users may find better value with Samsung Galaxy Buds or Sony earbuds.'
      },
      {
        question: 'How do I find the best headphone discounts?',
        answer: 'We track prices across all major retailers and alert you to significant drops. The biggest headphone discounts typically occur during Black Friday, Prime Day, and when new models launch.'
      },
    ],
    introContent: `The right headphones transform how you experience music, podcasts, calls, and gaming. Our headphone deals hub compares prices across Amazon, Best Buy, Walmart, Target, and specialty audio retailers to help you find premium audio at budget-friendly prices.

From top-tier noise-cancelling headphones like the Sony WH-1000XM5 and Bose QuietComfort to affordable wireless earbuds for everyday use, we track every major audio category. Whether you're a commuter needing ANC, a gamer seeking spatial audio, or a runner wanting secure-fit earbuds, we surface the best values.

Browse headphones by price range to match your budget, or explore by brand to find deals from trusted names. Our audio experts highlight exceptional values, and every listing shows verified discounts so you can shop with confidence.`
  },
}

// Generate additional categories dynamically
const additionalCategories = [
  { slug: 'tvs', name: 'TVs', icon: Laptop, color: 'bg-cyan-600', terms: ['tv', 'television', '4k', 'oled'] },
  { slug: 'smartphones', name: 'Smartphones', icon: Smartphone, color: 'bg-green-600', terms: ['phone', 'iphone', 'android'] },
  { slug: 'gaming', name: 'Gaming', icon: Gamepad2, color: 'bg-red-600', terms: ['gaming', 'console', 'playstation', 'xbox'] },
  { slug: 'fashion', name: 'Fashion', icon: Shirt, color: 'bg-pink-600', terms: ['fashion', 'clothing', 'apparel'] },
  { slug: 'home-kitchen', name: 'Home & Kitchen', icon: Home, color: 'bg-amber-600', terms: ['home', 'kitchen', 'appliance'] },
  { slug: 'sneakers', name: 'Sneakers', icon: ShoppingBag, color: 'bg-orange-600', terms: ['sneakers', 'shoes', 'running'] },
]

// Add default hub data for additional categories
for (const cat of additionalCategories) {
  if (!categoryHubs[cat.slug]) {
    categoryHubs[cat.slug] = {
      name: cat.slug,
      displayName: cat.name,
      description: `Best ${cat.name.toLowerCase()} deals and discounts`,
      metaDescription: `Find the best ${cat.name.toLowerCase()} deals in 2026. Compare prices and save on top ${cat.name.toLowerCase()} from major retailers.`,
      icon: cat.icon,
      color: cat.color,
      searchTerms: cat.terms,
      priceRanges: [25, 50, 100, 200, 300, 500],
      topBrands: [
        { slug: 'amazon', name: 'Amazon' },
        { slug: 'walmart', name: 'Walmart' },
        { slug: 'target', name: 'Target' },
        { slug: 'best-buy', name: 'Best Buy' },
      ],
      relatedCategories: [],
      faqs: [
        {
          question: `What are the best ${cat.name.toLowerCase()} deals today?`,
          answer: `We track hundreds of ${cat.name.toLowerCase()} deals daily from major retailers. Our top picks feature discounts up to 50% off from trusted sellers with verified pricing.`
        },
        {
          question: `How do I find ${cat.name.toLowerCase()} discounts?`,
          answer: `SaveSmart compares prices across Amazon, Walmart, Target, and 50+ other retailers to surface the best ${cat.name.toLowerCase()} deals. Browse by price range or brand to find what you need.`
        },
        {
          question: `When do ${cat.name.toLowerCase()} go on sale?`,
          answer: `The best ${cat.name.toLowerCase()} deals appear during Black Friday, Prime Day, and seasonal sales. However, we find excellent discounts year-round by monitoring prices continuously.`
        },
      ],
      introContent: `Discover the best ${cat.name.toLowerCase()} deals curated from top retailers. We compare prices across Amazon, Walmart, Best Buy, Target, and dozens of specialty stores to find genuine savings on ${cat.name.toLowerCase()} you'll love.`
    }
  }
}

interface PageProps {
  params: Promise<{ category: string }>
}

export async function generateStaticParams() {
  return Object.keys(categoryHubs).map(category => ({ category }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params
  const hub = categoryHubs[category]
  
  if (!hub) {
    return {
      title: 'Category Not Found | SaveSmart',
    }
  }
  
  const currentYear = new Date().getFullYear()
  
  return {
    title: `${hub.displayName} Deals & Discounts ${currentYear} | SaveSmart`,
    description: hub.metaDescription,
    openGraph: {
      title: `Best ${hub.displayName} Deals ${currentYear}`,
      description: hub.metaDescription,
      type: 'website',
    },
    alternates: {
      canonical: `/categories/${category}`,
    },
  }
}

export default async function CategoryHubPage({ params }: PageProps) {
  const { category } = await params
  const hub = categoryHubs[category]
  
  if (!hub) {
    notFound()
  }
  
  const currentYear = new Date().getFullYear()
  
  // Fetch deals for this category
  const searchResults = await Promise.all(
    hub.searchTerms.map(term => searchDeals(term, 6))
  )
  const allDeals = [...new Map(searchResults.flat().map(d => [d.id, d])).values()]
  const featuredDeals = allDeals.slice(0, 6)
  const moreDeals = allDeals.slice(6, 18)
  
  const Icon = hub.icon
  
  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: hub.faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
  
  // CollectionPage Schema
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${hub.displayName} Deals`,
    description: hub.metaDescription,
    url: `https://savesmart.bio/categories/${category}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: allDeals.length,
      itemListElement: featuredDeals.slice(0, 5).map((deal, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: deal.title,
          description: deal.description,
          offers: {
            "@type": "Offer",
            price: deal.sale_price,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
        },
      })),
    },
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
        item: "https://savesmart.bio",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Categories",
        item: "https://savesmart.bio/categories",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: hub.displayName,
        item: `https://savesmart.bio/categories/${category}`,
      },
    ],
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className={`relative ${hub.color} text-white py-16 md:py-20 overflow-hidden`}>
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,white)]" />
          <PageContainer className="relative">
            {/* Breadcrumbs */}
            <nav className="mb-6 flex items-center gap-2 text-sm">
              <Link 
                href="/" 
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                Home
              </Link>
              <ChevronRight className="h-4 w-4 text-white/50" />
              <Link 
                href="/deals" 
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                Deals
              </Link>
              <ChevronRight className="h-4 w-4 text-white/50" />
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
                {hub.displayName}
              </span>
            </nav>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                <Icon className="h-8 w-8" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {hub.displayName} Deals {currentYear}
            </h1>
            
            <p className="text-xl text-white/90 max-w-2xl mb-6">
              {hub.description}. Compare prices and save on top {hub.displayName.toLowerCase()} from major retailers.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-white/20 text-white border-0 px-4 py-2">
                <Sparkles className="h-4 w-4 mr-2" />
                {allDeals.length}+ Active Deals
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-0 px-4 py-2">
                <Store className="h-4 w-4 mr-2" />
                50+ Retailers
              </Badge>
            </div>
          </PageContainer>
        </section>
        
        {/* Intro Content */}
        <section className="py-10 md:py-12 border-b border-border">
          <PageContainer>
            <div className="max-w-4xl">
              <div className="prose prose-lg text-muted-foreground">
                {hub.introContent.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4 last:mb-0">{paragraph}</p>
                ))}
              </div>
            </div>
          </PageContainer>
        </section>
        
        {/* Best Deals Section */}
        {featuredDeals.length > 0 && (
          <section className="py-10 md:py-12">
            <PageContainer>
              <div className="flex items-center justify-between mb-8">
                <SectionHeading>Best {hub.displayName} Deals</SectionHeading>
                <Button variant="outline" asChild>
                  <Link href={`/deals/${category}`}>
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
              <DealGrid columns={3}>
                {featuredDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} variant="featured" />
                ))}
              </DealGrid>
            </PageContainer>
          </section>
        )}
        
        {/* More Deals */}
        {moreDeals.length > 0 && (
          <section className="py-10 md:py-12 bg-muted/30">
            <PageContainer>
              <SectionHeading>More {hub.displayName} Deals</SectionHeading>
              <DealGrid columns={4}>
                {moreDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </DealGrid>
            </PageContainer>
          </section>
        )}
        
        {/* Price Range Links */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {hub.displayName} by Price Range
              </h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Find {hub.displayName.toLowerCase()} that fit your budget
            </p>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
              {hub.priceRanges.map((price) => (
                <Link
                  key={price}
                  href={`/deals/seo/${category}-under-${price}`}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all hover:shadow-md"
                >
                  <span className="text-2xl font-bold text-foreground">${price}</span>
                  <span className="text-sm text-muted-foreground">& Under</span>
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>
        
        {/* Top Brands */}
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Tag className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Top {hub.displayName} Brands
              </h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Shop {hub.displayName.toLowerCase()} deals by brand
            </p>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
              {hub.topBrands.map((brand) => (
                <Link
                  key={brand.slug}
                  href={`/brands/${brand.slug}`}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border bg-background hover:border-primary hover:shadow-md transition-all"
                >
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground">
                    {brand.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-foreground text-center">
                    {brand.name}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button variant="outline" asChild>
                <Link href="/brands">
                  View All Brands
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </PageContainer>
        </section>
        
        {/* Related Categories */}
        {hub.relatedCategories.length > 0 && (
          <section className="py-10 md:py-12 border-t border-border">
            <PageContainer>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Related Categories
              </h2>
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
                {hub.relatedCategories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/categories/${cat.slug}`}
                    className="flex items-center justify-center gap-2 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {cat.name}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </PageContainer>
          </section>
        )}
        
        {/* FAQ Section */}
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl space-y-6">
              {hub.faqs.map((faq, index) => (
                <Card key={index} className="border-border/50">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </PageContainer>
        </section>
        
        {/* CTA Section */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-center text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Never Miss a {hub.displayName} Deal
              </h2>
              <p className="text-white/90 mb-6 max-w-xl mx-auto">
                Get instant alerts when prices drop on your favorite {hub.displayName.toLowerCase()}. Join thousands of smart shoppers saving every day.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/deals/trending">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Trending Deals
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
                  <Link href={`/deals/${category}`}>
                    Browse All {hub.displayName}
                  </Link>
                </Button>
              </div>
            </div>
          </PageContainer>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
