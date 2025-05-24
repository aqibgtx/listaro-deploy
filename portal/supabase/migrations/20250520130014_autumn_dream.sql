/*
  # Add branch column to admin_users table

  1. Changes
    - Add `branch` text column to admin_users table
    - Make it nullable initially to maintain compatibility with existing records

  Note: This migration adds support for storing the user's branch information
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'admin_users' 
    AND column_name = 'branch'
  ) THEN
    ALTER TABLE admin_users 
    ADD COLUMN branch text;
  END IF;
END $$;