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
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth initialization timeout')), 3000)
        );
        
        const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]) as any;
        
        if (session) {
          console.log('Initial session found, refreshing user...');
          await refreshUser();
        } else {
          console.log('No initial session found');
          setUser(null);
          setLoading(false);
        }
        setAuthChecked(true);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
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
        
        if (event === 'SIGNED_IN' && session?.user) {
          await refreshUser();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED') {
          // Token was refreshed, update user if needed
          if (session?.user && user) {
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
    
    try {
      setRefreshing(true);
      console.log('Refreshing user authentication...');
      
      // First, try to get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.log('No active session found:', sessionError.message);
        setUser(null);
        setLoading(false);
        return;
      }
      
      if (!session) {
        console.log('No session found');
        setUser(null);
        setLoading(false);
        return;
      }
      
      // If we have a session, get the user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Authentication error:', authError);
        setUser(null);
        return;
      }
      
      if (authUser) {
        console.log('Auth user found:', authUser.id);
        
        // Get user profile from database - try profiles first, then users
        let profile = null;
        let error = null;
        
        // First try: profiles table (public.profiles with correct column names)
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email, name, level, total_xp, streak, native_language, learning_language')
          .eq('id', authUser.id)
          .single();

        if (profilesError && profilesError.code !== 'PGRST116') {
          console.log('Profiles table failed, trying users table:', profilesError.message);
          
          // Fallback: users table (with correct column names)
          const { data: usersData, error: usersError } = await supabase
            .from('users')
            .select('id, email, name, level, total_xp, streak, learning_language, native_language')
            .eq('id', authUser.id)
            .single();
          
          profile = usersData;
          error = usersError;
        } else {
          profile = profilesData;
          error = profilesError;
        }

        console.log('Profile data:', profile, 'Error:', error);

        if (error) {
          console.error('Error fetching user profile:', error);
          console.error('Error details:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
          });
          // If profile doesn't exist, create it
          if (error.code === 'PGRST116') {
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
              console.error('Error creating user profile:', createError);
              console.log('Continuing with auth user data despite profile creation error');
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
            console.error('Non-PGRST116 error fetching profile:', error);
            setUser(null);
          }
        } else if (profile) {
          console.log('User profile found:', profile);
          // Map database fields to User interface
          setUser({
            id: profile.id,
            email: profile.email,
            name: profile.name,
            level: profile.level,
            total_xp: profile.total_xp,
            streak: profile.streak,
            learning_language: profile.learning_language || 'ar',
            native_language: profile.native_language || 'en'
          });
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
      setUser(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
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
