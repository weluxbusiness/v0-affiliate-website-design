CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  store TEXT NOT NULL,
  category TEXT NOT NULL,
  original_price DECIMAL(10, 2),
  deal_price DECIMAL(10, 2) NOT NULL,
  discount_percentage INTEGER,
  coupon_code TEXT,
  affiliate_link TEXT,
  image_url TEXT,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
