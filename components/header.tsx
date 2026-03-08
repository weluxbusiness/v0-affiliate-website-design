"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Sparkles, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "/deals", label: "Deals" },
  { href: "/deal-finder", label: "AI Deal Finder" },
  { href: "/blog", label: "Blog" },
  { href: "/how-it-works", label: "How It Works" },
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
  const categoriesRef = useRef<HTMLDivElement>(null)

  // Close categories dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setCategoriesOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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
            <Link 
              key={link.href}
              href={link.href} 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
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
          <Button asChild>
            <a href="https://chrome.google.com/webstore" target="_blank" rel="noopener noreferrer">
              Add Free Extension
            </a>
          </Button>
        </div>

        {/* Mobile hamburger button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-muted"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border shadow-lg z-50">
          <nav className="flex flex-col p-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 text-base font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="pt-2 border-t border-border mt-2">
              <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
                Categories
              </p>
              {topCategories.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg block transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {category.label}
                </Link>
              ))}
            </div>
            
            <div className="pt-4">
              <Button className="w-full" asChild>
                <a 
                  href="https://chrome.google.com/webstore" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                >
                  Add Free Extension
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
