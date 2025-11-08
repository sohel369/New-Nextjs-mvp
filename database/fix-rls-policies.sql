-- ============================================
-- 🔧 Fix RLS Policies for Profiles Table
-- ============================================
-- This script fixes RLS policies to use the correct column (id, not user_id)
-- Run this in your Supabase SQL Editor
-- ============================================

-- 🧹 Step 1: Clean up duplicates and incorrect policies
-- Drop duplicate or conflicting policies safely
DROP POLICY IF EXISTS "Users read only own data" ON public.profiles;
DROP POLICY IF EXISTS "Users insert own data" ON public.profiles;
DROP POLICY IF EXISTS "Users update own data" ON public.profiles;
DROP POLICY IF EXISTS "Users delete own data" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can access and modify their own profile" ON public.profiles;

-- 🔒 Step 2: Ensure Row Level Security is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 🛠 Step 3: Create proper RLS policies using the correct column (id, not user_id)
-- The profiles table uses 'id' as the primary key that references auth.users(id)

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- ============================================
-- 🔧 Fix RLS Policies for Users Table (if exists)
-- ============================================

-- Drop existing policies on users table
DROP POLICY IF EXISTS "Users read only own data" ON public.users;
DROP POLICY IF EXISTS "Users insert own data" ON public.users;
DROP POLICY IF EXISTS "Users update own data" ON public.users;
DROP POLICY IF EXISTS "Users delete own data" ON public.users;
DROP POLICY IF EXISTS "Users can view own user data" ON public.users;
DROP POLICY IF EXISTS "Users can update own user data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own user data" ON public.users;
DROP POLICY IF EXISTS "Users can delete own user data" ON public.users;
DROP POLICY IF EXISTS "Users can access and modify their own data" ON public.users;

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table (also uses 'id' column)
CREATE POLICY "Users can view own user data"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can insert own user data"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own user data"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own user data"
ON public.users
FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- ============================================
-- ✅ Step 4: Verify Policies
-- ============================================

-- Check that policies were created
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

-- ============================================
-- ✅ Success!
-- ============================================
-- After running this script:
-- 1. Go to Supabase → Table Editor → profiles → Policies tab
-- 2. You should see 4 policies: SELECT, INSERT, UPDATE, DELETE
-- 3. All policies should use: auth.uid() = id
-- ============================================

