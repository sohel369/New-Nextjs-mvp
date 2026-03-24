import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, event_type, metadata } = body;

    if (!user_id || !event_type) {
      return NextResponse.json(
        { error: 'user_id and event_type are required' },
        { status: 400 }
      );
    }

    // Generate dynamic notification based on event type
    let notification: {
      title: string;
      message: string;
      type: 'info' | 'success' | 'warning' | 'error';
    };

    switch (event_type) {
      case 'lesson_completed':
        notification = {
          title: '🎉 Lesson Completed!',
          message: `Great job! You completed "${metadata?.lessonName || 'a lesson'}". Keep up the excellent work!`,
          type: 'success'
        };
        break;

      case 'streak_achieved':
        const days = metadata?.days || 0;
        notification = {
          title: `🔥 ${days} Day Streak!`,
          message: `Amazing! You've maintained a ${days}-day learning streak. Consistency is key to success!`,
          type: 'success'
        };
        break;

      case 'level_up':
        notification = {
          title: '⭐ Level Up!',
          message: `Congratulations! You've reached level ${metadata?.level || 'new'}. Your progress is impressive!`,
          type: 'success'
        };
        break;

      case 'quiz_passed':
        const score = metadata?.score || 0;
        notification = {
          title: '✅ Quiz Passed!',
          message: `Excellent work! You scored ${score}% on the quiz. Your knowledge is growing!`,
          type: 'success'
        };
        break;

      case 'achievement_unlocked':
        notification = {
          title: '🏆 Achievement Unlocked!',
          message: `You've unlocked the "${metadata?.achievementName || 'achievement'}" achievement. Well done!`,
          type: 'success'
        };
        break;

      case 'xp_milestone':
        const xp = metadata?.totalXP || 0;
        notification = {
          title: '💎 XP Milestone!',
          message: `Wow! You've reached ${xp.toLocaleString()} total XP. You're becoming a language master!`,
          type: 'success'
        };
        break;

      case 'daily_reminder':
        notification = {
          title: '📚 Time to Practice!',
          message: 'Don\'t forget to practice today. Even 5 minutes helps maintain your streak!',
          type: 'info'
        };
        break;

      case 'weekly_report':
        const lessonsCompleted = metadata?.lessonsCompleted || 0;
        notification = {
          title: '📊 Weekly Report',
          message: `This week you completed ${lessonsCompleted} lesson${lessonsCompleted !== 1 ? 's' : ''}. Keep up the momentum!`,
          type: 'info'
        };
        break;

      case 'new_feature':
        notification = {
          title: '✨ New Feature Available!',
          message: metadata?.featureMessage || 'Check out the latest updates to enhance your learning experience!',
          type: 'info'
        };
        break;

      case 'friend_activity':
        notification = {
          title: '👥 Friend Activity',
          message: `${metadata?.friendName || 'A friend'} just completed a lesson. Challenge yourself to keep up!`,
          type: 'info'
        };
        break;

      case 'practice_reminder':
        notification = {
          title: '⏰ Practice Reminder',
          message: 'It\'s been a while since your last practice session. Ready to continue learning?',
          type: 'warning'
        };
        break;

      default:
        notification = {
          title: '🔔 Notification',
          message: metadata?.message || 'You have a new update!',
          type: 'info'
        };
    }

    const db = getAdminDb();
    const notificationData = {
      user_id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      read: false,
      created_at: FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('notifications').add(notificationData);

    return NextResponse.json({
      success: true,
      notification: {
        id: docRef.id,
        ...notificationData,
        created_at: new Date().toISOString() // Fallback for client
      }
    });

  } catch (error: any) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      {
        error: 'Failed to create notification',
        details: error.message
      },
      { status: 500 }
    );
  }
}

