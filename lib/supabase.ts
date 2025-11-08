import { createClient } from '@supabase/supabase-js'

// ✅ Supabase credentials with validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uaijcvhvyurbnfmkqnqt.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaWpjdmh2eXVyYm5mbWtxbnF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTU3NzksImV4cCI6MjA3NTc5MTc3OX0.FbBITvB9ITLt7L3e5BAiP4VYa0Qw7YCOx-SHHl1k8zY'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaWpjdmh2eXVyYm5mbWtxbnF0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDIxNTc3OSwiZXhwIjoyMDc1NzkxNzc5fQ.ZAMRcMEYtiF7lJjnrVzJvCqshe0QEDIopJ-P9fGDs-8'

// ⚠️ Validate environment variables (warn in dev, error in production)
if (typeof window === 'undefined') {
  // Server-side validation
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NODE_ENV === 'production') {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set in .env.local')
    console.error('   Please create .env.local with your Supabase credentials')
  } else if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('⚠️  NEXT_PUBLIC_SUPABASE_URL not found in .env.local - using fallback')
  }
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.NODE_ENV === 'production') {
    console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in .env.local')
  } else if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('⚠️  NEXT_PUBLIC_SUPABASE_ANON_KEY not found in .env.local - using fallback')
  }
}

// ✅ Supabase client with full auth configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // লগইন session save করে রাখবে
    autoRefreshToken: true, // session expire হলে refresh করবে
    detectSessionInUrl: true, // OAuth callback থেকে session ধরবে
    flowType: 'pkce' // Use PKCE flow for better security
  },
  global: {
    fetch: (url, options = {}) => {
      // Add better error handling for fetch requests
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
        },
      }).catch((error) => {
        // Enhance error messages for network issues
        if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
          const enhancedError = new Error(
            `Network error: Failed to connect to Supabase. This is usually a CORS issue. Please check: 1) Supabase Dashboard → Settings → API → Add "${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}" to allowed origins, 2) Verify project is not paused, 3) Check network connection.`
          );
          enhancedError.name = 'SupabaseConnectionError';
          throw enhancedError;
        }
        throw error;
      });
    },
  },
})

// ✅ Service role client for server-side operations ONLY (API routes, server components)
// ⚠️ DO NOT export this - create it in each API route that needs it
// This prevents service role key from being exposed to client-side code
// 
// Example usage in API route:
// import { createClient } from '@supabase/supabase-js';
// const supabaseAdmin = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!,
//   { auth: { autoRefreshToken: false, persistSession: false } }
// );

// ✅ Database types (same as before)
export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
  username?: string
  avatar_url?: string
  native_language: string
  learning_language: string
  level: number
  total_xp: number
  streak: number
  last_activity: string
}

export interface Language {
  id: string
  code: string
  name: string
  native_name: string
  flag_emoji: string
  is_rtl: boolean
  created_at: string
}

export interface Vocabulary {
  id: string
  language_id: string
  word: string
  translation: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  audio_url?: string
  image_url?: string
  created_at: string
}

export interface Quiz {
  id: string
  language_id: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  questions: QuizQuestion[]
  created_at: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct_answer: number
  explanation?: string
  audio_url?: string
}

export interface UserProgress {
  id: string
  user_id: string
  language_id: string
  vocabulary_id?: string
  quiz_id?: string
  lesson_id?: string
  score: number
  xp_earned: number
  completed_at: string
  time_spent: number
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  requirement: string
  xp_reward: number
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  earned_at: string
}

/**
 * Test Supabase connection by querying the profiles table
 * Use this to verify your environment variables are set correctly
 * 
 * @returns Promise<{ success: boolean; data?: any; error?: any }>
 * 
 * @example
 * // In a component or API route:
 * import { testSupabaseConnection } from '@/lib/supabase';
 * 
 * const result = await testSupabaseConnection();
 * if (result.success) {
 *   console.log('✅ Supabase connection successful');
 * } else {
 *   console.error('❌ Supabase connection failed:', result.error);
 * }
 */
export async function testSupabaseConnection() {
  try {
    // Test basic connection by querying profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (error) {
      // Check if it's just a "no rows" error (which is fine)
      if (error.code === 'PGRST116' || error.message?.includes('No rows returned')) {
        return {
          success: true,
          message: 'Connection successful (table exists, no rows found)',
          data: null
        };
      }
      
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        }
      };
    }

    return {
      success: true,
      message: 'Connection successful',
      data: data
    };
  } catch (error: any) {
    // Check for network/CORS errors
    if (error?.message?.includes('Failed to fetch') || error?.name === 'TypeError') {
      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      return {
        success: false,
        error: {
          message: `CORS Error: Failed to connect to Supabase. Please add "${currentOrigin}" to Supabase allowed origins.`,
          code: 'CORS_ERROR',
          details: error?.message,
          hint: 'Go to Supabase Dashboard → Settings → API → Add your origin to allowed origins'
        }
      };
    }
    
    return {
      success: false,
      error: {
        message: error?.message || 'Unknown error',
        error: error
      }
    };
  }
}

/**
 * Test if Supabase URL is reachable (basic connectivity test)
 * This helps diagnose CORS and network issues
 */
export async function testSupabaseReachability() {
  try {
    const url = supabaseUrl;
    const response = await fetch(`${url}/rest/v1/`, {
      method: 'HEAD',
      headers: {
        'apikey': supabaseAnonKey
      }
    });
    
    return {
      success: response.ok || response.status < 500,
      status: response.status,
      statusText: response.statusText
    };
  } catch (error: any) {
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    return {
      success: false,
      error: {
        message: error?.message || 'Network error',
        isCorsError: error?.message?.includes('Failed to fetch') || error?.name === 'TypeError',
        hint: `This is likely a CORS issue. Add "${currentOrigin}" to Supabase allowed origins.`
      }
    };
  }
}

/**
 * Utility function to safely log Supabase errors with detailed information
 * Suppresses expected errors like PGRST116 (no rows returned)
 * Always shows full error details for debugging
 */
export function logSupabaseError(operation: string, error: any, context?: any): void {
  // ✅ Check if error is an empty object - if so, skip logging entirely
  if (error && typeof error === 'object' && error !== null) {
    const errorKeys = Object.keys(error);
    const isEmptyObject = errorKeys.length === 0;
    
    // If it's an empty object, don't log anything
    if (isEmptyObject) {
      return;
    }
    
    // Check if error has any meaningful content
    const hasMessage = error.message && typeof error.message === 'string' && error.message.trim().length > 0;
    const hasCode = error.code && (typeof error.code === 'string' || typeof error.code === 'number');
    const hasDetails = error.details && typeof error.details === 'string' && error.details.trim().length > 0;
    const hasHint = error.hint && typeof error.hint === 'string' && error.hint.trim().length > 0;
    
    // If no meaningful properties, skip logging
    if (!hasMessage && !hasCode && !hasDetails && !hasHint) {
      return;
    }
  }
  
  // Always try to stringify the full error first for maximum detail
  let fullErrorString = ''
  try {
    fullErrorString = JSON.stringify(error, null, 2)
  } catch (e) {
    fullErrorString = String(error)
  }
  
  // Extract error details safely
  let errorMessage = 'Unknown error'
  let errorCode = 'NO_CODE'
  let errorDetails = null
  let errorHint = null
  
  if (error) {
    if (typeof error === 'string') {
      errorMessage = error
    } else if (error instanceof Error) {
      errorMessage = error.message || 'Error instance without message'
      errorCode = (error as any).code || 'NO_CODE'
      errorDetails = (error as any).details || null
      errorHint = (error as any).hint || null
    } else if (typeof error === 'object') {
      errorMessage = error.message || error.msg || error.error_description || 'Unknown error'
      errorCode = error.code ? String(error.code) : (error.status ? String(error.status) : 'NO_CODE')
      errorDetails = error.details || error.error || null
      errorHint = error.hint || null
      
      // If still unknown, use the stringified version
      if (errorMessage === 'Unknown error' && fullErrorString) {
        errorMessage = fullErrorString.length > 300 ? fullErrorString.substring(0, 300) + '...' : fullErrorString
      }
    }
  }
  
  // Suppress expected errors (PGRST116 - no rows returned)
  // But log them in development mode for debugging
  const expectedErrorCodes = ['PGRST116', '42P01', '42703'] // no rows, undefined table, undefined column
  const isExpectedError = expectedErrorCodes.includes(errorCode) || 
                          errorMessage.includes('No rows returned') || 
                          errorMessage.includes('no rows') ||
                          errorMessage.includes('does not exist')
  
  if (isExpectedError) {
    // Expected error - only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Supabase Info] ${operation} - Expected error (no data):`, {
        code: errorCode,
        message: errorMessage,
        hint: errorHint
      })
    }
    return
  }
  
  // Log actual errors with full details - this helps identify RLS policy issues
  console.error(`[Supabase Error] ${operation}:`, {
    message: errorMessage,
    code: errorCode,
    details: errorDetails,
    hint: errorHint,
    fullError: fullErrorString.length > 500 ? fullErrorString.substring(0, 500) + '...' : fullErrorString,
    ...(context && { context })
  })
  
  // Additional helpful message for RLS issues
  if (errorMessage.toLowerCase().includes('permission') || 
      errorMessage.toLowerCase().includes('row-level security') ||
      errorCode === '42501' || 
      errorMessage.includes('RLS')) {
    console.warn('⚠️ RLS Policy Issue Detected! Check Supabase RLS policies for this table.')
    console.warn('💡 Common fix: Enable RLS and create policy: USING (auth.uid() = user_id)')
  }
}
