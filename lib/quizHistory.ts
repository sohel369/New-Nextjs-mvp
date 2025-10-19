import { supabase } from './supabase';
import { QuizHistory } from '../data/languageData';

// Save quiz history to database
export const saveQuizHistory = async (quizData: Omit<QuizHistory, 'id'>): Promise<QuizHistory | null> => {
  try {
    const { data, error } = await supabase
      .from('quiz_history')
      .insert([quizData])
      .select()
      .single();

    if (error) {
      console.error('Error saving quiz history:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error saving quiz history:', error);
    return null;
  }
};

// Get quiz history for a user
export const getQuizHistory = async (userId: string, limit: number = 10): Promise<QuizHistory[]> => {
  try {
    const { data, error } = await supabase
      .from('quiz_history')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching quiz history:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching quiz history:', error);
    return [];
  }
};

// Get quiz statistics for a user
export const getQuizStats = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('quiz_history')
      .select('score, total_questions, accuracy, time_spent, quiz_type, language')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching quiz stats:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        averageAccuracy: 0,
        totalTimeSpent: 0,
        bestScore: 0,
        quizTypes: {},
        languages: {}
      };
    }

    const totalQuizzes = data.length;
    const totalScore = data.reduce((sum, quiz) => sum + quiz.score, 0);
    const totalQuestions = data.reduce((sum, quiz) => sum + quiz.total_questions, 0);
    const totalTimeSpent = data.reduce((sum, quiz) => sum + quiz.time_spent, 0);
    const averageScore = totalScore / totalQuizzes;
    const averageAccuracy = data.reduce((sum, quiz) => sum + quiz.accuracy, 0) / totalQuizzes;
    const bestScore = Math.max(...data.map(quiz => quiz.score));

    // Count quiz types
    const quizTypes = data.reduce((acc, quiz) => {
      acc[quiz.quiz_type] = (acc[quiz.quiz_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Count languages
    const languages = data.reduce((acc, quiz) => {
      acc[quiz.language] = (acc[quiz.language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalQuizzes,
      averageScore,
      averageAccuracy,
      totalTimeSpent,
      bestScore,
      quizTypes,
      languages
    };
  } catch (error) {
    console.error('Error fetching quiz stats:', error);
    return null;
  }
};

// Create quiz history table if it doesn't exist
export const createQuizHistoryTable = async () => {
  try {
    const { error } = await supabase.rpc('create_quiz_history_table');
    if (error) {
      console.error('Error creating quiz history table:', error);
    }
  } catch (error) {
    console.error('Error creating quiz history table:', error);
  }
};
