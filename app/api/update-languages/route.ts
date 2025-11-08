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
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { userId, nativeLanguage, learningLanguage } = await request.json();

    if (!userId || !nativeLanguage || !learningLanguage) {
      return NextResponse.json({ 
        error: 'Missing required fields: userId, nativeLanguage, learningLanguage' 
      }, { status: 400 });
    }

    console.log('Updating languages for user:', userId);
    console.log('Native Language:', nativeLanguage);
    console.log('Learning Language:', learningLanguage);

    // Use public.profiles table (correct approach)
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        native_language: nativeLanguage,
        learning_language: learningLanguage
      })
      .select()
      .single();

    if (profilesError) {
      return NextResponse.json({ 
        error: `Failed to update languages in profiles table: ${profilesError.message}` 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: profilesData, 
      table: 'profiles',
      message: 'Languages updated successfully in public.profiles table'
    });

  } catch (error) {
    console.error('Error updating languages:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') 
    }, { status: 500 });
  }
}

// GET method for testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json({ error: 'userId parameter is required' }, { status: 400 });
  }

  try {
    // Try to get user data from both tables
    const [profilesResult, usersResult] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('users').select('*').eq('id', userId).single()
    ]);

    return NextResponse.json({
      success: true,
      profiles: profilesResult.data,
      users: usersResult.data,
      profilesError: profilesResult.error?.message,
      usersError: usersResult.error?.message
    });

  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') 
    }, { status: 500 });
  }
}
