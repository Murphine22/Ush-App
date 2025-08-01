/*
  # Update Attachments Bucket Policies

  1. Security Updates
    - Restrict file uploads to authenticated users only
    - Allow public read access for all users
    - Maintain file management capabilities for admins

  2. Policy Changes
    - Upload: Authenticated users only
    - Download: Public access
    - Update/Delete: Authenticated users only
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Public can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view files" ON storage.objects;
DROP POLICY IF EXISTS "Public can update files" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete files" ON storage.objects;

-- Create new policies with proper restrictions
CREATE POLICY "Authenticated users can upload files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'attachments');

CREATE POLICY "Anyone can view files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'attachments');

CREATE POLICY "Authenticated users can update files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'attachments')
  WITH CHECK (bucket_id = 'attachments');

CREATE POLICY "Authenticated users can delete files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'attachments');