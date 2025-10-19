import { useState, useEffect, useCallback } from 'react';
import { getLeaderboard, getUserRank, getLeaderboardStats, updateUserXP, XPUpdateResult } from '../lib/leaderboard';
import { LeaderboardUser, UserRank, LeaderboardStats } from '../lib/leaderboard';

interface UseLeaderboardOptions {
  userId?: string;
  limit?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
  type?: 'all' | 'weekly' | 'monthly';
}

interface UseLeaderboardReturn {
  leaderboard: LeaderboardUser[];
  userRank: UserRank | null;
  stats: LeaderboardStats | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
  updateXP: (xpGained: number, activityType?: string) => Promise<XPUpdateResult | null>;
}

export function useLeaderboard({
  userId,
  limit = 10,
  autoRefresh = true,
  refreshInterval = 30000,
  type = 'all'
}: UseLeaderboardOptions = {}): UseLeaderboardReturn {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [userRank, setUserRank] = useState<UserRank | null>(null);
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [leaderboardData, rankData, statsData] = await Promise.all([
        getLeaderboard(limit, type),
        userId ? getUserRank(userId) : Promise.resolve(null),
        getLeaderboardStats()
      ]);

      setLeaderboard(leaderboardData);
      setUserRank(rankData);
      setStats(statsData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, [userId, limit, type]);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const updateXP = useCallback(async (xpGained: number, activityType: string = 'lesson'): Promise<XPUpdateResult | null> => {
    if (!userId) return null;
    
    try {
      const result = await updateUserXP(userId, xpGained, activityType);
      if (result) {
        // Refresh data after XP update
        await fetchData();
      }
      return result;
    } catch (err) {
      console.error('Error updating XP:', err);
      return null;
    }
  }, [userId, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, fetchData]);

  return {
    leaderboard,
    userRank,
    stats,
    loading,
    error,
    lastUpdated,
    refresh,
    updateXP
  };
}
