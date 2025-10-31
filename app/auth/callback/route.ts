import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Use the centralized Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ufvuvkrinmkkoowngioe.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmdnV2a3Jpbm1ra29vd25naW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NDI0NjAsImV4cCI6MjA3NTExODQ2MH0.hl452FRWQmS51DQeL9AYZjfiinptZg2ewPWVjEhCaDc';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmdnV2a3Jpbm1ra29vd25naW9lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU0MjQ2MCwiZXhwIjoyMDc1MTE4NDYwfQ.LXiIwSzsrqPxpiMm0CWJBuauOXhvzZapmM9tgW0-7O0';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const next = searchParams.get('next') ?? '/';

  // Log the callback details for debugging
  console.log('OAuth callback details:', {
    origin,
    code: code ? 'present' : 'missing',
    error,
    errorDescription,
    next
  });

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${encodeURIComponent(error)}&description=${encodeURIComponent(errorDescription || '')}`);
  }

  // Handle missing code
  if (!code) {
    console.error('No authorization code received');
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_code&description=No authorization code received`);
  }

  try {
    console.log('Attempting to exchange code for session...');
    console.log('Code length:', code?.length);
    console.log('Supabase URL:', supabaseUrl);
    
    // Exchange code for session with better error handling
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    console.log('Exchange result:', {
      hasData: !!data,
      hasUser: !!data?.user,
      hasSession: !!data?.session,
      error: exchangeError
    });
    
    if (exchangeError) {
      console.error('Error exchanging code for session:', {
        message: exchangeError.message,
        status: exchangeError.status,
        code: exchangeError.code,
        details: exchangeError
      });
      
      // Provide more specific error messages
      let errorMessage = exchangeError.message;
      if (exchangeError.message.includes('Invalid code')) {
        errorMessage = 'The authorization code is invalid or has expired. Please try signing in again.';
      } else if (exchangeError.message.includes('server_error')) {
        errorMessage = 'Server error occurred during authentication. Please try again.';
      }
      
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=exchange_failed&description=${encodeURIComponent(errorMessage)}`);
    }

    if (!data?.user) {
      console.error('No user data received after code exchange');
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_user&description=No user data received after authentication`);
    }

    console.log('Successfully authenticated user:', {
      id: data.user.id,
      email: data.user.email,
      provider: data.user.app_metadata?.provider
    });

      // Create user profile if it doesn't exist
    try {
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single();

      if (profileCheckError && profileCheckError.code !== 'PGRST116') {
        console.error('Error checking existing profile:', profileCheckError);
      }

      if (!existingProfile) {
        console.log('Creating new user profile for:', data.user.id);
        
        // Create new user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              name: data.user.user_metadata?.full_name || 
                    data.user.user_metadata?.name || 
                    data.user.email?.split('@')[0] || 
                    "Guest",
              email: data.user.email,
              learning_languages: ['ar'], // Array of learning languages
              base_language: 'en', // Base language for interface
              level: 1,
              total_xp: 0,
              streak: 0
            }
          ]);

        if (profileError) {
          console.error('Error creating user profile in profiles table:', profileError);
          
          // Fallback: try to create profile in users table
          const { error: usersError } = await supabase
            .from('users')
            .insert([
              {
                id: data.user.id,
                name: data.user.user_metadata?.full_name || 
                      data.user.user_metadata?.name || 
                      data.user.email?.split('@')[0] || 
                      "Guest",
                email: data.user.email,
                learning_language: 'ar',
                native_language: 'en',
                level: 1,
                total_xp: 0,
                streak: 0
              }
            ]);

          if (usersError) {
            console.error('Error creating user profile in users table:', usersError);
            console.error('Error details:', {
              message: usersError.message,
              code: usersError.code,
              details: usersError.details,
            });
          } else {
            console.log('User profile created successfully in users table');
          }
        } else {
          console.log('User profile created successfully in profiles table');
        }
      } else {
        console.log('User profile already exists');
      }
    } catch (profileError) {
      console.error('Unexpected error in profile creation:', profileError);
      // Continue with authentication even if profile creation fails
    }

    // Redirect to language selection for new users, dashboard for existing users
    console.log('Redirecting after successful authentication');
    return NextResponse.redirect(`${origin}/language-selection`);

  } catch (error) {
    console.error('Unexpected error in OAuth callback:', error);
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=unexpected&description=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`);
  }
}

