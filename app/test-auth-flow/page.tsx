'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  User, 
  ArrowRight,
  Home,
  Settings,
  RefreshCw,
  LogIn,
  UserPlus
} from 'lucide-react';
import Link from 'next/link';

export default function TestAuthFlowPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [testResults, setTestResults] = useState<any>({});

  useEffect(() => {
    if (!loading) {
      runAuthTests();
    }
  }, [user, loading]);

  const runAuthTests = () => {
    const results: any = {};

    // Test 1: Authentication Status
    results.authentication = {
      isAuthenticated: !!user,
      hasUser: !!user,
      loading: loading,
      userId: user?.id,
      userEmail: user?.email,
      userName: user?.name
    };

    // Test 2: Redirect Logic
    results.redirectLogic = {
      shouldRedirectToProfile: !!user,
      shouldShowLanding: !user && !loading,
      shouldShowLoading: loading
    };

    // Test 3: Navigation Options
    results.navigation = {
      canAccessProfile: !!user,
      canAccessHome: true,
      shouldShowLogin: !user,
      shouldShowSignup: !user
    };

    setTestResults(results);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">
              Authentication Flow Test
            </h1>
            <button
              onClick={runAuthTests}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Current Status */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <User className="w-6 h-6 mr-2" />
              Current Authentication Status
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(testResults.authentication?.isAuthenticated)}
                  <span className="text-white font-medium">Authenticated</span>
                </div>
                <div className={`text-sm ${getStatusColor(testResults.authentication?.isAuthenticated)}`}>
                  {testResults.authentication?.isAuthenticated ? 'Yes' : 'No'}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <RefreshCw className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-medium">Loading</span>
                </div>
                <div className={`text-sm ${testResults.authentication?.loading ? 'text-yellow-400' : 'text-green-400'}`}>
                  {testResults.authentication?.loading ? 'Yes' : 'No'}
                </div>
              </div>

              {testResults.authentication?.hasUser && (
                <>
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">User ID</span>
                    </div>
                    <div className="text-white/70 text-sm font-mono">
                      {testResults.authentication.userId?.substring(0, 8)}...
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">Email</span>
                    </div>
                    <div className="text-white/70 text-sm">
                      {testResults.authentication.userEmail || 'Not set'}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Redirect Logic */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <ArrowRight className="w-6 h-6 mr-2" />
              Redirect Logic
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(testResults.redirectLogic?.shouldRedirectToProfile)}
                  <span className="text-white font-medium">Should Go to Profile</span>
                </div>
                <div className={`text-sm ${getStatusColor(testResults.redirectLogic?.shouldRedirectToProfile)}`}>
                  {testResults.redirectLogic?.shouldRedirectToProfile ? 'Yes' : 'No'}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(testResults.redirectLogic?.shouldShowLanding)}
                  <span className="text-white font-medium">Should Show Landing</span>
                </div>
                <div className={`text-sm ${getStatusColor(testResults.redirectLogic?.shouldShowLanding)}`}>
                  {testResults.redirectLogic?.shouldShowLanding ? 'Yes' : 'No'}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Options */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Navigation Options
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/profile"
                className={`bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                  !testResults.navigation?.canAccessProfile ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Profile</span>
              </Link>
              
              <Link
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
              
              <Link
                href="/auth/login"
                className={`bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                  !testResults.navigation?.shouldShowLogin ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </Link>
              
              <Link
                href="/auth/signup"
                className={`bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                  !testResults.navigation?.shouldShowSignup ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <UserPlus className="w-5 h-5" />
                <span>Signup</span>
              </Link>
            </div>
          </div>

          {/* Test Actions */}
          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Test Actions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => router.push('/profile')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowRight className="w-5 h-5" />
                <span>Try Profile Page</span>
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Home className="w-5 h-5" />
                <span>Try Home Page</span>
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-6 mt-8">
            <h3 className="text-yellow-400 font-semibold mb-4">Test Instructions:</h3>
            <ol className="text-yellow-300 text-sm space-y-2">
              <li>1. Check if you're authenticated (should show user data if logged in)</li>
              <li>2. Test navigation to profile page (should work if authenticated)</li>
              <li>3. Test navigation to home page (should redirect to profile if authenticated)</li>
              <li>4. Try login/signup flows and see where they redirect</li>
              <li>5. Check browser console for any authentication errors</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}