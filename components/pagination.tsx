import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = []
    const showEllipsisThreshold = 7
    
    if (totalPages <= showEllipsisThreshold) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)
      
      if (currentPage > 3) {
        pages.push("ellipsis")
      }
      
      // Show pages around current
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push("ellipsis")
      }
      
      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const getPageUrl = (page: number) => {
    if (page === 1) {
      return baseUrl
    }
    return `${baseUrl}/page/${page}`
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav 
      className="flex items-center justify-center gap-1 sm:gap-2 py-8"
      aria-label="Pagination"
    >
      {/* Previous button */}
      {currentPage > 1 ? (
        <Button variant="outline" size="sm" asChild className="gap-1">
          <Link href={getPageUrl(currentPage - 1)} rel="prev">
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled className="gap-1">
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>
      )}

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span 
                key={`ellipsis-${index}`} 
                className="px-2 text-muted-foreground"
              >
                ...
              </span>
            )
          }
          
          const isActive = page === currentPage
          
          return (
            <Button
              key={page}
              variant={isActive ? "default" : "outline"}
              size="sm"
              asChild={!isActive}
              className="min-w-[36px]"
            >
              {isActive ? (
                <span aria-current="page">{page}</span>
              ) : (
                <Link href={getPageUrl(page)}>{page}</Link>
              )}
            </Button>
          )
        })}
      </div>

      {/* Next button */}
      {currentPage < totalPages ? (
        <Button variant="outline" size="sm" asChild className="gap-1">
          <Link href={getPageUrl(currentPage + 1)} rel="next">
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled className="gap-1">
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </nav>
  )
}
