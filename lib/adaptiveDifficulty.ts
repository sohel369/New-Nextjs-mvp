// Adaptive Difficulty System
// Adjusts question difficulty based on user performance

import { QuizQuestion } from '../data/quizSystemData';

export interface UserPerformance {
  totalAnswered: number;
  totalCorrect: number;
  recentAnswers: boolean[]; // Last 10 answers
  averageResponseTime: number;
  streak: number;
  accuracy: number;
}

export interface DifficultyAdjustment {
  newDifficulty: 'easy' | 'medium' | 'hard';
  reason: string;
  confidence: number; // 0-1, how confident we are in this adjustment
}

export class AdaptiveDifficultyManager {
  private static instance: AdaptiveDifficultyManager;
  private performanceHistory: Map<string, UserPerformance> = new Map();

  private constructor() {}

  public static getInstance(): AdaptiveDifficultyManager {
    if (!AdaptiveDifficultyManager.instance) {
      AdaptiveDifficultyManager.instance = new AdaptiveDifficultyManager();
    }
    return AdaptiveDifficultyManager.instance;
  }

  // Update user performance after answering a question
  public updatePerformance(
    userId: string,
    isCorrect: boolean,
    responseTime: number,
    currentDifficulty: 'easy' | 'medium' | 'hard'
  ): void {
    const performance = this.performanceHistory.get(userId) || this.getDefaultPerformance();
    
    // Update basic stats
    performance.totalAnswered++;
    if (isCorrect) {
      performance.totalCorrect++;
      performance.streak++;
    } else {
      performance.streak = 0;
    }
    
    // Update recent answers (keep last 10)
    performance.recentAnswers.push(isCorrect);
    if (performance.recentAnswers.length > 10) {
      performance.recentAnswers.shift();
    }
    
    // Update average response time
    performance.averageResponseTime = 
      (performance.averageResponseTime * (performance.totalAnswered - 1) + responseTime) / 
      performance.totalAnswered;
    
    // Update accuracy
    performance.accuracy = (performance.totalCorrect / performance.totalAnswered) * 100;
    
    this.performanceHistory.set(userId, performance);
  }

  // Get recommended difficulty adjustment
  public getDifficultyAdjustment(
    userId: string,
    currentDifficulty: 'easy' | 'medium' | 'hard'
  ): DifficultyAdjustment {
    const performance = this.performanceHistory.get(userId);
    
    if (!performance || performance.totalAnswered < 5) {
      return {
        newDifficulty: currentDifficulty,
        reason: 'Insufficient data for adjustment',
        confidence: 0
      };
    }

    const recentAccuracy = this.calculateRecentAccuracy(performance);
    const isStruggling = this.isUserStruggling(performance);
    const isExcelling = this.isUserExcelling(performance);
    const isConsistent = this.isUserConsistent(performance);

    // Difficulty adjustment logic
    if (isExcelling && currentDifficulty !== 'hard') {
      return {
        newDifficulty: this.increaseDifficulty(currentDifficulty),
        reason: 'Excellent performance! Increasing difficulty.',
        confidence: 0.8
      };
    } else if (isStruggling && currentDifficulty !== 'easy') {
      return {
        newDifficulty: this.decreaseDifficulty(currentDifficulty),
        reason: 'Let\'s try easier questions to build confidence.',
        confidence: 0.7
      };
    } else if (isConsistent && recentAccuracy > 80 && currentDifficulty === 'easy') {
      return {
        newDifficulty: 'medium',
        reason: 'Consistent good performance. Ready for medium difficulty.',
        confidence: 0.6
      };
    } else if (isConsistent && recentAccuracy > 85 && currentDifficulty === 'medium') {
      return {
        newDifficulty: 'hard',
        reason: 'Ready for the challenge! Moving to hard difficulty.',
        confidence: 0.6
      };
    }

    return {
      newDifficulty: currentDifficulty,
      reason: 'Current difficulty is appropriate',
      confidence: 0.5
    };
  }

  // Get next question with adaptive difficulty
  public getNextQuestion(
    userId: string,
    language: string,
    currentDifficulty: 'easy' | 'medium' | 'hard',
    availableQuestions: QuizQuestion[]
  ): { question: QuizQuestion; difficulty: 'easy' | 'medium' | 'hard' } {
    const adjustment = this.getDifficultyAdjustment(userId, currentDifficulty);
    const targetDifficulty = adjustment.confidence > 0.6 ? adjustment.newDifficulty : currentDifficulty;
    
    // Filter questions by target difficulty
    const difficultyQuestions = availableQuestions.filter(q => q.difficulty === targetDifficulty);
    
    if (difficultyQuestions.length === 0) {
      // Fallback to current difficulty if no questions available
      const fallbackQuestions = availableQuestions.filter(q => q.difficulty === currentDifficulty);
      return {
        question: fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)],
        difficulty: currentDifficulty
      };
    }
    
    // Select question based on user performance
    const question = this.selectOptimalQuestion(difficultyQuestions, userId);
    
    return {
      question,
      difficulty: targetDifficulty
    };
  }

  // Calculate recent accuracy (last 5-10 answers)
  private calculateRecentAccuracy(performance: UserPerformance): number {
    if (performance.recentAnswers.length === 0) return 0;
    
    const recentCount = Math.min(5, performance.recentAnswers.length);
    const recentAnswers = performance.recentAnswers.slice(-recentCount);
    const correctCount = recentAnswers.filter(answer => answer).length;
    
    return (correctCount / recentCount) * 100;
  }

  // Check if user is struggling
  private isUserStruggling(performance: UserPerformance): boolean {
    const recentAccuracy = this.calculateRecentAccuracy(performance);
    const hasLowStreak = performance.streak < 2;
    const hasSlowResponse = performance.averageResponseTime > 15000; // 15 seconds
    
    return recentAccuracy < 40 || (recentAccuracy < 60 && hasLowStreak) || hasSlowResponse;
  }

  // Check if user is excelling
  private isUserExcelling(performance: UserPerformance): boolean {
    const recentAccuracy = this.calculateRecentAccuracy(performance);
    const hasHighStreak = performance.streak >= 5;
    const hasFastResponse = performance.averageResponseTime < 8000; // 8 seconds
    
    return recentAccuracy >= 90 && hasHighStreak && hasFastResponse;
  }

  // Check if user is consistent
  private isUserConsistent(performance: UserPerformance): boolean {
    if (performance.recentAnswers.length < 5) return false;
    
    const recentAnswers = performance.recentAnswers.slice(-5);
    const correctCount = recentAnswers.filter(answer => answer).length;
    const accuracy = (correctCount / 5) * 100;
    
    // Consistent if accuracy is between 70-90%
    return accuracy >= 70 && accuracy <= 90;
  }

  // Increase difficulty
  private increaseDifficulty(current: 'easy' | 'medium' | 'hard'): 'easy' | 'medium' | 'hard' {
    switch (current) {
      case 'easy': return 'medium';
      case 'medium': return 'hard';
      case 'hard': return 'hard';
    }
  }

  // Decrease difficulty
  private decreaseDifficulty(current: 'easy' | 'medium' | 'hard'): 'easy' | 'medium' | 'hard' {
    switch (current) {
      case 'easy': return 'easy';
      case 'medium': return 'easy';
      case 'hard': return 'medium';
    }
  }

  // Select optimal question based on user performance
  private selectOptimalQuestion(questions: QuizQuestion[], userId: string): QuizQuestion {
    const performance = this.performanceHistory.get(userId);
    
    if (!performance) {
      // Random selection for new users
      return questions[Math.floor(Math.random() * questions.length)];
    }
    
    // Weight questions based on user performance
    const weightedQuestions = questions.map(question => {
      let weight = 1;
      
      // Prefer questions from categories user struggles with
      const categoryPerformance = this.getCategoryPerformance(userId, question.category);
      if (categoryPerformance < 60) {
        weight *= 1.5; // Higher weight for struggling categories
      }
      
      // Prefer questions user hasn't seen recently
      if (!this.hasSeenRecently(userId, question.id)) {
        weight *= 1.2;
      }
      
      return { question, weight };
    });
    
    // Select weighted random question
    const totalWeight = weightedQuestions.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const { question, weight } of weightedQuestions) {
      random -= weight;
      if (random <= 0) {
        return question;
      }
    }
    
    // Fallback
    return questions[Math.floor(Math.random() * questions.length)];
  }

  // Get performance for a specific category
  private getCategoryPerformance(userId: string, category: string): number {
    // This would track category-specific performance in a real implementation
    // For now, return a default value
    return 70;
  }

  // Check if user has seen this question recently
  private hasSeenRecently(userId: string, questionId: string): boolean {
    // This would track recently seen questions in a real implementation
    // For now, return false
    return false;
  }

  // Get default performance
  private getDefaultPerformance(): UserPerformance {
    return {
      totalAnswered: 0,
      totalCorrect: 0,
      recentAnswers: [],
      averageResponseTime: 0,
      streak: 0,
      accuracy: 0
    };
  }

  // Get user performance summary
  public getUserPerformance(userId: string): UserPerformance | null {
    return this.performanceHistory.get(userId) || null;
  }

  // Reset user performance
  public resetUserPerformance(userId: string): void {
    this.performanceHistory.delete(userId);
  }

  // Get performance insights
  public getPerformanceInsights(userId: string): {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  } {
    const performance = this.performanceHistory.get(userId);
    
    if (!performance) {
      return {
        strengths: [],
        weaknesses: [],
        recommendations: ['Start taking quizzes to get personalized insights!']
      };
    }
    
    const insights = {
      strengths: [] as string[],
      weaknesses: [] as string[],
      recommendations: [] as string[]
    };
    
    // Analyze strengths
    if (performance.accuracy >= 80) {
      insights.strengths.push('High accuracy rate');
    }
    if (performance.streak >= 5) {
      insights.strengths.push('Great consistency');
    }
    if (performance.averageResponseTime < 10000) {
      insights.strengths.push('Quick response time');
    }
    
    // Analyze weaknesses
    if (performance.accuracy < 60) {
      insights.weaknesses.push('Accuracy needs improvement');
    }
    if (performance.streak < 3) {
      insights.weaknesses.push('Inconsistent performance');
    }
    if (performance.averageResponseTime > 15000) {
      insights.weaknesses.push('Slow response time');
    }
    
    // Generate recommendations
    if (performance.accuracy < 70) {
      insights.recommendations.push('Try easier difficulty to build confidence');
    }
    if (performance.streak < 3) {
      insights.recommendations.push('Focus on consistency over speed');
    }
    if (performance.averageResponseTime > 20000) {
      insights.recommendations.push('Take your time to read questions carefully');
    }
    
    return insights;
  }
}

// Export singleton instance
export const adaptiveDifficultyManager = AdaptiveDifficultyManager.getInstance();

// Utility functions
export const updateUserPerformance = (
  userId: string,
  isCorrect: boolean,
  responseTime: number,
  currentDifficulty: 'easy' | 'medium' | 'hard'
) => {
  adaptiveDifficultyManager.updatePerformance(userId, isCorrect, responseTime, currentDifficulty);
};

export const getDifficultyAdjustment = (
  userId: string,
  currentDifficulty: 'easy' | 'medium' | 'hard'
) => {
  return adaptiveDifficultyManager.getDifficultyAdjustment(userId, currentDifficulty);
};

export const getNextAdaptiveQuestion = (
  userId: string,
  language: string,
  currentDifficulty: 'easy' | 'medium' | 'hard',
  availableQuestions: QuizQuestion[]
) => {
  return adaptiveDifficultyManager.getNextQuestion(userId, language, currentDifficulty, availableQuestions);
};
