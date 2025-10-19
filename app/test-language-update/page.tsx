'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Check, X, AlertCircle, Globe, RefreshCw } from 'lucide-react';

export default function TestLanguageUpdatePage() {
  const { user, loading } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const updateLanguagesDirect = async () => {
    if (!user) {
      setError('No user found');
      return;
    }

    setUpdating(true);
    setError(null);
    setResult(null);

    try {
      console.log('Updating languages for user:', user.id);
      
      // Direct Supabase update - using public.profiles table (correct approach)
      const { data, error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: user.name || user.email?.split('@')[0] || 'User',
          email: user.email,
          native_language: 'Bengali',
          learning_language: 'English'
        })
        .select();

      if (updateError) {
        console.error('Direct update error:', updateError);
        setError(`Direct update failed: ${updateError.message}`);
      } else {
        console.log('Direct update successful:', data);
        setResult({ 
          type: 'direct_success', 
          data: data,
          message: 'Languages updated directly using Supabase'
        });
      }
    } catch (err) {
      console.error('Direct update error:', err);
      setError(`Direct update error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setUpdating(false);
    }
  };

  const updateLanguagesAPI = async () => {
    if (!user) {
      setError('No user found');
      return;
    }

    setUpdating(true);
    setError(null);
    setResult(null);

    try {
      console.log('Updating languages via API for user:', user.id);
      
      const response = await fetch('/api/update-languages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          nativeLanguage: 'Bengali',
          learningLanguage: 'English'
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('API update successful:', result);
        setResult({ 
          type: 'api_success', 
          data: result,
          message: 'Languages updated via API'
        });
      } else {
        console.error('API update error:', result.error);
        setError(`API update failed: ${result.error}`);
      }
    } catch (err) {
      console.error('API update error:', err);
      setError(`API update error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setUpdating(false);
    }
  };

  const checkCurrentData = async () => {
    if (!user) {
      setError('No user found');
      return;
    }

    try {
      const response = await fetch(`/api/update-languages?userId=${user.id}`);
      const result = await response.json();
      
      if (result.success) {
        setResult({ 
          type: 'check_success', 
          data: result,
          message: 'Current user data retrieved'
        });
      } else {
        setError(`Check failed: ${result.error}`);
      }
    } catch (err) {
      setError(`Check error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <X className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Not Authenticated</h1>
          <p className="text-white/70 mb-4">Please sign in to test language update functionality.</p>
          <a href="/auth/login" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Language Update Test</h1>
          <p className="text-white/70">Test the exact code you requested: Supabase language update</p>
        </div>

        {/* User Info */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Globe className="w-6 h-6 mr-2" />
            Current User Info
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1">User ID</label>
              <span className="text-white text-sm font-mono">{user.id}</span>
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1">Email</label>
              <span className="text-white">{user.email}</span>
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1">Name</label>
              <span className="text-white">{user.name || 'Not set'}</span>
            </div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Test Language Updates</h2>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={updateLanguagesDirect}
                disabled={updating}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
              >
                {updating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>Direct Supabase Update</span>
              </button>
              
              <button
                onClick={updateLanguagesAPI}
                disabled={updating}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
              >
                {updating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>API Update</span>
              </button>
              
              <button
                onClick={checkCurrentData}
                disabled={updating}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Check Current Data</span>
              </button>
            </div>
            
            <div className="text-white/70 text-sm">
              <p><strong>Direct Update:</strong> Uses the exact code you requested</p>
              <p><strong>API Update:</strong> Uses the API endpoint with fallback to both tables</p>
              <p><strong>Check Data:</strong> Shows current user data from both database tables</p>
            </div>
          </div>
        </div>

        {/* Results */}
        {(result || error) && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">Results</h2>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {result && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-green-400 mb-2">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">{result.message}</span>
                </div>
                <pre className="text-white text-sm bg-black/20 p-3 rounded overflow-x-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Code Example */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mt-6">
          <h2 className="text-xl font-semibold text-white mb-4">Code Example</h2>
          <div className="bg-black/20 p-4 rounded-lg">
            <pre className="text-green-400 text-sm overflow-x-auto">
{`// Correct approach using public.profiles table:
await supabase
  .from('profiles')
  .upsert({
    id: user.id,
    name: user.name || user.email?.split('@')[0] || 'User',
    email: user.email,
    native_language: 'Bengali',
    learning_language: 'English'
  })
  .select();

// Or for update only (if profile exists):
await supabase
  .from('profiles')
  .update({
    native_language: 'Bengali',
    learning_language: 'English'
  })
  .eq('id', user.id);`}
            </pre>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <a href="/profile" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors mr-4">
            Go to Profile
          </a>
          <a href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
