-- ============================================
-- 🔧 Complete Trigger and updated_at Fix
-- ============================================
-- This script fixes all trigger-related issues including updated_at
-- Run this AFTER running complete-auth-fix.sql
-- ============================================

-- ============================================
-- Step 1: Ensure updated_at Column Exists
-- ============================================

-- Add updated_at to profiles table
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
  ELSE
    RAISE NOTICE 'ℹ️ updated_at column already exists in profiles table';
  END IF;
END $$;

-- Add updated_at to users table if it exists
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
-- Step 2: Create Safe update_updated_at Function
-- ============================================

-- Drop old function
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

-- Create safe function that checks if column exists
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
-- Step 3: Create/Replace Triggers
-- ============================================

-- Drop existing triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;

-- Create trigger for profiles table
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DO $$
BEGIN
  RAISE NOTICE '✅ Created trigger for profiles table';
END $$;

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

-- ============================================
-- Step 4: Verify handle_new_user Function
-- ============================================

-- Update handle_new_user to include updated_at if it exists
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
      ),
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      name = COALESCE(EXCLUDED.name, profiles.name),
      user_id = EXCLUDED.user_id,
      updated_at = NOW();
  ELSE
    -- Fallback if updated_at doesn't exist
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

DO $$
BEGIN
  RAISE NOTICE '✅ Updated handle_new_user() function to handle updated_at safely';
END $$;

-- ============================================
-- Step 5: Verification
-- ============================================

-- Check columns
SELECT 
  table_name,
  column_name,
  data_type,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('profiles', 'users')
AND column_name IN ('created_at', 'updated_at')
ORDER BY table_name, column_name;

-- Check functions
SELECT 
  proname as function_name
FROM pg_proc
WHERE proname IN ('update_updated_at_column', 'handle_new_user')
ORDER BY proname;

-- Check triggers
SELECT 
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND event_object_table IN ('profiles', 'users')
ORDER BY event_object_table, trigger_name;

-- ============================================
-- ✅ Success!
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ All triggers fixed successfully!';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '';
  RAISE NOTICE '📋 What was fixed:';
  RAISE NOTICE '   1. ✅ updated_at column added (if missing)';
  RAISE NOTICE '   2. ✅ Safe update_updated_at_column() function';
  RAISE NOTICE '   3. ✅ Triggers created for both tables';
  RAISE NOTICE '   4. ✅ handle_new_user() updated to handle updated_at';
  RAISE NOTICE '';
  RAISE NOTICE '🧪 Test it:';
  RAISE NOTICE '   1. Create a new user - should work without errors';
  RAISE NOTICE '   2. Update a profile - updated_at should auto-update';
  RAISE NOTICE '   3. No more "record NEW has no field updated_at" errors';
  RAISE NOTICE '';
END $$;

