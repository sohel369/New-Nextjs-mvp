'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  User, 
  ArrowRight,
  Home,
  Settings,
  RefreshCw,
  LogIn,
  UserPlus
} from 'lucide-react';
import Link from 'next/link';

export default function DebugLoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!loading) {
      checkAuthStatus();
    }
  }, [user, loading]);

  const checkAuthStatus = async () => {
    try {
      const info: any = {};

      // Check Supabase auth session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      info.supabaseSession = {
        hasSession: !!session,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        error: sessionError?.message
      };

      // Check our auth context
      info.authContext = {
        hasUser: !!user,
        userId: user?.id,
        userEmail: user?.email,
        userName: user?.name,
        loading: loading
      };

      // Check current URL and redirect logic
      info.currentState = {
        currentPath: window.location.pathname,
        shouldRedirectToProfile: !!user,
        shouldRedirectToLogin: !user && !loading
      };

      setDebugInfo(info);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setDebugInfo({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await checkAuthStatus();
    setRefreshing(false);
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
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">
              Login Debug Information
            </h1>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Supabase Session */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <User className="w-6 h-6 mr-2" />
              Supabase Session
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(debugInfo.supabaseSession?.hasSession)}
                  <span className="text-white font-medium">Has Session</span>
                </div>
                <div className={`text-sm ${getStatusColor(debugInfo.supabaseSession?.hasSession)}`}>
                  {debugInfo.supabaseSession?.hasSession ? 'Yes' : 'No'}
                </div>
              </div>

              {debugInfo.supabaseSession?.hasSession && (
                <>
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">User ID</span>
                    </div>
                    <div className="text-white/70 text-sm font-mono">
                      {debugInfo.supabaseSession.userId?.substring(0, 8)}...
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">Email</span>
                    </div>
                    <div className="text-white/70 text-sm">
                      {debugInfo.supabaseSession.userEmail || 'Not set'}
                    </div>
                  </div>
                </>
              )}

              {debugInfo.supabaseSession?.error && (
                <div className="col-span-2 bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                  <div className="text-red-400 text-sm">
                    Error: {debugInfo.supabaseSession.error}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Auth Context */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Settings className="w-6 h-6 mr-2" />
              Auth Context
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(debugInfo.authContext?.hasUser)}
                  <span className="text-white font-medium">Has User</span>
                </div>
                <div className={`text-sm ${getStatusColor(debugInfo.authContext?.hasUser)}`}>
                  {debugInfo.authContext?.hasUser ? 'Yes' : 'No'}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <RefreshCw className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-medium">Loading</span>
                </div>
                <div className={`text-sm ${debugInfo.authContext?.loading ? 'text-yellow-400' : 'text-green-400'}`}>
                  {debugInfo.authContext?.loading ? 'Yes' : 'No'}
                </div>
              </div>

              {debugInfo.authContext?.hasUser && (
                <>
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">User ID</span>
                    </div>
                    <div className="text-white/70 text-sm font-mono">
                      {debugInfo.authContext.userId?.substring(0, 8)}...
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">Name</span>
                    </div>
                    <div className="text-white/70 text-sm">
                      {debugInfo.authContext.userName || 'Not set'}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Current State */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <ArrowRight className="w-6 h-6 mr-2" />
              Current State & Redirect Logic
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Home className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">Current Path</span>
                </div>
                <div className="text-white/70 text-sm font-mono">
                  {debugInfo.currentState?.currentPath || 'Unknown'}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(debugInfo.currentState?.shouldRedirectToProfile)}
                  <span className="text-white font-medium">Should Go to Profile</span>
                </div>
                <div className={`text-sm ${getStatusColor(debugInfo.currentState?.shouldRedirectToProfile)}`}>
                  {debugInfo.currentState?.shouldRedirectToProfile ? 'Yes' : 'No'}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(debugInfo.currentState?.shouldRedirectToLogin)}
                  <span className="text-white font-medium">Should Go to Login</span>
                </div>
                <div className={`text-sm ${getStatusColor(debugInfo.currentState?.shouldRedirectToLogin)}`}>
                  {debugInfo.currentState?.shouldRedirectToLogin ? 'Yes' : 'No'}
                </div>
              </div>
            </div>
          </div>

          {/* Test Actions */}
          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Test Actions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/profile"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Settings className="w-5 h-5" />
                <span>Go to Profile</span>
              </Link>
              
              <Link
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Home className="w-5 h-5" />
                <span>Go to Home</span>
              </Link>
              
              <Link
                href="/auth/login"
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <LogIn className="w-5 h-5" />
                <span>Test Login</span>
              </Link>
              
              <Link
                href="/auth/signup"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-5 h-5" />
                <span>Test Signup</span>
              </Link>
              
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh Data</span>
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-6 mt-8">
            <h3 className="text-yellow-400 font-semibold mb-4">Debug Instructions:</h3>
            <ol className="text-yellow-300 text-sm space-y-2">
              <li>1. Check if Supabase session exists and matches AuthContext user</li>
              <li>2. Verify authentication state is properly synchronized</li>
              <li>3. Test login flow and see where it redirects</li>
              <li>4. Check if there are any errors in the authentication process</li>
              <li>5. Use the test actions to navigate and see what happens</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
