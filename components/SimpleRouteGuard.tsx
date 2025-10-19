'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

interface SimpleRouteGuardProps {
  children: React.ReactNode;
}

export default function SimpleRouteGuard({ children }: SimpleRouteGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Pages that don't require authentication
  const publicPages = [
    '/getting-started',
    '/auth/login',
    '/auth/signup',
    '/auth/callback',
    '/auth/auth-code-error',
    '/test-complete-system',
    '/test-auth-flow'
  ];

  useEffect(() => {
    // Don't redirect while loading
    if (loading) return;

    // If not authenticated and not on public page, redirect to getting started
    if (!user && !publicPages.includes(pathname)) {
      router.push('/getting-started');
    }
  }, [user, loading, pathname, router]);

  // Show loading only while authentication is being checked
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
