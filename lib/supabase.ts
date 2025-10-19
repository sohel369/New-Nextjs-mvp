import { createClient } from '@supabase/supabase-js'

// ✅ Supabase credentials
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://ufvuvkrinmkkoowngioe.supabase.co'

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmdnV2a3Jpbm1ra29vd25naW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NDI0NjAsImV4cCI6MjA3NTExODQ2MH0.hl452FRWQmS51DQeL9AYZjfiinptZg2ewPWVjEhCaDc'

const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmdnV2a3Jpbm1ra29vd25naW9lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU0MjQ2MCwiZXhwIjoyMDc1MTE4NDYwfQ.LXiIwSzsrqPxpiMm0CWJBuauOXhvzZapmM9tgW0-7O0'

// ✅ Supabase client with full auth configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // লগইন session save করে রাখবে
    autoRefreshToken: true, // session expire হলে refresh করবে
    detectSessionInUrl: true // OAuth callback থেকে session ধরবে
  }
})

// ✅ Service role client for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// ✅ Database types (same as before)
export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
  username?: string
  avatar_url?: string
  native_language: string
  learning_language: string
  level: number
  total_xp: number
  streak: number
  last_activity: string
}

export interface Language {
  id: string
  code: string
  name: string
  native_name: string
  flag_emoji: string
  is_rtl: boolean
  created_at: string
}

export interface Vocabulary {
  id: string
  language_id: string
  word: string
  translation: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  audio_url?: string
  image_url?: string
  created_at: string
}

export interface Quiz {
  id: string
  language_id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  questions: QuizQuestion[]
  created_at: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct_answer: number
  explanation?: string
  audio_url?: string
}

export interface UserProgress {
  id: string
  user_id: string
  language_id: string
  vocabulary_id?: string
  quiz_id?: string
  lesson_id?: string
  score: number
  xp_earned: number
  completed_at: string
  time_spent: number
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  requirement: string
  xp_reward: number
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  earned_at: string
}
