// Quiz Progress Management System
// Handles XP, streaks, levels, achievements, and localStorage

import { UserProgress, XP_SYSTEM, ACHIEVEMENTS } from '../data/quizSystemData';

export class QuizProgressManager {
  private static instance: QuizProgressManager;
  private storageKey = 'language_learning_quiz_progress';

  private constructor() {}

  public static getInstance(): QuizProgressManager {
    if (!QuizProgressManager.instance) {
      QuizProgressManager.instance = new QuizProgressManager();
    }
    return QuizProgressManager.instance;
  }

  // Get user progress from localStorage
  public getUserProgress(): UserProgress {
    if (typeof window === 'undefined') {
      return this.getDefaultProgress();
    }

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const progress = JSON.parse(stored);
        // Ensure all required fields exist
        return {
          xp: progress.xp || 0,
          streak: progress.streak || 0,
          level: progress.level || 1,
          totalCorrect: progress.totalCorrect || 0,
          totalAnswered: progress.totalAnswered || 0,
          accuracy: progress.accuracy || 0,
          lastPlayed: progress.lastPlayed || new Date().toISOString(),
          achievements: progress.achievements || []
        };
      }
    } catch (error) {
      console.error('Error loading progress from localStorage:', error);
    }

    return this.getDefaultProgress();
  }

  // Save user progress to localStorage
  public saveUserProgress(progress: UserProgress): void {
    if (typeof window === 'undefined') return;

    try {
      progress.lastPlayed = new Date().toISOString();
      localStorage.setItem(this.storageKey, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress to localStorage:', error);
    }
  }

  // Update progress after answering a question
  public updateProgress(isCorrect: boolean, language: string): {
    progress: UserProgress;
    xpGained: number;
    streakBonus: number;
    levelUp: boolean;
    newAchievements: string[];
  } {
    const progress = this.getUserProgress();
    let xpGained = 0;
    let streakBonus = 0;
    let levelUp = false;
    const newAchievements: string[] = [];

    // Update basic stats
    progress.totalAnswered++;
    if (isCorrect) {
      progress.totalCorrect++;
      xpGained = XP_SYSTEM.CORRECT_ANSWER;
      
      // Streak bonus
      progress.streak++;
      if (progress.streak > 1) {
        streakBonus = Math.min(progress.streak * XP_SYSTEM.STREAK_BONUS, 50);
        xpGained += streakBonus;
      }
    } else {
      progress.streak = 0;
    }

    // Update XP and level
    const oldLevel = progress.level;
    progress.xp += xpGained;
    progress.level = Math.floor(progress.xp / XP_SYSTEM.LEVEL_UP_MULTIPLIER) + 1;
    levelUp = progress.level > oldLevel;

    // Update accuracy
    progress.accuracy = (progress.totalCorrect / progress.totalAnswered) * 100;

    // Check for achievements
    const achievements = this.checkAchievements(progress, isCorrect, language);
    newAchievements.push(...achievements);
    progress.achievements.push(...achievements);

    // Save progress
    this.saveUserProgress(progress);

    return {
      progress,
      xpGained,
      streakBonus,
      levelUp,
      newAchievements
    };
  }

  // Check for new achievements
  private checkAchievements(
    progress: UserProgress, 
    isCorrect: boolean, 
    language: string
  ): string[] {
    const newAchievements: string[] = [];
    const existingAchievements = new Set(progress.achievements);

    // First correct answer
    if (isCorrect && progress.totalCorrect === 1 && !existingAchievements.has(ACHIEVEMENTS.FIRST_CORRECT)) {
      newAchievements.push(ACHIEVEMENTS.FIRST_CORRECT);
    }

    // Streak achievements
    if (progress.streak === 5 && !existingAchievements.has(ACHIEVEMENTS.STREAK_5)) {
      newAchievements.push(ACHIEVEMENTS.STREAK_5);
    }
    if (progress.streak === 10 && !existingAchievements.has(ACHIEVEMENTS.STREAK_10)) {
      newAchievements.push(ACHIEVEMENTS.STREAK_10);
    }
    if (progress.streak === 20 && !existingAchievements.has(ACHIEVEMENTS.STREAK_20)) {
      newAchievements.push(ACHIEVEMENTS.STREAK_20);
    }

    // Level achievements
    if (progress.level >= 5 && !existingAchievements.has(ACHIEVEMENTS.LEVEL_5)) {
      newAchievements.push(ACHIEVEMENTS.LEVEL_5);
    }
    if (progress.level >= 10 && !existingAchievements.has(ACHIEVEMENTS.LEVEL_10)) {
      newAchievements.push(ACHIEVEMENTS.LEVEL_10);
    }

    // Perfect score (100% accuracy with at least 10 questions)
    if (progress.totalAnswered >= 10 && progress.accuracy === 100 && !existingAchievements.has(ACHIEVEMENTS.PERFECT_SCORE)) {
      newAchievements.push(ACHIEVEMENTS.PERFECT_SCORE);
    }

    return newAchievements;
  }

  // Reset progress (for testing or user request)
  public resetProgress(): void {
    const defaultProgress = this.getDefaultProgress();
    this.saveUserProgress(defaultProgress);
  }

  // Get default progress
  private getDefaultProgress(): UserProgress {
    return {
      xp: 0,
      streak: 0,
      level: 1,
      totalCorrect: 0,
      totalAnswered: 0,
      accuracy: 0,
      lastPlayed: new Date().toISOString(),
      achievements: []
    };
  }

  // Get progress statistics
  public getProgressStats(progress: UserProgress) {
    const currentLevelXP = (progress.level - 1) * XP_SYSTEM.LEVEL_UP_MULTIPLIER;
    const nextLevelXP = progress.level * XP_SYSTEM.LEVEL_UP_MULTIPLIER;
    const progressXP = progress.xp - currentLevelXP;
    const levelXP = nextLevelXP - currentLevelXP;
    const levelProgress = (progressXP / levelXP) * 100;

    return {
      currentLevel: progress.level,
      currentXP: progress.xp,
      nextLevelXP,
      levelProgress,
      streak: progress.streak,
      accuracy: progress.accuracy,
      totalCorrect: progress.totalCorrect,
      totalAnswered: progress.totalAnswered,
      achievements: progress.achievements
    };
  }

  // Get achievement descriptions
  public getAchievementDescription(achievement: string): string {
    const descriptions: Record<string, string> = {
      [ACHIEVEMENTS.FIRST_CORRECT]: 'First correct answer! 🎉',
      [ACHIEVEMENTS.STREAK_5]: '5 in a row! 🔥',
      [ACHIEVEMENTS.STREAK_10]: '10 streak! 💪',
      [ACHIEVEMENTS.STREAK_20]: '20 streak! 🚀',
      [ACHIEVEMENTS.LEVEL_5]: 'Level 5 reached! ⭐',
      [ACHIEVEMENTS.LEVEL_10]: 'Level 10 reached! 🌟',
      [ACHIEVEMENTS.PERFECT_SCORE]: 'Perfect score! 🏆',
      [ACHIEVEMENTS.LANGUAGE_MASTER]: 'Language master! 🎓'
    };

    return descriptions[achievement] || 'Achievement unlocked! 🎊';
  }

  // Check if user should get confetti (every 5 correct answers)
  public shouldShowConfetti(progress: UserProgress): boolean {
    return progress.totalCorrect > 0 && progress.totalCorrect % XP_SYSTEM.CONFETTI_INTERVAL === 0;
  }

  // Get daily streak (if implemented)
  public getDailyStreak(): number {
    if (typeof window === 'undefined') return 0;

    try {
      const lastPlayed = localStorage.getItem('last_quiz_date');
      const today = new Date().toDateString();
      
      if (lastPlayed === today) {
        const streak = localStorage.getItem('daily_streak');
        return streak ? parseInt(streak) : 0;
      } else {
        // Check if yesterday was played
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        
        if (lastPlayed === yesterdayStr) {
          const streak = localStorage.getItem('daily_streak');
          const currentStreak = streak ? parseInt(streak) + 1 : 1;
          localStorage.setItem('daily_streak', currentStreak.toString());
          localStorage.setItem('last_quiz_date', today);
          return currentStreak;
        } else {
          // Reset streak
          localStorage.setItem('daily_streak', '1');
          localStorage.setItem('last_quiz_date', today);
          return 1;
        }
      }
    } catch (error) {
      console.error('Error calculating daily streak:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const quizProgressManager = QuizProgressManager.getInstance();

// Utility functions
export const getUserProgress = () => {
  return quizProgressManager.getUserProgress();
};

export const updateQuizProgress = (isCorrect: boolean, language: string) => {
  return quizProgressManager.updateProgress(isCorrect, language);
};

export const resetQuizProgress = () => {
  quizProgressManager.resetProgress();
};

export const getProgressStats = (progress: UserProgress) => {
  return quizProgressManager.getProgressStats(progress);
};

export const getAchievementDescription = (achievement: string) => {
  return quizProgressManager.getAchievementDescription(achievement);
};
