import { NextRequest, NextResponse } from 'next/server';

// Firebase handles Google OAuth via signInWithPopup on the client side.
// This callback route is kept for compatibility but Firebase doesn't use a server-side code exchange.
// If you need to handle any post-auth redirects, do it here.
export async function GET(request: NextRequest) {
  const { origin } = new URL(request.url);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin;

  // Firebase Google sign-in is handled client-side via signInWithPopup.
  // This route should not be reached in normal flow.
  // Redirect to dashboard as a safe fallback.
  return NextResponse.redirect(`${baseUrl}/dashboard`);
}
