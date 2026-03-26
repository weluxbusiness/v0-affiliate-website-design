import { NextRequest, NextResponse } from 'next/server'
import { generateText, Output } from 'ai'
import { z } from 'zod'
import { getGameBySlug, getPromoCodesForGame, upsertGeneratedContent } from '@/lib/gaming-db'

export const dynamic = 'force-dynamic'

// Schema for generated SEO content
const seoContentSchema = z.object({
  seo_title: z.string().describe('SEO-optimized page title (50-60 chars)'),
  meta_description: z.string().describe('Meta description for search engines (150-160 chars)'),
  intro_paragraph: z.string().describe('Engaging intro paragraph (2-3 sentences)'),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).describe('3-5 FAQ items about the game codes'),
  keywords: z.array(z.string()).describe('5-10 relevant SEO keywords'),
  internal_links: z.array(z.object({
    text: z.string(),
    href: z.string(),
  })).describe('2-4 suggested internal links to other gaming pages'),
})

type GeneratedContent = z.infer<typeof seoContentSchema>

// Generate SEO content for a game page
async function generateGameContent(
  gameName: string, 
  gameSlug: string,
  codes: { code: string; reward: string; is_verified: boolean }[],
  contentType: 'codes' | 'rewards' | 'main'
): Promise<GeneratedContent> {
  const today = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const codeCount = codes.length
  const verifiedCount = codes.filter(c => c.is_verified).length
  
  const contentTypePrompts = {
    codes: `promo codes page for ${gameName}. Focus on how to redeem codes, where to find them, and tips for getting the most value.`,
    rewards: `free rewards and bonuses page for ${gameName}. Focus on in-game rewards, daily login bonuses, and free items players can claim.`,
    main: `main game hub page for ${gameName}. Provide an overview of all available codes, rewards, and deals for the game.`,
  }
  
  const result = await generateText({
    model: 'openai/gpt-4o-mini',
    output: Output.object({ schema: seoContentSchema }),
    prompt: `Generate SEO-optimized content for a ${contentTypePrompts[contentType]}

Game: ${gameName}
Current Date: ${today}
Active Codes: ${codeCount}
Verified Codes: ${verifiedCount}

Sample codes available:
${codes.slice(0, 5).map(c => `- ${c.code}: ${c.reward}${c.is_verified ? ' (Verified)' : ''}`).join('\n')}

Requirements:
1. SEO title should include the game name, "codes" or relevant term, and current month/year
2. Meta description should be compelling and include a call-to-action
3. Intro paragraph should be engaging and mention the number of active codes
4. FAQs should answer common player questions about codes and redemption
5. Keywords should target search terms players use to find codes
6. Internal links should reference related gaming content like /gaming, /gaming/promo-codes, etc.

Generate content that is:
- Accurate and helpful to players
- Optimized for search engines
- Fresh and updated for ${today}
- Professional in tone but accessible`,
  })
  
  return result.output
}

// Generate content for category pages
async function generateCategoryContent(
  category: 'promo-codes' | 'free-rewards' | 'new-player-deals' | 'today',
  gameCount: number,
  codeCount: number
): Promise<GeneratedContent> {
  const today = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  
  const categoryPrompts = {
    'promo-codes': {
      title: 'All Gaming Promo Codes',
      focus: 'aggregating promo codes across all games',
    },
    'free-rewards': {
      title: 'Free Gaming Rewards',
      focus: 'free in-game rewards, bonuses, and giveaways',
    },
    'new-player-deals': {
      title: 'New Player Gaming Deals',
      focus: 'welcome offers, starter packs, and new player bonuses',
    },
    'today': {
      title: "Today's Gaming Codes",
      focus: 'codes released or updated today',
    },
  }
  
  const config = categoryPrompts[category]
  
  const result = await generateText({
    model: 'openai/gpt-4o-mini',
    output: Output.object({ schema: seoContentSchema }),
    prompt: `Generate SEO-optimized content for a gaming deals category page.

Category: ${config.title}
Focus: ${config.focus}
Current Date: ${today}
Games Covered: ${gameCount}
Total Codes Available: ${codeCount}

Requirements:
1. SEO title should include "${config.title}" and the current month/year
2. Meta description should highlight the value proposition (${codeCount}+ codes across ${gameCount} games)
3. Intro paragraph should explain what users will find and encourage exploration
4. FAQs should address common questions about finding and using codes
5. Keywords should target gaming code searches
6. Internal links should reference specific game pages and other categories

Generate professional, SEO-optimized content for ${today}.`,
  })
  
  return result.output
}

export async function POST(request: NextRequest) {
  // Verify authorization
  const authHeader = request.headers.get('authorization')
  const expectedKey = process.env.CONTENT_API_KEY || process.env.CRON_SECRET
  
  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const body = await request.json()
    const { type, gameSlug, category } = body as {
      type: 'game' | 'category'
      gameSlug?: string
      category?: 'promo-codes' | 'free-rewards' | 'new-player-deals' | 'today'
    }
    
    if (type === 'game' && gameSlug) {
      // Generate content for a specific game
      const game = await getGameBySlug(gameSlug)
      if (!game) {
        return NextResponse.json({ error: 'Game not found' }, { status: 404 })
      }
      
      const codes = await getPromoCodesForGame(gameSlug)
      const simplifiedCodes = codes.map(c => ({
        code: c.code,
        reward: c.reward,
        is_verified: c.is_verified,
      }))
      
      // Generate content for all page types
      const results: Record<string, GeneratedContent> = {}
      
      for (const contentType of ['main', 'codes', 'rewards'] as const) {
        const content = await generateGameContent(
          game.name,
          game.slug,
          simplifiedCodes,
          contentType
        )
        
        // Save to database
        await upsertGeneratedContent({
          game_id: game.id,
          content_type: contentType,
          slug: contentType === 'main' ? game.slug : `${game.slug}-${contentType}`,
          seo_title: content.seo_title,
          meta_description: content.meta_description,
          intro_paragraph: content.intro_paragraph,
          faqs: content.faqs,
          keywords: content.keywords,
          internal_links: content.internal_links,
          is_published: true,
          generated_at: new Date().toISOString(),
        })
        
        results[contentType] = content
      }
      
      return NextResponse.json({
        success: true,
        game: game.name,
        content: results,
      })
      
    } else if (type === 'category' && category) {
      // Generate content for a category page
      // Get stats for the category
      const { createClient } = await import('@/lib/supabase/server')
      const supabase = await createClient()
      
      const [gamesResult, codesResult] = await Promise.all([
        supabase.from('games').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('promo_codes').select('id', { count: 'exact' }).eq('is_active', true),
      ])
      
      const gameCount = gamesResult.count || 0
      const codeCount = codesResult.count || 0
      
      const content = await generateCategoryContent(category, gameCount, codeCount)
      
      // Save to database
      await upsertGeneratedContent({
        game_id: null,
        content_type: 'category',
        slug: category,
        seo_title: content.seo_title,
        meta_description: content.meta_description,
        intro_paragraph: content.intro_paragraph,
        faqs: content.faqs,
        keywords: content.keywords,
        internal_links: content.internal_links,
        is_published: true,
        generated_at: new Date().toISOString(),
      })
      
      return NextResponse.json({
        success: true,
        category,
        content,
      })
      
    } else {
      return NextResponse.json(
        { error: 'Invalid request. Provide type=game with gameSlug, or type=category with category.' },
        { status: 400 }
      )
    }
    
  } catch (error) {
    console.error('Content generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET to check available options
export async function GET() {
  return NextResponse.json({
    endpoints: {
      game: {
        method: 'POST',
        body: { type: 'game', gameSlug: 'string' },
        description: 'Generate SEO content for a specific game',
      },
      category: {
        method: 'POST',
        body: { type: 'category', category: 'promo-codes | free-rewards | new-player-deals | today' },
        description: 'Generate SEO content for a category page',
      },
    },
  })
}
