import { Metadata } from "next"
import Link from "next/link"
import { gamesData, getActivePromoCodes } from "@/lib/gaming-data"
import { PageContainer } from "@/components/layout/page-container"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Breadcrumbs, 
  getAllGamesBreadcrumbs, 
  generateBreadcrumbSchema 
} from "@/components/gaming/breadcrumbs"
import { SEOInternalLinks } from "@/components/gaming/seo-internal-links"
import { 
  Gamepad2, 
  Calendar, 
  ChevronRight,
  CheckCircle2,
  Clock,
  Search
} from "lucide-react"

export const metadata: Metadata = {
  title: "All Game Codes – 50+ Games with Free Rewards | SaveSmart",
  description: "Complete list of all games with working promo codes. 50+ games updated daily with free rewards, gems & exclusive items. Find codes for any game!",
  keywords: [
    "game codes",
    "promo codes",
    "all games",
    "free rewards",
    "gaming codes list",
  ],
  openGraph: {
    title: "All Game Codes – 50+ Games with Free Rewards",
    description: "Complete list of all games with working promo codes. Updated daily!",
    url: "https://savesmart.bio/gaming/all-games",
  },
  alternates: {
    canonical: "/gaming/all-games",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

// Current date for freshness
const today = new Date()
const lastUpdated = today.toLocaleDateString('en-US', { 
  month: 'long', 
  day: 'numeric', 
  year: 'numeric' 
})

// Available months
const MONTHS = [
  { slug: 'april-2026', label: 'April 2026' },
  { slug: 'may-2026', label: 'May 2026' },
  { slug: 'june-2026', label: 'June 2026' },
  { slug: 'july-2026', label: 'July 2026' },
]

export default function AllGamesPage() {
  // Sort games by popularity
  const sortedGames = [...gamesData].sort((a, b) => b.popularityScore - a.popularityScore)
  
  // Group games by category
  const gamesByCategory = sortedGames.reduce((acc, game) => {
    const category = game.categories[0] || 'Other'
    if (!acc[category]) acc[category] = []
    acc[category].push(game)
    return acc
  }, {} as Record<string, typeof gamesData>)
  
  // Total codes count
  const totalCodes = sortedGames.reduce((sum, game) => 
    sum + getActivePromoCodes(game.promoCodes).length, 0
  )

  // Breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema(getAllGamesBreadcrumbs())

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background py-8 border-b border-border">
        <PageContainer>
          {/* Breadcrumbs */}
          <Breadcrumbs items={getAllGamesBreadcrumbs()} className="mb-4" />
          
          {/* Freshness Banner */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className="bg-green-600 text-white">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Updated Today
            </Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Last updated: {lastUpdated}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            All Game Codes
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-4">
            Complete directory of {sortedGames.length}+ games with working promo codes. 
            {totalCodes}+ active codes updated daily.
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border">
              <Gamepad2 className="h-4 w-4 text-primary" />
              <span className="font-medium">{sortedGames.length}+ Games</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="font-medium">{totalCodes}+ Working Codes</span>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* All Games Grid */}
      <section className="py-10">
        <PageContainer>
          <div className="grid gap-8">
            {Object.entries(gamesByCategory).map(([category, games]) => (
              <div key={category}>
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Badge variant="outline">{category}</Badge>
                  <span className="text-sm font-normal text-muted-foreground">
                    ({games.length} games)
                  </span>
                </h2>
                
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {games.map((game) => {
                    const activeCodes = getActivePromoCodes(game.promoCodes)
                    
                    return (
                      <Link 
                        key={game.slug}
                        href={`/gaming/${game.slug}`}
                        className="group"
                      >
                        <Card className="h-full hover:border-primary/50 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                {game.shortName || game.name}
                              </h3>
                              <Badge 
                                variant={activeCodes.length > 0 ? "default" : "secondary"}
                                className={activeCodes.length > 0 ? "bg-green-600" : ""}
                              >
                                {activeCodes.length} codes
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {game.description}
                            </p>
                            
                            {/* Quick Links */}
                            <div className="flex flex-wrap gap-2 text-xs">
                              <span className="text-primary hover:underline">
                                All Codes
                              </span>
                              <span className="text-muted-foreground">•</span>
                              <Link 
                                href={`/gaming/${game.slug}/codes-today`}
                                className="text-primary hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Today
                              </Link>
                              <span className="text-muted-foreground">•</span>
                              <Link 
                                href={`/gaming/${game.slug}/codes-april-2026`}
                                className="text-primary hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                April 2026
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Monthly Navigation */}
      <section className="py-8 bg-muted/30 border-t border-border">
        <PageContainer>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Browse by Month
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {MONTHS.map((month) => (
              <Card key={month.slug} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-2">{month.label}</h3>
                  <div className="space-y-1">
                    {sortedGames.slice(0, 5).map((game) => (
                      <Link 
                        key={game.slug}
                        href={`/gaming/${game.slug}/codes-${month.slug}`}
                        className="flex items-center justify-between text-sm hover:text-primary transition-colors"
                      >
                        <span>{game.shortName || game.name}</span>
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* A-Z Index */}
      <section className="py-8">
        <PageContainer>
          <h2 className="text-xl font-bold text-foreground mb-4">
            Games A-Z
          </h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {Array.from(new Set(sortedGames.map(g => g.name[0].toUpperCase()))).sort().map((letter) => (
              <a 
                key={letter}
                href={`#letter-${letter}`}
                className="px-3 py-1 rounded bg-muted hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium"
              >
                {letter}
              </a>
            ))}
          </div>
          
          {Array.from(new Set(sortedGames.map(g => g.name[0].toUpperCase()))).sort().map((letter) => {
            const gamesWithLetter = sortedGames.filter(g => g.name[0].toUpperCase() === letter)
            
            return (
              <div key={letter} id={`letter-${letter}`} className="mb-6">
                <h3 className="text-lg font-bold text-foreground mb-3 sticky top-0 bg-background py-2">
                  {letter}
                </h3>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {gamesWithLetter.map((game) => (
                    <Link 
                      key={game.slug}
                      href={`/gaming/${game.slug}`}
                      className="flex items-center justify-between p-2 rounded hover:bg-muted transition-colors"
                    >
                      <span className="text-sm">{game.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {getActivePromoCodes(game.promoCodes).length}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </PageContainer>
      </section>

      {/* SEO Internal Links */}
      <SEOInternalLinks 
        showPopularGames={true}
        showLatestCodes={true}
        showMonthlyNav={true}
      />
    </>
  )
}
