import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ============================================
// Environment Variable Configuration
// ============================================
// Load Supabase credentials from environment variables
// These should be set in .env.local or .env file
// Using fallback values for development (same as other API routes)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uaijcvhvyurbnfmkqnqt.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaWpjdmh2eXVyYm5mbWtxbnF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTU3NzksImV4cCI6MjA3NTc5MTc3OX0.FbBITvB9ITLt7L3e5BAiP4VYa0Qw7YCOx-SHHl1k8zY'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaWpjdmh2eXVyYm5mbWtxbnF0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDIxNTc3OSwiZXhwIjoyMDc1NzkxNzc5fQ.ZAMRcMEYtiF7lJjnrVzJvCqshe0QEDIopJ-P9fGDs-8'

// Validate environment variables on module load
// Note: We have fallback values, so this check is mainly for logging
const usingFallbackUrl = !process.env.NEXT_PUBLIC_SUPABASE_URL
const usingFallbackServiceKey = !process.env.SUPABASE_SERVICE_ROLE_KEY

if (usingFallbackUrl || usingFallbackServiceKey) {
  console.warn('[signup-api] ⚠️ Using fallback environment variables:', {
    usingFallbackUrl,
    usingFallbackServiceKey,
    message: 'Consider setting NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local'
  })
}

// ============================================
// Supabase Admin Client Initialization
// ============================================
// Create admin client with service role key to bypass RLS
// This allows the API to create users and profiles without RLS restrictions
let supabaseAdmin: ReturnType<typeof createClient> | null = null

if (supabaseUrl && supabaseServiceKey) {
  try {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    console.log('[signup-api] ✅ Supabase admin client initialized with URL:', supabaseUrl)
  } catch (err) {
    console.error('[signup-api] ❌ Failed to create Supabase admin client:', err)
  }
} else {
  console.error('[signup-api] ❌ Cannot create Supabase admin client - missing credentials')
}

// ============================================
// Type Definitions
// ============================================
interface SignupRequest {
  email: string
  password: string
  name?: string
  learningLanguages?: string[] | string
  nativeLanguage?: string
}

interface SignupResponse {
  success: boolean
  user?: any
  profile?: any
  settings?: any
  error?: string
  warning?: string
  code?: string
  details?: any
  debug?: any
}

// ============================================
// Helper Functions
// ============================================

/**
 * Normalize language codes to standard format
 * Converts full names (e.g., "english") to codes (e.g., "en")
 */
function normalizeLanguageCode(lang: string): string {
  const languageMap: Record<string, string> = {
    english: 'en',
    arabic: 'ar',
    dutch: 'nl',
    indonesian: 'id',
    malay: 'ms',
    thai: 'th',
    khmer: 'km'
  }
  const normalized = lang.toLowerCase().trim()
  return languageMap[normalized] || normalized
}

/**
 * Normalize learning languages array
 * Handles both array and single string inputs
 */
function normalizeLearningLanguages(input: string[] | string | undefined): string[] {
  if (!input) return ['en']
  
  if (typeof input === 'string') {
    return [normalizeLanguageCode(input)]
  }
  
  if (Array.isArray(input)) {
    return input.map(normalizeLanguageCode).filter(Boolean)
  }
  
  return ['en']
}

// ============================================
// Main Signup API Route Handler
// ============================================
export async function POST(req: Request): Promise<NextResponse<SignupResponse>> {
  const startTime = Date.now()
  
  // Wrap everything in try-catch to ensure we always return a proper response
  try {
    // ============================================
    // Step 1: Validate Environment Configuration
    // ============================================
    console.log('[signup-api] 🔍 Checking configuration...', {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      hasAdmin: !!supabaseAdmin,
      url: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'MISSING'
    })
    
    if (!supabaseUrl || !supabaseServiceKey || !supabaseAdmin) {
      // Try to reinitialize if missing (this shouldn't happen, but handle it gracefully)
      if (supabaseUrl && supabaseServiceKey && !supabaseAdmin) {
        console.log('[signup-api] ⚠️ Admin client missing, attempting to reinitialize...')
        try {
          const newAdmin = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
          })
          // Use the new admin client for this request
          const tempAdmin = newAdmin
          console.log('[signup-api] ✅ Admin client reinitialized for this request')
          // Note: We can't update module-level variable, but we can use tempAdmin
          // However, we'll still return the error to prompt a server restart
        } catch (reinitError: any) {
          console.error('[signup-api] ❌ Failed to reinitialize admin client:', reinitError)
        }
      }
      
      const errorResponse: SignupResponse = {
        success: false,
        error: 'Server configuration error: Supabase credentials not set. Please check .env file and restart the server.',
        code: 'CONFIG_ERROR',
        details: {
          hasUrl: !!supabaseUrl,
          hasServiceKey: !!supabaseServiceKey,
          hasAdmin: !!supabaseAdmin,
          message: 'Supabase admin client not initialized. Check environment variables and restart the server.'
        },
        debug: process.env.NODE_ENV === 'development' ? {
          message: 'Supabase admin client not initialized. Check environment variables.',
          envCheck: {
            NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? 'SET' : 'MISSING',
            SUPABASE_SERVICE_ROLE_KEY: supabaseServiceKey ? 'SET' : 'MISSING',
            supabaseUrl: supabaseUrl || 'MISSING',
            serviceKeyLength: supabaseServiceKey?.length || 0
          }
        } : undefined
      }
      
      console.error('[signup-api] ❌ Configuration error:', errorResponse.details)
      return NextResponse.json(errorResponse, { status: 500 })
    }

    // ============================================
    // Step 2: Parse and Validate Request Body
    // ============================================
    let requestData: SignupRequest
    try {
      requestData = await req.json()
    } catch (jsonError: any) {
      const errorResponse: SignupResponse = {
        success: false,
        error: 'Invalid request data. Please check your input and try again.',
        code: 'INVALID_REQUEST',
        details: {
          message: jsonError?.message || 'Failed to parse JSON',
          error: String(jsonError)
        }
      }
      
      console.error('[signup-api] ❌ JSON parse error:', jsonError)
      return NextResponse.json(errorResponse, { status: 400 })
    }

    // Extract and validate required fields
    const { email, password, name, learningLanguages, nativeLanguage } = requestData

    if (!email || !password) {
      const errorResponse: SignupResponse = {
        success: false,
        error: 'Email and password are required.',
        code: 'MISSING_FIELDS',
        details: {
          hasEmail: !!email,
          hasPassword: !!password
        }
      }
      return NextResponse.json(errorResponse, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      const errorResponse: SignupResponse = {
        success: false,
        error: 'Please enter a valid email address.',
        code: 'INVALID_EMAIL'
      }
      return NextResponse.json(errorResponse, { status: 400 })
    }

    // Validate password length
    if (password.length < 6) {
      const errorResponse: SignupResponse = {
        success: false,
        error: 'Password must be at least 6 characters long.',
        code: 'WEAK_PASSWORD'
      }
      return NextResponse.json(errorResponse, { status: 400 })
    }

    // ============================================
    // Step 3: Normalize Language Data
    // ============================================
    const normalizedLearning = normalizeLearningLanguages(learningLanguages)
    const normalizedNative = nativeLanguage ? normalizeLanguageCode(nativeLanguage) : 'en'
    const userName = name || email.split('@')[0] || 'User'

    console.log('[signup-api] Creating user:', {
      email,
      name: userName,
      learningLanguages: normalizedLearning,
      nativeLanguage: normalizedNative
    })

    // ============================================
    // Step 4: Create User via Supabase Admin API
    // ============================================
    // Use admin API to create user and bypass any triggers/RLS
    let userData, userError
    try {
      const createUserResult = await supabaseAdmin.auth.admin.createUser({
        email: email.trim().toLowerCase(),
        password: password,
        email_confirm: true, // Auto-confirm email (no email verification required)
        user_metadata: {
          name: userName,
          full_name: userName,
          learning_languages: normalizedLearning,
          learning_language: normalizedLearning[0] || 'en',
          native_language: normalizedNative
        }
      })
      
      // Verify email is confirmed
      if (createUserResult.data?.user) {
        console.log('[signup-api] User created - email_confirmed_at:', createUserResult.data.user.email_confirmed_at)
        if (!createUserResult.data.user.email_confirmed_at) {
          console.warn('[signup-api] ⚠️ User created but email not confirmed. This may cause login issues.')
        }
      }
      
      userData = createUserResult.data
      userError = createUserResult.error
    } catch (createError: any) {
      // Handle exceptions during user creation
      console.error('[signup-api] ❌ Exception during createUser:', {
        message: createError?.message,
        name: createError?.name,
        stack: createError?.stack
      })
      
      // Check for JSON parse errors (indicates Supabase returned HTML/error page)
      if (createError?.message?.includes('JSON') || createError?.message?.includes('Unexpected token')) {
        const errorResponse: SignupResponse = {
          success: false,
          error: 'Invalid Supabase configuration. Please check your Supabase URL and service role key in .env file.',
          code: 'INVALID_SUPABASE_CONFIG',
          details: 'The Supabase client received an invalid response. This usually means the URL or API key is incorrect.',
          debug: process.env.NODE_ENV === 'development' ? {
            message: createError?.message,
            hint: 'Verify your NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env file match your Supabase project settings.'
          } : undefined
        }
        return NextResponse.json(errorResponse, { status: 500 })
      }
      
      const errorResponse: SignupResponse = {
        success: false,
        error: 'Failed to create user account. Please try again.',
        code: 'USER_CREATION_EXCEPTION',
        details: createError?.message || 'Unknown error during user creation',
        debug: process.env.NODE_ENV === 'development' ? {
          error: String(createError),
          stack: createError?.stack
        } : undefined
      }
      return NextResponse.json(errorResponse, { status: 500 })
    }

    // Handle Supabase auth errors
    if (userError) {
      console.error('[signup-api] ❌ Admin createUser error:', {
        message: userError.message,
        status: userError.status,
        code: userError.code,
        name: userError.name
      })
      
      // Provide user-friendly error messages
      let errorMessage = 'User creation failed'
      let errorCode = userError.code || 'UNKNOWN_ERROR'
      
      if (userError.message?.includes('already registered') || 
          userError.message?.includes('already exists') || 
          userError.message?.includes('User already registered')) {
        errorMessage = 'An account with this email already exists. Please try logging in instead.'
        errorCode = 'EMAIL_EXISTS'
      } else if (userError.message?.includes('invalid email') || 
                 userError.message?.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.'
        errorCode = 'INVALID_EMAIL'
      } else if (userError.message?.includes('password') || 
                 userError.message?.includes('Password')) {
        errorMessage = 'Password does not meet requirements. Please use a stronger password (at least 6 characters).'
        errorCode = 'WEAK_PASSWORD'
      } else if (userError.message?.includes('Database error') || 
                 userError.code === 'unexpected_failure') {
        errorMessage = 'Database error: Please check Supabase Postgres logs for details. The profiles table may not exist.'
        errorCode = 'DATABASE_ERROR'
      } else if (userError.message) {
        errorMessage = userError.message
      }
      
      const errorResponse: SignupResponse = {
        success: false,
        error: errorMessage,
        code: errorCode,
        details: userError.message || 'Unknown error',
        debug: process.env.NODE_ENV === 'development' ? {
          message: userError.message,
          status: userError.status,
          code: userError.code,
          name: userError.name
        } : undefined
      }
      
      return NextResponse.json(errorResponse, { status: userError.status || 500 })
    }

    // Verify user was created
    const user = userData?.user
    if (!user || !user.id) {
      const errorResponse: SignupResponse = {
        success: false,
        error: 'User was not created. Please try again.',
        code: 'USER_CREATION_FAILED',
        details: 'User object is missing or invalid'
      }
      return NextResponse.json(errorResponse, { status: 500 })
    }

    console.log('[signup-api] ✅ User created successfully:', user.id)

    // ============================================
    // Step 5: Create Profile Record
    // ============================================
    const userEmail = user.email || email
    const profileData = {
      id: user.id, // UUID from auth.users
      user_id: user.id, // Same as id (both reference auth.users)
      email: userEmail,
      name: userName,
      level: 1,
      total_xp: 0,
      streak: 0,
      native_language: normalizedNative,
      learning_language: normalizedLearning[0] || 'en',
      learning_languages: normalizedLearning
    }

    let profile, profileError
    try {
      const profileResult = await (supabaseAdmin as any)
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' })
        .select()
        .single()
      
      profile = profileResult.data
      profileError = profileResult.error
    } catch (profileException: any) {
      console.error('[signup-api] ❌ Exception during profile creation:', profileException)
      profileError = profileException
    }

    if (profileError) {
      console.warn('[signup-api] ⚠️ Profile creation failed:', profileError.message)
      
      // User is created but profile failed - return success with warning
      // This allows user to login and fix profile later
      const warningResponse: SignupResponse = {
        success: true,
        user: user,
        warning: `Profile creation failed: ${profileError.message}. You can update your profile after logging in.`,
        code: 'PROFILE_CREATION_FAILED',
        details: {
          profileError: profileError.message,
          hint: 'The user account was created successfully, but the profile could not be created. This may be due to missing database tables or RLS policies.'
        },
        debug: process.env.NODE_ENV === 'development' ? {
          profileError: profileError,
          profileData: profileData
        } : undefined
      }
      return NextResponse.json(warningResponse, { status: 200 })
    }

    console.log('[signup-api] ✅ Profile created successfully:', profile?.id)

    // ============================================
    // Step 6: Create User Settings Record
    // ============================================
    const settingsData = {
      id: user.id,
      user_id: user.id,
      // All other fields use defaults from table schema
    }

    let settings, settingsError
    try {
      const settingsResult = await (supabaseAdmin as any)
        .from('user_settings')
        .upsert(settingsData, { onConflict: 'id' })
        .select()
        .single()
      
      settings = settingsResult.data
      settingsError = settingsResult.error
    } catch (settingsException: any) {
      console.warn('[signup-api] ⚠️ Settings creation failed:', settingsException?.message)
      settingsError = settingsException
    }

    if (settingsError) {
      console.warn('[signup-api] ⚠️ User settings creation failed (non-critical):', settingsError.message)
      // Settings creation failure is non-critical - user can still use the app
    } else {
      console.log('[signup-api] ✅ User settings created successfully')
    }

    // ============================================
    // Step 7: Return Success Response
    // ============================================
    const duration = Date.now() - startTime
    const successResponse: SignupResponse = {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      },
      profile: profile,
      settings: settings,
      debug: process.env.NODE_ENV === 'development' ? {
        duration: `${duration}ms`,
        userId: user.id,
        profileCreated: !!profile,
        settingsCreated: !!settings
      } : undefined
    }

    console.log('[signup-api] ✅ Signup completed successfully in', duration, 'ms')
    return NextResponse.json(successResponse, { status: 200 })

  } catch (err: any) {
    // ============================================
    // Step 8: Handle Unexpected Errors
    // ============================================
    const duration = Date.now() - startTime
    const errorMessage = err?.message || 'Unknown error'
    const errorStack = err?.stack || 'No stack trace available'
    const errorName = err?.name || 'Error'
    
    console.error('[signup-api] ❌ Unexpected error:', {
      message: errorMessage,
      stack: errorStack,
      name: errorName,
      duration: `${duration}ms`,
      error: err
    })
    
    // Ensure we always return a valid JSON response
    let errorResponse: SignupResponse
    try {
      errorResponse = {
        success: false,
        error: errorMessage || 'An unexpected error occurred. Please try again.',
        code: 'UNEXPECTED_ERROR',
        details: {
          message: errorMessage,
          name: errorName,
          type: typeof err
        },
        debug: process.env.NODE_ENV === 'development' ? {
          error: String(err),
          stack: errorStack,
          duration: `${duration}ms`,
          fullError: err
        } : undefined
      }
    } catch (responseError: any) {
      // If we can't even create the error response, return a minimal one
      console.error('[signup-api] ❌ Failed to create error response:', responseError)
      errorResponse = {
        success: false,
        error: 'An unexpected error occurred. Please check server logs.',
        code: 'CRITICAL_ERROR',
        details: 'Failed to process error response'
      }
    }
    
    try {
      return NextResponse.json(errorResponse, { status: 500 })
    } catch (jsonError: any) {
      // Last resort: return a plain text response if JSON serialization fails
      console.error('[signup-api] ❌ Failed to serialize error response:', jsonError)
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'An unexpected error occurred. Please try again.',
          code: 'SERIALIZATION_ERROR'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
  }
}
