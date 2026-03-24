import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin (server-side only)
function getAdminDb() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
  return getFirestore(getApp());
}

export async function POST(request: NextRequest) {
  try {
    const { userId, nativeLanguage, learningLanguage } = await request.json();

    if (!userId || !nativeLanguage || !learningLanguage) {
      return NextResponse.json({ 
        error: 'Missing required fields: userId, nativeLanguage, learningLanguage' 
      }, { status: 400 });
    }

    console.log('Updating languages for user:', userId);
    
    const db = getAdminDb();
    const profileRef = db.collection('profiles').doc(userId);
    
    await profileRef.set({
      native_language: nativeLanguage,
      learning_language: learningLanguage,
      updated_at: new Date().toISOString()
    }, { merge: true });

    const updatedSnap = await profileRef.get();
    const profilesData = updatedSnap.data();

    return NextResponse.json({ 
      success: true, 
      data: profilesData, 
      table: 'profiles',
      message: 'Languages updated successfully in profiles collection'
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
    const db = getAdminDb();
    const profileSnap = await db.collection('profiles').doc(userId).get();

    return NextResponse.json({
      success: true,
      profiles: profileSnap.exists ? profileSnap.data() : null
    });

  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') 
    }, { status: 500 });
  }
}
