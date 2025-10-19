'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

export default function AuthSuccessPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is authenticated, redirect to profile
        setRedirecting(true);
        setTimeout(() => {
          router.push('/profile');
        }, 1000);
      } else {
        // User is not authenticated, redirect to login
        router.push('/auth/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          
          {loading ? (
            <>
              <h1 className="text-2xl font-bold text-white mb-2">Verifying Account...</h1>
              <p className="text-white/70 mb-6">
                Please wait while we verify your account.
              </p>
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </>
          ) : user ? (
            <>
              <h1 className="text-2xl font-bold text-white mb-2">Account Created Successfully!</h1>
              <p className="text-white/70 mb-6">
                Welcome to your language learning journey! Redirecting to your profile...
              </p>
              {redirecting && (
                <div className="flex items-center justify-center space-x-2 text-purple-400">
                  <ArrowRight className="w-4 h-4" />
                  <span className="text-sm">Redirecting to profile...</span>
                </div>
              )}
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white mb-2">Authentication Required</h1>
              <p className="text-white/70 mb-6">
                Please sign in to access your account.
              </p>
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
