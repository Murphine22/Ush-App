/*
  # Finance Management Database Schema

  1. New Tables
    - `members`
      - `id` (uuid, primary key)
      - `name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `member_payments`
      - `id` (uuid, primary key)
      - `member_id` (uuid, foreign key)
      - `year` (integer)
      - `month` (integer, 0-11)
      - `amount` (numeric, default 500)
      - `paid` (boolean, default false)
      - `payment_date` (date, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `contributions`
      - `id` (uuid, primary key)
      - `member_name` (text)
      - `amount` (numeric)
      - `description` (text)
      - `date` (date)
      - `year` (integer)
      - `month` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `donations`
      - `id` (uuid, primary key)
      - `member_name` (text)
      - `amount` (numeric)
      - `description` (text)
      - `date` (date)
      - `year` (integer)
      - `month` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `expenses`
      - `id` (uuid, primary key)
      - `amount` (numeric)
      - `description` (text)
      - `date` (date)
      - `year` (integer)
      - `month` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `balances_brought_forward`
      - `id` (uuid, primary key)
      - `year` (integer, unique)
      - `amount` (numeric)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `announcements`
      - `id` (uuid, primary key)
      - `title` (text)
      - `priority` (text, check constraint)
      - `event_date` (date, nullable)
      - `venue` (text, nullable)
      - `content` (text)
      - `sender_name` (text)
      - `attachment_urls` (jsonb, nullable)
      - `is_pinned` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage data
    - Add policies for public read access where appropriate

  3. Indexes
    - Add indexes for frequently queried columns
    - Add composite indexes for year/month queries
*/

-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create member_payments table
CREATE TABLE IF NOT EXISTS member_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES members(id) ON DELETE CASCADE,
  year integer NOT NULL,
  month integer NOT NULL CHECK (month >= 0 AND month <= 11),
  amount numeric DEFAULT 500,
  paid boolean DEFAULT false,
  payment_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(member_id, year, month)
);

-- Create contributions table
CREATE TABLE IF NOT EXISTS contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_name text NOT NULL,
  amount numeric NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  year integer NOT NULL,
  month integer NOT NULL CHECK (month >= 0 AND month <= 11),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_name text NOT NULL,
  amount numeric NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  year integer NOT NULL,
  month integer NOT NULL CHECK (month >= 0 AND month <= 11),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount numeric NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  year integer NOT NULL,
  month integer NOT NULL CHECK (month >= 0 AND month <= 11),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create balances_brought_forward table
CREATE TABLE IF NOT EXISTS balances_brought_forward (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer UNIQUE NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  priority text NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')),
  event_date date,
  venue text,
  content text NOT NULL,
  sender_name text NOT NULL,
  attachment_urls jsonb,
  is_pinned boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE balances_brought_forward ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Create policies for members
CREATE POLICY "Anyone can read members"
  ON members
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage members"
  ON members
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for member_payments
CREATE POLICY "Anyone can read member payments"
  ON member_payments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage member payments"
  ON member_payments
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for contributions
CREATE POLICY "Anyone can read contributions"
  ON contributions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage contributions"
  ON contributions
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for donations
CREATE POLICY "Anyone can read donations"
  ON donations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage donations"
  ON donations
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for expenses
CREATE POLICY "Anyone can read expenses"
  ON expenses
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage expenses"
  ON expenses
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for balances_brought_forward
CREATE POLICY "Anyone can read balances brought forward"
  ON balances_brought_forward
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage balances brought forward"
  ON balances_brought_forward
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for announcements
CREATE POLICY "Anyone can read announcements"
  ON announcements
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage announcements"
  ON announcements
  FOR ALL
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_member_payments_member_year ON member_payments(member_id, year);
CREATE INDEX IF NOT EXISTS idx_member_payments_year_month ON member_payments(year, month);
CREATE INDEX IF NOT EXISTS idx_contributions_year_month ON contributions(year, month);
CREATE INDEX IF NOT EXISTS idx_donations_year_month ON donations(year, month);
CREATE INDEX IF NOT EXISTS idx_expenses_year_month ON expenses(year, month);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_pinned ON announcements(is_pinned, created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_member_payments_updated_at BEFORE UPDATE ON member_payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contributions_updated_at BEFORE UPDATE ON contributions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_balances_brought_forward_updated_at BEFORE UPDATE ON balances_brought_forward FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();