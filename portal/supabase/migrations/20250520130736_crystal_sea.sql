/*
  # Add branch column to listings table

  1. Changes
    - Add `branch` text column to listings table
    - Make it nullable since some existing listings might not have a branch

  Note: This migration adds support for storing the branch information for each listing
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'listings' 
    AND column_name = 'branch'
  ) THEN
    ALTER TABLE listings 
    ADD COLUMN branch text;
  END IF;
END $$;