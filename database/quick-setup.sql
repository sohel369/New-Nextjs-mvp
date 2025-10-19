-- Quick Database Setup for Language Learning App
-- Run this in your Supabase SQL Editor to fix the authentication issues

-- 1. Create profiles table (main user data)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  base_language VARCHAR(10) DEFAULT 'en' CHECK (base_language IN ('en', 'ar', 'nl', 'id', 'ms', 'th', 'km')),
  learning_languages TEXT[] DEFAULT ARRAY['en'],
  level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create users table (for AuthContext compatibility)
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

-- 3. Enable RLS on both tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for profiles table
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- 5. Create RLS policies for users table
CREATE POLICY "Users can view own user data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own user data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own user data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own user data" ON users
  FOR DELETE USING (auth.uid() = id);

-- 6. Create function to sync data between profiles and users tables
CREATE OR REPLACE FUNCTION sync_user_data()
RETURNS TRIGGER AS $$
BEGIN
  -- When a profile is updated, update the corresponding user record
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    INSERT INTO users (id, name, email, level, total_xp, streak, learning_language, native_language)
    VALUES (
      NEW.id,
      NEW.name,
      NEW.email,
      NEW.level,
      NEW.total_xp,
      NEW.streak,
      COALESCE(NEW.learning_languages[1], 'ar'),
      NEW.base_language
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      email = EXCLUDED.email,
      level = EXCLUDED.level,
      total_xp = EXCLUDED.total_xp,
      streak = EXCLUDED.streak,
      learning_language = EXCLUDED.learning_language,
      native_language = EXCLUDED.native_language,
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger to sync data
DROP TRIGGER IF EXISTS sync_user_data_trigger ON profiles;
CREATE TRIGGER sync_user_data_trigger
  AFTER INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_data();

-- 8. Verify tables exist
SELECT 'profiles' as table_name, count(*) as row_count FROM profiles
UNION ALL
SELECT 'users' as table_name, count(*) as row_count FROM users;
