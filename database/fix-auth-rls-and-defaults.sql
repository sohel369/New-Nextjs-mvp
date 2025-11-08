-- ============================================
-- 🔧 Fix Supabase Auth, RLS Policies, and Default Data
-- ============================================
-- This script fixes Row Level Security (RLS) policies and sets up
-- automatic default data creation for new users.
-- 
-- 📝 Instructions:
-- 1. Open your Supabase project dashboard
-- 2. Go to SQL Editor
-- 3. Paste and run this entire script
-- 4. Verify policies in: Table Editor → Select table → Policies tab
--
-- ============================================

-- ============================================
-- 1️⃣ Enable RLS on All Tables
-- ============================================
-- Enable Row Level Security for all tables used by your app

-- Note: Some tables might already have RLS enabled, that's okay
DO $$ 
BEGIN
  -- Enable RLS on profiles (if exists)
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'RLS enabled on profiles';
  END IF;

  -- Enable RLS on users (if exists and different from profiles)
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
    ALTER TABLE users ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'RLS enabled on users';
  END IF;

  -- Enable RLS on quiz_history
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_history') THEN
    ALTER TABLE quiz_history ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'RLS enabled on quiz_history';
  END IF;

  -- Enable RLS on quiz_stats (if exists)
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_stats') THEN
    ALTER TABLE quiz_stats ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'RLS enabled on quiz_stats';
  END IF;

  -- Enable RLS on user_settings
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_settings') THEN
    ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'RLS enabled on user_settings';
  END IF;

  -- Enable RLS on leaderboard (if it's a table, not a view)
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'leaderboard') THEN
    ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'RLS enabled on leaderboard';
  END IF;
END $$;

-- ============================================
-- 2️⃣ Drop Existing Policies (if any)
-- ============================================
-- Remove old policies before creating new ones to avoid conflicts

DO $$ 
BEGIN
  -- Drop policies on profiles
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    DROP POLICY IF EXISTS "Users can access and modify their own data" ON profiles;
    DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
  END IF;

  -- Drop policies on users
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
    DROP POLICY IF EXISTS "Users can access and modify their own data" ON users;
  END IF;

  -- Drop policies on user_settings
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_settings') THEN
    DROP POLICY IF EXISTS "Users can read/write their own settings" ON user_settings;
    DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
    DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;
    DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
  END IF;

  -- Drop policies on quiz_history
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_history') THEN
    DROP POLICY IF EXISTS "Users can read/write their own quiz history" ON quiz_history;
    DROP POLICY IF EXISTS "Users can view own quiz history" ON quiz_history;
    DROP POLICY IF EXISTS "Users can insert own quiz history" ON quiz_history;
    DROP POLICY IF EXISTS "Users can update own quiz history" ON quiz_history;
    DROP POLICY IF EXISTS "Users can delete own quiz history" ON quiz_history;
  END IF;

  -- Drop policies on quiz_stats
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_stats') THEN
    DROP POLICY IF EXISTS "Users can read/write their own quiz stats" ON quiz_stats;
  END IF;

  -- Drop policies on leaderboard
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'leaderboard') THEN
    DROP POLICY IF EXISTS "Leaderboard is public read-only" ON leaderboard;
  END IF;
END $$;

-- ============================================
-- 3️⃣ Create RLS Policies
-- ============================================

-- ✅ Profiles table (main user table, references auth.users)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    CREATE POLICY "Users can access and modify their own profile"
    ON profiles
    FOR ALL
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
    
    RAISE NOTICE 'Policy created for profiles';
  END IF;
END $$;

-- ✅ Users table (if separate from profiles)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
    CREATE POLICY "Users can access and modify their own data"
    ON users
    FOR ALL
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
    
    RAISE NOTICE 'Policy created for users';
  END IF;
END $$;

-- ✅ user_settings
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_settings') THEN
    CREATE POLICY "Users can read/write their own settings"
    ON user_settings
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
    
    RAISE NOTICE 'Policy created for user_settings';
  END IF;
END $$;

-- ✅ quiz_history
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_history') THEN
    CREATE POLICY "Users can read/write their own quiz history"
    ON quiz_history
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
    
    RAISE NOTICE 'Policy created for quiz_history';
  END IF;
END $$;

-- ✅ quiz_stats (if table exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_stats') THEN
    CREATE POLICY "Users can read/write their own quiz stats"
    ON quiz_stats
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
    
    RAISE NOTICE 'Policy created for quiz_stats';
  END IF;
END $$;

-- ✅ leaderboard (public read-only if it's a table)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'leaderboard') THEN
    CREATE POLICY "Leaderboard is public read-only"
    ON leaderboard
    FOR SELECT
    USING (true);
    
    RAISE NOTICE 'Policy created for leaderboard table';
  ELSIF EXISTS (SELECT FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'leaderboard') THEN
    RAISE NOTICE 'Leaderboard is a view, no RLS policy needed for views';
  END IF;
END $$;

-- ============================================
-- 4️⃣ Create Trigger Function for Auto-Defaults
-- ============================================
-- This function automatically creates default settings and stats
-- when a new user signs up

CREATE OR REPLACE FUNCTION handle_new_user_defaults()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert default user_settings if table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_settings') THEN
    INSERT INTO user_settings (user_id, base_language, learning_languages, dark_mode, notifications_enabled, sound_enabled)
    VALUES (
      NEW.id,
      'en',
      ARRAY['en']::TEXT[],
      true,
      true,
      true
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  -- Insert default quiz_stats if table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quiz_stats') THEN
    INSERT INTO quiz_stats (user_id, total_quizzes, correct_answers)
    VALUES (NEW.id, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  -- Create profile entry if profiles table exists and not already created
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    INSERT INTO profiles (id, name, email, base_language, learning_languages)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1), 'User'),
      NEW.email,
      'en',
      ARRAY['en']::TEXT[]
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- ============================================
-- 5️⃣ Create Trigger on auth.users
-- ============================================
-- This trigger fires when a new user is created in auth.users

DROP TRIGGER IF EXISTS create_user_defaults ON auth.users;

CREATE TRIGGER create_user_defaults
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user_defaults();

-- ============================================
-- 6️⃣ Optional: Manual Insert for Existing Users
-- ============================================
-- If you want to create default data for existing users,
-- run this with your actual user UUID

/*
-- Find your user UUID first:
SELECT id, email FROM auth.users;

-- Then insert default data (replace YOUR_USER_UUID with actual UUID):

-- For user_settings
INSERT INTO user_settings (user_id, base_language, learning_languages, dark_mode)
VALUES ('YOUR_USER_UUID', 'en', ARRAY['en'], true)
ON CONFLICT (user_id) DO NOTHING;

-- For quiz_stats (if table exists)
INSERT INTO quiz_stats (user_id, total_quizzes, correct_answers)
VALUES ('YOUR_USER_UUID', 0, 0)
ON CONFLICT (user_id) DO NOTHING;
*/

-- ============================================
-- 7️⃣ Verify Setup
-- ============================================
-- Run these queries to verify everything is set up correctly:

/*
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'users', 'user_settings', 'quiz_history', 'quiz_stats', 'leaderboard');

-- Check policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'users', 'user_settings', 'quiz_history', 'quiz_stats', 'leaderboard');

-- Check trigger exists
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_name = 'create_user_defaults';
*/

-- ============================================
-- ✅ Setup Complete!
-- ============================================
-- All RLS policies are now configured.
-- New users will automatically get default settings and stats.
-- 
-- Next steps:
-- 1. Test login/signup flow
-- 2. Verify data is accessible after login
-- 3. Check console logs for any RLS errors
-- ============================================


