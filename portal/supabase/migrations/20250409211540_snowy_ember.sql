/*
  # Create listings table

  1. New Tables
    - `listings`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text) 
      - `price` (numeric)
      - `images` (text array)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS on `listings` table
    - Add policy for public access (prototype mode)
*/

CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  images text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- For prototype: Allow public access to listings table
CREATE POLICY "Public access policy" ON listings
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);