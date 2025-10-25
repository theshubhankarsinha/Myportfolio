/*
  # Fix Hero Featured Projects RLS Policy

  1. Changes
    - Drop the existing public policy that doesn't work with anonymous users
    - Create new policy that explicitly allows `anon` and `authenticated` roles
    - This fixes the issue where the frontend couldn't fetch projects

  2. Security
    - Anonymous users (anon role) can view active projects
    - Authenticated users can view all projects
    - This maintains security while allowing the carousel to work
*/

-- Drop the old policy that used TO public
DROP POLICY IF EXISTS "Anyone can view active featured projects" ON hero_featured_projects;

-- Create new policy that works with anon role
CREATE POLICY "Anonymous users can view active featured projects"
  ON hero_featured_projects
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Keep the authenticated policy (it already exists and works)
-- No changes needed for INSERT, UPDATE, DELETE policies