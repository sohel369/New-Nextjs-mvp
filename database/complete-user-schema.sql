-- Complete User Data Schema for Language Learning App

-- User Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  base_language VARCHAR(10) DEFAULT 'en' CHECK (base_language IN ('en', 'ar', 'nl', 'id', 'ms', 'th', 'km')),
  learning_languages TEXT[] DEFAULT ARRAY['en'], -- Array of learning languages
  level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  dark_mode BOOLEAN DEFAULT true,
  notifications_enabled BOOLEAN DEFAULT true,
  sound_enabled BOOLEAN DEFAULT true,
  auto_play_audio BOOLEAN DEFAULT true,
  high_contrast BOOLEAN DEFAULT false,
  large_text BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Languages Table
CREATE TABLE IF NOT EXISTS languages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  native_name TEXT NOT NULL,
  flag_emoji TEXT NOT NULL,
  is_rtl BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert supported languages
INSERT INTO languages (code, name, native_name, flag_emoji, is_rtl) VALUES
('en', 'English', 'English', '🇺🇸', false),
('ar', 'Arabic', 'العربية', '🇸🇦', true),
('nl', 'Dutch', 'Nederlands', '🇳🇱', false),
('id', 'Indonesian', 'Bahasa Indonesia', '🇮🇩', false),
('ms', 'Malay', 'Bahasa Melayu', '🇲🇾', false),
('th', 'Thai', 'ไทย', '🇹🇭', false),
('km', 'Khmer', 'ខ្មែរ', '🇰🇭', false)
ON CONFLICT (code) DO NOTHING;

-- Lessons Table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  language_id UUID REFERENCES languages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  audio_url TEXT,
  difficulty VARCHAR(20) DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quizzes Table
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  language_id UUID REFERENCES languages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  difficulty VARCHAR(20) DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  time_limit INTEGER DEFAULT 300, -- seconds
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz Questions Table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  audio_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Progress Table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  score INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- seconds
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Quiz Attempts Table
CREATE TABLE IF NOT EXISTS user_quiz_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  time_taken INTEGER NOT NULL, -- seconds
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leaderboard View (calculated from user progress)
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  p.id,
  p.name,
  p.avatar_url,
  p.total_xp,
  p.level,
  p.streak,
  p.last_activity,
  ROW_NUMBER() OVER (ORDER BY p.total_xp DESC, p.streak DESC) as rank
FROM profiles p
WHERE p.total_xp > 0
ORDER BY p.total_xp DESC, p.streak DESC;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_total_xp ON profiles(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_streak ON profiles(streak DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_learning_languages ON profiles USING GIN(learning_languages);
CREATE INDEX IF NOT EXISTS idx_lessons_language_id ON lessons(language_id);
CREATE INDEX IF NOT EXISTS idx_lessons_difficulty ON lessons(difficulty);
CREATE INDEX IF NOT EXISTS idx_quizzes_language_id ON quizzes(language_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_id ON user_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_user_id ON user_quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_quiz_id ON user_quiz_attempts(quiz_id);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- User settings policies
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User progress policies
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User quiz attempts policies
CREATE POLICY "Users can view own quiz attempts" ON user_quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts" ON user_quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read access for lessons, quizzes, and languages
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lessons" ON lessons FOR SELECT USING (true);
CREATE POLICY "Anyone can view quizzes" ON quizzes FOR SELECT USING (true);
CREATE POLICY "Anyone can view quiz questions" ON quiz_questions FOR SELECT USING (true);
CREATE POLICY "Anyone can view languages" ON languages FOR SELECT USING (true);

-- Functions for common operations
CREATE OR REPLACE FUNCTION update_user_xp(p_user_id UUID, p_xp INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles 
  SET total_xp = total_xp + p_xp,
      last_activity = NOW(),
      updated_at = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles 
  SET streak = streak + 1,
      last_activity = NOW(),
      updated_at = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_leaderboard_position(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  user_rank INTEGER;
BEGIN
  SELECT rank INTO user_rank
  FROM leaderboard
  WHERE id = p_user_id;
  
  RETURN COALESCE(user_rank, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON quizzes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
