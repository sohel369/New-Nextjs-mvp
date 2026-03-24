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

// Helper function to determine user tier
function getTier(xp: number): string {
  if (xp >= 5000) return 'Master';
  if (xp >= 3000) return 'Expert';
  if (xp >= 1500) return 'Advanced';
  if (xp >= 500) return 'Intermediate';
  return 'Beginner';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type') || 'all';
    const userId = searchParams.get('userId');

    const db = getAdminDb();

    // Query profiles ordered by XP for leaderboard
    let profilesQuery = db.collection('profiles').orderBy('total_xp', 'desc').limit(limit);

    // Apply time filter for weekly/monthly
    if (type === 'weekly') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      profilesQuery = db.collection('profiles')
        .where('last_activity', '>=', weekAgo)
        .orderBy('last_activity', 'desc')
        .orderBy('total_xp', 'desc')
        .limit(limit) as any;
    } else if (type === 'monthly') {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      profilesQuery = db.collection('profiles')
        .where('last_activity', '>=', monthAgo)
        .orderBy('last_activity', 'desc')
        .orderBy('total_xp', 'desc')
        .limit(limit) as any;
    }

    const snapshot = await profilesQuery.get();
    const leaderboardData = snapshot.docs.map((doc, index) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'User',
        email: data.email,
        total_xp: data.total_xp || 0,
        streak: data.streak || 0,
        level: data.level || 1,
        avatar_url: data.avatar_url,
        last_activity: data.last_activity || data.updated_at,
        rank: index + 1,
        tier: getTier(data.total_xp || 0)
      };
    });

    // Get user's rank if userId provided
    let userRank = null;
    if (userId) {
      const allProfilesSnap = await db.collection('profiles').orderBy('total_xp', 'desc').get();
      const rankIndex = allProfilesSnap.docs.findIndex(d => d.id === userId);
      if (rankIndex !== -1) {
        const userDoc = allProfilesSnap.docs[rankIndex];
        const userData = userDoc.data();
        userRank = {
          rank: rankIndex + 1,
          total_xp: userData.total_xp || 0,
          tier: getTier(userData.total_xp || 0)
        };
      }
    }

    // Build basic stats
    const stats = {
      total_users: leaderboardData.length,
      top_xp: leaderboardData[0]?.total_xp || 0,
      best_streak: leaderboardData.reduce((max, u) => Math.max(max, u.streak), 0)
    };

    return NextResponse.json({
      success: true,
      data: {
        leaderboard: leaderboardData,
        userRank,
        stats,
        type,
        limit,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch leaderboard data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST endpoint to update user XP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, xpGained, activityType = 'lesson' } = body;

    if (!userId || !xpGained) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId and xpGained' },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    const profileRef = db.collection('profiles').doc(userId);
    const profileSnap = await profileRef.get();

    if (!profileSnap.exists) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const current = profileSnap.data()!;
    const newXP = (current.total_xp || 0) + xpGained;
    const newLevel = Math.floor(newXP / 1000) + 1;

    await profileRef.update({
      total_xp: newXP,
      level: newLevel,
      last_activity: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      data: { userId, xp_gained: xpGained, new_xp: newXP, new_level: newLevel },
      message: 'XP updated successfully'
    });

  } catch (error) {
    console.error('Update XP error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update XP',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
