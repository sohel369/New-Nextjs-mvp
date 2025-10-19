-- Lessons Database Schema for Language Learning App

-- Languages table (if not already exists)
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

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  language_code VARCHAR(10) REFERENCES languages(code) ON DELETE CASCADE,
  level VARCHAR(20) NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration INTEGER NOT NULL, -- in minutes
  audio_url TEXT,
  video_url TEXT,
  image_url TEXT,
  xp_reward INTEGER DEFAULT 50,
  difficulty INTEGER DEFAULT 1 CHECK (difficulty >= 1 AND difficulty <= 5),
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lesson exercises table
CREATE TABLE IF NOT EXISTS lesson_exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('listening', 'speaking', 'reading', 'writing', 'vocabulary', 'grammar')),
  title TEXT NOT NULL,
  description TEXT,
  content JSONB, -- Flexible content storage
  audio_url TEXT,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User lesson progress table
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed BOOLEAN DEFAULT false,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  xp_earned INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- User exercise progress table
CREATE TABLE IF NOT EXISTS user_exercise_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES lesson_exercises(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  score INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, exercise_id)
);

-- Lesson categories table
CREATE TABLE IF NOT EXISTS lesson_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  language_code VARCHAR(10) REFERENCES languages(code) ON DELETE CASCADE,
  color VARCHAR(7) DEFAULT '#6366f1', -- Hex color
  icon VARCHAR(50) DEFAULT 'book',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lesson category assignments
CREATE TABLE IF NOT EXISTS lesson_categories_assignments (
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  category_id UUID REFERENCES lesson_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (lesson_id, category_id)
);

-- Enable RLS
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_exercise_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_categories_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lessons
CREATE POLICY "Lessons are viewable by everyone" ON lessons
  FOR SELECT USING (is_active = true);

CREATE POLICY "Lesson exercises are viewable by everyone" ON lesson_exercises
  FOR SELECT USING (is_active = true);

-- RLS Policies for user progress
CREATE POLICY "Users can view own lesson progress" ON user_lesson_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own lesson progress" ON user_lesson_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own exercise progress" ON user_exercise_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own exercise progress" ON user_exercise_progress
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for categories
CREATE POLICY "Categories are viewable by everyone" ON lesson_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Category assignments are viewable by everyone" ON lesson_categories_assignments
  FOR SELECT USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_lessons_language ON lessons(language_code);
CREATE INDEX IF NOT EXISTS idx_lessons_level ON lessons(level);
CREATE INDEX IF NOT EXISTS idx_lessons_active ON lessons(is_active);
CREATE INDEX IF NOT EXISTS idx_lesson_exercises_lesson ON lesson_exercises(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user ON user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_lesson ON user_lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_exercise_progress_user ON user_exercise_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_exercise_progress_exercise ON user_exercise_progress(exercise_id);

-- Functions for lesson management
CREATE OR REPLACE FUNCTION update_lesson_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Update lesson progress based on exercise completion
  UPDATE user_lesson_progress 
  SET 
    progress_percentage = (
      SELECT COALESCE(
        ROUND(
          (COUNT(CASE WHEN uep.completed = true THEN 1 END) * 100.0 / COUNT(*))
        ), 0
      )
      FROM lesson_exercises le
      LEFT JOIN user_exercise_progress uep ON le.id = uep.exercise_id AND uep.user_id = NEW.user_id
      WHERE le.lesson_id = (
        SELECT lesson_id FROM lesson_exercises WHERE id = NEW.exercise_id
      )
    ),
    completed = (
      SELECT COUNT(CASE WHEN uep.completed = true THEN 1 END) = COUNT(*)
      FROM lesson_exercises le
      LEFT JOIN user_exercise_progress uep ON le.id = uep.exercise_id AND uep.user_id = NEW.user_id
      WHERE le.lesson_id = (
        SELECT lesson_id FROM lesson_exercises WHERE id = NEW.exercise_id
      )
    ),
    completed_at = CASE 
      WHEN (
        SELECT COUNT(CASE WHEN uep.completed = true THEN 1 END) = COUNT(*)
        FROM lesson_exercises le
        LEFT JOIN user_exercise_progress uep ON le.id = uep.exercise_id AND uep.user_id = NEW.user_id
        WHERE le.lesson_id = (
          SELECT lesson_id FROM lesson_exercises WHERE id = NEW.exercise_id
        )
      ) AND NEW.completed = true THEN NOW()
      ELSE completed_at
    END,
    updated_at = NOW()
  WHERE user_id = NEW.user_id 
    AND lesson_id = (
      SELECT lesson_id FROM lesson_exercises WHERE id = NEW.exercise_id
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update lesson progress when exercise is completed
CREATE TRIGGER update_lesson_progress_trigger
  AFTER UPDATE ON user_exercise_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_lesson_progress();

-- Sample lesson categories
INSERT INTO lesson_categories (name, description, language_code, color, icon) VALUES
('Greetings', 'Basic greetings and polite expressions', 'en', '#10b981', 'hand-wave'),
('Numbers', 'Learning to count and use numbers', 'en', '#f59e0b', 'hash'),
('Family', 'Family members and relationships', 'en', '#8b5cf6', 'users'),
('Food', 'Food and dining vocabulary', 'en', '#ef4444', 'utensils'),
('Travel', 'Travel and transportation', 'en', '#06b6d4', 'map-pin')
ON CONFLICT DO NOTHING;

-- Sample lessons data
INSERT INTO lessons (title, description, language_code, level, duration, xp_reward, difficulty) VALUES
('Basic Greetings', 'Learn essential English greetings and polite expressions', 'en', 'beginner', 15, 50, 1),
('Numbers 1-10', 'Learn to count from 1 to 10 in English', 'en', 'beginner', 20, 75, 2),
('Family Members', 'Learn vocabulary for family relationships', 'en', 'intermediate', 25, 100, 3),
('التحيات الأساسية', 'تعلم التحيات الأساسية والتعبيرات المهذبة باللغة العربية', 'ar', 'beginner', 15, 50, 1),
('الأرقام 1-10', 'تعلم العد من 1 إلى 10 باللغة العربية', 'ar', 'beginner', 20, 75, 2),
('أفراد العائلة', 'تعلم مفردات العلاقات العائلية', 'ar', 'intermediate', 25, 100, 3)
ON CONFLICT DO NOTHING;
