/*
  # Fix Announcements RLS Policy

  1. Security Updates
    - Update RLS policies for announcements table to allow public access
    - Ensure INSERT and UPDATE operations work with anon key
    - Match existing database schema permissions

  2. Changes
    - Drop existing restrictive policies
    - Create new policies allowing public access for all operations
    - Maintain RLS enabled for security structure
*/

-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Anyone can read announcements" ON announcements;
DROP POLICY IF EXISTS "Authenticated users can manage announcements" ON announcements;

-- Create new policies that allow public access (matching the database schema)
CREATE POLICY "Public can read announcements"
  ON announcements
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can insert announcements"
  ON announcements
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update announcements"
  ON announcements
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete announcements"
  ON announcements
  FOR DELETE
  TO public
  USING (true);