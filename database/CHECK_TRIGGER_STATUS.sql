-- ============================================
-- CHECK TRIGGER STATUS
-- ============================================
-- Run this in Supabase SQL Editor to verify trigger is disabled

-- Check all triggers on auth.users
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_statement,
  action_timing
FROM information_schema.triggers
WHERE event_object_table = 'users'
AND trigger_schema = 'auth';

-- Expected: Should return 0 rows (no triggers)

-- Also check for any functions that might be called
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE '%user%'
AND routine_name LIKE '%new%';

-- Check if handle_new_user function exists
SELECT 
  proname as function_name,
  prosrc as function_source
FROM pg_proc
WHERE proname = 'handle_new_user';

