"use client"

import { useState, useCallback, useEffect } from "react"
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

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [mobileMenuOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo - left aligned */}
        <Link 
          href="/" 
          className="flex items-center gap-2 shrink-0 min-h-0 min-w-0" 
          aria-label="SaveSmart Home"
        >
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-primary shrink-0">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" aria-hidden="true" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-foreground leading-none">SaveSmart</span>
        </Link>

        {/* Navigation - centered (hidden on mobile/tablet) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-7" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap min-h-0 min-w-0"
            >
              {link.label}
            </Link>
          ))}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button 
                type="button"
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground whitespace-nowrap min-h-0 min-w-0"
              >
                Categories
                <ChevronDown className="h-4 w-4 shrink-0" />
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

        {/* Button - right aligned (hidden on mobile/tablet) */}
        <div className="hidden lg:block shrink-0">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
            <a href="https://chrome.google.com/webstore" target="_blank" rel="noopener noreferrer">
              Add Free Extension
            </a>
          </Button>
        </div>

        {/* Mobile/Tablet hamburger button */}
        <button
          type="button"
          className="lg:hidden flex items-center justify-center h-10 w-10 rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0 min-h-0 min-w-0"
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

      {/* Mobile/Tablet menu overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 top-14 sm:top-16 bg-background/80 backdrop-blur-sm lg:hidden z-40"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
          
          {/* Menu content */}
          <nav 
            id="mobile-menu"
            className="fixed top-14 sm:top-16 left-0 right-0 bottom-0 bg-background border-t border-border lg:hidden z-50 overflow-y-auto"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col px-4 py-4 pb-[calc(2rem+env(safe-area-inset-bottom))]">
              {/* Main nav links */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center rounded-lg px-4 py-4 text-base font-medium text-foreground hover:bg-muted active:bg-muted/80 transition-colors min-h-0"
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Categories section */}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Top Categories
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {topCategories.map((category) => (
                    <Link
                      key={category.href}
                      href={category.href}
                      className="flex items-center justify-center rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground bg-muted/50 hover:bg-muted hover:text-foreground transition-colors min-h-0"
                      onClick={closeMobileMenu}
                    >
                      {category.label}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* CTA Button */}
              <div className="mt-6 pt-4 border-t border-border">
                <Button 
                  className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold" 
                  asChild
                >
                  <a 
                    href="https://chrome.google.com/webstore" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={closeMobileMenu}
                  >
                    Add Free Extension
                  </a>
                </Button>
              </div>
            </div>
          </nav>
        </>
      )}
    </header>
  )
}
