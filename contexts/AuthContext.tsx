'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  name: string;
  level: number;
  total_xp: number;
  streak: number;
  learning_language?: string;
  native_language?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authChecked: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Initialize auth state with timeout
    const initializeAuth = async () => {
      if (initialized) return; // Prevent multiple initializations
      
      try {
        console.log('Initializing auth...');
        setLoading(true);
        
        // Wait a bit for Supabase to initialize
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Get initial session with timeout
        // Check if offline - if so, try to restore user from localStorage
        const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
        let session;
        try {
          const sessionPromise = supabase.auth.getSession();
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Auth initialization timeout after 10 seconds')), 10000)
          );
          
          const result = await Promise.race([sessionPromise, timeoutPromise]) as { data: { session: any } };
          session = result.data.session;
        } catch (timeoutError) {
          console.warn('Auth session timeout, continuing without session');
          // If offline and timeout, try to restore user from stored session
          if (isOffline) {
            try {
              // Try to get session from localStorage
              const storedSession = localStorage.getItem('sb-auth-token') || 
                                   sessionStorage.getItem('sb-session');
              if (storedSession) {
                console.log('[Auth] Offline - attempting to restore session from storage');
                // Don't clear user - let refreshUser handle it
              }
            } catch (e) {
              // Ignore storage errors
            }
          }
          session = null;
        }
        
        if (session) {
          console.log('Initial session found, refreshing user...');
          await refreshUser();
        } else {
          console.log('No initial session found');
          // Always try to restore from cached user data if available (works for both online and offline)
          try {
            const { getOfflineUser } = await import('../lib/offlineAuth');
            const offlineUser = getOfflineUser();
            if (offlineUser) {
              console.log('[Auth] Restoring user from cache');
              setUser({
                id: offlineUser.id,
                email: offlineUser.email,
                name: offlineUser.name,
                level: offlineUser.level,
                total_xp: offlineUser.total_xp,
                streak: offlineUser.streak,
                learning_language: offlineUser.learning_language,
                native_language: offlineUser.native_language
              });
              setLoading(false);
              setAuthChecked(true);
              // If online, will refresh in the useEffect after refreshUser is defined
              return;
            }
          } catch (e) {
            console.warn('[Auth] Error checking offline user:', e);
          }
          
          // No cached user found
          setUser(null);
          setLoading(false);
        }
        setAuthChecked(true);
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Don't set user to null on timeout, just set loading to false
        if (error instanceof Error && error.message.includes('timeout')) {
          console.warn('Auth initialization timed out, continuing without session');
          // Don't treat timeout as a critical error
        } else {
          console.error('Non-timeout auth error:', error);
        }
        setLoading(false);
        setAuthChecked(true);
      } finally {
        setInitialized(true);
      }
    };

    // Add a fallback timeout to prevent infinite loading
    const fallbackTimeout = setTimeout(() => {
      console.warn('Auth initialization taking too long, setting loading to false');
      setLoading(false);
      setInitialized(true);
      setAuthChecked(true);
    }, 5000); // Reduced from 10s to 5s

    initializeAuth().finally(() => {
      clearTimeout(fallbackTimeout);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
        
        if (event === 'SIGNED_IN' && session?.user) {
          await refreshUser();
        } else if (event === 'SIGNED_OUT') {
          // Only clear user if we're online - preserve user state when offline
          if (!isOffline) {
            setUser(null);
            setLoading(false);
          } else {
            console.log('[Auth] SIGNED_OUT event while offline - preserving user state');
            // Don't clear user - might be a network issue
          }
        } else if (event === 'TOKEN_REFRESHED') {
          // Token was refreshed, update user if needed
          // But skip if offline to avoid network calls
          if (session?.user && user && !isOffline) {
            // Only refresh if we already have a user to avoid loops
            await refreshUser();
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [initialized, user]);

  const refreshUser = async () => {
    if (refreshing) {
      console.log('Already refreshing user, skipping...');
      return;
    }
    
      // Check if we're offline - if so, keep existing user state or restore from cache
      const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
      if (isOffline) {
        if (user) {
          console.log('[Auth] Offline - keeping existing user state');
          setLoading(false);
          setRefreshing(false);
          return;
        } else {
          // Try to restore from offline cache
          const { getOfflineUser } = await import('../lib/offlineAuth');
          const offlineUser = getOfflineUser();
          if (offlineUser) {
            console.log('[Auth] Offline - restoring user from cache');
            setUser({
              id: offlineUser.id,
              email: offlineUser.email,
              name: offlineUser.name,
              level: offlineUser.level,
              total_xp: offlineUser.total_xp,
              streak: offlineUser.streak,
              learning_language: offlineUser.learning_language,
              native_language: offlineUser.native_language
            });
            setLoading(false);
            setRefreshing(false);
            return;
          }
        }
      }
    
    try {
      setRefreshing(true);
      console.log('Refreshing user authentication...');
      
      // First, try to get the current session with timeout
      let session, sessionError;
      try {
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session fetch timeout')), 5000)
        );
        const result = await Promise.race([sessionPromise, timeoutPromise]) as { data: { session: any }, error?: any };
        session = result.data.session;
        sessionError = result.error;
      } catch (timeoutError) {
        // Timeout or network error - if we have a user OR offline user, keep them
        const { getOfflineUser } = await import('../lib/offlineAuth');
        const offlineUser = getOfflineUser();
        
        if (user || offlineUser) {
          console.log('[Auth] Session fetch failed but user exists - keeping user state');
          if (offlineUser && !user) {
            // Restore from offline cache
            setUser({
              id: offlineUser.id,
              email: offlineUser.email,
              name: offlineUser.name,
              level: offlineUser.level,
              total_xp: offlineUser.total_xp,
              streak: offlineUser.streak,
              learning_language: offlineUser.learning_language,
              native_language: offlineUser.native_language
            });
          }
          setLoading(false);
          setRefreshing(false);
          return;
        }
        sessionError = timeoutError;
      }
      
      if (sessionError) {
        console.log('No active session found:', sessionError.message);
        // Only clear user if we're online - offline errors shouldn't logout
        if (!isOffline && !user) {
          setUser(null);
        }
        setLoading(false);
        return;
      }
      
      if (!session) {
        console.log('No session found');
        // Only clear user if we're online and don't have a user
        if (!isOffline && !user) {
          setUser(null);
        }
        setLoading(false);
        return;
      }
      
      // If we have a session, get the user
      let authUser, authError;
      try {
        const userPromise = supabase.auth.getUser();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('User fetch timeout')), 5000)
        );
        const result = await Promise.race([userPromise, timeoutPromise]) as { data: { user: any }, error?: any };
        authUser = result.data.user;
        authError = result.error;
      } catch (timeoutError) {
        // Network/timeout error - if we have a user from session, use session user
        if (session?.user && user) {
          console.log('[Auth] User fetch timeout but session exists - keeping user state');
          setLoading(false);
          setRefreshing(false);
          return;
        }
        authError = timeoutError;
      }
      
      if (authError) {
        console.error('Authentication error:', authError);
        // Only clear user if we're online - preserve user state when offline
        const errorIsOffline = authError?.message?.includes('fetch') || 
                               authError?.message?.includes('network') ||
                               authError?.message?.includes('timeout');
        if (!errorIsOffline && !user) {
          setUser(null);
        } else if (errorIsOffline && user) {
          console.log('[Auth] Network error but user exists - keeping user state');
        }
        setLoading(false);
        setRefreshing(false);
        return;
      }
      
      if (authUser) {
        console.log('Auth user found:', authUser.id);
        
        // Get user profile from database - try profiles first, then users
        let profile = null;
        let error = null;
        
        // First try: profiles table (public.profiles with correct column names)
        let profilesData, profilesError;
        try {
          const profilePromise = supabase
            .from('profiles')
            .select('id, email, name, level, total_xp, streak, native_language, learning_language')
            .eq('id', authUser.id)
            .single();
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
          );
          const result = await Promise.race([profilePromise, timeoutPromise]) as { data: any, error?: any };
          profilesData = result.data;
          profilesError = result.error;
        } catch (timeoutError) {
          // Network timeout - if we have existing user data, keep it
          if (user) {
            console.log('[Auth] Profile fetch timeout but user exists - keeping user state');
            setLoading(false);
            setRefreshing(false);
            return;
          }
          profilesError = timeoutError;
        }

        if (profilesError && profilesError.code !== 'PGRST116') {
          console.log('Profiles table failed, trying users table:', profilesError.message);
          
          // Fallback: users table (with correct column names)
          let usersData, usersError;
          try {
            const usersPromise = supabase
              .from('users')
              .select('id, email, name, level, total_xp, streak, learning_language, native_language')
              .eq('id', authUser.id)
              .single();
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Users fetch timeout')), 5000)
            );
            const result = await Promise.race([usersPromise, timeoutPromise]) as { data: any, error?: any };
            usersData = result.data;
            usersError = result.error;
          } catch (timeoutError) {
            // Network timeout - if we have existing user data, keep it
            if (user) {
              console.log('[Auth] Users fetch timeout but user exists - keeping user state');
              setLoading(false);
              setRefreshing(false);
              return;
            }
            usersError = timeoutError;
          }
          
          profile = usersData;
          error = usersError;
        } else {
          profile = profilesData;
          error = profilesError;
        }

        console.log('Profile data:', profile, 'Error:', error);

        if (error) {
          const normalizedError = (() => {
            if (error instanceof Error) {
              return {
                message: error.message,
                code: (error as any).code ?? undefined,
                details: (error as any).details ?? undefined,
                hint: (error as any).hint ?? undefined
              };
            }
            if (typeof error === 'object' && error !== null) {
              const anyErr: any = error;
              return {
                message: anyErr.message ?? JSON.stringify(anyErr),
                code: anyErr.code ?? undefined,
                details: anyErr.details ?? undefined,
                hint: anyErr.hint ?? undefined
              };
            }
            return { message: String(error) };
          })();
          // Only log non-intrusive warning in development with meaningful info
          const shouldLog = process.env.NODE_ENV !== 'production' && (normalizedError.message || normalizedError.code);
          if (shouldLog) {
            console.warn('Profile fetch issue:', normalizedError);
          }
          // If profile doesn't exist, create it
          const errorCode = (typeof error === 'object' && error !== null && 'code' in (error as any)) ? (error as any).code : undefined;
          if (errorCode === 'PGRST116') {
            console.log('Creating user profile...');
            
            // Try profiles table first, then fallback to users table
            let createError = null;
            
            // First try: profiles table (public.profiles with correct column names)
            const { error: profilesError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: authUser.id,
                  name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || "Guest",
                  email: authUser.email || "",
                  level: 1,
                  total_xp: 0,
                  streak: 0,
                  native_language: 'en',
                  learning_language: 'ar'
                }
              ]);

            if (profilesError) {
              console.log('Profiles table failed, trying users table:', profilesError.message);
              
              // Fallback: users table
              const { error: usersError } = await supabase
                .from('users')
                .insert([
                  {
                    id: authUser.id,
                    name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || "Guest",
                    email: authUser.email || "",
                    level: 1,
                    total_xp: 0,
                    streak: 0,
                    learning_language: 'ar',
                    native_language: 'en'
                  }
                ]);
              
              createError = usersError;
            }
            
            if (createError) {
              setUser({
                id: authUser.id,
                email: authUser.email || "",
                name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || "Guest",
                level: 1,
                total_xp: 0,
                streak: 0,
                learning_language: 'ar',
                native_language: 'en'
              });
            } else {
              console.log('User profile created successfully');
              setUser({
                id: authUser.id,
                email: authUser.email || "",
                name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || "Guest",
                level: 1,
                total_xp: 0,
                streak: 0,
                learning_language: 'ar',
                native_language: 'en'
              });
            }
          } else {
            // Fallback: allow access with basic auth user data
            setUser({
              id: authUser.id,
              email: authUser.email || "",
              name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || "Guest",
              level: 1,
              total_xp: 0,
              streak: 0,
              learning_language: 'ar',
              native_language: 'en'
            });
          }
        } else if (profile) {
          console.log('User profile found:', profile);
          // Map database fields to User interface
          const userData = {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            level: profile.level,
            total_xp: profile.total_xp,
            streak: profile.streak,
            learning_language: profile.learning_language || 'ar',
            native_language: profile.native_language || 'en'
          };
          setUser(userData);
          
          // Store for offline access
          if (typeof window !== 'undefined') {
            const { storeOfflineUser } = require('../lib/offlineAuth');
            storeOfflineUser({
              ...userData,
              cachedAt: Date.now()
            });
          }
        } else {
          console.log('No profile data found, creating default user');
          setUser({
            id: authUser.id,
            email: authUser.email || "",
            name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || "Guest",
            level: 1,
            total_xp: 0,
            streak: 0,
            learning_language: 'ar',
            native_language: 'en'
          });
        }
      } else {
        console.log('No auth user found');
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      // Only clear user if we're online and error is not network-related
      const isNetworkError = error instanceof Error && (
        error.message.includes('fetch') ||
        error.message.includes('network') ||
        error.message.includes('timeout')
      );
      const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
      
      if (!isNetworkError && !isOffline && !user) {
        setUser(null);
      } else if ((isNetworkError || isOffline) && user) {
        console.log('[Auth] Network error during refresh - keeping existing user state');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      // Ensure downstream consumers can proceed (e.g., ProtectedRoute)
      setAuthChecked(true);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        console.log('Profile:', data);
        if (data) {
          setUser(data);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signOut = async () => {
    try {
      // Clear user state immediately to prevent redirect loops
      setUser(null);
      setLoading(false);
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.log('Logout Error:', error.message);
      } else {
        console.log('Logged out successfully');
      }
      
      // Force redirect to getting started page with a clean state
      router.push('/');
      // Force a page refresh to ensure clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      // Even if there's an error, clear the user state
      setUser(null);
      setLoading(false);
      router.push('/');
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, authChecked, signOut, refreshUser, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
