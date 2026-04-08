import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { PageContainer } from "@/components/layout/page-container"
import { 
  Gamepad2, 
  ArrowRight, 
  Gift, 
  Flame,
  Play,
  ExternalLink,
  Tag
} from "lucide-react"
import { 
  Game,
  getPopularGames, 
  getActivePromoCodes,
  getGameLogoUrl,
  getGameCtaInfo
} from "@/lib/gaming-data"

interface HomeGamingDealsProps {
  games?: Game[]
}

export function HomeGamingDeals({ games }: HomeGamingDealsProps) {
  // Use provided games or fall back to popular games
  const displayGames = games || getPopularGames(6)
  
  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <PageContainer>
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Gamepad2 className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary uppercase tracking-wider">Gaming</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Gaming Deals & Rewards
            </h2>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
              Discover the latest promo codes, free rewards, and exclusive bonuses for top games.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" className="gap-2" asChild>
              <Link href="/gaming">
                Gaming Hub
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="default" className="gap-2" asChild>
              <Link href="/gaming/all-games">
                All Games
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Game Cards Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {displayGames.map((game) => {
            const codeCount = getActivePromoCodes(game.promoCodes).length
            const logoUrl = getGameLogoUrl(game)
            const hasLogo = game.logoUrl
            const ctaInfo = getGameCtaInfo(game)
            
            // Determine reward highlight text
            const rewardHighlight = game.rewards.length > 0 
              ? game.rewards[0].value || game.rewards[0].title
              : codeCount > 0 
                ? `${codeCount} Active Codes`
                : "Free Rewards"
            
            return (
              <Card 
                key={game.id} 
                className="group overflow-hidden border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
              >
                <CardContent className="p-5">
                  {/* Game Logo + Name */}
                  <Link href={`/gaming/${game.slug}`} className="flex items-center gap-4 mb-4">
                    <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden ring-2 ring-border/50 shadow-md bg-muted/50">
                      {hasLogo ? (
                        <Image
                          src={logoUrl}
                          alt={`${game.name} promo codes - free rewards`}
                          width={56}
                          height={56}
                          className="rounded-xl object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-primary/10">
                          <Gamepad2 className="h-7 w-7 text-primary" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors truncate text-lg">
                        {game.shortName || game.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {game.categories[0]} | {game.platforms[0]}
                      </p>
                    </div>
                  </Link>
                  
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-4">
                    {codeCount > 0 && (
                      <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-0">
                        <Tag className="h-3 w-3 mr-1" />
                        {codeCount} codes
                      </Badge>
                    )}
                    {codeCount > 2 && (
                      <Badge variant="secondary" className="text-xs bg-orange-500/10 text-orange-600 border-0">
                        <Flame className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                    {game.rewards.length > 0 && (
                      <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600 border-0">
                        <Gift className="h-3 w-3 mr-1" />
                        Free Rewards
                      </Badge>
                    )}
                  </div>

                  {/* Reward Highlight */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-1">
                    {rewardHighlight}
                  </p>

                  {/* CTAs - Affiliate CTA primary, View Codes secondary */}
                  <div className="flex flex-col gap-2">
                    {ctaInfo.url && (
                      <Button 
                        asChild 
                        className={`w-full h-10 font-bold shadow-md hover:shadow-lg transition-all ${
                          ctaInfo.buttonStyle === 'affiliate' 
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        <a 
                          href={ctaInfo.url} 
                          target="_blank"
                          rel={ctaInfo.rel}
                        >
                          {ctaInfo.isAffiliate ? (
                            <Gift className="h-4 w-4 mr-2" />
                          ) : (
                            <Gamepad2 className="h-4 w-4 mr-2" />
                          )}
                          {ctaInfo.isAffiliate ? 'Claim FREE Rewards' : ctaInfo.label}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                    )}
                    {/* Urgency text for affiliate */}
                    {ctaInfo.isAffiliate && ctaInfo.urgencyText && (
                      <p className="text-xs text-amber-600 text-center font-medium -mt-1">
                        {ctaInfo.urgencyText}
                      </p>
                    )}
                    <Button 
                      asChild 
                      variant="outline"
                      size="sm"
                      className="w-full h-8 font-medium text-xs"
                    >
                      <Link href={`/gaming/${game.slug}`}>
                        View All Codes
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Looking for more free rewards and bonuses?
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button className="gap-2" asChild>
              <Link href="/gaming/promo-codes">
                <Tag className="h-4 w-4" />
                All Promo Codes
              </Link>
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <Link href="/gaming/free-rewards">
                <Gift className="h-4 w-4" />
                Free Rewards
              </Link>
            </Button>
          </div>
        </div>
      </PageContainer>
    </section>
  )
}
