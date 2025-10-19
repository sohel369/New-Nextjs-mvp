'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { getRedirectUrl } from '../../../lib/config';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function DebugOAuthPage() {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError(sessionError.message);
        } else {
          setSession(session);
          setUser(session?.user || null);
        }

        // Get Supabase configuration
        setConfig({
          url: process.env.NEXT_PUBLIC_SUPABASE_URL,
          anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing',
          redirectUrl: getRedirectUrl('/auth/callback'),
          googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? 'Present' : 'Missing'
        });

      } catch (err) {
        console.error('Debug error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session);
      setSession(session);
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const testGoogleLogin = async () => {
    try {
      setError(null);
      console.log('Initiating Google login...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getRedirectUrl('/auth/callback'),
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('Google login error:', error);
        setError(error.message);
      } else {
        console.log('Google login initiated:', data);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const testSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(error.message);
      } else {
        setSession(null);
        setUser(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const refreshSession = async () => {
    try {
      setLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        setError(error.message);
      } else {
        setSession(session);
        setUser(session?.user || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            OAuth Debug Center
          </h1>

          {/* Configuration Status */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <AlertCircle className="w-6 h-6 mr-2" />
              Configuration Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Supabase URL:</span>
                  <div className="flex items-center space-x-2">
                    {config?.url ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className="text-white text-sm">
                      {config?.url ? 'Configured' : 'Missing'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Anon Key:</span>
                  <div className="flex items-center space-x-2">
                    {config?.anonKey === 'Present' ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className="text-white text-sm">{config?.anonKey}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Google Client ID:</span>
                  <div className="flex items-center space-x-2">
                    {config?.googleClientId === 'Present' ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className="text-white text-sm">{config?.googleClientId}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-white/70 text-sm">
                  <strong>Redirect URL:</strong>
                </div>
                <div className="bg-gray-800 p-3 rounded text-xs text-white/80 break-all">
                  {config?.redirectUrl || 'Not configured'}
                </div>
                <div className="text-white/70 text-sm">
                  <strong>Current URL:</strong>
                </div>
                <div className="bg-gray-800 p-3 rounded text-xs text-white/80 break-all">
                  {typeof window !== 'undefined' ? window.location.origin : 'Server-side'}
                </div>
              </div>
            </div>
          </div>

          {/* Authentication Status */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <CheckCircle className="w-6 h-6 mr-2" />
              Authentication Status
            </h2>
            {loading ? (
              <div className="flex items-center space-x-2 text-blue-300">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Loading authentication state...</span>
              </div>
            ) : user ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>Authenticated</span>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-white font-medium mb-2">User Information:</h3>
                  <pre className="text-white/80 text-sm overflow-x-auto">
                    {JSON.stringify({
                      id: user.id,
                      email: user.email,
                      provider: user.app_metadata?.provider,
                      created_at: user.created_at
                    }, null, 2)}
                  </pre>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Session Information:</h3>
                  <pre className="text-white/80 text-sm overflow-x-auto">
                    {JSON.stringify({
                      access_token: session?.access_token ? 'Present' : 'Missing',
                      refresh_token: session?.refresh_token ? 'Present' : 'Missing',
                      expires_at: session?.expires_at,
                      provider_token: session?.provider_token ? 'Present' : 'Missing'
                    }, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-red-400">
                <XCircle className="w-5 h-5" />
                <span>Not Authenticated</span>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-8">
              <h3 className="text-red-400 font-medium mb-2">Error:</h3>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Test Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={testGoogleLogin}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Test Google Login</span>
              </button>
              
              <button
                onClick={testSignOut}
                disabled={loading || !user}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <XCircle className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
              
              <button
                onClick={refreshSession}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Refresh Session</span>
              </button>
              
              <Link
                href="/auth/callback?code=test_code&error=test_error"
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <AlertCircle className="w-5 h-5" />
                <span>Test Callback</span>
              </Link>
            </div>
          </div>

          {/* Troubleshooting Guide */}
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-6">
            <h3 className="text-yellow-400 font-semibold mb-4">Troubleshooting Guide:</h3>
            <ul className="text-yellow-300 text-sm space-y-2">
              <li>• Ensure all environment variables are properly set</li>
              <li>• Check that Google OAuth is configured in Supabase dashboard</li>
              <li>• Verify the redirect URL matches exactly in Google Console</li>
              <li>• Make sure the Google Client ID is correct</li>
              <li>• Check browser console for detailed error messages</li>
              <li>• Try clearing browser cache and cookies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
