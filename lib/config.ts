// Application Configuration
export const config = {
  // Supabase Configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ufvuvkrinmkkoowngioe.supabase.co',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmdnV2a3Jpbm1ra29vd25naW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NDI0NjAsImV4cCI6MjA3NTExODQ2MH0.hl452FRWQmS51DQeL9AYZjfiinptZg2ewPWVjEhCaDc',
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmdnV2a3Jpbm1ra29vd25naW9lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU0MjQ2MCwiZXhwIjoyMDc1MTE4NDYwfQ.LXiIwSzsrqPxpiMm0CWJBuauOXhvzZapmM9tgW0-7O0'
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
      'https://ufvuvkrinmkkoowngioe.supabase.co'
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
  // Use environment variable for production, fallback to localhost for development
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  return `${baseUrl}${path}`;
};

// Helper function to check if origin is allowed
export const isAllowedOrigin = (origin: string) => {
  return config.oauth.allowedOrigins.includes(origin);
};

