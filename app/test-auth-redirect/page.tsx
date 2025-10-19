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
  BookOpen,
  Trophy
} from 'lucide-react';
import Link from 'next/link';

export default function TestAuthRedirectPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<any>({});

  useEffect(() => {
    if (user) {
      setAuthStatus({
        authenticated: true,
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        hasProfile: !!user.name
      });
    } else {
      setAuthStatus({
        authenticated: false
      });
    }
  }, [user]);

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-5 h-5 text-green-400" />
    ) : (
      <XCircle className="w-5 h-5 text-red-400" />
    );
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            Authentication Redirect Test
          </h1>

          {/* Current Status */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <User className="w-6 h-6 mr-2" />
              Current Authentication Status
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(authStatus.authenticated)}
                  <span className="text-white font-medium">Authenticated</span>
                </div>
                <div className={`text-sm ${authStatus.authenticated ? 'text-green-400' : 'text-red-400'}`}>
                  {authStatus.authenticated ? 'Yes' : 'No'}
                </div>
              </div>

              {authStatus.authenticated && (
                <>
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">User ID</span>
                    </div>
                    <div className="text-white/70 text-sm font-mono">
                      {authStatus.userId?.substring(0, 8)}...
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">Email</span>
                    </div>
                    <div className="text-white/70 text-sm">
                      {authStatus.userEmail || 'Not set'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">Name</span>
                    </div>
                    <div className="text-white/70 text-sm">
                      {authStatus.userName || 'Not set'}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Expected Flow */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Expected Authentication Flow
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                <div className="flex-1">
                  <div className="text-white font-medium">Sign Up / Login</div>
                  <div className="text-white/70 text-sm">Complete authentication process</div>
                </div>
                <div className="flex space-x-2">
                  <Link
                    href="/auth/signup"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    Signup
                  </Link>
                  <Link
                    href="/auth/login"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    Login
                  </Link>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                <div className="flex-1">
                  <div className="text-white font-medium">Welcome / Profile Setup</div>
                  <div className="text-white/70 text-sm">Complete profile and language selection</div>
                </div>
                <Link
                  href="/welcome"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  Welcome
                </Link>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                <div className="flex-1">
                  <div className="text-white font-medium">Profile Page</div>
                  <div className="text-white/70 text-sm">View and manage your profile</div>
                </div>
                <Link
                  href="/profile"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Test Actions */}
          <div className="bg-white/5 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Test Actions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Home className="w-5 h-5" />
                <span>Home Page</span>
              </Link>
              
              <Link
                href="/welcome"
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <User className="w-5 h-5" />
                <span>Welcome Page</span>
              </Link>
              
              <Link
                href="/profile"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Settings className="w-5 h-5" />
                <span>Profile Page</span>
              </Link>
              
              <Link
                href="/lessons"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <BookOpen className="w-5 h-5" />
                <span>Lessons</span>
              </Link>
              
              <Link
                href="/quiz"
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Trophy className="w-5 h-5" />
                <span>Quiz</span>
              </Link>
              
              <Link
                href="/auth/login"
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <User className="w-5 h-5" />
                <span>Login</span>
              </Link>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-6 mt-8">
            <h3 className="text-yellow-400 font-semibold mb-4">Testing Instructions:</h3>
            <ol className="text-yellow-300 text-sm space-y-2">
              <li>1. Sign up or log in to test the authentication flow</li>
              <li>2. After authentication, you should be redirected to the welcome page</li>
              <li>3. Complete the welcome setup to access the profile page</li>
              <li>4. Test that all protected routes work correctly</li>
              <li>5. Verify that the user data is properly stored and displayed</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
