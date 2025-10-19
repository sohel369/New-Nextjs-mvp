'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Check, X, AlertCircle, User, Database, Key, Globe } from 'lucide-react';

export default function DebugAuthPage() {
  const { user, loading } = useAuth();
  const [authState, setAuthState] = useState<any>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Check Supabase auth state
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      setAuthState({ user: authUser, error: authError });

      // Check session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      setSessionData({ session, error: sessionError });

      // Check profile if user exists
      if (authUser) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();
        setProfileData({ profile, error: profileError });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const testGoogleAuth = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        setError(`OAuth Error: ${error.message}`);
      } else {
        console.log('OAuth initiated:', data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(`Sign out error: ${error.message}`);
      } else {
        setAuthState(null);
        setSessionData(null);
        setProfileData(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const StatusIcon = ({ status }: { status: boolean }) => (
    status ? <Check className="w-5 h-5 text-green-400" /> : <X className="w-5 h-5 text-red-400" />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-8">Authentication Debug</h1>
          
          {/* Error Display */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400 mb-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">Error:</span>
              </div>
              <p className="mt-1">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={checkAuthState}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              <Database className="w-5 h-5" />
              <span>Refresh Auth State</span>
            </button>
            
            <button
              onClick={testGoogleAuth}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
              <Globe className="w-5 h-5" />
              <span>Test Google Auth</span>
            </button>
            
            {user && (
              <button
                onClick={signOut}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                <X className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 text-blue-400 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Loading...</span>
              </div>
            </div>
          )}

          {/* Auth Context Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <User className="w-6 h-6 mr-2" />
                Auth Context
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Loading:</span>
                  <StatusIcon status={loading} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">User:</span>
                  <StatusIcon status={!!user} />
                </div>
                {user && (
                  <div className="mt-3 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                    <div className="text-green-400 text-sm font-medium">User ID: {user.id}</div>
                    <div className="text-green-300 text-sm">Name: {user.name}</div>
                    <div className="text-green-300 text-sm">Email: {user.email}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Key className="w-6 h-6 mr-2" />
                Supabase Auth
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Auth User:</span>
                  <StatusIcon status={!!authState?.user} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Session:</span>
                  <StatusIcon status={!!sessionData?.session} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Profile:</span>
                  <StatusIcon status={!!profileData?.profile} />
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Auth State */}
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Auth State</h3>
              <pre className="text-xs text-white/70 bg-black/20 p-3 rounded overflow-auto max-h-64">
                {JSON.stringify(authState, null, 2)}
              </pre>
            </div>

            {/* Session Data */}
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Session Data</h3>
              <pre className="text-xs text-white/70 bg-black/20 p-3 rounded overflow-auto max-h-64">
                {JSON.stringify(sessionData, null, 2)}
              </pre>
            </div>

            {/* Profile Data */}
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Profile Data</h3>
              <pre className="text-xs text-white/70 bg-black/20 p-3 rounded overflow-auto max-h-64">
                {JSON.stringify(profileData, null, 2)}
              </pre>
            </div>
          </div>

          {/* Configuration Info */}
          <div className="mt-8 p-6 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
            <h3 className="text-yellow-400 font-semibold mb-4">Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-yellow-300 font-medium">Supabase URL:</div>
                <div className="text-yellow-200">{process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}</div>
              </div>
              <div>
                <div className="text-yellow-300 font-medium">Current Origin:</div>
                <div className="text-yellow-200">{typeof window !== 'undefined' ? window.location.origin : 'Server'}</div>
              </div>
            </div>
          </div>

          {/* Troubleshooting Tips */}
          <div className="mt-6 p-6 bg-blue-500/20 border border-blue-500/50 rounded-lg">
            <h3 className="text-blue-400 font-semibold mb-4">Troubleshooting Tips</h3>
            <ul className="text-blue-300 text-sm space-y-2">
              <li>• Check browser console for detailed error messages</li>
              <li>• Verify Supabase project settings and OAuth configuration</li>
              <li>• Ensure redirect URLs are properly configured in Google Cloud Console</li>
              <li>• Check that the profiles table exists in your Supabase database</li>
              <li>• Verify RLS policies are set up correctly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
