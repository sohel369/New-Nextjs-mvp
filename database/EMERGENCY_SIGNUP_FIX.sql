-- ============================================
-- 🚨 EMERGENCY SIGNUP FIX
-- ============================================
-- Run this if you're getting "Database error saving new user"
-- This script ensures everything is set up correctly
-- ============================================

-- ============================================
-- Step 1: Create Profiles Table (if missing)
-- ============================================

-- Create profiles table with all possible columns to support both schemas
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  native_language VARCHAR(10) DEFAULT 'en',
  learning_language VARCHAR(10) DEFAULT 'en',
  -- Also support array version
  learning_languages TEXT[] DEFAULT ARRAY['en']::TEXT[],
  base_language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Step 2: Add Missing Columns Safely
-- ============================================

-- Add user_id if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    UPDATE public.profiles SET user_id = id WHERE user_id IS NULL;
    ALTER TABLE public.profiles ALTER COLUMN user_id SET NOT NULL;
  END IF;
END $$;

-- Add updated_at if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    UPDATE public.profiles SET updated_at = COALESCE(created_at, NOW()) WHERE updated_at IS NULL;
  END IF;
END $$;

-- Add learning_languages array column if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'learning_languages'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN learning_languages TEXT[] DEFAULT ARRAY['en']::TEXT[];
    -- Copy learning_language to learning_languages array for existing rows
    UPDATE public.profiles 
    SET learning_languages = ARRAY[learning_language]::TEXT[]
    WHERE learning_languages IS NULL OR learning_languages = ARRAY[]::TEXT[];
  END IF;
END $$;

-- Add base_language column if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'base_language'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN base_language VARCHAR(10) DEFAULT 'en';
    -- Copy native_language to base_language for existing rows
    UPDATE public.profiles 
    SET base_language = native_language
    WHERE base_language IS NULL;
  END IF;
END $$;

-- ============================================
-- Step 3: Enable RLS
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Step 4: Drop All Existing Policies
-- ============================================

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT policyname 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles'
  ) LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.profiles';
  END LOOP;
END $$;

-- ============================================
-- Step 5: Create Simple RLS Policies
-- ============================================

-- Allow authenticated users to insert their own profile
CREATE POLICY "Allow insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id OR auth.uid() = user_id);

-- Allow authenticated users to select their own profile
CREATE POLICY "Allow select own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id OR auth.uid() = user_id);

-- Allow authenticated users to update their own profile
CREATE POLICY "Allow update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id OR auth.uid() = user_id)
WITH CHECK (auth.uid() = id OR auth.uid() = user_id);

-- ============================================
-- Step 6: Create/Update Trigger Function
-- ============================================

DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  learning_lang TEXT;
  native_lang TEXT;
  has_learning_languages BOOLEAN;
  has_base_language BOOLEAN;
BEGIN
  -- Extract learning language
  learning_lang := COALESCE(
    (NEW.raw_user_meta_data->'learning_languages'->>0),
    (NEW.raw_user_meta_data->>'learning_language'),
    'en'
  );
  
  -- Extract native language
  native_lang := COALESCE(
    NEW.raw_user_meta_data->>'native_language',
    'en'
  );
  
  -- Check which columns exist
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'learning_languages'
  ) INTO has_learning_languages;
  
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'base_language'
  ) INTO has_base_language;
  
  -- Insert into profiles - use dynamic SQL based on what columns exist
  IF has_learning_languages AND has_base_language THEN
    -- Full schema with all columns
    INSERT INTO public.profiles (
      id, user_id, email, name, level, total_xp, streak,
      native_language, learning_language, learning_languages, base_language
    )
    VALUES (
      NEW.id, NEW.id, NEW.email,
      COALESCE(
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'full_name',
        split_part(NEW.email, '@', 1),
        'User'
      ),
      1, 0, 0, native_lang, learning_lang, ARRAY[learning_lang]::TEXT[], native_lang
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      name = COALESCE(EXCLUDED.name, profiles.name),
      user_id = EXCLUDED.user_id;
  ELSE
    -- Basic schema without array columns
    INSERT INTO public.profiles (
      id, user_id, email, name, level, total_xp, streak,
      native_language, learning_language
    )
    VALUES (
      NEW.id, NEW.id, NEW.email,
      COALESCE(
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'full_name',
        split_part(NEW.email, '@', 1),
        'User'
      ),
      1, 0, 0, native_lang, learning_lang
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
-- Step 7: Create Trigger
-- ============================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Step 8: Create Safe update_updated_at Function
-- ============================================

DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  has_updated_at BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = TG_TABLE_SCHEMA 
    AND table_name = TG_TABLE_NAME 
    AND column_name = 'updated_at'
  ) INTO has_updated_at;
  
  IF has_updated_at THEN
    NEW.updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- ✅ Verification
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '✅ Emergency signup fix completed!';
  RAISE NOTICE '✅ ============================================';
  RAISE NOTICE '';
  RAISE NOTICE '📋 What was fixed:';
  RAISE NOTICE '   1. ✅ profiles table created/verified';
  RAISE NOTICE '   2. ✅ user_id column added';
  RAISE NOTICE '   3. ✅ updated_at column added';
  RAISE NOTICE '   4. ✅ RLS enabled';
  RAISE NOTICE '   5. ✅ Simple RLS policies created';
  RAISE NOTICE '   6. ✅ handle_new_user() trigger function created';
  RAISE NOTICE '   7. ✅ Trigger on auth.users created';
  RAISE NOTICE '';
  RAISE NOTICE '🧪 Next steps:';
  RAISE NOTICE '   1. Try creating a new account';
  RAISE NOTICE '   2. Check browser console for any errors';
  RAISE NOTICE '   3. Check server logs for [signup-api] messages';
  RAISE NOTICE '';
END $$;

