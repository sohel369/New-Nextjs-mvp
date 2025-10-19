-- Quiz History Table Schema
-- This table stores quiz completion history and statistics

CREATE TABLE IF NOT EXISTS quiz_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_type VARCHAR(20) NOT NULL CHECK (quiz_type IN ('basic', 'enhanced')),
  language VARCHAR(10) NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  accuracy DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  time_spent INTEGER NOT NULL DEFAULT 0, -- in seconds
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  questions JSONB DEFAULT '[]'::jsonb, -- Store individual question results
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_history_user_id ON quiz_history(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_history_completed_at ON quiz_history(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_history_quiz_type ON quiz_history(quiz_type);
CREATE INDEX IF NOT EXISTS idx_quiz_history_language ON quiz_history(language);

-- Enable RLS
ALTER TABLE quiz_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own quiz history" ON quiz_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz history" ON quiz_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quiz history" ON quiz_history
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own quiz history" ON quiz_history
  FOR DELETE USING (auth.uid() = user_id);

-- Function to create quiz history table (for RPC calls)
CREATE OR REPLACE FUNCTION create_quiz_history_table()
RETURNS void AS $$
BEGIN
  -- Table creation is handled above, this function is for RPC calls
  RETURN;
END;
$$ LANGUAGE plpgsql;
