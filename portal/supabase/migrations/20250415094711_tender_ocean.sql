/*
  # Update listings table policies

  1. Changes
    - Add policy for public access if it doesn't exist yet
    - Use DO block to check for existing policy

  Note: This migration is idempotent and will only create the policy if it doesn't already exist
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'listings' 
      AND policyname = 'Public access policy'
  ) THEN
    CREATE POLICY "Public access policy" ON listings
      FOR ALL
      TO public
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;