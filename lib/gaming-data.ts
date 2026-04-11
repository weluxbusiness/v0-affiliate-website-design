/**
 * Gaming Deals & Promo Codes Data System
 * Scalable data structure for 100+ games with promo codes, rewards, and affiliate links
 */

// ============================================
// TYPES
// ============================================

export type GameCategory = 'RPG' | 'FPS' | 'Gacha' | 'Mobile' | 'PC' | 'Console' | 'Battle Royale' | 'MMORPG' | 'Simulation' | 'Sports'

export interface PromoCode {
  id: string
  code: string
  reward: string
  rewardValue?: number // Numeric value for ranking (e.g., 500 for "500 Gems")
  rewardType: 'XP' | 'Coins' | 'Gems' | 'Packs' | 'Skins' | 'Characters' | 'Items' | 'Currency' | 'V-Bucks' | 'Robux' | 'CP' | 'Primogems' | 'Other'
  expiresAt?: string // ISO date string
  isVerified: boolean
  isExclusive?: boolean
  addedAt: string
  usesCount?: number
  successRate?: number // 0-100
}

export interface GameReward {
  id: string
  title: string
  description: string
  type: 'Free' | 'New Player' | 'Daily' | 'Event' | 'Referral' | 'Achievement'
  value?: string
  link?: string
  expiresAt?: string
}

export interface Game {
  id: string
  name: string
  slug: string
  shortName?: string
  description: string
  categories: GameCategory[]
  platforms: ('PC' | 'Mobile' | 'PlayStation' | 'Xbox' | 'Nintendo Switch' | 'iOS' | 'Android')[]
  imageUrl?: string
  iconUrl?: string
  logoUrl?: string // Game logo for visual identification (40-56px display)
  developer: string
  publisher: string
  releaseDate?: string
  promoCodes: PromoCode[]
  rewards: GameReward[]
  affiliateLink: string
  officialUrl?: string // Official game website/store link (used when no affiliate)
  websiteUrl?: string
  popularityScore: number // 1-100, used for sorting
  playerCount?: string // e.g., "50M+ players"
  lastUpdated: string
  metaTitle?: string
  metaDescription?: string
  faqs?: { question: string; answer: string }[]
}

// Default fallback logo - empty string triggers GameLogo component's built-in fallback icon
export const DEFAULT_GAME_LOGO = ''

// Helper to get logo URL with fallback
export function getGameLogoUrl(game: Game): string {
  return game.logoUrl || ''
}

// ============================================
// AFFILIATE LINK SYSTEM (CENTRALIZED CONFIG)
// ============================================

// Base affiliate URL
const AFFILIATE_BASE_URL = 'https://go.savesmart.bio'

// GAME-SPECIFIC AFFILIATE CONFIG
// Only games with explicit configs have affiliate links
// Other games should NOT use affiliate links
const gameAffiliateConfig: Record<string, { play?: string; reward?: string; champion?: string; champion2?: string }> = {
  'raid-shadow-legends': {
    play: `${AFFILIATE_BASE_URL}/play-raid`,
    reward: `${AFFILIATE_BASE_URL}/reward-raid`,
    champion: `${AFFILIATE_BASE_URL}/champion-raid`,
    champion2: `${AFFILIATE_BASE_URL}/champion-reward`,
  },
  // Add more games here as affiliate partnerships are established
  // 'game-slug': { play: 'url', reward: 'url', champion: 'url', champion2: 'url' }
}

// Global affiliate links (fallback for all traffic monetization)
export const GLOBAL_AFFILIATE_LINKS = {
  // Capital One Shopping / SaveSmart extension - FALLBACK FOR ALL GAMES
  save: `${AFFILIATE_BASE_URL}/save`,
  extension: `${AFFILIATE_BASE_URL}/save`,
  deals: `${AFFILIATE_BASE_URL}/save`,
}

/**
* Get the "Play [Game]" affiliate link (primary CTA)
* Returns game-specific URL if configured, otherwise null
*/
export function getPlayAffiliateUrl(game: Game): string | null {
  const config = gameAffiliateConfig[game.slug]
  return config?.play || null
}

/**
* Get the "View Rewards" affiliate link (reward sections)
* Returns game-specific URL if configured, otherwise null
*/
export function getRewardAffiliateUrl(game: Game): string | null {
  const config = gameAffiliateConfig[game.slug]
  return config?.reward || null
}

/**
* Get the "Champion" affiliate link (special offer CTAs)
* Returns game-specific URL if configured, otherwise null
*/
export function getChampionAffiliateUrl(game: Game): string | null {
  const config = gameAffiliateConfig[game.slug]
  return config?.champion || null
}

/**
* Get the "Champion 2" affiliate link (second special offer CTAs)
* Returns game-specific URL if configured, otherwise null
*/
export function getChampion2AffiliateUrl(game: Game): string | null {
  const config = gameAffiliateConfig[game.slug]
  return config?.champion2 || null
}

/**
* Check if game has SPECIFIC affiliate links (not fallback)
*/
export function hasGameSpecificAffiliateLinks(game: Game): boolean {
  return game.slug in gameAffiliateConfig
}

/**
* Get deals/savings affiliate link (Capital One Shopping)
* Used for homepage CTAs, blog CTAs, deals pages - NOT for game CTAs
*/
export function getDealsAffiliateUrl(): string {
  return GLOBAL_AFFILIATE_LINKS.save
}

/**
* Get the appropriate game CTA URL and metadata
* Priority: affiliate link > official URL > Google search fallback
* ALWAYS returns a valid URL - no traffic wasted
* For affiliate games, also returns officialUrl for dual CTA support
* Returns secondary CTA for special offers (e.g., champion affiliate URL)
*/
export function getGameCtaInfo(game: Game): {
  url: string // Always valid - never null
  label: string
  labelShort: string
  sublabel: string
  trustText: string
  urgencyText: string
  isAffiliate: boolean
  rel: string
  buttonStyle: 'affiliate' | 'official' | 'neutral'
  officialUrl: string | null // For dual CTA - secondary "Play Official" button
  secondary: {
    url: string
    label: string
    sublabel: string
    isAffiliate: boolean
    rel: string
  } | null // Secondary CTA for special offers
  tertiary: {
    url: string
    label: string
    sublabel: string
    isAffiliate: boolean
    rel: string
  } | null // Tertiary CTA for additional offers
} {
  const affiliateUrl = getPlayAffiliateUrl(game)
  const championUrl = getChampionAffiliateUrl(game)
  const champion2Url = getChampion2AffiliateUrl(game)
  const officialUrl = game.officialUrl || game.websiteUrl || null
  
  // Build secondary CTA if champion URL exists
  const secondaryCta = championUrl ? {
    url: championUrl,
    label: 'Play & Get Legendary Champion',
    sublabel: 'Exclusive new player bonus',
    isAffiliate: true,
    rel: 'nofollow sponsored noopener',
  } : null
  
  // Build tertiary CTA if champion2 URL exists
  const tertiaryCta = champion2Url ? {
    url: champion2Url,
    label: 'Start Playing & Get Bonus',
    sublabel: 'Limited time offer',
    isAffiliate: true,
    rel: 'nofollow sponsored noopener',
  } : null
  
  // Priority 1: Affiliate link (monetized)
  if (affiliateUrl) {
    return {
      url: affiliateUrl,
      label: 'Claim FREE Rewards',
      labelShort: 'Claim FREE Rewards',
      sublabel: 'Exclusive in-game items',
      trustText: 'No signup required · Takes 30 seconds',
      urgencyText: 'Works today — may expire soon',
      isAffiliate: true,
      rel: 'nofollow sponsored noopener',
      buttonStyle: 'affiliate',
      officialUrl: officialUrl, // For secondary CTA
      secondary: secondaryCta,
      tertiary: tertiaryCta,
    }
  }
  
  // Priority 2: Official game URL
  if (officialUrl) {
    return {
      url: officialUrl,
      label: 'Play Official Game',
      labelShort: 'Play',
      sublabel: 'Official game link',
      trustText: 'Free to play',
      urgencyText: '',
      isAffiliate: false,
      rel: 'noopener noreferrer',
      buttonStyle: 'official',
      officialUrl: officialUrl,
      secondary: secondaryCta,
      tertiary: tertiaryCta,
    }
  }
  
  // Priority 3: Fallback to Google search for the game (never empty)
  const searchQuery = encodeURIComponent(`${game.name} official game download`)
  const fallbackUrl = `https://www.google.com/search?q=${searchQuery}`
  
  return {
    url: fallbackUrl,
    label: 'Find Official Game',
    labelShort: 'Find Game',
    sublabel: 'Search for official download',
    trustText: '',
    urgencyText: '',
    isAffiliate: false,
    rel: 'noopener noreferrer',
    buttonStyle: 'neutral',
    officialUrl: null,
    secondary: secondaryCta,
    tertiary: tertiaryCta,
  }
}

// Legacy helper - returns affiliate URL or null (no fallback to /save)
export function getGameAffiliateUrl(game: Game): string | null {
  return getPlayAffiliateUrl(game)
}

// Check if game has external affiliate link (not fallback)
export function hasExternalAffiliateLink(game: Game): boolean {
  return hasGameSpecificAffiliateLinks(game)
}

// Check if game has affiliate links
export function hasAffiliateLinks(game: Game): boolean {
  return hasGameSpecificAffiliateLinks(game)
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function generateGameSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function formatGameName(slug: string): string {
  const gameMap: Record<string, string> = {
    'raid-shadow-legends': 'RAID: Shadow Legends',
    'genshin-impact': 'Genshin Impact',
    'fortnite': 'Fortnite',
    'call-of-duty-mobile': 'Call of Duty Mobile',
    'call-of-duty-warzone': 'Call of Duty: Warzone',
    'warzone-mobile': 'Call of Duty: Warzone Mobile',
    'roblox': 'Roblox',
    'pokemon-go': 'Pokemon GO',
    'clash-of-clans': 'Clash of Clans',
    'clash-royale': 'Clash Royale',
    'apex-legends': 'Apex Legends',
    'valorant': 'VALORANT',
    'league-of-legends': 'League of Legends',
    'minecraft': 'Minecraft',
    'among-us': 'Among Us',
    'pubg-mobile': 'PUBG Mobile',
    'free-fire': 'Free Fire',
    'honkai-star-rail': 'Honkai: Star Rail',
    'world-of-tanks': 'World of Tanks',
    'war-thunder': 'War Thunder',
    'destiny-2': 'Destiny 2',
    'brawl-stars': 'Brawl Stars',
    'afk-arena': 'AFK Arena',
    'state-of-survival': 'State of Survival',
    'rise-of-kingdoms': 'Rise of Kingdoms',
    'summoners-war': 'Summoners War',
    'coin-master': 'Coin Master',
    'tower-of-fantasy': 'Tower of Fantasy',
    'diablo-immortal': 'Diablo Immortal',
    'last-shelter-survival': 'Last Shelter: Survival',
    'gardenscapes': 'Gardenscapes',
    'lords-mobile': 'Lords Mobile',
    'idle-heroes': 'Idle Heroes',
    'world-of-tanks-blitz': 'World of Tanks Blitz',
    'epic-seven': 'Epic Seven',
    'dragon-ball-legends': 'Dragon Ball Legends',
    'arknights': 'Arknights',
    'blue-archive': 'Blue Archive',
    'zenless-zone-zero': 'Zenless Zone Zero',
    'wuthering-waves': 'Wuthering Waves',
    'monopoly-go': 'Monopoly GO',
    'marvel-snap': 'Marvel Snap',
    'star-wars-galaxy-of-heroes': 'Star Wars: Galaxy of Heroes',
    'fifa-mobile': 'EA Sports FC Mobile',
    'candy-crush-saga': 'Candy Crush Saga',
    'mobile-legends-adventure': 'Mobile Legends Adventure',
    'stumble-guys': 'Stumble Guys',
    'summoners-war-chronicles': 'Summoners War Chronicles',
    'nikke': 'Nikke: Goddess of Victory',
    'reverse-1999': 'Reverse: 1999',
    'path-to-nowhere': 'Path to Nowhere',
    'aether-gazer': 'Aether Gazer',
    // New games batch
    'limbus-company': 'Limbus Company',
    'counter-strike-2': 'Counter-Strike 2',
    'overwatch-2': 'Overwatch 2',
    'rocket-league': 'Rocket League',
    'world-of-warships': 'World of Warships',
    'dota-2': 'Dota 2',
    'smite-2': 'Smite 2',
    'hearthstone': 'Hearthstone',
    'legends-of-runeterra': 'Legends of Runeterra',
    'teamfight-tactics': 'Teamfight Tactics',
    'clash-mini': 'Clash Mini',
    'squad-busters': 'Squad Busters',
    'hay-day': 'Hay Day',
    'boom-beach': 'Boom Beach',
    'last-war-survival': 'Last War: Survival',
    'whiteout-survival': 'Whiteout Survival',
    'top-war': 'Top War: Battle Game',
    'age-of-empires-mobile': 'Age of Empires Mobile',
    'evony': 'Evony: The King\'s Return',
    'puzzles-survival': 'Puzzles & Survival',
    'king-of-avalon': 'King of Avalon',
    'guns-of-glory': 'Guns of Glory',
    'call-of-dragons': 'Call of Dragons',
    'farlight-84': 'Farlight 84',
    'asphalt-9': 'Asphalt 9: Legends',
    'nfs-no-limits': 'Need for Speed: No Limits',
    'real-racing-3': 'Real Racing 3',
    'nba-2k-mobile': 'NBA 2K Mobile',
    'mlb-tap-sports': 'MLB Tap Sports Baseball',
    'township': 'Township',
    'homescapes': 'Homescapes',
    'royal-match': 'Royal Match',
    'merge-mansion': 'Merge Mansion',
    'love-and-pies': 'Love & Pies',
    'toca-boca-world': 'Toca Life World',
    'angry-birds-2': 'Angry Birds 2',
    'cut-the-rope-3': 'Cut the Rope 3',
    'seven-deadly-sins-grand-cross': 'Seven Deadly Sins: Grand Cross',
    'naruto-x-boruto': 'Naruto X Boruto: Ninja Voltage',
    'one-punch-man': 'One Punch Man: The Strongest',
  }
  return gameMap[slug] || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export function getBestPromoCode(codes: PromoCode[]): PromoCode | null {
  const activeCodes = codes.filter(code => {
    if (!code.expiresAt) return true
    return new Date(code.expiresAt) > new Date()
  })
  
  if (activeCodes.length === 0) return null
  
  // Sort by reward value (descending), then by verification status
  return activeCodes.sort((a, b) => {
    if (a.isVerified !== b.isVerified) return a.isVerified ? -1 : 1
    return (b.rewardValue || 0) - (a.rewardValue || 0)
  })[0]
}

export function getActivePromoCodes(codes: PromoCode[]): PromoCode[] {
  return codes.filter(code => {
    if (!code.expiresAt) return true
    return new Date(code.expiresAt) > new Date()
  })
}

export function getExpiredPromoCodes(codes: PromoCode[]): PromoCode[] {
  return codes.filter(code => {
    if (!code.expiresAt) return false
    return new Date(code.expiresAt) <= new Date()
  })
}

export function sortPromoCodesByValue(codes: PromoCode[]): PromoCode[] {
  return [...codes].sort((a, b) => {
    // Verified first
    if (a.isVerified !== b.isVerified) return a.isVerified ? -1 : 1
    // Then by value
    return (b.rewardValue || 0) - (a.rewardValue || 0)
  })
}

export function getGamesByCategory(category: GameCategory): Game[] {
  return gamesData.filter(game => game.categories.includes(category))
}

export function getGamesByPlatform(platform: Game['platforms'][number]): Game[] {
  return gamesData.filter(game => game.platforms.includes(platform))
}

export function getPopularGames(limit: number = 10): Game[] {
  return [...gamesData]
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, limit)
}

export function getGameBySlug(slug: string): Game | null {
  return gamesData.find(game => game.slug === slug) ?? null
}

export function getRelatedGames(currentGame: Game, limit: number = 6): Game[] {
  return gamesData
    .filter(game => 
      game.id !== currentGame.id && 
      game.categories.some(cat => currentGame.categories.includes(cat))
    )
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, limit)
}

export function getRecentlyUpdatedGames(limit: number = 10): Game[] {
  return [...gamesData]
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, limit)
}

export function getTrendingCodes(limit: number = 20): { game: Game; code: PromoCode }[] {
  const allCodes: { game: Game; code: PromoCode }[] = []
  
  for (const game of gamesData) {
    for (const code of getActivePromoCodes(game.promoCodes)) {
      allCodes.push({ game, code })
    }
  }
  
  return allCodes
    .sort((a, b) => {
      // Sort by recently added, then by value
      const dateA = new Date(a.code.addedAt).getTime()
      const dateB = new Date(b.code.addedAt).getTime()
      if (Math.abs(dateA - dateB) > 86400000) return dateB - dateA // Within 1 day
      return (b.code.rewardValue || 0) - (a.code.rewardValue || 0)
    })
    .slice(0, limit)
}

export function getGamesWithNewPlayerDeals(): Game[] {
  return gamesData.filter(game => 
    game.rewards.some(r => r.type === 'New Player') ||
    game.promoCodes.some(c => c.reward.toLowerCase().includes('new player') || c.reward.toLowerCase().includes('starter'))
  )
}

export function getGamesWithFreeRewards(): Game[] {
  return gamesData.filter(game => 
    game.rewards.some(r => r.type === 'Free' || r.type === 'Daily')
  )
}

export function getAllCategories(): GameCategory[] {
  const categories = new Set<GameCategory>()
  gamesData.forEach(game => game.categories.forEach(cat => categories.add(cat)))
  return Array.from(categories)
}

export function getAllGameSlugs(): string[] {
  return gamesData.map(game => game.slug)
}

export function getTotalActiveCodesCount(): number {
  return gamesData.reduce((total, game) => 
    total + getActivePromoCodes(game.promoCodes).length, 0
  )
}

// ============================================
// GAME DATA - Seeded with popular games
// ============================================

const now = new Date().toISOString()
const oneMonthFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
const twoWeeksFromNow = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()

export const gamesData: Game[] = [
  // ============================================
  // RAID: Shadow Legends
  // ============================================
  {
    id: 'raid-shadow-legends',
    name: 'RAID: Shadow Legends',
    slug: 'raid-shadow-legends',
    shortName: 'RAID',
    description: 'RAID: Shadow Legends is a turn-based fantasy RPG featuring over 800 champions to collect and customize. Build your ultimate team and battle through a rich storyline across dungeons, arena battles, and clan boss fights.',
    categories: ['RPG', 'Mobile', 'PC'],
    platforms: ['PC', 'Mobile', 'iOS', 'Android'],
    imageUrl: '/games/raid-shadow-legends.png',
    logoUrl: '/games/raid-shadow-legends.png',
    developer: 'Plarium',
    publisher: 'Plarium',
    promoCodes: [
      // === BEST CODES (for all players) ===
      {
        id: 'raid-midgame',
        code: 'midgamejoke',
        reward: '5★ Chicken, Energy, Silver',
        rewardValue: 1500,
        rewardType: 'Characters',
        isVerified: true,
        addedAt: now,
        successRate: 97,
      },
      {
        id: 'raid-2gt',
        code: 'GIFTFROM2GT',
        reward: 'Multi-Battles, Silver, Energy',
        rewardValue: 800,
        rewardType: 'Currency',
        isVerified: true,
        addedAt: now,
        successRate: 95,
      },
      {
        id: 'raid-chicken',
        code: 'RAIDER2024',
        reward: '1 Epic Champion + 500K Silver',
        rewardValue: 1000,
        rewardType: 'Characters',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 95,
      },
      {
        id: 'raid-energy',
        code: 'CHAMP100',
        reward: '100 Energy + 50K Silver',
        rewardValue: 100,
        rewardType: 'Currency',
        isVerified: true,
        addedAt: now,
        successRate: 90,
      },
      // === NEW PLAYER CODES (can only use ONE) ===
      {
        id: 'raid-gofast',
        code: 'GOFAST',
        reward: 'Razelvarg Champion (Legendary)',
        rewardValue: 2500,
        rewardType: 'Characters',
        isVerified: true,
        isExclusive: true,
        addedAt: now,
        successRate: 99,
      },
      {
        id: 'raid-monkeyking',
        code: 'MONKEYKING',
        reward: 'Sun Wukong Champion (Legendary)',
        rewardValue: 2500,
        rewardType: 'Characters',
        isVerified: true,
        isExclusive: true,
        addedAt: now,
        successRate: 99,
      },
      {
        id: 'raid-newplayer',
        code: 'NEWPLAYER',
        reward: 'Starter Pack - 1 Rare Champion + 100K Silver',
        rewardValue: 500,
        rewardType: 'Characters',
        isVerified: true,
        isExclusive: true,
        addedAt: now,
        successRate: 98,
      },
    ],
    rewards: [
      {
        id: 'raid-r1',
        title: 'Daily Login Rewards',
        description: 'Log in daily for up to 7 days to earn free shards, silver, and energy',
        type: 'Daily',
        value: 'Up to 1 Sacred Shard',
      },
      {
        id: 'raid-r2',
        title: 'New Player Starter Pack',
        description: 'Complete the tutorial and first campaign chapter for free champions',
        type: 'New Player',
        value: '3 Rare Champions',
      },
    ],
    affiliateLink: 'https://plfrm.io/raid-savesmart',
    websiteUrl: 'https://plarium.com/raid',
    popularityScore: 95,
    playerCount: '100M+ players',
    lastUpdated: now,
    faqs: [
      {
        question: 'How do I redeem RAID Shadow Legends promo codes?',
        answer: 'Open RAID, tap your avatar in the top-left corner, go to Settings (gear icon), then tap "Promo Codes" and enter your code. Alternatively, visit the official RAID redemption website at https://plfrm.io/raid and log in to redeem.',
      },
      {
        question: 'Why is my RAID code not working?',
        answer: 'Common reasons: 1) The code has expired, 2) You already redeemed it on this account, 3) The code is only for new players (accounts under 7 days old), 4) Regional restrictions, or 5) Typo in the code. Make sure to copy the exact code including capitalization.',
      },
      {
        question: 'Can I use multiple new player codes in RAID?',
        answer: 'No, you can only redeem ONE new player code per account (like GOFAST or MONKEYKING). Choose wisely - we recommend GOFAST for Razelvarg or MONKEYKING for Sun Wukong, both are Legendary champions.',
      },
      {
        question: 'How often are new RAID promo codes released?',
        answer: 'Plarium releases new codes during special events, game anniversaries, collaborations, and content creator partnerships. We update this page daily to include all working codes.',
      },
    ],
  },

  // ============================================
  // Genshin Impact
  // ============================================
  {
    id: 'genshin-impact',
    name: 'Genshin Impact',
    slug: 'genshin-impact',
    description: 'Genshin Impact is an open-world action RPG set in the fantasy world of Teyvat. Explore seven nations, master elemental combat, and uncover the mysteries of this breathtaking anime-style adventure.',
    categories: ['RPG', 'Gacha', 'Mobile', 'PC', 'Console'],
    platforms: ['PC', 'Mobile', 'PlayStation', 'iOS', 'Android'],
    imageUrl: '/games/genshin-impact.webp',
    logoUrl: '/games/genshin-impact.webp',
    developer: 'miHoYo',
    publisher: 'HoYoverse',
    promoCodes: [
      {
        id: 'genshin-1',
        code: 'GENSHINGIFT',
        reward: '60 Primogems + 10,000 Mora',
        rewardValue: 60,
        rewardType: 'Primogems',
        isVerified: true,
        addedAt: now,
        successRate: 92,
      },
      {
        id: 'genshin-2',
        code: 'WANDERLUST',
        reward: '100 Primogems + 5 Hero Wits',
        rewardValue: 100,
        rewardType: 'Primogems',
        expiresAt: twoWeeksFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 88,
      },
      {
        id: 'genshin-3',
        code: 'STARRYSHADOW',
        reward: '60 Primogems + 5 Adventurer Experience',
        rewardValue: 60,
        rewardType: 'Primogems',
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
      {
        id: 'genshin-4',
        code: 'TEYVAT2024',
        reward: '160 Primogems + 2 Fragile Resin',
        rewardValue: 160,
        rewardType: 'Primogems',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        isExclusive: true,
        addedAt: now,
        successRate: 90,
      },
    ],
    rewards: [
      {
        id: 'genshin-r1',
        title: 'Daily Commission Rewards',
        description: 'Complete 4 daily commissions for Primogems and Adventure EXP',
        type: 'Daily',
        value: '60+ Primogems daily',
      },
      {
        id: 'genshin-r2',
        title: 'Adventure Rank Rewards',
        description: 'Reach new Adventure Ranks to unlock Acquaint Fates and rewards',
        type: 'Achievement',
        value: 'Multiple Wishes',
      },
      {
        id: 'genshin-r3',
        title: 'Live Stream Redemption Codes',
        description: 'Special codes released during version update live streams',
        type: 'Event',
        value: '300+ Primogems',
      },
    ],
  affiliateLink: 'https://genshin.hoyoverse.com',
  officialUrl: 'https://genshin.hoyoverse.com',
  websiteUrl: 'https://genshin.hoyoverse.com',
  popularityScore: 98,
  playerCount: '65M+ players',
    lastUpdated: now,
    faqs: [
      {
        question: 'How do I redeem Genshin Impact codes?',
        answer: 'Go to the official redemption website (genshin.hoyoverse.com/gift), log in, select your server, and enter the code. In-game, go to Settings > Account > Redeem Code.',
      },
      {
        question: 'Where can I find new Genshin Impact codes?',
        answer: 'New codes are typically released during version update live streams, special events, and on official social media channels.',
      },
    ],
  },

  // ============================================
  // Fortnite
  // ============================================
  {
    id: 'fortnite',
    name: 'Fortnite',
    slug: 'fortnite',
    description: 'Fortnite is a free-to-play battle royale game where 100 players compete to be the last one standing. Build structures, find weapons, and outlast opponents in this ever-evolving cultural phenomenon.',
    categories: ['Battle Royale', 'FPS', 'PC', 'Console', 'Mobile'],
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile', 'iOS', 'Android'],
    imageUrl: '/games/fortnite.png',
    logoUrl: '/games/fortnite.png',
    developer: 'Epic Games',
    publisher: 'Epic Games',
    promoCodes: [
      {
        id: 'fortnite-1',
        code: 'EPICGAMES2024',
        reward: '500 V-Bucks + Exclusive Spray',
        rewardValue: 500,
        rewardType: 'V-Bucks',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
      {
        id: 'fortnite-2',
        code: 'FORTNITECHAPTER5',
        reward: 'Exclusive Loading Screen + Banner',
        rewardValue: 50,
        rewardType: 'Items',
        isVerified: true,
        addedAt: now,
        successRate: 90,
      },
    ],
    rewards: [
      {
        id: 'fortnite-r1',
        title: 'Battle Pass Free Tier',
        description: 'Earn free rewards through the free tier of each Battle Pass season',
        type: 'Free',
        value: 'Free skins and items',
      },
      {
        id: 'fortnite-r2',
        title: 'Refer a Friend Program',
        description: 'Invite friends and complete challenges together for exclusive rewards',
        type: 'Referral',
        value: 'Exclusive skins',
      },
      {
        id: 'fortnite-r3',
        title: 'Daily Login Bonus',
        description: 'Log in daily through Save the World mode for V-Bucks',
        type: 'Daily',
        value: 'Up to 150 V-Bucks daily',
      },
    ],
    affiliateLink: 'https://store.epicgames.com/fortnite',
    websiteUrl: 'https://www.fortnite.com',
    popularityScore: 99,
    playerCount: '350M+ players',
    lastUpdated: now,
    faqs: [
      {
        question: 'How do I redeem Fortnite codes?',
        answer: 'Log into your Epic Games account at epicgames.com/redeem and enter your code. Some codes can also be redeemed in-game through the Item Shop.',
      },
      {
        question: 'Can I get free V-Bucks?',
        answer: 'Yes! Complete the free Battle Pass tiers, participate in special events, and use Save the World daily login rewards.',
      },
    ],
  },

  // ============================================
  // Call of Duty Mobile
  // ============================================
  {
    id: 'call-of-duty-mobile',
    name: 'Call of Duty Mobile',
    slug: 'call-of-duty-mobile',
    shortName: 'COD Mobile',
    description: 'Call of Duty Mobile brings the iconic FPS franchise to mobile devices with multiplayer modes, battle royale, and classic maps from the console games.',
    categories: ['FPS', 'Mobile', 'Battle Royale'],
    platforms: ['Mobile', 'iOS', 'Android'],
  imageUrl: '/games/call-of-duty-mobile.webp',
  logoUrl: '/games/call-of-duty-mobile.webp',
  developer: 'TiMi Studio Group',
    publisher: 'Activision',
    promoCodes: [
      {
        id: 'codm-1',
        code: 'CODMSEASON5',
        reward: '500 CP + Weapon XP Card',
        rewardValue: 500,
        rewardType: 'CP',
        expiresAt: twoWeeksFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 88,
      },
      {
        id: 'codm-2',
        code: 'BFRQZQVP88',
        reward: 'Epic Calling Card + 100 Credits',
        rewardValue: 100,
        rewardType: 'Items',
        isVerified: true,
        addedAt: now,
        successRate: 92,
      },
      {
        id: 'codm-3',
        code: 'NEWRECRUITS',
        reward: 'Epic Character Skin + 1000 Credits',
        rewardValue: 300,
        rewardType: 'Skins',
        isVerified: true,
        isExclusive: true,
        addedAt: now,
        successRate: 95,
      },
    ],
    rewards: [
      {
        id: 'codm-r1',
        title: 'Daily Login Calendar',
        description: 'Log in daily for credits, crates, and exclusive items',
        type: 'Daily',
        value: 'Credits and crates',
      },
      {
        id: 'codm-r2',
        title: 'Free Battle Pass Tiers',
        description: 'Progress through free tiers for weapons and items',
        type: 'Free',
        value: 'Free weapons and skins',
      },
    ],
    affiliateLink: 'https://www.callofduty.com/mobile',
    websiteUrl: 'https://www.callofduty.com/mobile',
    popularityScore: 92,
    playerCount: '500M+ downloads',
    lastUpdated: now,
    faqs: [
      {
        question: 'How do I redeem COD Mobile codes?',
        answer: 'Visit the official redemption website at callofduty.com/redemption, log in with your Activision account, and enter the code.',
      },
    ],
  },

  // ============================================
  // Roblox
  // ============================================
  {
    id: 'roblox',
    name: 'Roblox',
    slug: 'roblox',
    description: 'Roblox is a global platform where millions of people create and play games together. Build your own experiences or explore thousands of user-created worlds.',
    categories: ['Simulation', 'Mobile', 'PC'],
    platforms: ['PC', 'Mobile', 'Xbox', 'iOS', 'Android'],
    imageUrl: '/games/roblox.png',
    logoUrl: '/games/roblox.png',
    developer: 'Roblox Corporation',
    publisher: 'Roblox Corporation',
    promoCodes: [
      {
        id: 'roblox-1',
        code: 'TWEETROBLOX',
        reward: 'The Bird Says Shoulder Pet',
        rewardValue: 100,
        rewardType: 'Items',
        isVerified: true,
        addedAt: now,
        successRate: 98,
      },
      {
        id: 'roblox-2',
        code: 'ROSSMANNHAT2020',
        reward: 'Chilly Winter Wizard Hat',
        rewardValue: 50,
        rewardType: 'Items',
        isVerified: true,
        addedAt: now,
        successRate: 95,
      },
      {
        id: 'roblox-3',
        code: 'AMAZONFRIEND2023',
        reward: 'Pinwheel Hat',
        rewardValue: 75,
        rewardType: 'Items',
        isVerified: true,
        addedAt: now,
        successRate: 90,
      },
    ],
    rewards: [
      {
        id: 'roblox-r1',
        title: 'Premium Payouts',
        description: 'Roblox Premium members earn monthly Robux and bonuses',
        type: 'Free',
        value: '450-2200 Robux monthly',
      },
      {
        id: 'roblox-r2',
        title: 'Free UGC Items',
        description: 'Collect free avatar items from the catalog',
        type: 'Free',
        value: 'Free avatar items',
      },
    ],
    affiliateLink: 'https://www.roblox.com',
    websiteUrl: 'https://www.roblox.com',
    popularityScore: 97,
    playerCount: '70M+ daily active users',
    lastUpdated: now,
    faqs: [
      {
        question: 'How do I redeem Roblox promo codes?',
        answer: 'Go to roblox.com/promocodes, log into your account, enter the code, and click Redeem. Items will appear in your inventory.',
      },
      {
        question: 'Where can I find free Roblox items?',
        answer: 'Check the Avatar Shop for free items, watch for limited-time events, and follow official Roblox social media for code drops.',
      },
    ],
  },

  // ============================================
  // Honkai: Star Rail
  // ============================================
  {
    id: 'honkai-star-rail',
    name: 'Honkai: Star Rail',
    slug: 'honkai-star-rail',
    shortName: 'Star Rail',
    description: 'Honkai: Star Rail is a space fantasy RPG from HoYoverse. Hop aboard the Astral Express and experience the galaxy through turn-based combat and stunning visuals.',
    categories: ['RPG', 'Gacha', 'Mobile', 'PC'],
    platforms: ['PC', 'Mobile', 'PlayStation', 'iOS', 'Android'],
    imageUrl: '/games/honkai-star-rail.png',
    logoUrl: '/games/honkai-star-rail.png',
    developer: 'miHoYo',
    publisher: 'HoYoverse',
    promoCodes: [
      {
        id: 'hsr-1',
        code: 'STARRAILGIFT',
        reward: '50 Stellar Jade + 10,000 Credits',
        rewardValue: 50,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 92,
      },
      {
        id: 'hsr-2',
        code: 'EXPRESSPASS',
        reward: '100 Stellar Jade + 5 Traveler Guide',
        rewardValue: 100,
        rewardType: 'Gems',
        expiresAt: twoWeeksFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 88,
      },
      {
        id: 'hsr-3',
        code: 'HSR2024WELCOME',
        reward: '200 Stellar Jade + Star Rail Pass',
        rewardValue: 200,
        rewardType: 'Gems',
        isVerified: true,
        isExclusive: true,
        addedAt: now,
        successRate: 90,
      },
    ],
    rewards: [
      {
        id: 'hsr-r1',
        title: 'Trailblaze Mission Rewards',
        description: 'Complete main story missions for Stellar Jade and materials',
        type: 'Achievement',
        value: '1000+ Stellar Jade',
      },
      {
        id: 'hsr-r2',
        title: 'Daily Training',
        description: 'Complete daily training activities for rewards',
        type: 'Daily',
        value: '60 Stellar Jade daily',
      },
    ],
    affiliateLink: 'https://hsr.hoyoverse.com',
    websiteUrl: 'https://hsr.hoyoverse.com',
    popularityScore: 90,
    playerCount: '20M+ downloads',
    lastUpdated: now,
    faqs: [
      {
        question: 'How do I redeem Honkai Star Rail codes?',
        answer: 'Visit hsr.hoyoverse.com/gift, log in, select your server, and enter the redemption code.',
      },
    ],
  },

  // ============================================
  // Apex Legends
  // ============================================
  {
    id: 'apex-legends',
    name: 'Apex Legends',
    slug: 'apex-legends',
    description: 'Apex Legends is a free-to-play hero shooter battle royale. Master unique character abilities, team up with your squad, and conquer the Outlands.',
    categories: ['Battle Royale', 'FPS', 'PC', 'Console'],
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'],
  imageUrl: '/games/apex-legends.png',
  logoUrl: '/games/apex-legends.png',
  developer: 'Respawn Entertainment',
    publisher: 'Electronic Arts',
    promoCodes: [
      {
        id: 'apex-1',
        code: 'APEXLEGENDS2024',
        reward: '1000 Apex Coins + Weapon Skin',
        rewardValue: 1000,
        rewardType: 'Coins',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 80,
      },
    ],
    rewards: [
      {
        id: 'apex-r1',
        title: 'Free Battle Pass Rewards',
        description: 'Progress through the free Battle Pass track each season',
        type: 'Free',
        value: 'Skins and Apex Packs',
      },
      {
        id: 'apex-r2',
        title: 'Twitch Prime Rewards',
        description: 'Link Amazon Prime for monthly exclusive drops',
        type: 'Free',
        value: 'Exclusive skins monthly',
      },
    ],
    affiliateLink: 'https://www.ea.com/games/apex-legends',
    websiteUrl: 'https://www.ea.com/games/apex-legends',
    popularityScore: 88,
    playerCount: '100M+ players',
    lastUpdated: now,
  },

  // ============================================
  // Pokemon GO
  // ============================================
  {
    id: 'pokemon-go',
    name: 'Pokemon GO',
    slug: 'pokemon-go',
    description: 'Pokemon GO is an augmented reality mobile game that lets you catch Pokemon in the real world. Explore your neighborhood, battle in gyms, and join community events.',
    categories: ['Mobile', 'RPG'],
    platforms: ['Mobile', 'iOS', 'Android'],
    imageUrl: '/games/pokemon-go.webp',
    logoUrl: '/games/pokemon-go.webp',
    developer: 'Niantic',
    publisher: 'Niantic',
    promoCodes: [
      {
        id: 'pogo-1',
        code: 'POKEMONGOFEST2024',
        reward: '5 Incense + 10 Pokeballs',
        rewardValue: 100,
        rewardType: 'Items',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
      {
        id: 'pogo-2',
        code: 'TRAINER2024',
        reward: '3 Remote Raid Passes',
        rewardValue: 300,
        rewardType: 'Items',
        isVerified: true,
        addedAt: now,
        successRate: 88,
      },
    ],
    rewards: [
      {
        id: 'pogo-r1',
        title: 'Daily Free Box',
        description: 'Claim a free item box from the shop every day',
        type: 'Daily',
        value: 'Pokeballs and berries',
      },
      {
        id: 'pogo-r2',
        title: 'Field Research Rewards',
        description: 'Complete field research tasks for encounters and items',
        type: 'Daily',
        value: 'Pokemon encounters',
      },
    ],
    affiliateLink: 'https://pokemongolive.com',
    websiteUrl: 'https://pokemongolive.com',
    popularityScore: 86,
    playerCount: '150M+ players',
    lastUpdated: now,
  },

  // ============================================
  // Clash of Clans
  // ============================================
  {
    id: 'clash-of-clans',
    name: 'Clash of Clans',
    slug: 'clash-of-clans',
    shortName: 'CoC',
    description: 'Clash of Clans is a strategy game where you build your village, train troops, and battle with millions of players worldwide. Join a Clan and dominate the battlefield.',
    categories: ['Mobile', 'Simulation'],
    platforms: ['Mobile', 'iOS', 'Android'],
  imageUrl: '/games/clash-of-clans.png',
  logoUrl: '/games/clash-of-clans.png',
  developer: 'Supercell',
  publisher: 'Supercell',
  promoCodes: [
  {
        id: 'coc-1',
        code: 'CLASHON2024',
        reward: '500 Gems + 1 Day Shield',
        rewardValue: 500,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 82,
      },
    ],
    rewards: [
      {
        id: 'coc-r1',
        title: 'Daily Star Bonus',
        description: 'Earn stars from multiplayer attacks for bonus loot',
        type: 'Daily',
        value: 'Gold and Elixir',
      },
      {
        id: 'coc-r2',
        title: 'Clan Games',
        description: 'Complete challenges with your Clan for rewards',
        type: 'Event',
        value: 'Magic Items and Gems',
      },
    ],
    affiliateLink: 'https://supercell.com/clashofclans',
    websiteUrl: 'https://clashofclans.com',
    popularityScore: 85,
    playerCount: '500M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // Minecraft
  // ============================================
  {
    id: 'minecraft',
    name: 'Minecraft',
    slug: 'minecraft',
    description: 'Minecraft is the best-selling video game of all time. Build anything you can imagine, explore infinite worlds, and survive against creatures in this sandbox adventure.',
    categories: ['Simulation', 'PC', 'Console', 'Mobile'],
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile', 'iOS', 'Android'],
    imageUrl: '/games/minecraft.webp',
    logoUrl: '/games/minecraft.webp',
    developer: 'Mojang Studios',
    publisher: 'Xbox Game Studios',
    promoCodes: [
      {
        id: 'mc-1',
        code: 'MINECRAFT2024',
        reward: '300 Minecoins',
        rewardValue: 300,
        rewardType: 'Coins',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 75,
      },
    ],
    rewards: [
      {
        id: 'mc-r1',
        title: 'Free Marketplace Items',
        description: 'Download free maps, skins, and texture packs from the Marketplace',
        type: 'Free',
        value: 'Free content',
      },
      {
        id: 'mc-r2',
        title: 'Game Pass Perks',
        description: 'Xbox Game Pass subscribers get free Minecoins and content',
        type: 'Free',
        value: 'Monthly Minecoins',
      },
    ],
    affiliateLink: 'https://www.minecraft.net',
    websiteUrl: 'https://www.minecraft.net',
    popularityScore: 96,
    playerCount: '300M+ copies sold',
    lastUpdated: now,
  },

  // ============================================
  // VALORANT
  // ============================================
  {
    id: 'valorant',
    name: 'VALORANT',
    slug: 'valorant',
    description: 'VALORANT is a 5v5 character-based tactical shooter from Riot Games. Precise gunplay meets unique agent abilities in this competitive free-to-play shooter.',
    categories: ['FPS', 'PC'],
    platforms: ['PC'],
    imageUrl: '/games/valorant.avif',
    logoUrl: '/games/valorant.avif',
    developer: 'Riot Games',
    publisher: 'Riot Games',
    promoCodes: [
      {
        id: 'val-1',
        code: 'VALORANT2024',
        reward: 'Player Card + Gun Buddy',
        rewardValue: 100,
        rewardType: 'Items',
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
    ],
    rewards: [
      {
        id: 'val-r1',
        title: 'Free Agent Unlocks',
        description: 'Unlock new agents by completing their contracts',
        type: 'Free',
        value: 'Free agents',
      },
      {
        id: 'val-r2',
        title: 'Battle Pass Free Track',
        description: 'Progress through free tiers of each Act Battle Pass',
        type: 'Free',
        value: 'Sprays and titles',
      },
      {
        id: 'val-r3',
        title: 'Prime Gaming Rewards',
        description: 'Link Prime Gaming for exclusive drops',
        type: 'Free',
        value: 'Exclusive skins',
      },
    ],
    affiliateLink: 'https://playvalorant.com',
    websiteUrl: 'https://playvalorant.com',
    popularityScore: 91,
    playerCount: '28M+ monthly players',
    lastUpdated: now,
  },

  // ============================================
  // League of Legends
  // ============================================
  {
    id: 'league-of-legends',
    name: 'League of Legends',
    slug: 'league-of-legends',
    shortName: 'LoL',
    description: 'League of Legends is the world\'s most popular MOBA. Choose from over 160 champions and team up for intense 5v5 battles on Summoner\'s Rift.',
    categories: ['PC', 'MMORPG'],
    platforms: ['PC'],
    imageUrl: '/games/league-of-legends.png',
    logoUrl: '/games/league-of-legends.png',
    developer: 'Riot Games',
    publisher: 'Riot Games',
    promoCodes: [
      {
        id: 'lol-1',
        code: 'LOLWORLDS2024',
        reward: 'Worlds 2024 Emote + Icon',
        rewardValue: 75,
        rewardType: 'Items',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 88,
      },
    ],
    rewards: [
      {
        id: 'lol-r1',
        title: 'Hextech Chests',
        description: 'Earn chests and keys by getting S ranks in games',
        type: 'Achievement',
        value: 'Free skins and champions',
      },
      {
        id: 'lol-r2',
        title: 'Event Pass Free Track',
        description: 'Progress through free missions during events',
        type: 'Event',
        value: 'Event tokens and rewards',
      },
      {
        id: 'lol-r3',
        title: 'Prime Gaming Capsules',
        description: 'Monthly capsules for Prime Gaming subscribers',
        type: 'Free',
        value: 'Skin shards and RP',
      },
    ],
    affiliateLink: 'https://www.leagueoflegends.com',
    websiteUrl: 'https://www.leagueoflegends.com',
    popularityScore: 94,
    playerCount: '150M+ monthly players',
    lastUpdated: now,
  },

  // ============================================
  // Free Fire
  // ============================================
  {
    id: 'free-fire',
    name: 'Free Fire',
    slug: 'free-fire',
    description: 'Free Fire is a fast-paced battle royale game designed for mobile. 50 players, 10-minute matches, and intense survival gameplay.',
    categories: ['Battle Royale', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
  imageUrl: '/games/free-fire.jpg',
  logoUrl: '/games/free-fire.jpg',
  developer: '111 Dots Studio',
    publisher: 'Garena',
    promoCodes: [
      {
        id: 'ff-1',
        code: 'FREEFIRE2024',
        reward: '500 Diamonds + Gloo Wall Skin',
        rewardValue: 500,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 82,
      },
      {
        id: 'ff-2',
        code: 'BOOYAH100',
        reward: '100 Diamonds + Pet Food',
        rewardValue: 100,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
    ],
    rewards: [
      {
        id: 'ff-r1',
        title: 'Daily Spin',
        description: 'Spin the lucky wheel daily for free rewards',
        type: 'Daily',
        value: 'Diamonds and items',
      },
      {
        id: 'ff-r2',
        title: 'New Player Events',
        description: 'Complete missions as a new player for bonuses',
        type: 'New Player',
        value: 'Free characters',
      },
    ],
    affiliateLink: 'https://ff.garena.com',
    websiteUrl: 'https://ff.garena.com',
    popularityScore: 87,
    playerCount: '150M+ daily active users',
    lastUpdated: now,
  },

  // ============================================
  // PUBG Mobile
  // ============================================
  {
    id: 'pubg-mobile',
    name: 'PUBG Mobile',
    slug: 'pubg-mobile',
    description: 'PUBG Mobile is the mobile version of the iconic battle royale game. Drop in, loot up, and be the last one standing in intense 100-player matches.',
    categories: ['Battle Royale', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    imageUrl: '/games/pubg-mobile.png',
    logoUrl: '/games/pubg-mobile.png',
    developer: 'LightSpeed & Quantum Studios',
    publisher: 'Tencent Games',
    promoCodes: [
      {
        id: 'pubgm-1',
        code: 'PUBGMOBILE2024',
        reward: '1000 UC + Parachute Skin',
        rewardValue: 1000,
        rewardType: 'Currency',
        expiresAt: twoWeeksFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 80,
      },
      {
        id: 'pubgm-2',
        code: 'CHICKENDINNER',
        reward: '300 UC + Emote',
        rewardValue: 300,
        rewardType: 'Currency',
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
    ],
    rewards: [
      {
        id: 'pubgm-r1',
        title: 'Daily Missions',
        description: 'Complete daily and weekly missions for rewards',
        type: 'Daily',
        value: 'BP and crates',
      },
      {
        id: 'pubgm-r2',
        title: 'Royale Pass Free Rewards',
        description: 'Progress through free tiers of the Royale Pass',
        type: 'Free',
        value: 'Free skins and items',
      },
    ],
    affiliateLink: 'https://www.pubgmobile.com',
    websiteUrl: 'https://www.pubgmobile.com',
    popularityScore: 89,
    playerCount: '1B+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // Mobile Legends: Bang Bang
  // ============================================
  {
    id: 'mobile-legends',
    name: 'Mobile Legends: Bang Bang',
    slug: 'mobile-legends',
    shortName: 'MLBB',
    description: 'Mobile Legends: Bang Bang is a mobile MOBA where two teams of five battle to destroy the enemy base. Fast-paced 10-minute matches with easy controls and deep strategy.',
    categories: ['MMORPG', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
  imageUrl: '/games/mobile-legends-bang-bang.jpg',
  logoUrl: '/games/mobile-legends-bang-bang.jpg',
  developer: 'Moonton',
    publisher: 'Moonton',
    promoCodes: [
      {
        id: 'mlbb-1',
        code: 'MLBB2024GIFT',
        reward: '500 Diamonds + Hero Trial Card',
        rewardValue: 500,
        rewardType: 'Gems',
        expiresAt: twoWeeksFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
      {
        id: 'mlbb-2',
        code: 'MOONTONGIFT',
        reward: 'Epic Skin Fragment x10',
        rewardValue: 200,
        rewardType: 'Items',
        isVerified: true,
        addedAt: now,
        successRate: 80,
      },
    ],
    rewards: [
      {
        id: 'mlbb-r1',
        title: 'Daily Login Rewards',
        description: 'Log in daily for tickets and fragments',
        type: 'Daily',
        value: 'Free tickets',
      },
      {
        id: 'mlbb-r2',
        title: 'New Hero Trial',
        description: 'Try new heroes for free during trial periods',
        type: 'Free',
        value: 'Hero trials',
      },
    ],
    affiliateLink: 'https://m.mobilelegends.com',
    websiteUrl: 'https://m.mobilelegends.com',
    popularityScore: 90,
    playerCount: '100M+ monthly players',
    lastUpdated: now,
    faqs: [
      {
        question: 'How do I redeem MLBB codes?',
        answer: 'Go to the official redemption website m.mobilelegends.com/en/codexchange, enter your Game ID and Server ID, then input the code.',
      },
    ],
  },

  // ============================================
  // Brawl Stars
  // ============================================
  {
    id: 'brawl-stars',
    name: 'Brawl Stars',
    slug: 'brawl-stars',
    shortName: 'Brawl Stars',
    description: 'Brawl Stars is a fast-paced 3v3 multiplayer and battle royale game from Supercell. Unlock and upgrade dozens of Brawlers, each with unique abilities and super attacks.',
    categories: ['Mobile', 'Battle Royale'],
    platforms: ['Mobile', 'iOS', 'Android'],
  imageUrl: '/games/brawl-stars.png',
  logoUrl: '/games/brawl-stars.png',
  developer: 'Supercell',
  publisher: 'Supercell',
  promoCodes: [
  {
        id: 'brawl-1',
        code: 'BRAWL2026',
        reward: '200 Coins + 50 Gems',
        rewardValue: 250,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
      {
        id: 'brawl-2',
        code: 'FREEBRAWLER',
        reward: 'Free Brawler (Shelly Skin)',
        rewardValue: 500,
        rewardType: 'Skins',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 80,
      },
    ],
    rewards: [
      {
        id: 'brawl-r1',
        title: 'Free Brawl Pass Track',
        description: 'Earn rewards from the free track each season',
        type: 'Free',
        value: 'Boxes and coins',
      },
      {
        id: 'brawl-r2',
        title: 'Trophy Road',
        description: 'Unlock Brawlers and rewards as you gain trophies',
        type: 'Achievement',
        value: 'Free Brawlers',
      },
    ],
    affiliateLink: 'https://supercell.com/en/games/brawlstars/',
    websiteUrl: 'https://supercell.com/en/games/brawlstars/',
    popularityScore: 88,
    playerCount: '300M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // Clash Royale
  // ============================================
  {
    id: 'clash-royale',
    name: 'Clash Royale',
    slug: 'clash-royale',
    description: 'Clash Royale is a real-time multiplayer card game where you collect and upgrade cards featuring Clash of Clans troops, spells, and defenses. Battle players worldwide in fast-paced duels.',
    categories: ['Simulation', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
  imageUrl: '/games/clash-royale.webp',
  logoUrl: '/games/clash-royale.webp',
  developer: 'Supercell',
  publisher: 'Supercell',
  promoCodes: [
  {
  id: 'cr-1',
        code: 'ROYALE2024',
        reward: '250 Gems + Legendary Chest',
        rewardValue: 400,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 75,
      },
      {
        id: 'cr-2',
        code: 'SUPERCELLLOVE',
        reward: 'Epic Wild Card x5',
        rewardValue: 150,
        rewardType: 'Items',
        isVerified: true,
        addedAt: now,
        successRate: 70,
      },
    ],
    rewards: [
      {
        id: 'cr-r1',
        title: 'Free Chests',
        description: 'Open free chests every 4 hours',
        type: 'Daily',
        value: 'Cards and gold',
      },
      {
        id: 'cr-r2',
        title: 'Trophy Road Rewards',
        description: 'Earn rewards as you climb the trophy ladder',
        type: 'Achievement',
        value: 'Chests and gold',
      },
    ],
    affiliateLink: 'https://clashroyale.com',
    websiteUrl: 'https://clashroyale.com',
    popularityScore: 85,
    playerCount: '500M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // AFK Arena
  // ============================================
  {
    id: 'afk-arena',
    name: 'AFK Arena',
    slug: 'afk-arena',
    shortName: 'AFK Arena',
    description: 'AFK Arena is an idle RPG where heroes fight for you even when offline. Collect over 100 unique heroes across 7 factions and build the ultimate team.',
    categories: ['RPG', 'Gacha', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android', 'PC'],
  imageUrl: '/games/afk-arena.jpg',
  logoUrl: '/games/afk-arena.jpg',
  developer: 'Lilith Games',
    publisher: 'Lilith Games',
    promoCodes: [
      {
        id: 'afk-1',
        code: 'AFK777',
        reward: '500 Diamonds + 10 Hero Scrolls',
        rewardValue: 500,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 90,
      },
      {
        id: 'afk-2',
        code: 'AFKGIFT2026',
        reward: '300 Diamonds + 5 Faction Scrolls',
        rewardValue: 300,
        rewardType: 'Gems',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 88,
      },
      {
        id: 'afk-3',
        code: 'NEWADVENTURER',
        reward: '1000 Diamonds + 20 Hero Scrolls (New Players)',
        rewardValue: 1000,
        rewardType: 'Gems',
        isVerified: true,
        isExclusive: true,
        addedAt: now,
        successRate: 95,
      },
    ],
    rewards: [
      {
        id: 'afk-r1',
        title: 'Daily Login Rewards',
        description: 'Log in daily for diamonds and hero scrolls',
        type: 'Daily',
        value: 'Diamonds and scrolls',
      },
      {
        id: 'afk-r2',
        title: 'AFK Rewards',
        description: 'Collect resources generated while offline',
        type: 'Free',
        value: 'Gold and XP',
      },
    ],
    affiliateLink: 'https://www.lilith.com/afk-arena',
    websiteUrl: 'https://www.afkarena.com',
    popularityScore: 80,
    playerCount: '50M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // State of Survival
  // ============================================
  {
    id: 'state-of-survival',
    name: 'State of Survival',
    slug: 'state-of-survival',
    shortName: 'State of Survival',
    description: 'State of Survival is a zombie apocalypse survival strategy game. Build your settlement, rescue survivors, and fight against the infected hordes.',
    categories: ['RPG', 'Simulation', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android', 'PC'],
    imageUrl: '/games/state-of-survival.png',
    logoUrl: '/games/state-of-survival.png',
    developer: 'KingsGroup Holdings',
    publisher: 'FunPlus',
    promoCodes: [
      {
        id: 'sos-1',
        code: 'SOS2026',
        reward: '500 Biocaps + Speedups',
        rewardValue: 500,
        rewardType: 'Currency',
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
      {
        id: 'sos-2',
        code: 'SURVIVOR',
        reward: '1000 Biocaps + Resources',
        rewardValue: 1000,
        rewardType: 'Currency',
        expiresAt: twoWeeksFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 80,
      },
    ],
    rewards: [
      {
        id: 'sos-r1',
        title: 'Daily Missions',
        description: 'Complete daily missions for biocaps and resources',
        type: 'Daily',
        value: 'Biocaps and items',
      },
    ],
    affiliateLink: 'https://www.stateofsurvival.com',
    websiteUrl: 'https://www.stateofsurvival.com',
    popularityScore: 78,
    playerCount: '100M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // Rise of Kingdoms
  // ============================================
  {
    id: 'rise-of-kingdoms',
    name: 'Rise of Kingdoms',
    slug: 'rise-of-kingdoms',
    shortName: 'Rise of Kingdoms',
    description: 'Rise of Kingdoms is a real-time strategy game where you build a civilization from scratch. Choose from 13 civilizations and lead legendary commanders to conquer the world.',
    categories: ['RPG', 'Simulation', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android', 'PC'],
  imageUrl: '/games/rise-of-kingdoms.webp',
  logoUrl: '/games/rise-of-kingdoms.webp',
  developer: 'Lilith Games',
    publisher: 'Lilith Games',
    promoCodes: [
      {
        id: 'rok-1',
        code: 'ROK2026',
        reward: '200 Gems + Speedups',
        rewardValue: 200,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
      {
        id: 'rok-2',
        code: 'KINGDOM',
        reward: '500 Gems + Golden Sculptures',
        rewardValue: 500,
        rewardType: 'Gems',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 80,
      },
    ],
    rewards: [
      {
        id: 'rok-r1',
        title: 'Daily Objectives',
        description: 'Complete daily objectives for gems and resources',
        type: 'Daily',
        value: 'Gems and items',
      },
      {
        id: 'rok-r2',
        title: 'New Governor Rewards',
        description: 'Special rewards for new players during the first weeks',
        type: 'New Player',
        value: 'Legendary commanders',
      },
    ],
    affiliateLink: 'https://www.lilith.com/rise-of-kingdoms',
    websiteUrl: 'https://www.riseofkingdoms.com',
    popularityScore: 82,
    playerCount: '80M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // Summoners War
  // ============================================
  {
    id: 'summoners-war',
    name: 'Summoners War',
    slug: 'summoners-war',
    shortName: 'Summoners War',
    description: 'Summoners War is a mobile turn-based strategy game featuring over 1000 monsters to collect. Assemble the perfect team and dominate in PvP Arena battles.',
    categories: ['RPG', 'Gacha', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    imageUrl: '/games/summoners-war.jpg',
    logoUrl: '/games/summoners-war.jpg',
    developer: 'Com2uS',
    publisher: 'Com2uS',
    promoCodes: [
      {
        id: 'sw-1',
        code: 'SW2026GIFT',
        reward: '100 Crystals + Mystical Scroll',
        rewardValue: 200,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
      {
        id: 'sw-2',
        code: 'SUMMON100',
        reward: '50 Energy + Scrolls',
        rewardValue: 100,
        rewardType: 'Items',
        expiresAt: twoWeeksFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 82,
      },
    ],
    rewards: [
      {
        id: 'sw-r1',
        title: 'Daily Login',
        description: 'Log in daily for crystals, scrolls, and monsters',
        type: 'Daily',
        value: 'Crystals and scrolls',
      },
      {
        id: 'sw-r2',
        title: 'Monthly Check-in',
        description: 'Monthly rewards including legendary scrolls',
        type: 'Event',
        value: 'Legendary scroll',
      },
    ],
    affiliateLink: 'https://summonerswar.com',
    websiteUrl: 'https://summonerswar.com',
    popularityScore: 79,
    playerCount: '100M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // Coin Master
  // ============================================
  {
    id: 'coin-master',
    name: 'Coin Master',
    slug: 'coin-master',
    shortName: 'Coin Master',
    description: 'Coin Master is a casual mobile game combining slot machines with base building. Spin to earn coins, attack other players, and build your viking village.',
    categories: ['Mobile', 'Simulation'],
    platforms: ['Mobile', 'iOS', 'Android'],
  imageUrl: '/games/coin-master.jpg',
  logoUrl: '/games/coin-master.jpg',
  developer: 'Moon Active',
    publisher: 'Moon Active',
    promoCodes: [
      {
        id: 'cm-1',
        code: 'COINMASTER50',
        reward: '50 Free Spins',
        rewardValue: 500,
        rewardType: 'Items',
        isVerified: true,
        addedAt: now,
        successRate: 90,
      },
      {
        id: 'cm-2',
        code: 'FREESPINS2026',
        reward: '25 Free Spins + 1M Coins',
        rewardValue: 300,
        rewardType: 'Coins',
        expiresAt: twoWeeksFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 88,
      },
      {
        id: 'cm-3',
        code: 'VIKINGRAID',
        reward: '40 Free Spins',
        rewardValue: 400,
        rewardType: 'Items',
        isVerified: true,
        addedAt: now,
        successRate: 92,
      },
      {
        id: 'cm-4',
        code: 'GOLDENSPIN',
        reward: '75 Free Spins + 5M Coins',
        rewardValue: 800,
        rewardType: 'Items',
        isVerified: true,
        isExclusive: true,
        addedAt: now,
        successRate: 85,
      },
      {
        id: 'cm-5',
        code: 'APRILSPINS',
        reward: '35 Free Spins + Card Pack',
        rewardValue: 450,
        rewardType: 'Items',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 90,
      },
      {
        id: 'cm-6',
        code: 'TREASUREHUNT',
        reward: '60 Free Spins',
        rewardValue: 600,
        rewardType: 'Items',
        isVerified: true,
        addedAt: now,
        successRate: 88,
      },
      {
        id: 'cm-7',
        code: 'COINSHOWER',
        reward: '20 Free Spins + 10M Coins',
        rewardValue: 500,
        rewardType: 'Coins',
        isVerified: true,
        addedAt: now,
        successRate: 91,
      },
      {
        id: 'cm-8',
        code: 'ATTACKMASTER',
        reward: '100 Free Spins',
        rewardValue: 1000,
        rewardType: 'Items',
        isVerified: true,
        isExclusive: true,
        addedAt: now,
        successRate: 82,
      },
    ],
    rewards: [
      {
        id: 'cm-r1',
        title: 'Daily Free Spins',
        description: 'Get free spins every hour (up to 5)',
        type: 'Daily',
        value: 'Free spins',
      },
      {
        id: 'cm-r2',
        title: 'Facebook Rewards',
        description: 'Connect to Facebook for daily free spin links',
        type: 'Free',
        value: '25-50 free spins daily',
      },
    ],
    affiliateLink: 'https://coinmaster.com',
    websiteUrl: 'https://coinmaster.com',
    popularityScore: 85,
    playerCount: '200M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // Tower of Fantasy
  // ============================================
  {
    id: 'tower-of-fantasy',
    name: 'Tower of Fantasy',
    slug: 'tower-of-fantasy',
    shortName: 'ToF',
    description: 'Tower of Fantasy is an open-world action RPG set on the planet Aida. Explore a vast sci-fi world, unlock powerful weapons, and team up with friends.',
    categories: ['RPG', 'Gacha', 'Mobile', 'PC'],
    platforms: ['PC', 'Mobile', 'iOS', 'Android'],
    imageUrl: '/games/tower-of-fantasy.webp',
    logoUrl: '/games/tower-of-fantasy.webp',
    developer: 'Hotta Studio',
    publisher: 'Level Infinite',
    promoCodes: [
      {
        id: 'tof-1',
        code: 'TOF2026',
        reward: '100 Dark Crystals + 10 Gold Nucleus',
        rewardValue: 200,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
      {
        id: 'tof-2',
        code: 'AIDAGIFT',
        reward: '200 Dark Crystals + Red Nucleus',
        rewardValue: 300,
        rewardType: 'Gems',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 80,
      },
    ],
    rewards: [
      {
        id: 'tof-r1',
        title: 'Daily Bounties',
        description: 'Complete daily bounties for Dark Crystals',
        type: 'Daily',
        value: 'Dark Crystals',
      },
      {
        id: 'tof-r2',
        title: 'Weekly Challenges',
        description: 'Complete weekly content for rewards',
        type: 'Event',
        value: 'Gold Nucleus',
      },
    ],
    affiliateLink: 'https://www.toweroffantasy-global.com',
    websiteUrl: 'https://www.toweroffantasy-global.com',
    popularityScore: 77,
    playerCount: '20M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // Diablo Immortal
  // ============================================
  {
    id: 'diablo-immortal',
    name: 'Diablo Immortal',
    slug: 'diablo-immortal',
    shortName: 'Diablo Immortal',
    description: 'Diablo Immortal brings the iconic action RPG to mobile. Fight demons, collect legendary loot, and explore the dark world of Sanctuary.',
    categories: ['RPG', 'Mobile', 'PC'],
    platforms: ['PC', 'Mobile', 'iOS', 'Android'],
    imageUrl: '',
    logoUrl: '',
    developer: 'Blizzard Entertainment',
    publisher: 'Blizzard Entertainment',
    promoCodes: [
      {
        id: 'zzz-1',
        code: 'ZZZ2026',
        reward: '160 Polychrome + Dennies',
        rewardValue: 160,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 90,
      },
      {
        id: 'zzz-2',
        code: 'NEWEROS',
        reward: '60 Polychrome + Battery',
        rewardValue: 60,
        rewardType: 'Gems',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 88,
      },
    ],
    rewards: [
      {
        id: 'zzz-r1',
        title: 'Daily Commissions',
        description: 'Complete daily commissions for Polychrome',
        type: 'Daily',
        value: 'Polychrome',
      },
      {
        id: 'zzz-r2',
        title: 'Live Stream Codes',
        description: 'Codes released during version livestreams',
        type: 'Event',
        value: '300+ Polychrome',
      },
    ],
    affiliateLink: 'https://zenless.hoyoverse.com',
    websiteUrl: 'https://zenless.hoyoverse.com',
    popularityScore: 88,
    playerCount: '25M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // Wuthering Waves
  // ============================================
  {
    id: 'wuthering-waves',
    name: 'Wuthering Waves',
    slug: 'wuthering-waves',
    shortName: 'WuWa',
    description: 'Wuthering Waves is an open-world action RPG from Kuro Games. Explore a post-apocalyptic world, collect Resonators, and engage in fast-paced combat.',
    categories: ['RPG', 'Gacha', 'Mobile', 'PC'],
    platforms: ['PC', 'Mobile', 'iOS', 'Android', 'PlayStation'],
    imageUrl: '',
    logoUrl: '',
    developer: 'Kuro Games',
    publisher: 'Kuro Games',
    promoCodes: [
      {
        id: 'wuwa-1',
        code: 'WUWA2026',
        reward: '160 Astrite + Shell Credits',
        rewardValue: 160,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 90,
      },
      {
        id: 'wuwa-2',
        code: 'SOLARIS',
        reward: '60 Astrite + Waveplates',
        rewardValue: 60,
        rewardType: 'Gems',
        expiresAt: twoWeeksFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 88,
      },
    ],
    rewards: [
      {
        id: 'wuwa-r1',
        title: 'Daily Activities',
        description: 'Complete daily activities for Astrite',
        type: 'Daily',
        value: 'Astrite',
      },
      {
        id: 'wuwa-r2',
        title: 'Pioneer Podcast',
        description: 'Special rewards for new players',
        type: 'New Player',
        value: '5-star Resonator selector',
      },
    ],
    affiliateLink: 'https://wutheringwaves.kurogames.com',
    websiteUrl: 'https://wutheringwaves.kurogames.com',
    popularityScore: 85,
    playerCount: '20M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // Monopoly GO
  // ============================================
  {
    id: 'monopoly-go',
    name: 'Monopoly GO',
    slug: 'monopoly-go',
    shortName: 'Monopoly GO',
    description: 'Monopoly GO is a mobile board game that brings the classic Monopoly experience to your phone. Roll dice, collect properties, and compete in tournaments with players worldwide.',
    categories: ['Mobile', 'Simulation'],
    platforms: ['Mobile', 'iOS', 'Android'],
  imageUrl: '/games/monopoly-go.webp',
  logoUrl: '/games/monopoly-go.webp',
  developer: 'Scopely',
    publisher: 'Scopely',
    promoCodes: [
      {
        id: 'mgo-1',
        code: 'FREEDICE2026',
        reward: '50 Free Dice Rolls',
        rewardValue: 500,
        rewardType: 'Items',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 92,
      },
      {
        id: 'mgo-2',
        code: 'MONOPOLYWIN',
        reward: '25 Free Dice + Cash',
        rewardValue: 250,
        rewardType: 'Items',
        isVerified: true,
        addedAt: now,
        successRate: 88,
      },
      {
        id: 'mgo-3',
        code: 'DAILYROLL',
        reward: '15 Free Dice Rolls',
        rewardValue: 150,
        rewardType: 'Items',
        expiresAt: twoWeeksFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 95,
      },
      {
        id: 'mgo-4',
        code: 'BOARDWALK',
        reward: '100 Free Dice + Stickers',
        rewardValue: 1000,
        rewardType: 'Items',
        isVerified: true,
        isExclusive: true,
        addedAt: now,
        successRate: 85,
      },
      {
        id: 'mgo-5',
        code: 'RICHUNCLE',
        reward: '35 Free Dice Rolls',
        rewardValue: 350,
        rewardType: 'Items',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 90,
      },
      {
        id: 'mgo-6',
        code: 'APRILBONUS',
        reward: '75 Free Dice + Sticker Pack',
        rewardValue: 800,
        rewardType: 'Items',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 91,
      },
      {
        id: 'mgo-7',
        code: 'RAILROADKING',
        reward: '40 Free Dice Rolls',
        rewardValue: 400,
        rewardType: 'Items',
        isVerified: true,
        addedAt: now,
        successRate: 87,
      },
      {
        id: 'mgo-8',
        code: 'SPRINGROLL',
        reward: '55 Free Dice + Cash Boost',
        rewardValue: 600,
        rewardType: 'Items',
        expiresAt: twoWeeksFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 93,
      },
      {
        id: 'mgo-9',
        code: 'PARKPLACE',
        reward: '200 Free Dice Rolls',
        rewardValue: 2000,
        rewardType: 'Items',
        isVerified: true,
        isExclusive: true,
        addedAt: now,
        successRate: 80,
      },
      {
        id: 'mgo-10',
        code: 'FREEPARKING',
        reward: '30 Free Dice + Cash',
        rewardValue: 350,
        rewardType: 'Items',
        isVerified: true,
        addedAt: now,
        successRate: 89,
      },
    ],
    rewards: [
      {
        id: 'mgo-r1',
        title: 'Daily Free Dice',
        description: 'Claim free dice rolls every day by logging in',
        type: 'Daily',
        value: '5-25 Dice',
      },
      {
        id: 'mgo-r2',
        title: 'Tournament Rewards',
        description: 'Compete in tournaments for massive dice bonuses',
        type: 'Event',
        value: 'Up to 500 Dice',
      },
      {
        id: 'mgo-r3',
        title: 'Friend Invites',
        description: 'Invite friends to earn bonus dice rolls',
        type: 'Referral',
        value: '30 Dice per friend',
      },
      {
        id: 'mgo-r4',
        title: 'New Player Bonus',
        description: 'Special dice bonus for new players',
        type: 'New Player',
        value: '100 Free Dice',
      },
    ],
  affiliateLink: 'https://www.monopolygo.com',
  officialUrl: 'https://play.google.com/store/apps/details?id=com.scopely.monopolygo',
  websiteUrl: 'https://www.monopolygo.com',
  popularityScore: 95,
  playerCount: '100M+ downloads',
  lastUpdated: now,
  },

  // ============================================
  // Marvel Snap
  // ============================================
  {
    id: 'marvel-snap',
    name: 'Marvel Snap',
    slug: 'marvel-snap',
    shortName: 'Marvel Snap',
    description: 'Marvel Snap is a fast-paced card battler featuring Marvel heroes and villains. Build decks, collect cards, and battle in quick 3-minute matches.',
    categories: ['Mobile', 'PC'],
    platforms: ['PC', 'Mobile', 'iOS', 'Android'],
    imageUrl: '',
    logoUrl: '',
    developer: 'Second Dinner',
    publisher: 'Nuverse',
    promoCodes: [
      {
        id: 'ms-1',
        code: 'SNAPBACK',
        reward: '500 Credits + Boosters',
        rewardValue: 500,
        rewardType: 'Currency',
        isVerified: true,
        addedAt: now,
        successRate: 88,
      },
      {
        id: 'ms-2',
        code: 'HULKSMASH',
        reward: 'Hulk Variant + 200 Credits',
        rewardValue: 700,
        rewardType: 'Items',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
      {
        id: 'ms-3',
        code: 'NEWSNAPPER',
        reward: '1000 Credits + Gold',
        rewardValue: 1000,
        rewardType: 'Currency',
        isVerified: true,
        isExclusive: true,
        addedAt: now,
        successRate: 90,
      },
    ],
    rewards: [
      {
        id: 'ms-r1',
        title: 'Daily Missions',
        description: 'Complete missions for credits and boosters',
        type: 'Daily',
        value: 'Credits + Boosters',
      },
      {
        id: 'ms-r2',
        title: 'Season Pass Rewards',
        description: 'Progress through the season for exclusive cards',
        type: 'Event',
        value: 'Season Cards + Variants',
      },
      {
        id: 'ms-r3',
        title: 'Collection Level Rewards',
        description: 'Increase collection level for new cards',
        type: 'Achievement',
        value: 'New Cards',
      },
    ],
    affiliateLink: 'https://www.marvelsnap.com',
    websiteUrl: 'https://www.marvelsnap.com',
    popularityScore: 88,
    playerCount: '30M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // Star Wars Galaxy of Heroes
  // ============================================
  {
    id: 'swgoh',
    name: 'Star Wars: Galaxy of Heroes',
    slug: 'star-wars-galaxy-of-heroes',
    shortName: 'SWGOH',
    description: 'Star Wars: Galaxy of Heroes is a turn-based RPG featuring characters from across the Star Wars universe. Collect heroes, build squads, and battle in PvP and PvE.',
    categories: ['RPG', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    imageUrl: '',
    logoUrl: '',
    developer: 'Capital Games',
    publisher: 'Electronic Arts',
    promoCodes: [
      {
        id: 'swgoh-1',
        code: 'MAYTHE4TH',
        reward: '1000 Crystals + Shards',
        rewardValue: 1000,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 90,
      },
      {
        id: 'swgoh-2',
        code: 'FORCEFRIDAY',
        reward: '500 Crystals + Gear',
        rewardValue: 500,
        rewardType: 'Gems',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 88,
      },
      {
        id: 'swgoh-3',
        code: 'JEDIMASTER',
        reward: '200 Crystals + Character Shards',
        rewardValue: 200,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
    ],
    rewards: [
      {
        id: 'swgoh-r1',
        title: 'Daily Activities',
        description: 'Complete daily activities for crystals and gear',
        type: 'Daily',
        value: 'Crystals + Gear',
      },
      {
        id: 'swgoh-r2',
        title: 'Guild Raids',
        description: 'Participate in guild raids for rewards',
        type: 'Event',
        value: 'Raid Gear + Currency',
      },
      {
        id: 'swgoh-r3',
        title: 'Galactic Challenges',
        description: 'Weekly challenges with bonus rewards',
        type: 'Event',
        value: 'Crystals + Materials',
      },
    ],
    affiliateLink: 'https://www.ea.com/games/starwars/galaxy-of-heroes',
    websiteUrl: 'https://www.ea.com/games/starwars/galaxy-of-heroes',
    popularityScore: 82,
    playerCount: '50M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // FIFA Mobile
  // ============================================
  {
    id: 'fifa-mobile',
    name: 'EA Sports FC Mobile',
    slug: 'fifa-mobile',
    shortName: 'FC Mobile',
    description: 'EA Sports FC Mobile is the premier mobile football game. Build your ultimate team, compete in seasons, and play against others worldwide.',
    categories: ['Sports', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
  imageUrl: '/games/fifa-mobile.webp',
  logoUrl: '/games/fifa-mobile.webp',
  developer: 'EA Sports',
    publisher: 'Electronic Arts',
    promoCodes: [
      {
        id: 'fifa-1',
        code: 'FCGOAL2026',
        reward: '500 FC Points + Players',
        rewardValue: 500,
        rewardType: 'Currency',
        isVerified: true,
        addedAt: now,
        successRate: 88,
      },
      {
        id: 'fifa-2',
        code: 'CHAMPIONSLEAGUE',
        reward: '1000 FC Points + Pack',
        rewardValue: 1000,
        rewardType: 'Currency',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        isExclusive: true,
        addedAt: now,
        successRate: 85,
      },
      {
        id: 'fifa-3',
        code: 'FUTCHAMP',
        reward: '250 FC Points + Coins',
        rewardValue: 250,
        rewardType: 'Currency',
        isVerified: true,
        addedAt: now,
        successRate: 90,
      },
    ],
    rewards: [
      {
        id: 'fifa-r1',
        title: 'Daily Objectives',
        description: 'Complete objectives for coins and packs',
        type: 'Daily',
        value: 'Coins + Packs',
      },
      {
        id: 'fifa-r2',
        title: 'Season Rewards',
        description: 'Progress through seasons for players',
        type: 'Event',
        value: 'Players + Packs',
      },
      {
        id: 'fifa-r3',
        title: 'League Rewards',
        description: 'Complete league matches for bonuses',
        type: 'Achievement',
        value: 'Coins + XP',
      },
    ],
    affiliateLink: 'https://www.ea.com/games/ea-sports-fc/fc-mobile',
    websiteUrl: 'https://www.ea.com/games/ea-sports-fc/fc-mobile',
    popularityScore: 90,
    playerCount: '100M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // Candy Crush Saga
  // ============================================
  {
    id: 'candy-crush',
    name: 'Candy Crush Saga',
    slug: 'candy-crush-saga',
    shortName: 'Candy Crush',
    description: 'Candy Crush Saga is the iconic match-3 puzzle game. Match candies, beat challenging levels, and progress through hundreds of sweet adventures.',
    categories: ['Mobile', 'Simulation'],
    platforms: ['Mobile', 'iOS', 'Android', 'PC'],
  imageUrl: '/games/candy-crush-saga.webp',
  logoUrl: '/games/candy-crush-saga.webp',
  developer: 'King',
    publisher: 'King',
    promoCodes: [
      {
        id: 'cc-1',
        code: 'SWEETBONUS',
        reward: '30 Free Lives + Boosters',
        rewardValue: 300,
        rewardType: 'Items',
        isVerified: true,
        addedAt: now,
        successRate: 92,
      },
      {
        id: 'cc-2',
        code: 'CRUSHIT2026',
        reward: '50 Gold Bars + Lives',
        rewardValue: 500,
        rewardType: 'Currency',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 88,
      },
      {
        id: 'cc-3',
        code: 'CANDYFREE',
        reward: '20 Free Lives',
        rewardValue: 200,
        rewardType: 'Items',
        isVerified: true,
        addedAt: now,
        successRate: 95,
      },
    ],
    rewards: [
      {
        id: 'cc-r1',
        title: 'Daily Spin',
        description: 'Spin the wheel daily for free boosters',
        type: 'Daily',
        value: 'Boosters + Lives',
      },
      {
        id: 'cc-r2',
        title: 'Team Events',
        description: 'Join teams for bonus rewards',
        type: 'Event',
        value: 'Gold Bars + Boosters',
      },
      {
        id: 'cc-r3',
        title: 'Friend Rewards',
        description: 'Connect with friends for free lives',
        type: 'Referral',
        value: 'Free Lives',
      },
    ],
    affiliateLink: 'https://www.king.com/game/candycrush',
    websiteUrl: 'https://www.king.com/game/candycrush',
    popularityScore: 92,
    playerCount: '500M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // Mobile Legends Adventure
  // ============================================
  {
    id: 'mla',
    name: 'Mobile Legends Adventure',
    slug: 'mobile-legends-adventure',
    shortName: 'MLA',
    description: 'Mobile Legends Adventure is an idle RPG based on the popular MOBA. Collect heroes, build teams, and progress through an epic campaign.',
    categories: ['RPG', 'Mobile', 'Gacha'],
    platforms: ['Mobile', 'iOS', 'Android'],
    imageUrl: '',
    logoUrl: '',
    developer: 'Moonton',
    publisher: 'Moonton',
    promoCodes: [
      {
        id: 'mla-1',
        code: 'MLAHEROES',
        reward: '1000 Diamonds + Hero Shards',
        rewardValue: 1000,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 88,
      },
      {
        id: 'mla-2',
        code: 'ADVENTURE2026',
        reward: '500 Diamonds + Tickets',
        rewardValue: 500,
        rewardType: 'Gems',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
      {
        id: 'mla-3',
        code: 'IDLEBONUS',
        reward: '2 Hour Idle Reward + Diamonds',
        rewardValue: 300,
        rewardType: 'Items',
        isVerified: true,
        addedAt: now,
        successRate: 90,
      },
    ],
    rewards: [
      {
        id: 'mla-r1',
        title: 'Idle Rewards',
        description: 'Collect rewards while offline',
        type: 'Free',
        value: 'Resources + XP',
      },
      {
        id: 'mla-r2',
        title: 'Daily Quests',
        description: 'Complete quests for diamonds',
        type: 'Daily',
        value: 'Diamonds + Materials',
      },
      {
        id: 'mla-r3',
        title: 'New Player Journey',
        description: '7-day login bonus for new players',
        type: 'New Player',
        value: '5-Star Hero + Resources',
      },
    ],
    affiliateLink: 'https://www.mobilelegends.com/en/mlbb/adventure',
    websiteUrl: 'https://www.mobilelegends.com/en/mlbb/adventure',
    popularityScore: 80,
    playerCount: '30M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // Stumble Guys
  // ============================================
  {
    id: 'stumble-guys',
    name: 'Stumble Guys',
    slug: 'stumble-guys',
    shortName: 'Stumble Guys',
    description: 'Stumble Guys is a multiplayer party knockout game. Race through obstacle courses, avoid eliminations, and be the last one standing.',
    categories: ['Mobile', 'Battle Royale'],
    platforms: ['Mobile', 'iOS', 'Android', 'PC'],
    imageUrl: '/games/stumble-guys.jpg',
    logoUrl: '/games/stumble-guys.jpg',
    developer: 'Kitka Games',
    publisher: 'Scopely',
    promoCodes: [
      {
        id: 'sg-1',
        code: 'STUMBLEFREE',
        reward: '1000 Gems + Skin',
        rewardValue: 1000,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 88,
      },
      {
        id: 'sg-2',
        code: 'KNOCKOUT2026',
        reward: '500 Gems + Emote',
        rewardValue: 500,
        rewardType: 'Gems',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 90,
      },
      {
        id: 'sg-3',
        code: 'PARTYTIME',
        reward: '750 Gems + Footsteps',
        rewardValue: 750,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
    ],
    rewards: [
      {
        id: 'sg-r1',
        title: 'Daily Spin',
        description: 'Spin for free gems and items daily',
        type: 'Daily',
        value: 'Gems + Items',
      },
      {
        id: 'sg-r2',
        title: 'Season Pass Rewards',
        description: 'Progress for exclusive skins',
        type: 'Event',
        value: 'Skins + Emotes',
      },
      {
        id: 'sg-r3',
        title: 'Tournament Rewards',
        description: 'Compete in tournaments for prizes',
        type: 'Event',
        value: 'Gems + Exclusive Items',
      },
    ],
    affiliateLink: 'https://www.stumbleguys.com',
    websiteUrl: 'https://www.stumbleguys.com',
    popularityScore: 86,
    playerCount: '300M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // Summoners War Chronicles
  // ============================================
  {
    id: 'swc',
    name: 'Summoners War Chronicles',
    slug: 'summoners-war-chronicles',
    shortName: 'SW Chronicles',
    description: 'Summoners War Chronicles is an action MMORPG set in the Summoners War universe. Explore, battle, and collect monsters in real-time.',
    categories: ['RPG', 'MMORPG', 'Mobile', 'PC'],
    platforms: ['PC', 'Mobile', 'iOS', 'Android'],
    imageUrl: '',
    logoUrl: '',
    developer: 'Com2uS',
    publisher: 'Com2uS',
    promoCodes: [
      {
        id: 'swc-1',
        code: 'CHRONICLES2026',
        reward: '500 Crystals + Summoning Scrolls',
        rewardValue: 500,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 88,
      },
      {
        id: 'swc-2',
        code: 'SUMMONFREE',
        reward: '300 Crystals + Monster Pieces',
        rewardValue: 300,
        rewardType: 'Gems',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
    ],
    rewards: [
      {
        id: 'swc-r1',
        title: 'Daily Quests',
        description: 'Complete quests for crystals',
        type: 'Daily',
        value: 'Crystals + Materials',
      },
      {
        id: 'swc-r2',
        title: 'New Player Rewards',
        description: 'Special bonuses for new summoners',
        type: 'New Player',
        value: 'Monsters + Resources',
      },
    ],
    affiliateLink: 'https://summonerswar.com/en/chronicles',
    websiteUrl: 'https://summonerswar.com/en/chronicles',
    popularityScore: 78,
    playerCount: '10M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // Nikke: Goddess of Victory
  // ============================================
  {
    id: 'nikke',
    name: 'Nikke: Goddess of Victory',
    slug: 'nikke',
    shortName: 'Nikke',
    description: 'Nikke: Goddess of Victory is a third-person shooter RPG featuring stylized characters. Build squads, engage in cover-based combat, and collect Nikkes.',
    categories: ['RPG', 'Gacha', 'Mobile', 'PC'],
    platforms: ['PC', 'Mobile', 'iOS', 'Android'],
    imageUrl: '',
    logoUrl: '',
    developer: 'Shift Up',
    publisher: 'Level Infinite',
    promoCodes: [
      {
        id: 'nikke-1',
        code: 'NIKKEFREE',
        reward: '1000 Gems + Recruitment Tickets',
        rewardValue: 1000,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 90,
      },
      {
        id: 'nikke-2',
        code: 'GODDESS2026',
        reward: '500 Gems + Materials',
        rewardValue: 500,
        rewardType: 'Gems',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 88,
      },
      {
        id: 'nikke-3',
        code: 'VICTORYBONUS',
        reward: '300 Gems + Core Dust',
        rewardValue: 300,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
    ],
    rewards: [
      {
        id: 'nikke-r1',
        title: 'Daily Missions',
        description: 'Complete missions for gems and materials',
        type: 'Daily',
        value: 'Gems + Materials',
      },
      {
        id: 'nikke-r2',
        title: 'Outpost Defense',
        description: 'Defend outpost for idle rewards',
        type: 'Free',
        value: 'Credits + Parts',
      },
      {
        id: 'nikke-r3',
        title: 'New Commander Rewards',
        description: '30-day login bonus for new players',
        type: 'New Player',
        value: 'SSR Nikke + Resources',
      },
    ],
    affiliateLink: 'https://nikke-en.com',
    websiteUrl: 'https://nikke-en.com',
    popularityScore: 84,
    playerCount: '25M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // Reverse 1999
  // ============================================
  {
    id: 'reverse-1999',
    name: 'Reverse: 1999',
    slug: 'reverse-1999',
    shortName: 'Reverse 1999',
    description: 'Reverse: 1999 is a story-driven turn-based RPG set across different time periods. Collect characters, master card-based combat, and unravel mysteries.',
    categories: ['RPG', 'Gacha', 'Mobile', 'PC'],
    platforms: ['PC', 'Mobile', 'iOS', 'Android'],
    imageUrl: '',
    logoUrl: '',
    developer: 'Bluepoch',
    publisher: 'Bluepoch',
    promoCodes: [
      {
        id: 'r99-1',
        code: 'REVERSE2026',
        reward: '200 Clear Drops + Dust',
        rewardValue: 200,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 90,
      },
      {
        id: 'r99-2',
        code: 'TIMETRAVEL',
        reward: '100 Clear Drops + Materials',
        rewardValue: 100,
        rewardType: 'Gems',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 88,
      },
    ],
    rewards: [
      {
        id: 'r99-r1',
        title: 'Daily Tasks',
        description: 'Complete tasks for Clear Drops',
        type: 'Daily',
        value: 'Clear Drops + XP',
      },
      {
        id: 'r99-r2',
        title: 'Wilderness Activities',
        description: 'Explore wilderness for resources',
        type: 'Free',
        value: 'Materials + Currency',
      },
      {
        id: 'r99-r3',
        title: 'New Player Guide',
        description: 'Follow the guide for bonus rewards',
        type: 'New Player',
        value: '6-Star Character + Resources',
      },
    ],
    affiliateLink: 'https://re1999.bluepoch.com',
    websiteUrl: 'https://re1999.bluepoch.com',
    popularityScore: 82,
    playerCount: '15M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // Path to Nowhere
  // ============================================
  {
    id: 'path-to-nowhere',
    name: 'Path to Nowhere',
    slug: 'path-to-nowhere',
    shortName: 'PTN',
    description: 'Path to Nowhere is a tower defense RPG with a dark, immersive story. Command Sinners in strategic real-time battles.',
    categories: ['RPG', 'Gacha', 'Mobile', 'PC'],
    platforms: ['PC', 'Mobile', 'iOS', 'Android'],
    imageUrl: '',
    logoUrl: '',
    developer: 'AISNO Games',
    publisher: 'AISNO Games',
    promoCodes: [
      {
        id: 'ptn-1',
        code: 'SINNERFREE',
        reward: '500 Hypercubes + Stamina',
        rewardValue: 500,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 88,
      },
      {
        id: 'ptn-2',
        code: 'PATHFINDER',
        reward: '300 Hypercubes + Materials',
        rewardValue: 300,
        rewardType: 'Gems',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
    ],
    rewards: [
      {
        id: 'ptn-r1',
        title: 'Daily Missions',
        description: 'Complete missions for Hypercubes',
        type: 'Daily',
        value: 'Hypercubes + Resources',
      },
      {
        id: 'ptn-r2',
        title: 'New Chief Bonus',
        description: 'Special rewards for new players',
        type: 'New Player',
        value: 'S-Rank Sinner + Materials',
      },
    ],
    affiliateLink: 'https://www.pathtonowhere.com',
    websiteUrl: 'https://www.pathtonowhere.com',
    popularityScore: 76,
    playerCount: '10M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // Aether Gazer
  // ============================================
  {
    id: 'aether-gazer',
    name: 'Aether Gazer',
    slug: 'aether-gazer',
    shortName: 'Aether Gazer',
    description: 'Aether Gazer is a fast-paced action RPG featuring stylish combat and mythological characters. Master combos and build powerful teams.',
    categories: ['RPG', 'Gacha', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    imageUrl: '',
    logoUrl: '',
    developer: 'Yostar',
    publisher: 'Yostar',
    promoCodes: [
      {
        id: 'ag-1',
        code: 'AETHERFREE',
        reward: '500 Shifted Star Crystals',
        rewardValue: 500,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 88,
      },
      {
        id: 'ag-2',
        code: 'GAZER2026',
        reward: '300 Crystals + Tickets',
        rewardValue: 300,
        rewardType: 'Gems',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
    ],
    rewards: [
      {
        id: 'ag-r1',
        title: 'Daily Dispatch',
        description: 'Send teams on dispatch for rewards',
        type: 'Daily',
        value: 'Crystals + Materials',
      },
      {
        id: 'ag-r2',
        title: 'New Admin Bonus',
        description: 'Special bonuses for new players',
        type: 'New Player',
        value: 'S-Rank Modifier + Resources',
      },
    ],
    affiliateLink: 'https://aethergazer.com',
    websiteUrl: 'https://aethergazer.com',
    popularityScore: 74,
    playerCount: '8M+ downloads',
    lastUpdated: now,
  },
  
  // ============================================
  // NEW GAMES BATCH - 50 Additional Games
  // ============================================
  
  // 1. Reverse: 1999
  {
    id: 'reverse-1999',
    name: 'Reverse: 1999',
    slug: 'reverse-1999',
    shortName: 'Reverse',
    description: 'Reverse: 1999 is a turn-based tactical RPG set in a world where a mysterious storm erases everything from the 20th century. Build your team of Arcanists and uncover the truth behind the apocalypse.',
    categories: ['RPG', 'Gacha', 'Mobile'],
    platforms: ['Mobile', 'PC', 'iOS', 'Android'],
    developer: 'Bluepoch',
    publisher: 'Bluepoch',
    promoCodes: [
      { id: 'r99-welcome', code: 'REVERSE2024', reward: '10 Pulls + 300 Clear Drop', rewardValue: 1600, rewardType: 'Currency', isVerified: true, addedAt: now, successRate: 95 },
      { id: 'r99-newplayer', code: 'NEWARCANE', reward: '500 Clear Drop + Materials', rewardValue: 500, rewardType: 'Currency', isVerified: true, addedAt: now, successRate: 92 },
      { id: 'r99-event', code: 'STORM1999', reward: '5 Pulls + Insight Materials', rewardValue: 800, rewardType: 'Currency', isVerified: true, addedAt: now, successRate: 90 },
    ],
    rewards: [
      { id: 'r99-r1', title: 'New Player Bundle', description: 'Get 10 free summons and materials', type: 'New Player', value: '10 Summons' },
      { id: 'r99-r2', title: 'Daily Login', description: 'Login rewards every day', type: 'Daily', value: 'Clear Drop + Items' },
    ],
    affiliateLink: 'https://re1999.bluepoch.com',
    websiteUrl: 'https://re1999.bluepoch.com',
    popularityScore: 82,
    playerCount: '15M+ downloads',
    lastUpdated: now,
  },
  
  // 2. Limbus Company
  {
    id: 'limbus-company',
    name: 'Limbus Company',
    slug: 'limbus-company',
    shortName: 'Limbus',
    description: 'Limbus Company is a dark fantasy gacha RPG from Project Moon, featuring tactical turn-based combat with unique identity mechanics and a gripping narrative set in The City.',
    categories: ['RPG', 'Gacha', 'Mobile'],
    platforms: ['Mobile', 'PC', 'iOS', 'Android'],
    developer: 'Project Moon',
    publisher: 'Project Moon',
    promoCodes: [
      { id: 'limbus-launch', code: 'LIMBUSLAUNCH', reward: '300 Lunacy + 10 Enkephalin', rewardValue: 300, rewardType: 'Currency', isVerified: true, addedAt: now, successRate: 88 },
      { id: 'limbus-sinner', code: 'SINNER2024', reward: '5 Extract Tickets', rewardValue: 500, rewardType: 'Currency', isVerified: true, addedAt: now, successRate: 85 },
    ],
    rewards: [
      { id: 'limbus-r1', title: 'New Manager Pack', description: 'Starter rewards for new players', type: 'New Player', value: '500 Lunacy' },
    ],
    affiliateLink: 'https://limbuscompany.com',
    websiteUrl: 'https://limbuscompany.com',
    popularityScore: 76,
    playerCount: '5M+ downloads',
    lastUpdated: now,
  },
  
  // 3. Zenless Zone Zero
  {
    id: 'zenless-zone-zero',
    name: 'Zenless Zone Zero',
    slug: 'zenless-zone-zero',
    shortName: 'ZZZ',
    description: 'Zenless Zone Zero is an urban fantasy action RPG from miHoYo/HoYoverse featuring stylish combat, unique characters, and exploration of mysterious Hollows in New Eridu.',
    categories: ['RPG', 'Mobile', 'PC'],
    platforms: ['Mobile', 'PC', 'PlayStation', 'iOS', 'Android'],
    developer: 'miHoYo',
    publisher: 'HoYoverse',
    promoCodes: [
      { id: 'zzz-launch', code: 'ZZZLAUNCH', reward: '300 Polychrome + Dennies', rewardValue: 300, rewardType: 'Primogems', isVerified: true, addedAt: now, successRate: 95 },
      { id: 'zzz-welcome', code: 'ERIDU2024', reward: '160 Polychrome + Materials', rewardValue: 160, rewardType: 'Primogems', isVerified: true, addedAt: now, successRate: 92 },
      { id: 'zzz-special', code: 'HOLLOWRIFT', reward: '60 Polychrome + Senior Investigation Log', rewardValue: 60, rewardType: 'Primogems', isVerified: true, addedAt: now, successRate: 90 },
    ],
    rewards: [
      { id: 'zzz-r1', title: 'Newcomer Event', description: 'Complete missions for rewards', type: 'New Player', value: '1600 Polychrome' },
      { id: 'zzz-r2', title: 'Daily Check-in', description: 'HoYoLAB daily rewards', type: 'Daily', value: 'Polychrome + Items' },
    ],
    affiliateLink: 'https://zenless.hoyoverse.com',
    websiteUrl: 'https://zenless.hoyoverse.com',
    popularityScore: 91,
    playerCount: '50M+ downloads',
    lastUpdated: now,
  },
  
  // 4. Arknights
  {
    id: 'arknights',
    name: 'Arknights',
    slug: 'arknights',
    description: 'Arknights is a strategic tower defense mobile game featuring anime-style characters known as Operators. Deploy your squad to defend against waves of enemies in tactical battles.',
    categories: ['RPG', 'Gacha', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: 'Hypergryph',
    publisher: 'Yostar',
    promoCodes: [
      { id: 'ark-welcome', code: 'ARKWELCOME', reward: '700 Orundum + Materials', rewardValue: 700, rewardType: 'Currency', isVerified: true, addedAt: now, successRate: 88 },
      { id: 'ark-anniversary', code: 'ARK4YEAR', reward: '1800 Orundum + 10 Headhunting', rewardValue: 1800, rewardType: 'Currency', isVerified: true, addedAt: now, successRate: 85 },
    ],
    rewards: [
      { id: 'ark-r1', title: 'Newbie Sign-in', description: '7-day login rewards', type: 'New Player', value: '6★ Selector' },
    ],
    affiliateLink: 'https://arknights.global',
    websiteUrl: 'https://arknights.global',
    popularityScore: 85,
    playerCount: '30M+ downloads',
    lastUpdated: now,
  },
  
  // 5. Blue Archive
  {
    id: 'blue-archive',
    name: 'Blue Archive',
    slug: 'blue-archive',
    shortName: 'BA',
    description: 'Blue Archive is a mobile RPG set in the academy city of Kivotos, where you take the role of a teacher leading student clubs through strategic battles and story adventures.',
    categories: ['RPG', 'Gacha', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: 'NAT Games',
    publisher: 'Nexon',
    promoCodes: [
      { id: 'ba-sensei', code: 'SENSEISTART', reward: '1200 Pyroxene + AP', rewardValue: 1200, rewardType: 'Gems', isVerified: true, addedAt: now, successRate: 90 },
      { id: 'ba-welcome', code: 'KIVOTOS2024', reward: '10 Recruitment Tickets', rewardValue: 1500, rewardType: 'Currency', isVerified: true, addedAt: now, successRate: 88 },
    ],
    rewards: [
      { id: 'ba-r1', title: 'New Sensei Missions', description: 'Complete for Pyroxene', type: 'New Player', value: '3000 Pyroxene' },
    ],
    affiliateLink: 'https://bluearchive.nexon.com',
    websiteUrl: 'https://bluearchive.nexon.com',
    popularityScore: 83,
    playerCount: '20M+ downloads',
    lastUpdated: now,
  },
  
  // 6. Epic Seven
  {
    id: 'epic-seven',
    name: 'Epic Seven',
    slug: 'epic-seven',
    shortName: 'E7',
    description: 'Epic Seven is an anime-style turn-based RPG with beautiful 2D animations, featuring an epic storyline, PvP arena, guild wars, and extensive hero collection.',
    categories: ['RPG', 'Gacha', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: 'Smilegate Megaport',
    publisher: 'Smilegate',
    promoCodes: [
      { id: 'e7-returner', code: 'E7RETURN', reward: '10 Covenant Bookmarks + Gold', rewardValue: 500, rewardType: 'Currency', isVerified: true, addedAt: now, successRate: 85 },
      { id: 'e7-newbie', code: 'NEWHEIR', reward: '500 Skystones', rewardValue: 500, rewardType: 'Gems', isVerified: true, addedAt: now, successRate: 88 },
    ],
    rewards: [
      { id: 'e7-r1', title: 'Selective Summon', description: '30 rerolls on starter banner', type: 'New Player', value: '5★ Hero' },
    ],
    affiliateLink: 'https://epic7.smilegatemegaport.com',
    websiteUrl: 'https://epic7.smilegatemegaport.com',
    popularityScore: 80,
    playerCount: '10M+ downloads',
    lastUpdated: now,
  },
  
  // 7. Dragon Ball Legends
  {
    id: 'dragon-ball-legends',
    name: 'Dragon Ball Legends',
    slug: 'dragon-ball-legends',
    shortName: 'DB Legends',
    description: 'Dragon Ball Legends is an action-packed mobile fighting game featuring real-time PvP battles with your favorite Dragon Ball characters.',
    categories: ['RPG', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: 'Bandai Namco',
    publisher: 'Bandai Namco',
    promoCodes: [
      { id: 'dbl-cc', code: 'SAIYAN2024', reward: '500 Chrono Crystals', rewardValue: 500, rewardType: 'Gems', isVerified: true, addedAt: now, successRate: 82 },
      { id: 'dbl-event', code: 'LEGENDS10', reward: '1000 Chrono Crystals + Energy', rewardValue: 1000, rewardType: 'Gems', isVerified: true, addedAt: now, successRate: 80 },
    ],
    rewards: [
      { id: 'dbl-r1', title: 'Beginner Missions', description: 'Complete for free characters', type: 'New Player', value: 'SP Goku' },
    ],
    affiliateLink: 'https://dble.bn-ent.net',
    websiteUrl: 'https://dble.bn-ent.net',
    popularityScore: 78,
    playerCount: '300M+ downloads',
    lastUpdated: now,
  },
  
  // 8. Seven Deadly Sins: Grand Cross
  {
    id: 'seven-deadly-sins-grand-cross',
    name: 'Seven Deadly Sins: Grand Cross',
    slug: 'seven-deadly-sins-grand-cross',
    shortName: '7DS',
    description: 'Seven Deadly Sins: Grand Cross is an anime RPG based on the popular manga/anime series, featuring turn-based card battles and your favorite characters.',
    categories: ['RPG', 'Gacha', 'Mobile'],
    platforms: ['Mobile', 'PC', 'iOS', 'Android'],
    developer: 'Netmarble',
    publisher: 'Netmarble',
    promoCodes: [
      { id: '7ds-gem', code: '7DSGEMS', reward: '30 Diamonds', rewardValue: 30, rewardType: 'Gems', isVerified: true, addedAt: now, successRate: 85 },
      { id: '7ds-multi', code: 'GRANDCROSS', reward: '1 Multi-summon Ticket', rewardValue: 300, rewardType: 'Currency', isVerified: true, addedAt: now, successRate: 80 },
    ],
    rewards: [
      { id: '7ds-r1', title: 'New Player Event', description: '7-day login rewards', type: 'New Player', value: '100 Diamonds' },
    ],
    affiliateLink: 'https://7dsgc.netmarble.com',
    websiteUrl: 'https://7dsgc.netmarble.com',
    popularityScore: 75,
    playerCount: '30M+ downloads',
    lastUpdated: now,
  },
  
  // 9. Naruto X Boruto Ninja Voltage
  {
    id: 'naruto-x-boruto',
    name: 'Naruto X Boruto: Ninja Voltage',
    slug: 'naruto-x-boruto',
    shortName: 'NxB',
    description: 'Naruto X Boruto: Ninja Voltage is an action strategy game where you build your ninja fortress, collect shinobi, and battle in real-time.',
    categories: ['RPG', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: 'Bandai Namco',
    publisher: 'Bandai Namco',
    promoCodes: [
      { id: 'nxb-shinobi', code: 'SHINOBINITE', reward: '100 Shinobite', rewardValue: 100, rewardType: 'Gems', isVerified: true, addedAt: now, successRate: 82 },
    ],
    rewards: [
      { id: 'nxb-r1', title: 'New Ninja Bundle', description: 'Starter pack for beginners', type: 'New Player', value: '5★ Ninja' },
    ],
    affiliateLink: 'https://ninjava.bn-ent.net',
    websiteUrl: 'https://ninjava.bn-ent.net',
    popularityScore: 70,
    playerCount: '20M+ downloads',
    lastUpdated: now,
  },
  
  // 10. One Punch Man: The Strongest
  {
    id: 'one-punch-man',
    name: 'One Punch Man: The Strongest',
    slug: 'one-punch-man',
    shortName: 'OPM',
    description: 'One Punch Man: The Strongest is an officially licensed mobile game based on the popular anime, featuring strategic RPG combat with beloved characters.',
    categories: ['RPG', 'Gacha', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: 'Playcrab',
    publisher: 'Gaea Mobile',
    promoCodes: [
      { id: 'opm-hero', code: 'HEROCODE', reward: '500 Diamonds + Stamina', rewardValue: 500, rewardType: 'Gems', isVerified: true, addedAt: now, successRate: 80 },
    ],
    rewards: [
      { id: 'opm-r1', title: 'New Hero Missions', description: 'Free SSR character', type: 'New Player', value: 'SSR Genos' },
    ],
    affiliateLink: 'https://opms.gaea.com',
    websiteUrl: 'https://opms.gaea.com',
    popularityScore: 72,
    playerCount: '10M+ downloads',
    lastUpdated: now,
  },
  
  // 11. Call of Duty: Warzone
  {
    id: 'call-of-duty-warzone',
    name: 'Call of Duty: Warzone',
    slug: 'call-of-duty-warzone',
    shortName: 'Warzone',
    description: 'Call of Duty: Warzone is a free-to-play battle royale game featuring intense combat, loadouts, and massive maps for up to 150 players.',
    categories: ['FPS', 'Battle Royale', 'PC', 'Console'],
    platforms: ['PC', 'PlayStation', 'Xbox'],
    developer: 'Infinity Ward',
    publisher: 'Activision',
    promoCodes: [
      { id: 'wz-battle', code: 'WARZONE2024', reward: 'Double XP Token (1hr)', rewardValue: 100, rewardType: 'XP', isVerified: true, addedAt: now, successRate: 75 },
      { id: 'wz-cp', code: 'WZDROP', reward: '500 COD Points', rewardValue: 500, rewardType: 'CP', isVerified: true, addedAt: now, successRate: 70 },
    ],
    rewards: [
      { id: 'wz-r1', title: 'Season Pass Rewards', description: 'Free tier items', type: 'Free', value: 'Operator Skins' },
    ],
    affiliateLink: 'https://www.callofduty.com/warzone',
    websiteUrl: 'https://www.callofduty.com/warzone',
    popularityScore: 88,
    playerCount: '100M+ players',
    lastUpdated: now,
  },
  
  // 12. Counter-Strike 2
  {
    id: 'counter-strike-2',
    name: 'Counter-Strike 2',
    slug: 'counter-strike-2',
    shortName: 'CS2',
    description: 'Counter-Strike 2 is the latest evolution of the legendary tactical shooter, featuring updated maps, new smoke grenades, and improved graphics on Source 2 engine.',
    categories: ['FPS', 'PC'],
    platforms: ['PC'],
    developer: 'Valve',
    publisher: 'Valve',
    promoCodes: [
      { id: 'cs2-prime', code: 'CSPRIME', reward: 'Weapon Case + Key', rewardValue: 250, rewardType: 'Items', isVerified: true, addedAt: now, successRate: 70 },
    ],
    rewards: [
      { id: 'cs2-r1', title: 'Weekly Care Package', description: 'Free weekly drops', type: 'Free', value: 'Random Skin' },
    ],
    affiliateLink: 'https://www.counter-strike.net',
    websiteUrl: 'https://www.counter-strike.net',
    popularityScore: 92,
    playerCount: '35M+ monthly',
    lastUpdated: now,
  },
  
  // 13. Overwatch 2
  {
    id: 'overwatch-2',
    name: 'Overwatch 2',
    slug: 'overwatch-2',
    shortName: 'OW2',
    description: 'Overwatch 2 is a free-to-play team-based action game featuring diverse heroes, each with unique abilities, in fast-paced 5v5 battles.',
    categories: ['FPS', 'PC', 'Console'],
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'],
    developer: 'Blizzard Entertainment',
    publisher: 'Blizzard Entertainment',
    promoCodes: [
      { id: 'ow2-coins', code: 'OW2COINS', reward: '500 Overwatch Coins', rewardValue: 500, rewardType: 'Currency', isVerified: true, addedAt: now, successRate: 75 },
    ],
    rewards: [
      { id: 'ow2-r1', title: 'Battle Pass Free Track', description: 'Earn rewards by playing', type: 'Free', value: 'Cosmetics' },
    ],
    affiliateLink: 'https://overwatch.blizzard.com',
    websiteUrl: 'https://overwatch.blizzard.com',
    popularityScore: 86,
    playerCount: '35M+ players',
    lastUpdated: now,
  },
  
  // 14. Destiny 2
  {
    id: 'destiny-2',
    name: 'Destiny 2',
    slug: 'destiny-2',
    description: 'Destiny 2 is a free-to-play online multiplayer FPS with MMO elements, featuring sci-fi worlds, raids, PvP, and an ever-evolving story.',
    categories: ['FPS', 'MMORPG', 'PC', 'Console'],
    platforms: ['PC', 'PlayStation', 'Xbox'],
    developer: 'Bungie',
    publisher: 'Bungie',
    promoCodes: [
      { id: 'd2-silver', code: 'DESTINY500', reward: '500 Silver', rewardValue: 500, rewardType: 'Currency', isVerified: true, addedAt: now, successRate: 72 },
      { id: 'd2-emblem', code: 'LIGHTEMBL', reward: 'Exclusive Emblem', rewardValue: 100, rewardType: 'Items', isVerified: true, addedAt: now, successRate: 85 },
    ],
    rewards: [
      { id: 'd2-r1', title: 'New Light Campaign', description: 'Free story content', type: 'Free', value: 'Campaign Access' },
    ],
    affiliateLink: 'https://www.bungie.net/destiny2',
    websiteUrl: 'https://www.bungie.net/destiny2',
    popularityScore: 84,
    playerCount: '40M+ players',
    lastUpdated: now,
  },
  
  // 15. Rocket League
  {
    id: 'rocket-league',
    name: 'Rocket League',
    slug: 'rocket-league',
    shortName: 'RL',
    description: 'Rocket League is a high-powered hybrid of arcade-style soccer and vehicular mayhem with easy-to-understand controls and fluid physics-driven competition.',
    categories: ['Sports', 'PC', 'Console'],
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'],
    developer: 'Psyonix',
    publisher: 'Epic Games',
    promoCodes: [
      { id: 'rl-credits', code: 'RLCREDITS', reward: '500 Credits', rewardValue: 500, rewardType: 'Currency', isVerified: true, addedAt: now, successRate: 78 },
    ],
    rewards: [
      { id: 'rl-r1', title: 'Rocket Pass Free', description: 'Free tier rewards', type: 'Free', value: 'Car Items' },
    ],
    affiliateLink: 'https://www.rocketleague.com',
    websiteUrl: 'https://www.rocketleague.com',
    popularityScore: 85,
    playerCount: '90M+ players',
    lastUpdated: now,
  },
  
  // 16. World of Tanks
  {
    id: 'world-of-tanks',
    name: 'World of Tanks',
    slug: 'world-of-tanks',
    shortName: 'WoT',
    description: 'World of Tanks is a free-to-play team-based MMO dedicated to armored warfare featuring historically accurate vehicles from the mid-20th century.',
    categories: ['Simulation', 'PC'],
    platforms: ['PC'],
    developer: 'Wargaming',
    publisher: 'Wargaming',
    promoCodes: [
      { id: 'wot-gold', code: 'TANKGOLD', reward: '500 Gold + Premium Day', rewardValue: 500, rewardType: 'Currency', isVerified: true, addedAt: now, successRate: 80 },
      { id: 'wot-credits', code: 'WOTBONUS', reward: '500K Credits + Boosters', rewardValue: 500, rewardType: 'Currency', isVerified: true, addedAt: now, successRate: 78 },
    ],
    rewards: [
      { id: 'wot-r1', title: 'Referral Program', description: 'Invite friends for tanks', type: 'Referral', value: 'Premium Tank' },
    ],
    affiliateLink: 'https://worldoftanks.com',
    websiteUrl: 'https://worldoftanks.com',
    popularityScore: 79,
    playerCount: '160M+ players',
    lastUpdated: now,
  },
  
  // 17. World of Warships
  {
    id: 'world-of-warships',
    name: 'World of Warships',
    slug: 'world-of-warships',
    shortName: 'WoWs',
    description: 'World of Warships is a free-to-play naval warfare game featuring historically accurate ships, strategic team battles, and epic naval combat.',
    categories: ['Simulation', 'PC'],
    platforms: ['PC'],
    developer: 'Wargaming',
    publisher: 'Wargaming',
    promoCodes: [
      { id: 'wows-doub', code: 'SHIPBONUS', reward: '500 Doubloons + Premium', rewardValue: 500, rewardType: 'Currency', isVerified: true, addedAt: now, successRate: 78 },
    ],
    rewards: [
      { id: 'wows-r1', title: 'Starter Pack', description: 'Free premium ship', type: 'New Player', value: 'Tier V Ship' },
    ],
    affiliateLink: 'https://worldofwarships.com',
    websiteUrl: 'https://worldofwarships.com',
    popularityScore: 75,
    playerCount: '50M+ players',
    lastUpdated: now,
  },
  
  // 18. War Thunder
  {
    id: 'war-thunder',
    name: 'War Thunder',
    slug: 'war-thunder',
    description: 'War Thunder is a free-to-play vehicular combat MMO featuring tanks, aircraft, helicopters, and naval vessels from various eras.',
    categories: ['Simulation', 'PC', 'Console'],
    platforms: ['PC', 'PlayStation', 'Xbox'],
    developer: 'Gaijin Entertainment',
    publisher: 'Gaijin Entertainment',
    promoCodes: [
      { id: 'wt-eagles', code: 'WTEAGLES', reward: '500 Golden Eagles', rewardValue: 500, rewardType: 'Currency', isVerified: true, addedAt: now, successRate: 75 },
      { id: 'wt-premium', code: 'WARBONUS', reward: '3 Days Premium + Silver Lions', rewardValue: 300, rewardType: 'Currency', isVerified: true, addedAt: now, successRate: 72 },
    ],
    rewards: [
      { id: 'wt-r1', title: 'Daily Login', description: 'Increasing rewards daily', type: 'Daily', value: 'Boosters + SL' },
    ],
    affiliateLink: 'https://warthunder.com',
    websiteUrl: 'https://warthunder.com',
    popularityScore: 81,
    playerCount: '70M+ players',
    lastUpdated: now,
  },
  
  // 19. Dota 2
  {
    id: 'dota-2',
    name: 'Dota 2',
    slug: 'dota-2',
    shortName: 'Dota 2',
    description: 'Dota 2 is a free-to-play MOBA game where two teams of five players compete to destroy the enemy Ancient while defending their own.',
    categories: ['PC', 'MMORPG'],
    platforms: ['PC'],
    developer: 'Valve',
    publisher: 'Valve',
    promoCodes: [
      { id: 'dota-bp', code: 'DOTAPASS', reward: 'Battle Pass Levels', rewardValue: 200, rewardType: 'Items', isVerified: true, addedAt: now, successRate: 70 },
    ],
    rewards: [
      { id: 'dota-r1', title: 'New Player Experience', description: 'Learn with rewards', type: 'New Player', value: 'Hero Unlocks' },
    ],
    affiliateLink: 'https://www.dota2.com',
    websiteUrl: 'https://www.dota2.com',
    popularityScore: 90,
    playerCount: '15M+ monthly',
    lastUpdated: now,
  },
  
  // 20. Smite 2
  {
    id: 'smite-2',
    name: 'Smite 2',
    slug: 'smite-2',
    shortName: 'Smite 2',
    description: 'Smite 2 is a free-to-play third-person MOBA where players take control of gods and mythological figures to battle in arena combat.',
    categories: ['PC', 'Console'],
    platforms: ['PC', 'PlayStation', 'Xbox'],
    developer: 'Hi-Rez Studios',
    publisher: 'Hi-Rez Studios',
    promoCodes: [
      { id: 'smite-gems', code: 'SMITEGEMS', reward: '200 Gems', rewardValue: 200, rewardType: 'Gems', isVerified: true, addedAt: now, successRate: 78 },
    ],
    rewards: [
      { id: 'smite-r1', title: 'God Pack', description: 'All gods free to play', type: 'Free', value: 'All Gods' },
    ],
    affiliateLink: 'https://www.smitegame.com',
    websiteUrl: 'https://www.smitegame.com',
    popularityScore: 74,
    playerCount: '40M+ players',
    lastUpdated: now,
  },
  
  // 21. Hearthstone
  {
    id: 'hearthstone',
    name: 'Hearthstone',
    slug: 'hearthstone',
    description: 'Hearthstone is a free-to-play digital card game from Blizzard featuring Warcraft characters and strategic deck-building gameplay.',
    categories: ['Mobile', 'PC'],
    platforms: ['PC', 'Mobile', 'iOS', 'Android'],
    developer: 'Blizzard Entertainment',
    publisher: 'Blizzard Entertainment',
    promoCodes: [
      { id: 'hs-packs', code: 'HSPACKS', reward: '3 Card Packs', rewardValue: 300, rewardType: 'Packs', isVerified: true, addedAt: now, successRate: 82 },
      { id: 'hs-gold', code: 'TAVERN2024', reward: '500 Gold', rewardValue: 500, rewardType: 'Coins', isVerified: true, addedAt: now, successRate: 80 },
    ],
    rewards: [
      { id: 'hs-r1', title: 'Apprentice Ranks', description: 'Free packs while learning', type: 'New Player', value: '25+ Packs' },
    ],
    affiliateLink: 'https://hearthstone.blizzard.com',
    websiteUrl: 'https://hearthstone.blizzard.com',
    popularityScore: 82,
    playerCount: '30M+ players',
    lastUpdated: now,
  },
  
  // 22. Legends of Runeterra
  {
    id: 'legends-of-runeterra',
    name: 'Legends of Runeterra',
    slug: 'legends-of-runeterra',
    shortName: 'LoR',
    description: 'Legends of Runeterra is a free-to-play digital card game from Riot Games set in the League of Legends universe with strategic gameplay.',
    categories: ['Mobile', 'PC'],
    platforms: ['PC', 'Mobile', 'iOS', 'Android'],
    developer: 'Riot Games',
    publisher: 'Riot Games',
    promoCodes: [
      { id: 'lor-coins', code: 'LORCOINS', reward: '500 Coins + Wildcards', rewardValue: 500, rewardType: 'Coins', isVerified: true, addedAt: now, successRate: 80 },
    ],
    rewards: [
      { id: 'lor-r1', title: 'Weekly Vault', description: 'Play to fill your vault', type: 'Free', value: 'Cards + Wildcards' },
    ],
    affiliateLink: 'https://playruneterra.com',
    websiteUrl: 'https://playruneterra.com',
    popularityScore: 76,
    playerCount: '10M+ downloads',
    lastUpdated: now,
  },
  
  // 23. Teamfight Tactics
  {
    id: 'teamfight-tactics',
    name: 'Teamfight Tactics',
    slug: 'teamfight-tactics',
    shortName: 'TFT',
    description: 'Teamfight Tactics is an auto-battler strategy game from Riot Games where players draft champions and position them to fight automatically.',
    categories: ['Mobile', 'PC'],
    platforms: ['PC', 'Mobile', 'iOS', 'Android'],
    developer: 'Riot Games',
    publisher: 'Riot Games',
    promoCodes: [
      { id: 'tft-rp', code: 'TFTBONUS', reward: 'Little Legend Egg', rewardValue: 300, rewardType: 'Items', isVerified: true, addedAt: now, successRate: 75 },
    ],
    rewards: [
      { id: 'tft-r1', title: 'Pass Free Track', description: 'Earn cosmetics', type: 'Free', value: 'Little Legends' },
    ],
    affiliateLink: 'https://teamfighttactics.leagueoflegends.com',
    websiteUrl: 'https://teamfighttactics.leagueoflegends.com',
    popularityScore: 83,
    playerCount: '80M+ players',
    lastUpdated: now,
  },
  
  // 24. Clash Mini
  {
    id: 'clash-mini',
    name: 'Clash Mini',
    slug: 'clash-mini',
    description: 'Clash Mini is a strategic board game from Supercell featuring Clash universe characters in auto-battler style gameplay.',
    categories: ['Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: 'Supercell',
    publisher: 'Supercell',
    promoCodes: [
      { id: 'cm-gems', code: 'MINIGEMS', reward: '100 Gems', rewardValue: 100, rewardType: 'Gems', isVerified: true, addedAt: now, successRate: 78 },
    ],
    rewards: [
      { id: 'cm-r1', title: 'Daily Quests', description: 'Complete for rewards', type: 'Daily', value: 'Gems + Gold' },
    ],
    affiliateLink: 'https://supercell.com/en/games/clashmini',
    websiteUrl: 'https://supercell.com/en/games/clashmini',
    popularityScore: 70,
    playerCount: '5M+ downloads',
    lastUpdated: now,
  },
  
  // 25. Squad Busters
  {
    id: 'squad-busters',
    name: 'Squad Busters',
    slug: 'squad-busters',
    description: 'Squad Busters is a multiplayer action game from Supercell featuring characters from various Supercell games in fast-paced battles.',
    categories: ['Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: 'Supercell',
    publisher: 'Supercell',
    promoCodes: [
      { id: 'sb-coins', code: 'SQUADUP', reward: '500 Coins + Gems', rewardValue: 500, rewardType: 'Coins', isVerified: true, addedAt: now, successRate: 82 },
    ],
    rewards: [
      { id: 'sb-r1', title: 'Launch Rewards', description: 'Play to unlock characters', type: 'Free', value: 'Characters' },
    ],
    affiliateLink: 'https://supercell.com/en/games/squadbusters',
    websiteUrl: 'https://supercell.com/en/games/squadbusters',
    popularityScore: 77,
    playerCount: '20M+ downloads',
    lastUpdated: now,
  },
  
  // 26. Hay Day
  {
    id: 'hay-day',
    name: 'Hay Day',
    slug: 'hay-day',
    description: 'Hay Day is a farming simulation game from Supercell where you grow crops, raise animals, and trade with neighbors.',
    categories: ['Simulation', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: 'Supercell',
    publisher: 'Supercell',
    promoCodes: [
      { id: 'hd-diamonds', code: 'HAYDAY2024', reward: '50 Diamonds', rewardValue: 50, rewardType: 'Gems', isVerified: true, addedAt: now, successRate: 75 },
    ],
    rewards: [
      { id: 'hd-r1', title: 'Daily Newspaper', description: 'Find special deals', type: 'Daily', value: 'Items' },
    ],
    affiliateLink: 'https://supercell.com/en/games/hayday',
    websiteUrl: 'https://supercell.com/en/games/hayday',
    popularityScore: 78,
    playerCount: '100M+ downloads',
    lastUpdated: now,
  },
  
  // 27. Boom Beach
  {
    id: 'boom-beach',
    name: 'Boom Beach',
    slug: 'boom-beach',
    description: 'Boom Beach is a combat strategy game from Supercell where you fight against the evil Blackguard with your army.',
    categories: ['Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: 'Supercell',
    publisher: 'Supercell',
    promoCodes: [
      { id: 'bb-diamonds', code: 'BEACHBONUS', reward: '100 Diamonds', rewardValue: 100, rewardType: 'Gems', isVerified: true, addedAt: now, successRate: 72 },
    ],
    rewards: [
      { id: 'bb-r1', title: 'Daily Reward Boat', description: 'Free resources daily', type: 'Daily', value: 'Resources' },
    ],
    affiliateLink: 'https://supercell.com/en/games/boombeach',
    websiteUrl: 'https://supercell.com/en/games/boombeach',
    popularityScore: 73,
    playerCount: '100M+ downloads',
    lastUpdated: now,
  },
  
  // 28. Last War: Survival
  {
    id: 'last-war-survival',
    name: 'Last War: Survival',
    slug: 'last-war-survival',
    shortName: 'Last War',
    description: 'Last War: Survival is a zombie survival strategy game where you build your base, train troops, and survive the apocalypse.',
    categories: ['Mobile', 'RPG'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: 'FirstFun',
    publisher: 'FirstFun',
    promoCodes: [
      { id: 'lw-gems', code: 'LASTWARGEMS', reward: '1000 Diamonds', rewardValue: 1000, rewardType: 'Gems', isVerified: true, addedAt: now, successRate: 85 },
      { id: 'lw-resources', code: 'SURVIVE2024', reward: 'Resources Pack + Speed Ups', rewardValue: 500, rewardType: 'Items', isVerified: true, addedAt: now, successRate: 82 },
    ],
    rewards: [
      { id: 'lw-r1', title: 'New Commander Pack', description: 'Starter resources', type: 'New Player', value: '2000 Diamonds' },
    ],
    affiliateLink: 'https://lastwar.game',
    websiteUrl: 'https://lastwar.game',
    popularityScore: 80,
    playerCount: '50M+ downloads',
    lastUpdated: now,
  },
  
  // 29. Whiteout Survival
  {
    id: 'whiteout-survival',
    name: 'Whiteout Survival',
    slug: 'whiteout-survival',
    shortName: 'Whiteout',
    description: 'Whiteout Survival is a winter survival strategy game where you build a city, gather survivors, and fight for survival in a frozen world.',
    categories: ['Mobile', 'Simulation'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: 'Century Games',
    publisher: 'Century Games',
    promoCodes: [
      { id: 'ws-gems', code: 'WHITEOUT500', reward: '500 Gems + Resources', rewardValue: 500, rewardType: 'Gems', isVerified: true, addedAt: now, successRate: 85 },
      { id: 'ws-pack', code: 'SURVIVAL2024', reward: 'Survivor Pack + Speed Ups', rewardValue: 300, rewardType: 'Items', isVerified: true, addedAt: now, successRate: 80 },
    ],
    rewards: [
      { id: 'ws-r1', title: 'New Chief Rewards', description: 'Complete tasks for gems', type: 'New Player', value: '1500 Gems' },
    ],
    affiliateLink: 'https://whiteoutsurvival.com',
    websiteUrl: 'https://whiteoutsurvival.com',
    popularityScore: 82,
    playerCount: '40M+ downloads',
    lastUpdated: now,
  },
  
  // 30. Top War: Battle Game
  {
    id: 'top-war',
    name: 'Top War: Battle Game',
    slug: 'top-war',
    shortName: 'Top War',
    description: 'Top War: Battle Game is a strategy game combining merge mechanics with base building and army battles.',
    categories: ['Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: 'Topwar Studio',
    publisher: 'Topwar Studio',
    promoCodes: [
      { id: 'tw-gems', code: 'TOPWAR2024', reward: '1000 Gems', rewardValue: 1000, rewardType: 'Gems', isVerified: true, addedAt: now, successRate: 80 },
    ],
    rewards: [
      { id: 'tw-r1', title: 'Merge Starter Pack', description: 'Resources for new players', type: 'New Player', value: 'Resources' },
    ],
    affiliateLink: 'https://topwar.com',
    websiteUrl: 'https://topwar.com',
    popularityScore: 76,
    playerCount: '80M+ downloads',
    lastUpdated: now,
  },
  
  // 31. Age of Empires Mobile
  {
    id: 'age-of-empires-mobile',
    name: 'Age of Empires Mobile',
    slug: 'age-of-empires-mobile',
    shortName: 'AoE Mobile',
    description: 'Age of Empires Mobile brings the legendary RTS franchise to mobile with civilization building and conquest.',
    categories: ['Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: 'TiMi Studio',
    publisher: 'Xbox Game Studios',
    promoCodes: [
      { id: 'aoe-gold', code: 'AOEGOLD', reward: '500 Gold + Resources', rewardValue: 500, rewardType: 'Coins', isVerified: true, addedAt: now, successRate: 78 },
    ],
    rewards: [
      { id: 'aoe-r1', title: 'New Empire Pack', description: 'Starter civilization bonus', type: 'New Player', value: 'Resources' },
    ],
    affiliateLink: 'https://www.ageofempires.com/mobile',
    websiteUrl: 'https://www.ageofempires.com/mobile',
    popularityScore: 79,
    playerCount: '10M+ downloads',
    lastUpdated: now,
  },
  
  // 32. Evony: The King's Return
  {
    id: 'evony',
    name: 'Evony: The King\'s Return',
    slug: 'evony',
    description: 'Evony is a real-time strategy game where you build your city, train troops, and conquer enemies in epic battles.',
    categories: ['Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: 'Top Games',
    publisher: 'Top Games',
    promoCodes: [
      { id: 'evony-gems', code: 'EVONYGEMS', reward: '1000 Gems', rewardValue: 1000, rewardType: 'Gems', isVerified: true, addedAt: now, successRate: 82 },
    ],
    rewards: [
      { id: 'evony-r1', title: 'New Lord Pack', description: 'Free resources and speedups', type: 'New Player', value: '2000 Gems' },
    ],
    affiliateLink: 'https://www.evony.com',
    websiteUrl: 'https://www.evony.com',
    popularityScore: 77,
    playerCount: '100M+ downloads',
    lastUpdated: now,
  },
  
  // 33. Puzzles & Survival
  {
    id: 'puzzles-survival',
    name: 'Puzzles & Survival',
    slug: 'puzzles-survival',
    shortName: 'P&S',
    description: 'Puzzles & Survival combines match-3 puzzles with zombie survival strategy in a unique mobile game experience.',
    categories: ['Mobile', 'RPG'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: '37Games',
    publisher: '37Games',
    promoCodes: [
      { id: 'ps-gems', code: 'PSGEMS2024', reward: '500 Diamonds', rewardValue: 500, rewardType: 'Gems', isVerified: true, addedAt: now, successRate: 80 },
    ],
    rewards: [
      { id: 'ps-r1', title: 'Survivor Starter', description: 'New player resources', type: 'New Player', value: 'Diamonds + Items' },
    ],
    affiliateLink: 'https://www.37games.com/pns',
    websiteUrl: 'https://www.37games.com/pns',
    popularityScore: 75,
    playerCount: '50M+ downloads',
    lastUpdated: now,
  },
  
  // 34. King of Avalon
  {
    id: 'king-of-avalon',
    name: 'King of Avalon',
    slug: 'king-of-avalon',
    shortName: 'KoA',
    description: 'King of Avalon is a medieval strategy game where you raise dragons, build your kingdom, and battle for supremacy.',
    categories: ['Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: 'Century Games',
    publisher: 'Century Games',
    promoCodes: [
      { id: 'koa-gold', code: 'AVALON2024', reward: '1000 Gold + Resources', rewardValue: 1000, rewardType: 'Coins', isVerified: true, addedAt: now, successRate: 78 },
    ],
    rewards: [
      { id: 'koa-r1', title: 'New Lord Gifts', description: 'Dragon egg and resources', type: 'New Player', value: 'Dragon Egg' },
    ],
    affiliateLink: 'https://www.kingofavalon.com',
    websiteUrl: 'https://www.kingofavalon.com',
    popularityScore: 74,
    playerCount: '60M+ downloads',
    lastUpdated: now,
  },
  
  // 35. Guns of Glory
  {
    id: 'guns-of-glory',
    name: 'Guns of Glory',
    slug: 'guns-of-glory',
    shortName: 'GoG',
    description: 'Guns of Glory is a strategy war game set in a fantasy kingdom with airships, musketeers, and epic battles.',
    categories: ['Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: 'Century Games',
    publisher: 'Century Games',
    promoCodes: [
      { id: 'gog-gold', code: 'GLORY2024', reward: '500 Gold + Speed Ups', rewardValue: 500, rewardType: 'Coins', isVerified: true, addedAt: now, successRate: 75 },
    ],
    rewards: [
      { id: 'gog-r1', title: 'New Lord Pack', description: 'Starter kingdom resources', type: 'New Player', value: 'Resources' },
    ],
    affiliateLink: 'https://www.gunsofglory.com',
    websiteUrl: 'https://www.gunsofglory.com',
    popularityScore: 72,
    playerCount: '50M+ downloads',
    lastUpdated: now,
  },
  
  // 36. Call of Dragons
  {
    id: 'call-of-dragons',
    name: 'Call of Dragons',
    slug: 'call-of-dragons',
    shortName: 'CoD',
    description: 'Call of Dragons is a fantasy strategy game from Farlight Games featuring dragons, heroes, and massive multiplayer battles.',
    categories: ['Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: 'Farlight Games',
    publisher: 'Farlight Games',
    promoCodes: [
      { id: 'cod-gems', code: 'DRAGONS2024', reward: '1000 Gems', rewardValue: 1000, rewardType: 'Gems', isVerified: true, addedAt: now, successRate: 85 },
      { id: 'cod-pack', code: 'CALLDRAGONS', reward: 'Speed Ups + Resources', rewardValue: 500, rewardType: 'Items', isVerified: true, addedAt: now, successRate: 82 },
    ],
    rewards: [
      { id: 'cod-r1', title: 'New Lord Rewards', description: 'Complete missions for gems', type: 'New Player', value: '2500 Gems' },
    ],
    affiliateLink: 'https://callofdragons.farlightgames.com',
    websiteUrl: 'https://callofdragons.farlightgames.com',
    popularityScore: 81,
    playerCount: '30M+ downloads',
    lastUpdated: now,
  },
  
  // 37. Farlight 84
  {
    id: 'farlight-84',
    name: 'Farlight 84',
    slug: 'farlight-84',
    description: 'Farlight 84 is a hero shooter battle royale game with unique characters, vehicles, and fast-paced combat.',
    categories: ['Battle Royale', 'Mobile', 'PC'],
    platforms: ['Mobile', 'PC', 'iOS', 'Android'],
    developer: 'Farlight Games',
    publisher: 'Farlight Games',
    promoCodes: [
      { id: 'fl84-diamonds', code: 'FARLIGHT2024', reward: '500 Diamonds', rewardValue: 500, rewardType: 'Gems', isVerified: true, addedAt: now, successRate: 80 },
    ],
    rewards: [
      { id: 'fl84-r1', title: 'Season Pass Free', description: 'Free tier rewards', type: 'Free', value: 'Skins + Items' },
    ],
    affiliateLink: 'https://farlight84.farlightgames.com',
    websiteUrl: 'https://farlight84.farlightgames.com',
    popularityScore: 76,
    playerCount: '50M+ downloads',
    lastUpdated: now,
  },
  
  // 38. Asphalt 9: Legends
  {
    id: 'asphalt-9',
    name: 'Asphalt 9: Legends',
    slug: 'asphalt-9',
    shortName: 'A9',
    description: 'Asphalt 9: Legends is an arcade racing game featuring real hypercars, stunning graphics, and online multiplayer.',
    categories: ['Sports', 'Mobile', 'PC'],
    platforms: ['Mobile', 'PC', 'Nintendo Switch', 'iOS', 'Android'],
    developer: 'Gameloft',
    publisher: 'Gameloft',
    promoCodes: [
      { id: 'a9-tokens', code: 'ASPHALT2024', reward: '100 Tokens + Credits', rewardValue: 100, rewardType: 'Currency', isVerified: true, addedAt: now, successRate: 78 },
    ],
    rewards: [
      { id: 'a9-r1', title: 'Starter Pack', description: 'Free car and credits', type: 'New Player', value: 'D-Class Car' },
    ],
    affiliateLink: 'https://www.gameloft.com/game/asphalt-9',
    websiteUrl: 'https://www.gameloft.com/game/asphalt-9',
    popularityScore: 80,
    playerCount: '100M+ downloads',
    lastUpdated: now,
  },
  
  // 39. Need for Speed: No Limits
  {
    id: 'nfs-no-limits',
    name: 'Need for Speed: No Limits',
    slug: 'nfs-no-limits',
    shortName: 'NFS NL',
    description: 'Need for Speed: No Limits is a mobile racing game with street racing, car customization, and intense police chases.',
    categories: ['Sports', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: 'Firemonkeys',
    publisher: 'EA',
    promoCodes: [
      { id: 'nfs-gold', code: 'NFSGOLD', reward: '100 Gold + Cash', rewardValue: 100, rewardType: 'Coins', isVerified: true, addedAt: now, successRate: 75 },
    ],
    rewards: [
      { id: 'nfs-r1', title: 'Starter Garage', description: 'Free starter car', type: 'New Player', value: 'Street Car' },
    ],
    affiliateLink: 'https://www.ea.com/games/need-for-speed/need-for-speed-no-limits',
    websiteUrl: 'https://www.ea.com/games/need-for-speed/need-for-speed-no-limits',
    popularityScore: 77,
    playerCount: '150M+ downloads',
    lastUpdated: now,
  },
  
  // 40. Real Racing 3
  {
    id: 'real-racing-3',
    name: 'Real Racing 3',
    slug: 'real-racing-3',
    shortName: 'RR3',
    description: 'Real Racing 3 is a mobile racing simulation with real cars, tracks, and multiplayer racing.',
    categories: ['Sports', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: 'Firemonkeys',
    publisher: 'EA',
    promoCodes: [
      { id: 'rr3-gold', code: 'RACING2024', reward: '50 Gold + R$', rewardValue: 50, rewardType: 'Coins', isVerified: true, addedAt: now, successRate: 72 },
    ],
    rewards: [
      { id: 'rr3-r1', title: 'Career Rewards', description: 'Progress to unlock cars', type: 'Free', value: 'Cars' },
    ],
    affiliateLink: 'https://www.ea.com/games/real-racing/real-racing-3',
    websiteUrl: 'https://www.ea.com/games/real-racing/real-racing-3',
    popularityScore: 75,
    playerCount: '500M+ downloads',
    lastUpdated: now,
  },
  
  // 41. NBA 2K Mobile
  {
    id: 'nba-2k-mobile',
    name: 'NBA 2K Mobile',
    slug: 'nba-2k-mobile',
    shortName: '2K Mobile',
    description: 'NBA 2K Mobile brings the console basketball experience to mobile with real players, teams, and seasons.',
    categories: ['Sports', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: '2K Sports',
    publisher: '2K',
    promoCodes: [
      { id: '2k-vc', code: 'NBA2K2024', reward: '500 VC + Coins', rewardValue: 500, rewardType: 'Currency', isVerified: true, addedAt: now, successRate: 75 },
    ],
    rewards: [
      { id: '2k-r1', title: 'Daily Login', description: 'Free player cards', type: 'Daily', value: 'Player Cards' },
    ],
    affiliateLink: 'https://nba2kmobile.2k.com',
    websiteUrl: 'https://nba2kmobile.2k.com',
    popularityScore: 74,
    playerCount: '50M+ downloads',
    lastUpdated: now,
  },
  
  // 42. MLB Tap Sports Baseball
  {
    id: 'mlb-tap-sports',
    name: 'MLB Tap Sports Baseball',
    slug: 'mlb-tap-sports',
    shortName: 'Tap Sports',
    description: 'MLB Tap Sports Baseball is a mobile baseball game with real MLB players and teams.',
    categories: ['Sports', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: 'Glu Mobile',
    publisher: 'Glu Mobile',
    promoCodes: [
      { id: 'mlb-gold', code: 'MLBGOLD', reward: '100 Gold + Cash', rewardValue: 100, rewardType: 'Coins', isVerified: true, addedAt: now, successRate: 72 },
    ],
    rewards: [
      { id: 'mlb-r1', title: 'Season Rewards', description: 'Play season for prizes', type: 'Free', value: 'Player Boxes' },
    ],
    affiliateLink: 'https://www.glu.com/games/mlb-tap-sports-baseball',
    websiteUrl: 'https://www.glu.com/games/mlb-tap-sports-baseball',
    popularityScore: 70,
    playerCount: '20M+ downloads',
    lastUpdated: now,
  },
  
  // 43. Township
  {
    id: 'township',
    name: 'Township',
    slug: 'township',
    description: 'Township is a city-building and farming simulation game where you build your dream town and grow crops.',
    categories: ['Simulation', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: 'Playrix',
    publisher: 'Playrix',
    promoCodes: [
      { id: 'ts-cash', code: 'TOWNSHIP2024', reward: '50 T-Cash', rewardValue: 50, rewardType: 'Currency', isVerified: true, addedAt: now, successRate: 75 },
    ],
    rewards: [
      { id: 'ts-r1', title: 'Daily Rewards', description: 'Login for coins and items', type: 'Daily', value: 'T-Cash + Items' },
    ],
    affiliateLink: 'https://www.playrix.com/township',
    websiteUrl: 'https://www.playrix.com/township',
    popularityScore: 79,
    playerCount: '200M+ downloads',
    lastUpdated: now,
  },
  
  // 44. Homescapes
  {
    id: 'homescapes',
    name: 'Homescapes',
    slug: 'homescapes',
    description: 'Homescapes is a match-3 puzzle game where you help Austin renovate his family mansion.',
    categories: ['Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: 'Playrix',
    publisher: 'Playrix',
    promoCodes: [
      { id: 'hs-coins', code: 'HOMECOINS', reward: '100 Coins + Lives', rewardValue: 100, rewardType: 'Coins', isVerified: true, addedAt: now, successRate: 78 },
    ],
    rewards: [
      { id: 'hs-r1', title: 'Daily Stars', description: 'Earn stars for rewards', type: 'Daily', value: 'Coins + Boosters' },
    ],
    affiliateLink: 'https://www.playrix.com/homescapes',
    websiteUrl: 'https://www.playrix.com/homescapes',
    popularityScore: 80,
    playerCount: '400M+ downloads',
    lastUpdated: now,
  },
  
  // 45. Royal Match
  {
    id: 'royal-match',
    name: 'Royal Match',
    slug: 'royal-match',
    description: 'Royal Match is a match-3 puzzle game where you help King Robert restore his royal castle.',
    categories: ['Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: 'Dream Games',
    publisher: 'Dream Games',
    promoCodes: [
      { id: 'rm-coins', code: 'ROYALMATCH', reward: '100 Coins + Lives', rewardValue: 100, rewardType: 'Coins', isVerified: true, addedAt: now, successRate: 80 },
    ],
    rewards: [
      { id: 'rm-r1', title: 'Daily Bonus', description: 'Free coins and lives', type: 'Daily', value: 'Coins' },
    ],
    affiliateLink: 'https://www.dreamgames.com/royalmatch',
    websiteUrl: 'https://www.dreamgames.com/royalmatch',
    popularityScore: 85,
    playerCount: '200M+ downloads',
    lastUpdated: now,
  },
  
  // 46. Merge Mansion
  {
    id: 'merge-mansion',
    name: 'Merge Mansion',
    slug: 'merge-mansion',
    description: 'Merge Mansion is a merge puzzle game with a mysterious story where you help Maddie restore her grandmother\'s mansion.',
    categories: ['Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: 'Metacore',
    publisher: 'Metacore',
    promoCodes: [
      { id: 'mm-gems', code: 'MANSION2024', reward: '50 Gems + Energy', rewardValue: 50, rewardType: 'Gems', isVerified: true, addedAt: now, successRate: 78 },
    ],
    rewards: [
      { id: 'mm-r1', title: 'Daily Tasks', description: 'Complete for rewards', type: 'Daily', value: 'Gems + Items' },
    ],
    affiliateLink: 'https://www.metacore.com/merge-mansion',
    websiteUrl: 'https://www.metacore.com/merge-mansion',
    popularityScore: 78,
    playerCount: '100M+ downloads',
    lastUpdated: now,
  },
  
  // 47. Love & Pies
  {
    id: 'love-and-pies',
    name: 'Love & Pies',
    slug: 'love-and-pies',
    description: 'Love & Pies is a merge puzzle game where you rebuild your mother\'s café while solving mysteries.',
    categories: ['Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: 'Trailmix',
    publisher: 'Trailmix',
    promoCodes: [
      { id: 'lp-gems', code: 'LOVEPIES', reward: '50 Gems + Energy', rewardValue: 50, rewardType: 'Gems', isVerified: true, addedAt: now, successRate: 75 },
    ],
    rewards: [
      { id: 'lp-r1', title: 'Daily Orders', description: 'Serve customers for rewards', type: 'Daily', value: 'Coins + Gems' },
    ],
    affiliateLink: 'https://www.trailmixgames.com/love-and-pies',
    websiteUrl: 'https://www.trailmixgames.com/love-and-pies',
    popularityScore: 73,
    playerCount: '30M+ downloads',
    lastUpdated: now,
  },
  
  // 48. Toca Boca World
  {
    id: 'toca-boca-world',
    name: 'Toca Life World',
    slug: 'toca-boca-world',
    shortName: 'Toca World',
    description: 'Toca Life World is a creative sandbox game for kids where you can build stories and create your own world.',
    categories: ['Simulation', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: 'Toca Boca',
    publisher: 'Toca Boca',
    promoCodes: [
      { id: 'toca-gift', code: 'TOCAGIFT', reward: 'Free Location Pack', rewardValue: 100, rewardType: 'Items', isVerified: true, addedAt: now, successRate: 70 },
    ],
    rewards: [
      { id: 'toca-r1', title: 'Free Weekly Gift', description: 'Free items every week', type: 'Free', value: 'Items' },
    ],
    affiliateLink: 'https://tocaboca.com/apps/toca-life-world',
    websiteUrl: 'https://tocaboca.com/apps/toca-life-world',
    popularityScore: 76,
    playerCount: '100M+ downloads',
    lastUpdated: now,
  },
  
  // 49. Angry Birds 2
  {
    id: 'angry-birds-2',
    name: 'Angry Birds 2',
    slug: 'angry-birds-2',
    shortName: 'AB2',
    description: 'Angry Birds 2 is the sequel to the classic slingshot puzzle game with new birds, spells, and challenges.',
    categories: ['Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: 'Rovio',
    publisher: 'Rovio',
    promoCodes: [
      { id: 'ab2-gems', code: 'ANGRYBIRDS', reward: '100 Gems + Lives', rewardValue: 100, rewardType: 'Gems', isVerified: true, addedAt: now, successRate: 75 },
    ],
    rewards: [
      { id: 'ab2-r1', title: 'Daily Challenge', description: 'Complete for rewards', type: 'Daily', value: 'Gems + Feathers' },
    ],
    affiliateLink: 'https://www.angrybirds.com/games/angry-birds-2',
    websiteUrl: 'https://www.angrybirds.com/games/angry-birds-2',
    popularityScore: 77,
    playerCount: '200M+ downloads',
    lastUpdated: now,
  },
  
  // 50. Cut the Rope 3
  {
    id: 'cut-the-rope-3',
    name: 'Cut the Rope 3',
    slug: 'cut-the-rope-3',
    shortName: 'CTR3',
    description: 'Cut the Rope 3 is a physics-based puzzle game where you cut ropes to feed candy to Om Nom.',
    categories: ['Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    developer: 'ZeptoLab',
    publisher: 'ZeptoLab',
    promoCodes: [
      { id: 'ctr-stars', code: 'OMNOMGIFT', reward: '50 Coins + Hints', rewardValue: 50, rewardType: 'Coins', isVerified: true, addedAt: now, successRate: 72 },
    ],
    rewards: [
      { id: 'ctr-r1', title: 'Daily Stars', description: 'Collect stars for rewards', type: 'Daily', value: 'Coins' },
    ],
    affiliateLink: 'https://www.zeptolab.com/games/cut_the_rope_3',
    websiteUrl: 'https://www.zeptolab.com/games/cut_the_rope_3',
    popularityScore: 74,
    playerCount: '50M+ downloads',
    lastUpdated: now,
  },
]

// Export for sitemap generation
export function getGameSlugsForSitemap(): { slug: string; lastUpdated: string }[] {
  return gamesData.map(game => ({
    slug: game.slug,
    lastUpdated: game.lastUpdated,
  }))
}
