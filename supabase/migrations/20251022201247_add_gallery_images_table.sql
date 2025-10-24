/*
  # Add gallery images table for About section image carousel

  1. New Tables
    - `gallery_images`
      - `id` (uuid, primary key) - Unique identifier for each image
      - `image_url` (text, not null) - URL to the uploaded image in storage
      - `display_order` (integer, default 0) - Order in which images should be displayed
      - `created_at` (timestamptz) - Timestamp when image was uploaded
  
  2. Security
    - Enable RLS on `gallery_images` table
    - Add policy for public users (anon + authenticated) to view images
    - Add policy for authenticated users to insert images
    - Add policy for authenticated users to update images
    - Add policy for authenticated users to delete images
  
  3. Important Notes
    - Images will be stored in the 'profile-photos' bucket
    - Display order allows for custom arrangement of images
    - Public read access ensures visitors can see the gallery
*/

CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public users can view gallery images"
  ON gallery_images
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert gallery images"
  ON gallery_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update gallery images"
  ON gallery_images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete gallery images"
  ON gallery_images
  FOR DELETE
  TO authenticated
  USING (true);