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

export function getGameBySlug(slug: string): Game | undefined {
  return gamesData.find(game => game.slug === slug)
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
]

// Export for sitemap generation
export function getGameSlugsForSitemap(): { slug: string; lastUpdated: string }[] {
  return gamesData.map(game => ({
    slug: game.slug,
    lastUpdated: game.lastUpdated,
  }))
}
