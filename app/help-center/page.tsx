"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/layout/page-container"
import { SocialLinks } from "@/components/social-links"
import { 
  Search,
  Download,
  CreditCard,
  Settings,
  Shield,
  HelpCircle,
  MessageCircle,
  Mail,
  Instagram,
  ChevronRight,
  CheckCircle2
} from "lucide-react"

const categories = [
  {
    icon: Download,
    title: "Getting Started",
    description: "Installation, setup, and first-time use",
    articles: [
      { title: "How to install the SaveSmart extension", content: "Click the 'Add Free Extension' button on our homepage, then click 'Add to Chrome' in the Chrome Web Store. The extension will install automatically in less than 30 seconds." },
      { title: "Setting up your SaveSmart account", content: "SaveSmart works without an account! Just install the extension and start shopping. Create an account only if you want to sync settings across devices." },
      { title: "Browser compatibility guide", content: "SaveSmart works on Chrome, Firefox, Microsoft Edge, and Safari. We recommend keeping your browser updated for the best experience." },
      { title: "First time using SaveSmart", content: "After installing, just shop normally. When you reach checkout, SaveSmart will automatically search for and apply the best available coupons." },
    ]
  },
  {
    icon: CreditCard,
    title: "Using Coupons & Deals",
    description: "Finding and applying discounts",
    articles: [
      { title: "How automatic coupon application works", content: "At checkout, SaveSmart automatically tests all available coupon codes and applies the one that saves you the most money. No manual searching required!" },
      { title: "What to do if a coupon doesn't work", content: "Coupons may have restrictions (minimum purchase, specific items, etc.). If a code doesn't work, SaveSmart automatically tries other available codes." },
      { title: "Finding deals on specific stores", content: "Visit our Deals page to browse current offers by store or category. Use the AI Deal Finder to search for specific products or discounts." },
      { title: "Price comparison features", content: "SaveSmart shows you if the same product is available cheaper elsewhere. Look for the price comparison popup when viewing products." },
    ]
  },
  {
    icon: Settings,
    title: "Settings & Preferences",
    description: "Customize your SaveSmart experience",
    articles: [
      { title: "Managing extension settings", content: "Click the SaveSmart icon in your browser toolbar, then click the gear icon to access settings. You can customize notifications, appearance, and more." },
      { title: "Enabling or disabling notifications", content: "In settings, toggle 'Deal Notifications' on or off. You can also choose which types of alerts you want to receive." },
      { title: "Whitelisting or blacklisting stores", content: "In settings, go to 'Store Preferences' to add stores where you want SaveSmart to always run or never run." },
      { title: "Updating your account information", content: "If you have an account, click your profile icon in the extension popup to update your email, password, or other preferences." },
    ]
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description: "Your data and how we protect it",
    articles: [
      { title: "What data does SaveSmart collect?", content: "We collect minimal data needed to find deals: the store you're shopping at and basic product info. We never collect payment details or personal information." },
      { title: "How we protect your information", content: "All data is encrypted in transit and at rest. We use industry-standard security practices and never sell your personal data to third parties." },
      { title: "Deleting your data", content: "Uninstall the extension to stop all data collection. To delete your account data, contact support@savesmart.bio with your request." },
      { title: "Third-party sharing policies", content: "We share anonymized, aggregated data with retail partners to improve deals. Your personal information is never shared without consent." },
    ]
  },
  {
    icon: HelpCircle,
    title: "Troubleshooting",
    description: "Fix common issues",
    articles: [
      { title: "Extension not appearing on websites", content: "Try refreshing the page or restarting your browser. Make sure the extension is enabled in your browser's extension settings." },
      { title: "Coupons not being applied", content: "Some stores block automatic coupon application. Try manually copying codes from our Deals page. Clear your cart and try again." },
      { title: "Browser performance issues", content: "SaveSmart is designed to be lightweight. If you notice slowdowns, try disabling other extensions to identify conflicts." },
      { title: "Reinstalling the extension", content: "Remove SaveSmart from your browser extensions, then reinstall from our website. Your settings will be reset to defaults." },
    ]
  },
  {
    icon: CreditCard,
    title: "Billing & Payments",
    description: "Affiliate earnings and rewards",
    articles: [
      { title: "Understanding affiliate commissions", content: "SaveSmart is free because we earn a small commission from stores when you make a purchase. This never affects your price - you always get the same or better deals." },
      { title: "How cashback works", content: "Some purchases earn cashback rewards. Check the deal details to see if cashback is available. Rewards are tracked automatically." },
      { title: "Payment methods and thresholds", content: "SaveSmart is completely free. We don't charge users anything. Any cashback rewards are paid via PayPal or gift cards." },
      { title: "Tracking your savings history", content: "Click the SaveSmart icon to see your total savings. Detailed history is available if you create an account." },
    ]
  },
]

const popularArticles = [
  { title: "How to install SaveSmart on Chrome", views: "12.5k", answer: "Click 'Add Free Extension' on our homepage, then 'Add to Chrome' in the store. Installation takes under 30 seconds!" },
  { title: "Why isn't SaveSmart finding coupons?", views: "8.2k", answer: "Some stores may not have active coupons, or the store might block extensions. Try our Deals page for manual codes." },
  { title: "How to use price tracking alerts", views: "6.8k", answer: "Click the SaveSmart icon on any product page and select 'Track Price'. We'll email you when the price drops!" },
  { title: "Is SaveSmart safe to use?", views: "5.4k", answer: "Yes! We're trusted by 2M+ users. We never collect payment info and all data is encrypted. Read our Privacy Policy for details." },
  { title: "Supported stores list", views: "4.9k", answer: "SaveSmart works on 30,000+ online stores including Amazon, Walmart, Target, Best Buy, Nike, and many more." },
]

export default function HelpCenterPage() {
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null)
  const [expandedPopular, setExpandedPopular] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCategories = searchQuery.trim() 
    ? categories.map(cat => ({
        ...cat,
        articles: cat.articles.filter(art => 
          art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          art.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.articles.length > 0)
    : categories

  const filteredPopular = searchQuery.trim()
    ? popularArticles.filter(art => 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : popularArticles

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="border-b border-border bg-muted/30 py-12 md:py-16">
          <PageContainer narrow className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              How can we help?
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Search our knowledge base or browse categories below
            </p>
            
            {/* Search Bar */}
            <div className="mt-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search for help articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card py-4 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </PageContainer>
        </section>

        {/* Popular Articles */}
        <section className="border-b border-border py-12 md:py-16">
          <PageContainer>
            <h2 className="text-lg font-semibold text-foreground">Popular Articles</h2>
            <div className="mt-4 space-y-3">
              {filteredPopular.map((article) => (
                <div key={article.title} className="rounded-xl border border-border bg-card overflow-hidden">
                  <button
                    onClick={() => setExpandedPopular(expandedPopular === article.title ? null : article.title)}
                    className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm text-foreground transition-colors hover:bg-muted text-left"
                  >
                    <span className="font-medium">{article.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{article.views} views</span>
                      <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${expandedPopular === article.title ? 'rotate-90' : ''}`} />
                    </div>
                  </button>
                  {expandedPopular === article.title && (
                    <div className="px-4 py-3 border-t border-border bg-muted/30">
                      <p className="text-sm text-muted-foreground">{article.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Categories Grid */}
        <section className="py-12 md:py-16">
          <PageContainer>
            <h2 className="text-2xl font-bold text-foreground">Browse by Category</h2>
            
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCategories.map((category) => (
                <div
                  key={category.title}
                  className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <category.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{category.title}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  
                  <ul className="mt-4 space-y-2">
                    {category.articles.map((article) => (
                      <li key={article.title}>
                        <button
                          onClick={() => setExpandedArticle(expandedArticle === article.title ? null : article.title)}
                          className="group w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground text-left"
                        >
                          <span>{article.title}</span>
                          <ChevronRight className={`h-4 w-4 transition-transform ${expandedArticle === article.title ? 'rotate-90' : 'opacity-0 group-hover:opacity-100'}`} />
                        </button>
                        {expandedArticle === article.title && (
                          <div className="mt-2 ml-3 p-3 rounded-lg bg-muted/50 border-l-2 border-primary">
                            <p className="text-sm text-muted-foreground">{article.content}</p>
                            <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Helpful answer</span>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </PageContainer>
        </section>

        {/* Contact Section */}
        <section className="border-t border-border bg-muted/30 py-12 md:py-16">
          <PageContainer>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground">Still need help?</h2>
              <p className="mt-2 text-muted-foreground">
                Our support team is here to assist you
              </p>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
              <div className="rounded-2xl border border-border bg-card p-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MessageCircle className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">Live Chat</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Chat with our support team in real-time
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Available Mon-Fri, 9am-6pm EST
                </p>
                <Button 
                  className="mt-4 w-full"
                  onClick={() => {
                    // Open Crisp chat or similar live chat widget
                    if (typeof window !== 'undefined' && (window as unknown as { $crisp?: { push: (args: unknown[]) => void } }).$crisp) {
                      (window as unknown as { $crisp: { push: (args: unknown[]) => void } }).$crisp.push(['do', 'chat:open'])
                    } else {
                      // Fallback to email if chat not available
                      window.location.href = 'mailto:support@savesmart.bio?subject=Support%20Request'
                    }
                  }}
                >
                  Start Chat
                </Button>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Mail className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">Email Support</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Send us an email and we&apos;ll respond within 24 hours
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  support@savesmart.bio
                </p>
                <Button variant="outline" className="mt-4 w-full" asChild>
                  <a href="mailto:support@savesmart.bio?subject=Support%20Request">
                    Send Email
                  </a>
                </Button>
              </div>
              
              <div className="rounded-2xl border border-border bg-card p-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Instagram className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">Follow Us</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Stay updated with daily deals and shopping tips
                </p>
                <SocialLinks variant="compact" className="mt-4 justify-center" />
              </div>
            </div>
          </PageContainer>
        </section>
      </main>

      <Footer />
    </div>
  )
}
