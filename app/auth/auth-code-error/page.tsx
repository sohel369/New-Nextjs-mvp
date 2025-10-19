'use client';

import Link from 'next/link';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function AuthCodeErrorContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    const errorParam = searchParams.get('error');
    const descriptionParam = searchParams.get('description');
    
    if (errorParam) {
      setError(errorParam);
    }
    if (descriptionParam) {
      setDescription(descriptionParam);
    }
  }, [searchParams]);

  const getErrorMessage = () => {
    switch (error) {
      case 'no_code':
        return 'No authorization code was received from Google.';
      case 'exchange_failed':
        return 'Failed to exchange authorization code for session.';
      case 'no_user':
        return 'No user data was received after authentication.';
      case 'unexpected':
        return 'An unexpected error occurred during authentication.';
      default:
        return description || 'An unknown error occurred during authentication.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Authentication Error</h1>
          <p className="text-white/70">
            {getErrorMessage()}
          </p>
        </div>

        {/* Error Details */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <div className="text-red-400 font-medium text-sm">Error Code: {error}</div>
              {description && (
                <div className="text-red-300 text-sm mt-1">{description}</div>
              )}
            </div>
          )}
          
          <div className="text-white/80 text-sm">
            <p className="mb-3">This could be due to:</p>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-red-400 mt-1">•</span>
                <span>Invalid or expired authentication code</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-400 mt-1">•</span>
                <span>Network connection issues</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-400 mt-1">•</span>
                <span>Google OAuth configuration issues</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-400 mt-1">•</span>
                <span>Supabase authentication service error</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Try Again</span>
          </button>

          <Link
            href="/auth/login"
            className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 border border-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Login</span>
          </Link>

          <Link
            href="/"
            className="w-full text-white/70 hover:text-white transition-colors text-center block py-2"
          >
            Go to Homepage
          </Link>
        </div>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-white/50 text-sm">
            If the problem persists, please contact support
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthCodeErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    }>
      <AuthCodeErrorContent />
    </Suspense>
  );
}

