import Link from "next/link"
import { Sparkles, Mail } from "lucide-react"
import { PageContainer } from "@/components/layout/page-container"

const SUPPORT_EMAIL = "support@savesmart.bio"

const footerSections = [
  {
    title: "Deals",
    links: [
      { name: "All Deals", href: "/deals" },
      { name: "Latest Deals", href: "/latest-deals" },
      { name: "Electronics", href: "/deals/electronics" },
      { name: "Fashion", href: "/deals/fashion" },
      { name: "Home & Kitchen", href: "/deals/home" },
      { name: "Laptops", href: "/deals/laptops" },
      { name: "Headphones", href: "/deals/headphones" },
      { name: "Sneakers", href: "/deals/sneakers" },
    ],
  },
  {
    title: "Popular Stores",
    links: [
      { name: "Amazon Deals", href: "/stores/amazon" },
      { name: "Nike Deals", href: "/stores/nike" },
      { name: "Best Buy Deals", href: "/stores/best-buy" },
      { name: "Target Deals", href: "/stores/target" },
      { name: "Walmart Deals", href: "/stores/walmart" },
      { name: "Apple Deals", href: "/stores/apple" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "AI Deal Finder", href: "/deal-finder" },
      { name: "Blog", href: "/blog" },
      { name: "How It Works", href: "/how-it-works" },
      { name: "Help Center", href: "/help-center" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms of Service", href: "/terms-of-service" },
      { name: "Cookie Policy", href: "/cookie-policy" },
      { name: "Affiliate Disclosure", href: "/affiliate-disclosure" },
    ],
  },
] as const

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer 
      className="border-t border-border bg-background py-12"
      role="contentinfo"
      aria-label="Site footer"
    >
      <PageContainer>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2" aria-label="SaveSmart Home">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold text-foreground">SaveSmart</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The free shopping assistant that helps millions save money every day with automatic coupons and price comparisons.
            </p>
            
            {/* Contact Section */}
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-foreground">Contact</h2>
              <a 
                href={`mailto:${SUPPORT_EMAIL}`}
                className="mt-3 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                {SUPPORT_EMAIL}
              </a>
            </div>
          </div>

          {footerSections.map((section) => (
            <nav key={section.title} aria-label={`${section.title} links`}>
              <h2 className="text-sm font-semibold text-foreground">{section.title}</h2>
              <ul className="mt-4 space-y-3" role="list">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © {currentYear} SaveSmart. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Affiliate Disclosure: We may earn a commission when you use our links to shop.
            </p>
          </div>
        </div>
      </PageContainer>
    </footer>
  )
}
