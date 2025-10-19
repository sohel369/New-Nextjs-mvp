'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trophy, Star, Flame, Target } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { awardXP, XP_REWARDS } from '../../lib/leaderboard';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function TestXPPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleAwardXP = async (activity: keyof typeof XP_REWARDS) => {
    if (!user) return;

    setLoading(true);
    setResult(null);

    try {
      const result = await awardXP(user.id, activity);
      if (result) {
        setResult(`✅ Awarded ${XP_REWARDS[activity]} XP! New total: ${result.new_total_xp} XP, Level: ${result.new_level}, Rank: #${result.new_rank}`);
      } else {
        setResult('❌ Failed to award XP');
      }
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const activities = [
    { key: 'LESSON_COMPLETE', label: 'Complete Lesson', icon: <Target className="w-5 h-5" />, xp: XP_REWARDS.LESSON_COMPLETE },
    { key: 'QUIZ_PERFECT', label: 'Perfect Quiz', icon: <Star className="w-5 h-5" />, xp: XP_REWARDS.QUIZ_PERFECT },
    { key: 'VOCABULARY_LEARNED', label: 'Learn Vocabulary', icon: <Trophy className="w-5 h-5" />, xp: XP_REWARDS.VOCABULARY_LEARNED },
    { key: 'DAILY_LOGIN', label: 'Daily Login', icon: <Flame className="w-5 h-5" />, xp: XP_REWARDS.DAILY_LOGIN },
    { key: 'ACHIEVEMENT', label: 'Achievement', icon: <Trophy className="w-5 h-5" />, xp: XP_REWARDS.ACHIEVEMENT },
  ] as const;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center space-x-3 text-white hover:text-purple-300 transition-colors">
              <ArrowLeft className="w-6 h-6" />
              <span className="text-lg font-semibold">Test XP System</span>
            </Link>
          </div>

          {/* User Info */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Current User</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{user?.name || 'Guest'}</div>
                <div className="text-white/70 text-sm">Name</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{user?.total_xp || 0}</div>
                <div className="text-white/70 text-sm">Total XP</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{user?.level || 1}</div>
                <div className="text-white/70 text-sm">Level</div>
              </div>
            </div>
          </div>

          {/* XP Activities */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Award XP</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activities.map((activity) => (
                <button
                  key={activity.key}
                  onClick={() => handleAwardXP(activity.key)}
                  disabled={loading}
                  className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-purple-400">
                      {activity.icon}
                    </div>
                    <div className="text-left">
                      <div className="text-white font-medium">{activity.label}</div>
                      <div className="text-white/70 text-sm">{activity.xp} XP</div>
                    </div>
                  </div>
                  <div className="text-green-400">
                    <Plus className="w-5 h-5" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Result</h3>
              <div className="p-4 bg-white/5 rounded-lg">
                <div className="text-white whitespace-pre-wrap">{result}</div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Instructions</h3>
            <div className="text-white/80 space-y-2">
              <p>• Click any activity button to award XP</p>
              <p>• Check the leaderboard to see your rank update</p>
              <p>• XP is automatically saved to the database</p>
              <p>• Rankings are calculated in real-time</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
