'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  User, 
  RefreshCw,
  Database,
  Key,
  Clock
} from 'lucide-react';

export default function DebugSessionPage() {
  const { user, loading } = useAuth();
  const [sessionInfo, setSessionInfo] = useState<any>({});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    setRefreshing(true);
    
    try {
      const info: any = {};

      // Check current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      info.session = {
        exists: !!session,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        expiresAt: session?.expires_at,
        accessToken: session?.access_token ? 'Present' : 'Missing',
        refreshToken: session?.refresh_token ? 'Present' : 'Missing',
        error: sessionError?.message
      };

      // Check current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      info.user = {
        exists: !!currentUser,
        userId: currentUser?.id,
        userEmail: currentUser?.email,
        error: userError?.message
      };

      // Check localStorage for session data
      if (typeof window !== 'undefined') {
        const supabaseAuth = localStorage.getItem('sb-uaijcvhvyurbnfmkqnqt-auth-token');
        info.localStorage = {
          hasAuthToken: !!supabaseAuth,
          tokenLength: supabaseAuth?.length || 0
        };
      }

      // Check AuthContext
      info.authContext = {
        hasUser: !!user,
        loading: loading,
        userId: user?.id,
        userEmail: user?.email
      };

      setSessionInfo(info);
    } catch (error) {
      console.error('Error checking session:', error);
      setSessionInfo({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setRefreshing(false);
    }
  };

  const clearSession = async () => {
    try {
      await supabase.auth.signOut();
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
      console.log('Session cleared');
      await checkSession();
    } catch (error) {
      console.error('Error clearing session:', error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Database className="w-8 h-8 mr-3" />
              Session Debug Information
            </h1>
            <div className="flex space-x-2">
              <button
                onClick={checkSession}
                disabled={refreshing}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                onClick={clearSession}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
              >
                <XCircle className="w-4 h-4" />
                <span>Clear Session</span>
              </button>
            </div>
          </div>

          {/* Supabase Session */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Key className="w-6 h-6 mr-2" />
              Supabase Session
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(sessionInfo.session?.exists)}
                  <span className="text-white font-medium">Session Exists</span>
                </div>
                <div className={`text-sm ${getStatusColor(sessionInfo.session?.exists)}`}>
                  {sessionInfo.session?.exists ? 'Yes' : 'No'}
                </div>
              </div>

              {sessionInfo.session?.exists && (
                <>
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">User ID</span>
                    </div>
                    <div className="text-white/70 text-sm font-mono">
                      {sessionInfo.session.userId?.substring(0, 8)}...
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">Email</span>
                    </div>
                    <div className="text-white/70 text-sm">
                      {sessionInfo.session.userEmail || 'Not set'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">Expires At</span>
                    </div>
                    <div className="text-white/70 text-sm">
                      {sessionInfo.session.expiresAt ? new Date(sessionInfo.session.expiresAt * 1000).toLocaleString() : 'Not set'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Key className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">Access Token</span>
                    </div>
                    <div className="text-white/70 text-sm">
                      {sessionInfo.session.accessToken || 'Missing'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Key className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">Refresh Token</span>
                    </div>
                    <div className="text-white/70 text-sm">
                      {sessionInfo.session.refreshToken || 'Missing'}
                    </div>
                  </div>
                </>
              )}

              {sessionInfo.session?.error && (
                <div className="col-span-2 bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                  <div className="text-red-400 text-sm">
                    <strong>Session Error:</strong> {sessionInfo.session.error}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Current User */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <User className="w-6 h-6 mr-2" />
              Current User
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(sessionInfo.user?.exists)}
                  <span className="text-white font-medium">User Exists</span>
                </div>
                <div className={`text-sm ${getStatusColor(sessionInfo.user?.exists)}`}>
                  {sessionInfo.user?.exists ? 'Yes' : 'No'}
                </div>
              </div>

              {sessionInfo.user?.exists && (
                <>
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">User ID</span>
                    </div>
                    <div className="text-white/70 text-sm font-mono">
                      {sessionInfo.user.userId?.substring(0, 8)}...
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">Email</span>
                    </div>
                    <div className="text-white/70 text-sm">
                      {sessionInfo.user.userEmail || 'Not set'}
                    </div>
                  </div>
                </>
              )}

              {sessionInfo.user?.error && (
                <div className="col-span-2 bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                  <div className="text-red-400 text-sm">
                    <strong>User Error:</strong> {sessionInfo.user.error}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Local Storage */}
          {sessionInfo.localStorage && (
            <div className="bg-white/5 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Database className="w-6 h-6 mr-2" />
                Local Storage
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(sessionInfo.localStorage?.hasAuthToken)}
                    <span className="text-white font-medium">Auth Token</span>
                  </div>
                  <div className="text-white/70 text-sm">
                    {sessionInfo.localStorage?.hasAuthToken ? 'Present' : 'Missing'}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Database className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-medium">Token Length</span>
                  </div>
                  <div className="text-white/70 text-sm">
                    {sessionInfo.localStorage?.tokenLength || 0} characters
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Auth Context */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <User className="w-6 h-6 mr-2" />
              Auth Context
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(sessionInfo.authContext?.hasUser)}
                  <span className="text-white font-medium">Has User</span>
                </div>
                <div className={`text-sm ${getStatusColor(sessionInfo.authContext?.hasUser)}`}>
                  {sessionInfo.authContext?.hasUser ? 'Yes' : 'No'}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <RefreshCw className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-medium">Loading</span>
                </div>
                <div className={`text-sm ${sessionInfo.authContext?.loading ? 'text-yellow-400' : 'text-green-400'}`}>
                  {sessionInfo.authContext?.loading ? 'Yes' : 'No'}
                </div>
              </div>

              {sessionInfo.authContext?.hasUser && (
                <>
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">User ID</span>
                    </div>
                    <div className="text-white/70 text-sm font-mono">
                      {sessionInfo.authContext.userId?.substring(0, 8)}...
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">Email</span>
                    </div>
                    <div className="text-white/70 text-sm">
                      {sessionInfo.authContext.userEmail || 'Not set'}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Troubleshooting Guide */}
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-6">
            <h3 className="text-yellow-400 font-semibold mb-4">Troubleshooting Guide:</h3>
            <ol className="text-yellow-300 text-sm space-y-2">
              <li>1. <strong>Session Missing:</strong> Clear session and try logging in again</li>
              <li>2. <strong>Token Issues:</strong> Check if access/refresh tokens are present</li>
              <li>3. <strong>Local Storage:</strong> Clear browser data if tokens are corrupted</li>
              <li>4. <strong>Auth Context:</strong> Check if user data is properly synchronized</li>
              <li>5. <strong>Network Issues:</strong> Verify Supabase connection and configuration</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
