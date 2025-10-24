-- =====================================================
-- ABOUT SECTION DATABASE SETUP
-- =====================================================
-- Run this SQL script in your Supabase SQL Editor
-- Dashboard: https://supabase.com/dashboard/project/YOUR_PROJECT/sql
-- =====================================================

-- Create the about_section table
CREATE TABLE IF NOT EXISTS about_section (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_url text,
  resume_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE about_section ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read the about section data
CREATE POLICY "Public users can view about section"
  ON about_section
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy: Only authenticated users can insert about section data
CREATE POLICY "Authenticated users can insert about section"
  ON about_section
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Only authenticated users can update about section data
CREATE POLICY "Authenticated users can update about section"
  ON about_section
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create storage buckets for profile photos and resumes
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('profile-photos', 'profile-photos', true),
  ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Anyone can view files in profile-photos bucket
CREATE POLICY "Public users can view profile photos"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'profile-photos');

-- Storage policy: Authenticated users can upload profile photos
CREATE POLICY "Authenticated users can upload profile photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'profile-photos');

-- Storage policy: Authenticated users can update profile photos
CREATE POLICY "Authenticated users can update profile photos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'profile-photos')
  WITH CHECK (bucket_id = 'profile-photos');

-- Storage policy: Authenticated users can delete profile photos
CREATE POLICY "Authenticated users can delete profile photos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'profile-photos');

-- Storage policy: Anyone can view files in resumes bucket
CREATE POLICY "Public users can view resumes"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'resumes');

-- Storage policy: Authenticated users can upload resumes
CREATE POLICY "Authenticated users can upload resumes"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'resumes');

-- Storage policy: Authenticated users can update resumes
CREATE POLICY "Authenticated users can update resumes"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'resumes')
  WITH CHECK (bucket_id = 'resumes');

-- Storage policy: Authenticated users can delete resumes
CREATE POLICY "Authenticated users can delete resumes"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'resumes');

-- =====================================================
-- SETUP COMPLETE
-- =====================================================
-- Next steps:
-- 1. Create an admin user in Authentication > Users
-- 2. Access the admin panel via the "A" button (bottom right)
-- 3. Upload your profile photo and resume
-- =====================================================
