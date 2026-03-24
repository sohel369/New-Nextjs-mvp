import { NextResponse } from 'next/server';

// This signup API route is no longer used.
// Firebase user creation now happens directly on the client via createUserWithEmailAndPassword.
// This stub is kept to prevent 404 errors if any old code still calls /api/signup.
export async function POST() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'This endpoint is deprecated. Firebase auth is now handled client-side.' 
    },
    { status: 410 }
  );
}
