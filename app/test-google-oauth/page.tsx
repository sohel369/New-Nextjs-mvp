'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { getRedirectUrl } from '../../lib/config';

export default function TestGoogleOAuthPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const testGoogleOAuth = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
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
        setError(`OAuth Error: ${error.message}`);
        console.error('Google OAuth Error:', error);
      } else {
        setResult(`OAuth initiated successfully: ${JSON.stringify(data, null, 2)}`);
        console.log('Google OAuth Success:', data);
      }
    } catch (err) {
      setError(`Unexpected Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Unexpected Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testSupabaseConnection = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setError(`Supabase Error: ${error.message}`);
      } else {
        setResult(`Supabase Connection: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (err) {
      setError(`Connection Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testConfig = () => {
    const config = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      redirectUrl: getRedirectUrl('/auth/callback'),
      allowedOrigins: [
        'http://localhost:3000',
        'https://myreactmvp.firebaseapp.com',
        'https://uaijcvhvyurbnfmkqnqt.supabase.co'
      ]
    };
    
    setResult(`Configuration: ${JSON.stringify(config, null, 2)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-8">Google OAuth Test Page</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <button
              onClick={testConfig}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Test Configuration
            </button>
            
            <button
              onClick={testSupabaseConnection}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Test Supabase Connection
            </button>
            
            <button
              onClick={testGoogleOAuth}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              {loading ? 'Testing...' : 'Test Google OAuth'}
            </button>
          </div>

          {loading && (
            <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 text-blue-400 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Testing OAuth integration...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400 mb-6">
              <h3 className="font-semibold mb-2">Error:</h3>
              <pre className="whitespace-pre-wrap text-sm">{error}</pre>
            </div>
          )}

          {result && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-green-400">
              <h3 className="font-semibold mb-2">Result:</h3>
              <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-96">{result}</pre>
            </div>
          )}

          <div className="mt-8 p-6 bg-white/5 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Test Instructions:</h2>
            <ol className="text-white/80 space-y-2">
              <li>1. Click "Test Configuration" to verify environment variables</li>
              <li>2. Click "Test Supabase Connection" to verify Supabase connectivity</li>
              <li>3. Click "Test Google OAuth" to initiate Google authentication</li>
              <li>4. Complete Google OAuth flow in the popup/redirect</li>
              <li>5. Check the callback page for successful authentication</li>
            </ol>
          </div>

          <div className="mt-6 p-6 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
            <h3 className="text-yellow-400 font-semibold mb-2">Important Notes:</h3>
            <ul className="text-yellow-300 text-sm space-y-1">
              <li>• Make sure Google OAuth is configured in your Supabase project</li>
              <li>• Verify redirect URIs in Google Cloud Console</li>
              <li>• Check that your domain is authorized in Google OAuth settings</li>
              <li>• Ensure environment variables are set correctly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
