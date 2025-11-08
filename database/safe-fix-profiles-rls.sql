-- ============================================
-- 🔧 Safe Fix for Profiles Table RLS Policies
-- ============================================
-- This script safely handles existing columns and policies
-- Run this in your Supabase SQL Editor
-- ============================================

-- ============================================
-- Step 1: Check and Handle user_id Column
-- ============================================

-- Check if user_id column exists, if not, add it
DO $$
BEGIN
  -- Check if user_id column exists
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'user_id'
  ) THEN
    -- Add user_id column if it doesn't exist
    ALTER TABLE public.profiles 
    ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    
    -- If id column exists and is the primary key, copy id values to user_id
    IF EXISTS (
      SELECT 1 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'id'
    ) THEN
      -- Copy id values to user_id for existing rows
      UPDATE public.profiles 
      SET user_id = id 
      WHERE user_id IS NULL;
      
      -- Make user_id NOT NULL after populating
      ALTER TABLE public.profiles 
      ALTER COLUMN user_id SET NOT NULL;
    END IF;
    
    RAISE NOTICE '✅ Added user_id column to profiles table';
  ELSE
    RAISE NOTICE 'ℹ️ user_id column already exists, skipping...';
  END IF;
END $$;

-- ============================================
-- Step 2: Ensure id Column is Primary Key (if it exists)
-- ============================================

-- Check if id column exists and is primary key
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'id'
  ) THEN
    -- Ensure id references auth.users(id)
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
      -- Add foreign key constraint if it doesn't exist
      ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_id_fkey 
      FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
      
      RAISE NOTICE '✅ Added foreign key constraint on id column';
    ELSE
      RAISE NOTICE 'ℹ️ Foreign key constraint on id already exists';
    END IF;
  END IF;
END $$;

-- ============================================
-- Step 3: Ensure user_id has Foreign Key Constraint
-- ============================================

DO $$
BEGIN
  -- Check if foreign key constraint exists on user_id
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
      ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_schema = 'public' 
    AND tc.table_name = 'profiles'
    AND tc.constraint_type = 'FOREIGN KEY'
    AND kcu.column_name = 'user_id'
  ) THEN
    -- Add foreign key constraint if it doesn't exist
    ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    
    RAISE NOTICE '✅ Added foreign key constraint on user_id column';
  ELSE
    RAISE NOTICE 'ℹ️ Foreign key constraint on user_id already exists';
  END IF;
END $$;

-- ============================================
-- Step 4: Enable Row Level Security
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Step 5: Drop Existing Policies (Safe Cleanup)
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
-- Step 6: Create RLS Policies (Check Before Creating)
-- ============================================

-- Policy: Users can read only their own data
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users read only own data'
  ) THEN
    CREATE POLICY "Users read only own data"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (
      -- Check both id and user_id columns (whichever exists)
      (auth.uid() = id) OR 
      (auth.uid() = user_id)
    );
    
    RAISE NOTICE '✅ Created policy: Users read only own data';
  ELSE
    RAISE NOTICE 'ℹ️ Policy "Users read only own data" already exists';
  END IF;
END $$;

-- Policy: Users can insert their own data
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users insert own data'
  ) THEN
    CREATE POLICY "Users insert own data"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (
      -- Check both id and user_id columns (whichever exists)
      (auth.uid() = id) OR 
      (auth.uid() = user_id)
    );
    
    RAISE NOTICE '✅ Created policy: Users insert own data';
  ELSE
    RAISE NOTICE 'ℹ️ Policy "Users insert own data" already exists';
  END IF;
END $$;

-- Policy: Users can update their own data
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users update own data'
  ) THEN
    CREATE POLICY "Users update own data"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (
      -- Check both id and user_id columns (whichever exists)
      (auth.uid() = id) OR 
      (auth.uid() = user_id)
    )
    WITH CHECK (
      -- Ensure they can only update their own data
      (auth.uid() = id) OR 
      (auth.uid() = user_id)
    );
    
    RAISE NOTICE '✅ Created policy: Users update own data';
  ELSE
    RAISE NOTICE 'ℹ️ Policy "Users update own data" already exists';
  END IF;
END $$;

-- Policy: Users can delete their own data
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND policyname = 'Users delete own data'
  ) THEN
    CREATE POLICY "Users delete own data"
    ON public.profiles
    FOR DELETE
    TO authenticated
    USING (
      -- Check both id and user_id columns (whichever exists)
      (auth.uid() = id) OR 
      (auth.uid() = user_id)
    );
    
    RAISE NOTICE '✅ Created policy: Users delete own data';
  ELSE
    RAISE NOTICE 'ℹ️ Policy "Users delete own data" already exists';
  END IF;
END $$;

-- ============================================
-- Step 7: Verify Setup
-- ============================================

-- Show current table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Show foreign key constraints
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

-- Show all policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'profiles'
ORDER BY policyname;

-- ============================================
-- ✅ Success Message
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Migration completed successfully!';
  RAISE NOTICE '📋 Check the results above to verify:';
  RAISE NOTICE '   1. user_id column exists and has foreign key';
  RAISE NOTICE '   2. RLS is enabled';
  RAISE NOTICE '   3. All 4 policies are created (SELECT, INSERT, UPDATE, DELETE)';
  RAISE NOTICE '   4. Policies use: auth.uid() = id OR auth.uid() = user_id';
END $$;

