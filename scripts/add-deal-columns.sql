-- Add new columns to deals table for SEO and AI features
-- Step 1: Add columns (they may already exist, so using IF NOT EXISTS pattern)

ALTER TABLE deals ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE deals ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual';
ALTER TABLE deals ADD COLUMN IF NOT EXISTS ai_description TEXT;

-- Step 2: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_deals_slug ON deals(slug);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON deals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deals_source ON deals(source);
