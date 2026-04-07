"use client"

import Link from "next/link"
import { 
  ChevronRight, 
  Gamepad2, 
  Gift, 
  Star,
  Trophy,
  Zap,
  BookOpen,
  Clock,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Target,
  TrendingUp
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/layout/page-container"
import type { Game } from "@/lib/gaming-data"
import { getPlayAffiliateUrl } from "@/lib/gaming-data"

interface GuideSection {
  title: string
  content: string
  tips?: string[]
}

interface GuidePageTemplateProps {
  game: Game
  guideType: 'guide' | 'tips' | 'leveling'
  title: string
  description: string
  sections: GuideSection[]
  heroSubtitle?: string
}

export function GuidePageTemplate({
  game,
  guideType,
  title,
  description,
  sections,
  heroSubtitle
}: GuidePageTemplateProps) {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().toLocaleString('default', { month: 'long' })
  const affiliateUrl = getPlayAffiliateUrl(game)

  const guideIcons = {
    guide: BookOpen,
    tips: Star,
    leveling: TrendingUp
  }
  const GuideIcon = guideIcons[guideType]

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/90 to-primary text-white py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <PageContainer>
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-6 relative z-10">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/gaming" className="hover:text-white transition-colors">Gaming</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/gaming/${game.slug}`} className="hover:text-white transition-colors">
              {game.shortName || game.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white font-medium capitalize">{guideType}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 relative z-10">
            <div className="flex-1">
              {/* Freshness Badge */}
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-green-500/20 text-green-100 border border-green-400/30">
                  <Clock className="h-3 w-3 mr-1" />
                  Updated {currentMonth} {currentYear}
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-100 border border-blue-400/30">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Updated daily
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
                {title}
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-white/80 mb-6 max-w-2xl">
                {heroSubtitle || description}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                  <GuideIcon className="h-4 w-4" />
                  <span className="capitalize">{guideType} for {currentYear}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
                  <Gamepad2 className="h-4 w-4" />
                  <span>{game.shortName || game.name}</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="shrink-0 flex flex-col gap-2 relative z-20">
              <Button 
                size="lg" 
                asChild 
                className="gap-2 bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all text-lg px-8 py-6"
              >
                <a 
                  href={affiliateUrl || undefined} 
                  target="_blank"
                  rel="nofollow sponsored noopener"
                >
                  <Zap className="h-6 w-6" />
                  Play {game.shortName || game.name}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <p className="text-xs text-white/70 text-center font-medium">Free to play</p>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Quick Links */}
      <section className="py-6 border-b border-border bg-muted/30">
        <PageContainer>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/gaming/${game.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors"
            >
              <Gift className="h-4 w-4" />
              Get {game.shortName || game.name} Codes
            </Link>
            <Link
              href="/deals"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary font-medium transition-colors"
            >
              <Trophy className="h-4 w-4" />
              Browse Deals
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* Guide Content */}
      <section className="py-10 md:py-14">
        <PageContainer>
          <div className="max-w-4xl mx-auto">
            {/* Intro */}
            <div className="prose prose-lg max-w-none mb-10">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => (
                <Card key={index} className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Target className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-foreground mb-3">
                          {section.title}
                        </h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          {section.content}
                        </p>
                        {section.tips && section.tips.length > 0 && (
                          <ul className="space-y-2">
                            {section.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="flex items-start gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                                <span className="text-foreground">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA Box */}
            <div className="mt-10 p-6 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
              <div className="text-center">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Ready to play {game.shortName || game.name}?
                </h3>
                <p className="text-muted-foreground mb-4">
                  Don&apos;t forget to grab free codes before you start!
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button asChild size="lg" className="font-bold">
                    <Link href={`/gaming/${game.slug}`}>
                      <Gift className="h-5 w-5 mr-2" />
                      Get Free Codes
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <a 
                      href={affiliateUrl || undefined}
                      target="_blank"
                      rel="nofollow sponsored noopener"
                    >
                      Play Now
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Popular Games Section */}
      <section className="py-10 md:py-12 bg-muted/30 border-t border-border">
        <PageContainer>
          <h3 className="text-xl font-bold text-foreground mb-4">
            Popular Games
          </h3>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-5 mb-8">
            {[
              { slug: 'raid-shadow-legends', name: 'RAID' },
              { slug: 'monopoly-go', name: 'Monopoly GO' },
              { slug: 'brawl-stars', name: 'Brawl Stars' },
              { slug: 'afk-arena', name: 'AFK Arena' },
              { slug: 'roblox', name: 'Roblox' },
            ].filter(g => g.slug !== game.slug).map((topGame) => (
              <Link
                key={topGame.slug}
                href={`/gaming/${topGame.slug}`}
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary/50 hover:shadow-md text-sm font-medium text-foreground transition-all"
              >
                <Gamepad2 className="h-5 w-5 text-primary shrink-0" />
                <span>{topGame.name} Codes</span>
              </Link>
            ))}
          </div>

          {/* Latest Guides Section */}
          <h3 className="text-xl font-bold text-foreground mb-4">
            Latest Guides
          </h3>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-3 mb-8">
            <Link
              href={`/gaming/${game.slug}-guide`}
              className={`flex items-center gap-3 p-4 rounded-lg border ${guideType === 'guide' ? 'border-primary bg-primary/5' : 'border-border bg-card'} hover:border-primary/50 hover:shadow-md transition-all`}
            >
              <BookOpen className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="font-medium text-foreground text-sm">{game.shortName || game.name} Guide</p>
                <p className="text-xs text-muted-foreground">Beginner friendly</p>
              </div>
            </Link>
            <Link
              href={`/gaming/${game.slug}-tips`}
              className={`flex items-center gap-3 p-4 rounded-lg border ${guideType === 'tips' ? 'border-primary bg-primary/5' : 'border-border bg-card'} hover:border-primary/50 hover:shadow-md transition-all`}
            >
              <Star className="h-5 w-5 text-amber-500 shrink-0" />
              <div>
                <p className="font-medium text-foreground text-sm">{game.shortName || game.name} Tips</p>
                <p className="text-xs text-muted-foreground">Pro strategies</p>
              </div>
            </Link>
            <Link
              href={`/gaming/${game.slug}-leveling`}
              className={`flex items-center gap-3 p-4 rounded-lg border ${guideType === 'leveling' ? 'border-primary bg-primary/5' : 'border-border bg-card'} hover:border-primary/50 hover:shadow-md transition-all`}
            >
              <TrendingUp className="h-5 w-5 text-green-600 shrink-0" />
              <div>
                <p className="font-medium text-foreground text-sm">{game.shortName || game.name} Leveling</p>
                <p className="text-xs text-muted-foreground">Progress faster</p>
              </div>
            </Link>
          </div>

          {/* Link to Codes Page */}
          <div className="flex items-center justify-center">
            <Link
              href={`/gaming/${game.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-colors"
            >
              <Gift className="h-5 w-5" />
              Get {game.shortName || game.name} Codes
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* Monetization CTA - Want to progress faster? */}
      <section className="py-10 md:py-12 border-t border-border">
        <PageContainer>
          <div className="p-6 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-foreground text-lg">Want to progress faster?</h4>
                <p className="text-muted-foreground text-sm">Discover deals on gaming gear, gift cards & more</p>
              </div>
              <Link
                href="/deals"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors shrink-0"
              >
                <Zap className="h-5 w-5" />
                Browse Gaming Deals
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>
    </main>
  )
}
