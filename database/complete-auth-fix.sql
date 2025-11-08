-- ============================================
-- 🔧 Complete Authentication & Database Fix
-- ============================================
-- This script fixes:
-- 1. Auto-profile creation trigger
-- 2. RLS policies for profiles table
-- 3. user_id column setup
-- Run this in your Supabase SQL Editor
-- ============================================

-- ============================================
-- Step 0: Ensure updated_at Column Exists
-- ============================================

-- Add updated_at column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    
    UPDATE public.profiles 
    SET updated_at = COALESCE(created_at, NOW())
    WHERE updated_at IS NULL;
    
    RAISE NOTICE '✅ Added updated_at column to profiles table';
  END IF;
END $$;

-- ============================================
-- Step 1: Ensure Profiles Table Structure
-- ============================================

-- Check and add user_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'user_id'
  ) THEN
    -- Add user_id column
    ALTER TABLE public.profiles 
    ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    
    -- Copy id values to user_id for existing rows (if id exists)
    IF EXISTS (
      SELECT 1 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'id'
    ) THEN
      UPDATE public.profiles 
      SET user_id = id 
      WHERE user_id IS NULL;
    END IF;
    
    -- Make user_id NOT NULL after populating
    ALTER TABLE public.profiles 
    ALTER COLUMN user_id SET NOT NULL;
    
    RAISE NOTICE '✅ Added user_id column to profiles table';
  ELSE
    RAISE NOTICE 'ℹ️ user_id column already exists';
  END IF;
END $$;

-- Ensure id column references auth.users if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'id'
  ) THEN
    -- Check if foreign key exists
    IF NOT EXISTS (
      SELECT 1 
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_schema = 'public' 
      AND tc.table_name = 'profiles'
      AND tc.constraint_type = 'FOREIGN KEY'
      AND kcu.column_name = 'id'
    ) THEN
      ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_id_fkey 
      FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
      
      RAISE NOTICE '✅ Added foreign key constraint on id column';
    END IF;
  END IF;
END $$;

-- ============================================
-- Step 2: Create/Replace Trigger Function
-- ============================================

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Create the trigger function that auto-creates profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  has_updated_at BOOLEAN;
BEGIN
  -- Check if updated_at column exists
  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'updated_at'
  ) INTO has_updated_at;
  
  -- Insert into profiles table when a new user is created
  IF has_updated_at THEN
    -- Insert with updated_at column
    INSERT INTO public.profiles (
      id,
      user_id,
      email,
      name,
      level,
      total_xp,
      streak,
      native_language,
      learning_language,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id,  -- Use auth.users.id as profiles.id
      NEW.id,  -- Also set user_id to the same value
      NEW.email,
      COALESCE(
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'full_name',
        split_part(NEW.email, '@', 1),
        'User'
      ),
      1,  -- Default level
      0,  -- Default XP
      0,  -- Default streak
      COALESCE(NEW.raw_user_meta_data->>'native_language', 'en'),
      COALESCE(
        (NEW.raw_user_meta_data->'learning_languages'->>0),
        (NEW.raw_user_meta_data->>'learning_language'),
        'en'
      ),
      NOW(),  -- created_at
      NOW()   -- updated_at
    )
    ON CONFLICT (id) DO UPDATE SET
      -- Update if profile already exists (idempotent)
      email = EXCLUDED.email,
      name = COALESCE(EXCLUDED.name, profiles.name),
      user_id = EXCLUDED.user_id,
      updated_at = NOW();
  ELSE
    -- Insert without updated_at column (fallback)
    INSERT INTO public.profiles (
      id,
      user_id,
      email,
      name,
      level,
      total_xp,
      streak,
      native_language,
      learning_language
    )
    VALUES (
      NEW.id,
      NEW.id,
      NEW.email,
      COALESCE(
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'full_name',
        split_part(NEW.email, '@', 1),
        'User'
      ),
      1,
      0,
      0,
      COALESCE(NEW.raw_user_meta_data->>'native_language', 'en'),
      COALESCE(
        (NEW.raw_user_meta_data->'learning_languages'->>0),
        (NEW.raw_user_meta_data->>'learning_language'),
        'en'
      )
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      name = COALESCE(EXCLUDED.name, profiles.name),
      user_id = EXCLUDED.user_id;
  END IF;

  RETURN NEW;
END;
$$;

-- ============================================
-- Step 3: Create Trigger on auth.users
-- ============================================

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger that fires after user creation
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

DO $$
BEGIN
  RAISE NOTICE '✅ Created handle_new_user() function';
  RAISE NOTICE '✅ Created trigger on_auth_user_created';
END $$;

-- ============================================
-- Step 4: Enable Row Level Security
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  RAISE NOTICE '✅ Enabled RLS on profiles table';
END $$;

-- ============================================
-- Step 5: Drop Existing Policies (Cleanup)
-- ============================================

-- Drop all existing policies to avoid conflicts
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

-- ============================================
-- Step 6: Create RLS Policies
-- ============================================

-- Policy: Users can SELECT their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = id OR 
  auth.uid() = user_id
);

-- Policy: Users can INSERT their own profile
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = id OR 
  auth.uid() = user_id
);

-- Policy: Users can UPDATE their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  auth.uid() = id OR 
  auth.uid() = user_id
)
WITH CHECK (
  auth.uid() = id OR 
  auth.uid() = user_id
);

-- Policy: Users can DELETE their own profile
CREATE POLICY "Users can delete own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (
  auth.uid() = id OR 
  auth.uid() = user_id
);

DO $$
BEGIN
  RAISE NOTICE '✅ Created RLS policies';
END $$;

-- ============================================
-- Step 7: Fix Existing Profiles (Backfill user_id)
-- ============================================

-- Update existing profiles that might have NULL user_id
UPDATE public.profiles
SET user_id = id
WHERE user_id IS NULL AND id IS NOT NULL;

DO $$
BEGIN
  RAISE NOTICE '✅ Backfilled user_id for existing profiles';
END $$;

-- ============================================
-- Step 8: Verification Queries
-- ============================================

-- Show table structure
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Show foreign keys
SELECT
  tc.constraint_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
AND tc.table_name = 'profiles';

-- Show trigger
SELECT 
  trigger_name,
  event_object_table,
  action_statement,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Show policies
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'profiles'
ORDER BY policyname;

-- ============================================
-- ✅ Success!
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ Database setup completed successfully!';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '';
  RAISE NOTICE '📋 What was fixed:';
  RAISE NOTICE '   1. ✅ user_id column added/verified';
  RAISE NOTICE '   2. ✅ handle_new_user() function created';
  RAISE NOTICE '   3. ✅ Trigger on_auth_user_created created';
  RAISE NOTICE '   4. ✅ RLS enabled on profiles table';
  RAISE NOTICE '   5. ✅ RLS policies created (SELECT, INSERT, UPDATE, DELETE)';
  RAISE NOTICE '   6. ✅ Existing profiles backfilled';
  RAISE NOTICE '';
  RAISE NOTICE '🧪 Test it:';
  RAISE NOTICE '   1. Create a new user account';
  RAISE NOTICE '   2. Check profiles table - should auto-create profile';
  RAISE NOTICE '   3. Try logging out - should redirect to /auth/login';
  RAISE NOTICE '';
END $$;

