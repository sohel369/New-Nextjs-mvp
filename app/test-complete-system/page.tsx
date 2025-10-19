'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Database, 
  Users, 
  BookOpen, 
  Trophy, 
  Settings,
  Globe,
  Bell,
  Volume2
} from 'lucide-react';
import Link from 'next/link';

export default function TestCompleteSystemPage() {
  const { user } = useAuth();
  const [systemStatus, setSystemStatus] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      testSystemComponents();
    }
  }, [user]);

  const testSystemComponents = async () => {
    try {
      setLoading(true);
      const status: any = {};

      // Test database connection
      try {
        const { data, error } = await supabase.from('profiles').select('id').limit(1);
        status.database = { connected: !error, error: error?.message };
      } catch (error) {
        status.database = { connected: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }

      // Test user profile
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          status.profile = { exists: !error, data: data, error: error?.message };
        } catch (error) {
          status.profile = { exists: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
      }

      // Test user settings
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();
          status.settings = { exists: !error, data: data, error: error?.message };
        } catch (error) {
          status.settings = { exists: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
      }

      // Test languages table
      try {
        const { data, error } = await supabase.from('languages').select('*').limit(1);
        status.languages = { available: !error, count: data?.length || 0, error: error?.message };
      } catch (error) {
        status.languages = { available: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }

      // Test lessons table
      try {
        const { data, error } = await supabase.from('lessons').select('*').limit(1);
        status.lessons = { available: !error, count: data?.length || 0, error: error?.message };
      } catch (error) {
        status.lessons = { available: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }

      // Test quizzes table
      try {
        const { data, error } = await supabase.from('quizzes').select('*').limit(1);
        status.quizzes = { available: !error, count: data?.length || 0, error: error?.message };
      } catch (error) {
        status.quizzes = { available: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }

      // Test leaderboard view
      try {
        const { data, error } = await supabase.from('leaderboard').select('*').limit(1);
        status.leaderboard = { available: !error, count: data?.length || 0, error: error?.message };
      } catch (error) {
        status.leaderboard = { available: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }

      setSystemStatus(status);
    } catch (error) {
      console.error('Error testing system:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-5 h-5 text-green-400" />
    ) : (
      <XCircle className="w-5 h-5 text-red-400" />
    );
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-400' : 'text-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Testing system components...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            Complete System Test
          </h1>

          {/* Authentication Status */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Users className="w-6 h-6 mr-2" />
              Authentication Status
            </h2>
            {user ? (
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span>Authenticated as {user.name}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-red-400">
                <XCircle className="w-5 h-5" />
                <span>Not authenticated</span>
              </div>
            )}
          </div>

          {/* Database Status */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Database className="w-6 h-6 mr-2" />
              Database Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(systemStatus).map(([key, status]: [string, any]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(status.connected || status.available || status.exists)}
                    <span className="text-white font-medium capitalize">{key}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm ${getStatusColor(status.connected || status.available || status.exists)}`}>
                      {status.connected || status.available || status.exists ? 'OK' : 'Error'}
                    </div>
                    {status.count !== undefined && (
                      <div className="text-white/70 text-xs">{status.count} items</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Features */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              System Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                  <h3 className="text-white font-semibold">Lessons System</h3>
                </div>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Language-specific content</li>
                  <li>• Audio support</li>
                  <li>• Progress tracking</li>
                  <li>• XP rewards</li>
                </ul>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-white font-semibold">Quiz System</h3>
                </div>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Language-filtered quizzes</li>
                  <li>• Multiple difficulty levels</li>
                  <li>• Timer functionality</li>
                  <li>• Score tracking</li>
                </ul>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Users className="w-6 h-6 text-green-400" />
                  <h3 className="text-white font-semibold">Leaderboard</h3>
                </div>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Live rankings</li>
                  <li>• XP-based scoring</li>
                  <li>• Streak tracking</li>
                  <li>• Real-time updates</li>
                </ul>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Settings className="w-6 h-6 text-purple-400" />
                  <h3 className="text-white font-semibold">Profile Settings</h3>
                </div>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Language preferences</li>
                  <li>• Theme settings</li>
                  <li>• Notification controls</li>
                  <li>• Audio preferences</li>
                </ul>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Globe className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-white font-semibold">Multi-Language</h3>
                </div>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• 7 supported languages</li>
                  <li>• RTL support for Arabic</li>
                  <li>• Language-specific content</li>
                  <li>• Cultural adaptations</li>
                </ul>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Bell className="w-6 h-6 text-orange-400" />
                  <h3 className="text-white font-semibold">Notifications</h3>
                </div>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>• Live notifications</li>
                  <li>• Achievement alerts</li>
                  <li>• Progress updates</li>
                  <li>• Social features</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Test Actions */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Test Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/lessons"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <BookOpen className="w-5 h-5" />
                <span>Test Lessons</span>
              </Link>
              
              <Link
                href="/quiz"
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Trophy className="w-5 h-5" />
                <span>Test Quizzes</span>
              </Link>
              
              <Link
                href="/profile"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Settings className="w-5 h-5" />
                <span>Test Profile</span>
              </Link>
              
              <Link
                href="/leaderboard"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Users className="w-5 h-5" />
                <span>Test Leaderboard</span>
              </Link>
              
              <Link
                href="/test-language-integration"
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Globe className="w-5 h-5" />
                <span>Test Languages</span>
              </Link>
              
              <Link
                href="/test-notifications"
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Bell className="w-5 h-5" />
                <span>Test Notifications</span>
              </Link>
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-6">
            <h3 className="text-yellow-400 font-semibold mb-4">Setup Instructions:</h3>
            <ol className="text-yellow-300 text-sm space-y-2">
              <li>1. Run the complete database schema: <code className="bg-yellow-500/20 px-2 py-1 rounded">database/complete-user-schema.sql</code></li>
              <li>2. Ensure all RLS policies are enabled for data security</li>
              <li>3. Test the database functions and triggers</li>
              <li>4. Verify user authentication and profile creation</li>
              <li>5. Test lessons and quizzes with sample data</li>
              <li>6. Verify leaderboard functionality</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
