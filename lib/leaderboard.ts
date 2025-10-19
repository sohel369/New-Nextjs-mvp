import { supabase } from './supabase';

export interface XPUpdateResult {
  new_total_xp: number;
  new_level: number;
  new_rank: number;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  email: string;
  total_xp: number;
  streak: number;
  level: number;
  avatar_url?: string;
  rank: number;
  tier: string;
  last_activity: string;
}

export interface UserRank {
  rank: number;
  total_users: number;
  percentile: number;
}

export interface LeaderboardStats {
  total_users: number;
  total_xp: number;
  avg_xp: number;
  max_xp: number;
  avg_streak: number;
  max_streak: number;
}

/**
 * Update user XP and recalculate rankings
 */
export async function updateUserXP(
  userId: string, 
  xpGained: number, 
  activityType: string = 'lesson'
): Promise<XPUpdateResult | null> {
  try {
    const { data, error } = await supabase
      .rpc('update_user_xp', {
        user_id: userId,
        xp_gained: xpGained,
        activity_type: activityType
      });

    if (error) {
      console.error('Error updating user XP:', error);
      return null;
    }

    return data[0] as XPUpdateResult;
  } catch (error) {
    console.error('Error updating user XP:', error);
    return null;
  }
}

/**
 * Get leaderboard data
 */
export async function getLeaderboard(
  limit: number = 10,
  type: 'all' | 'weekly' | 'monthly' = 'all'
): Promise<LeaderboardUser[]> {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      type
    });

    const response = await fetch(`/api/leaderboard?${params}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch leaderboard');
    }

    return data.data.leaderboard;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

/**
 * Get user's rank
 */
export async function getUserRank(userId: string): Promise<UserRank | null> {
  try {
    const params = new URLSearchParams({
      userId,
      limit: '1'
    });

    const response = await fetch(`/api/leaderboard?${params}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch user rank');
    }

    return data.data.userRank;
  } catch (error) {
    console.error('Error fetching user rank:', error);
    return null;
  }
}

/**
 * Get leaderboard statistics
 */
export async function getLeaderboardStats(): Promise<LeaderboardStats | null> {
  try {
    const response = await fetch('/api/leaderboard');
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch leaderboard stats');
    }

    return data.data.stats;
  } catch (error) {
    console.error('Error fetching leaderboard stats:', error);
    return null;
  }
}

/**
 * Award XP for completing activities
 */
export const XP_REWARDS = {
  LESSON_COMPLETE: 50,
  QUIZ_PERFECT: 100,
  QUIZ_GOOD: 75,
  QUIZ_OK: 50,
  STREAK_BONUS: 25,
  DAILY_LOGIN: 10,
  ACHIEVEMENT: 200,
  VOCABULARY_LEARNED: 5,
  SPEAKING_PRACTICE: 75,
  LISTENING_PRACTICE: 50,
  READING_PRACTICE: 40,
  WRITING_PRACTICE: 60
} as const;

/**
 * Award XP for a specific activity
 */
export async function awardXP(
  userId: string,
  activity: keyof typeof XP_REWARDS,
  streakBonus: boolean = false
): Promise<XPUpdateResult | null> {
  let xpGained = XP_REWARDS[activity];
  
  if (streakBonus) {
    xpGained += XP_REWARDS.STREAK_BONUS;
  }

  return await updateUserXP(userId, xpGained, activity.toLowerCase());
}

/**
 * Get tier based on XP
 */
export function getTierFromXP(xp: number): string {
  if (xp >= 5000) return 'Master';
  if (xp >= 3000) return 'Expert';
  if (xp >= 1500) return 'Advanced';
  if (xp >= 500) return 'Intermediate';
  return 'Beginner';
}

/**
 * Get tier color
 */
export function getTierColor(tier: string): string {
  switch (tier) {
    case 'Master':
      return 'text-purple-400';
    case 'Expert':
      return 'text-blue-400';
    case 'Advanced':
      return 'text-green-400';
    case 'Intermediate':
      return 'text-yellow-400';
    default:
      return 'text-gray-400';
  }
}

/**
 * Format XP with commas
 */
export function formatXP(xp: number): string {
  return xp.toLocaleString();
}

/**
 * Format time ago
 */
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}
