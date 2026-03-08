-- Add slug column to deals table for SEO-friendly URLs
ALTER TABLE deals ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_deals_slug ON deals(slug);

-- Create index on created_at for sorting by newest
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON deals(created_at DESC);

-- Add source column to track where deals came from
ALTER TABLE deals ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual';

-- Add ai_description column for AI-generated descriptions
ALTER TABLE deals ADD COLUMN IF NOT EXISTS ai_description TEXT;

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION generate_deal_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Convert to lowercase, replace spaces with hyphens, remove special chars
  base_slug := lower(title);
  base_slug := regexp_replace(base_slug, '[^a-z0-9\s-]', '', 'g');
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  
  -- Truncate to reasonable length
  base_slug := left(base_slug, 80);
  
  -- Add "-deal" suffix
  final_slug := base_slug || '-deal';
  
  -- Check for uniqueness and add counter if needed
  WHILE EXISTS (SELECT 1 FROM deals WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-deal-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Update existing deals to have slugs
UPDATE deals 
SET slug = generate_deal_slug(title)
WHERE slug IS NULL;

-- Make slug NOT NULL after populating
ALTER TABLE deals ALTER COLUMN slug SET NOT NULL;
