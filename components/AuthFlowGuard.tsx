'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface AuthFlowGuardProps {
  children: React.ReactNode;
}

export default function AuthFlowGuard({ children }: AuthFlowGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [userSetupComplete, setUserSetupComplete] = useState(false);

  // Pages that don't require authentication
  const publicPages = [
    '/getting-started',
    '/auth/login',
    '/auth/signup',
    '/auth/callback',
    '/auth/auth-code-error',
    '/test-complete-system'
  ];

  // Pages that require authentication but not setup
  const authOnlyPages = [
    '/language-selection'
  ];

  useEffect(() => {
    checkUserSetup();
  }, [user, pathname]);

  const checkUserSetup = async () => {
    if (loading) return;

    // If user is not authenticated
    if (!user) {
      // Allow access to public pages
      if (publicPages.includes(pathname)) {
        setIsChecking(false);
        return;
      }
      
      // Redirect to getting started for other pages
      if (pathname !== '/getting-started') {
        router.push('/getting-started');
        return;
      }
      
      setIsChecking(false);
      return;
    }

    // If user is authenticated, check if setup is complete
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('base_language, learning_languages')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking user setup:', error);
        setUserSetupComplete(false);
      } else {
        // Check if user has completed language selection
        const hasBaseLanguage = profile?.base_language;
        const hasLearningLanguages = profile?.learning_languages && profile.learning_languages.length > 0;
        
        setUserSetupComplete(hasBaseLanguage && hasLearningLanguages);
      }
    } catch (error) {
      console.error('Error checking user setup:', error);
      setUserSetupComplete(false);
    }

    // Handle routing based on setup status
    if (!userSetupComplete) {
      // User needs to complete setup
      if (pathname !== '/language-selection') {
        router.push('/language-selection');
        return;
      }
    } else {
      // User setup is complete
      if (pathname === '/language-selection') {
        router.push('/');
        return;
      }
      
      if (pathname === '/getting-started') {
        router.push('/');
        return;
      }
    }

    setIsChecking(false);
  };

  // Show loading while checking authentication and setup
  if (loading || isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show children if all checks pass
  return <>{children}</>;
}

// Hook to check if user should be redirected
export function useAuthRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    const publicPages = [
      '/getting-started',
      '/auth/login',
      '/auth/signup',
      '/auth/callback',
      '/auth/auth-code-error',
      '/test-complete-system'
    ];

    // If not authenticated and not on public page, redirect to getting started
    if (!user && !publicPages.includes(pathname)) {
      router.push('/getting-started');
    }
  }, [user, loading, pathname, router]);
}
