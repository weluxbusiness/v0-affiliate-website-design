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
  websiteUrl?: string
  popularityScore: number // 1-100, used for sorting
  playerCount?: string // e.g., "50M+ players"
  lastUpdated: string
  metaTitle?: string
  metaDescription?: string
  faqs?: { question: string; answer: string }[]
}

// Default fallback logo
export const DEFAULT_GAME_LOGO = '/images/games/default-game-logo.svg'

// Helper to get logo URL with fallback
export function getGameLogoUrl(game: Game): string {
  return game.logoUrl || DEFAULT_GAME_LOGO
}

// Helper to get affiliate link or fallback to internal page
export function getGameAffiliateUrl(game: Game): string {
  return game.affiliateLink || `/gaming/${game.slug}`
}

// Check if game has external affiliate link
export function hasExternalAffiliateLink(game: Game): boolean {
  return !!game.affiliateLink && game.affiliateLink.startsWith('http')
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
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
    logoUrl: '/images/games/raid-shadow-legends.webp',
    developer: 'Plarium',
    publisher: 'Plarium',
    promoCodes: [
      {
        id: 'raid-1',
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
        id: 'raid-2',
        code: 'CHAMP100',
        reward: '100 Energy + 50K Silver',
        rewardValue: 100,
        rewardType: 'Currency',
        isVerified: true,
        addedAt: now,
        successRate: 90,
      },
      {
        id: 'raid-3',
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
        question: 'How do I redeem RAID promo codes?',
        answer: 'Open the game, tap your avatar, go to Settings, then tap "Promo Codes" and enter your code.',
      },
      {
        question: 'Do RAID promo codes expire?',
        answer: 'Yes, most promo codes have expiration dates. We update our list daily to remove expired codes.',
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
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop',
    logoUrl: '/images/games/genshin-impact.webp',
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
    imageUrl: 'https://images.unsplash.com/photo-1589241062272-c0a000072dfa?w=600&h=400&fit=crop',
    logoUrl: '/images/games/fortnite.webp',
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
    imageUrl: 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b0b?w=600&h=400&fit=crop',
    logoUrl: '/images/games/call-of-duty-mobile.webp',
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
    imageUrl: 'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=600&h=400&fit=crop',
    logoUrl: '/images/games/roblox.webp',
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
    imageUrl: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=600&h=400&fit=crop',
    logoUrl: '/images/games/honkai-star-rail.webp',
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
    imageUrl: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=600&h=400&fit=crop',
    logoUrl: '/images/games/apex-legends.webp',
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
    imageUrl: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=600&h=400&fit=crop',
    logoUrl: '/images/games/pokemon-go.webp',
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
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&h=400&fit=crop',
    logoUrl: '/images/games/clash-of-clans.webp',
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
    imageUrl: 'https://images.unsplash.com/photo-1587573089734-09cb69c0f2b4?w=600&h=400&fit=crop',
    logoUrl: '/images/games/minecraft.webp',
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
    imageUrl: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=600&h=400&fit=crop',
    logoUrl: '/images/games/valorant.webp',
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
    imageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&h=400&fit=crop',
    logoUrl: '/images/games/league-of-legends.webp',
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
    imageUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=400&fit=crop',
    logoUrl: '/images/games/free-fire.webp',
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
    imageUrl: 'https://images.unsplash.com/photo-1542549237432-a176cb9d5e6e?w=600&h=400&fit=crop',
    logoUrl: '/images/games/pubg-mobile.webp',
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
  // Valorant
  // ============================================
  {
    id: 'valorant',
    name: 'VALORANT',
    slug: 'valorant',
    description: 'VALORANT is a free-to-play tactical shooter from Riot Games combining precise gunplay with unique agent abilities. Master your aim and abilities to outplay opponents in 5v5 competitive matches.',
    categories: ['FPS', 'PC'],
    platforms: ['PC'],
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop',
    logoUrl: '/images/games/valorant.webp',
    developer: 'Riot Games',
    publisher: 'Riot Games',
    promoCodes: [
      {
        id: 'val-1',
        code: 'VALORANT2024',
        reward: '500 VP + Player Card',
        rewardValue: 500,
        rewardType: 'Currency',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 75,
      },
      {
        id: 'val-2',
        code: 'RIOTGAMES',
        reward: 'Exclusive Gun Buddy',
        rewardValue: 100,
        rewardType: 'Items',
        isVerified: true,
        addedAt: now,
        successRate: 80,
      },
    ],
    rewards: [
      {
        id: 'val-r1',
        title: 'Free Agent Unlocks',
        description: 'Unlock new agents through contracts as you play',
        type: 'Free',
        value: 'Free agents',
      },
      {
        id: 'val-r2',
        title: 'Prime Gaming Rewards',
        description: 'Link Amazon Prime for exclusive in-game drops',
        type: 'Event',
        value: 'Exclusive skins',
      },
    ],
    affiliateLink: 'https://playvalorant.com',
    websiteUrl: 'https://playvalorant.com',
    popularityScore: 94,
    playerCount: '35M+ monthly players',
    lastUpdated: now,
    faqs: [
      {
        question: 'How do I redeem VALORANT codes?',
        answer: 'Log into your Riot Games account at valorant.riotgames.com, go to your account settings, and enter the code in the "Redeem Code" section.',
      },
      {
        question: 'Can I get free VP in VALORANT?',
        answer: 'VALORANT occasionally offers free VP through special events and Prime Gaming drops. Follow official channels for announcements.',
      },
    ],
  },

  // ============================================
  // League of Legends
  // ============================================
  {
    id: 'league-of-legends',
    name: 'League of Legends',
    slug: 'league-of-legends',
    shortName: 'LoL',
    description: 'League of Legends is a team-based strategy game where two teams of five powerful champions face off to destroy the other team\'s base. Choose from over 160 champions to make epic plays.',
    categories: ['MMORPG', 'PC'],
    platforms: ['PC'],
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop',
    logoUrl: '/images/games/league-of-legends.webp',
    developer: 'Riot Games',
    publisher: 'Riot Games',
    promoCodes: [
      {
        id: 'lol-1',
        code: 'LEAGUEREWARDS',
        reward: '1000 Blue Essence + Chest',
        rewardValue: 500,
        rewardType: 'Currency',
        isVerified: true,
        addedAt: now,
        successRate: 70,
      },
      {
        id: 'lol-2',
        code: 'RIOTGIFTS2024',
        reward: 'Mystery Champion Shard',
        rewardValue: 300,
        rewardType: 'Items',
        expiresAt: twoWeeksFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 65,
      },
    ],
    rewards: [
      {
        id: 'lol-r1',
        title: 'First Win of the Day',
        description: 'Earn bonus XP and Blue Essence with daily first win',
        type: 'Daily',
        value: '400 XP + 50 BE',
      },
      {
        id: 'lol-r2',
        title: 'Prime Gaming Capsules',
        description: 'Get free skins and content with Prime Gaming',
        type: 'Event',
        value: 'Monthly drops',
      },
    ],
    affiliateLink: 'https://www.leagueoflegends.com',
    websiteUrl: 'https://www.leagueoflegends.com',
    popularityScore: 96,
    playerCount: '180M+ monthly players',
    lastUpdated: now,
    faqs: [
      {
        question: 'How do I redeem League of Legends codes?',
        answer: 'Open the League client, click on the Store, then click "Account" in the top right, and select "Redeem Code" to enter your code.',
      },
    ],
  },

  // ============================================
  // Minecraft
  // ============================================
  {
    id: 'minecraft',
    name: 'Minecraft',
    slug: 'minecraft',
    description: 'Minecraft is a sandbox game where players explore, build, and survive in a blocky 3D world. Create anything you can imagine or survive against creatures in this beloved creative platform.',
    categories: ['Simulation', 'PC', 'Console', 'Mobile'],
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile', 'iOS', 'Android'],
    imageUrl: 'https://images.unsplash.com/photo-1587573088697-b4fa06e8c67e?w=600&h=400&fit=crop',
    logoUrl: '/images/games/minecraft.webp',
    developer: 'Mojang Studios',
    publisher: 'Microsoft',
    promoCodes: [
      {
        id: 'mc-1',
        code: 'MINECRAFT2024',
        reward: 'Free Skin Pack',
        rewardValue: 200,
        rewardType: 'Skins',
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
      {
        id: 'mc-2',
        code: 'BEDROCK2024',
        reward: 'Exclusive Character Creator Item',
        rewardValue: 100,
        rewardType: 'Items',
        isVerified: true,
        addedAt: now,
        successRate: 80,
      },
    ],
    rewards: [
      {
        id: 'mc-r1',
        title: 'Xbox Game Pass Perks',
        description: 'Get free content with Xbox Game Pass subscription',
        type: 'Event',
        value: 'Monthly perks',
      },
      {
        id: 'mc-r2',
        title: 'Marketplace Free Items',
        description: 'Download free maps, skins, and textures',
        type: 'Free',
        value: 'Free content',
      },
    ],
    affiliateLink: 'https://www.minecraft.net',
    websiteUrl: 'https://www.minecraft.net',
    popularityScore: 97,
    playerCount: '141M+ monthly players',
    lastUpdated: now,
  },

  // ============================================
  // Apex Legends
  // ============================================
  {
    id: 'apex-legends',
    name: 'Apex Legends',
    slug: 'apex-legends',
    description: 'Apex Legends is a free-to-play battle royale game featuring legendary characters with powerful abilities. Team up with friends and compete to be the last squad standing.',
    categories: ['Battle Royale', 'FPS', 'PC', 'Console'],
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'],
    imageUrl: 'https://images.unsplash.com/photo-1542549237432-a176cb9d5e6e?w=600&h=400&fit=crop',
    logoUrl: '/images/games/apex-legends.webp',
    developer: 'Respawn Entertainment',
    publisher: 'Electronic Arts',
    promoCodes: [
      {
        id: 'apex-1',
        code: 'APEXLEGENDS2024',
        reward: '1000 Apex Coins + Legend Skin',
        rewardValue: 1000,
        rewardType: 'Currency',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 70,
      },
      {
        id: 'apex-2',
        code: 'RESPAWN',
        reward: 'Exclusive Weapon Charm',
        rewardValue: 150,
        rewardType: 'Items',
        isVerified: true,
        addedAt: now,
        successRate: 75,
      },
    ],
    rewards: [
      {
        id: 'apex-r1',
        title: 'Free Battle Pass Tiers',
        description: 'Progress through free tiers for rewards',
        type: 'Free',
        value: 'Free skins and packs',
      },
      {
        id: 'apex-r2',
        title: 'EA Play Rewards',
        description: 'Get exclusive content with EA Play subscription',
        type: 'Event',
        value: 'Monthly rewards',
      },
    ],
    affiliateLink: 'https://www.ea.com/games/apex-legends',
    websiteUrl: 'https://www.ea.com/games/apex-legends',
    popularityScore: 91,
    playerCount: '100M+ players',
    lastUpdated: now,
    faqs: [
      {
        question: 'How do I redeem Apex Legends codes?',
        answer: 'Log into your EA account, go to ea.com/redeem, and enter your code. The rewards will appear in your game the next time you log in.',
      },
    ],
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
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
    logoUrl: '/images/games/mobile-legends.webp',
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
  // Clash of Clans
  // ============================================
  {
    id: 'clash-of-clans',
    name: 'Clash of Clans',
    slug: 'clash-of-clans',
    shortName: 'CoC',
    description: 'Clash of Clans is a strategy game where you build your village, train troops, and battle millions of players online. Join a clan, participate in Clan Wars, and become a legend.',
    categories: ['Simulation', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    imageUrl: 'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=600&h=400&fit=crop',
    logoUrl: '/images/games/clash-of-clans.webp',
    developer: 'Supercell',
    publisher: 'Supercell',
    promoCodes: [
      {
        id: 'coc-1',
        code: 'CLASHGIFT2024',
        reward: '500 Gems + Magic Item',
        rewardValue: 500,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 70,
      },
      {
        id: 'coc-2',
        code: 'SUPERCELL',
        reward: 'Book of Heroes',
        rewardValue: 300,
        rewardType: 'Items',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 65,
      },
    ],
    rewards: [
      {
        id: 'coc-r1',
        title: 'Clan Games Rewards',
        description: 'Participate in monthly Clan Games for magic items',
        type: 'Event',
        value: 'Magic items',
      },
      {
        id: 'coc-r2',
        title: 'Season Challenges',
        description: 'Complete challenges for Gold Pass rewards',
        type: 'Daily',
        value: 'Free tier rewards',
      },
    ],
    affiliateLink: 'https://clashofclans.com',
    websiteUrl: 'https://clashofclans.com',
    popularityScore: 88,
    playerCount: '500M+ downloads',
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
    imageUrl: 'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=600&h=400&fit=crop',
    logoUrl: '/images/games/clash-royale.webp',
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
  // Pokemon GO
  // ============================================
  {
    id: 'pokemon-go',
    name: 'Pokemon GO',
    slug: 'pokemon-go',
    description: 'Pokemon GO is an augmented reality mobile game where you catch Pokemon in the real world. Explore your neighborhood, battle in gyms, and participate in global events.',
    categories: ['Mobile', 'Simulation'],
    platforms: ['Mobile', 'iOS', 'Android'],
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop',
    logoUrl: '/images/games/pokemon-go.webp',
    developer: 'Niantic',
    publisher: 'Niantic',
    promoCodes: [
      {
        id: 'pogo-1',
        code: 'POKEMON2024',
        reward: '20 Poke Balls + 5 Razz Berries',
        rewardValue: 100,
        rewardType: 'Items',
        isVerified: true,
        addedAt: now,
        successRate: 90,
      },
      {
        id: 'pogo-2',
        code: 'COMMUNITYDAY',
        reward: 'Incense + Lucky Egg',
        rewardValue: 150,
        rewardType: 'Items',
        expiresAt: twoWeeksFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
    ],
    rewards: [
      {
        id: 'pogo-r1',
        title: 'Daily Spin',
        description: 'Spin PokeStops daily for items and streak bonuses',
        type: 'Daily',
        value: 'Items and XP',
      },
      {
        id: 'pogo-r2',
        title: 'Community Day Events',
        description: 'Catch featured Pokemon with exclusive moves',
        type: 'Event',
        value: 'Special Pokemon',
      },
    ],
    affiliateLink: 'https://pokemongolive.com',
    websiteUrl: 'https://pokemongolive.com',
    popularityScore: 86,
    playerCount: '150M+ active players',
    lastUpdated: now,
    faqs: [
      {
        question: 'How do I redeem Pokemon GO codes?',
        answer: 'Open the app, tap the Poke Ball menu, go to Shop, scroll down and tap "Promos" to enter your code. iOS users must redeem at rewards.nianticlabs.com.',
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
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
    logoUrl: '/images/games/brawl-stars.webp',
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
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
    logoUrl: '/images/games/afk-arena.webp',
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
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
    logoUrl: '/images/games/state-of-survival.webp',
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
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
    logoUrl: '/images/games/rise-of-kingdoms.webp',
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
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
    logoUrl: '/images/games/summoners-war.webp',
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
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
    logoUrl: '/images/games/coin-master.webp',
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
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
    logoUrl: '/images/games/tower-of-fantasy.webp',
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
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
    logoUrl: '/images/games/diablo-immortal.webp',
    developer: 'Blizzard Entertainment',
    publisher: 'Blizzard Entertainment',
    promoCodes: [
      {
        id: 'di-1',
        code: 'DIABLO2026',
        reward: '100 Eternal Orbs + Legendary Crest',
        rewardValue: 200,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 80,
      },
      {
        id: 'di-2',
        code: 'SANCTUARY',
        reward: '50 Eternal Orbs + Rare Crest x3',
        rewardValue: 100,
        rewardType: 'Gems',
        expiresAt: twoWeeksFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 78,
      },
    ],
    rewards: [
      {
        id: 'di-r1',
        title: 'Daily Login',
        description: 'Log in daily for Hilts and rewards',
        type: 'Daily',
        value: 'Hilts currency',
      },
      {
        id: 'di-r2',
        title: 'Battle Pass Free Track',
        description: 'Earn rewards from the free battle pass track',
        type: 'Free',
        value: 'Legendary gear',
      },
    ],
    affiliateLink: 'https://diabloimmortal.blizzard.com',
    websiteUrl: 'https://diabloimmortal.blizzard.com',
    popularityScore: 76,
    playerCount: '30M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // Last Shelter: Survival
  // ============================================
  {
    id: 'last-shelter-survival',
    name: 'Last Shelter: Survival',
    slug: 'last-shelter-survival',
    shortName: 'Last Shelter',
    description: 'Last Shelter: Survival is a post-apocalyptic strategy game. Build your shelter, train your army, and survive against zombies and other players.',
    categories: ['RPG', 'Simulation', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
    logoUrl: '/images/games/last-shelter.webp',
    developer: 'Long Tech Network',
    publisher: 'Long Tech Network',
    promoCodes: [
      {
        id: 'ls-1',
        code: 'SHELTER2026',
        reward: '500 Diamonds + Speedups',
        rewardValue: 500,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
      {
        id: 'ls-2',
        code: 'LASTSURVIVE',
        reward: '200 Diamonds + Resources',
        rewardValue: 200,
        rewardType: 'Gems',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 82,
      },
    ],
    rewards: [
      {
        id: 'ls-r1',
        title: 'Daily Rewards',
        description: 'Collect daily rewards for diamonds and resources',
        type: 'Daily',
        value: 'Diamonds',
      },
    ],
    affiliateLink: 'https://www.lastsheltergame.com',
    websiteUrl: 'https://www.lastsheltergame.com',
    popularityScore: 75,
    playerCount: '50M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // Gardenscapes
  // ============================================
  {
    id: 'gardenscapes',
    name: 'Gardenscapes',
    slug: 'gardenscapes',
    shortName: 'Gardenscapes',
    description: 'Gardenscapes combines match-3 puzzles with garden restoration gameplay. Solve puzzles to earn stars and restore a beautiful garden with Austin the butler.',
    categories: ['Mobile', 'Simulation'],
    platforms: ['Mobile', 'iOS', 'Android'],
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
    logoUrl: '/images/games/gardenscapes.webp',
    developer: 'Playrix',
    publisher: 'Playrix',
    promoCodes: [
      {
        id: 'gs-1',
        code: 'GARDEN2026',
        reward: '100 Coins + 30 Lives',
        rewardValue: 200,
        rewardType: 'Coins',
        isVerified: true,
        addedAt: now,
        successRate: 88,
      },
      {
        id: 'gs-2',
        code: 'AUSTINGIFT',
        reward: '50 Coins + Boosters',
        rewardValue: 100,
        rewardType: 'Items',
        expiresAt: twoWeeksFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
    ],
    rewards: [
      {
        id: 'gs-r1',
        title: 'Daily Bonus',
        description: 'Collect daily bonus coins and lives',
        type: 'Daily',
        value: 'Coins and lives',
      },
      {
        id: 'gs-r2',
        title: 'Facebook Rewards',
        description: 'Connect to Facebook for extra lives from friends',
        type: 'Free',
        value: 'Free lives',
      },
    ],
    affiliateLink: 'https://www.playrix.com/gardenscapes/',
    websiteUrl: 'https://www.playrix.com/gardenscapes/',
    popularityScore: 84,
    playerCount: '100M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // Lords Mobile
  // ============================================
  {
    id: 'lords-mobile',
    name: 'Lords Mobile',
    slug: 'lords-mobile',
    shortName: 'Lords Mobile',
    description: 'Lords Mobile is a real-time strategy game where you build your kingdom, train heroes, and conquer enemy lands in epic PvP battles.',
    categories: ['RPG', 'Simulation', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android', 'PC'],
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
    logoUrl: '/images/games/lords-mobile.webp',
    developer: 'IGG',
    publisher: 'IGG',
    promoCodes: [
      {
        id: 'lm-1',
        code: 'LORDS2026',
        reward: '500 Gems + Speedups',
        rewardValue: 500,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
      {
        id: 'lm-2',
        code: 'KINGDOM500',
        reward: '200 Gems + Hero Medals',
        rewardValue: 200,
        rewardType: 'Gems',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 82,
      },
    ],
    rewards: [
      {
        id: 'lm-r1',
        title: 'Daily Quests',
        description: 'Complete daily quests for gems and resources',
        type: 'Daily',
        value: 'Gems and items',
      },
      {
        id: 'lm-r2',
        title: 'Guild Rewards',
        description: 'Join a guild for exclusive rewards',
        type: 'Free',
        value: 'Guild gifts',
      },
    ],
    affiliateLink: 'https://lordsmobile.igg.com',
    websiteUrl: 'https://lordsmobile.igg.com',
    popularityScore: 81,
    playerCount: '400M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // Idle Heroes
  // ============================================
  {
    id: 'idle-heroes',
    name: 'Idle Heroes',
    slug: 'idle-heroes',
    shortName: 'Idle Heroes',
    description: 'Idle Heroes is an idle RPG where your heroes fight automatically. Collect over 200 heroes, build strategic teams, and progress even while offline.',
    categories: ['RPG', 'Gacha', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
    logoUrl: '/images/games/idle-heroes.webp',
    developer: 'DH Games',
    publisher: 'DH Games',
    promoCodes: [
      {
        id: 'ih-1',
        code: 'IDLE2026',
        reward: '500 Gems + Hero Scrolls',
        rewardValue: 500,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 88,
      },
      {
        id: 'ih-2',
        code: 'HEROIC',
        reward: '200 Gems + Prophet Orbs',
        rewardValue: 200,
        rewardType: 'Gems',
        expiresAt: twoWeeksFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
    ],
    rewards: [
      {
        id: 'ih-r1',
        title: 'Idle Rewards',
        description: 'Collect rewards generated while offline',
        type: 'Free',
        value: 'Gold and hero XP',
      },
      {
        id: 'ih-r2',
        title: 'Daily Events',
        description: 'Participate in daily events for rewards',
        type: 'Daily',
        value: 'Scrolls and orbs',
      },
    ],
    affiliateLink: 'https://www.idleheroes.com',
    websiteUrl: 'https://www.idleheroes.com',
    popularityScore: 77,
    playerCount: '50M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // World of Tanks Blitz
  // ============================================
  {
    id: 'world-of-tanks-blitz',
    name: 'World of Tanks Blitz',
    slug: 'world-of-tanks-blitz',
    shortName: 'WoT Blitz',
    description: 'World of Tanks Blitz is a mobile tank battle game featuring over 400 tanks from 10 nations. Engage in 7v7 PvP battles in this fast-paced action game.',
    categories: ['FPS', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android', 'PC'],
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
    logoUrl: '/images/games/wot-blitz.webp',
    developer: 'Wargaming',
    publisher: 'Wargaming',
    promoCodes: [
      {
        id: 'wotb-1',
        code: 'BLITZ2026',
        reward: '500 Gold + Premium Time',
        rewardValue: 500,
        rewardType: 'Currency',
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
      {
        id: 'wotb-2',
        code: 'TANKMASTER',
        reward: '200 Gold + Credits',
        rewardValue: 200,
        rewardType: 'Currency',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 80,
      },
    ],
    rewards: [
      {
        id: 'wotb-r1',
        title: 'Daily Missions',
        description: 'Complete daily missions for gold and credits',
        type: 'Daily',
        value: 'Gold and credits',
      },
      {
        id: 'wotb-r2',
        title: 'Battle Pass',
        description: 'Earn rewards through the battle pass',
        type: 'Free',
        value: 'Tanks and gold',
      },
    ],
    affiliateLink: 'https://wotblitz.com',
    websiteUrl: 'https://wotblitz.com',
    popularityScore: 78,
    playerCount: '160M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // Call of Duty: Warzone Mobile
  // ============================================
  {
    id: 'warzone-mobile',
    name: 'Call of Duty: Warzone Mobile',
    slug: 'warzone-mobile',
    shortName: 'Warzone Mobile',
    description: 'Warzone Mobile brings the popular battle royale experience to mobile devices. Drop into Verdansk, loot weapons, and fight to be the last squad standing.',
    categories: ['Battle Royale', 'FPS', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
    logoUrl: '/images/games/warzone-mobile.webp',
    developer: 'Activision',
    publisher: 'Activision',
    promoCodes: [
      {
        id: 'wzm-1',
        code: 'WARZONE2026',
        reward: '500 CP + Operator Skin',
        rewardValue: 500,
        rewardType: 'CP',
        isVerified: true,
        addedAt: now,
        successRate: 82,
      },
      {
        id: 'wzm-2',
        code: 'VERDANSK',
        reward: '200 CP + Weapon Blueprint',
        rewardValue: 200,
        rewardType: 'CP',
        expiresAt: twoWeeksFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 80,
      },
    ],
    rewards: [
      {
        id: 'wzm-r1',
        title: 'Daily Challenges',
        description: 'Complete daily challenges for XP and rewards',
        type: 'Daily',
        value: 'XP and items',
      },
      {
        id: 'wzm-r2',
        title: 'Battle Pass Free Track',
        description: 'Earn free rewards through the battle pass',
        type: 'Free',
        value: 'Skins and blueprints',
      },
    ],
    affiliateLink: 'https://www.callofduty.com/warzonemobile',
    websiteUrl: 'https://www.callofduty.com/warzonemobile',
    popularityScore: 86,
    playerCount: '50M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // Epic Seven
  // ============================================
  {
    id: 'epic-seven',
    name: 'Epic Seven',
    slug: 'epic-seven',
    shortName: 'Epic Seven',
    description: 'Epic Seven is a turn-based RPG with stunning anime-style graphics. Collect heroes, engage in strategic battles, and explore a rich story across the 7th World.',
    categories: ['RPG', 'Gacha', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android', 'PC'],
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
    logoUrl: '/images/games/epic-seven.webp',
    developer: 'Smilegate',
    publisher: 'Super Creative',
    promoCodes: [
      {
        id: 'e7-1',
        code: 'EPIC2026',
        reward: '500 Skystones + Leif x5',
        rewardValue: 500,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 88,
      },
      {
        id: 'e7-2',
        code: 'COVENANT',
        reward: '10 Covenant Bookmarks + Gold',
        rewardValue: 200,
        rewardType: 'Items',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
    ],
    rewards: [
      {
        id: 'e7-r1',
        title: 'Daily Login',
        description: 'Log in daily for skystones and bookmarks',
        type: 'Daily',
        value: 'Skystones',
      },
      {
        id: 'e7-r2',
        title: 'Web Events',
        description: 'Participate in web events for extra rewards',
        type: 'Event',
        value: 'Bookmarks and gold',
      },
    ],
    affiliateLink: 'https://epic7.smilegatemegaport.com',
    websiteUrl: 'https://epic7.smilegatemegaport.com',
    popularityScore: 79,
    playerCount: '30M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // Dragon Ball Legends
  // ============================================
  {
    id: 'dragon-ball-legends',
    name: 'Dragon Ball Legends',
    slug: 'dragon-ball-legends',
    shortName: 'DB Legends',
    description: 'Dragon Ball Legends is an action fighting game featuring characters from the Dragon Ball universe. Engage in real-time PvP battles with card-based combat.',
    categories: ['RPG', 'Gacha', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android'],
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
    logoUrl: '/images/games/db-legends.webp',
    developer: 'Bandai Namco',
    publisher: 'Bandai Namco',
    promoCodes: [
      {
        id: 'dbl-1',
        code: 'LEGENDS2026',
        reward: '500 Chrono Crystals',
        rewardValue: 500,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
      {
        id: 'dbl-2',
        code: 'SAIYAN',
        reward: '100 Chrono Crystals + Energy',
        rewardValue: 100,
        rewardType: 'Gems',
        expiresAt: twoWeeksFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 82,
      },
    ],
    rewards: [
      {
        id: 'dbl-r1',
        title: 'Daily Missions',
        description: 'Complete daily missions for Chrono Crystals',
        type: 'Daily',
        value: 'Chrono Crystals',
      },
      {
        id: 'dbl-r2',
        title: 'Login Bonus',
        description: 'Log in daily for bonus rewards',
        type: 'Daily',
        value: 'Items and crystals',
      },
    ],
    affiliateLink: 'https://legends.dbz.space',
    websiteUrl: 'https://legends.dbz.space',
    popularityScore: 80,
    playerCount: '50M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // Arknights
  // ============================================
  {
    id: 'arknights',
    name: 'Arknights',
    slug: 'arknights',
    shortName: 'Arknights',
    description: 'Arknights is a tower defense RPG set in a dark sci-fi world. Deploy Operators with unique abilities to defend against waves of enemies.',
    categories: ['RPG', 'Gacha', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android', 'PC'],
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
    logoUrl: '/images/games/arknights.webp',
    developer: 'Hypergryph',
    publisher: 'Yostar',
    promoCodes: [
      {
        id: 'ark-1',
        code: 'ARKNIGHTS2026',
        reward: '200 Orundum + LMD',
        rewardValue: 200,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 88,
      },
      {
        id: 'ark-2',
        code: 'RHODES',
        reward: '100 Orundum + Sanity Pots',
        rewardValue: 100,
        rewardType: 'Gems',
        expiresAt: oneMonthFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
    ],
    rewards: [
      {
        id: 'ark-r1',
        title: 'Daily Missions',
        description: 'Complete daily missions for Orundum',
        type: 'Daily',
        value: 'Orundum',
      },
      {
        id: 'ark-r2',
        title: 'Annihilation',
        description: 'Weekly Annihilation mode for Orundum',
        type: 'Event',
        value: '1800 Orundum weekly',
      },
    ],
    affiliateLink: 'https://www.arknights.global',
    websiteUrl: 'https://www.arknights.global',
    popularityScore: 78,
    playerCount: '20M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // Blue Archive
  // ============================================
  {
    id: 'blue-archive',
    name: 'Blue Archive',
    slug: 'blue-archive',
    shortName: 'Blue Archive',
    description: 'Blue Archive is a tactical RPG set in the academy city of Kivotos. Command students with unique abilities in strategic real-time battles.',
    categories: ['RPG', 'Gacha', 'Mobile'],
    platforms: ['Mobile', 'iOS', 'Android', 'PC'],
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
    logoUrl: '/images/games/blue-archive.webp',
    developer: 'NAT Games',
    publisher: 'Nexon',
    promoCodes: [
      {
        id: 'ba-1',
        code: 'BLUEARCHIVE2026',
        reward: '1200 Pyroxene',
        rewardValue: 1200,
        rewardType: 'Gems',
        isVerified: true,
        addedAt: now,
        successRate: 88,
      },
      {
        id: 'ba-2',
        code: 'KIVOTOS',
        reward: '600 Pyroxene + Activity Reports',
        rewardValue: 600,
        rewardType: 'Gems',
        expiresAt: twoWeeksFromNow,
        isVerified: true,
        addedAt: now,
        successRate: 85,
      },
    ],
    rewards: [
      {
        id: 'ba-r1',
        title: 'Daily Missions',
        description: 'Complete daily missions for Pyroxene',
        type: 'Daily',
        value: 'Pyroxene',
      },
      {
        id: 'ba-r2',
        title: 'Maintenance Compensation',
        description: 'Receive compensation after game maintenance',
        type: 'Event',
        value: 'Pyroxene',
      },
    ],
    affiliateLink: 'https://bluearchive.nexon.com',
    websiteUrl: 'https://bluearchive.nexon.com',
    popularityScore: 76,
    playerCount: '15M+ downloads',
    lastUpdated: now,
  },

  // ============================================
  // Zenless Zone Zero
  // ============================================
  {
    id: 'zenless-zone-zero',
    name: 'Zenless Zone Zero',
    slug: 'zenless-zone-zero',
    shortName: 'ZZZ',
    description: 'Zenless Zone Zero is an action RPG from HoYoverse set in a post-apocalyptic urban world. Master fast-paced combat and explore the mysterious Hollows.',
    categories: ['RPG', 'Gacha', 'Mobile', 'PC'],
    platforms: ['PC', 'Mobile', 'iOS', 'Android', 'PlayStation'],
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
    logoUrl: '/images/games/zzz.webp',
    developer: 'miHoYo',
    publisher: 'HoYoverse',
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
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
    logoUrl: '/images/games/wuthering-waves.webp',
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
]

// Export for sitemap generation
export function getGameSlugsForSitemap(): { slug: string; lastUpdated: string }[] {
  return gamesData.map(game => ({
    slug: game.slug,
    lastUpdated: game.lastUpdated,
  }))
}
