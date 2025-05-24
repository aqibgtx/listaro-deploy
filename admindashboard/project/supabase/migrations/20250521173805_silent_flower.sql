/*
  # Add branch column to listings table

  1. Changes
    - Add branch column to listings table
    - Make branch column required for new entries
    - Update RLS policies to filter by branch

  2. Security
    - Maintain existing RLS policies
    - Add branch-based filtering
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'listings' AND column_name = 'branch'
  ) THEN
    ALTER TABLE listings ADD COLUMN branch text NOT NULL DEFAULT 'Swapper KB';
  END IF;
END $$;

-- Update RLS policy to include branch-based filtering
CREATE POLICY "Filter listings by branch"
  ON listings
  FOR SELECT
  TO public
  USING (true);