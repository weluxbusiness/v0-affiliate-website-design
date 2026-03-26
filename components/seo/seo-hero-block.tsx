import Link from "next/link"
import { Gamepad2, Laptop, Headphones, Tv, Tag } from "lucide-react"

const quickLinks = [
  {
    href: "/gaming/genshin-impact/codes-today",
    label: "Genshin Impact Codes",
    icon: Gamepad2,
  },
  {
    href: "/gaming/roblox/codes-today",
    label: "Roblox Promo Codes",
    icon: Gamepad2,
  },
  {
    href: "/deals/price/laptops-under-500",
    label: "Laptops Under $500",
    icon: Laptop,
  },
  {
    href: "/deals/price/headphones-under-100",
    label: "Headphones Under $100",
    icon: Headphones,
  },
  {
    href: "/deals/price/tvs-under-500",
    label: "TV Deals Under $500",
    icon: Tv,
  },
  {
    href: "/deals/cheap/sneakers",
    label: "Cheap Sneakers",
    icon: Tag,
  },
]

export function SEOHeroBlock() {
  return (
    <section className="relative bg-gradient-to-b from-muted/50 to-background py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* H1 - SEO Optimized */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-center mb-4">
          Best Deals, Promo Codes &amp; Discounts 2026
        </h1>
        
        {/* Intro Paragraph - Natural keyword inclusion */}
        <p className="text-base md:text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-8 leading-relaxed">
          Discover the best deals today, promo codes, and discounts from top brands like Nike, Amazon, Apple, and Samsung. 
          Save money online with verified offers updated daily—find everything from gaming codes to electronics deals.
        </p>
        
        {/* Quick Links Grid */}
        <nav aria-label="Popular deals and promo codes">
          <ul className="flex flex-wrap justify-center gap-3 md:gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-background border border-border hover:border-primary/50 hover:bg-primary/5 text-sm font-medium text-foreground transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </section>
  )
}
