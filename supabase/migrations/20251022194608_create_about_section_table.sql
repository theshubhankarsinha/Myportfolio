/*
  # Create about_section table for profile management

  1. New Tables
    - `about_section`
      - `id` (uuid, primary key) - Unique identifier for the record
      - `photo_url` (text, nullable) - URL to the uploaded profile photo
      - `resume_url` (text, nullable) - URL to the uploaded resume PDF
      - `created_at` (timestamptz) - Timestamp when record was created
      - `updated_at` (timestamptz) - Timestamp when record was last updated
  
  2. Security
    - Enable RLS on `about_section` table
    - Add policy for public users (anon + authenticated) to read data
    - Add policy for authenticated users to insert data
    - Add policy for authenticated users to update data
*/

CREATE TABLE IF NOT EXISTS about_section (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_url text,
  resume_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE about_section ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public users can view about section"
  ON about_section
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert about section"
  ON about_section
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update about section"
  ON about_section
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);