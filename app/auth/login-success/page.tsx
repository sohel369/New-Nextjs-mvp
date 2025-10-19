'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';

export default function LoginSuccessPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is authenticated, redirect to profile
        console.log('User authenticated, redirecting to profile...');
        setRedirecting(true);
        setTimeout(() => {
          router.push('/profile');
        }, 1000);
      } else {
        // User is not authenticated, redirect to login
        console.log('User not authenticated, redirecting to login...');
        router.push('/auth/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            {loading ? (
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            ) : user ? (
              <CheckCircle className="w-8 h-8 text-white" />
            ) : (
              <XCircle className="w-8 h-8 text-white" />
            )}
          </div>
          
          {loading ? (
            <>
              <h1 className="text-2xl font-bold text-white mb-2">Verifying Login...</h1>
              <p className="text-white/70 mb-6">
                Please wait while we verify your authentication.
              </p>
            </>
          ) : user ? (
            <>
              <h1 className="text-2xl font-bold text-white mb-2">Login Successful!</h1>
              <p className="text-white/70 mb-6">
                Welcome back! Redirecting to your profile...
              </p>
              {redirecting && (
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              )}
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white mb-2">Authentication Failed</h1>
              <p className="text-white/70 mb-6">
                Please try logging in again.
              </p>
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
