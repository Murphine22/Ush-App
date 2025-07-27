/*
  # Fix RLS policies for member management

  This migration updates the RLS policies for the members table to allow
  operations from the public (anon) role, since the application uses
  local authentication rather than Supabase auth.

  ## Changes
  1. Update members table policies to allow public access for all operations
  2. Keep RLS enabled for security but allow anon role operations
  
  ## Security Note
  This assumes the application handles authentication at the application level
  and restricts access to the member management pages appropriately.
*/

-- Drop existing policies for members table
DROP POLICY IF EXISTS "Anyone can read members" ON members;
DROP POLICY IF EXISTS "Authenticated users can manage members" ON members;

-- Create new policies that allow public (anon) role access
CREATE POLICY "Public can read members"
  ON members
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can insert members"
  ON members
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update members"
  ON members
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete members"
  ON members
  FOR DELETE
  TO public
  USING (true);