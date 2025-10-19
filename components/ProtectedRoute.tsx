'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = '/auth/login',
  requireAuth = true
}: ProtectedRouteProps) {
  const { user, loading, authChecked } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Only redirect if auth has been checked and user is not authenticated
    if (authChecked && requireAuth && !user) {
      console.log('User not authenticated, redirecting to:', redirectTo);
      setIsRedirecting(true);
      router.push(redirectTo);
    }
  }, [user, authChecked, router, redirectTo, requireAuth]);

  // Show loading state only if auth hasn't been checked yet
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show loading state while redirecting
  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Redirecting...</p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Authentication Required</h1>
          <p className="text-white/70 mb-6">Please sign in to access this page.</p>
          <button
            onClick={() => router.push(redirectTo)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
}
