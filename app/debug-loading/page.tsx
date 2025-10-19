'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader2,
  Database,
  User,
  Key,
  Globe,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

export default function DebugLoadingPage() {
  const { user, loading: authLoading } = useAuth();
  const { currentLanguage, isRTL } = useLanguage();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isChecking, setIsChecking] = useState(false);

  const checkSystemStatus = async () => {
    setIsChecking(true);
    const info: any = {};

    try {
      // Check authentication status
      info.auth = {
        loading: authLoading,
        user: user ? {
          id: user.id,
          email: user.email,
          name: user.name
        } : null,
        timestamp: new Date().toISOString()
      };

      // Check Supabase connection
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        info.supabase = {
          connected: !sessionError,
          hasSession: !!session,
          sessionError: sessionError?.message,
          timestamp: new Date().toISOString()
        };
      } catch (err) {
        info.supabase = {
          connected: false,
          error: err instanceof Error ? err.message : 'Unknown error',
          timestamp: new Date().toISOString()
        };
      }

      // Check database connection
      try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        info.database = {
          connected: !error,
          error: error?.message,
          timestamp: new Date().toISOString()
        };
      } catch (err) {
        info.database = {
          connected: false,
          error: err instanceof Error ? err.message : 'Unknown error',
          timestamp: new Date().toISOString()
        };
      }

      // Check language context
      info.language = {
        currentLanguage: currentLanguage,
        isRTL: isRTL,
        timestamp: new Date().toISOString()
      };

      // Check environment variables
      info.environment = {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      info.error = error instanceof Error ? error.message : 'Unknown error';
    } finally {
      setIsChecking(false);
    }

    setDebugInfo(info);
  };

  useEffect(() => {
    checkSystemStatus();
  }, []);

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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Loader2 className="w-8 h-8 mr-3" />
              Loading Debug Page
            </h1>
            <button
              onClick={checkSystemStatus}
              disabled={isChecking}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
          </div>

          {/* Current Loading State */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <AlertCircle className="w-6 h-6 mr-2" />
              Current Loading State
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  {authLoading ? (
                    <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                  <span className="text-white font-medium">Auth Loading</span>
                </div>
                <div className={`text-sm ${authLoading ? 'text-yellow-400' : 'text-green-400'}`}>
                  {authLoading ? 'Loading...' : 'Complete'}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  {user ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span className="text-white font-medium">User Authenticated</span>
                </div>
                <div className={`text-sm ${user ? 'text-green-400' : 'text-red-400'}`}>
                  {user ? 'Yes' : 'No'}
                </div>
              </div>
            </div>
          </div>

          {/* Debug Information */}
          {Object.keys(debugInfo).length > 0 && (
            <div className="space-y-6">
              {/* Authentication Status */}
              {debugInfo.auth && (
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Authentication Status
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                      <span className="text-white font-medium">Loading State</span>
                      <span className={`text-sm ${debugInfo.auth.loading ? 'text-yellow-400' : 'text-green-400'}`}>
                        {debugInfo.auth.loading ? 'Loading...' : 'Complete'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                      <span className="text-white font-medium">User Present</span>
                      <span className={`text-sm ${debugInfo.auth.user ? 'text-green-400' : 'text-red-400'}`}>
                        {debugInfo.auth.user ? 'Yes' : 'No'}
                      </span>
                    </div>
                    {debugInfo.auth.user && (
                      <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                        <div className="text-green-400 text-sm">
                          <strong>User ID:</strong> {debugInfo.auth.user.id}<br/>
                          <strong>Email:</strong> {debugInfo.auth.user.email}<br/>
                          <strong>Name:</strong> {debugInfo.auth.user.name}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Supabase Connection */}
              {debugInfo.supabase && (
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Key className="w-5 h-5 mr-2" />
                    Supabase Connection
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                      <span className="text-white font-medium">Connected</span>
                      <span className={`text-sm ${getStatusColor(debugInfo.supabase.connected)}`}>
                        {debugInfo.supabase.connected ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                      <span className="text-white font-medium">Has Session</span>
                      <span className={`text-sm ${getStatusColor(debugInfo.supabase.hasSession)}`}>
                        {debugInfo.supabase.hasSession ? 'Yes' : 'No'}
                      </span>
                    </div>
                    {debugInfo.supabase.sessionError && (
                      <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                        <div className="text-red-400 text-sm">
                          <strong>Session Error:</strong> {debugInfo.supabase.sessionError}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Database Connection */}
              {debugInfo.database && (
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    Database Connection
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                      <span className="text-white font-medium">Connected</span>
                      <span className={`text-sm ${getStatusColor(debugInfo.database.connected)}`}>
                        {debugInfo.database.connected ? 'Yes' : 'No'}
                      </span>
                    </div>
                    {debugInfo.database.error && (
                      <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                        <div className="text-red-400 text-sm">
                          <strong>Database Error:</strong> {debugInfo.database.error}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Environment Variables */}
              {debugInfo.environment && (
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Environment Variables
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                      <span className="text-white font-medium">Supabase URL</span>
                      <span className={`text-sm ${getStatusColor(debugInfo.environment.hasSupabaseUrl)}`}>
                        {debugInfo.environment.hasSupabaseUrl ? 'Present' : 'Missing'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                      <span className="text-white font-medium">Supabase Anon Key</span>
                      <span className={`text-sm ${getStatusColor(debugInfo.environment.hasSupabaseAnonKey)}`}>
                        {debugInfo.environment.hasSupabaseAnonKey ? 'Present' : 'Missing'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Language Context */}
              {debugInfo.language && (
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Language Context
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                      <span className="text-white font-medium">Current Language</span>
                      <span className="text-sm text-white/70">
                        {debugInfo.language.currentLanguage?.name || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                      <span className="text-white font-medium">RTL Mode</span>
                      <span className={`text-sm ${getStatusColor(debugInfo.language.isRTL)}`}>
                        {debugInfo.language.isRTL ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Fixes */}
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-6 mt-8">
            <h3 className="text-yellow-400 font-semibold mb-4">Quick Fixes for Loading Issues:</h3>
            <div className="text-yellow-300 text-sm space-y-2">
              <div><strong>1. Check Environment Variables:</strong> Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set</div>
              <div><strong>2. Database Connection:</strong> Run the database setup scripts if database is not connected</div>
              <div><strong>3. Clear Browser Cache:</strong> Try hard refresh (Ctrl+F5) or clear browser cache</div>
              <div><strong>4. Check Network:</strong> Ensure you have internet connection and Supabase is accessible</div>
              <div><strong>5. Restart Development Server:</strong> Stop and restart your Next.js development server</div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center space-x-4 mt-8">
            <a
              href="/"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Go to Home
            </a>
            <a
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
