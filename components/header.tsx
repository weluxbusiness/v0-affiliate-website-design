"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Sparkles, ChevronDown, ChevronRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

const dealsCategories = [
  { href: "/deals/electronics", label: "Electronics" },
  { href: "/deals/fashion", label: "Fashion" },
  { href: "/deals/home-kitchen", label: "Home & Kitchen" },
  { href: "/deals/beauty", label: "Beauty" },
]

const gamingLinks = [
  { href: "/gaming", label: "All Games" },
  { href: "/gaming/promo-codes", label: "Promo Codes" },
  { href: "/gaming/best-codes", label: "Best Codes" },
  { href: "/gaming/top-games", label: "Top Games" },
  { href: "/gaming/free-rewards", label: "Free Rewards" },
  { href: "/gaming/new-player-deals", label: "New Player Deals" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [dealsOpen, setDealsOpen] = useState(false)
  const [gamingOpen, setGamingOpen] = useState(false)
  const [mobileDealsOpen, setMobileDealsOpen] = useState(false)
  const [mobileGamingOpen, setMobileGamingOpen] = useState(false)
  const dealsRef = useRef<HTMLDivElement>(null)
  const gamingRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dealsRef.current && !dealsRef.current.contains(event.target as Node)) {
        setDealsOpen(false)
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

  const closeMenu = () => setIsOpen(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[9999] w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">SaveSmart</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Deals Dropdown - Primary */}
            <div className="relative" ref={dealsRef}>
              <button
                onClick={() => setDealsOpen(!dealsOpen)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors rounded-md hover:bg-muted"
              >
                Deals
                <ChevronDown className={`h-4 w-4 transition-transform ${dealsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {dealsOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-background rounded-lg shadow-lg border border-border z-[100] py-1">
                  <Link
                    href="/deals"
                    className="block px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    onClick={() => setDealsOpen(false)}
                  >
                    All Deals
                  </Link>
                  <div className="h-px bg-border my-1" />
                  {dealsCategories.map((category) => (
                    <Link
                      key={category.href}
                      href={category.href}
                      className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      onClick={() => setDealsOpen(false)}
                    >
                      {category.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Gaming Dropdown - Primary */}
            <div className="relative" ref={gamingRef}>
              <button
                onClick={() => setGamingOpen(!gamingOpen)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors rounded-md hover:bg-muted"
              >
                Gaming
                <ChevronDown className={`h-4 w-4 transition-transform ${gamingOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {gamingOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-background rounded-lg shadow-lg border border-border z-[100] py-1">
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

            {/* AI Deal Finder - Primary */}
            <Link 
              href="/deal-finder" 
              className="px-3 py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors rounded-md hover:bg-muted"
            >
              AI Deal Finder
            </Link>

            {/* Blog - Secondary */}
            <Link 
              href="/blog" 
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
            >
              Blog
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button asChild size="sm" className="rounded-full px-5">
              <Link href="/deals">
                <Zap className="h-4 w-4 mr-1.5" />
                Start Saving
              </Link>
            </Button>
          </div>

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="md:hidden relative z-[10000] p-2 rounded-md hover:bg-muted active:bg-muted/80 touch-manipulation"
            onClick={() => setIsOpen((prev) => !prev)}
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
      </header>

      {/* Mobile menu overlay and drawer */}
      <div
        className={`md:hidden fixed inset-0 z-[9998] transition-all duration-300 ease-in-out ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        {/* Overlay backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMenu}
        />

        {/* Menu panel */}
        <div
          className={`absolute top-16 left-0 right-0 bottom-0 bg-background overflow-y-auto transition-transform duration-300 ease-out ${
            isOpen ? "translate-y-0" : "-translate-y-full"
          }`}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <nav className="flex flex-col p-4 pb-8">
            {/* Deals - collapsible */}
            <div>
              <button
                type="button"
                onClick={() => setMobileDealsOpen(!mobileDealsOpen)}
                className="w-full px-4 py-3 text-base font-semibold text-foreground hover:bg-muted active:bg-muted/80 rounded-lg transition-colors flex items-center justify-between touch-manipulation"
              >
                Deals
                <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${mobileDealsOpen ? 'rotate-90' : ''}`} />
              </button>
              
              {mobileDealsOpen && (
                <div className="ml-4 space-y-1">
                  <Link
                    href="/deals"
                    className="block px-4 py-3 text-sm font-medium text-foreground hover:bg-muted active:bg-muted/80 rounded-lg transition-colors touch-manipulation"
                    onClick={closeMenu}
                  >
                    All Deals
                  </Link>
                  {dealsCategories.map((category) => (
                    <Link
                      key={category.href}
                      href={category.href}
                      className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted active:bg-muted/80 rounded-lg transition-colors touch-manipulation"
                      onClick={closeMenu}
                    >
                      {category.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Gaming - collapsible */}
            <div>
              <button
                type="button"
                onClick={() => setMobileGamingOpen(!mobileGamingOpen)}
                className="w-full px-4 py-3 text-base font-semibold text-foreground hover:bg-muted active:bg-muted/80 rounded-lg transition-colors flex items-center justify-between touch-manipulation"
              >
                Gaming
                <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${mobileGamingOpen ? 'rotate-90' : ''}`} />
              </button>
              
              {mobileGamingOpen && (
                <div className="ml-4 space-y-1">
                  {gamingLinks.map((gameLink) => (
                    <Link
                      key={gameLink.href}
                      href={gameLink.href}
                      className="block px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted active:bg-muted/80 rounded-lg transition-colors touch-manipulation"
                      onClick={closeMenu}
                    >
                      {gameLink.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* AI Deal Finder */}
            <Link
              href="/deal-finder"
              className="px-4 py-3 text-base font-semibold text-foreground hover:bg-muted active:bg-muted/80 rounded-lg transition-colors touch-manipulation"
              onClick={closeMenu}
            >
              AI Deal Finder
            </Link>

            {/* Blog */}
            <Link
              href="/blog"
              className="px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted active:bg-muted/80 rounded-lg transition-colors touch-manipulation"
              onClick={closeMenu}
            >
              Blog
            </Link>
            
            {/* CTA Button */}
            <div className="pt-4 mt-4 border-t border-border">
              <Button asChild size="lg" className="w-full rounded-full touch-manipulation active:scale-[0.98]">
                <Link href="/deals" onClick={closeMenu}>
                  <Zap className="h-4 w-4 mr-1.5" />
                  Start Saving
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}
