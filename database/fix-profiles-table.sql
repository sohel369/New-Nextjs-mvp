-- Fix profiles table to match the correct schema
-- This ensures the profiles table exists in public schema with correct columns

-- Drop existing profiles table if it exists (to recreate with correct schema)
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create the correct profiles table in public schema
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  name text,
  email text,
  native_language text,
  learning_language text,
  level integer DEFAULT 1,
  total_xp integer DEFAULT 0,
  streak integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile" ON public.profiles
  FOR DELETE USING (auth.uid() = id);

-- Insert some sample data (optional)
-- INSERT INTO public.profiles (id, name, email, native_language, learning_language) VALUES
-- ('00000000-0000-0000-0000-000000000000', 'Sample User', 'sample@example.com', 'Bengali', 'English')
-- ON CONFLICT (id) DO NOTHING;
