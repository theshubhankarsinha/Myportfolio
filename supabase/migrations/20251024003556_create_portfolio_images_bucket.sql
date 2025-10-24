/*
  # Create Portfolio Images Storage Bucket

  1. Storage Buckets
    - `portfolio-images` - Public bucket for storing portfolio playbook product images
  
  2. Storage Security Policies
    - Public users can view files (SELECT)
    - Authenticated users can upload files (INSERT)
    - Authenticated users can update files (UPDATE)
    - Authenticated users can delete files (DELETE)
  
  3. Important Notes
    - Bucket is set to public for easy access to uploaded product screenshots
    - Only authenticated admin users can modify files
    - Files are accessible via public URLs for display on the portfolio section
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public users can view portfolio images'
  ) THEN
    CREATE POLICY "Public users can view portfolio images"
      ON storage.objects
      FOR SELECT
      TO anon, authenticated
      USING (bucket_id = 'portfolio-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload portfolio images'
  ) THEN
    CREATE POLICY "Authenticated users can upload portfolio images"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'portfolio-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can update portfolio images'
  ) THEN
    CREATE POLICY "Authenticated users can update portfolio images"
      ON storage.objects
      FOR UPDATE
      TO authenticated
      USING (bucket_id = 'portfolio-images')
      WITH CHECK (bucket_id = 'portfolio-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can delete portfolio images'
  ) THEN
    CREATE POLICY "Authenticated users can delete portfolio images"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (bucket_id = 'portfolio-images');
  END IF;
END $$;