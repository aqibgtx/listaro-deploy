/*
  # Add status and session tracking columns to listings table

  1. Changes
    - Add `status` text column with default value 'pending'
    - Add `original_id` text column for grouping related listings
    - Add `prompt_title` and `prompt_desc` text columns for storing prompts
    - Add `price_mod` numeric column for price modifications

  Note: This migration adds support for tracking listing status and grouping related listings
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'listings' 
    AND column_name = 'status'
  ) THEN
    ALTER TABLE listings 
    ADD COLUMN status text NOT NULL DEFAULT 'pending',
    ADD COLUMN original_id text,
    ADD COLUMN prompt_title text,
    ADD COLUMN prompt_desc text,
    ADD COLUMN price_mod numeric;
  END IF;
END $$;