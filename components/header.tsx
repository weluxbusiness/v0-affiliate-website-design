"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Sparkles, ChevronDown, ChevronRight } from "lucide-react"
import { ExtensionCTAButton } from "@/components/extension-cta-button"

const navLinks = [
  { href: "/deals", label: "Deals" },
  { href: "/gaming", label: "Gaming" },
  { href: "/deal-finder", label: "AI Deal Finder" },
  { href: "/blog", label: "Blog" },
  { href: "/how-it-works", label: "How It Works" },
]

const gamingLinks = [
  { href: "/gaming", label: "All Gaming Deals" },
  { href: "/gaming/promo-codes", label: "Promo Codes" },
  { href: "/gaming/free-rewards", label: "Free Rewards" },
  { href: "/gaming/new-player-deals", label: "New Player Deals" },
  { href: "/gaming/today", label: "Today's Codes" },
]

const topCategories = [
  { href: "/deals/electronics", label: "Electronics" },
  { href: "/deals/fashion", label: "Fashion" },
  { href: "/deals/home-kitchen", label: "Home & Kitchen" },
  { href: "/deals/laptops", label: "Laptops" },
  { href: "/deals/headphones", label: "Headphones" },
  { href: "/deals/sneakers", label: "Sneakers" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [gamingOpen, setGamingOpen] = useState(false)
  const [mobileGamingOpen, setMobileGamingOpen] = useState(false)
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false)
  const categoriesRef = useRef<HTMLDivElement>(null)
  const gamingRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setCategoriesOpen(false)
      }
      if (gamingRef.current && !gamingRef.current.contains(event.target as Node)) {
        setGamingOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">SaveSmart</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            link.label === "Gaming" ? (
              <div key={link.href} className="relative" ref={gamingRef}>
                <button
                  onClick={() => setGamingOpen(!gamingOpen)}
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Gaming
                  <ChevronDown className={`h-4 w-4 transition-transform ${gamingOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {gamingOpen && (
                  <div className="absolute top-full left-0 mt-2 w-52 bg-background rounded-lg shadow-lg border border-border z-[100] py-1">
                    {gamingLinks.map((gameLink) => (
                      <Link
                        key={gameLink.href}
                        href={gameLink.href}
                        className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                        onClick={() => setGamingOpen(false)}
                      >
                        {gameLink.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link 
                key={link.href}
                href={link.href} 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            )
          ))}
          
          {/* Categories Dropdown */}
          <div className="relative" ref={categoriesRef}>
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Categories
              <ChevronDown className={`h-4 w-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {categoriesOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-background rounded-lg shadow-lg border border-border z-[100] py-1">
                {topCategories.map((category) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    onClick={() => setCategoriesOpen(false)}
                  >
                    {category.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <ExtensionCTAButton size="default">
            Add Free Extension
          </ExtensionCTAButton>
        </div>

        {/* Mobile hamburger button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-muted"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile menu - improved with collapsible sections */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-background z-50 overflow-y-auto">
          <nav className="flex flex-col p-4">
            {/* Main nav links */}
            <Link
              href="/deals"
              className="px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Deals
            </Link>
            
            <Link
              href="/deal-finder"
              className="px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              AI Deal Finder
            </Link>
            
            <Link
              href="/blog"
              className="px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
            
            <Link
              href="/how-it-works"
              className="px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              How It Works
            </Link>

            {/* Gaming - collapsible */}
            <div className="border-t border-border mt-2 pt-2">
              <button
                onClick={() => setMobileGamingOpen(!mobileGamingOpen)}
                className="w-full px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-lg transition-colors flex items-center justify-between"
              >
                Gaming
                <ChevronRight className={`h-4 w-4 transition-transform ${mobileGamingOpen ? 'rotate-90' : ''}`} />
              </button>
              
              {mobileGamingOpen && (
                <div className="ml-4 space-y-1">
                  {gamingLinks.map((gameLink) => (
                    <Link
                      key={gameLink.href}
                      href={gameLink.href}
                      className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {gameLink.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Categories - collapsible */}
            <div className="border-t border-border mt-2 pt-2">
              <button
                onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                className="w-full px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-lg transition-colors flex items-center justify-between"
              >
                Categories
                <ChevronRight className={`h-4 w-4 transition-transform ${mobileCategoriesOpen ? 'rotate-90' : ''}`} />
              </button>
              
              {mobileCategoriesOpen && (
                <div className="ml-4 space-y-1">
                  {topCategories.map((category) => (
                    <Link
                      key={category.href}
                      href={category.href}
                      className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {category.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            {/* CTA Button */}
            <div className="pt-4 mt-4 border-t border-border">
              <ExtensionCTAButton 
                className="w-full"
                size="lg"
              >
                Add Free Chrome Extension
              </ExtensionCTAButton>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
