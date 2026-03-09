import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DealCard } from "@/components/deal-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CapitalOnePromo } from "@/components/capital-one-promo"
import { PopularCategories } from "@/components/popular-categories"
import { PageContainer, DealGrid, SectionHeading } from "@/components/layout/page-container"
import { getDealsByStore } from "@/lib/deals"
import { getStoreInfo, formatRating, formatReviewCount } from "@/lib/deal-types"
import { 
  Store as StoreIcon,
  Sparkles,
  Star,
  Headphones,
  Shirt,
  Home,
  Laptop,
  ShoppingBag,
  ArrowRight,
  DollarSign,
  HelpCircle,
  ChevronRight,
  Tag
} from "lucide-react"

// Revalidate pages every hour
export const revalidate = 3600

// Known stores (slug -> display name)
const knownStores: Record<string, string> = {
  'amazon': 'Amazon',
  'best-buy': 'Best Buy',
  'nike': 'Nike',
  'target': 'Target',
  'apple': 'Apple',
  'dyson': 'Dyson',
  'adidas': 'Adidas',
  'levis': "Levi's",
  'williams-sonoma': 'Williams Sonoma',
  'sunglass-hut': 'Sunglass Hut',
  'north-face': 'The North Face',
  'the-north-face': 'The North Face',
  'starbucks': 'Starbucks',
  'patagonia': 'Patagonia',
  'walmart': 'Walmart',
  'costco': 'Costco',
  'macys': "Macy's",
  'nordstrom': 'Nordstrom',
  'kohls': "Kohl's",
  'home-depot': 'Home Depot',
  'lowes': "Lowe's",
  'wayfair': 'Wayfair',
  'ikea': 'IKEA',
  'gap': 'Gap',
  'old-navy': 'Old Navy',
}

// Store semantic data for dynamic intros
const storeSemantics: Record<string, {
  description: string
  tagline: string
  specialties: string[]
  benefits: string[]
  founded?: string
  headquarters?: string
}> = {
  'amazon': {
    description: 'As the world\'s largest online marketplace, Amazon offers an unmatched selection of products across every category imaginable.',
    tagline: 'Everything you need, delivered fast',
    specialties: ['electronics', 'home essentials', 'books', 'fashion', 'groceries'],
    benefits: ['Prime fast shipping', 'Easy returns', 'Customer reviews', 'Subscribe & Save discounts'],
    founded: '1994',
    headquarters: 'Seattle, WA'
  },
  'best-buy': {
    description: 'Best Buy is America\'s leading electronics retailer, known for expert advice and competitive pricing on the latest tech.',
    tagline: 'Expert service. Unbeatable prices.',
    specialties: ['laptops', 'TVs', 'smartphones', 'gaming', 'smart home'],
    benefits: ['Price match guarantee', 'Geek Squad support', 'Free store pickup', 'Open-box deals'],
    founded: '1966',
    headquarters: 'Richfield, MN'
  },
  'nike': {
    description: 'Nike is the global leader in athletic footwear and apparel, inspiring athletes with innovative products and iconic designs.',
    tagline: 'Just Do It',
    specialties: ['sneakers', 'running shoes', 'athletic apparel', 'basketball gear', 'training equipment'],
    benefits: ['Nike Member rewards', 'Free shipping over $50', '60-day returns', 'Exclusive drops'],
    founded: '1964',
    headquarters: 'Beaverton, OR'
  },
  'target': {
    description: 'Target combines style, quality, and value, offering everything from trendy home decor to everyday essentials.',
    tagline: 'Expect More. Pay Less.',
    specialties: ['home decor', 'fashion', 'beauty', 'groceries', 'kids & baby'],
    benefits: ['RedCard 5% savings', 'Same-day delivery', 'Drive Up service', 'Target Circle rewards'],
    founded: '1962',
    headquarters: 'Minneapolis, MN'
  },
  'walmart': {
    description: 'Walmart is America\'s everyday low-price leader, serving millions with affordable products and convenient shopping options.',
    tagline: 'Save Money. Live Better.',
    specialties: ['groceries', 'electronics', 'home goods', 'pharmacy', 'outdoor'],
    benefits: ['Everyday low prices', 'Walmart+ benefits', 'Free pickup', 'Rollback deals'],
    founded: '1962',
    headquarters: 'Bentonville, AR'
  },
  'costco': {
    description: 'Costco delivers exceptional value through membership-based bulk shopping, featuring quality products at warehouse prices.',
    tagline: 'Quality goods. Great prices.',
    specialties: ['bulk groceries', 'electronics', 'furniture', 'jewelry', 'pharmacy'],
    benefits: ['Member-only prices', 'Kirkland quality', 'Generous returns', 'Executive rewards'],
    founded: '1983',
    headquarters: 'Issaquah, WA'
  },
  'apple': {
    description: 'Apple creates premium technology products that seamlessly integrate hardware, software, and services for an unmatched user experience.',
    tagline: 'Think Different',
    specialties: ['iPhones', 'MacBooks', 'iPads', 'Apple Watch', 'AirPods'],
    benefits: ['AppleCare support', 'Trade-in program', 'Free engraving', 'Apple Card financing'],
    founded: '1976',
    headquarters: 'Cupertino, CA'
  },
  'dyson': {
    description: 'Dyson engineers revolutionary home appliances that solve everyday problems with cutting-edge technology and sleek design.',
    tagline: 'Engineered for performance',
    specialties: ['vacuums', 'air purifiers', 'hair tools', 'fans', 'heaters'],
    benefits: ['Powerful suction', 'HEPA filtration', 'Cordless convenience', '2-year warranty'],
    founded: '1991',
    headquarters: 'Malmesbury, UK'
  },
  'adidas': {
    description: 'Adidas combines sport and street style, creating performance footwear and apparel that pushes boundaries and inspires creativity.',
    tagline: 'Impossible Is Nothing',
    specialties: ['sneakers', 'running shoes', 'activewear', 'soccer gear', 'Originals lifestyle'],
    benefits: ['adiClub rewards', 'Free returns', 'Sustainable products', 'Creator\'s Club perks'],
    founded: '1949',
    headquarters: 'Herzogenaurach, Germany'
  },
  'home-depot': {
    description: 'Home Depot is America\'s largest home improvement retailer, empowering DIYers and pros with tools, materials, and expertise.',
    tagline: 'How doers get more done',
    specialties: ['tools', 'lumber', 'appliances', 'flooring', 'outdoor living'],
    benefits: ['Pro Xtra rewards', 'Free delivery over $45', 'Tool rental', 'Installation services'],
    founded: '1978',
    headquarters: 'Atlanta, GA'
  },
  'lowes': {
    description: 'Lowe\'s helps homeowners bring their vision to life with quality products, helpful service, and competitive prices.',
    tagline: 'Do it right for less',
    specialties: ['appliances', 'tools', 'flooring', 'paint', 'outdoor'],
    benefits: ['MyLowe\'s rewards', 'Price match', 'Free delivery', 'Installation services'],
    founded: '1946',
    headquarters: 'Mooresville, NC'
  },
  'macys': {
    description: 'Macy\'s is America\'s iconic department store, offering fashion, beauty, and home products from beloved and exclusive brands.',
    tagline: 'The magic of Macy\'s',
    specialties: ['fashion', 'beauty', 'home decor', 'jewelry', 'shoes'],
    benefits: ['Star Rewards', 'Free shipping over $25', 'Price match', 'Store pickup'],
    founded: '1858',
    headquarters: 'New York, NY'
  },
  'nordstrom': {
    description: 'Nordstrom delivers exceptional service and curated fashion from designer and contemporary brands.',
    tagline: 'Shop with style',
    specialties: ['designer fashion', 'shoes', 'beauty', 'accessories', 'home'],
    benefits: ['Free shipping & returns', 'Personal stylists', 'Nordstrom Rewards', 'Alterations'],
    founded: '1901',
    headquarters: 'Seattle, WA'
  },
  'wayfair': {
    description: 'Wayfair is the destination for home goods, offering millions of products to create your perfect living space.',
    tagline: 'A zillion things home',
    specialties: ['furniture', 'decor', 'bedding', 'lighting', 'outdoor'],
    benefits: ['Free shipping over $35', 'Daily sales', 'Room ideas', 'Easy returns'],
    founded: '2002',
    headquarters: 'Boston, MA'
  },
  'ikea': {
    description: 'IKEA makes well-designed, functional home furnishings accessible to everyone with affordable prices and flat-pack convenience.',
    tagline: 'The wonderful everyday',
    specialties: ['furniture', 'storage', 'kitchens', 'home decor', 'lighting'],
    benefits: ['Flat-pack savings', 'IKEA Family rewards', 'Click & Collect', 'Assembly services'],
    founded: '1943',
    headquarters: 'Delft, Netherlands'
  },
  'gap': {
    description: 'Gap offers classic American style with modern sensibility, featuring quality basics and casual wear for the whole family.',
    tagline: 'Be your own generation',
    specialties: ['casual wear', 'denim', 'basics', 'kids clothing', 'activewear'],
    benefits: ['Gap Cash rewards', 'Free shipping over $50', 'Easy returns', 'Quality basics'],
    founded: '1969',
    headquarters: 'San Francisco, CA'
  },
  'old-navy': {
    description: 'Old Navy delivers fun, affordable fashion for the entire family with trendy styles and unbeatable value.',
    tagline: 'Hi, icons',
    specialties: ['family fashion', 'activewear', 'kids clothing', 'basics', 'swimwear'],
    benefits: ['Super Cash rewards', 'Affordable prices', 'Family sizes', 'Frequent sales'],
    founded: '1994',
    headquarters: 'San Francisco, CA'
  },
  'kohls': {
    description: 'Kohl\'s is a leading omnichannel retailer offering quality brands for the home and family at incredible savings.',
    tagline: 'Expect great things',
    specialties: ['home goods', 'fashion', 'shoes', 'kids', 'kitchen'],
    benefits: ['Kohl\'s Cash', 'Yes2You rewards', 'Amazon returns', 'Curbside pickup'],
    founded: '1962',
    headquarters: 'Menomonee Falls, WI'
  },
  'north-face': {
    description: 'The North Face creates innovative outdoor apparel and equipment for explorers, athletes, and urban adventurers.',
    tagline: 'Never stop exploring',
    specialties: ['jackets', 'outdoor gear', 'backpacks', 'hiking boots', 'fleece'],
    benefits: ['Lifetime warranty', 'XPLR Pass rewards', 'Pro deals', 'Renewed program'],
    founded: '1966',
    headquarters: 'Denver, CO'
  },
  'the-north-face': {
    description: 'The North Face creates innovative outdoor apparel and equipment for explorers, athletes, and urban adventurers.',
    tagline: 'Never stop exploring',
    specialties: ['jackets', 'outdoor gear', 'backpacks', 'hiking boots', 'fleece'],
    benefits: ['Lifetime warranty', 'XPLR Pass rewards', 'Pro deals', 'Renewed program'],
    founded: '1966',
    headquarters: 'Denver, CO'
  },
  'patagonia': {
    description: 'Patagonia builds the best products with minimal environmental impact, inspiring solutions to the environmental crisis.',
    tagline: 'We\'re in business to save our home planet',
    specialties: ['outdoor apparel', 'fleece', 'jackets', 'climbing gear', 'surf gear'],
    benefits: ['Ironclad guarantee', 'Worn Wear program', 'Repair services', 'Fair Trade'],
    founded: '1973',
    headquarters: 'Ventura, CA'
  },
  'levis': {
    description: 'Levi\'s is the original and most iconic denim brand, crafting quality jeans and apparel since 1853.',
    tagline: 'Live in Levi\'s',
    specialties: ['jeans', 'denim jackets', 'shorts', 'trucker jackets', 'casual wear'],
    benefits: ['Red Tab rewards', 'Free shipping over $100', 'Lifetime quality', 'Tailoring services'],
    founded: '1853',
    headquarters: 'San Francisco, CA'
  },
}

// Price filter options
const priceFilters = [
  { value: 50, label: 'Under $50' },
  { value: 100, label: 'Under $100' },
  { value: 200, label: 'Under $200' },
  { value: 500, label: 'Under $500' },
  { value: 1000, label: 'Under $1000' },
]

// Product categories for navigation
const productCategories: Record<string, { name: string; icon: typeof Headphones }> = {
  'headphones': { name: 'Headphones', icon: Headphones },
  'running-shoes': { name: 'Running Shoes', icon: ShoppingBag },
  'laptops': { name: 'Laptops', icon: Laptop },
  'tvs': { name: 'TVs', icon: Laptop },
  'smartphones': { name: 'Smartphones', icon: Laptop },
  'jeans': { name: 'Jeans', icon: Shirt },
  'jackets': { name: 'Jackets', icon: Shirt },
  'sneakers': { name: 'Sneakers', icon: ShoppingBag },
  'coffee-makers': { name: 'Coffee Makers', icon: Home },
  'vacuums': { name: 'Vacuums', icon: Home },
  'kitchen': { name: 'Kitchen', icon: Home },
  'electronics': { name: 'Electronics', icon: Laptop },
  'fashion': { name: 'Fashion', icon: Shirt },
  'home-kitchen': { name: 'Home & Kitchen', icon: Home },
}

interface PageProps {
  params: Promise<{ store: string }>
}

// Generate dynamic intro content (120-200 words)
function generateStoreIntro(storeName: string, storeSlug: string, dealCount: number): string {
  const semantics = storeSemantics[storeSlug]
  const year = new Date().getFullYear()
  
  if (semantics) {
    return `${semantics.description} In ${year}, ${storeName} continues to offer exceptional value for shoppers seeking quality products at competitive prices.

Our team at SaveSmart tracks ${storeName} deals around the clock, comparing prices across multiple retailers to ensure you're getting the best possible discount. With ${dealCount > 0 ? `${dealCount}+ active deals` : 'deals updated daily'} available, you'll find savings on ${semantics.specialties.slice(0, 3).join(', ')}, and more.

${storeName} shoppers enjoy ${semantics.benefits.slice(0, 2).join(' and ')}. Whether you're looking for everyday essentials or premium products, our curated ${storeName} deals help you save without sacrificing quality. Every listing is verified for accuracy and updated hourly to reflect the latest prices and availability.`
  }
  
  // Generic intro for stores without semantic data
  return `Discover the best ${storeName} deals and discounts in ${year}. SaveSmart compares prices across major retailers to bring you verified savings on your favorite ${storeName} products.

Our deal hunters track ${storeName} promotions daily, surfacing the deepest discounts and exclusive offers. With ${dealCount > 0 ? `${dealCount}+ active deals` : 'deals updated daily'}, you'll find something perfect for every budget.

From seasonal sales to everyday low prices, ${storeName} consistently delivers value. Browse our curated collection and start saving today—every deal is verified and updated hourly for accuracy.`
}

// Generate store FAQs
function generateStoreFAQs(storeName: string, storeSlug: string): { question: string; answer: string }[] {
  const semantics = storeSemantics[storeSlug]
  const currentYear = new Date().getFullYear()
  
  const faqs = [
    {
      question: `How do I find the best ${storeName} deals?`,
      answer: `SaveSmart automatically compares ${storeName} prices across 100+ retailers to find the deepest discounts. Simply browse our ${storeName} deals page to see all active promotions, sorted by discount percentage. You can also filter by price range or category to find exactly what you're looking for.`
    },
    {
      question: `Are ${storeName} deals on SaveSmart verified?`,
      answer: `Yes, all ${storeName} deals on SaveSmart are verified hourly by our automated system. We check product availability, current prices, and discount accuracy to ensure you're seeing legitimate savings. Deals that expire or become unavailable are automatically removed.`
    },
    {
      question: `Does ${storeName} offer free shipping?`,
      answer: semantics 
        ? `${storeName} offers various shipping options. ${semantics.benefits.find(b => b.toLowerCase().includes('shipping')) || 'Check the product page for current shipping promotions and free shipping thresholds.'}`
        : `${storeName} shipping policies vary by product and order total. Many items qualify for free shipping, especially during sales events. Check the product page for current shipping options.`
    },
    {
      question: `What are the best ${storeName} sales in ${currentYear}?`,
      answer: `Major ${storeName} sales include Black Friday, Cyber Monday, Prime Day (for Amazon), Memorial Day, Labor Day, and holiday sales. SaveSmart tracks all ${storeName} promotions year-round, so you'll never miss a deal. Sign up for our deal alerts to get notified of flash sales.`
    },
    {
      question: `Can I return products purchased through ${storeName} deals?`,
      answer: semantics 
        ? `${storeName}'s return policy applies to all purchases. ${semantics.benefits.find(b => b.toLowerCase().includes('return')) || 'Most items can be returned within the standard return window.'} Check the specific product page for any exceptions or sale-item restrictions.`
        : `${storeName} has a standard return policy for most products. Sale items may have different return terms, so check the product page for specific details. SaveSmart recommends reviewing return policies before purchasing.`
    }
  ]
  
  return faqs
}

// Generate structured data for the page
function generateStoreStructuredData(
  storeName: string,
  storeSlug: string,
  deals: { title: string; description: string; deal_price: number; slug?: string | null }[],
  faqs: { question: string; answer: string }[]
) {
  const baseUrl = 'https://savesmart.bio'
  const semantics = storeSemantics[storeSlug]
  
  // CollectionPage schema
  const collectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${storeName} Deals`,
    description: semantics?.description || `Save big on ${storeName} products. Verified deals and coupon codes updated daily.`,
    url: `${baseUrl}/deals/store/${storeSlug}`,
    numberOfItems: deals.length,
    provider: {
      "@type": "Organization",
      name: "SaveSmart",
      url: baseUrl
    },
    itemListElement: deals.slice(0, 10).map((deal, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: deal.title,
        description: deal.description,
        offers: {
          "@type": "Offer",
          price: deal.deal_price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        url: deal.slug ? `${baseUrl}/deal/${deal.slug}` : undefined,
      },
    })),
  }
  
  // FAQ schema
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
  
  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Deals",
        item: `${baseUrl}/deals`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: storeName,
        item: `${baseUrl}/deals/store/${storeSlug}`
      }
    ]
  }
  
  return { collectionPage, faqSchema, breadcrumbSchema }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { store } = await params
  const storeSlug = store.toLowerCase()
  const storeName = knownStores[storeSlug] || storeSlug.replace(/-/g, ' ')
  
  return {
    title: `${storeName} Deals & Coupons - Up to 70% Off | SaveSmart`,
    description: `Find the best ${storeName} deals, discounts, and coupon codes. Save money on your favorite products with verified offers updated daily.`,
    openGraph: {
      title: `${storeName} Deals & Coupons | SaveSmart`,
      description: `Discover exclusive ${storeName} deals and save up to 70%. Verified coupons and discounts updated hourly.`,
      type: 'website',
    },
    alternates: {
      canonical: `/deals/store/${storeSlug}`,
    },
  }
}

export async function generateStaticParams() {
  return Object.keys(knownStores).map((store) => ({
    store,
  }))
}

export default async function StoreDealsPage({ params }: PageProps) {
  const { store } = await params
  const storeSlug = store.toLowerCase()
  const storeName = knownStores[storeSlug]
  
  // Only allow known stores
  if (!storeName) {
    notFound()
  }
  
  const deals = await getDealsByStore(storeName, 24)
  
  const featuredDeals = deals.slice(0, 3)
  const regularDeals = deals.slice(3)
  
  const storeInfo = getStoreInfo(storeName)
  const semantics = storeSemantics[storeSlug]
  
  // Generate dynamic content
  const storeIntro = generateStoreIntro(storeName, storeSlug, deals.length)
  const faqs = generateStoreFAQs(storeName, storeSlug)
  const schemas = generateStoreStructuredData(storeName, storeSlug, deals, faqs)
  
  // Color mapping for store hero
  const colorMap: Record<string, string> = {
    'bg-[#FF9900]': 'from-[#FF9900] to-[#e88a00]',
    'bg-[#0046BE]': 'from-[#0046BE] to-[#003699]',
    'bg-black': 'from-zinc-800 to-zinc-900',
    'bg-[#CC0000]': 'from-[#CC0000] to-[#aa0000]',
  }
  const bgColor = colorMap[storeInfo.color] || 'from-primary to-primary/80'
  
  const relatedStores = Object.entries(knownStores).filter(([slug]) => slug !== storeSlug).slice(0, 8)
  const relatedCategories = Object.entries(productCategories).slice(0, 12)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* CollectionPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.collectionPage) }}
      />
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faqSchema) }}
      />
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumbSchema) }}
      />
      
      <main className="pt-16">
        {/* Hero */}
        <section className={`relative bg-gradient-to-br ${bgColor} text-white py-14 md:py-16 overflow-hidden`}>
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
              <span className="text-white/50">/</span>
              <Link 
                href="/deals" 
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                Deals
              </Link>
              <span className="text-white/50">/</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
                {storeName}
              </span>
            </nav>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <StoreIcon className="h-6 w-6" />
              </div>
              <span className="text-white/70 uppercase tracking-wider text-sm font-medium">Store</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Best {storeName} Deals Today
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mb-4">
              {semantics?.tagline || `Save big on your favorite ${storeName} products`}. Verified deals updated hourly.
            </p>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {deals.length} Active Deals
              </Badge>
              <div className="flex items-center gap-1 text-white/80">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm">
                  {formatRating(storeInfo.rating)} ({formatReviewCount(storeInfo.reviewCount)} reviews)
                </span>
              </div>
            </div>
          </PageContainer>
        </section>

        {/* Price Filters */}
        <section className="py-6 border-b border-border">
          <PageContainer>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Filter by Price:
              </span>
              <div className="flex flex-wrap gap-2">
                {priceFilters.map((filter) => (
                  <Link
                    key={filter.value}
                    href={`/deals/seo/${storeSlug}-under-${filter.value}`}
                    className="px-4 py-2 rounded-full border border-border text-sm font-medium hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    {filter.label}
                  </Link>
                ))}
              </div>
            </div>
          </PageContainer>
        </section>

        {/* Capital One Promo */}
        <section className="py-8">
          <PageContainer>
            <CapitalOnePromo variant="inline" />
          </PageContainer>
        </section>

        {/* Featured Deals */}
        {featuredDeals.length > 0 && (
          <section className="py-10 md:py-12">
            <PageContainer>
              <SectionHeading>Top {storeName} Deals</SectionHeading>
              <DealGrid columns={3}>
                {featuredDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} variant="featured" />
                ))}
              </DealGrid>
            </PageContainer>
          </section>
        )}

        {/* All Deals */}
        <section className="bg-muted/30 py-10 md:py-12">
          <PageContainer>
            <SectionHeading>All {storeName} Deals</SectionHeading>
            {regularDeals.length > 0 ? (
              <DealGrid columns={4}>
                {regularDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </DealGrid>
            ) : featuredDeals.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="py-12 text-center">
                  <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No deals found</h3>
                  <p className="text-muted-foreground mb-4">Check back soon for new {storeName} deals!</p>
                  <Button variant="outline" asChild>
                    <Link href="/deals">Browse All Deals</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : null}
          </PageContainer>
        </section>

        {/* SEO Content Section */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                About {storeName} Deals
              </h2>
              <div className="prose prose-muted max-w-none space-y-4">
                {storeIntro.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              {/* Store Info */}
              {semantics && (
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <Card className="border-border/50">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Tag className="h-4 w-4 text-primary" />
                        {storeName} Specialties
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {semantics.specialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="capitalize">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border/50">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        {storeName} Benefits
                      </h3>
                      <ul className="space-y-1.5 text-sm text-muted-foreground">
                        {semantics.benefits.map((benefit) => (
                          <li key={benefit} className="flex items-start gap-2">
                            <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </PageContainer>
        </section>

        {/* FAQ Section */}
        <section className="py-10 md:py-12 bg-muted/30">
          <PageContainer>
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-primary" />
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index} className="border-border/50">
                    <CardContent className="pt-6">
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

        {/* Store + Category Cross Links */}
        <section className="py-10 md:py-12 border-t border-border">
          <PageContainer>
            <h2 className="text-xl font-bold text-foreground mb-6">
              {storeName} Deals by Category
            </h2>
            <div className="flex flex-wrap gap-2">
              {relatedCategories.map(([catSlug, cat]) => (
                <Link
                  key={catSlug}
                  href={`/deals/store/${storeSlug}/${catSlug}`}
                  className="px-4 py-2 rounded-full border border-border text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {storeName} {cat.name}
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Internal Links - Related Stores */}
        <section className="pb-10 md:pb-12">
          <PageContainer>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Shop by Store</h2>
              <Link href="/deals" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
              {relatedStores.map(([slug, name]) => {
                const info = getStoreInfo(name)
                const isActive = slug === storeSlug
                return (
                  <Link
                    key={slug}
                    href={`/deals/store/${slug}`}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors ${
                      isActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    <div className={`${info.color} h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                      {name.charAt(0)}
                    </div>
                    <span className="text-xs font-medium text-foreground text-center">{name}</span>
                  </Link>
                )
              })}
            </div>
          </PageContainer>
        </section>

        <PopularCategories />

        {/* CTA */}
        <section className="py-10 md:py-12 text-center border-t border-border">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground mb-2">Looking for a specific {storeName} deal?</h2>
            <p className="text-muted-foreground mb-6">Our AI can help you find exactly what you need at the best price.</p>
            <Button size="lg" className="gap-2" asChild>
              <Link href="/deal-finder">
                <Sparkles className="h-5 w-5" />
                Ask AI Deal Finder
              </Link>
            </Button>
          </PageContainer>
        </section>
      </main>

      <Footer />
    </div>
  )
}
