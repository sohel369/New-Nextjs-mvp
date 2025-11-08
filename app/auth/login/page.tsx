'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { getRedirectUrl } from '../../../lib/config';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const router = useRouter();

  // Track client-side hydration to prevent hydration mismatches
  useEffect(() => {
    setMounted(true);
    // Check offline status after mount
    if (typeof navigator !== 'undefined') {
      setIsOffline(!navigator.onLine);
      
      // Listen for online/offline events
      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);
      
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check offline status - use state if mounted, otherwise check navigator
    const checkOffline = mounted ? isOffline : (typeof navigator !== 'undefined' && !navigator.onLine);

    try {
      // Always check for offline first - even if navigator.onLine says true
      // Network requests might still fail
      
      // If offline, always try cached credentials first
      if (checkOffline) {
        const { loginOffline } = await import('../../../lib/offlineAuth');
        const offlineUser = loginOffline(email);
        
        if (offlineUser) {
          // Use cached credentials for offline login
          console.log('[Login] Offline login with cached credentials');
          // Store user in auth context manually
          try {
            const { storeOfflineUser } = await import('../../../lib/offlineAuth');
            storeOfflineUser(offlineUser);
          } catch (e) {
            console.warn('Error storing offline user:', e);
          }
          router.push('/dashboard');
          setTimeout(() => window.location.reload(), 500);
          return;
        } else {
          // No cached credentials found
          setError('No cached credentials found. Please login while online first to enable offline access.');
          setLoading(false);
          return;
        }
      }

      // Online login - wrap in try-catch to handle network errors
      console.log('Attempting online login...');
      
      // First, test connection to Supabase to catch CORS issues early (optional check)
      // Use dynamic import to prevent blocking page load if there are import issues
      try {
        const { testSupabaseReachability } = await import('../../../lib/supabase');
        if (testSupabaseReachability && typeof testSupabaseReachability === 'function') {
          const reachabilityTest = await testSupabaseReachability();
          if (reachabilityTest && !reachabilityTest.success && reachabilityTest.error?.isCorsError) {
            const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
            console.error('[Login] ❌ CORS Error detected:', reachabilityTest.error);
            setError(`CORS Error: Supabase is blocking requests from ${currentOrigin}. Please: 1) Go to Supabase Dashboard → Settings → API → Add "${currentOrigin}" to allowed origins, 2) Check if project is paused, 3) Restart dev server after updating CORS settings.`);
            setLoading(false);
            return;
          }
        }
      } catch (reachabilityError: any) {
        // If reachability test fails, continue with login attempt anyway
        console.warn('[Login] Reachability test failed, continuing with login:', reachabilityError);
      }
      
      let data, error;
      try {
        const loginPromise = supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        // Add timeout to detect network issues
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Network timeout - appears offline')), 10000)
        );
        
        const result = await Promise.race([loginPromise, timeoutPromise]) as { data: any, error: any };
        data = result.data;
        error = result.error;
      } catch (networkError: any) {
        // Network error - log full details for debugging
        console.error('[Login] Network error caught:', {
          message: networkError?.message,
          name: networkError?.name,
          stack: networkError?.stack,
          cause: networkError?.cause,
          error: networkError
        });
        
        // Check if it's a CORS or fetch error
        const isFetchError = networkError?.message?.includes('fetch') || 
                            networkError?.message?.includes('Failed to fetch') ||
                            networkError?.message?.includes('SupabaseConnectionError') ||
                            networkError?.name === 'TypeError' ||
                            networkError?.name === 'SupabaseConnectionError';
        
        if (isFetchError) {
          const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
          console.error('[Login] ❌ Fetch failed - Common causes:');
          console.error(`  1. CORS issue: Add ${currentOrigin} to Supabase allowed origins`);
          console.error('  2. Supabase project paused: Check Supabase Dashboard');
          console.error('  3. Network/firewall blocking connection');
          console.error('  4. Incorrect Supabase URL in .env file');
          
          setError(`Failed to connect to Supabase. This is usually a CORS issue. Please: 1) Go to Supabase Dashboard → Settings → API → Add "${currentOrigin}" to allowed origins, 2) Check if project is paused, 3) Verify .env file has correct Supabase URL, 4) Restart dev server after updating CORS.`);
          setLoading(false);
          return;
        }
        
        // Try offline login for other network errors
        const { loginOffline, storeOfflineUser } = await import('../../../lib/offlineAuth');
        const offlineUser = loginOffline(email);
        if (offlineUser) {
          console.log('[Login] Network failed, using cached credentials');
          try {
            storeOfflineUser(offlineUser);
          } catch (e) {
            console.warn('Error storing offline user:', e);
          }
          router.push('/dashboard');
          setTimeout(() => window.location.reload(), 500);
          return;
        }
        
        setError('Unable to connect. Please check your internet connection or login with cached credentials.');
        setLoading(false);
        return;
      }

      if (error) {
        console.error('[Login] Supabase auth error:', {
          message: error.message,
          status: error.status,
          code: error.code,
          name: error.name
        });
        
        // Check if it's a CORS/network error (status 0 or AuthRetryableFetchError)
        const isNetworkError = error.status === 0 || 
                               error.name === 'AuthRetryableFetchError' ||
                               error.name === 'SupabaseConnectionError' ||
                               error.message?.includes('Failed to fetch') ||
                               error.message?.includes('fetch') ||
                               error.message?.includes('network') ||
                               error.message?.includes('CORS');
        
        if (isNetworkError) {
          const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
          console.log('[Login] Network/CORS error detected, trying offline login first...');
          
          // Try offline login first
          try {
            const { loginOffline, storeOfflineUser } = await import('../../../lib/offlineAuth');
            const offlineUser = loginOffline(email);
            if (offlineUser) {
              try {
                storeOfflineUser(offlineUser);
              } catch (e) {
                console.warn('Error storing offline user:', e);
              }
              router.push('/dashboard');
              setTimeout(() => window.location.reload(), 500);
              return;
            }
          } catch (offlineError) {
            console.warn('[Login] Offline login failed:', offlineError);
          }
          
          // If offline login fails, show CORS error message
          const corsErrorMessage = `Connection Error: Cannot connect to Supabase\n\n` +
            `This is a CORS (Cross-Origin) issue. Quick fix:\n\n` +
            `1. Open: https://supabase.com/dashboard\n` +
            `2. Select your project → Settings → API\n` +
            `3. Find "CORS Configuration" or "Allowed Origins"\n` +
            `4. Add this URL: ${currentOrigin}\n` +
            `5. Click Save, then restart dev server\n\n` +
            `Other checks:\n` +
            `• Is Supabase project paused? (Resume it)\n` +
            `• Check internet connection\n` +
            `• Verify Supabase URL in .env file`;
          
          setError(corsErrorMessage);
          setLoading(false);
          return;
        }
        
        // Provide user-friendly error messages for other errors
        let userMessage = error.message;
        if (error.message?.includes('Invalid login credentials') || 
            error.message?.includes('Invalid credentials')) {
          userMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message?.includes('Email not confirmed')) {
          userMessage = 'Please verify your email address before logging in. Check your inbox for the verification link.';
        } else if (error.message?.includes('Too many requests')) {
          userMessage = 'Too many login attempts. Please wait a few minutes and try again.';
        } else if (error.message) {
          userMessage = error.message;
        } else {
          userMessage = 'Login failed. Please try again.';
        }
        
        setError(userMessage);
        setLoading(false);
        return;
      }

      console.log('Login Success:', data);
      
      // Store credentials for offline access (password will be hashed internally)
      if (data.user && data.session) {
        const { storeOfflineAuth } = await import('../../../lib/offlineAuth');
        await storeOfflineAuth(email, password);
        
        // Store user data for offline access
        const { storeOfflineUser } = await import('../../../lib/offlineAuth');
        storeOfflineUser({
          id: data.user.id,
          email: data.user.email || email,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
          level: 1,
          total_xp: 0,
          streak: 0,
          learning_language: 'ar',
          native_language: 'en',
          cachedAt: Date.now()
        });
      }
      
      // Redirect to dashboard after successful login
      console.log('Redirecting to dashboard...');
      router.push('/dashboard');
      
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getRedirectUrl('/auth/callback'),
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('Google Login Error:', error.message);
        setError(error.message);
        setLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">L</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/70">Sign in to continue your language learning journey</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Offline Notice - Only show after mount to prevent hydration mismatch */}
            {mounted && isOffline && (
              <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 text-yellow-400 text-sm">
                <div className="flex items-center space-x-2">
                  <span>📡</span>
                  <span>You're offline. Login will use cached credentials if available.</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-400 text-sm whitespace-pre-line">
                <div className="font-semibold mb-2">⚠️ {error.split('\n')[0]}</div>
                {error.includes('\n') && (
                  <div className="text-xs text-red-300/80 mt-2 space-y-1">
                    {error.split('\n').slice(1).map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-4 text-white/50 text-sm">or</span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 border border-white/20"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Forgot Password */}
          <div className="text-center mt-6">
            <Link 
              href="/auth/forgot-password" 
              className="text-purple-400 hover:text-purple-300 transition-colors text-sm"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-white/70">
            Don't have an account?{' '}
            <Link 
              href="/auth/signup" 
              className="text-purple-400 hover:text-purple-300 transition-colors font-semibold"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

