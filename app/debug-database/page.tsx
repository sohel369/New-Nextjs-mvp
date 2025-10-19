'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Database,
  RefreshCw,
  User,
  Settings,
  Info
} from 'lucide-react';

export default function DebugDatabasePage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>({});
  const [error, setError] = useState<string>('');

  const testDatabase = async () => {
    setLoading(true);
    setError('');
    setResults({});

    try {
      const testResults: any = {};

      // Test 1: Check if profiles table exists and is accessible
      try {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email, name, level, total_xp, streak, learning_languages, base_language')
          .limit(1);
        
        testResults.profiles = {
          success: !profilesError,
          error: profilesError?.message,
          code: profilesError?.code,
          accessible: !profilesError,
          data: profilesData
        };
      } catch (err) {
        testResults.profiles = {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
          accessible: false
        };
      }

      // Test 2: Check if users table exists and is accessible
      try {
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, email, name, level, total_xp, streak, learning_language, native_language')
          .limit(1);
        
        testResults.users = {
          success: !usersError,
          error: usersError?.message,
          code: usersError?.code,
          accessible: !usersError,
          data: usersData
        };
      } catch (err) {
        testResults.users = {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
          accessible: false
        };
      }

      // Test 3: Check current user authentication
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        testResults.auth = {
          success: !authError,
          error: authError?.message,
          user: user ? {
            id: user.id,
            email: user.email,
            metadata: user.user_metadata
          } : null
        };
      } catch (err) {
        testResults.auth = {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
          user: null
        };
      }

      // Test 4: Try to query current user's profile
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Try profiles table first
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (profileError && profileError.code !== 'PGRST116') {
            // Try users table as fallback
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('id', user.id)
              .single();
            
            testResults.currentUserProfile = {
              success: !userError,
              error: userError?.message,
              code: userError?.code,
              exists: !!userData,
              data: userData,
              table: 'users'
            };
          } else {
            testResults.currentUserProfile = {
              success: !profileError,
              error: profileError?.message,
              code: profileError?.code,
              exists: !!profileData,
              data: profileData,
              table: 'profiles'
            };
          }
        } else {
          testResults.currentUserProfile = {
            success: true,
            error: null,
            exists: false,
            message: 'No authenticated user'
          };
        }
      } catch (err) {
        testResults.currentUserProfile = {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
          exists: false
        };
      }

      setResults(testResults);
    } catch (err) {
      setError(`Database test failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="w-5 h-5 text-green-400" />
    ) : (
      <XCircle className="w-5 h-5 text-red-400" />
    );
  };

  const getStatusColor = (success: boolean) => {
    return success ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Database className="w-8 h-8 mr-3" />
              Database Debug Page
            </h1>
            <button
              onClick={testDatabase}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Test Database</span>
            </button>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-semibold">Error</span>
              </div>
              <p className="text-red-300 mt-2">{error}</p>
            </div>
          )}

          {Object.keys(results).length > 0 && (
            <div className="space-y-6">
              {/* Authentication Status */}
              <div className="bg-white/5 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <User className="w-6 h-6 mr-2" />
                  Authentication Status
                </h2>
                
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(results.auth?.success)}
                    <span className="text-white font-medium">User Authenticated</span>
                  </div>
                  <div className={`text-sm ${getStatusColor(results.auth?.success)}`}>
                    {results.auth?.success ? 'Yes' : 'No'}
                  </div>
                </div>

                {results.auth?.user && (
                  <div className="mt-3 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                    <div className="text-green-400 text-sm">
                      <strong>User ID:</strong> {results.auth.user.id}<br/>
                      <strong>Email:</strong> {results.auth.user.email}
                    </div>
                  </div>
                )}

                {results.auth?.error && (
                  <div className="mt-3 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <div className="text-red-400 text-sm">
                      <strong>Error:</strong> {results.auth.error}
                    </div>
                  </div>
                )}
              </div>

              {/* Profiles Table */}
              <div className="bg-white/5 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Database className="w-6 h-6 mr-2" />
                  Profiles Table
                </h2>
                
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(results.profiles?.success)}
                    <span className="text-white font-medium">Table Accessible</span>
                  </div>
                  <div className={`text-sm ${getStatusColor(results.profiles?.success)}`}>
                    {results.profiles?.success ? 'Yes' : 'No'}
                  </div>
                </div>

                {results.profiles?.error && (
                  <div className="mt-3 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <div className="text-red-400 text-sm">
                      <strong>Error:</strong> {results.profiles.error}<br/>
                      <strong>Code:</strong> {results.profiles.code}
                    </div>
                  </div>
                )}
              </div>

              {/* Users Table */}
              <div className="bg-white/5 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <User className="w-6 h-6 mr-2" />
                  Users Table
                </h2>
                
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(results.users?.success)}
                    <span className="text-white font-medium">Table Accessible</span>
                  </div>
                  <div className={`text-sm ${getStatusColor(results.users?.success)}`}>
                    {results.users?.success ? 'Yes' : 'No'}
                  </div>
                </div>

                {results.users?.error && (
                  <div className="mt-3 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <div className="text-red-400 text-sm">
                      <strong>Error:</strong> {results.users.error}<br/>
                      <strong>Code:</strong> {results.users.code}
                    </div>
                  </div>
                )}
              </div>

              {/* Current User Profile */}
              {results.currentUserProfile && (
                <div className="bg-white/5 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <User className="w-6 h-6 mr-2" />
                    Current User Profile
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(results.currentUserProfile?.success)}
                        <span className="text-white font-medium">Profile Exists</span>
                      </div>
                      <div className={`text-sm ${getStatusColor(results.currentUserProfile?.exists)}`}>
                        {results.currentUserProfile?.exists ? 'Yes' : 'No'}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Database className="w-5 h-5 text-blue-400" />
                        <span className="text-white font-medium">Table</span>
                      </div>
                      <div className="text-white/70 text-sm">
                        {results.currentUserProfile?.table || 'N/A'}
                      </div>
                    </div>
                  </div>

                  {results.currentUserProfile?.error && (
                    <div className="mt-3 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                      <div className="text-red-400 text-sm">
                        <strong>Error:</strong> {results.currentUserProfile.error}<br/>
                        <strong>Code:</strong> {results.currentUserProfile.code}
                      </div>
                    </div>
                  )}

                  {results.currentUserProfile?.data && (
                    <div className="mt-3 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                      <div className="text-green-400 text-sm">
                        <strong>Profile Data:</strong>
                        <pre className="text-green-300 mt-2 text-xs overflow-auto">
                          {JSON.stringify(results.currentUserProfile.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Quick Fix Instructions */}
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-6 mt-8">
            <h3 className="text-yellow-400 font-semibold mb-4">Quick Fix Instructions:</h3>
            <ol className="text-yellow-300 text-sm space-y-2">
              <li>1. <strong>Copy the SQL:</strong> Go to <code>database/quick-setup.sql</code></li>
              <li>2. <strong>Run in Supabase:</strong> Paste the SQL in your Supabase SQL Editor</li>
              <li>3. <strong>Execute:</strong> Click "Run" to create the tables</li>
              <li>4. <strong>Test Again:</strong> Click "Test Database" button above</li>
              <li>5. <strong>Try Login:</strong> Go back to the app and try logging in</li>
            </ol>
          </div>

          {/* Common Error Solutions */}
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-6 mt-6">
            <h3 className="text-blue-400 font-semibold mb-4">Common Error Solutions:</h3>
            <div className="text-blue-300 text-sm space-y-2">
              <div><strong>"relation profiles does not exist":</strong> Run the quick-setup.sql script</div>
              <div><strong>"column learning_language does not exist":</strong> Check table schema matches the SQL</div>
              <div><strong>"permission denied":</strong> Check RLS policies are created</div>
              <div><strong>"duplicate key value":</strong> User already exists, try logging in instead</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
