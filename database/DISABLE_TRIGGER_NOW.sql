-- ============================================
-- QUICK FIX: Disable Problematic Trigger
-- ============================================
-- This will immediately fix the "Database error creating new user" issue
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- Step 1: Disable the trigger that's causing the error
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 2: Verify the trigger is gone
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'users'
AND trigger_schema = 'auth';

-- Expected result: Should return 0 rows (no triggers found)
-- This means the trigger is successfully disabled!

-- ✅ Success! Your signup should now work.
-- The API will handle profile creation manually, so the trigger is not needed.

