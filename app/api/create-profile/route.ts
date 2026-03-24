import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin (server-side only)
function getAdminDb() {
  if (!getApps().length) {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!privateKey || privateKey.includes('YOUR_PRIVATE_KEY_HERE')) {
      console.warn('[FirebaseAdmin] Missing or placeholder private key. Admin SDK operations will fail.');
      throw new Error('Firebase Admin SDK not configured. Check your .env.local file.');
    }

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }
  return getFirestore(getApp());
}

export async function POST(request: NextRequest) {
  try {
    const { userId, name, email, learningLanguages, nativeLanguage } = await request.json();

    if (!userId || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('[create-profile] Creating profile for user:', userId);

    const db = getAdminDb();
    const profileData = {
      id: userId,
      name,
      email,
      learning_languages: learningLanguages || ['ar'],
      base_language: nativeLanguage || 'en',
      learning_language: learningLanguages?.[0] || 'ar',
      native_language: nativeLanguage || 'en',
      level: 1,
      total_xp: 0,
      streak: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await db.collection('profiles').doc(userId).set(profileData, { merge: true });

    console.log('[create-profile] ✅ Profile created in Firestore');
    return NextResponse.json({ success: true, data: profileData });

  } catch (error: any) {
    console.error('[create-profile] Unexpected error:', error);
    return NextResponse.json({ 
      error: error?.message || 'Internal server error',
      details: error
    }, { status: 500 });
  }
}
