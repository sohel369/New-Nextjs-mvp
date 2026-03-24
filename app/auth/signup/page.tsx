'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2, Check } from 'lucide-react';
import { auth, db } from '../../../lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  AuthError
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const googleProvider = new GoogleAuthProvider();

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
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    learningLanguages: ['ar'],
    nativeLanguage: 'en'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<React.ReactNode>('');
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

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
      setFormData(prev => ({ ...prev, nativeLanguage: languageCode }));
    }
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) { setError('Please enter your name'); return false; }
    if (!formData.email.trim()) { setError('Please enter your email'); return false; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) { setError('Please enter a valid email address'); return false; }
    if (!formData.password) { setError('Please enter a password'); return false; }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return false; }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return false; }
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
    if (step === 1 && validateStep1()) setStep(2);
  };

  const getFriendlyError = (err: any) => {
    const code = err.code || '';
    const message = err.message || '';

    // Check for "Database not found" error which is common when Firestore isn't initialized
    if (message.includes('NOT_FOUND') || message.includes('database')) {
      return (
        <div className="flex flex-col space-y-2">
          <p className="font-bold text-red-400">🔥 Firestore Database Not Found</p>
          <p className="text-white/70 text-xs">
            The Firebase project ID `{process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'car-rental-dubai-86748'}` exists, 
            but the Firestore database is not initialized.
          </p>
          <p className="text-white/70 text-xs mt-1">
            Go to <b>Firebase Console &rarr; Firestore Database &rarr; Create Database</b> to fix this.
            Ensure you choose <b>(default)</b> as the location.
          </p>
        </div>
      );
    }

    switch (code) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Try signing in instead.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      case 'auth/operation-not-allowed':
        return 'Signup is disabled in the Firebase console. Please enable Email/Password auth.';
      default:
        return message || 'Failed to create account. Please try again.';
    }
  };

  const createUserProfile = async (userId: string, name: string, email: string) => {
    const now = new Date().toISOString();
    // Create profile document
    await setDoc(doc(db, 'profiles', userId), {
      id: userId,
      name,
      email,
      learning_languages: formData.learningLanguages,
      base_language: formData.nativeLanguage,
      learning_language: formData.learningLanguages[0] || 'ar',
      native_language: formData.nativeLanguage,
      level: 1,
      total_xp: 0,
      streak: 0,
      created_at: now,
      updated_at: now
    });
    // Create default settings document
    await setDoc(doc(db, 'user_settings', userId), {
      user_id: userId,
      dark_mode: true,
      notifications_enabled: true,
      sound_enabled: true,
      auto_play_audio: true,
      high_contrast: false,
      large_text: false,
      created_at: now,
      updated_at: now
    });
  };

  const handleSignup = async () => {
    setError('');
    if (!validateStep2()) return;
    setLoading(true);

    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const firebaseUser = userCredential.user;

      // Update Firebase display name
      await updateProfile(firebaseUser, { displayName: formData.name });

      // Create Firestore profile & settings
      await createUserProfile(firebaseUser.uid, formData.name, formData.email);

      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (err: any) {
      console.error('[Signup] Operation failed:', err);
      setError(getFriendlyError(err));
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      // Create profile if it's a new user
      await createUserProfile(
        firebaseUser.uid,
        firebaseUser.displayName || 'User',
        firebaseUser.email || ''
      );
      router.push('/dashboard');
    } catch (err) {
      const authErr = err as AuthError;
      if (authErr.code !== 'auth/popup-closed-by-user') {
        setError(getFriendlyError(authErr));
      }
      setLoading(false);
    }
  };

  if (!mounted) return null;

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
              : 'What languages would you like to learn?'}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-purple-600 text-white' : 'bg-white/20 text-white/50'
            }`}>1</div>
            <div className={`w-12 h-1 ${step >= 2 ? 'bg-purple-600' : 'bg-white/20'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-purple-600 text-white' : 'bg-white/20 text-white/50'
            }`}>2</div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          {step === 1 ? (
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Full Name</label>
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
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Email Address</label>
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
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Create a password (min. 6 characters)"
                    required
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Confirm Password</label>
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
                    autoComplete="new-password"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors">
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                  ⚠️ {error}
                </div>
              )}

              <button type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2">
                <span>Next Step</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Native Language Selection */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-3">Your Native Language</label>
                <div className="grid grid-cols-2 gap-3">
                  {languages.map((lang) => (
                    <button key={lang.code} type="button"
                      onClick={() => handleLanguageChange(lang.code, 'native')}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.nativeLanguage === lang.code
                          ? 'border-purple-500 bg-purple-500/20 text-white'
                          : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:text-white'
                      }`}>
                      <div className="text-2xl mb-1">{lang.flag}</div>
                      <div className="text-sm font-medium">{lang.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Learning Languages Selection */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-3">Languages You Want to Learn</label>
                <p className="text-white/60 text-xs mb-3">Select one or more languages. You can change these later.</p>
                <div className="grid grid-cols-2 gap-3">
                  {languages.map((lang) => (
                    <button key={lang.code} type="button"
                      onClick={() => handleLanguageChange(lang.code, 'learning')}
                      className={`p-3 rounded-lg border-2 transition-all relative ${
                        formData.learningLanguages.includes(lang.code)
                          ? 'border-purple-500 bg-purple-500/20 text-white'
                          : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:text-white'
                      }`}>
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
                <p className="text-white/50 text-xs mt-2">Selected: {formData.learningLanguages.length} language(s)</p>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                  ⚠️ {error}
                </div>
              )}

              <div className="flex space-x-4">
                <button onClick={() => setStep(1)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 border border-white/20">
                  Back
                </button>
                <button onClick={handleSignup} disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Google OAuth (step 1 only) */}
          {step === 1 && (
            <>
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-white/20"></div>
                <span className="px-4 text-white/50 text-sm">or</span>
                <div className="flex-1 border-t border-white/20"></div>
              </div>
              <button onClick={handleGoogleSignup} disabled={loading}
                className="w-full bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 border border-white/20">
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
            <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 transition-colors font-semibold">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
