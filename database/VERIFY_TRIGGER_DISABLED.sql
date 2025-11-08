-- ============================================
-- VERIFY TRIGGER IS DISABLED
-- ============================================
-- Run this in Supabase SQL Editor to check trigger status

-- Check for triggers on auth.users
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users'
AND trigger_schema = 'auth';

-- If you see any rows, the trigger still exists. Run:
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Also check for other possible trigger names
SELECT 
  trigger_name, 
  event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'auth'
AND event_object_table = 'users';

-- Check for handle_new_user function
SELECT 
  proname as function_name,
  pronargs as num_args
FROM pg_proc
WHERE proname = 'handle_new_user';

