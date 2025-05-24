/*
  # Add Facebook URL column to listings table

  1. Changes
    - Add `fb_url` text column to listings table
    - Make it nullable since not all listings will have a Facebook URL immediately
    - Add an empty string as default value

  Note: This migration adds tracking for Facebook marketplace URLs
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'listings' 
    AND column_name = 'fb_url'
  ) THEN
    ALTER TABLE listings 
    ADD COLUMN fb_url text DEFAULT '';
  END IF;
END $$;