/*
  # Update RLS policies for listings table

  1. Changes
    - Drop existing policies
    - Create new policies for CRUD operations
    - Allow public access during development phase

  Note: This migration updates the security policies to allow development access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public access policy" ON listings;
DROP POLICY IF EXISTS "Users can delete own listings" ON listings;
DROP POLICY IF EXISTS "Users can insert own listings" ON listings;
DROP POLICY IF EXISTS "Users can read own listings" ON listings;
DROP POLICY IF EXISTS "Users can update own listings" ON listings;

-- Create new policies
CREATE POLICY "Enable read access for all users" ON listings FOR SELECT
USING (true);

CREATE POLICY "Enable insert access for all users" ON listings FOR INSERT
WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON listings FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for all users" ON listings FOR DELETE
USING (true);