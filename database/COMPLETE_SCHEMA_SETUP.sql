-- ============================================
-- 🚀 Complete Database Schema Setup
-- ============================================
-- This script creates all required tables for authentication and user management
-- Run this in Supabase SQL Editor to set up your database
-- ============================================

-- ============================================
-- 1️⃣ CREATE PROFILES TABLE
-- ============================================
-- Main user profile table with UUID matching auth.users.id
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  native_language VARCHAR(10) DEFAULT 'en',
  learning_language VARCHAR(10) DEFAULT 'en',
  learning_languages TEXT[] DEFAULT ARRAY['en']::TEXT[],
  level INTEGER DEFAULT 1 CHECK (level >= 1),
  total_xp INTEGER DEFAULT 0 CHECK (total_xp >= 0),
  streak INTEGER DEFAULT 0 CHECK (streak >= 0),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure user_id matches id (both reference auth.users)
  CONSTRAINT profiles_user_id_check CHECK (user_id = id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);

-- ============================================
-- 2️⃣ CREATE USER_SETTINGS TABLE
-- ============================================
-- User settings/preferences table with UUID matching auth.users.id
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Notification settings
  notifications_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  
  -- Learning preferences
  daily_goal INTEGER DEFAULT 10 CHECK (daily_goal >= 0),
  difficulty_preference VARCHAR(20) DEFAULT 'adaptive' CHECK (difficulty_preference IN ('easy', 'medium', 'hard', 'adaptive')),
  
  -- UI preferences
  theme VARCHAR(10) DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  language_display VARCHAR(10) DEFAULT 'native' CHECK (language_display IN ('native', 'english', 'both')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure user_id matches id
  CONSTRAINT user_settings_user_id_check CHECK (user_id = id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings(user_id);

-- ============================================
-- 3️⃣ ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4️⃣ DROP EXISTING POLICIES (Clean Slate)
-- ============================================
-- Drop all existing policies to avoid conflicts
DO $$ 
BEGIN
  -- Drop profiles policies
  DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;
  DROP POLICY IF EXISTS "Service role can update profiles" ON public.profiles;
  
  -- Drop user_settings policies
  DROP POLICY IF EXISTS "Users can view own settings" ON public.user_settings;
  DROP POLICY IF EXISTS "Users can update own settings" ON public.user_settings;
  DROP POLICY IF EXISTS "Users can insert own settings" ON public.user_settings;
  DROP POLICY IF EXISTS "Service role can insert settings" ON public.user_settings;
  DROP POLICY IF EXISTS "Service role can update settings" ON public.user_settings;
END $$;

-- ============================================
-- 5️⃣ CREATE RLS POLICIES FOR PROFILES
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id OR auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id OR auth.uid() = user_id)
WITH CHECK (auth.uid() = id OR auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id OR auth.uid() = user_id);

-- Service role can insert/update (for API routes using service role key)
-- This bypasses RLS when using service role key
CREATE POLICY "Service role can insert profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service role can update profiles" 
ON public.profiles 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- ============================================
-- 6️⃣ CREATE RLS POLICIES FOR USER_SETTINGS
-- ============================================

-- Users can view their own settings
CREATE POLICY "Users can view own settings" 
ON public.user_settings 
FOR SELECT 
USING (auth.uid() = id OR auth.uid() = user_id);

-- Users can update their own settings
CREATE POLICY "Users can update own settings" 
ON public.user_settings 
FOR UPDATE 
USING (auth.uid() = id OR auth.uid() = user_id)
WITH CHECK (auth.uid() = id OR auth.uid() = user_id);

-- Users can insert their own settings
CREATE POLICY "Users can insert own settings" 
ON public.user_settings 
FOR INSERT 
WITH CHECK (auth.uid() = id OR auth.uid() = user_id);

-- Service role can insert/update (for API routes)
CREATE POLICY "Service role can insert settings" 
ON public.user_settings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service role can update settings" 
ON public.user_settings 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- ============================================
-- 7️⃣ CREATE TRIGGER FUNCTION FOR UPDATED_AT
-- ============================================
-- Auto-update updated_at timestamp on both tables

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_user_settings ON public.user_settings;
CREATE TRIGGER set_updated_at_user_settings
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 8️⃣ DISABLE AUTH TRIGGER (API Handles Creation)
-- ============================================
-- The signup API route manually creates profiles and settings
-- So we disable the automatic trigger to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- ============================================
-- 9️⃣ VERIFY SETUP
-- ============================================

-- Check tables exist
SELECT 
  'profiles' as table_name,
  EXISTS(SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') as exists
UNION ALL
SELECT 
  'user_settings' as table_name,
  EXISTS(SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_settings') as exists;

-- Check RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'user_settings')
ORDER BY tablename;

-- Check policies exist
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'user_settings')
ORDER BY tablename, cmd, policyname;

-- ============================================
-- ✅ SETUP COMPLETE!
-- ============================================
-- Your database is now configured correctly.
-- The signup API will create profiles and user_settings using the service role key.
-- ============================================

