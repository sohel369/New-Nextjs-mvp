// Application Configuration
export const config = {
  // Supabase Configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uaijcvhvyurbnfmkqnqt.supabase.co',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaWpjdmh2eXVyYm5mbWtxbnF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTU3NzksImV4cCI6MjA3NTc5MTc3OX0.FbBITvB9ITLt7L3e5BAiP4VYa0Qw7YCOx-SHHl1k8zY',
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaWpjdmh2eXVyYm5mbWtxbnF0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDIxNTc3OSwiZXhwIjoyMDc1NzkxNzc5fQ.ZAMRcMEYtiF7lJjnrVzJvCqshe0QEDIopJ-P9fGDs-8'
  },
  
  // Firebase Configuration
  firebase: {
    uri: 'https://myreactmvp.firebaseapp.com'
  },
  
  // OAuth Configuration
  oauth: {
    redirectTo: process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URL || '/auth/callback',
    allowedOrigins: [
      'http://localhost:3000',
      'https://myreactmvp.firebaseapp.com',
      'https://uaijcvhvyurbnfmkqnqt.supabase.co'
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

