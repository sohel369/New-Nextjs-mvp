'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
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
  UserPlus,
  Bug,
  Database,
  Key
} from 'lucide-react';
import Link from 'next/link';

export default function DebugAuthIssuePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [refreshing, setRefreshing] = useState(false);
  const [testResults, setTestResults] = useState<any>({});

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
        userMetadata: session?.user?.user_metadata,
        appMetadata: session?.user?.app_metadata,
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

      // Check Supabase configuration
      info.supabaseConfig = {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set',
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
      };

      setDebugInfo(info);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setDebugInfo({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  };

  const testAuthentication = async () => {
    setTestResults({ loading: true });
    
    try {
      const results: any = {};

      // Test 1: Check if we can get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      results.sessionTest = {
        success: !sessionError,
        hasSession: !!session,
        error: sessionError?.message
      };

      // Test 2: Check if we can get current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      results.userTest = {
        success: !userError,
        hasUser: !!currentUser,
        error: userError?.message
      };

      // Test 3: Check database connection
      try {
        const { data, error: dbError } = await supabase
          .from('profiles')
          .select('count')
          .limit(1);
        
        results.databaseTest = {
          success: !dbError,
          error: dbError?.message
        };
      } catch (dbError) {
        results.databaseTest = {
          success: false,
          error: dbError instanceof Error ? dbError.message : 'Unknown error'
        };
      }

      // Test 4: Check if user has profile
      if (currentUser) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();
          
          results.profileTest = {
            success: !profileError,
            hasProfile: !!profile,
            error: profileError?.message
          };
        } catch (profileError) {
          results.profileTest = {
            success: false,
            error: profileError instanceof Error ? profileError.message : 'Unknown error'
          };
        }
      }

      setTestResults({ loading: false, results });
    } catch (error) {
      setTestResults({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
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
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Bug className="w-8 h-8 mr-3" />
              Authentication Issue Debug
            </h1>
            <div className="flex space-x-2">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                onClick={testAuthentication}
                disabled={testResults.loading}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Database className="w-4 h-4" />
                <span>Test Auth</span>
              </button>
            </div>
          </div>

          {/* Current Authentication Status */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <User className="w-6 h-6 mr-2" />
              Current Authentication Status
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(debugInfo.authContext?.hasUser)}
                  <span className="text-white font-medium">Authenticated</span>
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
                      <span className="text-white font-medium">Email</span>
                    </div>
                    <div className="text-white/70 text-sm">
                      {debugInfo.authContext.userEmail || 'Not set'}
                    </div>
                  </div>
                </>
              )}
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
                    <strong>Session Error:</strong> {debugInfo.supabaseSession.error}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Supabase Configuration */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Settings className="w-6 h-6 mr-2" />
              Supabase Configuration
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(debugInfo.supabaseConfig?.url !== 'Not set')}
                  <span className="text-white font-medium">Supabase URL</span>
                </div>
                <div className={`text-sm ${getStatusColor(debugInfo.supabaseConfig?.url !== 'Not set')}`}>
                  {debugInfo.supabaseConfig?.url !== 'Not set' ? 'Set' : 'Not Set'}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(debugInfo.supabaseConfig?.anonKey !== 'Not set')}
                  <span className="text-white font-medium">Anon Key</span>
                </div>
                <div className={`text-sm ${getStatusColor(debugInfo.supabaseConfig?.anonKey !== 'Not set')}`}>
                  {debugInfo.supabaseConfig?.anonKey || 'Not Set'}
                </div>
              </div>
            </div>
          </div>

          {/* Test Results */}
          {testResults.results && (
            <div className="bg-white/5 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Database className="w-6 h-6 mr-2" />
                Authentication Tests
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(testResults.results.sessionTest?.success)}
                    <span className="text-white font-medium">Session Test</span>
                  </div>
                  <div className={`text-sm ${getStatusColor(testResults.results.sessionTest?.success)}`}>
                    {testResults.results.sessionTest?.success ? 'Pass' : 'Fail'}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(testResults.results.userTest?.success)}
                    <span className="text-white font-medium">User Test</span>
                  </div>
                  <div className={`text-sm ${getStatusColor(testResults.results.userTest?.success)}`}>
                    {testResults.results.userTest?.success ? 'Pass' : 'Fail'}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(testResults.results.databaseTest?.success)}
                    <span className="text-white font-medium">Database Test</span>
                  </div>
                  <div className={`text-sm ${getStatusColor(testResults.results.databaseTest?.success)}`}>
                    {testResults.results.databaseTest?.success ? 'Pass' : 'Fail'}
                  </div>
                </div>

                {testResults.results.profileTest && (
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(testResults.results.profileTest?.success)}
                      <span className="text-white font-medium">Profile Test</span>
                    </div>
                    <div className={`text-sm ${getStatusColor(testResults.results.profileTest?.success)}`}>
                      {testResults.results.profileTest?.success ? 'Pass' : 'Fail'}
                    </div>
                  </div>
                )}
              </div>

              {/* Show errors if any */}
              {Object.values(testResults.results).some((test: any) => test.error) && (
                <div className="mt-4 space-y-2">
                  {Object.entries(testResults.results).map(([key, test]: [string, any]) => 
                    test.error && (
                      <div key={key} className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                        <div className="text-red-400 text-sm">
                          <strong>{key}:</strong> {test.error}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Quick Actions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/auth/login"
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <LogIn className="w-5 h-5" />
                <span>Try Login</span>
              </Link>
              
              <Link
                href="/auth/signup"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-5 h-5" />
                <span>Try Signup</span>
              </Link>
              
              <Link
                href="/profile"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Settings className="w-5 h-5" />
                <span>Try Profile</span>
              </Link>
              
              <Link
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Home className="w-5 h-5" />
                <span>Go Home</span>
              </Link>
            </div>
          </div>

          {/* Troubleshooting Guide */}
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-6 mt-8">
            <h3 className="text-yellow-400 font-semibold mb-4">Troubleshooting Guide:</h3>
            <ol className="text-yellow-300 text-sm space-y-2">
              <li>1. <strong>Check Supabase Configuration:</strong> Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set</li>
              <li>2. <strong>Check Database Connection:</strong> Run the "Test Auth" button to verify database connectivity</li>
              <li>3. <strong>Check Session State:</strong> Verify if Supabase session exists and matches AuthContext</li>
              <li>4. <strong>Check Profile Creation:</strong> Ensure user profile exists in the database</li>
              <li>5. <strong>Check Browser Console:</strong> Look for any JavaScript errors or network issues</li>
              <li>6. <strong>Try Different Auth Methods:</strong> Test both email/password and Google OAuth</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
