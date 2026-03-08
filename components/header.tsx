"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Menu, X, Sparkles, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navLinks = [
  { href: "/deals", label: "Deals" },
  { href: "/deal-finder", label: "AI Deal Finder" },
  { href: "/blog", label: "Blog" },
  { href: "/how-it-works", label: "How It Works" },
] as const

const topCategories = [
  { href: "/deals/electronics", label: "Electronics" },
  { href: "/deals/fashion", label: "Fashion" },
  { href: "/deals/home-kitchen", label: "Home & Kitchen" },
  { href: "/deals/laptops", label: "Laptops" },
  { href: "/deals/headphones", label: "Headphones" },
  { href: "/deals/sneakers", label: "Sneakers" },
] as const

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev)
  }, [])
  
  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo - left aligned */}
        <Link href="/" className="flex items-center gap-2" aria-label="SaveSmart Home">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
          </div>
          <span className="text-xl font-bold text-foreground leading-none">SaveSmart</span>
        </Link>

        {/* Navigation - centered */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className="flex h-10 items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
            >
              {link.label}
            </Link>
          ))}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button 
                type="button"
                className="flex h-10 items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
              >
                Categories
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start" 
              sideOffset={8} 
              className="w-56"
            >
              {topCategories.map((category) => (
                <DropdownMenuItem key={category.href} asChild>
                  <Link href={category.href}>{category.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Button - right aligned */}
        <div className="hidden md:block">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <a href="https://chrome.google.com/webstore" target="_blank" rel="noopener noreferrer">
              Add Free Extension
            </a>
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden p-2 rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={toggleMobileMenu}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" aria-hidden="true" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <nav 
          id="mobile-menu"
          className="border-t border-border md:hidden animate-in slide-in-from-top-2 duration-200"
          aria-label="Mobile navigation"
        >
          <div className="space-y-1 px-4 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-4 py-3 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:bg-muted/80 transition-colors"
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 pb-2">
              <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Top Categories</p>
              {topCategories.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="block rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  onClick={closeMobileMenu}
                >
                  {category.label}
                </Link>
              ))}
            </div>
            <div className="pt-3">
              <Button className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-base" asChild>
                <a href="https://chrome.google.com/webstore" target="_blank" rel="noopener noreferrer">
                  Add Free Extension
                </a>
              </Button>
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
