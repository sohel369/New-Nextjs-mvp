'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, Globe, ArrowRight, Loader2, Check } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { getRedirectUrl } from '../../../lib/config';
import { useAuth } from '../../../contexts/AuthContext';

// TypeScript interfaces for API responses
interface SignupResponse {
  success?: boolean;
  user?: any;
  session?: any;
  profile?: any;
  settings?: any;
  error?: string;
  message?: string;
  warning?: string;
  code?: string;
  details?: {
    profileError?: string;
    usersError?: string;
    hint?: string;
  } | string;
  table?: string;
  debug?: any;
}

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', native: 'English' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', native: 'العربية' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', native: 'Nederlands' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩', native: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', flag: '🇲🇾', native: 'Bahasa Melayu' },
  { code: 'th', name: 'Thai', flag: '🇹🇭', native: 'ไทย' },
  { code: 'km', name: 'Khmer', flag: '🇰🇭', native: 'ខ្មែរ' }
];

export default function SignupPage() {
  const [step, setStep] = useState(1); // 1: Basic info, 2: Language selection
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    learningLanguages: ['en'], // Changed to array for multiple selection
    nativeLanguage: 'en'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { user, refreshUser, authChecked } = useAuth();

  // Track client-side hydration to prevent hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect after signup when user is loaded (fallback)
  useEffect(() => {
    if (success && user && authChecked) {
      console.log('[signup] User loaded via useEffect, redirecting to dashboard...');
      // Small delay to ensure everything is ready
      setTimeout(() => {
        router.push('/dashboard');
      }, 300);
    }
  }, [success, user, authChecked, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (languageCode: string, type: 'learning' | 'native') => {
    if (type === 'learning') {
      setFormData(prev => ({
        ...prev,
        learningLanguages: prev.learningLanguages.includes(languageCode)
          ? prev.learningLanguages.filter(lang => lang !== languageCode)
          : [...prev.learningLanguages, languageCode]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        nativeLanguage: languageCode
      }));
    }
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return false;
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Please enter a password');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (formData.learningLanguages.length === 0) {
      setError('Please select at least one language to learn');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleSignup = async () => {
    setError('');
    if (!validateStep2()) return;
  
    setLoading(true);
  
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

    try {
      if (isOffline) {
        // Queue signup for when online
        const { queueSignup, storeOfflineUser, hashPassword, storeOfflineAuth } = await import('../../../lib/offlineAuth');
        
        // Queue the signup request
        queueSignup({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          learningLanguages: formData.learningLanguages,
          nativeLanguage: formData.nativeLanguage
        });

        // Create temporary offline user for immediate access
        const tempUserId = 'temp-' + Date.now();
        const offlineUser = {
          id: tempUserId,
          email: formData.email,
          name: formData.name,
          level: 1,
          total_xp: 0,
          streak: 0,
          learning_language: formData.learningLanguages[0] || 'en', // Backward compatibility
          learning_languages: formData.learningLanguages || ['en'], // Array support
          native_language: formData.nativeLanguage,
          cachedAt: Date.now()
        };
        
        storeOfflineUser(offlineUser);
        await storeOfflineAuth(formData.email, formData.password);
        
        // Set flag for ProtectedRoute
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('just_signed_up', 'true');
        }
        
        // Refresh AuthContext to load the offline user
        console.log('[Signup] Queued for offline - refreshing AuthContext...');
        await refreshUser();
        await new Promise(resolve => setTimeout(resolve, 300));
        
        console.log('[Signup] Queued for offline - temporary account created');
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
        return;
      }

      // Online signup - use API route for safer profile creation
      console.log('[signup] Starting signup process...');
      
      let apiResponse: Response;
      try {
        apiResponse = await fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            learningLanguages: formData.learningLanguages || ['en'],
            nativeLanguage: formData.nativeLanguage || 'en',
          }),
        });
      } catch (fetchError: any) {
        // Handle network errors (fetch failed, server not running, etc.)
        console.error('[signup] ❌ Fetch error (network/server issue):', fetchError);
        setError('Failed to connect to server. Please make sure the development server is running and try again.');
        setLoading(false);
        return;
      }

      // Parse JSON response safely
      let apiResult: SignupResponse | null = null;
      let responseText = '';
      
      try {
        // Get response as text first (we can't call both .text() and .json())
        responseText = await apiResponse.text();
        
        // Try to parse as JSON
        if (responseText) {
          try {
            apiResult = JSON.parse(responseText);
            console.log('[signup] Parsed API response:', apiResult);
          } catch (jsonError) {
            // If JSON parsing fails, log the raw text
            console.error('[signup] Failed to parse response as JSON:', jsonError);
            console.error('[signup] Raw response text:', responseText.substring(0, 500));
            // Try to extract error message from text response
            const errorMatch = responseText.match(/"error":\s*"([^"]+)"/) || 
                             responseText.match(/"message":\s*"([^"]+)"/);
            const extractedError = errorMatch ? errorMatch[1] : 'Failed to create account. Please try again.';
            setError(extractedError);
            setLoading(false);
            return;
          }
        }
      } catch (parseError) {
        console.error('[signup] Failed to read API response:', parseError);
        setError('Failed to create account. Please try again.');
        setLoading(false);
        return;
      }

      if (!apiResponse.ok) {
        // Extract error message from various possible locations
        let errorMessage = apiResult?.error || apiResult?.message || '';
        
        // If no error message found, try to extract from details
        if (!errorMessage && apiResult) {
          // Check details object
          if (apiResult.details) {
            if (typeof apiResult.details === 'string') {
              errorMessage = apiResult.details;
            } else if (typeof apiResult.details === 'object') {
              const details = apiResult.details as any;
              errorMessage = details.profileError?.message || 
                           details.usersError?.message ||
                           details.profileError || 
                           details.usersError || 
                           details.hint ||
                           details.suggestion ||
                           details.message ||
                           '';
              
              // If we have error code, add helpful context
              if (details.errorCode && !errorMessage) {
                const code = details.errorCode;
                if (code === '42P01') {
                  errorMessage = 'Database table does not exist. Please run the database setup script.';
                } else if (code === '42501') {
                  errorMessage = 'Permission denied. Please check RLS policies.';
                } else if (code === '23503') {
                  errorMessage = 'Foreign key constraint violation.';
                }
              }
            }
          }
        }
        
        // Fallback error message
        if (!errorMessage || errorMessage.trim() === '') {
          errorMessage = `Unable to create account. Server returned status ${apiResponse.status}. Please try again.`;
        }
        
        // Log detailed error for debugging
        console.error('[signup] API error response:', {
          status: apiResponse.status,
          statusText: apiResponse.statusText,
          responseText: responseText.substring(0, 1000),
          apiResult: apiResult ? JSON.parse(JSON.stringify(apiResult)) : null,
          parsedError: apiResult?.error,
          parsedMessage: apiResult?.message,
          parsedDetails: apiResult?.details,
          finalErrorMessage: errorMessage
        });
        
        setError(errorMessage);
        setLoading(false);
        return;
      }

      // Check if signup was successful
      if (!apiResponse.ok || !apiResult || !apiResult.success || !apiResult.user) {
        // Error already handled above, just return
        return;
      }

      console.log('[signup] ✅ Account created successfully');

      // Signup successful - attempt to sign in automatically
      // The API doesn't return a session, so we need to sign in with the credentials
      console.log('[signup] Attempting auto-login...');
      
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (loginError) {
        // If auto-login fails (e.g., email confirmation required), still redirect to dashboard
        // User can complete email verification and login from there
        console.warn('[signup] Auto-login failed:', loginError.message);
        
        // Set flag for ProtectedRoute to wait longer
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('just_signed_up', 'true');
        }
        
        setSuccess(true);
        setLoading(false);
        console.log('[signup] Redirecting to dashboard (email confirmation may be required)...');
        router.push('/dashboard');
        return;
      }

      // Auto-login successful - verify we have a session
      if (!loginData || !loginData.user || !loginData.session) {
        console.warn('[signup] Auto-login succeeded but no session found, redirecting to dashboard...');
        // Account was created successfully, redirect to dashboard
        // User can login from there if needed
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('just_signed_up', 'true');
        }
        setSuccess(true);
        setLoading(false);
        router.push('/dashboard');
        return;
      }

      console.log('[signup] Auto-login successful, storing credentials...');

      // Store credentials for offline access (same as login page)
      try {
        const { storeOfflineAuth, storeOfflineUser } = await import('../../../lib/offlineAuth');
        await storeOfflineAuth(formData.email, formData.password);
        storeOfflineUser({
          id: loginData.user.id,
          email: formData.email,
          name: formData.name,
          level: 1,
          total_xp: 0,
          streak: 0,
          learning_language: formData.learningLanguages[0] || 'en',
          learning_languages: formData.learningLanguages || ['en'],
          native_language: formData.nativeLanguage,
          cachedAt: Date.now()
        });
      } catch (offlineError) {
        console.warn('[signup] Error storing offline credentials:', offlineError);
        // Non-critical error, continue with redirect
      }

      // Verify session is persisted before proceeding
      let sessionPersisted = false;
      for (let i = 0; i < 10; i++) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          sessionPersisted = true;
          console.log('[signup] Session verified and persisted');
          break;
        }
        console.log(`[signup] Session check attempt ${i + 1}/10, waiting...`);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      if (!sessionPersisted) {
        console.error('[signup] Session not persisted after multiple attempts');
        setError('Session not saved. Please try logging in manually.');
        setLoading(false);
        return;
      }

      // Set flag to indicate user just signed up (ProtectedRoute will wait longer)
      // Set this BEFORE refreshing AuthContext
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('just_signed_up', 'true');
        // Also set a timestamp so ProtectedRoute knows when signup happened
        sessionStorage.setItem('just_signed_up_time', Date.now().toString());
      }

      // Refresh AuthContext to load the user before redirecting
      console.log('[signup] Refreshing AuthContext...');
      await refreshUser();
      
      // Wait longer for AuthContext to update and user to be loaded
      let userLoaded = false;
      for (let i = 0; i < 10; i++) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Check if user is loaded in AuthContext
          await new Promise(resolve => setTimeout(resolve, 300));
          // The user should be loaded by now, but we'll let ProtectedRoute handle the final check
          userLoaded = true;
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Success: redirect to dashboard (same as login page)
      setSuccess(true);
      setLoading(false);
      console.log('[signup] Session verified, redirecting to dashboard...');
      router.push('/dashboard');
    } catch (err) {
      console.error('[signup] Unexpected error:', err);
      setError('Unexpected error: ' + (err instanceof Error ? err.message : 'Unknown'));
      setLoading(false);
    }
  };
  
  

  const handleGoogleSignup = async () => {
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
        console.error('Google Signup Error:', error.message);
        setError(error.message);
        setLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  // Show loading state until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Account Created!</h1>
            <p className="text-white/70 mb-6">
              Welcome to your language learning journey! Redirecting to dashboard...
            </p>
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">L</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {step === 1 ? 'Create Account' : 'Choose Your Languages'}
          </h1>
          <p className="text-white/70">
            {step === 1 
              ? 'Join thousands of learners worldwide' 
              : 'What languages would you like to learn?'
            }
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-purple-600 text-white' : 'bg-white/20 text-white/50'
            }`}>
              1
            </div>
            <div className={`w-12 h-1 ${step >= 2 ? 'bg-purple-600' : 'bg-white/20'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-purple-600 text-white' : 'bg-white/20 text-white/50'
            }`}>
              2
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          {step === 1 ? (
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
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
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Create a password"
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

              {/* Confirm Password Field */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Next Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Next Step</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Native Language Selection */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-3">
                  Your Native Language
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleLanguageChange(lang.code, 'native')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.nativeLanguage === lang.code
                          ? 'border-purple-500 bg-purple-500/20 text-white'
                          : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:text-white'
                      }`}
                    >
                      <div className="text-2xl mb-1">{lang.flag}</div>
                      <div className="text-sm font-medium">{lang.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Learning Languages Selection */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-3">
                  Languages You Want to Learn
                </label>
                <p className="text-white/60 text-xs mb-3">
                  Select one or more languages. You can change these later.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleLanguageChange(lang.code, 'learning')}
                      className={`p-3 rounded-lg border-2 transition-all relative ${
                        formData.learningLanguages.includes(lang.code)
                          ? 'border-purple-500 bg-purple-500/20 text-white'
                          : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:text-white'
                      }`}
                    >
                      <div className="text-2xl mb-1">{lang.flag}</div>
                      <div className="text-sm font-medium">{lang.name}</div>
                      {formData.learningLanguages.includes(lang.code) && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-white/50 text-xs mt-2">
                  Selected: {formData.learningLanguages.length} language(s)
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 border border-white/20"
                >
                  Back
                </button>
                <button
                  onClick={handleSignup}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Divider */}
          {step === 1 && (
            <>
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-white/20"></div>
                <span className="px-4 text-white/50 text-sm">or</span>
                <div className="flex-1 border-t border-white/20"></div>
              </div>

              {/* Google Signup */}
              <button
                onClick={handleGoogleSignup}
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
            </>
          )}
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-white/70">
            Already have an account?{' '}
            <Link 
              href="/auth/login" 
              className="text-purple-400 hover:text-purple-300 transition-colors font-semibold"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

