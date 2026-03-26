import { createClient } from '@/lib/supabase/server'

// Types matching our database schema
export interface DbGame {
  id: string
  name: string
  slug: string
  short_name: string | null
  description: string | null
  categories: string[]
  platforms: string[]
  image_url: string | null
  icon_url: string | null
  developer: string | null
  publisher: string | null
  affiliate_link: string | null
  website_url: string | null
  popularity_score: number
  player_count: string | null
  meta_title: string | null
  meta_description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DbPromoCode {
  id: string
  game_id: string
  code: string
  reward: string
  reward_value: number
  reward_type: string
  expires_at: string | null
  is_verified: boolean
  is_exclusive: boolean
  is_active: boolean
  source: string | null
  source_url: string | null
  uses_count: number
  success_rate: number
  created_at: string
  updated_at: string
}

export interface DbGameReward {
  id: string
  game_id: string
  title: string
  description: string | null
  reward_type: string
  value: string | null
  link: string | null
  expires_at: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DbGeneratedContent {
  id: string
  game_id: string | null
  content_type: string
  slug: string
  seo_title: string | null
  meta_description: string | null
  intro_paragraph: string | null
  faqs: { question: string; answer: string }[]
  keywords: string[]
  internal_links: { text: string; href: string }[]
  is_published: boolean
  generated_at: string
  updated_at: string
}

// Game operations
export async function getGames(options?: { 
  activeOnly?: boolean
  limit?: number 
  orderBy?: 'popularity_score' | 'name' | 'created_at'
}) {
  try {
    const supabase = await createClient()
    let query = supabase.from('games').select('*')
    
    if (options?.activeOnly !== false) {
      query = query.eq('is_active', true)
    }
    
    if (options?.orderBy) {
      query = query.order(options.orderBy, { ascending: options.orderBy === 'name' })
    } else {
      query = query.order('popularity_score', { ascending: false })
    }
    
    if (options?.limit) {
      query = query.limit(options.limit)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as DbGame[]
  } catch (error) {
    console.error("Error in getGames:", error)
    return []
  }
}

export async function getGameBySlug(slug: string) {
  // Guard against null/undefined slug
  if (!slug || slug === "null" || slug === "undefined") {
    console.warn("getGameBySlug called with invalid slug:", slug)
    return null
  }
  
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data as DbGame | null
  } catch (error) {
    console.error("Error in getGameBySlug:", error)
    return null
  }
}

export async function upsertGame(game: Partial<DbGame> & { slug: string; name: string }) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('games')
    .upsert(
      { ...game, updated_at: new Date().toISOString() },
      { onConflict: 'slug' }
    )
    .select()
    .single()
  
  if (error) throw error
  return data as DbGame
}

// Promo code operations
export async function getPromoCodes(options?: {
  gameId?: string
  gameSlug?: string
  activeOnly?: boolean
  verifiedOnly?: boolean
  limit?: number
  rewardType?: string
}) {
  try {
    // Guard against null/undefined gameId
    if (options?.gameId && (options.gameId === 'null' || options.gameId === 'undefined')) {
      console.warn("getPromoCodes called with invalid gameId:", options.gameId)
      return []
    }
    
    const supabase = await createClient()
    
    let query = supabase
      .from('promo_codes')
      .select(`
        *,
        games!inner(slug, name, icon_url)
      `)
    
    if (options?.gameId) {
      query = query.eq('game_id', options.gameId)
    }
    
    if (options?.gameSlug) {
      query = query.eq('games.slug', options.gameSlug)
    }
    
    if (options?.activeOnly !== false) {
      query = query.eq('is_active', true)
    }
    
    if (options?.verifiedOnly) {
      query = query.eq('is_verified', true)
    }
    
    if (options?.rewardType) {
      query = query.eq('reward_type', options.rewardType)
    }
    
    // Filter expired codes
    query = query.or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    
    query = query.order('created_at', { ascending: false })
    
    if (options?.limit) {
      query = query.limit(options.limit)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as (DbPromoCode & { games: { slug: string; name: string; icon_url: string | null } })[]
  } catch (error) {
    console.error("Error in getPromoCodes:", error)
    return []
  }
}

export async function getPromoCodesForGame(gameSlug: string) {
  // Guard against null/undefined gameSlug
  if (!gameSlug || gameSlug === "null" || gameSlug === "undefined") {
    console.warn("getPromoCodesForGame called with invalid gameSlug:", gameSlug)
    return []
  }
  
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('promo_codes')
      .select(`
        *,
        games!inner(id, slug, name, icon_url)
      `)
      .eq('games.slug', gameSlug)
      .eq('is_active', true)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .order('is_verified', { ascending: false })
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as (DbPromoCode & { games: { id: string; slug: string; name: string; icon_url: string | null } })[]
  } catch (error) {
    console.error("Error in getPromoCodesForGame:", error)
    return []
  }
}

export async function upsertPromoCode(code: Partial<DbPromoCode> & { game_id: string; code: string; reward: string }) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('promo_codes')
    .upsert(
      { ...code, updated_at: new Date().toISOString() },
      { onConflict: 'game_id,code' }
    )
    .select()
    .single()
  
  if (error) throw error
  return data as DbPromoCode
}

export async function bulkUpsertPromoCodes(codes: (Partial<DbPromoCode> & { game_id: string; code: string; reward: string })[]) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('promo_codes')
    .upsert(
      codes.map(c => ({ ...c, updated_at: new Date().toISOString() })),
      { onConflict: 'game_id,code' }
    )
    .select()
  
  if (error) throw error
  return data as DbPromoCode[]
}

export async function expireOldCodes(gameId: string, keepCodes: string[]) {
  // Guard against null/undefined gameId
  if (!gameId || gameId === "null" || gameId === "undefined") {
    console.warn("expireOldCodes called with invalid gameId:", gameId)
    return
  }
  
  const supabase = await createClient()
  const { error } = await supabase
    .from('promo_codes')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('game_id', gameId)
    .eq('is_active', true)
    .not('code', 'in', `(${keepCodes.map(c => `"${c}"`).join(',')})`)
  
  if (error) throw error
}

// Game rewards operations
export async function getGameRewards(options?: {
  gameId?: string
  gameSlug?: string
  activeOnly?: boolean
  rewardType?: string
  limit?: number
}) {
  try {
    // Guard against null/undefined gameId
    if (options?.gameId && (options.gameId === 'null' || options.gameId === 'undefined')) {
      console.warn("getGameRewards called with invalid gameId:", options.gameId)
      return []
    }
    
    const supabase = await createClient()
    
    let query = supabase
      .from('game_rewards')
      .select(`
        *,
        games!inner(slug, name, icon_url)
      `)
    
    if (options?.gameId) {
      query = query.eq('game_id', options.gameId)
    }
    
    if (options?.gameSlug) {
      query = query.eq('games.slug', options.gameSlug)
    }
    
    if (options?.activeOnly !== false) {
      query = query.eq('is_active', true)
    }
    
    if (options?.rewardType) {
      query = query.eq('reward_type', options.rewardType)
    }
    
    // Filter expired rewards
    query = query.or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    
    query = query.order('created_at', { ascending: false })
    
    if (options?.limit) {
      query = query.limit(options.limit)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as (DbGameReward & { games: { slug: string; name: string; icon_url: string | null } })[]
  } catch (error) {
    console.error("Error in getGameRewards:", error)
    return []
  }
}

export async function upsertGameReward(reward: Partial<DbGameReward> & { game_id: string; title: string }) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('game_rewards')
    .upsert(
      { ...reward, updated_at: new Date().toISOString() },
      { onConflict: 'id' }
    )
    .select()
    .single()
  
  if (error) throw error
  return data as DbGameReward
}

// Generated content operations
export async function getGeneratedContent(gameSlug?: string, contentType?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('generated_content')
    .select(`
      *,
      games(slug, name)
    `)
    .eq('is_published', true)
  
  if (gameSlug) {
    query = query.eq('games.slug', gameSlug)
  }
  
  if (contentType) {
    query = query.eq('content_type', contentType)
  }
  
  const { data, error } = await query
  if (error) throw error
  return data as (DbGeneratedContent & { games: { slug: string; name: string } | null })[]
}

export async function upsertGeneratedContent(content: Partial<DbGeneratedContent> & { 
  content_type: string
  slug: string 
}) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('generated_content')
    .upsert(
      { ...content, updated_at: new Date().toISOString() },
      { onConflict: 'game_id,content_type,slug' }
    )
    .select()
    .single()
  
  if (error) throw error
  return data as DbGeneratedContent
}

// Analytics operations
export async function trackEvent(event: {
  event_type: 'code_copy' | 'code_click' | 'page_view' | 'affiliate_click'
  game_id?: string
  promo_code_id?: string
  code?: string
  page_slug?: string
  user_agent?: string
  ip_hash?: string
  country?: string
}) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('gaming_analytics')
    .insert(event)
  
  if (error) throw error
}

export async function incrementCodeUses(codeId: string) {
  // Guard against null/undefined codeId
  if (!codeId || codeId === "null" || codeId === "undefined") {
    console.warn("incrementCodeUses called with invalid codeId:", codeId)
    return
  }
  
  const supabase = await createClient()
  const { error } = await supabase.rpc('increment_code_uses', { code_id: codeId })
  
  // Fallback if RPC doesn't exist - direct update
  if (error && error.code === 'PGRST202') {
    const { error: updateError } = await supabase
      .from('promo_codes')
      .update({ uses_count: supabase.rpc('coalesce', { value: 'uses_count + 1', default: 1 }) })
      .eq('id', codeId)
    
    if (updateError) {
      // Simple increment fallback
      const { data: current } = await supabase
        .from('promo_codes')
        .select('uses_count')
        .eq('id', codeId)
        .single()
      
      if (current) {
        await supabase
          .from('promo_codes')
          .update({ uses_count: (current.uses_count || 0) + 1 })
          .eq('id', codeId)
      }
    }
  }
}

// Scrape log operations
export async function logScrape(log: {
  source: string
  game_slug?: string
  codes_found?: number
  codes_added?: number
  codes_updated?: number
  codes_expired?: number
  status?: 'success' | 'error' | 'partial'
  error_message?: string
  duration_ms?: number
}) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('scrape_logs')
      .insert(log)
    
    if (error) {
      console.error("Error in logScrape:", error)
    }
  } catch (error) {
    console.error("Error in logScrape:", error)
    // Non-critical - don't throw
  }
}

// Stats helpers
export async function getGamingStats() {
  try {
    const supabase = await createClient()
    
    const [gamesResult, codesResult, rewardsResult] = await Promise.all([
      supabase.from('games').select('id', { count: 'exact' }).eq('is_active', true),
      supabase.from('promo_codes').select('id', { count: 'exact' }).eq('is_active', true),
      supabase.from('game_rewards').select('id', { count: 'exact' }).eq('is_active', true),
    ])
    
    return {
      totalGames: gamesResult.count || 0,
      totalCodes: codesResult.count || 0,
      totalRewards: rewardsResult.count || 0,
    }
  } catch (error) {
    console.error("Error in getGamingStats:", error)
    return {
      totalGames: 0,
      totalCodes: 0,
      totalRewards: 0,
    }
  }
}

export async function getTodaysCodes(limit = 20) {
  try {
    const supabase = await createClient()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const { data, error } = await supabase
      .from('promo_codes')
      .select(`
        *,
        games!inner(slug, name, icon_url)
      `)
      .eq('is_active', true)
      .gte('created_at', today.toISOString())
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data as (DbPromoCode & { games: { slug: string; name: string; icon_url: string | null } })[]
  } catch (error) {
    console.error("Error in getTodaysCodes:", error)
    return []
  }
}
