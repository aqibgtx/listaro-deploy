/*
  # Add user_name column to listings table

  1. Changes
    - Add `user_name` text column to listings table
    - Make it nullable since some existing listings might not have a user name

  Note: This migration adds support for storing the user's name for personalization
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'listings' 
    AND column_name = 'user_name'
  ) THEN
    ALTER TABLE listings 
    ADD COLUMN user_name text;
  END IF;
END $$;