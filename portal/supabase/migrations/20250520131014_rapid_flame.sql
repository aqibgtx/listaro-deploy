/*
  # Add desc_style column to listings table

  1. Changes
    - Add `desc_style` text column to listings table
    - Make it nullable since some existing listings might not have a style

  Note: This migration adds support for storing the description style preference
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'listings' 
    AND column_name = 'desc_style'
  ) THEN
    ALTER TABLE listings 
    ADD COLUMN desc_style text;
  END IF;
END $$;