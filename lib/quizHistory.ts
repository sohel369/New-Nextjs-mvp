import { supabase, logSupabaseError } from './supabase';
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
      // Check if error is not an empty object before logging
      const isErrorObject = typeof error === 'object' && error !== null;
      const errorKeys = isErrorObject ? Object.keys(error) : [];
      const isEmptyObject = isErrorObject && errorKeys.length === 0;
      const hasMessage = error.message && typeof error.message === 'string' && error.message.trim().length > 0;
      const hasCode = error.code && (typeof error.code === 'string' || typeof error.code === 'number');
      
      // Only log if error has meaningful content
      if (!isEmptyObject && (hasMessage || hasCode || error.details || error.hint)) {
        logSupabaseError('Error saving quiz history', error, { userId: (quizData as any).userId || (quizData as any).user_id });
      }
      return null;
    }

    return data;
  } catch (error) {
    // Check if error has meaningful content before logging
    const isErrorObject = typeof error === 'object' && error !== null;
    const errorKeys = isErrorObject ? Object.keys(error) : [];
    const isEmptyObject = isErrorObject && errorKeys.length === 0;
    const errorMessage = error instanceof Error ? error.message : (typeof error === 'string' ? error : null);
    const hasMessage = errorMessage && errorMessage.trim().length > 0;
    
    // Only log if error has meaningful content
    if (!isEmptyObject && (hasMessage || (error as any)?.code || (error as any)?.details || (error as any)?.hint)) {
      logSupabaseError('Unexpected error saving quiz history', error, { userId: (quizData as any).userId || (quizData as any).user_id });
    }
    return null;
  }
};

// Get quiz history for a user
export const getQuizHistory = async (userId: string, limit: number = 10): Promise<QuizHistory[]> => {
  if (!userId) {
    console.warn('[getQuizHistory] No userId provided');
    return [];
  }

  try {
    // Check session first
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.warn('[getQuizHistory] No active session');
      return [];
    }

    const { data, error } = await supabase
      .from('quiz_history')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (error) {
      // Check if error is not an empty object before logging
      const isErrorObject = typeof error === 'object' && error !== null;
      const errorKeys = isErrorObject ? Object.keys(error) : [];
      const isEmptyObject = isErrorObject && errorKeys.length === 0;
      const hasMessage = error.message && typeof error.message === 'string' && error.message.trim().length > 0;
      const hasCode = error.code && (typeof error.code === 'string' || typeof error.code === 'number');
      
      // Only log if error has meaningful content
      if (!isEmptyObject && (hasMessage || hasCode || error.details || error.hint)) {
        logSupabaseError('Error fetching quiz history', error, { 
          userId, 
          limit,
          sessionUserId: session.user.id,
          hasSession: !!session
        });
      }
      return [];
    }

    return data || [];
  } catch (error) {
    // Check if error has meaningful content before logging
    const isErrorObject = typeof error === 'object' && error !== null;
    const errorKeys = isErrorObject ? Object.keys(error) : [];
    const isEmptyObject = isErrorObject && errorKeys.length === 0;
    const errorMessage = error instanceof Error ? error.message : (typeof error === 'string' ? error : null);
    const hasMessage = errorMessage && errorMessage.trim().length > 0;
    
    // Only log if error has meaningful content
    if (!isEmptyObject && (hasMessage || (error as any)?.code || (error as any)?.details || (error as any)?.hint)) {
      logSupabaseError('Unexpected error fetching quiz history', error, { userId, limit });
    }
    return [];
  }
};

// Get quiz statistics for a user
export const getQuizStats = async (userId: string) => {
  const defaultStats = {
    totalQuizzes: 0,
    averageScore: 0,
    averageAccuracy: 0,
    totalTimeSpent: 0,
    bestScore: 0,
    quizTypes: {},
    languages: {}
  };

  if (!userId) {
    console.warn('[getQuizStats] No userId provided');
    return defaultStats;
  }

  try {
    // Check session first
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.warn('[getQuizStats] No active session');
      return defaultStats;
    }

    const { data, error } = await supabase
      .from('quiz_history')
      .select('score, total_questions, accuracy, time_spent, quiz_type, language')
      .eq('user_id', userId);

    if (error) {
      // Check if error is not an empty object before logging
      const isErrorObject = typeof error === 'object' && error !== null;
      const errorKeys = isErrorObject ? Object.keys(error) : [];
      const isEmptyObject = isErrorObject && errorKeys.length === 0;
      const hasMessage = error.message && typeof error.message === 'string' && error.message.trim().length > 0;
      const hasCode = error.code && (typeof error.code === 'string' || typeof error.code === 'number');
      
      // Only log if error has meaningful content
      if (!isEmptyObject && (hasMessage || hasCode || error.details || error.hint)) {
        logSupabaseError('Error fetching quiz stats', error, { 
          userId,
          sessionUserId: session.user.id,
          hasSession: !!session
        });
      }
      return defaultStats;
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
    const errorCode = (error as any)?.code;
    if (errorCode !== 'PGRST116') {
      // Check if error has meaningful content before logging
      const isErrorObject = typeof error === 'object' && error !== null;
      const errorKeys = isErrorObject ? Object.keys(error) : [];
      const isEmptyObject = isErrorObject && errorKeys.length === 0;
      const errorMessage = error instanceof Error ? error.message : (typeof error === 'string' ? error : null);
      const hasMessage = errorMessage && errorMessage.trim().length > 0;
      
      // Only log if error has meaningful content
      if (!isEmptyObject && (hasMessage || (error as any)?.code || (error as any)?.details || (error as any)?.hint)) {
        logSupabaseError('Unexpected error fetching quiz stats', error, { userId });
      }
    }
    // Return default stats instead of null
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
};

// Create quiz history table if it doesn't exist
export const createQuizHistoryTable = async () => {
  try {
    const { error } = await supabase.rpc('create_quiz_history_table');
    if (error) {
      // Check if error is not an empty object before logging
      const isErrorObject = typeof error === 'object' && error !== null;
      const errorKeys = isErrorObject ? Object.keys(error) : [];
      const isEmptyObject = isErrorObject && errorKeys.length === 0;
      const hasMessage = error.message && typeof error.message === 'string' && error.message.trim().length > 0;
      const hasCode = error.code && (typeof error.code === 'string' || typeof error.code === 'number');
      
      // Only log if error has meaningful content
      if (!isEmptyObject && (hasMessage || hasCode || error.details || error.hint)) {
        logSupabaseError('Error creating quiz history table', error);
      }
    }
  } catch (error) {
    // Check if error has meaningful content before logging
    const isErrorObject = typeof error === 'object' && error !== null;
    const errorKeys = isErrorObject ? Object.keys(error) : [];
    const isEmptyObject = isErrorObject && errorKeys.length === 0;
    const errorMessage = error instanceof Error ? error.message : (typeof error === 'string' ? error : null);
    const hasMessage = errorMessage && errorMessage.trim().length > 0;
    
    // Only log if error has meaningful content
    if (!isEmptyObject && (hasMessage || (error as any)?.code || (error as any)?.details || (error as any)?.hint)) {
      logSupabaseError('Unexpected error creating quiz history table', error);
    }
  }
};
