import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Runtime configuration for API route
export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create admin client for server-side operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

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

    // Create notification directly using admin client
    const { data: result, error } = await supabaseAdmin
      .from('notifications')
      .insert([{
        user_id,
        title: notification.title,
        message: notification.message,
        type: notification.type
      }])
      .select()
      .single();

    if (error) {
      // If table doesn't exist, still return success for graceful degradation
      if (error.code === 'PGRST116' || error.message?.includes('relation "notifications" does not exist')) {
        console.warn('Notifications table does not exist. Please run the database migration.');
        return NextResponse.json({
          success: true,
          notification: {
            id: `temp_${Date.now()}`,
            ...notification,
            user_id,
            created_at: new Date().toISOString()
          },
          warning: 'Notifications table not found. Notification created in memory only.'
        });
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      notification: result
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

