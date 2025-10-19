import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ufvuvkrinmkkoowngioe.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmdnV2a3Jpbm1ra29vd25naW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NDI0NjAsImV4cCI6MjA3NTExODQ2MH0.hl452FRWQmS51DQeL9AYZjfiinptZg2ewPWVjEhCaDc';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmdnV2a3Jpbm1ra29vd25naW9lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU0MjQ2MCwiZXhwIjoyMDc1MTE4NDYwfQ.LXiIwSzsrqPxpiMm0CWJBuauOXhvzZapmM9tgW0-7O0';

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
