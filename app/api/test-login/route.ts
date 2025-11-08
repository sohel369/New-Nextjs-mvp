import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Test login endpoint to diagnose issues
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email and password required',
        code: 'MISSING_CREDENTIALS'
      }, { status: 400 });
    }

    // Get Supabase credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ 
        error: 'Supabase not configured',
        code: 'CONFIG_ERROR',
        details: {
          hasUrl: !!supabaseUrl,
          hasAnonKey: !!supabaseAnonKey
        }
      }, { status: 500 });
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Test connection first
    try {
      const { data: healthCheck, error: healthError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (healthError && healthError.code !== 'PGRST116') {
        return NextResponse.json({
          error: 'Database connection failed',
          code: 'DB_CONNECTION_ERROR',
          details: healthError.message,
          hint: 'Check if profiles table exists and RLS policies are correct'
        }, { status: 500 });
      }
    } catch (dbError: any) {
      return NextResponse.json({
        error: 'Database connection test failed',
        code: 'DB_TEST_ERROR',
        details: dbError.message
      }, { status: 500 });
    }

    // Try login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({
        error: error.message,
        code: error.status?.toString() || 'AUTH_ERROR',
        details: {
          status: error.status,
          name: error.name,
          message: error.message
        }
      }, { status: error.status || 401 });
    }

    if (!data.user) {
      return NextResponse.json({
        error: 'Login failed - no user returned',
        code: 'NO_USER'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        hasSession: !!data.session
      },
      config: {
        supabaseUrl: supabaseUrl.substring(0, 30) + '...',
        hasAnonKey: !!supabaseAnonKey
      }
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({
      error: err.message || 'Unknown error',
      code: 'UNEXPECTED_ERROR',
      details: String(err)
    }, { status: 500 });
  }
}


