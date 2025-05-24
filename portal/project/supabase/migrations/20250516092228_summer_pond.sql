/*
  # Create admin users table

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `user_id` (text, unique)
      - `temp_key` (text)
      - `name` (text, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `admin_users` table
    - Add policies for public access (will be restricted later)
*/

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE NOT NULL,
  temp_key text NOT NULL,
  name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- For prototype: Allow public access to admin_users table
CREATE POLICY "Enable read access for all users" ON admin_users FOR SELECT
USING (true);

CREATE POLICY "Enable insert access for all users" ON admin_users FOR INSERT
WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON admin_users FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete access for all users" ON admin_users FOR DELETE
USING (true);