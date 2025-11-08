-- ============================================
-- 🔧 Fix updated_at Column and Trigger Function
-- ============================================
-- This script fixes the "record NEW has no field updated_at" error
-- Run this in your Supabase SQL Editor
-- ============================================

-- ============================================
-- Step 1: Add updated_at Column if Missing
-- ============================================

DO $$
BEGIN
  -- Check if updated_at column exists in profiles table
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'updated_at'
  ) THEN
    -- Add updated_at column with default value
    ALTER TABLE public.profiles 
    ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    
    -- Set updated_at for existing rows
    UPDATE public.profiles 
    SET updated_at = COALESCE(created_at, NOW())
    WHERE updated_at IS NULL;
    
    RAISE NOTICE '✅ Added updated_at column to profiles table';
  ELSE
    RAISE NOTICE 'ℹ️ updated_at column already exists in profiles table';
  END IF;
END $$;

-- Also check and add to users table if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'users'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'users' 
      AND column_name = 'updated_at'
    ) THEN
      ALTER TABLE public.users 
      ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
      
      UPDATE public.users 
      SET updated_at = COALESCE(created_at, NOW())
      WHERE updated_at IS NULL;
      
      RAISE NOTICE '✅ Added updated_at column to users table';
    ELSE
      RAISE NOTICE 'ℹ️ updated_at column already exists in users table';
    END IF;
  END IF;
END $$;

-- ============================================
-- Step 2: Drop Existing Trigger Function
-- ============================================

-- Drop the old function if it exists (we'll recreate it safely)
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- ============================================
-- Step 3: Create Safe Trigger Function
-- ============================================

-- Create a safe version that checks if column exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  has_updated_at BOOLEAN;
BEGIN
  -- Check if the table has an updated_at column
  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = TG_TABLE_SCHEMA 
    AND table_name = TG_TABLE_NAME 
    AND column_name = 'updated_at'
  ) INTO has_updated_at;
  
  -- Only set updated_at if the column exists
  IF has_updated_at THEN
    NEW.updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  RAISE NOTICE '✅ Created safe update_updated_at_column() function';
END $$;

-- ============================================
-- Step 4: Create/Replace Triggers
-- ============================================

-- Drop existing triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;

-- Create trigger for profiles table
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for users table if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'users'
  ) THEN
    CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
    
    RAISE NOTICE '✅ Created trigger for users table';
  END IF;
END $$;

DO $$
BEGIN
  RAISE NOTICE '✅ Created trigger for profiles table';
END $$;

-- ============================================
-- Step 5: Verify Setup
-- ============================================

-- Check columns
SELECT 
  table_name,
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('profiles', 'users')
AND column_name = 'updated_at'
ORDER BY table_name;

-- Check function
SELECT 
  proname as function_name,
  prosrc as function_body
FROM pg_proc
WHERE proname = 'update_updated_at_column';

-- Check triggers
SELECT 
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND (trigger_name LIKE '%updated_at%' OR trigger_name LIKE '%update_%')
ORDER BY event_object_table, trigger_name;

-- ============================================
-- ✅ Success!
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ updated_at trigger fix completed!';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '';
  RAISE NOTICE '📋 What was fixed:';
  RAISE NOTICE '   1. ✅ updated_at column added to profiles (if missing)';
  RAISE NOTICE '   2. ✅ updated_at column added to users (if missing)';
  RAISE NOTICE '   3. ✅ Safe update_updated_at_column() function created';
  RAISE NOTICE '   4. ✅ Triggers created for both tables';
  RAISE NOTICE '';
  RAISE NOTICE '🧪 Test it:';
  RAISE NOTICE '   1. Update a profile - updated_at should auto-update';
  RAISE NOTICE '   2. Create a new user - should work without errors';
  RAISE NOTICE '   3. Update a user - updated_at should auto-update';
  RAISE NOTICE '';
END $$;

