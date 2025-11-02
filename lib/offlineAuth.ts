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
  learning_language?: string;
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
export function storeOfflineAuth(email: string, passwordHash: string) {
  try {
    const authData = {
      email,
      passwordHash, // Note: This should be a hash, not plain password
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

// Simple hash function (for offline use only - not secure for production)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
}

// Store password hash (simplified - in production use proper hashing)
export function hashPassword(password: string): string {
  return simpleHash(password + 'lingua-ai-salt'); // Simple hash with salt
}

