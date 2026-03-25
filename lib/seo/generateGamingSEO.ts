/**
 * Gaming SEO Content Generator
 * Generates unique, keyword-optimized content for gaming promo code pages
 * Each page gets a 120-200 word intro with semantic keywords
 */

import type { Game, PromoCode } from "@/lib/gaming-data"

// ============================================
// TYPES
// ============================================

export interface GamingSEOContent {
  title: string
  metaDescription: string
  h1: string
  introContent: string
  keywords: string[]
}

// ============================================
// SEMANTIC KEYWORD MAPS
// ============================================

const gameTypeSemantics: Record<string, {
  adjectives: string[]
  playerTypes: string[]
  benefits: string[]
  rewardTypes: string[]
}> = {
  'RPG': {
    adjectives: ['immersive', 'epic', 'character-driven', 'strategic'],
    playerTypes: ['RPG fans', 'story lovers', 'character collectors', 'strategy gamers'],
    benefits: ['level up faster', 'unlock characters', 'boost progression', 'enhance gameplay'],
    rewardTypes: ['experience boosts', 'rare characters', 'premium currency', 'exclusive items'],
  },
  'Gacha': {
    adjectives: ['exciting', 'collectible', 'free-to-play', 'generous'],
    playerTypes: ['collectors', 'gacha enthusiasts', 'F2P players', 'banner hunters'],
    benefits: ['free pulls', 'premium currency', 'guaranteed characters', 'banner savings'],
    rewardTypes: ['primogems', 'summon currency', 'premium pulls', 'limited characters'],
  },
  'Battle Royale': {
    adjectives: ['competitive', 'action-packed', 'fast-paced', 'intense'],
    playerTypes: ['competitive players', 'battle royale fans', 'squad players', 'solo warriors'],
    benefits: ['cosmetic upgrades', 'battle pass progress', 'exclusive skins', 'emotes'],
    rewardTypes: ['V-Bucks', 'skins', 'emotes', 'battle pass tiers'],
  },
  'FPS': {
    adjectives: ['tactical', 'skill-based', 'competitive', 'action-oriented'],
    playerTypes: ['FPS enthusiasts', 'competitive shooters', 'team players', 'ranked grinders'],
    benefits: ['weapon skins', 'operator unlocks', 'battle pass rewards', 'XP boosts'],
    rewardTypes: ['weapon camos', 'operator skins', 'calling cards', 'emblems'],
  },
  'Mobile': {
    adjectives: ['accessible', 'on-the-go', 'casual-friendly', 'addictive'],
    playerTypes: ['mobile gamers', 'casual players', 'commuters', 'quick session players'],
    benefits: ['daily rewards', 'progression boosts', 'premium currency', 'stamina refills'],
    rewardTypes: ['gems', 'coins', 'energy', 'special items'],
  },
  'MMORPG': {
    adjectives: ['massive', 'social', 'persistent', 'ever-evolving'],
    playerTypes: ['MMO veterans', 'guild players', 'solo adventurers', 'raid enthusiasts'],
    benefits: ['subscription savings', 'expansion access', 'mount unlocks', 'cosmetics'],
    rewardTypes: ['premium time', 'mounts', 'pets', 'transmog items'],
  },
  'Simulation': {
    adjectives: ['creative', 'immersive', 'endless', 'customizable'],
    playerTypes: ['builders', 'creators', 'sandbox lovers', 'world designers'],
    benefits: ['building resources', 'customization items', 'premium currency', 'expansions'],
    rewardTypes: ['currency', 'items', 'skins', 'building materials'],
  },
}

// ============================================
// TITLE GENERATION (50-60 chars)
// ============================================

export function generateGamingTitleTag(game: Game): string {
  const year = new Date().getFullYear()
  const codeCount = game.promoCodes.length
  
  const templates = [
    `${game.name} Codes ${year} - ${codeCount}+ Working Codes`,
    `${game.name} Promo Codes & Free Rewards ${year}`,
    `${game.name} Redeem Codes - ${codeCount} Active Codes`,
    `Best ${game.name} Codes ${year} | Free Rewards`,
  ]
  
  // Pick template that fits 50-60 char limit
  for (const template of templates) {
    if (template.length <= 60 && template.length >= 45) {
      return template
    }
  }
  
  return templates[0].slice(0, 60)
}

// ============================================
// META DESCRIPTION (150-160 chars)
// ============================================

export function generateGamingMetaDescription(game: Game): string {
  const year = new Date().getFullYear()
  const codeCount = game.promoCodes.length
  const category = game.categories[0] || 'game'
  const semantics = gameTypeSemantics[category] || gameTypeSemantics['Mobile']
  
  const templates = [
    `Get ${codeCount}+ working ${game.name} promo codes for ${year}. Redeem codes for ${semantics.rewardTypes.slice(0, 2).join(', ')} and more. Updated daily with verified codes.`,
    `Find all active ${game.name} codes and free rewards. ${codeCount} verified codes for ${semantics.rewardTypes[0]}, ${semantics.rewardTypes[1]}, and exclusive items. Updated ${year}.`,
    `${game.name} promo codes ${year}: ${codeCount}+ working codes for free ${semantics.rewardTypes[0]} and rewards. All codes verified and tested daily.`,
  ]
  
  // Pick template that fits 150-160 char limit
  for (const template of templates) {
    if (template.length <= 160 && template.length >= 140) {
      return template
    }
  }
  
  return templates[0].slice(0, 160)
}

// ============================================
// SEO INTRO CONTENT (120-200 words)
// ============================================

export function generateGamingIntroContent(game: Game): string {
  const year = new Date().getFullYear()
  const category = game.categories[0] || 'Mobile'
  const semantics = gameTypeSemantics[category] || gameTypeSemantics['Mobile']
  const codeCount = game.promoCodes.length
  
  const templates = [
    // Template 1: Value-focused
    () => `Looking for working ${game.name} promo codes? You've come to the right place. Our team verifies every code daily to ensure you get ${semantics.adjectives[0]} rewards without wasting time on expired codes.

${game.name} is a ${semantics.adjectives[1]} ${category.toLowerCase()} experience loved by millions of ${semantics.playerTypes[0]}. With our curated list of ${codeCount}+ active codes, you can ${semantics.benefits[0]} and claim ${semantics.rewardTypes[0]}, ${semantics.rewardTypes[1]}, and more—all for free.

Whether you're a new player just starting out or a veteran looking for the latest rewards, our ${year} code list has you covered. We update this page multiple times per day, especially during special events and version updates when new codes drop.

Bookmark this page and check back regularly to never miss out on free ${game.name} rewards.`,

    // Template 2: Discovery-focused
    () => `Discover the best ${game.name} promo codes for ${year}. Our database of ${codeCount}+ verified codes helps ${semantics.playerTypes[1]} and ${semantics.playerTypes[2]} unlock ${semantics.adjectives[0]} rewards without spending real money.

${game.name} regularly releases new redemption codes through social media, livestreams, and special events. Keeping track of them all can be challenging—that's where we come in. Every code on this page is tested and confirmed working before being added to our list.

From ${semantics.rewardTypes[0]} to ${semantics.rewardTypes[2]}, these codes offer genuine value for ${semantics.playerTypes[0]}. New players especially benefit from our starter code recommendations that help ${semantics.benefits[1]} from day one.

Stay ahead of the game by bookmarking this page. We're dedicated to bringing you the freshest ${game.name} codes as soon as they're released.`,

    // Template 3: Comparison-focused
    () => `Finding legit ${game.name} promo codes used to mean scouring forums and social media. Not anymore. SaveSmart aggregates all working ${game.name} codes in one convenient location, verified and updated for ${year}.

Our ${codeCount}+ active codes help ${semantics.playerTypes[0]} access ${semantics.adjectives[2]} rewards including ${semantics.rewardTypes.slice(0, 3).join(', ')}. Each code is manually tested to confirm it works, so you can ${semantics.benefits[0]} with confidence.

${game.name}'s ${semantics.adjectives[1]} gameplay has attracted ${game.playerCount || 'millions of players'} worldwide. Whether you prefer ${category.toLowerCase()} action or the game's unique mechanics, free codes enhance your experience without impacting your wallet.

We monitor official ${game.name} channels, community posts, and partner promotions daily. When new codes drop, they appear here first—guaranteed working or we remove them.`,
  ]
  
  // Select template based on game ID hash for consistency
  const templateIndex = game.id.charCodeAt(0) % templates.length
  return templates[templateIndex]()
}

// ============================================
// KEYWORD GENERATION
// ============================================

export function generateGamingKeywords(game: Game): string[] {
  const year = new Date().getFullYear()
  const baseKeywords = [
    `${game.name} codes`,
    `${game.name} promo codes`,
    `${game.name} promo codes ${year}`,
    `${game.name} redeem codes`,
    `${game.name} codes ${year}`,
    `${game.name} free codes`,
    `${game.name} codes today`,
    `${game.name} working codes`,
  ]
  
  // Add category-specific keywords
  game.categories.forEach(category => {
    baseKeywords.push(`${category.toLowerCase()} game codes`)
  })
  
  // Add reward-type keywords
  game.promoCodes.forEach(code => {
    if (code.rewardType && !baseKeywords.includes(`${game.name} ${code.rewardType.toLowerCase()}`)) {
      baseKeywords.push(`${game.name} free ${code.rewardType.toLowerCase()}`)
    }
  })
  
  return [...new Set(baseKeywords)].slice(0, 15)
}

// ============================================
// COMPLETE SEO CONTENT GENERATOR
// ============================================

export function generateGameSEOContent(game: Game): GamingSEOContent {
  return {
    title: generateGamingTitleTag(game),
    metaDescription: generateGamingMetaDescription(game),
    h1: `${game.name} Promo Codes & Free Rewards`,
    introContent: generateGamingIntroContent(game),
    keywords: generateGamingKeywords(game),
  }
}

// ============================================
// PAGE-SPECIFIC SEO GENERATORS
// ============================================

export function generateCodesPageSEO(game: Game): GamingSEOContent {
  const year = new Date().getFullYear()
  const codeCount = game.promoCodes.length
  
  return {
    title: `All ${game.name} Promo Codes ${year} - Complete List`,
    metaDescription: `Complete list of all ${game.name} promo codes for ${year}. ${codeCount} verified working codes with rewards, expiration dates, and redemption instructions.`,
    h1: `All ${game.name} Promo Codes`,
    introContent: generateGamingIntroContent(game),
    keywords: generateGamingKeywords(game),
  }
}

export function generateRewardsPageSEO(game: Game): GamingSEOContent {
  const year = new Date().getFullYear()
  
  return {
    title: `${game.name} Free Rewards & Daily Bonuses ${year}`,
    metaDescription: `Get free ${game.name} rewards including daily login bonuses, new player perks, and event rewards. ${game.rewards.length} ways to earn free items.`,
    h1: `${game.name} Free Rewards & Bonuses`,
    introContent: generateGamingIntroContent(game),
    keywords: [
      ...generateGamingKeywords(game),
      `${game.name} free rewards`,
      `${game.name} daily rewards`,
      `${game.name} daily login`,
    ],
  }
}
