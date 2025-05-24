/*
  # Add new branch manager for Swapper KB

  1. Changes
    - Insert new branch manager record for Swapper KB
    - Manager details:
      - Shop name: Swapper KB
      - User ID: Farhan9928
      - Temp key: Farhan9928

  2. Notes
    - Maintains existing RLS policies
    - Adds to existing branch_managers table
*/

-- Insert new branch manager
INSERT INTO branch_managers (shop_name, user_id, temp_key)
VALUES ('Swapper KB', 'Farhan9928', 'Farhan9928');