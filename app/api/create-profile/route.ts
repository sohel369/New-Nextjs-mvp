import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uaijcvhvyurbnfmkqnqt.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaWpjdmh2eXVyYm5mbWtxbnF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTU3NzksImV4cCI6MjA3NTc5MTc3OX0.FbBITvB9ITLt7L3e5BAiP4VYa0Qw7YCOx-SHHl1k8zY';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaWpjdmh2eXVyYm5mbWtxbnF0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDIxNTc3OSwiZXhwIjoyMDc1NzkxNzc5fQ.ZAMRcMEYtiF7lJjnrVzJvCqshe0QEDIopJ-P9fGDs-8';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
// Admin client with proper configuration to bypass RLS
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function POST(request: NextRequest) {
  try {
    const { userId, name, email, learningLanguages, nativeLanguage } = await request.json();

    if (!userId || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Use admin client (service role) to bypass RLS
    // This ensures profile creation always works regardless of RLS policies
    console.log('[create-profile] Creating profile for user:', userId);
    
    // Try to create profile in profiles table first (using admin client)
    const { data: profilesData, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .insert([
        {
          id: userId,
          name: name,
          email: email,
          learning_languages: learningLanguages || ['ar'],
          base_language: nativeLanguage || 'en',
          level: 1,
          total_xp: 0,
          streak: 0
        }
      ])
      .select()
      .single();

    if (profilesError) {
      console.log('[create-profile] Profiles table failed, trying users table:', profilesError.message);
      
      // Fallback: create profile in users table (using admin client)
      const { data: usersData, error: usersError } = await supabaseAdmin
        .from('users')
        .insert([
          {
            id: userId,
            name: name,
            email: email,
            learning_languages: learningLanguages || ['ar'],
            learning_language: learningLanguages?.[0] || 'ar',
            native_language: nativeLanguage || 'en',
            level: 1,
            total_xp: 0,
            streak: 0
          }
        ])
        .select()
        .single();

      if (usersError) {
        console.error('[create-profile] Both attempts failed:', usersError);
        return NextResponse.json({ 
          error: usersError.message || 'Failed to create profile',
          details: usersError
        }, { status: 500 });
      }

      console.log('[create-profile] ✅ Profile created in users table');
      return NextResponse.json({ success: true, data: usersData, table: 'users' });
    }

    console.log('[create-profile] ✅ Profile created in profiles table');
    return NextResponse.json({ success: true, data: profilesData, table: 'profiles' });

  } catch (error: any) {
    console.error('[create-profile] Unexpected error:', error);
    return NextResponse.json({ 
      error: error?.message || 'Internal server error',
      details: error
    }, { status: 500 });
  }
}
