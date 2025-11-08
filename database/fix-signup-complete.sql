-- ============================================
-- 🔧 Complete Signup Database Fix
-- ============================================
-- This script ensures all tables, RLS policies, and triggers are set up correctly
-- Run this in your Supabase SQL Editor to fix "Database error saving new user"
--
-- Instructions:
-- 1. Open Supabase Dashboard → SQL Editor
-- 2. Paste and run this entire script
-- 3. Verify tables exist in Table Editor
-- 4. Test signup again
-- ============================================

-- ============================================
-- 1️⃣ CREATE TABLES (if they don't exist)
-- ============================================

-- Profiles table (main user data)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  base_language VARCHAR(10) DEFAULT 'en' CHECK (base_language IN ('en', 'ar', 'nl', 'id', 'ms', 'th', 'km')),
  learning_languages TEXT[] DEFAULT ARRAY['en']::TEXT[],
  level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (fallback table for compatibility)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  learning_language VARCHAR(10) DEFAULT 'en' CHECK (learning_language IN ('en', 'ar', 'nl', 'id', 'ms', 'th', 'km')),
  native_language VARCHAR(10) DEFAULT 'en' CHECK (native_language IN ('en', 'ar', 'nl', 'id', 'ms', 'th', 'km')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2️⃣ ENABLE RLS
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3️⃣ DROP EXISTING POLICIES (to avoid conflicts)
-- ============================================

-- Drop all existing policies on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can access and modify their own profile" ON public.profiles;

-- Drop all existing policies on users
DROP POLICY IF EXISTS "Users can view own user data" ON public.users;
DROP POLICY IF EXISTS "Users can update own user data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own user data" ON public.users;
DROP POLICY IF EXISTS "Users can delete own user data" ON public.users;
DROP POLICY IF EXISTS "Users can access and modify their own data" ON public.users;

-- ============================================
-- 4️⃣ CREATE RLS POLICIES FOR PROFILES
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = id);

-- ============================================
-- 5️⃣ CREATE RLS POLICIES FOR USERS TABLE
-- ============================================

-- Users can view their own data
CREATE POLICY "Users can view own user data" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own user data" 
ON public.users 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can insert their own data
CREATE POLICY "Users can insert own user data" 
ON public.users 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Users can delete their own data
CREATE POLICY "Users can delete own user data" 
ON public.users 
FOR DELETE 
USING (auth.uid() = id);

-- ============================================
-- 6️⃣ CREATE TRIGGER FUNCTION FOR AUTO-PROFILE CREATION
-- ============================================
-- This automatically creates a profile when a new user signs up
-- Note: Service role bypasses this, but it helps for OAuth signups

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Try to insert into profiles table
  INSERT INTO public.profiles (id, name, email, base_language, learning_languages)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1),
      'User'
    ),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'native_language', 'en'),
    COALESCE(
      ARRAY(SELECT json_array_elements_text(NEW.raw_user_meta_data->'learning_languages')),
      ARRAY['en']::TEXT[]
    )
  )
  ON CONFLICT (id) DO NOTHING;

  -- Fallback: Also try users table if profiles failed
  INSERT INTO public.users (id, name, email, native_language, learning_language)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1),
      'User'
    ),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'native_language', 'en'),
    COALESCE(
      (NEW.raw_user_meta_data->'learning_languages'->>0),
      'en'
    )
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- ============================================
-- 7️⃣ CREATE TRIGGER ON auth.users
-- ============================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 8️⃣ VERIFY SETUP
-- ============================================

-- Check tables exist
SELECT 
  'profiles' as table_name,
  EXISTS(SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') as exists
UNION ALL
SELECT 
  'users' as table_name,
  EXISTS(SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') as exists;

-- Check RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'users');

-- Check policies exist
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  CASE 
    WHEN with_check IS NOT NULL THEN 'WITH CHECK'
    WHEN qual IS NOT NULL THEN 'USING'
    ELSE 'N/A'
  END as policy_type
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'users')
ORDER BY tablename, cmd, policyname;

-- Check trigger exists
SELECT 
  trigger_name,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- ============================================
-- ✅ SETUP COMPLETE!
-- ============================================
-- Your database is now configured correctly for signup.
-- The service role key will bypass RLS policies when creating profiles.
--
-- Next steps:
-- 1. Test signup in your app
-- 2. Check browser console for any errors
-- 3. Verify profile was created in Supabase Table Editor
-- ============================================

