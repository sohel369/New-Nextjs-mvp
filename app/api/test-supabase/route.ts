import { NextResponse } from 'next/server';
import { testSupabaseConnection } from '@/lib/supabase';

/**
 * API route to test Supabase connection
 * 
 * GET /api/test-supabase
 * 
 * This endpoint verifies that your Supabase environment variables
 * are set correctly and the connection is working.
 * 
 * Returns:
 * - 200: Connection successful
 * - 500: Connection failed
 */
export async function GET() {
  try {
    const result = await testSupabaseConnection();

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: result.message,
          data: result.data,
          timestamp: new Date().toISOString()
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          message: 'Supabase connection test failed',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error?.message || 'Unknown error occurred',
          error: error
        },
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

