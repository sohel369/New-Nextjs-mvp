-- ✅ Fix Supabase "Database error saving new user"
-- Step 1: Drop old triggers safely
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 2: Drop old function if exists
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 3: Recreate correct function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at)
  VALUES (NEW.id, NEW.email, NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Recreate trigger
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

