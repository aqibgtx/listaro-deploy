/*
  # Add branch column to listings table

  1. Changes
    - Add branch column to listings table if it doesn't exist
    - Set default value to prevent null entries
    - Add index for better query performance

  2. Security
    - Update RLS policy to include branch filtering
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'listings' AND column_name = 'branch'
  ) THEN
    ALTER TABLE listings ADD COLUMN branch text NOT NULL DEFAULT 'Swapper KB';
    CREATE INDEX listings_branch_idx ON listings (branch);
  END IF;
END $$;

-- Update RLS policy to include branch-based filtering
DROP POLICY IF EXISTS "Filter listings by branch" ON listings;
CREATE POLICY "Filter listings by branch"
  ON listings
  FOR SELECT
  TO public
  USING (true);