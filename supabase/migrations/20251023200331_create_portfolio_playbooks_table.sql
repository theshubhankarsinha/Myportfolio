/*
  # Create Portfolio Playbooks Table

  1. New Tables
    - `portfolio_playbooks`
      - `id` (uuid, primary key)
      - `title` (text) - The playbook title
      - `teaser` (text) - Short description shown on card
      - `icon_name` (text) - Lucide icon name (optional)
      - `challenge` (text) - The Challenge section content
      - `actions` (text[]) - Array of conductor actions taken
      - `result` (text) - The Result/outcome
      - `image_url` (text) - Optional image for the modal
      - `display_order` (integer) - Order to display cards
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `portfolio_playbooks` table
    - Add policy for public read access (anyone can view playbooks)
    - Add policy for authenticated admins to manage playbooks
*/

CREATE TABLE IF NOT EXISTS portfolio_playbooks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  teaser text NOT NULL,
  icon_name text,
  challenge text NOT NULL,
  actions text[] NOT NULL DEFAULT '{}',
  result text NOT NULL,
  image_url text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE portfolio_playbooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view playbooks"
  ON portfolio_playbooks
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert playbooks"
  ON portfolio_playbooks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update playbooks"
  ON portfolio_playbooks
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete playbooks"
  ON portfolio_playbooks
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert placeholder playbooks
INSERT INTO portfolio_playbooks (title, teaser, icon_name, challenge, actions, result, display_order) VALUES
(
  'The "$0-to-Acquisition" Playbook',
  'A case study in launching, funding, and exiting a recycling venture.',
  'Recycle',
  'Launch a sustainable recycling venture from the ground up with zero initial funding, secure investment, and position for acquisition.',
  ARRAY[
    'Conducted comprehensive market research to identify gaps in the recycling industry',
    'Built a compelling pitch deck highlighting environmental impact and financial projections',
    'Applied lean startup methodology to validate the business model with minimal resources',
    'Established strategic partnerships with industry leaders and waste management companies'
  ],
  'Successfully raised $250K in seed funding, grew operations to serve 50+ commercial clients, and managed the venture to a full acquisition by an industry expert within 18 months.',
  1
),
(
  'The "Waste Reduction" Playbook',
  'Applying Lean Six Sigma to cut material waste for a foam manufacturer.',
  'Factory',
  'A foam manufacturing company was experiencing 15% material waste in production, significantly impacting profit margins and sustainability goals.',
  ARRAY[
    'Led a comprehensive Lean Six Sigma analysis to identify waste sources in the production line',
    'Implemented process improvements and real-time monitoring systems',
    'Trained production teams on waste reduction best practices and continuous improvement',
    'Established KPIs and dashboards to track waste metrics in real-time'
  ],
  'Reduced material waste from 15% to 4% within 6 months, saving $180K annually and improving the company''s environmental footprint.',
  2
),
(
  'The "Financial Clarity" Playbook',
  'Guiding a BIPOC-owned business to build bank-ready financial statements.',
  'TrendingUp',
  'A growing BIPOC-owned consulting firm needed structured financial statements to secure a business line of credit but lacked proper financial systems.',
  ARRAY[
    'Assessed existing financial processes and identified gaps in documentation',
    'Implemented QuickBooks with customized chart of accounts and reporting structure',
    'Trained the business owner on financial management best practices and cash flow forecasting',
    'Prepared comprehensive financial packages including P&L, balance sheets, and cash flow statements'
  ],
  'Delivered bank-ready financial statements within 60 days, enabling the business to secure a $100K line of credit and establish quarterly financial review processes.',
  3
);
