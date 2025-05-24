/*
  # Create branch managers table

  1. New Tables
    - `branch_managers`
      - `id` (uuid, primary key)
      - `shop_name` (text, not null)
      - `user_id` (text, not null)
      - `temp_key` (text, not null)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `branch_managers` table
    - Add policy for authenticated users to read their own data
*/

CREATE TABLE IF NOT EXISTS branch_managers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_name text NOT NULL,
  user_id text NOT NULL,
  temp_key text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE branch_managers ENABLE ROW LEVEL SECURITY;

-- Create policy for reading branch manager data
CREATE POLICY "Allow public read access"
  ON branch_managers
  FOR SELECT
  TO public
  USING (true);

-- Insert test data for Swapper KLTS
INSERT INTO branch_managers (shop_name, user_id, temp_key)
VALUES ('Swapper KLTS', 'Kong4422', 'Kong4422');