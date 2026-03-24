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
      // Return a mock or throw a more specific error that the caller can handle
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

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  font_size: 'small' | 'medium' | 'large' | 'xl';
  font_family: string;
  notifications_enabled: boolean;
  learning_reminders: boolean;
  achievement_notifications: boolean;
  live_session_alerts: boolean;
  security_alerts: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  sound_enabled: boolean;
  sound_effects: boolean;
  background_music: boolean;
  voice_guidance: boolean;
  sound_volume: number;
  high_contrast: boolean;
  reduced_motion: boolean;
  screen_reader: boolean;
  keyboard_navigation: boolean;
  daily_goal_minutes: number;
  reminder_time: string;
  preferred_difficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  auto_advance: boolean;
  profile_visibility: 'public' | 'friends' | 'private';
  show_progress: boolean;
  show_achievements: boolean;
  show_streak: boolean;
  interface_language: string;
  learning_language: string;
  native_language: string;
  created_at: string;
  updated_at: string;
}

// Default settings for new users
const defaultSettings = {
  theme: 'dark',
  font_size: 'medium',
  font_family: 'Inter',
  notifications_enabled: true,
  learning_reminders: true,
  achievement_notifications: true,
  live_session_alerts: true,
  security_alerts: true,
  email_notifications: false,
  push_notifications: true,
  sound_enabled: true,
  sound_effects: true,
  background_music: false,
  voice_guidance: false,
  sound_volume: 80,
  high_contrast: false,
  reduced_motion: false,
  screen_reader: false,
  keyboard_navigation: false,
  daily_goal_minutes: 15,
  reminder_time: '09:00',
  preferred_difficulty: 'adaptive',
  auto_advance: true,
  profile_visibility: 'public',
  show_progress: true,
  show_achievements: true,
  show_streak: true,
  interface_language: 'en',
  learning_language: 'ar',
  native_language: 'en',
};

// GET - Fetch user settings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    const docSnap = await db.collection('user_settings').doc(userId).get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { success: false, error: 'No settings found for user' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: docSnap.id, ...docSnap.data() } as UserSettings
    });

  } catch (error) {
    console.error('Settings API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT - Update user settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, settings } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!settings) {
      return NextResponse.json(
        { success: false, error: 'Settings data is required' },
        { status: 400 }
      );
    }

    // Validate settings data
    const validSettings = validateSettings(settings);
    if (!validSettings.valid) {
      return NextResponse.json(
        { success: false, error: 'Invalid settings data', details: validSettings.errors },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    const updateData = {
      ...settings,
      updated_at: new Date().toISOString()
    };

    await db.collection('user_settings').doc(userId).set(updateData, { merge: true });
    const updatedSnap = await db.collection('user_settings').doc(userId).get();

    return NextResponse.json({
      success: true,
      data: { id: updatedSnap.id, ...updatedSnap.data() } as UserSettings,
      message: 'Settings updated successfully'
    });

  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Create default settings for new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    const docRef = db.collection('user_settings').doc(userId);
    const existing = await docRef.get();

    if (existing.exists) {
      return NextResponse.json(
        { success: false, error: 'Settings already exist for this user' },
        { status: 409 }
      );
    }

    const newSettings = {
      ...defaultSettings,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await docRef.set(newSettings);

    return NextResponse.json({
      success: true,
      data: { id: userId, ...newSettings } as UserSettings,
      message: 'Default settings created successfully'
    });

  } catch (error) {
    console.error('Settings creation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to validate settings
function validateSettings(settings: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (settings.theme && !['light', 'dark', 'system'].includes(settings.theme)) {
    errors.push('Invalid theme value');
  }

  if (settings.font_size && !['small', 'medium', 'large', 'xl'].includes(settings.font_size)) {
    errors.push('Invalid font size value');
  }

  if (settings.sound_volume !== undefined && (settings.sound_volume < 0 || settings.sound_volume > 100)) {
    errors.push('Sound volume must be between 0 and 100');
  }

  if (settings.daily_goal_minutes !== undefined && (settings.daily_goal_minutes < 1 || settings.daily_goal_minutes > 480)) {
    errors.push('Daily goal minutes must be between 1 and 480');
  }

  if (settings.preferred_difficulty && !['easy', 'medium', 'hard', 'adaptive'].includes(settings.preferred_difficulty)) {
    errors.push('Invalid preferred difficulty value');
  }

  if (settings.profile_visibility && !['public', 'friends', 'private'].includes(settings.profile_visibility)) {
    errors.push('Invalid profile visibility value');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
