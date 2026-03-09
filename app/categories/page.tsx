import Link from "next/link"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageContainer, SectionHeading } from "@/components/layout/page-container"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Laptop,
  Headphones,
  Tv,
  Smartphone,
  Gamepad2,
  Shirt,
  Home,
  ShoppingBag,
  Watch,
  Camera,
  Dumbbell,
  Baby,
  PawPrint,
  Sparkles,
  ArrowRight
} from "lucide-react"

export const metadata: Metadata = {
  title: "Deal Categories | Browse Deals by Category | SaveSmart",
  description: "Explore deals organized by category. Find electronics, fashion, home & kitchen, gaming, and more deals from top retailers.",
  openGraph: {
    title: "Browse Deals by Category | SaveSmart",
    description: "Explore deals organized by category. Find electronics, fashion, home & kitchen, gaming, and more.",
    type: "website",
  },
  alternates: {
    canonical: "/categories",
  },
}

const categories = [
  {
    slug: "electronics",
    name: "Electronics",
    description: "Laptops, TVs, smartphones, tablets, and tech gadgets",
    icon: Laptop,
    color: "bg-blue-600",
    dealCount: "2,500+",
  },
  {
    slug: "laptops",
    name: "Laptops",
    description: "Gaming laptops, MacBooks, Chromebooks, ultrabooks",
    icon: Laptop,
    color: "bg-indigo-600",
    dealCount: "800+",
  },
  {
    slug: "headphones",
    name: "Headphones",
    description: "Wireless earbuds, ANC headphones, gaming headsets",
    icon: Headphones,
    color: "bg-purple-600",
    dealCount: "600+",
  },
  {
    slug: "tvs",
    name: "TVs",
    description: "4K TVs, OLED TVs, smart TVs, soundbars",
    icon: Tv,
    color: "bg-cyan-600",
    dealCount: "400+",
  },
  {
    slug: "smartphones",
    name: "Smartphones",
    description: "iPhones, Android phones, phone accessories",
    icon: Smartphone,
    color: "bg-green-600",
    dealCount: "500+",
  },
  {
    slug: "gaming",
    name: "Gaming",
    description: "Consoles, video games, gaming accessories",
    icon: Gamepad2,
    color: "bg-red-600",
    dealCount: "700+",
  },
  {
    slug: "fashion",
    name: "Fashion",
    description: "Clothing, shoes, accessories, jewelry",
    icon: Shirt,
    color: "bg-pink-600",
    dealCount: "3,000+",
  },
  {
    slug: "sneakers",
    name: "Sneakers",
    description: "Running shoes, basketball shoes, casual sneakers",
    icon: ShoppingBag,
    color: "bg-orange-600",
    dealCount: "900+",
  },
  {
    slug: "home-kitchen",
    name: "Home & Kitchen",
    description: "Appliances, cookware, furniture, decor",
    icon: Home,
    color: "bg-amber-600",
    dealCount: "1,500+",
  },
  {
    slug: "smartwatches",
    name: "Smartwatches",
    description: "Apple Watch, fitness trackers, smart bands",
    icon: Watch,
    color: "bg-teal-600",
    dealCount: "300+",
  },
  {
    slug: "cameras",
    name: "Cameras",
    description: "DSLR, mirrorless, action cameras, drones",
    icon: Camera,
    color: "bg-slate-600",
    dealCount: "250+",
  },
  {
    slug: "fitness",
    name: "Fitness",
    description: "Exercise equipment, yoga gear, supplements",
    icon: Dumbbell,
    color: "bg-emerald-600",
    dealCount: "400+",
  },
  {
    slug: "baby-kids",
    name: "Baby & Kids",
    description: "Toys, baby gear, kids clothing, games",
    icon: Baby,
    color: "bg-rose-600",
    dealCount: "600+",
  },
  {
    slug: "pets",
    name: "Pets",
    description: "Pet food, toys, accessories, grooming",
    icon: PawPrint,
    color: "bg-yellow-600",
    dealCount: "350+",
  },
]

export default function CategoriesPage() {
  const currentYear = new Date().getFullYear()
  
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
    ],
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <main className="pt-16">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-primary to-primary/80 text-white py-16 md:py-20">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,white)]" />
          <PageContainer className="relative">
            <nav className="mb-6 flex items-center gap-2 text-sm">
              <Link 
                href="/" 
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
              >
                Home
              </Link>
              <span className="text-white/50">/</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white font-medium">
                Categories
              </span>
            </nav>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Browse Deals by Category
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mb-6">
              Explore thousands of deals organized by category. Find exactly what you're looking for from top retailers.
            </p>
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              <Sparkles className="h-4 w-4 mr-2" />
              15,000+ Active Deals
            </Badge>
          </PageContainer>
        </section>
        
        {/* Categories Grid */}
        <section className="py-12 md:py-16">
          <PageContainer>
            <SectionHeading>All Categories</SectionHeading>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map((cat) => {
                const Icon = cat.icon
                return (
                  <Link key={cat.slug} href={`/categories/${cat.slug}`}>
                    <Card className="h-full border-border/50 hover:border-primary hover:shadow-lg transition-all group cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`${cat.color} p-3 rounded-xl text-white shrink-0`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                {cat.name}
                              </h2>
                              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {cat.description}
                            </p>
                            <Badge variant="secondary" className="text-xs">
                              {cat.dealCount} deals
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </PageContainer>
        </section>
        
        {/* Popular Searches */}
        <section className="py-12 md:py-16 bg-muted/30">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Popular Category Searches
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                "Laptops under $500",
                "Wireless earbuds",
                "4K TVs",
                "Gaming monitors",
                "Nike sneakers",
                "Air fryers",
                "Robot vacuums",
                "Smart home devices",
                "Fitness trackers",
                "Kids toys",
              ].map((search) => (
                <Link
                  key={search}
                  href={`/deals?q=${encodeURIComponent(search)}`}
                  className="px-4 py-2 rounded-full bg-background border border-border hover:border-primary hover:bg-primary/5 transition-colors text-sm font-medium text-foreground"
                >
                  {search}
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
