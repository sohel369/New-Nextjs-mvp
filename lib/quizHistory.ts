import { db, auth } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit,
  getDoc,
  doc
} from 'firebase/firestore';
import { QuizHistory } from '../data/languageData';

// Save quiz history to database
export const saveQuizHistory = async (quizData: Omit<QuizHistory, 'id'>): Promise<QuizHistory | null> => {
  try {
    const docRef = await addDoc(collection(db, 'quiz_history'), {
      user_id: quizData.userId,
      quiz_type: quizData.quizType,
      language: quizData.language,
      score: quizData.score,
      total_questions: quizData.totalQuestions,
      accuracy: quizData.accuracy,
      time_spent: quizData.timeSpent,
      completed_at: quizData.completedAt || new Date().toISOString(),
      questions: quizData.questions || []
    });

    return { id: docRef.id, ...quizData } as QuizHistory;
  } catch (error) {
    console.error('Error saving quiz history to Firebase:', error);
    return null;
  }
};

// Get quiz history for a user
export const getQuizHistory = async (userId: string, limitCount: number = 10): Promise<QuizHistory[]> => {
  if (!userId) {
    console.warn('[getQuizHistory] No userId provided');
    return [];
  }

  try {
    const q = query(
      collection(db, 'quiz_history'),
      where('user_id', '==', userId),
      orderBy('completed_at', 'desc'),
      firestoreLimit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.user_id,
        quizType: data.quiz_type,
        language: data.language,
        score: data.score,
        totalQuestions: data.total_questions,
        accuracy: data.accuracy,
        timeSpent: data.time_spent,
        completedAt: data.completed_at,
        questions: data.questions || []
      } as QuizHistory;
    });
  } catch (error) {
    console.error('Error fetching quiz history from Firebase:', error);
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
    quizTypes: {} as Record<string, number>,
    languages: {} as Record<string, number>
  };

  if (!userId) {
    console.warn('[getQuizStats] No userId provided');
    return defaultStats;
  }

  try {
    const q = query(
      collection(db, 'quiz_history'),
      where('user_id', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(doc => doc.data());

    if (!data || data.length === 0) {
      return defaultStats;
    }

    const totalQuizzes = data.length;
    const totalScore = data.reduce((sum, quiz) => sum + (quiz.score || 0), 0);
    const totalTimeSpent = data.reduce((sum, quiz) => sum + (quiz.time_spent || 0), 0);
    const averageScore = totalScore / totalQuizzes;
    const averageAccuracy = data.reduce((sum, quiz) => sum + (quiz.accuracy || 0), 0) / totalQuizzes;
    const bestScore = Math.max(...data.map(quiz => quiz.score || 0));

    // Count quiz types
    const quizTypes = data.reduce((acc, quiz) => {
      const type = quiz.quiz_type || 'unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Count languages
    const languages = data.reduce((acc, quiz) => {
      const lang = quiz.language || 'unknown';
      acc[lang] = (acc[lang] || 0) + 1;
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
    console.error('Error fetching quiz stats from Firebase:', error);
    return defaultStats;
  }
};

// Create quiz history table if it doesn't exist
export const createQuizHistoryTable = async () => {
  // Firestore handles collection creation automatically
  console.log('Firebase Firestore initialized - quiz_history collection is ready');
};
