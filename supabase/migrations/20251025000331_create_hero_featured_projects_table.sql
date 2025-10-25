/*
  # Create Hero Featured Projects Table

  1. New Tables
    - `hero_featured_projects`
      - `id` (uuid, primary key) - Unique identifier for each featured project
      - `title` (text) - Project title displayed in the featured label
      - `description` (text) - Short description or tagline for the project
      - `image_url` (text, nullable) - URL to the project screenshot/image
      - `mvp_url` (text, nullable) - Link to the live MVP or project demo
      - `display_order` (integer) - Order in which projects appear in the carousel
      - `is_active` (boolean) - Whether the project should be shown in the carousel
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `hero_featured_projects` table
    - Add policy for public read access (unauthenticated users can view)
    - Add policies for authenticated admin users to manage (insert, update, delete)

  3. Important Notes
    - Projects will be displayed in the hero carousel based on display_order
    - Only active projects (is_active = true) will be shown
    - The carousel will automatically cycle through all active projects
    - Images should be high-quality screenshots optimized for full-screen display
*/

CREATE TABLE IF NOT EXISTS hero_featured_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  image_url text,
  mvp_url text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hero_featured_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active featured projects"
  ON hero_featured_projects
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all featured projects"
  ON hero_featured_projects
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert featured projects"
  ON hero_featured_projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update featured projects"
  ON hero_featured_projects
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete featured projects"
  ON hero_featured_projects
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_hero_featured_projects_display_order 
  ON hero_featured_projects(display_order);

CREATE INDEX IF NOT EXISTS idx_hero_featured_projects_is_active 
  ON hero_featured_projects(is_active);