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
  Settings
} from 'lucide-react';

export default function TestDatabasePage() {
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
          .select('count')
          .limit(1);
        
        testResults.profiles = {
          success: !profilesError,
          error: profilesError?.message,
          accessible: !profilesError
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
          .select('count')
          .limit(1);
        
        testResults.users = {
          success: !usersError,
          error: usersError?.message,
          accessible: !usersError
        };
      } catch (err) {
        testResults.users = {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
          accessible: false
        };
      }

      // Test 3: Check if languages table exists
      try {
        const { data: languagesData, error: languagesError } = await supabase
          .from('languages')
          .select('code, name')
          .limit(5);
        
        testResults.languages = {
          success: !languagesError,
          error: languagesError?.message,
          count: languagesData?.length || 0,
          data: languagesData
        };
      } catch (err) {
        testResults.languages = {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
          count: 0
        };
      }

      // Test 4: Check if user_settings table exists
      try {
        const { data: settingsData, error: settingsError } = await supabase
          .from('user_settings')
          .select('count')
          .limit(1);
        
        testResults.user_settings = {
          success: !settingsError,
          error: settingsError?.message,
          accessible: !settingsError
        };
      } catch (err) {
        testResults.user_settings = {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
          accessible: false
        };
      }

      // Test 5: Try to create a test profile (if authenticated)
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: testProfile, error: testError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          testResults.currentUserProfile = {
            success: !testError,
            error: testError?.message,
            exists: !!testProfile,
            data: testProfile
          };
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
              Database Connection Test
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
              {/* Profiles Table */}
              <div className="bg-white/5 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <User className="w-6 h-6 mr-2" />
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
                      <strong>Error:</strong> {results.profiles.error}
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
                      <strong>Error:</strong> {results.users.error}
                    </div>
                  </div>
                )}
              </div>

              {/* Languages Table */}
              <div className="bg-white/5 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Database className="w-6 h-6 mr-2" />
                  Languages Table
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(results.languages?.success)}
                      <span className="text-white font-medium">Table Accessible</span>
                    </div>
                    <div className={`text-sm ${getStatusColor(results.languages?.success)}`}>
                      {results.languages?.success ? 'Yes' : 'No'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Database className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">Languages Count</span>
                    </div>
                    <div className="text-white/70 text-sm">
                      {results.languages?.count || 0}
                    </div>
                  </div>
                </div>

                {results.languages?.error && (
                  <div className="mt-3 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <div className="text-red-400 text-sm">
                      <strong>Error:</strong> {results.languages.error}
                    </div>
                  </div>
                )}

                {results.languages?.data && results.languages.data.length > 0 && (
                  <div className="mt-3 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                    <div className="text-green-400 text-sm">
                      <strong>Sample Languages:</strong>
                      <div className="mt-2 space-y-1">
                        {results.languages.data.map((lang: any, index: number) => (
                          <div key={index} className="text-green-300">
                            {lang.flag_emoji} {lang.name} ({lang.code})
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Settings Table */}
              <div className="bg-white/5 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Settings className="w-6 h-6 mr-2" />
                  User Settings Table
                </h2>
                
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(results.user_settings?.success)}
                    <span className="text-white font-medium">Table Accessible</span>
                  </div>
                  <div className={`text-sm ${getStatusColor(results.user_settings?.success)}`}>
                    {results.user_settings?.success ? 'Yes' : 'No'}
                  </div>
                </div>

                {results.user_settings?.error && (
                  <div className="mt-3 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <div className="text-red-400 text-sm">
                      <strong>Error:</strong> {results.user_settings.error}
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
                  
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(results.currentUserProfile?.success)}
                      <span className="text-white font-medium">Profile Exists</span>
                    </div>
                    <div className={`text-sm ${getStatusColor(results.currentUserProfile?.exists)}`}>
                      {results.currentUserProfile?.exists ? 'Yes' : 'No'}
                    </div>
                  </div>

                  {results.currentUserProfile?.error && (
                    <div className="mt-3 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                      <div className="text-red-400 text-sm">
                        <strong>Error:</strong> {results.currentUserProfile.error}
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

          {/* Instructions */}
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-6 mt-8">
            <h3 className="text-yellow-400 font-semibold mb-4">Database Setup Instructions:</h3>
            <ol className="text-yellow-300 text-sm space-y-2">
              <li>1. <strong>Run Database Setup:</strong> Execute the SQL in <code>database/setup-database.sql</code></li>
              <li>2. <strong>Check Table Creation:</strong> Verify all tables are created successfully</li>
              <li>3. <strong>Test RLS Policies:</strong> Ensure Row Level Security is properly configured</li>
              <li>4. <strong>Verify Data Sync:</strong> Check if profile and user data sync correctly</li>
              <li>5. <strong>Test Authentication:</strong> Try login/signup after database setup</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
