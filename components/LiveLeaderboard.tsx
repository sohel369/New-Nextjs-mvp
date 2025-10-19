'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Trophy, Crown, Medal, Star, RefreshCw, Users, Target, Flame } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar_url?: string;
  total_xp: number;
  level: number;
  streak: number;
  last_activity: string;
  rank: number;
}

interface LiveLeaderboardProps {
  userId?: string;
  limit?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export default function LiveLeaderboard({ 
  userId, 
  limit = 10, 
  autoRefresh = true, 
  refreshInterval = 30000 
}: LiveLeaderboardProps) {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadLeaderboard();
    
    if (autoRefresh) {
      const interval = setInterval(loadLeaderboard, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [limit, autoRefresh, refreshInterval]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      
      // Load leaderboard data
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .limit(limit);

      if (error) {
        console.error('Error loading leaderboard:', error);
        return;
      }

      setLeaderboard(data || []);
      setLastUpdated(new Date());

      // Load user's rank if userId is provided
      if (userId) {
        const { data: userRankData, error: rankError } = await supabase
          .rpc('get_user_leaderboard_position', { p_user_id: userId });

        if (rankError) {
          console.error('Error loading user rank:', rankError);
        } else {
          setUserRank(userRankData);
        }
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return <span className="text-white/70 font-bold">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
      case 2: return 'bg-gradient-to-r from-gray-400 to-gray-500';
      case 3: return 'bg-gradient-to-r from-amber-600 to-amber-700';
      default: return 'bg-gradient-to-r from-purple-600 to-blue-600';
    }
  };

  const formatXP = (xp: number) => {
    if (xp >= 1000000) {
      return `${(xp / 1000000).toFixed(1)}M`;
    } else if (xp >= 1000) {
      return `${(xp / 1000).toFixed(1)}K`;
    }
    return xp.toString();
  };

  const formatLastActivity = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getLevelFromXP = (xp: number) => {
    return Math.floor(xp / 1000) + 1;
  };

  if (loading && leaderboard.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <Trophy className="w-6 h-6 mr-2" />
          Leaderboard
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={loadLeaderboard}
            disabled={loading}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="text-white/50 text-sm">
            Updated {formatLastActivity(lastUpdated.toISOString())}
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      {leaderboard.length === 0 ? (
        <div className="text-center py-8">
          <Trophy className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h4 className="text-white/70 text-lg mb-2">No Rankings Yet</h4>
          <p className="text-white/50 text-sm">
            Start learning to appear on the leaderboard!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <div
              key={entry.id}
              className={`p-4 rounded-lg border transition-all ${
                entry.id === user?.id
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-white/20 bg-white/10 hover:bg-white/15'
              }`}
            >
              <div className="flex items-center space-x-4">
                {/* Rank */}
                <div className="flex-shrink-0">
                  {getRankIcon(entry.rank)}
                </div>

                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    getRankColor(entry.rank)
                  }`}>
                    {entry.avatar_url ? (
                      <img
                        src={entry.avatar_url}
                        alt={entry.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {entry.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-white font-semibold truncate">
                      {entry.name}
                      {entry.id === user?.id && (
                        <span className="ml-2 text-blue-400 text-sm">(You)</span>
                      )}
                    </h4>
                    {entry.rank <= 3 && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 text-sm font-medium">
                          Level {getLevelFromXP(entry.total_xp)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1 text-white/70 text-sm">
                      <Target className="w-4 h-4" />
                      <span>{formatXP(entry.total_xp)} XP</span>
                    </div>
                    <div className="flex items-center space-x-1 text-white/70 text-sm">
                      <Flame className="w-4 h-4" />
                      <span>{entry.streak} day streak</span>
                    </div>
                    <div className="text-white/50 text-sm">
                      {formatLastActivity(entry.last_activity)}
                    </div>
                  </div>
                </div>

                {/* XP Bar */}
                <div className="flex-shrink-0 w-24">
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        getRankColor(entry.rank)
                      }`}
                      style={{
                        width: `${Math.min((entry.total_xp % 1000) / 10, 100)}%`
                      }}
                    />
                  </div>
                  <div className="text-white/50 text-xs text-center mt-1">
                    {formatXP(entry.total_xp)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User Rank Info */}
      {userRank && userRank > limit && (
        <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">#{userRank}</span>
              </div>
              <div>
                <div className="text-white font-medium">Your Rank</div>
                <div className="text-white/70 text-sm">
                  You're ranked #{userRank} on the leaderboard
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-semibold">
                {user?.total_xp || 0} XP
              </div>
              <div className="text-white/70 text-sm">
                Level {getLevelFromXP(user?.total_xp || 0)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-white font-semibold text-lg">{leaderboard.length}</div>
          <div className="text-white/70 text-sm">Active Learners</div>
        </div>
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <div className="text-white font-semibold text-lg">
            {leaderboard.length > 0 ? formatXP(leaderboard[0].total_xp) : '0'}
          </div>
          <div className="text-white/70 text-sm">Top XP</div>
        </div>
        <div className="bg-white/10 rounded-lg p-4 text-center">
          <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
          <div className="text-white font-semibold text-lg">
            {leaderboard.length > 0 ? leaderboard[0].streak : '0'}
          </div>
          <div className="text-white/70 text-sm">Best Streak</div>
        </div>
      </div>
    </div>
  );
}