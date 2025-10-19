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
    const { userId, name, email } = await request.json();

    if (!userId || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Try to create profile in profiles table first
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          name: name,
          email: email,
          learning_languages: ['ar'],
          base_language: 'en',
          level: 1,
          total_xp: 0,
          streak: 0
        }
      ])
      .select()
      .single();

    if (profilesError) {
      console.log('Profiles table failed, trying users table:', profilesError.message);
      
      // Fallback: create profile in users table
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .insert([
          {
            id: userId,
            name: name,
            email: email,
            learning_language: 'ar',
            native_language: 'en',
            level: 1,
            total_xp: 0,
            streak: 0
          }
        ])
        .select()
        .single();

      if (usersError) {
        return NextResponse.json({ error: usersError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, data: usersData, table: 'users' });
    }

    return NextResponse.json({ success: true, data: profilesData, table: 'profiles' });

  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
