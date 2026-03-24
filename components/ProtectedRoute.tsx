'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';
import DashboardSkeleton from './DashboardSkeleton';

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
  const [hasCheckedOffline, setHasCheckedOffline] = useState(false);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  useEffect(() => {
    // Session check for Firebase is handled by AuthContext (onAuthStateChanged)
    setHasCheckedSession(true);
  }, []);

  useEffect(() => {
    // Check for offline user if no user and offline
    const checkOfflineUser = async () => {
      if (!user && !hasCheckedOffline && typeof window !== 'undefined') {
        const isOffline = !navigator.onLine;
        if (isOffline) {
          try {
            const { getOfflineUser } = await import('../lib/offlineAuth');
            const offlineUser = getOfflineUser();
            if (offlineUser) {
              console.log('[ProtectedRoute] Found offline user, allowing access');
              // User will be restored by auth context, just wait
              setHasCheckedOffline(true);
              return;
            }
          } catch (e) {
            console.warn('[ProtectedRoute] Error checking offline user:', e);
          }
        }
        setHasCheckedOffline(true);
      }
    };

    checkOfflineUser();
  }, [user, hasCheckedOffline]);

  useEffect(() => {
    // Check if user is logging out
    const isLoggingOut = typeof window !== 'undefined' && sessionStorage.getItem('logging_out') === 'true';
    const justLoggedOut = typeof window !== 'undefined' && sessionStorage.getItem('just_logged_out') === 'true';
    const preventRedirect = typeof window !== 'undefined' && sessionStorage.getItem('prevent_redirect') === 'true';
    const justSignedUp = typeof window !== 'undefined' && sessionStorage.getItem('just_signed_up') === 'true';
    
    // Don't redirect if user is in the process of logging out
    if (isLoggingOut || justLoggedOut || preventRedirect) {
      console.log('[ProtectedRoute] User is logging out, skipping redirect check');
      return;
    }
    
    // Only redirect if auth has been checked, user is not authenticated, and we've checked for offline user and session
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
    
    if (authChecked && requireAuth && !user && hasCheckedOffline && hasCheckedSession) {
      // If user just signed up, wait longer for auth context to initialize
      let waitTime = justSignedUp ? 5000 : (isOffline ? 1000 : 500);
      
      // If just signed up, check when signup happened to adjust wait time
      if (justSignedUp && typeof window !== 'undefined') {
        const signupTime = sessionStorage.getItem('just_signed_up_time');
        if (signupTime) {
          const timeSinceSignup = Date.now() - parseInt(signupTime);
          // If signup happened recently (within last 10 seconds), wait longer
          if (timeSinceSignup < 10000) {
            waitTime = Math.max(5000, 10000 - timeSinceSignup);
          }
        }
      }
      
      // Wait before redirecting to give auth context time to load user from session
      const timeout = setTimeout(async () => {
        // Re-check flags and user state
        const stillLoggingOut = typeof window !== 'undefined' && sessionStorage.getItem('logging_out') === 'true';
        const stillLoggedOut = typeof window !== 'undefined' && sessionStorage.getItem('just_logged_out') === 'true';
        const stillPreventRedirect = typeof window !== 'undefined' && sessionStorage.getItem('prevent_redirect') === 'true';
        const stillJustSignedUp = typeof window !== 'undefined' && sessionStorage.getItem('just_signed_up') === 'true';
        
        // If user just signed up, wait a bit for AuthContext to catch up
        if (stillJustSignedUp) {
          console.log('[ProtectedRoute] User recently signed up, waiting for AuthContext...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Clear the just_signed_up flag only if we're about to redirect
        if (stillJustSignedUp && typeof window !== 'undefined' && !user) {
          // Only clear if user is still not loaded after all the waiting
          sessionStorage.removeItem('just_signed_up');
          sessionStorage.removeItem('just_signed_up_time');
        }
        
        // Only redirect if user is still not authenticated and not in logout process
        if (!user && !stillLoggingOut && !stillLoggedOut && !stillPreventRedirect) {
          console.log('[ProtectedRoute] User not authenticated after wait, redirecting to:', redirectTo);
          setIsRedirecting(true);
          router.push(redirectTo);
        } else if (user) {
          console.log('[ProtectedRoute] User authenticated, allowing access');
          // Clear flags if user is now authenticated
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('just_signed_up');
            sessionStorage.removeItem('just_signed_up_time');
          }
        }
      }, waitTime);
      
      return () => clearTimeout(timeout);
    }
  }, [user, authChecked, router, redirectTo, requireAuth, hasCheckedOffline, hasCheckedSession]);

  // Show skeleton instead of spinner for better UX
  if (!authChecked) {
    return <DashboardSkeleton />;
  }

  // Show skeleton while redirecting
  if (isRedirecting) {
    return <DashboardSkeleton />;
  }

  // Check if user is logging out (don't show auth required screen during logout)
  const isLoggingOut = typeof window !== 'undefined' && sessionStorage.getItem('logging_out') === 'true';
  const justLoggedOut = typeof window !== 'undefined' && sessionStorage.getItem('just_logged_out') === 'true';
  const preventRedirect = typeof window !== 'undefined' && sessionStorage.getItem('prevent_redirect') === 'true';
  const justSignedUp = typeof window !== 'undefined' && sessionStorage.getItem('just_signed_up') === 'true';
  
  // If authentication is required but user is not authenticated
  // Don't show auth required screen if user is in the process of logging out or just signed up
  if (requireAuth && !user && !isLoggingOut && !justLoggedOut && !preventRedirect && !justSignedUp && hasCheckedOffline && hasCheckedSession) {
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
