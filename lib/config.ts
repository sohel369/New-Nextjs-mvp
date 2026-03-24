// Application Configuration
export const config = {
  // Placeholder for future if needed
  
  // Firebase Configuration
  firebase: {
    apiKey: "AIzaSyDNHKYbgeHsSx3fmLMNLquCD8TlZZfPzSE",
    authDomain: "car-rental-dubai-86748.firebaseapp.com",
    projectId: "car-rental-dubai-86748",
    storageBucket: "car-rental-dubai-86748.firebasestorage.app",
    messagingSenderId: "436752043263",
    appId: "1:436752043263:web:2776b12711b66681aad0ca",
    measurementId: "G-0MLN1RWTB0"
  },
  
  // OAuth Configuration
  oauth: {
    redirectTo: process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URL || '/auth/callback',
    allowedOrigins: [
      'http://localhost:3000',
      'https://car-rental-dubai-86748.firebaseapp.com'
    ],
    google: {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '1043282254579-3gdapkcdb40dvg77hiar17sjhdor303c.apps.googleusercontent.com'
    }
  },
  
  // Application URLs
  urls: {
    home: '/',
    login: '/auth/login',
    signup: '/auth/signup',
    profile: '/profile',
    callback: '/auth/callback'
  }
};

// Helper function to get redirect URL
export const getRedirectUrl = (path: string = '/auth/callback') => {
  // Use environment variable for production, fallback to origin detection
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                  process.env.NEXT_PUBLIC_SITE_URL ||
                  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  return `${baseUrl}${path}`;
};

// Helper function to check if origin is allowed
export const isAllowedOrigin = (origin: string) => {
  return config.oauth.allowedOrigins.includes(origin);
};

