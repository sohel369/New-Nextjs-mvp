'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getRedirectUrl } from '@/lib/config';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, ExternalLink, Copy } from 'lucide-react';
import Link from 'next/link';

export default function TestOAuthFixPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const testGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('Testing Google OAuth with improved configuration...');
      console.log('Redirect URL:', getRedirectUrl('/auth/callback'));
      
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
        console.error('OAuth Error:', error);
        setError(`OAuth Error: ${error.message}`);
      } else {
        console.log('OAuth initiated successfully:', data);
        setSuccess('OAuth flow initiated successfully! Check the redirect...');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const redirectUrl = getRedirectUrl('/auth/callback');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            OAuth Fix Test
          </h1>

          {/* Configuration Display */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <AlertCircle className="w-6 h-6 mr-2" />
              Current Configuration
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-white/70 text-sm">Redirect URL:</label>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="bg-gray-800 p-3 rounded text-sm text-white/80 flex-1 break-all">
                    {redirectUrl}
                  </div>
                  <button
                    onClick={() => copyToClipboard(redirectUrl)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <label className="text-white/70 text-sm">Environment Variables:</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Supabase URL:</span>
                    <div className="flex items-center space-x-2">
                      {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className="text-white text-sm">
                        {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Google Client ID:</span>
                    <div className="flex items-center space-x-2">
                      {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                      <span className="text-white text-sm">
                        {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? 'Set' : 'Missing'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Test Actions */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Test OAuth Flow
            </h2>
            
            <div className="space-y-4">
              <button
                onClick={testGoogleLogin}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <ExternalLink className="w-5 h-5" />
                )}
                <span>{loading ? 'Testing...' : 'Test Google OAuth'}</span>
              </button>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-400 font-medium">Error</span>
                  </div>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-medium">Success</span>
                  </div>
                  <p className="text-green-300 text-sm">{success}</p>
                </div>
              )}
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-6 mb-8">
            <h3 className="text-yellow-400 font-semibold mb-4">Setup Instructions:</h3>
            <ol className="text-yellow-300 text-sm space-y-2">
              <li>1. Copy the redirect URL above</li>
              <li>2. Go to Google Cloud Console &gt; APIs &amp; Services &gt; Credentials</li>
              <li>3. Edit your OAuth 2.0 Client ID</li>
              <li>4. Add the redirect URL to "Authorized redirect URIs"</li>
              <li>5. Go to Supabase Dashboard &gt; Authentication &gt; Providers</li>
              <li>6. Enable Google provider and add your Client ID and Secret</li>
              <li>7. Set redirect URL in Supabase to: `https://your-project.supabase.co/auth/v1/callback`</li>
            </ol>
          </div>

          {/* Debug Links */}
          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-4">Debug Tools:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/auth/debug-oauth"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <AlertCircle className="w-5 h-5" />
                <span>OAuth Debug Center</span>
              </Link>
              
              <Link
                href="/auth/auth-code-error?error=test&description=Test error message"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <XCircle className="w-5 h-5" />
                <span>Test Error Page</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
