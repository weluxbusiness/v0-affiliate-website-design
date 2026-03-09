import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Trending Deals - Most Clicked, Saved & Viewed | SaveSmart",
  description: "Discover the most popular deals right now. See what's trending today, this week, and this month - sorted by clicks, saves, and views.",
  keywords: [
    "trending deals",
    "popular deals",
    "most clicked deals",
    "most saved deals",
    "most viewed deals",
    "hot deals",
    "best deals today"
  ],
  openGraph: {
    title: "Trending Deals - Most Clicked, Saved & Viewed | SaveSmart",
    description: "Discover the most popular deals right now. See what's trending today, this week, and this month.",
    type: "website",
    url: "https://savesmart.bio/deals/trending",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trending Deals - Most Clicked, Saved & Viewed | SaveSmart",
    description: "Discover the most popular deals right now. See what's trending today, this week, and this month.",
  },
  alternates: {
    canonical: "https://savesmart.bio/deals/trending",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function TrendingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
