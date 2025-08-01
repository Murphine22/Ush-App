/*
  # Create attachments storage bucket

  1. Storage Setup
    - Create 'attachments' bucket for announcement files
    - Set bucket to public for easy access
    - Configure appropriate policies for file operations

  2. Security
    - Allow public uploads to support anonymous users
    - Allow public downloads for file access
    - Enable RLS for future security enhancements

  3. File Management
    - Support for documents, images, and videos
    - Organized folder structure for announcements
*/

-- Create the attachments bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'attachments',
  'attachments',
  true,
  10485760, -- 10MB limit
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow public uploads
CREATE POLICY "Public can upload files"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'attachments');

-- Create policy to allow public downloads
CREATE POLICY "Public can download files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'attachments');

-- Create policy to allow public updates
CREATE POLICY "Public can update files"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'attachments')
WITH CHECK (bucket_id = 'attachments');

-- Create policy to allow public deletes
CREATE POLICY "Public can delete files"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'attachments');