/*
  # Add user tracking to listings table

  1. Changes
    - Add `user_id` text column to listings table
    - Add index on user_id for faster queries
    - Update RLS policy to allow public access (maintaining current behavior)

  Note: This migration adds support for tracking which user created each listing
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'listings' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE listings 
    ADD COLUMN user_id text;

    CREATE INDEX IF NOT EXISTS listings_user_id_idx ON listings (user_id);
  END IF;
END $$;