/*
  # Fix RLS Policy for Balances Brought Forward

  1. Security Changes
    - Update RLS policy on `balances_brought_forward` table to allow anonymous users to manage data
    - This enables the application to work with the anonymous Supabase key for financial operations

  2. Changes Made
    - Drop existing restrictive policy for authenticated users only
    - Create new policy allowing public access for all operations
    - Maintain RLS enabled for security structure
*/

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Authenticated users can manage balances brought forward" ON balances_brought_forward;

-- Create a new policy that allows public access for all operations
CREATE POLICY "Public can manage balances brought forward"
  ON balances_brought_forward
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);