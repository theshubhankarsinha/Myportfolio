/*
  # Create experience timeline table with support for images

  1. New Tables
    - `experience_timeline`
      - `id` (uuid, primary key) - Unique identifier for each experience entry
      - `year` (text, not null) - Time period for the experience (e.g., "2015-2019")
      - `title` (text, not null) - Title of the experience period
      - `intro` (text, not null) - Introduction/summary text for the experience
      - `display_order` (integer, default 0) - Order in which entries should be displayed
      - `created_at` (timestamptz) - Timestamp when entry was created
      - `updated_at` (timestamptz) - Timestamp when entry was last updated
    
    - `experience_moments`
      - `id` (uuid, primary key) - Unique identifier for each moment
      - `experience_id` (uuid, foreign key) - Reference to parent experience entry
      - `heading` (text, not null) - Heading for the moment
      - `subtitle` (text, nullable) - Optional subtitle
      - `bullets` (text[], nullable) - Array of bullet points
      - `display_order` (integer, default 0) - Order within the experience entry
      - `created_at` (timestamptz) - Timestamp when moment was created
    
    - `experience_images`
      - `id` (uuid, primary key) - Unique identifier for each image
      - `experience_id` (uuid, foreign key) - Reference to parent experience entry
      - `image_url` (text, not null) - URL to the uploaded image in storage
      - `display_order` (integer, default 0) - Order in which images should be displayed
      - `created_at` (timestamptz) - Timestamp when image was uploaded
  
  2. Security
    - Enable RLS on all three tables
    - Add policies for public users to view all data
    - Add policies for authenticated users to insert, update, and delete data
  
  3. Important Notes
    - Images will be stored in a new 'experience-images' storage bucket
    - Display order allows for custom arrangement of entries and images
    - Public read access ensures visitors can see the experience timeline
    - Cascading deletes ensure data integrity when removing experiences
*/

-- Create experience_timeline table
CREATE TABLE IF NOT EXISTS experience_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year text NOT NULL,
  title text NOT NULL,
  intro text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create experience_moments table
CREATE TABLE IF NOT EXISTS experience_moments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id uuid NOT NULL REFERENCES experience_timeline(id) ON DELETE CASCADE,
  heading text NOT NULL,
  subtitle text,
  bullets text[],
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create experience_images table
CREATE TABLE IF NOT EXISTS experience_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id uuid NOT NULL REFERENCES experience_timeline(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE experience_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_moments ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_images ENABLE ROW LEVEL SECURITY;

-- Policies for experience_timeline
CREATE POLICY "Public users can view experience timeline"
  ON experience_timeline
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert experience timeline"
  ON experience_timeline
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update experience timeline"
  ON experience_timeline
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete experience timeline"
  ON experience_timeline
  FOR DELETE
  TO authenticated
  USING (true);

-- Policies for experience_moments
CREATE POLICY "Public users can view experience moments"
  ON experience_moments
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert experience moments"
  ON experience_moments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update experience moments"
  ON experience_moments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete experience moments"
  ON experience_moments
  FOR DELETE
  TO authenticated
  USING (true);

-- Policies for experience_images
CREATE POLICY "Public users can view experience images"
  ON experience_images
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert experience images"
  ON experience_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update experience images"
  ON experience_images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete experience images"
  ON experience_images
  FOR DELETE
  TO authenticated
  USING (true);