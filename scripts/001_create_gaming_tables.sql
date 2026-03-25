-- Gaming Promo Code System - Core Tables

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
  affiliate_link TEXT,
  website_url TEXT,
  popularity_score INTEGER DEFAULT 50,
  player_count TEXT,
  meta_title TEXT,
  meta_description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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
  success_rate INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game_id, code)
);

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

CREATE TABLE IF NOT EXISTS public.generated_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
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

CREATE TABLE IF NOT EXISTS public.gaming_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  game_id UUID REFERENCES public.games(id) ON DELETE SET NULL,
  promo_code_id UUID REFERENCES public.promo_codes(id) ON DELETE SET NULL,
  code TEXT,
  page_slug TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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
