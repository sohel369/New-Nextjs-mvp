'use client';

import { useState, useEffect } from 'react';
import { Flame, Star, Award, Trophy, Target, Users } from 'lucide-react';
import confetti from 'canvas-confetti';

interface UserProgress {
  streak: number;
  totalXP: number;
  level: number;
  badges: Badge[];
  rank: number;
  weeklyXP: number;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

interface ProgressTrackerProps {
  progress: UserProgress;
  onLevelUp?: () => void;
}

export default function ProgressTracker({ progress, onLevelUp }: ProgressTrackerProps) {
  const [showBadges, setShowBadges] = useState(false);
  const [recentBadge, setRecentBadge] = useState<Badge | null>(null);

  useEffect(() => {
    // Check for new badges
    const newBadge = progress.badges.find(badge => {
      const earnedDate = new Date(badge.earnedAt);
      const now = new Date();
      return (now.getTime() - earnedDate.getTime()) < 5000; // 5 seconds ago
    });
    
    if (newBadge) {
      setRecentBadge(newBadge);
      setTimeout(() => setRecentBadge(null), 3000);
    }
  }, [progress.badges]);

  const getLevelProgress = () => {
    const currentLevelXP = progress.level * 1000;
    const nextLevelXP = (progress.level + 1) * 1000;
    const progressXP = progress.totalXP - currentLevelXP;
    const neededXP = nextLevelXP - currentLevelXP;
    return Math.min((progressXP / neededXP) * 100, 100);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="space-y-6">
      {/* Recent Badge Notification */}
      {recentBadge && (
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-4 animate-fade-in">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{recentBadge.icon}</span>
            <div>
              <h4 className="font-bold text-white">New Badge Earned!</h4>
              <p className="text-yellow-100">{recentBadge.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Progress Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Flame className="w-5 h-5 text-white" />
            <span className="text-sm text-orange-100">Streak</span>
          </div>
          <div className="text-2xl font-bold text-white">{progress.streak}</div>
          <div className="text-xs text-orange-200">days</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Star className="w-5 h-5 text-white" />
            <span className="text-sm text-yellow-100">Total XP</span>
          </div>
          <div className="text-2xl font-bold text-white">{progress.totalXP.toLocaleString()}</div>
          <div className="text-xs text-yellow-200">experience</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Award className="w-5 h-5 text-white" />
            <span className="text-sm text-blue-100">Level</span>
          </div>
          <div className="text-2xl font-bold text-white">{progress.level}</div>
          <div className="text-xs text-blue-200">current level</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Trophy className="w-5 h-5 text-white" />
            <span className="text-sm text-green-100">Rank</span>
          </div>
          <div className="text-2xl font-bold text-white">{getRankIcon(progress.rank)}</div>
          <div className="text-xs text-green-200">leaderboard</div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="bg-gray-800/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Level Progress</h3>
          <span className="text-sm text-gray-400">
            {progress.totalXP} / {(progress.level + 1) * 1000} XP
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${getLevelProgress()}%` }}
          />
        </div>
        <p className="text-sm text-gray-400 mt-2">
          {Math.ceil((progress.level + 1) * 1000 - progress.totalXP)} XP to next level
        </p>
      </div>

      {/* Weekly Progress */}
      <div className="bg-gray-800/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">This Week</h3>
          <span className="text-sm text-gray-400">Weekly Goal: 1000 XP</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((progress.weeklyXP / 1000) * 100, 100)}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-medium text-white">{progress.weeklyXP} XP</span>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-gray-800/50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Badges</h3>
          <button
            onClick={() => setShowBadges(!showBadges)}
            className="text-sm text-purple-400 hover:text-purple-300"
          >
            {showBadges ? 'Hide' : 'View All'}
          </button>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {progress.badges.slice(0, showBadges ? progress.badges.length : 6).map((badge) => (
            <div key={badge.id} className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">{badge.icon}</span>
              </div>
              <p className="text-xs text-gray-300 font-medium">{badge.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Preview */}
      <div className="bg-gray-800/50 rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-5 h-5 text-white" />
          <h3 className="text-lg font-bold text-white">Leaderboard</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((rank) => (
            <div key={rank} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getRankIcon(rank)}</span>
                <div>
                  <p className="text-white font-medium">User {rank}</p>
                  <p className="text-sm text-gray-400">{rank * 1500} XP</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Level {rank + 2}</p>
                <p className="text-xs text-gray-500">{rank * 5} day streak</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}