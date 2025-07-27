/*
  # Fix RLS policy for contributions table

  1. Security Changes
    - Update RLS policy to allow public users to insert contributions
    - This matches the pattern used in other tables like members
    - Maintains read access for everyone
    - Allows authenticated users full management access

  2. Changes Made
    - Drop the existing restrictive policy for authenticated users
    - Add separate policies for public INSERT and authenticated management
    - Ensure consistency with other table policies in the schema
*/

-- Drop the existing policy that restricts to authenticated users only
DROP POLICY IF EXISTS "Authenticated users can manage contributions" ON contributions;

-- Create policy to allow public users to insert contributions
CREATE POLICY "Public can insert contributions"
  ON contributions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy to allow authenticated users to update and delete contributions
CREATE POLICY "Authenticated users can update contributions"
  ON contributions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete contributions"
  ON contributions
  FOR DELETE
  TO authenticated
  USING (true);