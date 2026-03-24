import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { 
  getFirestore, 
  Firestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDNHKYbgeHsSx3fmLMNLquCD8TlZZfPzSE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "car-rental-dubai-86748.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "car-rental-dubai-86748",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "car-rental-dubai-86748.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "436752043263",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:436752043263:web:2776b12711b66681aad0ca",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-0MLN1RWTB0",
};

// Initialize Firebase instances
let app: FirebaseApp;
if (getApps().length > 0) {
  app = getApp();
} else {
  app = initializeApp(firebaseConfig);
}

// Global state for HMR resilience
const globalState = (globalThis || {}) as unknown as {
  firebaseAuth: Auth | undefined;
  firebaseDb: Firestore | undefined;
};

// Auth singleton
let auth: Auth;
if (process.env.NODE_ENV !== 'production' && globalState.firebaseAuth) {
  auth = globalState.firebaseAuth;
} else {
  auth = getAuth(app);
  if (process.env.NODE_ENV !== 'production') {
    globalState.firebaseAuth = auth;
  }
}

// Firestore singleton with persistence and custom DB support
let db: Firestore;
if (process.env.NODE_ENV !== 'production' && globalState.firebaseDb) {
  db = globalState.firebaseDb;
} else {
  // Use a custom database ID if provided, otherwise default to '(default)'
  const databaseId = (process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_DATABASE_ID as string) || '(default)';
  
  try {
    // Initialize Firestore with persistent cache for better reliability
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    }, databaseId);
  } catch (err) {
    console.warn('[Firebase] initializeFirestore error, falling back to getFirestore:', err);
    db = getFirestore(app, databaseId);
  }
  
  if (process.env.NODE_ENV !== 'production') {
    globalState.firebaseDb = db;
  }
}

/**
 * Analytics: Dynamic initialization to avoid window/SSR issues
 */
const getAnalyticsInstance = async () => {
  if (typeof window === 'undefined' || !app) return null;
  try {
    const { getAnalytics, isSupported } = await import("firebase/analytics");
    const supported = await isSupported();
    if (supported) {
      return getAnalytics(app);
    }
  } catch (err) {
    console.warn('[Firebase] Analytics startup error:', err);
  }
  return null;
};

export { app, auth, db, getAnalyticsInstance };
