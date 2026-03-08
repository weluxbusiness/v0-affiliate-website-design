import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { PageContainer } from "@/components/layout/page-container"
import { 
  Laptop, 
  Headphones, 
  Shirt, 
  Home, 
  Footprints,
  Tv
} from "lucide-react"

const popularCategories = [
  { 
    name: "Electronics", 
    href: "/deals/electronics", 
    icon: Laptop,
    color: "bg-blue-500",
    description: "TVs, laptops, gadgets"
  },
  { 
    name: "Fashion", 
    href: "/deals/fashion", 
    icon: Shirt,
    color: "bg-pink-500",
    description: "Clothing, accessories"
  },
  { 
    name: "Home & Kitchen", 
    href: "/deals/home-kitchen", 
    icon: Home,
    color: "bg-amber-500",
    description: "Appliances, decor"
  },
  { 
    name: "Laptops", 
    href: "/deals/laptops", 
    icon: Laptop,
    color: "bg-slate-600",
    description: "MacBooks, Windows PCs"
  },
  { 
    name: "Headphones", 
    href: "/deals/headphones", 
    icon: Headphones,
    color: "bg-purple-500",
    description: "AirPods, Beats, Sony"
  },
  { 
    name: "Sneakers", 
    href: "/deals/sneakers", 
    icon: Footprints,
    color: "bg-green-500",
    description: "Nike, Adidas, more"
  },
]

export function PopularCategories() {
  return (
    <section className="py-10 md:py-12 border-t border-border">
      <PageContainer>
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Explore Popular Categories
        </h2>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {popularCategories.map((category) => {
          const Icon = category.icon
          return (
            <Link key={category.href} href={category.href} className="group">
              <Card className="h-full border-border/50 transition-all hover:shadow-lg hover:border-primary/30">
                <CardContent className="p-4 text-center">
                  <div className={`${category.color} mx-auto mb-3 h-12 w-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
        </div>
      </PageContainer>
    </section>
  )
}
