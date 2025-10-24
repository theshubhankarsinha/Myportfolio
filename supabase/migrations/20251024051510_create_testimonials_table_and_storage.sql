/*
  # Create Testimonials Section

  1. New Tables
    - `testimonials`
      - `id` (uuid, primary key)
      - `name` (text, not null) - The name of the person giving the testimonial
      - `title` (text, not null) - Their professional title/role
      - `quote` (text, not null) - The testimonial content
      - `linkedin_url` (text, nullable) - Link to their LinkedIn testimonial or profile
      - `profile_image_url` (text, nullable) - URL to their profile picture
      - `display_order` (integer, default 0) - Order in which testimonials are displayed
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Storage
    - Create `testimonial-images` bucket for storing profile pictures

  3. Security
    - Enable RLS on `testimonials` table
    - Add policy for public read access (anyone can view testimonials)
    - Add policy for authenticated users to insert, update, and delete testimonials
    - Configure storage policies for testimonial images (public read, authenticated write)

  4. Important Notes
    - All testimonials are publicly viewable to showcase recommendations
    - Only authenticated admin users can manage testimonial content
    - Profile images are stored in a dedicated bucket with public access for display
*/

-- Create the testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  quote text NOT NULL,
  linkedin_url text,
  profile_image_url text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view testimonials
CREATE POLICY "Public users can view testimonials"
  ON testimonials
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy: Authenticated users can insert testimonials
CREATE POLICY "Authenticated users can insert testimonials"
  ON testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update testimonials
CREATE POLICY "Authenticated users can update testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete testimonials
CREATE POLICY "Authenticated users can delete testimonials"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING (true);

-- Create storage bucket for testimonial images
INSERT INTO storage.buckets (id, name, public)
VALUES ('testimonial-images', 'testimonial-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Anyone can view testimonial images
CREATE POLICY "Public users can view testimonial images"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'testimonial-images');

-- Storage policy: Authenticated users can upload testimonial images
CREATE POLICY "Authenticated users can upload testimonial images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'testimonial-images');

-- Storage policy: Authenticated users can update testimonial images
CREATE POLICY "Authenticated users can update testimonial images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'testimonial-images')
  WITH CHECK (bucket_id = 'testimonial-images');

-- Storage policy: Authenticated users can delete testimonial images
CREATE POLICY "Authenticated users can delete testimonial images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'testimonial-images');