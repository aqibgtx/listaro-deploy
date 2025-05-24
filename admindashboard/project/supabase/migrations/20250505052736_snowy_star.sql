/*
  # Update branch managers table

  1. Changes
    - Remove user_id requirement from branch_managers table
    - Update existing data for Swapper KLTS
*/

DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'branch_managers' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE branch_managers ALTER COLUMN user_id DROP NOT NULL;
  END IF;
END $$;

-- Update test data for Swapper KLTS
UPDATE branch_managers 
SET temp_key = 'Kong4422' 
WHERE shop_name = 'Swapper KLTS';