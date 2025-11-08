-- ============================================
-- 🧪 Test Signup Setup - Diagnostic Script
-- ============================================
-- Run this to check if your database is set up correctly for signup
-- ============================================

-- Check if profiles table exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'profiles'
    ) THEN '✅ profiles table exists'
    ELSE '❌ profiles table DOES NOT exist'
  END as profiles_table_check;

-- Check profiles table columns
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Check if user_id column exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'user_id'
    ) THEN '✅ user_id column exists'
    ELSE '❌ user_id column DOES NOT exist'
  END as user_id_check;

-- Check if id column exists and has foreign key
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'id'
    ) THEN '✅ id column exists'
    ELSE '❌ id column DOES NOT exist'
  END as id_check;

-- Check foreign key constraints
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

-- Check if RLS is enabled
SELECT 
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ RLS enabled'
    ELSE '❌ RLS NOT enabled'
  END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'profiles';

-- Check RLS policies
SELECT 
  policyname,
  cmd,
  CASE 
    WHEN qual IS NOT NULL THEN qual
    WHEN with_check IS NOT NULL THEN with_check
    ELSE 'N/A'
  END as policy_condition
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'profiles'
ORDER BY cmd, policyname;

-- Check if handle_new_user function exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_proc 
      WHERE proname = 'handle_new_user'
    ) THEN '✅ handle_new_user() function exists'
    ELSE '❌ handle_new_user() function DOES NOT exist'
  END as function_check;

-- Check if trigger exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.triggers 
      WHERE trigger_name = 'on_auth_user_created'
    ) THEN '✅ on_auth_user_created trigger exists'
    ELSE '❌ on_auth_user_created trigger DOES NOT exist'
  END as trigger_check;

-- Show trigger details
SELECT 
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Check if users table exists (fallback)
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users'
    ) THEN '✅ users table exists (fallback)'
    ELSE 'ℹ️ users table does not exist (not required)'
  END as users_table_check;

