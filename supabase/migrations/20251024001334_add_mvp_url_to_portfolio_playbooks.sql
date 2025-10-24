/*
  # Add MVP URL field to Portfolio Playbooks

  1. Changes
    - Add `mvp_url` column to `portfolio_playbooks` table
      - Type: text (nullable)
      - Purpose: Optional URL to redirect users to the MVP of the project
  
  2. Notes
    - Field is nullable to maintain backwards compatibility
    - Allows admins to optionally add MVP links to portfolio items
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'portfolio_playbooks' AND column_name = 'mvp_url'
  ) THEN
    ALTER TABLE portfolio_playbooks ADD COLUMN mvp_url text;
  END IF;
END $$;