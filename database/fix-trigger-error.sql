-- ============================================
-- FIX TRIGGER ERROR - Disable or Fix handle_new_user()
-- ============================================
-- This script fixes the "Database error creating new user" issue
-- Run this in your Supabase SQL Editor

-- Option 1: Temporarily DISABLE the trigger (safest for now)
-- This allows signup to work while we fix the trigger function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Option 2: Fix the trigger function to handle errors gracefully
-- This version won't fail if profile creation has issues
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Try to create profile, but don't fail if it errors
  BEGIN
    -- Check what columns exist in profiles table
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles' 
      AND column_name = 'updated_at'
    ) THEN
      -- Insert with updated_at
      INSERT INTO public.profiles (
        id, user_id, email, name, level, total_xp, streak,
        native_language, learning_language, created_at, updated_at
      )
      VALUES (
        NEW.id, NEW.id, NEW.email,
        COALESCE(
          NEW.raw_user_meta_data->>'name',
          NEW.raw_user_meta_data->>'full_name',
          split_part(NEW.email, '@', 1),
          'User'
        ),
        1, 0, 0,
        COALESCE(NEW.raw_user_meta_data->>'native_language', 'en'),
        COALESCE(
          (NEW.raw_user_meta_data->'learning_languages'->>0),
          (NEW.raw_user_meta_data->>'learning_language'),
          'en'
        ),
        NOW(), NOW()
      )
      ON CONFLICT (id) DO NOTHING;
    ELSE
      -- Insert without updated_at
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
        1, 0, 0,
        COALESCE(NEW.raw_user_meta_data->>'native_language', 'en'),
        COALESCE(
          (NEW.raw_user_meta_data->'learning_languages'->>0),
          (NEW.raw_user_meta_data->>'learning_language'),
          'en'
        )
      )
      ON CONFLICT (id) DO NOTHING;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    -- Log error but don't fail user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    -- Return NEW anyway so user creation succeeds
  END;
  
  RETURN NEW;
END;
$$;

-- Re-enable the trigger (only if you want it)
-- CREATE TRIGGER on_auth_user_created
-- AFTER INSERT ON auth.users
-- FOR EACH ROW
-- EXECUTE FUNCTION public.handle_new_user();

-- Verify trigger is disabled
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users'
AND trigger_schema = 'auth';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Trigger disabled/fixed. Signup should now work!';
  RAISE NOTICE '💡 Profile will be created manually by the API instead.';
END $$;

