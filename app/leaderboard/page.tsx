'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trophy, RefreshCw } from 'lucide-react';
import LiveLeaderboard from '../../components/LiveLeaderboard';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboardType, setLeaderboardType] = useState<'all' | 'weekly' | 'monthly'>('all');

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center space-x-3 text-white hover:text-purple-300 transition-colors">
              <ArrowLeft className="w-6 h-6" />
              <span className="text-lg font-semibold">Leaderboard</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <span className="text-white font-semibold">Live Rankings</span>
            </div>
          </div>

          {/* Leaderboard Type Selector */}
          <div className="flex justify-center space-x-2 mb-6">
            {[
              { value: 'all', label: 'All Time', icon: '🏆' },
              { value: 'weekly', label: 'This Week', icon: '📅' },
              { value: 'monthly', label: 'This Month', icon: '📊' }
            ].map(type => (
              <button
                key={type.value}
                onClick={() => setLeaderboardType(type.value as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  leaderboardType === type.value
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <span className="text-lg">{type.icon}</span>
                <span className="font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Leaderboard */}
        <div className="px-6">
          <LiveLeaderboard 
            userId={user?.id}
            limit={20}
            autoRefresh={true}
            refreshInterval={30000}
          />
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-t border-white/20">
          <div className="flex items-center justify-around py-3">
            <Link href="/" className="flex flex-col items-center space-y-1 text-white/70 hover:text-white transition-colors">
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-sm">🏠</span>
              </div>
              <span className="text-xs">Home</span>
            </Link>
            <Link href="/lessons" className="flex flex-col items-center space-y-1 text-white/70 hover:text-white transition-colors">
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-sm">📚</span>
              </div>
              <span className="text-xs">Lessons</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center space-y-1 text-white/70 hover:text-white transition-colors">
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-sm">👤</span>
              </div>
              <span className="text-xs">Profile</span>
            </Link>
            <div className="flex flex-col items-center space-y-1 text-purple-400">
              <div className="w-6 h-6 bg-purple-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
              <span className="text-xs">Leaderboard</span>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
