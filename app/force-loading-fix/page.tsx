'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function ForceLoadingFixPage() {
  const [status, setStatus] = useState('checking');
  const router = useRouter();

  useEffect(() => {
    const fixLoading = async () => {
      try {
        // Clear any cached auth state
        if (typeof window !== 'undefined') {
          localStorage.removeItem('sb-auth-token');
          sessionStorage.clear();
        }

        // Wait a moment
        await new Promise(resolve => setTimeout(resolve, 1000));

        setStatus('fixed');
        
        // Redirect to home after showing success
        setTimeout(() => {
          router.push('/');
        }, 2000);

      } catch (error) {
        console.error('Error fixing loading:', error);
        setStatus('error');
      }
    };

    fixLoading();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          {status === 'checking' && (
            <>
              <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-4">Fixing Loading Issue...</h1>
              <p className="text-white/70">
                Clearing cached authentication data and resetting the app state.
              </p>
            </>
          )}

          {status === 'fixed' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-4">Loading Issue Fixed!</h1>
              <p className="text-white/70 mb-4">
                Authentication cache cleared successfully. Redirecting to home page...
              </p>
              <div className="text-sm text-white/50">
                If the issue persists, try:
                <ul className="mt-2 text-left space-y-1">
                  <li>• Hard refresh (Ctrl+F5)</li>
                  <li>• Clear browser cache</li>
                  <li>• Restart development server</li>
                </ul>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-4">Fix Failed</h1>
              <p className="text-white/70 mb-4">
                Unable to automatically fix the loading issue.
              </p>
              <div className="text-sm text-white/50">
                Manual steps to try:
                <ul className="mt-2 text-left space-y-1">
                  <li>• Check browser console for errors</li>
                  <li>• Verify environment variables</li>
                  <li>• Check Supabase connection</li>
                  <li>• Visit /debug-loading for detailed diagnostics</li>
                </ul>
              </div>
            </>
          )}

          <div className="mt-6">
            <button
              onClick={() => router.push('/')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors mr-4"
            >
              Go to Home
            </button>
            <button
              onClick={() => router.push('/debug-loading')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Debug Loading
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
