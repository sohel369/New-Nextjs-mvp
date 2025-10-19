'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function TestSignupPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const testSignup = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      console.log('Testing signup process...');
      
      // Test data
      const testEmail = `test-${Date.now()}@example.com`;
      const testPassword = 'testpassword123';
      const testName = 'Test User';

      console.log('Creating test account with email:', testEmail);

      const { data, error: signupError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            name: testName,
            learning_language: 'en',
            native_language: 'en'
          }
        }
      });

      console.log('Signup result:', { data, error: signupError });

      if (signupError) {
        setError(`Signup Error: ${signupError.message}`);
        setResult({ type: 'error', data: signupError });
      } else {
        console.log('Signup successful, creating profile...');
        
        // Test profile creation
        if (data.user) {
          try {
            const { error: profileError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: data.user.id,
                  name: testName,
                  email: testEmail,
                  base_language: 'en',
                  learning_languages: ['en'],
                  level: 1,
                  total_xp: 0,
                  streak: 0
                }
              ]);

            if (profileError) {
              console.error('Profile creation error:', profileError);
              setResult({ 
                type: 'partial_success', 
                data: { 
                  signup: data, 
                  profileError: profileError.message 
                } 
              });
            } else {
              console.log('Profile created successfully');
              setResult({ 
                type: 'success', 
                data: { 
                  signup: data, 
                  profile: 'created' 
                } 
              });
            }
          } catch (profileError) {
            console.error('Unexpected profile error:', profileError);
            setResult({ 
              type: 'partial_success', 
              data: { 
                signup: data, 
                profileError: profileError instanceof Error ? profileError.message : 'Unknown error'
              } 
            });
          }
        } else {
          setResult({ 
            type: 'success', 
            data: { 
              signup: data, 
              profile: 'no_user_data' 
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
            Test Signup Process
          </h1>

          <div className="mb-8">
            <button
              onClick={testSignup}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Testing Signup...</span>
                </>
              ) : (
                <span>Test Signup Process</span>
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
                  {result.type === 'success' && 'Signup Successful!'}
                  {result.type === 'partial_success' && 'Signup Successful (Profile Issue)'}
                  {result.type === 'error' && 'Signup Failed'}
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
                    ✅ Signup process is working correctly!
                  </p>
                </div>
              )}

              {result.type === 'partial_success' && (
                <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                  <p className="text-yellow-300">
                    ⚠️ Signup works but profile creation has issues. Check database connection.
                  </p>
                </div>
              )}

              {result.type === 'error' && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-300">
                    ❌ Signup process has issues. Check Supabase configuration.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 bg-blue-500/20 border border-blue-500/50 rounded-lg p-6">
            <h3 className="text-blue-300 font-semibold mb-4">Debug Information:</h3>
            <div className="text-blue-200 text-sm space-y-2">
              <p>• This test creates a temporary account with a unique email</p>
              <p>• Check browser console for detailed logs</p>
              <p>• Test data: test-{Date.now()}@example.com</p>
              <p>• If successful, the account will be created in your Supabase database</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
