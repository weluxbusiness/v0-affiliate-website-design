/**
 * Guide content for top games - SEO authority building
 * Each game has guide, tips, and leveling content
 */

export interface GuideSection {
  title: string
  content: string
  tips?: string[]
}

export interface GameGuideContent {
  guide: {
    title: string
    description: string
    heroSubtitle: string
    sections: GuideSection[]
  }
  tips: {
    title: string
    description: string
    heroSubtitle: string
    sections: GuideSection[]
  }
  leveling: {
    title: string
    description: string
    heroSubtitle: string
    sections: GuideSection[]
  }
}

export const guideContent: Record<string, GameGuideContent> = {
  'raid-shadow-legends': {
    guide: {
      title: "RAID Shadow Legends Beginner Guide 2026",
      description: "Complete beginner's guide to RAID Shadow Legends in 2026. Learn champion basics, team building, and how to progress efficiently from day one.",
      heroSubtitle: "Everything you need to know to start your journey in RAID Shadow Legends",
      sections: [
        {
          title: "Understanding Champions",
          content: "Champions are the core of RAID. Each champion has a faction, affinity (Magic, Spirit, Force, Void), rarity (Common to Legendary), and unique skills. Focus on building a balanced team with different roles.",
          tips: [
            "Keep all Legendary and Epic champions - never use them as food",
            "Check champion reviews before investing resources",
            "Affinity advantage deals 20% more damage"
          ]
        },
        {
          title: "Early Game Focus",
          content: "Your first priority should be completing the Campaign on Normal difficulty. This gives you experience, silver, and gear. Farm Stage 12-3 for the best XP efficiency once unlocked.",
          tips: [
            "Complete daily quests every day for free resources",
            "Join a clan as soon as possible for Clan Boss rewards",
            "Save your shards for 2x events"
          ]
        },
        {
          title: "Building Your First Team",
          content: "Focus on one champion at a time. Your starter champion (Kael, Athel, Elhain, or Galek) should be your first 6-star. They will carry you through early and mid-game content.",
          tips: [
            "Kael is considered the best starter for Clan Boss",
            "Get Warmaster/Giant Slayer mastery ASAP",
            "Farm lifesteal gear from Campaign"
          ]
        },
        {
          title: "Resource Management",
          content: "Energy, Silver, and Gems are your main resources. Spend gems on masteries for your first champion, then on energy refills during events. Never spend gems on shards.",
          tips: [
            "Redeem promo codes for free resources",
            "Complete missions for massive rewards",
            "Farm during fusion events for extra value"
          ]
        }
      ]
    },
    tips: {
      title: "RAID Shadow Legends Pro Tips 2026",
      description: "Advanced tips and strategies for RAID Shadow Legends players. Optimize your gameplay, improve Clan Boss damage, and dominate Arena with these expert tips.",
      heroSubtitle: "Level up your RAID gameplay with these proven strategies",
      sections: [
        {
          title: "Clan Boss Optimization",
          content: "Clan Boss is your main source of shards and books. Speed tune your team to ensure all champions take turns in the correct order. Use a speed calculator to hit specific speed breakpoints.",
          tips: [
            "4:3 speed ratio means 4 turns per 3 boss turns",
            "Counter-attack teams are highly effective",
            "Poison and HP Burn scale with boss HP"
          ]
        },
        {
          title: "Arena Strategy",
          content: "Arena is about turn order and team composition. Build a speed lead, crowd control, defense down champion, and nuker. Win the speed race or build a go-second team.",
          tips: [
            "Arbiter is the best free speed lead",
            "Immunity sets counter freeze teams",
            "Study opponents before attacking"
          ]
        },
        {
          title: "Dungeon Farming",
          content: "Each dungeon drops specific gear sets. Dragon for lifesteal and speed, Spider for accessories, Ice Golem for resist. Focus on Dragon first for the best value.",
          tips: [
            "Stage 20+ has the best drop rates",
            "AoE damage is key for wave clearing",
            "Bring turn meter control for bosses"
          ]
        },
        {
          title: "Fusion Events",
          content: "Fusions give guaranteed Legendary champions. Plan ahead by stocking resources. Save mystery shards, potions, and brews before fusion events start.",
          tips: [
            "Fragment fusions are more beginner-friendly",
            "Always complete the summon rush portion first",
            "Track fusion progress with community tools"
          ]
        }
      ]
    },
    leveling: {
      title: "RAID Shadow Legends Leveling Guide 2026",
      description: "Fast leveling guide for RAID Shadow Legends. Learn the most efficient ways to level champions, farm XP, and progress through the game quickly.",
      heroSubtitle: "Level your champions faster with these proven methods",
      sections: [
        {
          title: "Campaign Farming",
          content: "Stage 12-3 (Brutal) is the most efficient for XP. Use a single farmer to carry 3 food champions. Your starter champion with lifesteal gear can solo this stage.",
          tips: [
            "Auto-battle 12-3 overnight for massive XP",
            "Use 2x XP boosts during dedicated farming sessions",
            "Sell unwanted gear for silver"
          ]
        },
        {
          title: "Champion Ranking Up",
          content: "To rank up from 5-star to 6-star, you need five 5-star food champions. Use uncommons to rank up rares, then rares to rank up epics dedicated as food.",
          tips: [
            "Never use good champions as food",
            "Farm during Champion Training events",
            "Keep copies for faction guardians"
          ]
        },
        {
          title: "Masteries",
          content: "Masteries are essential for champion performance. Your first champion should get full masteries from Minotaur. After that, use gems or scrolls for key champions.",
          tips: [
            "800 gems unlocks all masteries instantly",
            "Warmaster/Giant Slayer are best for Clan Boss",
            "Offense tree is usually most important"
          ]
        },
        {
          title: "Great Hall",
          content: "Great Hall upgrades are permanent stat bonuses. Focus on ACC and CD first. Farm Gold Arena medals consistently, even if just for daily bonus.",
          tips: [
            "Accuracy is crucial for dungeon champions",
            "Defense helps with survivability",
            "Use free Arena refreshes every hour"
          ]
        }
      ]
    }
  },
  'monopoly-go': {
    guide: {
      title: "Monopoly GO Beginner Guide 2026",
      description: "Complete beginner's guide to Monopoly GO in 2026. Learn how to maximize dice rolls, build your board, and progress through events efficiently.",
      heroSubtitle: "Start your Monopoly GO journey with these essential strategies",
      sections: [
        {
          title: "Understanding the Basics",
          content: "Monopoly GO is a mobile board game where you roll dice to move around the board, collect rent, and complete sticker albums. Your goal is to build your city and progress through boards.",
          tips: [
            "Save dice for events with good rewards",
            "Always claim free dice from links daily",
            "Join a trading group for stickers"
          ]
        },
        {
          title: "Dice Management",
          content: "Dice are your main resource. You get free dice over time, from daily rewards, and from promo codes. Don't waste dice on low multipliers when events aren't active.",
          tips: [
            "Use high multipliers during Partner events",
            "Claim all daily freebies and rewards",
            "Redeem promo codes for free dice"
          ]
        },
        {
          title: "Sticker Trading",
          content: "Completing sticker albums gives huge rewards. Trade duplicate stickers with friends or community groups. Never send gold stickers unless someone has a gold to return.",
          tips: [
            "Join Facebook trading groups",
            "Keep one gold sticker as backup",
            "Complete albums before they expire"
          ]
        },
        {
          title: "Events & Tournaments",
          content: "Events are the best time to use your dice. Partner events, tournaments, and special events offer better rewards. Check the event calendar and plan your dice spending.",
          tips: [
            "Save dice for Partner events",
            "Tournaments give great milestone rewards",
            "High roller events need lots of dice"
          ]
        }
      ]
    },
    tips: {
      title: "Monopoly GO Pro Tips 2026",
      description: "Advanced Monopoly GO strategies for maximizing rewards. Learn optimal dice management, event strategies, and sticker trading techniques.",
      heroSubtitle: "Master Monopoly GO with these expert strategies",
      sections: [
        {
          title: "Event Optimization",
          content: "Not all events are equal. Partner events and special tournaments give the best value per dice roll. Save your dice stack for these events and use high multipliers.",
          tips: [
            "Partner events have the best ROI",
            "Check reward milestones before playing",
            "Don't waste dice on Peg-E events"
          ]
        },
        {
          title: "Board Strategy",
          content: "Landing on certain tiles triggers different effects. Railroads give good rewards, utilities boost shields. Try to land on high-value properties during events.",
          tips: [
            "Shield up before sleeping",
            "Attack during Heist events for bonuses",
            "Landmarks give permanent bonuses"
          ]
        },
        {
          title: "Multiplier Usage",
          content: "Higher multipliers use more dice but give better rewards per roll. Use high multipliers during events with good rewards, low multipliers when just progressing.",
          tips: [
            "x100+ multipliers for Partner events",
            "x1-x5 for daily playing",
            "Match multiplier to your dice stack"
          ]
        },
        {
          title: "Community Benefits",
          content: "Join active squads and trading communities. Squad events give bonus rewards, and trading helps complete albums faster. Help others and they'll help you.",
          tips: [
            "Active squads boost tournament rewards",
            "Trade fair - don't scam",
            "Share promo codes with friends"
          ]
        }
      ]
    },
    leveling: {
      title: "Monopoly GO Leveling Guide 2026",
      description: "Fast progression guide for Monopoly GO. Learn how to quickly advance through boards, complete albums, and maximize your rewards efficiently.",
      heroSubtitle: "Progress through Monopoly GO faster with these methods",
      sections: [
        {
          title: "Board Progression",
          content: "Focus on completing board objectives to unlock new boards. Each new board has better rewards and more features. Don't spend too long farming on low boards.",
          tips: [
            "Complete landmarks for permanent bonuses",
            "Higher boards = better event rewards",
            "Don't over-invest in early boards"
          ]
        },
        {
          title: "Net Worth Building",
          content: "Net worth determines your leaderboard position and some rewards. Build properties consistently and upgrade landmarks. Higher net worth = better matchmaking.",
          tips: [
            "Upgrade all properties before moving boards",
            "Landmarks give the most net worth",
            "Balance upgrading with dice saving"
          ]
        },
        {
          title: "Album Completion",
          content: "Completing albums gives massive rewards including dice and net worth. Prioritize albums about to expire and trade actively to complete sets.",
          tips: [
            "Gold stickers are the bottleneck",
            "Trade 2-for-1 if needed to complete",
            "Check album expiry dates"
          ]
        },
        {
          title: "Daily Routine",
          content: "Establish a daily routine to maximize free resources. Claim daily dice, complete quests, check promo codes, and participate in active events.",
          tips: [
            "Set reminders for free dice",
            "Complete daily quests for bonus rewards",
            "Check social media for free codes"
          ]
        }
      ]
    }
  },
  'brawl-stars': {
    guide: {
      title: "Brawl Stars Beginner Guide 2026",
      description: "Complete beginner's guide to Brawl Stars in 2026. Learn brawler basics, game modes, and strategies to climb trophies and unlock new content.",
      heroSubtitle: "Master the basics of Brawl Stars and start winning matches",
      sections: [
        {
          title: "Understanding Brawlers",
          content: "Brawl Stars has over 80 brawlers across different rarities and classes. Each brawler has unique attacks, supers, gadgets, and star powers. Start by mastering a few brawlers well.",
          tips: [
            "Shelly is great for beginners",
            "Each brawler excels in certain modes",
            "Unlock gadgets and star powers ASAP"
          ]
        },
        {
          title: "Game Modes",
          content: "Different game modes require different strategies. Gem Grab is about control, Brawl Ball about teamwork, Showdown about survival. Learn the meta for each mode.",
          tips: [
            "Play modes your brawler is strong in",
            "Watch pro players for strategies",
            "Team up with friends for better coordination"
          ]
        },
        {
          title: "Trophy Pushing",
          content: "Trophies are earned by winning matches. Push trophies to unlock new brawlers and features. Focus on a small pool of brawlers at first to climb efficiently.",
          tips: [
            "Don't tilt - take breaks after losses",
            "Push during Power League seasons",
            "Higher trophies = harder matches"
          ]
        },
        {
          title: "Resource Management",
          content: "Coins, gems, and power points are your main resources. Use gems for Brawl Pass if you play regularly. Save coins for upgrading your main brawlers.",
          tips: [
            "Brawl Pass is the best gem value",
            "Upgrade brawlers evenly at first",
            "Redeem promo codes for free gems"
          ]
        }
      ]
    },
    tips: {
      title: "Brawl Stars Pro Tips 2026",
      description: "Advanced Brawl Stars tips for competitive players. Master positioning, teamwork, and brawler synergies to dominate in ranked and Power League.",
      heroSubtitle: "Take your Brawl Stars gameplay to the next level",
      sections: [
        {
          title: "Map Control",
          content: "Controlling the map wins games. Use walls for cover, bushes for ambushes, and hold key positions. Different maps favor different brawlers - learn the meta for each.",
          tips: [
            "Check bushes before entering",
            "Use walls to block enemy attacks",
            "Control the middle in Gem Grab"
          ]
        },
        {
          title: "Team Composition",
          content: "Good team comps have damage, tank, and support. Don't triple stack the same role. Counter-pick in Power League when you can see enemy picks.",
          tips: [
            "Every team needs a gem carrier",
            "Tanks initiate fights",
            "Supports keep the team alive"
          ]
        },
        {
          title: "Super Management",
          content: "Supers can turn fights. Don't waste them - save for key moments. Cycle supers quickly on some brawlers, hold them for clutch plays on others.",
          tips: [
            "Auto-aim supers in emergencies only",
            "Chain supers with teammates",
            "Some supers charge faster from damage"
          ]
        },
        {
          title: "Gadget Timing",
          content: "Gadgets have limited uses per match. Use them at the right moment - a well-timed gadget can win the game. Learn the cooldowns and plan usage.",
          tips: [
            "Save gadgets for clutch plays",
            "Some gadgets are better early",
            "Counter enemy gadgets with positioning"
          ]
        }
      ]
    },
    leveling: {
      title: "Brawl Stars Leveling Guide 2026",
      description: "Fast progression guide for Brawl Stars. Learn how to unlock brawlers quickly, max out power levels, and climb trophies efficiently.",
      heroSubtitle: "Progress through Brawl Stars faster with these strategies",
      sections: [
        {
          title: "Unlocking Brawlers",
          content: "New brawlers come from boxes, Brawl Pass, and special offers. Complete daily and season quests to maximize box income. Brawl Pass guarantees new brawlers.",
          tips: [
            "Complete all quests for max boxes",
            "Brawl Pass gives the most brawlers",
            "Save boxes for new brawler releases"
          ]
        },
        {
          title: "Power Level Progression",
          content: "Focus on getting a few brawlers to power 9+ before spreading resources thin. Power 9 unlocks star powers, power 10+ unlocks gears. Prioritize your mains.",
          tips: [
            "Don't spread coins too thin",
            "Power 9 is the key breakpoint",
            "Gears are expensive - choose wisely"
          ]
        },
        {
          title: "Trophy Climbing",
          content: "Push trophies with your strongest brawlers first. Play the modes they excel in and team up with friends. Don't push all brawlers equally - focus on mains.",
          tips: [
            "Push during new season starts",
            "Play your best modes",
            "Take breaks to avoid tilting"
          ]
        },
        {
          title: "Club Activities",
          content: "Join an active club for Club League rewards. Higher club league tiers give more coins and star points. Participate in all club activities.",
          tips: [
            "Use all Club League tickets",
            "Coordinate with clubmates",
            "Higher leagues = better rewards"
          ]
        }
      ]
    }
  },
  'afk-arena': {
    guide: {
      title: "AFK Arena Beginner Guide 2026",
      description: "Complete beginner's guide to AFK Arena in 2026. Learn hero basics, team composition, and idle progression strategies to advance efficiently.",
      heroSubtitle: "Start your AFK Arena adventure with these essential tips",
      sections: [
        {
          title: "Understanding Heroes",
          content: "Heroes in AFK Arena belong to different factions with unique synergies. Lightbearers, Maulers, Wilders, and Graveborn counter each other in a rock-paper-scissors fashion.",
          tips: [
            "Build heroes from the same faction early",
            "Celestials and Hypogeans are neutral",
            "Check tier lists for best heroes"
          ]
        },
        {
          title: "Ascending Heroes",
          content: "Ascension increases hero power significantly. Focus on ascending one hero at a time. Never use ascended-tier heroes as fodder - use rare heroes for food.",
          tips: [
            "Elite+ is the first major breakpoint",
            "Legendary heroes need same faction food",
            "Mythic unlocks signature items"
          ]
        },
        {
          title: "Team Building",
          content: "Build balanced teams with tanks, damage dealers, and supports. Faction bonuses give extra stats. Use the Resonating Crystal to level all heroes equally.",
          tips: [
            "5 of same faction = 25% stat boost",
            "Front line needs tanks",
            "Position matters greatly"
          ]
        },
        {
          title: "Idle Progression",
          content: "AFK Arena rewards you while offline. Push as far as you can in campaign, then let rewards accumulate. Check back periodically to collect resources and push further.",
          tips: [
            "Fast rewards speeds up idle gains",
            "Bounty board gives daily resources",
            "Redeem promo codes for free diamonds"
          ]
        }
      ]
    },
    tips: {
      title: "AFK Arena Pro Tips 2026",
      description: "Advanced AFK Arena strategies for mid-game and end-game players. Optimize hero investment, master game modes, and maximize daily efficiency.",
      heroSubtitle: "Level up your AFK Arena gameplay with expert strategies",
      sections: [
        {
          title: "Hero Investment Priority",
          content: "Not all heroes are equal investments. Focus on meta heroes that work in multiple game modes. Check community tier lists and guides before investing resources.",
          tips: [
            "Alna and Lucretia are top Celepogeans",
            "Rosaline enhances carry heroes",
            "Build counters for specific stages"
          ]
        },
        {
          title: "Multi-Stage Battles",
          content: "Late campaign requires multiple teams. Build diverse heroes across factions. Dimensional heroes are flexible and work with any faction.",
          tips: [
            "5 teams needed for late campaign",
            "Dimensionals don't need faction food",
            "Swap heroes between stages"
          ]
        },
        {
          title: "Signature Items & Furniture",
          content: "Signature items and furniture greatly boost heroes. Prioritize +30 SI on carry heroes. 9/9 furniture on key support heroes changes how they function.",
          tips: [
            "+20 SI is the first breakpoint",
            "+30 SI enables some heroes",
            "3/9 furniture often enough for supports"
          ]
        },
        {
          title: "Resource Optimization",
          content: "Be efficient with resources. Don't waste gold emblems on all heroes - save for key +30s. Join events and claim all rewards. Never miss dailies.",
          tips: [
            "Gold emblems are precious - don't waste",
            "Red furniture is rare - plan usage",
            "Events give massive value"
          ]
        }
      ]
    },
    leveling: {
      title: "AFK Arena Leveling Guide 2026",
      description: "Fast progression guide for AFK Arena. Learn efficient leveling strategies, resource management, and how to push campaign stages quickly.",
      heroSubtitle: "Progress through AFK Arena faster with proven methods",
      sections: [
        {
          title: "Resonating Crystal",
          content: "The Resonating Crystal lets you level all heroes based on your top 5. Focus on getting 5 heroes to level cap, then add everyone else to crystal slots.",
          tips: [
            "Buy crystal slots with diamonds",
            "Level cap increases with ascension",
            "All heroes benefit from top 5 levels"
          ]
        },
        {
          title: "Campaign Pushing",
          content: "Campaign progression unlocks features and increases idle rewards. Push as far as possible, then farm for a few days. Use mercenaries for hard stages.",
          tips: [
            "Borrow heroes for tough stages",
            "Retry stages with different formations",
            "Higher campaign = more AFK rewards"
          ]
        },
        {
          title: "King's Tower",
          content: "King's Tower and faction towers give great rewards. Push them alongside campaign. Faction towers need built rosters in each faction.",
          tips: [
            "Main tower gives hero essence",
            "Faction towers give faction emblems",
            "Floor rewards are significant"
          ]
        },
        {
          title: "Daily Efficiency",
          content: "Complete all daily quests and activities. Collect idle rewards regularly. Participate in guild activities and events for bonus resources.",
          tips: [
            "Never miss bounty board",
            "Guild hunt daily for coins",
            "Fast rewards twice daily"
          ]
        }
      ]
    }
  },
  'roblox': {
    guide: {
      title: "Roblox Beginner Guide 2026",
      description: "Complete beginner's guide to Roblox in 2026. Learn platform basics, popular games, safety settings, and how to make the most of your Roblox experience.",
      heroSubtitle: "Get started with Roblox and explore millions of experiences",
      sections: [
        {
          title: "Understanding Roblox",
          content: "Roblox is a platform with millions of user-created games called experiences. Each game has its own mechanics, currency, and progression. Explore different genres to find what you enjoy.",
          tips: [
            "Try popular games first",
            "Check game ratings and reviews",
            "Join games with friends for more fun"
          ]
        },
        {
          title: "Avatar Customization",
          content: "Your avatar represents you across all Roblox games. Customize with free items or purchase accessories with Robux. Many games give free avatar items as rewards.",
          tips: [
            "Claim free items from events",
            "Promo codes give free accessories",
            "Avatar shop has limited-time items"
          ]
        },
        {
          title: "In-Game Currencies",
          content: "Most Roblox games have their own currencies. Some can be earned for free by playing, others require Robux. Learn the economy of games you play regularly.",
          tips: [
            "Redeem codes for free in-game items",
            "Daily rewards give free currency",
            "Trading can help you progress"
          ]
        },
        {
          title: "Safety & Privacy",
          content: "Roblox has safety features for all ages. Enable account restrictions, manage chat settings, and never share personal information. Report inappropriate behavior.",
          tips: [
            "Enable 2-step verification",
            "Don't share account details",
            "Use age-appropriate settings"
          ]
        }
      ]
    },
    tips: {
      title: "Roblox Pro Tips 2026",
      description: "Advanced Roblox tips for experienced players. Master popular games, earn Robux efficiently, and become a better player across all experiences.",
      heroSubtitle: "Level up your Roblox gameplay with these expert tips",
      sections: [
        {
          title: "Popular Games Mastery",
          content: "Focus on mastering a few popular games. Games like Blox Fruits, Pet Simulator X, and Adopt Me have deep mechanics. Learn the meta and efficient grinding strategies.",
          tips: [
            "Watch YouTubers for game tips",
            "Join game-specific Discord servers",
            "Redeem codes for free boosts"
          ]
        },
        {
          title: "Trading Strategies",
          content: "Trading is a big part of many Roblox games. Learn item values, avoid scams, and trade up gradually. Use trusted trading communities and value lists.",
          tips: [
            "Never trade outside the game",
            "Check values before trading",
            "Don't fall for too-good-to-be-true offers"
          ]
        },
        {
          title: "Earning Robux",
          content: "Robux is the premium currency. You can buy it, earn from Premium payouts, or create and sell items. Group games can generate Robux revenue if you're a creator.",
          tips: [
            "Premium members get monthly Robux",
            "Create UGC items to earn",
            "Game passes give creator revenue"
          ]
        },
        {
          title: "Finding Hidden Gems",
          content: "Beyond popular games are amazing lesser-known experiences. Explore different genres, try games from smaller creators, and discover unique experiences.",
          tips: [
            "Sort by 'Top Rated' not just popular",
            "Try recommendation algorithms",
            "Join community groups for suggestions"
          ]
        }
      ]
    },
    leveling: {
      title: "Roblox Leveling Guide 2026",
      description: "Fast progression guide for popular Roblox games. Learn efficient grinding strategies, XP optimization, and how to level up quickly in top experiences.",
      heroSubtitle: "Progress faster in your favorite Roblox games",
      sections: [
        {
          title: "Blox Fruits Progression",
          content: "In Blox Fruits, focus on completing quests efficiently. Join a crew for bonus XP, farm bosses during 2x events, and choose the right fruit for your playstyle.",
          tips: [
            "Buddha fruit is best for grinding",
            "Redeem codes for free stats",
            "Boss drops give massive XP"
          ]
        },
        {
          title: "Pet Simulator X Tips",
          content: "Hatching eggs and completing quests are the main progression methods. Save gems for events, join a good clan, and focus on BiG Games exclusive pets.",
          tips: [
            "Huge pets are the end-game goal",
            "Events give best pets",
            "Auto-hatch when AFK"
          ]
        },
        {
          title: "Adopt Me Strategies",
          content: "Adopt Me progression is about collecting and trading pets. Complete daily tasks, participate in events, and learn trading values to get rare pets.",
          tips: [
            "Login daily for rewards",
            "Event pets become valuable later",
            "Don't rush trades"
          ]
        },
        {
          title: "General Roblox XP",
          content: "Your Roblox level increases by playing games and earning achievements. Higher levels unlock badges and profile features. Play a variety of games for variety.",
          tips: [
            "Complete game achievements",
            "Try new experiences regularly",
            "Join events for bonus XP"
          ]
        }
      ]
    }
  }
}

export function getGuideContent(gameSlug: string): GameGuideContent | undefined {
  return guideContent[gameSlug]
}
