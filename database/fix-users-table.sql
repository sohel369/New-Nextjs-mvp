-- Fix users table to match AuthContext expectations
-- This creates the users table that the AuthContext is trying to query

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  learning_language VARCHAR(10) DEFAULT 'ar' CHECK (learning_language IN ('en', 'ar', 'nl', 'id', 'ms', 'th', 'km')),
  native_language VARCHAR(10) DEFAULT 'en' CHECK (native_language IN ('en', 'ar', 'nl', 'id', 'ms', 'th', 'km')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Users can insert their own data
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy: Users can delete their own data
CREATE POLICY "Users can delete own profile" ON users
  FOR DELETE USING (auth.uid() = id);

-- Insert some sample data if needed (optional)
-- INSERT INTO users (id, name, email, learning_language, native_language) VALUES
-- ('00000000-0000-0000-0000-000000000000', 'Sample User', 'sample@example.com', 'ar', 'en')
-- ON CONFLICT (id) DO NOTHING;
