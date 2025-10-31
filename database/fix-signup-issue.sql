-- Fix Signup Issue: Create/Update users table to support signup flow
-- Run this in your Supabase SQL Editor to fix the user registration issue

-- 1. Create/Update users table to match signup expectations
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  -- Support both array and singular for backward compatibility
  learning_languages TEXT[] DEFAULT ARRAY['ar'],
  learning_language VARCHAR(10) DEFAULT 'ar' CHECK (learning_language IN ('en', 'ar', 'nl', 'id', 'ms', 'th', 'km')),
  native_language VARCHAR(10) DEFAULT 'en' CHECK (native_language IN ('en', 'ar', 'nl', 'id', 'ms', 'th', 'km')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. If users table already exists, add missing columns
DO $$ 
BEGIN
  -- Add learning_languages array column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'learning_languages'
  ) THEN
    ALTER TABLE users ADD COLUMN learning_languages TEXT[] DEFAULT ARRAY['ar'];
  END IF;

  -- Add learning_language column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'learning_language'
  ) THEN
    ALTER TABLE users ADD COLUMN learning_language VARCHAR(10) DEFAULT 'ar';
  END IF;

  -- Add native_language column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'native_language'
  ) THEN
    ALTER TABLE users ADD COLUMN native_language VARCHAR(10) DEFAULT 'en';
  END IF;
END $$;

-- 3. Create/Update profiles table (primary user data)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  base_language VARCHAR(10) DEFAULT 'en' CHECK (base_language IN ('en', 'ar', 'nl', 'id', 'ms', 'th', 'km')),
  learning_languages TEXT[] DEFAULT ARRAY['ar'],
  level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable RLS on both tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own user data" ON users;
DROP POLICY IF EXISTS "Users can update own user data" ON users;
DROP POLICY IF EXISTS "Users can insert own user data" ON users;
DROP POLICY IF EXISTS "Users can delete own user data" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;

-- 6. Create RLS policies for users table
CREATE POLICY "Users can view own user data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own user data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own user data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own user data" ON users
  FOR DELETE USING (auth.uid() = id);

-- 7. Create RLS policies for profiles table
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- 8. Create function to sync learning_language from learning_languages array
CREATE OR REPLACE FUNCTION sync_learning_language()
RETURNS TRIGGER AS $$
BEGIN
  -- If learning_languages array is updated, sync the first element to learning_language
  IF NEW.learning_languages IS NOT NULL AND array_length(NEW.learning_languages, 1) > 0 THEN
    NEW.learning_language := NEW.learning_languages[1];
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Create trigger to auto-sync learning_language
DROP TRIGGER IF EXISTS sync_learning_language_trigger ON users;
CREATE TRIGGER sync_learning_language_trigger
  BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION sync_learning_language();

-- 10. Verify tables exist and show structure
SELECT 
  'users' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

SELECT 
  'profiles' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

