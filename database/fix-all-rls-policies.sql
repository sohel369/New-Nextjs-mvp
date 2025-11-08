-- 🔒 Complete RLS Policy Fix for All Tables
-- Run this in Supabase SQL Editor to fix all RLS policy issues
-- This ensures authenticated users can access their own data

-- ============================================
-- 1. QUIZ_HISTORY TABLE
-- ============================================
-- Enable RLS if not already enabled
ALTER TABLE quiz_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own quiz history" ON quiz_history;
DROP POLICY IF EXISTS "Users can insert own quiz history" ON quiz_history;
DROP POLICY IF EXISTS "Users can update own quiz history" ON quiz_history;
DROP POLICY IF EXISTS "Users can delete own quiz history" ON quiz_history;
DROP POLICY IF EXISTS "Users can access own quiz history" ON quiz_history;

-- Create new policies
CREATE POLICY "Users can view own quiz history" ON quiz_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz history" ON quiz_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quiz history" ON quiz_history
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own quiz history" ON quiz_history
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 2. PROFILES TABLE
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;
DROP POLICY IF EXISTS "Public can view profiles" ON profiles;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Optional: Allow users to delete their own profile
CREATE POLICY "Users can delete own profile" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- Optional: Public read access for leaderboard (if needed)
-- CREATE POLICY "Public can view profiles" ON profiles
--   FOR SELECT USING (true);

-- ============================================
-- 3. USER_SETTINGS TABLE
-- ============================================
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can delete own settings" ON user_settings;

CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own settings" ON user_settings
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 4. USERS TABLE (if exists separately)
-- ============================================
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
    ALTER TABLE users ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Users can view own user data" ON users;
    DROP POLICY IF EXISTS "Users can update own user data" ON users;
    DROP POLICY IF EXISTS "Users can insert own user data" ON users;
    
    CREATE POLICY "Users can view own user data" ON users
      FOR SELECT USING (auth.uid() = id);
    
    CREATE POLICY "Users can update own user data" ON users
      FOR UPDATE USING (auth.uid() = id);
    
    CREATE POLICY "Users can insert own user data" ON users
      FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- ============================================
-- 5. LEADERBOARD VIEW
-- ============================================
-- Leaderboard is a VIEW, so RLS on underlying tables applies
-- But we can make it publicly readable if needed
-- The view itself doesn't need RLS, but ensure profiles table allows read access
-- (uncomment the public read policy above if you want public leaderboard)

-- ============================================
-- 6. USER_PROGRESS TABLE
-- ============================================
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_progress') THEN
    ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
    DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
    DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
    
    CREATE POLICY "Users can view own progress" ON user_progress
      FOR SELECT USING (auth.uid() = user_id);
    
    CREATE POLICY "Users can insert own progress" ON user_progress
      FOR INSERT WITH CHECK (auth.uid() = user_id);
    
    CREATE POLICY "Users can update own progress" ON user_progress
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- ============================================
-- 7. USER_QUIZ_ATTEMPTS TABLE
-- ============================================
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_quiz_attempts') THEN
    ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Users can view own quiz attempts" ON user_quiz_attempts;
    DROP POLICY IF EXISTS "Users can insert own quiz attempts" ON user_quiz_attempts;
    
    CREATE POLICY "Users can view own quiz attempts" ON user_quiz_attempts
      FOR SELECT USING (auth.uid() = user_id);
    
    CREATE POLICY "Users can insert own quiz attempts" ON user_quiz_attempts
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- ============================================
-- 8. VERIFY POLICIES
-- ============================================
-- Check that all policies were created successfully
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('quiz_history', 'profiles', 'user_settings', 'users', 'user_progress', 'user_quiz_attempts')
ORDER BY tablename, policyname;

-- ============================================
-- ✅ SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ All RLS policies have been created/updated successfully!';
  RAISE NOTICE '📝 Verify the policies above to ensure they are correct.';
  RAISE NOTICE '🔄 Restart your Next.js app after running this script.';
END $$;


