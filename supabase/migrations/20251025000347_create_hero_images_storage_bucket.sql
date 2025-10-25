/*
  # Create Storage Bucket for Hero Project Images

  1. Storage Bucket
    - Create `hero-images` bucket for storing hero carousel project screenshots
    - Configure for public read access
    - Optimized for high-quality, full-screen images

  2. Security Policies
    - Public read access for all users (to display images on hero section)
    - Authenticated users can upload images
    - Authenticated users can update their uploaded images
    - Authenticated users can delete images

  3. Important Notes
    - Images should be high-resolution for full-screen display (recommended 1920x1080 or higher)
    - Supported formats: JPG, PNG, WebP
    - File size limit handled by Supabase default settings
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hero-images',
  'hero-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view hero images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'hero-images');

CREATE POLICY "Authenticated users can upload hero images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'hero-images');

CREATE POLICY "Authenticated users can update hero images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'hero-images')
  WITH CHECK (bucket_id = 'hero-images');

CREATE POLICY "Authenticated users can delete hero images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'hero-images');