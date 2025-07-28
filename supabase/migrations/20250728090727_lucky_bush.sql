/*
  # Fix Member Payments RLS Policy

  1. Security Updates
    - Update RLS policies for `member_payments` table to allow public access
    - Ensure consistency with existing application authentication pattern
    - Allow CRUD operations for member payment management

  2. Policy Changes
    - Enable public SELECT access for reading member payments
    - Enable public INSERT/UPDATE/DELETE for managing payments
    - Maintain RLS structure for future enhancements

  3. Notes
    - Matches the existing pattern used in other tables
    - Compatible with current client-side authentication system
    - Allows the monthly dues record functionality to work properly
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Anyone can read member payments" ON member_payments;
DROP POLICY IF EXISTS "Authenticated users can manage member payments" ON member_payments;

-- Create new public access policies
CREATE POLICY "Public can read member payments"
  ON member_payments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can insert member payments"
  ON member_payments
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update member payments"
  ON member_payments
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete member payments"
  ON member_payments
  FOR DELETE
  TO public
  USING (true);

-- Ensure RLS is enabled
ALTER TABLE member_payments ENABLE ROW LEVEL SECURITY;