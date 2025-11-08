-- ============================================
-- 🚀 Setup Profiles Table for New Supabase Project
-- ============================================
-- Run this in Supabase SQL Editor to create the profiles table
-- This is required for user signup to work
-- ============================================

-- Step 1: Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  native_language VARCHAR(10) DEFAULT 'en',
  learning_language VARCHAR(10) DEFAULT 'en',
  learning_languages TEXT[] DEFAULT ARRAY['en']::TEXT[],
  level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Step 3: Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop existing policies (if any) to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Service role can update profiles" ON public.profiles;

-- Step 5: Create RLS policies

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
CREATE POLICY "Service role can insert profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service role can update profiles" 
ON public.profiles 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Step 6: Disable trigger (API handles profile creation)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 7: Verify setup
SELECT 
  'profiles' as table_name,
  EXISTS(SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') as exists;

-- ============================================
-- ✅ Setup Complete!
-- ============================================
-- Your profiles table is now ready for user signup.
-- The signup API will create profiles using the service role key.
-- ============================================

