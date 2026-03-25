import { NextRequest, NextResponse } from 'next/server'
import { upsertGame, bulkUpsertPromoCodes } from '@/lib/gaming-db'
import { gamesData, getActivePromoCodes } from '@/lib/gaming-data'

export async function POST(request: NextRequest) {
  // Verify authorization
  const authHeader = request.headers.get('authorization')
  const expectedKey = process.env.SEED_API_KEY || process.env.CRON_SECRET
  
  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const results = {
      games_seeded: 0,
      codes_seeded: 0,
      errors: [] as string[],
    }
    
    // Seed all games from static data
    for (const game of gamesData) {
      try {
        const dbGame = await upsertGame({
          slug: game.slug,
          name: game.name,
          short_name: game.shortName,
          description: game.description,
          categories: game.categories,
          platforms: game.platforms,
          image_url: game.imageUrl,
          icon_url: game.iconUrl,
          developer: game.developer,
          publisher: game.publisher,
          affiliate_link: game.affiliateLink,
          website_url: game.websiteUrl,
          popularity_score: game.popularityScore,
          player_count: game.playerCount,
          meta_title: game.metaTitle ?? game.name,
          meta_description: game.metaDescription ?? game.description,
          is_active: true,
        })
        
        results.games_seeded++
        
        // Seed promo codes for this game
        const gameCodes = getActivePromoCodes(game.promoCodes)
        if (gameCodes.length > 0) {
          const codesToInsert = gameCodes.map(code => ({
            game_id: dbGame.id,
            code: code.code,
            reward: code.reward,
            reward_value: code.rewardValue,
            reward_type: code.rewardType,
            expires_at: code.expiresAt,
            is_verified: code.isVerified,
            is_exclusive: code.isExclusive,
            is_active: true,
          }))
          
          const inserted = await bulkUpsertPromoCodes(codesToInsert)
          results.codes_seeded += inserted.length
        }
        
      } catch (error) {
        results.errors.push(`Failed to seed ${game.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
    
    return NextResponse.json({
      success: true,
      ...results,
    })
    
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Seed failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const totalCodes = gamesData.reduce((sum, game) => sum + getActivePromoCodes(game.promoCodes).length, 0)
  return NextResponse.json({
    description: 'Seed the database with gaming data from static files',
    method: 'POST',
    authorization: 'Bearer <CRON_SECRET or SEED_API_KEY>',
    available_games: gamesData.length,
    available_codes: totalCodes,
  })
}
