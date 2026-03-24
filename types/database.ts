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
  name?: string
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
