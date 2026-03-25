import { getGames, getPromoCodes, getGameRewards, getGameBySlug, getPromoCodesForGame, getTodaysCodes, getGamingStats } from './gaming-db'
import { gamesData as staticGames, getGameBySlug as getStaticGameBySlug, getActivePromoCodes } from './gaming-data'
import type { Game, PromoCode } from './gaming-data'

// Use database by default, fall back to static data if DB is empty
const USE_DATABASE = true

// Normalize database game to static format
function normalizeDbGame(dbGame: Awaited<ReturnType<typeof getGameBySlug>>): Game | null {
  if (!dbGame) return null
  return {
    id: dbGame.slug,
    name: dbGame.name,
    slug: dbGame.slug,
    shortName: dbGame.short_name ?? '',
    description: dbGame.description ?? '',
    categories: dbGame.categories as Game['categories'],
    platforms: dbGame.platforms as Game['platforms'],
    imageUrl: dbGame.image_url ?? '/images/games/default.webp',
    iconUrl: dbGame.icon_url ?? '',
    developer: dbGame.developer ?? '',
    publisher: dbGame.publisher ?? '',
    affiliateLink: dbGame.affiliate_link ?? '',
    websiteUrl: dbGame.website_url ?? '',
    popularityScore: dbGame.popularity_score,
    playerCount: dbGame.player_count ?? '',
    metaTitle: dbGame.meta_title ?? `${dbGame.name} Promo Codes`,
    metaDescription: dbGame.meta_description ?? `Get the latest ${dbGame.name} promo codes and free rewards.`,
    promoCodes: [],
  }
}

// Normalize database promo code to static format
function normalizeDbCode(dbCode: Awaited<ReturnType<typeof getPromoCodes>>[number]): PromoCode & { id: string; game_id: string } {
  return {
    id: dbCode.id,
    game_id: dbCode.game_id,
    gameId: dbCode.games?.slug ?? '',
    code: dbCode.code,
    reward: dbCode.reward,
    rewardValue: dbCode.reward_value,
    rewardType: dbCode.reward_type as PromoCode['rewardType'],
    expiresAt: dbCode.expires_at ?? '',
    isVerified: dbCode.is_verified,
    isExclusive: dbCode.is_exclusive,
    addedAt: dbCode.created_at,
    successRate: dbCode.success_rate ?? 0,
  }
}

// Get all games
export async function getAllGames(): Promise<Game[]> {
  if (USE_DATABASE) {
    try {
      const dbGames = await getGames({ activeOnly: true, orderBy: 'popularity_score' })
      if (dbGames.length > 0) {
        return dbGames.map(g => normalizeDbGame(g)!).filter(Boolean)
      }
    } catch (error) {
      console.error('Failed to fetch games from DB:', error)
    }
  }
  return staticGames
}

// Get a single game by slug
export async function getGame(slug: string): Promise<Game | null> {
  if (USE_DATABASE) {
    try {
      const dbGame = await getGameBySlug(slug)
      if (dbGame) {
        return normalizeDbGame(dbGame)
      }
    } catch (error) {
      console.error('Failed to fetch game from DB:', error)
    }
  }
  return getStaticGameBySlug(slug)
}

// Get codes for a specific game
export async function getCodesForGame(gameSlug: string): Promise<(PromoCode & { id?: string; game_id?: string })[]> {
  if (USE_DATABASE) {
    try {
      const dbCodes = await getPromoCodesForGame(gameSlug)
      if (dbCodes.length > 0) {
        return dbCodes.map(normalizeDbCode)
      }
    } catch (error) {
      console.error('Failed to fetch codes from DB:', error)
    }
  }
  // Fallback: get codes from static data
  const game = getStaticGameBySlug(gameSlug)
  if (!game) return []
  return getActivePromoCodes(game.promoCodes)
}

// Get all promo codes
export async function getAllCodes(options?: { limit?: number; gameSlug?: string }): Promise<(PromoCode & { id?: string; game_id?: string })[]> {
  if (USE_DATABASE) {
    try {
      const dbCodes = await getPromoCodes({
        gameSlug: options?.gameSlug,
        activeOnly: true,
        limit: options?.limit,
      })
      if (dbCodes.length > 0) {
        return dbCodes.map(normalizeDbCode)
      }
    } catch (error) {
      console.error('Failed to fetch codes from DB:', error)
    }
  }
  // Fallback: collect all codes from static games
  let codes: PromoCode[] = staticGames.flatMap(game => 
    getActivePromoCodes(game.promoCodes).map(code => ({ ...code, gameId: game.slug }))
  )
  if (options?.gameSlug) {
    codes = codes.filter(c => (c as PromoCode & { gameId?: string }).gameId === options.gameSlug)
  }
  if (options?.limit) {
    codes = codes.slice(0, options.limit)
  }
  return codes
}

// Get today's codes
export async function getTodaysPromoCodes(limit = 20): Promise<(PromoCode & { id?: string; game_id?: string })[]> {
  if (USE_DATABASE) {
    try {
      const dbCodes = await getTodaysCodes(limit)
      if (dbCodes.length > 0) {
        return dbCodes.map(normalizeDbCode)
      }
    } catch (error) {
      console.error('Failed to fetch today codes from DB:', error)
    }
  }
  // Fallback: return most recent codes from static data
  const allCodes = staticGames.flatMap(game => 
    getActivePromoCodes(game.promoCodes).map(code => ({ ...code, gameId: game.slug, addedDate: code.addedAt }))
  )
  return allCodes
    .sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())
    .slice(0, limit)
}

// Get gaming statistics
export async function getStats(): Promise<{
  totalGames: number
  totalCodes: number
  totalRewards: number
}> {
  if (USE_DATABASE) {
    try {
      const stats = await getGamingStats()
      if (stats.totalGames > 0 || stats.totalCodes > 0) {
        return stats
      }
    } catch (error) {
      console.error('Failed to fetch stats from DB:', error)
    }
  }
  const totalCodes = staticGames.reduce((sum, game) => sum + getActivePromoCodes(game.promoCodes).length, 0)
  return {
    totalGames: staticGames.length,
    totalCodes,
    totalRewards: 0,
  }
}

// Get featured games (most popular)
export async function getFeaturedGames(limit = 6): Promise<Game[]> {
  const allGames = await getAllGames()
  return allGames
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, limit)
}

// Get recent codes across all games
export async function getRecentCodes(limit = 10): Promise<(PromoCode & { id?: string; game_id?: string })[]> {
  const allCodes = await getAllCodes()
  return allCodes
    .sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime())
    .slice(0, limit)
}
