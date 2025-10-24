/*
  # Create storage bucket and policies for experience images

  1. Storage Configuration
    - Create 'experience-images' bucket for storing experience timeline images
    - Set bucket to be publicly accessible for viewing
    - Configure appropriate file size and type restrictions via policies
  
  2. Security Policies
    - Public users (anon + authenticated) can view/download images
    - Only authenticated users can upload images
    - Only authenticated users can update/delete images
  
  3. Important Notes
    - Images are publicly accessible to all visitors
    - Upload restrictions should be enforced in application code
    - Recommended max file size: 5MB
    - Supported formats: JPG, PNG, WebP
*/

-- Create experience-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('experience-images', 'experience-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public users to view experience images
CREATE POLICY "Public users can view experience images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'experience-images');

-- Allow authenticated users to upload experience images
CREATE POLICY "Authenticated users can upload experience images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'experience-images');

-- Allow authenticated users to update experience images
CREATE POLICY "Authenticated users can update experience images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'experience-images')
  WITH CHECK (bucket_id = 'experience-images');

-- Allow authenticated users to delete experience images
CREATE POLICY "Authenticated users can delete experience images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'experience-images');