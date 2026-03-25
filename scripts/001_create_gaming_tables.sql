-- Gaming Promo Code System Database Schema
-- Tables for games, promo codes, generated content, and analytics

-- ============================================
-- GAMES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_name TEXT,
  description TEXT,
  categories TEXT[] DEFAULT '{}',
  platforms TEXT[] DEFAULT '{}',
  image_url TEXT,
  icon_url TEXT,
  developer TEXT,
  publisher TEXT,
  release_date DATE,
  affiliate_link TEXT,
  website_url TEXT,
  popularity_score INTEGER DEFAULT 50 CHECK (popularity_score >= 0 AND popularity_score <= 100),
  player_count TEXT,
  meta_title TEXT,
  meta_description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROMO CODES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  reward TEXT NOT NULL,
  reward_value INTEGER DEFAULT 0,
  reward_type TEXT DEFAULT 'Other',
  expires_at TIMESTAMPTZ,
  is_verified BOOLEAN DEFAULT false,
  is_exclusive BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  source TEXT,
  source_url TEXT,
  uses_count INTEGER DEFAULT 0,
  success_rate INTEGER DEFAULT 0 CHECK (success_rate >= 0 AND success_rate <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game_id, code)
);

-- ============================================
-- GAME REWARDS TABLE (Free rewards, daily bonuses, etc.)
-- ============================================
CREATE TABLE IF NOT EXISTS public.game_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  reward_type TEXT NOT NULL DEFAULT 'Free',
  value TEXT,
  link TEXT,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- GENERATED CONTENT TABLE (AI-generated SEO content)
-- ============================================
CREATE TABLE IF NOT EXISTS public.generated_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, -- 'game_page', 'codes_page', 'rewards_page', 'landing'
  slug TEXT NOT NULL,
  seo_title TEXT,
  meta_description TEXT,
  intro_paragraph TEXT,
  faqs JSONB DEFAULT '[]',
  keywords TEXT[] DEFAULT '{}',
  internal_links JSONB DEFAULT '[]',
  is_published BOOLEAN DEFAULT true,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game_id, content_type, slug)
);

-- ============================================
-- ANALYTICS TABLE (Track code copies, clicks, CTR)
-- ============================================
CREATE TABLE IF NOT EXISTS public.gaming_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- 'code_copy', 'code_click', 'page_view', 'affiliate_click'
  game_id UUID REFERENCES public.games(id) ON DELETE SET NULL,
  promo_code_id UUID REFERENCES public.promo_codes(id) ON DELETE SET NULL,
  code TEXT,
  page_slug TEXT,
  user_agent TEXT,
  ip_hash TEXT, -- Hashed for privacy
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SCRAPE LOGS TABLE (Track scraping runs)
-- ============================================
CREATE TABLE IF NOT EXISTS public.scrape_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  game_slug TEXT,
  codes_found INTEGER DEFAULT 0,
  codes_added INTEGER DEFAULT 0,
  codes_updated INTEGER DEFAULT 0,
  codes_expired INTEGER DEFAULT 0,
  status TEXT DEFAULT 'success',
  error_message TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_games_slug ON public.games(slug);
CREATE INDEX IF NOT EXISTS idx_games_popularity ON public.games(popularity_score DESC);
CREATE INDEX IF NOT EXISTS idx_games_active ON public.games(is_active);

CREATE INDEX IF NOT EXISTS idx_promo_codes_game ON public.promo_codes(game_id);
CREATE INDEX IF NOT EXISTS idx_promo_codes_active ON public.promo_codes(is_active, is_verified);
CREATE INDEX IF NOT EXISTS idx_promo_codes_expires ON public.promo_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON public.promo_codes(code);

CREATE INDEX IF NOT EXISTS idx_game_rewards_game ON public.game_rewards(game_id);
CREATE INDEX IF NOT EXISTS idx_game_rewards_type ON public.game_rewards(reward_type);

CREATE INDEX IF NOT EXISTS idx_generated_content_game ON public.generated_content(game_id);
CREATE INDEX IF NOT EXISTS idx_generated_content_slug ON public.generated_content(slug);

CREATE INDEX IF NOT EXISTS idx_analytics_event ON public.gaming_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_game ON public.gaming_analytics(game_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON public.gaming_analytics(created_at);

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
DROP TRIGGER IF EXISTS update_games_updated_at ON public.games;
CREATE TRIGGER update_games_updated_at
  BEFORE UPDATE ON public.games
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_promo_codes_updated_at ON public.promo_codes;
CREATE TRIGGER update_promo_codes_updated_at
  BEFORE UPDATE ON public.promo_codes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_game_rewards_updated_at ON public.game_rewards;
CREATE TRIGGER update_game_rewards_updated_at
  BEFORE UPDATE ON public.game_rewards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_generated_content_updated_at ON public.generated_content;
CREATE TRIGGER update_generated_content_updated_at
  BEFORE UPDATE ON public.generated_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (Public read access, service role for writes)
-- ============================================

-- Games table - public read
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "games_select_all" ON public.games;
CREATE POLICY "games_select_all" ON public.games FOR SELECT USING (true);

-- Promo codes table - public read
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "promo_codes_select_all" ON public.promo_codes;
CREATE POLICY "promo_codes_select_all" ON public.promo_codes FOR SELECT USING (true);

-- Game rewards table - public read
ALTER TABLE public.game_rewards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "game_rewards_select_all" ON public.game_rewards;
CREATE POLICY "game_rewards_select_all" ON public.game_rewards FOR SELECT USING (true);

-- Generated content table - public read
ALTER TABLE public.generated_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "generated_content_select_all" ON public.generated_content;
CREATE POLICY "generated_content_select_all" ON public.generated_content FOR SELECT USING (true);

-- Analytics table - public insert (for tracking), restricted read
ALTER TABLE public.gaming_analytics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "analytics_insert_all" ON public.gaming_analytics;
CREATE POLICY "analytics_insert_all" ON public.gaming_analytics FOR INSERT WITH CHECK (true);

-- Scrape logs - no public access needed
ALTER TABLE public.scrape_logs ENABLE ROW LEVEL SECURITY;
