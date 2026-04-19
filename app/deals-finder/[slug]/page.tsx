import { notFound } from "next/navigation"
import type { Metadata } from "next"

// Return 404 - redirect is handled in next.config.mjs
// This prevents "Page with redirect" errors in Google Search Console
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function DealsFinderSlugRedirectPage() {
  notFound()
}
