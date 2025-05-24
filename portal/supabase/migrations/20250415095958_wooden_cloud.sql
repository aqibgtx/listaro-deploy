/*
  # Add posted column to listings table

  1. Changes
    - Add `posted` boolean column to listings table with default value of false
    - Make it non-nullable to ensure data consistency

  Note: This migration adds tracking for whether a listing has been posted
*/

ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS posted boolean NOT NULL DEFAULT false;