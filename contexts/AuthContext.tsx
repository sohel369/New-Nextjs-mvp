'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { 
  onAuthStateChanged, 
  signOut as firebaseSignOut, 
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

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
  const [user, setUser] = useState<User | null>(() => {
    // Try to restore user from localStorage for instant loading
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('auth_user_cache');
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  // Handle Firebase Auth state changes
  useEffect(() => {
    if (!auth || typeof auth.onAuthStateChanged !== 'function') {
      console.warn('[Auth] Firebase auth not available - check environment variables');
      setLoading(false);
      setAuthChecked(true);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[Auth] Firebase auth state change:', firebaseUser?.uid);
      
      if (firebaseUser) {
        // User is signed in, fetch profile from Firestore
        await fetchAndSetProfile(firebaseUser);
      } else {
        // User is signed out
        setUser(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_user_cache');
        }
        setLoading(false);
        setAuthChecked(true);
      }
    });

    return () => unsubscribe();
  }, []);


  // Store the profile listener
  const [profileUnsubscribe, setProfileUnsubscribe] = useState<(() => void) | null>(null);

  const fetchAndSetProfile = (firebaseUser: FirebaseUser) => {
    try {
      setLoading(true);
      
      // Cleanup existing listener if any
      if (profileUnsubscribe) {
        profileUnsubscribe();
      }

      // Guard against missing db
      if (!db) {
        throw new Error('Firestore not initialized');
      }

      const docRef = doc(db, 'profiles', firebaseUser.uid);
      
      // Real-time listener using onSnapshot
      const unsubscribe = onSnapshot(docRef, async (docSnap) => {
        if (docSnap.exists()) {
          const profileData = docSnap.data();
          const userData = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: profileData.name || firebaseUser.displayName || 'Guest',
            level: profileData.level || 1,
            total_xp: profileData.total_xp || 0,
            streak: profileData.streak || 0,
            learning_language: profileData.learning_language || 'ar',
            native_language: profileData.native_language || 'en'
          };
          setUser(userData);
          // Cache the user data
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_user_cache', JSON.stringify(userData));
          }
          setLoading(false);
          setAuthChecked(true);
        } else {
          // Create default profile if it doesn't exist
          const defaultProfile = {
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Guest',
            email: firebaseUser.email || '',
            level: 1,
            total_xp: 0,
            streak: 0,
            learning_language: 'ar',
            native_language: 'en',
            created_at: new Date().toISOString()
          };
          
          try {
            await setDoc(docRef, defaultProfile);
            // The onSnapshot will fire again with the new data
          } catch (e) {
            console.error('Error creating default profile:', e);
            // Fallback: manually set user if creation fails
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: defaultProfile.name,
              level: 1,
              total_xp: 0,
              streak: 0,
              learning_language: 'ar',
              native_language: 'en'
            });
            setLoading(false);
            setAuthChecked(true);
          }
        }
      }, (error: any) => {
        if (error.message?.includes('not-found') || error.message?.includes('database')) {
          console.error('CRITICAL: Firestore Database Not Found. Check Firebase Console for project ' + (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'car-rental-dubai-86748'));
        } else if (error.message?.includes('offline')) {
          console.warn('Firebase is offline. Check connection or project settings.');
        } else {
          console.error('Error in real-time profile listener:', error);
        }
        
        // Fallback to basic user info from auth object
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Guest',
          level: 1,
          total_xp: 0,
          streak: 0,
          learning_language: 'ar',
          native_language: 'en'
        });
        setLoading(false);
        setAuthChecked(true);
      });

      setProfileUnsubscribe(() => unsubscribe);
    } catch (err: any) {
      console.error('Failed to initialize profile listener:', err);
      setLoading(false);
      setAuthChecked(true);
    }
  };

  // Cleanup profile listener on unmount
  useEffect(() => {
    return () => {
      if (profileUnsubscribe) {
        profileUnsubscribe();
      }
    };
  }, [profileUnsubscribe]);

  const refreshUser = async () => {
    if (auth.currentUser) {
      await fetchAndSetProfile(auth.currentUser);
    }
  };

  const fetchProfile = async () => {
    if (auth.currentUser) {
      await fetchAndSetProfile(auth.currentUser);
    }
  };

  const signOut = async () => {
    try {
      console.log('[Auth] Signing out from Firebase...');
      await firebaseSignOut(auth);
      
      // Clear local storage if needed
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
        // Keep specific flags if necessary
        sessionStorage.setItem('just_logged_out', 'true');
        window.location.replace('/');
      }
    } catch (error) {
      console.error('[Auth] Error during sign out:', error);
      window.location.replace('/');
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
