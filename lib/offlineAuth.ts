// Offline authentication utilities
// Allows login/signup to work when offline

const OFFLINE_AUTH_KEY = 'lingua-ai-offline-auth';
const OFFLINE_USER_KEY = 'lingua-ai-offline-user';
const QUEUED_SIGNUPS_KEY = 'lingua-ai-queued-signups';

export interface OfflineUser {
  id: string;
  email: string;
  name: string;
  level: number;
  total_xp: number;
  streak: number;
  learning_language?: string; // Deprecated: use learning_languages instead
  learning_languages?: string[]; // Preferred: array of language codes
  native_language?: string;
  cachedAt: number;
}

export interface QueuedSignup {
  email: string;
  password: string;
  name: string;
  learningLanguages: string[];
  nativeLanguage: string;
  timestamp: number;
}

// Store user credentials for offline login (hashed password for security)
export async function storeOfflineAuth(email: string, password: string) {
  try {
    // Hash the password securely
    const passwordHash = await hashPassword(password);
    const authData = {
      email,
      passwordHash,
      timestamp: Date.now()
    };
    localStorage.setItem(OFFLINE_AUTH_KEY, JSON.stringify(authData));
  } catch (error) {
    console.error('Error storing offline auth:', error);
  }
}

// Synchronous version for backward compatibility (uses sync hash)
export function storeOfflineAuthSync(email: string, passwordHash: string) {
  try {
    const authData = {
      email,
      passwordHash,
      timestamp: Date.now()
    };
    localStorage.setItem(OFFLINE_AUTH_KEY, JSON.stringify(authData));
  } catch (error) {
    console.error('Error storing offline auth:', error);
  }
}

// Store user data for offline access
export function storeOfflineUser(user: OfflineUser) {
  try {
    const userData: OfflineUser = {
      ...user,
      cachedAt: Date.now()
    };
    localStorage.setItem(OFFLINE_USER_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Error storing offline user:', error);
  }
}

// Get cached user for offline access
export function getOfflineUser(): OfflineUser | null {
  try {
    const stored = localStorage.getItem(OFFLINE_USER_KEY);
    if (stored) {
      const user: OfflineUser = JSON.parse(stored);
      // Check if cached data is still valid (24 hours)
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      if (Date.now() - user.cachedAt < maxAge) {
        return user;
      } else {
        // Remove expired cache
        localStorage.removeItem(OFFLINE_USER_KEY);
        localStorage.removeItem(OFFLINE_AUTH_KEY);
      }
    }
  } catch (error) {
    console.error('Error getting offline user:', error);
  }
  return null;
}

// Check if we can login offline (cached credentials exist)
export function canLoginOffline(email: string): boolean {
  try {
    const stored = localStorage.getItem(OFFLINE_AUTH_KEY);
    if (stored) {
      const authData = JSON.parse(stored);
      return authData.email === email && authData.passwordHash;
    }
  } catch (error) {
    console.error('Error checking offline login:', error);
  }
  return false;
}

// Perform offline login using cached data
export function loginOffline(email: string): OfflineUser | null {
  const user = getOfflineUser();
  if (user && user.email === email) {
    console.log('[Offline Auth] Logged in from cache');
    return user;
  }
  return null;
}

// Queue signup request for when online
export function queueSignup(signupData: Omit<QueuedSignup, 'timestamp'>) {
  try {
    const queued = getQueuedSignups();
    const newSignup: QueuedSignup = {
      ...signupData,
      timestamp: Date.now()
    };
    // Check if this email is already queued
    const exists = queued.find(q => q.email === signupData.email);
    if (!exists) {
      queued.push(newSignup);
      localStorage.setItem(QUEUED_SIGNUPS_KEY, JSON.stringify(queued));
      console.log('[Offline Auth] Signup queued for sync');
    }
  } catch (error) {
    console.error('Error queueing signup:', error);
  }
}

// Get queued signups
export function getQueuedSignups(): QueuedSignup[] {
  try {
    const stored = localStorage.getItem(QUEUED_SIGNUPS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error getting queued signups:', error);
  }
  return [];
}

// Clear queued signup after successful sync
export function clearQueuedSignup(email: string) {
  try {
    const queued = getQueuedSignups();
    const filtered = queued.filter(q => q.email !== email);
    localStorage.setItem(QUEUED_SIGNUPS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error clearing queued signup:', error);
  }
}

// Clear all offline auth data
export function clearOfflineAuth() {
  try {
    localStorage.removeItem(OFFLINE_AUTH_KEY);
    localStorage.removeItem(OFFLINE_USER_KEY);
    localStorage.removeItem(QUEUED_SIGNUPS_KEY);
  } catch (error) {
    console.error('Error clearing offline auth:', error);
  }
}

// Secure password hashing using Web Crypto API (available in browser and Node.js)
// This provides better security than simple hash for offline auth storage
async function secureHash(str: string): Promise<string> {
  try {
    // Use Web Crypto API for secure hashing
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error('Error in secure hash, falling back to simple hash:', error);
    // Fallback to simple hash if Web Crypto is not available
    return simpleHash(str);
  }
}

// Simple hash function (fallback only - not secure for production)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
}

// Store password hash with secure hashing
// Note: This is for offline authentication only - passwords are still stored securely in Supabase
export async function hashPassword(password: string): Promise<string> {
  const salt = 'lingua-ai-offline-salt-v2'; // Versioned salt for offline use
  return await secureHash(password + salt);
}

// Synchronous version for backward compatibility (uses simple hash)
export function hashPasswordSync(password: string): string {
  const salt = 'lingua-ai-offline-salt-v2';
  return simpleHash(password + salt);
}

