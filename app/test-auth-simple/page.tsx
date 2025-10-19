'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function TestAuthSimplePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const testLogin = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      console.log('Testing simple login...');
      
      // Test data - use a test account
      const testEmail = 'test@example.com';
      const testPassword = 'testpassword123';

      console.log('Attempting login with:', testEmail);

      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
      });

      console.log('Login result:', { data, error: loginError });

      if (loginError) {
        setError(`Login Error: ${loginError.message}`);
        setResult({ type: 'error', data: loginError });
      } else {
        console.log('Login successful, checking session...');
        
        // Check if we can get the session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          setError(`Session Error: ${sessionError.message}`);
          setResult({ type: 'error', data: sessionError });
        } else if (session) {
          setResult({ 
            type: 'success', 
            data: { 
              login: data, 
              session: session,
              userId: session.user?.id,
              userEmail: session.user?.email
            } 
          });
        } else {
          setResult({ 
            type: 'partial_success', 
            data: { 
              login: data, 
              session: 'No session found'
            } 
          });
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError(`Unexpected Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setResult({ type: 'error', data: err });
    } finally {
      setLoading(false);
    }
  };

  const testSignup = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      console.log('Testing simple signup...');
      
      // Test data with unique email
      const testEmail = `test-${Date.now()}@example.com`;
      const testPassword = 'testpassword123';
      const testName = 'Test User';

      console.log('Creating account with:', testEmail);

      const { data, error: signupError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            name: testName
          }
        }
      });

      console.log('Signup result:', { data, error: signupError });

      if (signupError) {
        setError(`Signup Error: ${signupError.message}`);
        setResult({ type: 'error', data: signupError });
      } else {
        console.log('Signup successful, checking session...');
        
        // Check if we can get the session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          setError(`Session Error: ${sessionError.message}`);
          setResult({ type: 'error', data: sessionError });
        } else if (session) {
          setResult({ 
            type: 'success', 
            data: { 
              signup: data, 
              session: session,
              userId: session.user?.id,
              userEmail: session.user?.email
            } 
          });
        } else {
          setResult({ 
            type: 'partial_success', 
            data: { 
              signup: data, 
              session: 'No session found'
            } 
          });
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError(`Unexpected Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setResult({ type: 'error', data: err });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'partial_success':
        return <AlertCircle className="w-6 h-6 text-yellow-400" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-400" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'partial_success':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-8">
            Simple Authentication Test
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <button
              onClick={testLogin}
              disabled={loading}
              className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Testing...</span>
                </>
              ) : (
                <span>Test Login</span>
              )}
            </button>

            <button
              onClick={testSignup}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Testing...</span>
                </>
              ) : (
                <span>Test Signup</span>
              )}
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

          {result && (
            <div className="bg-white/5 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                {getStatusIcon(result.type)}
                <h2 className={`text-xl font-semibold ${getStatusColor(result.type)}`}>
                  {result.type === 'success' && 'Authentication Successful!'}
                  {result.type === 'partial_success' && 'Authentication Partial Success'}
                  {result.type === 'error' && 'Authentication Failed'}
                </h2>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Result Details:</h3>
                <pre className="text-white/70 text-sm overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>

              {result.type === 'success' && (
                <div className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
                  <p className="text-green-300">
                    ✅ Authentication is working correctly!
                  </p>
                </div>
              )}

              {result.type === 'partial_success' && (
                <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                  <p className="text-yellow-300">
                    ⚠️ Authentication works but session handling has issues.
                  </p>
                </div>
              )}

              {result.type === 'error' && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-300">
                    ❌ Authentication has issues. Check Supabase configuration and network connection.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 bg-blue-500/20 border border-blue-500/50 rounded-lg p-6">
            <h3 className="text-blue-300 font-semibold mb-4">Test Information:</h3>
            <div className="text-blue-200 text-sm space-y-2">
              <p>• <strong>Login Test:</strong> Uses test@example.com (will fail if account doesn't exist)</p>
              <p>• <strong>Signup Test:</strong> Creates a new account with unique email</p>
              <p>• <strong>Check Console:</strong> Open browser console for detailed logs</p>
              <p>• <strong>Network Issues:</strong> Check if Supabase is accessible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
