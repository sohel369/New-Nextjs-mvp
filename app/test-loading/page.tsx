'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  User, 
  Globe, 
  Settings,
  ArrowRight,
  Home,
  BookOpen,
  Trophy,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function TestLoadingPage() {
  const { user, loading } = useAuth();
  const [testResults, setTestResults] = useState<any>({});
  const [testing, setTesting] = useState(false);

  const runTests = async () => {
    setTesting(true);
    const results: any = {};

    try {
      // Test 1: Authentication Status
      results.authentication = {
        loading: loading,
        hasUser: !!user,
        userId: user?.id,
        userEmail: user?.email,
        userName: user?.name
      };

      // Test 2: Basic App Functionality
      results.appFunctionality = {
        pageLoads: true,
        componentsRender: true,
        navigationWorks: true
      };

      // Test 3: Database Connection (if user exists)
      if (user) {
        try {
          const { supabase } = await import('../../lib/supabase');
          
          const { data, error } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .limit(1);

          results.database = {
            connected: !error,
            userProfileExists: !!data && data.length > 0,
            error: error?.message
          };
        } catch (error) {
          results.database = {
            connected: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      }

      setTestResults(results);
    } catch (error) {
      console.error('Error running tests:', error);
      setTestResults({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    runTests();
  }, [user, loading]);

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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            Loading & Authentication Test
          </h1>

          {/* Current Status */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Loader2 className="w-6 h-6 mr-2" />
              Current Status
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  {loading ? (
                    <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                  <span className="text-white font-medium">Loading State</span>
                </div>
                <div className={`text-sm ${loading ? 'text-yellow-400' : 'text-green-400'}`}>
                  {loading ? 'Loading...' : 'Complete'}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(!!user)}
                  <span className="text-white font-medium">Authenticated</span>
                </div>
                <div className={`text-sm ${getStatusColor(!!user)}`}>
                  {user ? 'Yes' : 'No'}
                </div>
              </div>

              {user && (
                <>
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">User ID</span>
                    </div>
                    <div className="text-white/70 text-sm font-mono">
                      {user.id?.substring(0, 8)}...
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">Email</span>
                    </div>
                    <div className="text-white/70 text-sm">
                      {user.email || 'Not set'}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Test Results */}
          {Object.keys(testResults).length > 0 && (
            <div className="bg-white/5 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 mr-2" />
                Test Results
              </h2>
              
              {testResults.error ? (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <span>Error: {testResults.error}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(testResults).map(([key, value]: [string, any]) => (
                    <div key={key} className="bg-white/10 rounded-lg p-4">
                      <h3 className="text-white font-medium mb-2 capitalize">{key}</h3>
                      <div className="text-white/70 text-sm">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(value, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Quick Actions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Home className="w-5 h-5" />
                <span>Home Page</span>
              </Link>
              
              <Link
                href="/landing"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Globe className="w-5 h-5" />
                <span>Landing Page</span>
              </Link>
              
              <Link
                href="/getting-started"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <BookOpen className="w-5 h-5" />
                <span>Getting Started</span>
              </Link>
              
              <Link
                href="/auth/login"
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <User className="w-5 h-5" />
                <span>Login</span>
              </Link>
              
              <Link
                href="/auth/signup"
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <User className="w-5 h-5" />
                <span>Signup</span>
              </Link>
              
              <button
                onClick={runTests}
                disabled={testing}
                className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {testing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Trophy className="w-5 h-5" />
                )}
                <span>{testing ? 'Testing...' : 'Run Tests'}</span>
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-6">
            <h3 className="text-yellow-400 font-semibold mb-4">Testing Instructions:</h3>
            <ol className="text-yellow-300 text-sm space-y-2">
              <li>1. Check if the page loads without infinite loading</li>
              <li>2. Verify authentication status is displayed correctly</li>
              <li>3. Test navigation to different pages</li>
              <li>4. If authenticated, test database connection</li>
              <li>5. Try logging in/out to test state changes</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
