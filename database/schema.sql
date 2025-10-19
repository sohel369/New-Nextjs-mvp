-- Language Learning App Database Schema

-- Enable RLS
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Languages table
CREATE TABLE languages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(5) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  native_name VARCHAR(100) NOT NULL,
  flag_emoji VARCHAR(10) NOT NULL,
  is_rtl BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE,
  avatar_url TEXT,
  native_language VARCHAR(5) REFERENCES languages(code),
  learning_language VARCHAR(5) REFERENCES languages(code),
  level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vocabulary table
CREATE TABLE vocabulary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  language_id UUID REFERENCES languages(id) ON DELETE CASCADE,
  word VARCHAR(255) NOT NULL,
  translation VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  audio_url TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quizzes table
CREATE TABLE quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  language_id UUID REFERENCES languages(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
  questions JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress table
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  language_id UUID REFERENCES languages(id) ON DELETE CASCADE,
  vocabulary_id UUID REFERENCES vocabulary(id) ON DELETE SET NULL,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE SET NULL,
  lesson_id UUID,
  score INTEGER NOT NULL,
  xp_earned INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  time_spent INTEGER DEFAULT 0 -- in seconds
);

-- Badges table
CREATE TABLE badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(50) NOT NULL,
  requirement TEXT NOT NULL,
  xp_reward INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User badges table
CREATE TABLE user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Lessons table
CREATE TABLE lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  language_id UUID REFERENCES languages(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content JSONB NOT NULL,
  order_index INTEGER NOT NULL,
  difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial languages
INSERT INTO languages (code, name, native_name, flag_emoji, is_rtl) VALUES
('en', 'English', 'English', '🇺🇸', false),
('ar', 'Arabic', 'العربية', '🇸🇦', true),
('nl', 'Dutch', 'Nederlands', '🇳🇱', false),
('id', 'Indonesian', 'Bahasa Indonesia', '🇮🇩', false),
('ms', 'Malay', 'Bahasa Melayu', '🇲🇾', false),
('th', 'Thai', 'ไทย', '🇹🇭', false),
('km', 'Khmer', 'ខ្មែរ', '🇰🇭', false);

-- Insert initial badges
INSERT INTO badges (name, description, icon, requirement, xp_reward) VALUES
('First Steps', 'Complete your first lesson', '🎯', 'Complete 1 lesson', 50),
('Streak Master', 'Maintain a 7-day streak', '🔥', '7 day streak', 200),
('Quiz Champion', 'Score 100% on a quiz', '🏆', 'Perfect quiz score', 100),
('Vocabulary Builder', 'Learn 100 words', '📚', 'Learn 100 vocabulary words', 300),
('Language Explorer', 'Study for 10 hours', '⏰', 'Study for 10 hours total', 500);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own badges" ON user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);
