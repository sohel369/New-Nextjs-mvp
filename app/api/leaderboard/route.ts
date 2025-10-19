import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ufvuvkrinmkkoowngioe.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmdnV2a3Jpbm1ra29vd25naW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NDI0NjAsImV4cCI6MjA3NTExODQ2MH0.hl452FRWQmS51DQeL9AYZjfiinptZg2ewPWVjEhCaDc';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmdnV2a3Jpbm1ra29vd25naW9lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU0MjQ2MCwiZXhwIjoyMDc1MTE4NDYwfQ.LXiIwSzsrqPxpiMm0CWJBuauOXhvzZapmM9tgW0-7O0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type') || 'all'; // 'all', 'weekly', 'monthly'
    const userId = searchParams.get('userId');

    let leaderboardData;
    let userRank = null;
    let stats = null;

    // Get leaderboard data based on type
    switch (type) {
      case 'weekly':
        const { data: weeklyData, error: weeklyError } = await supabase
          .rpc('get_weekly_leaderboard', { limit_count: limit });
        
        if (weeklyError) throw weeklyError;
        leaderboardData = weeklyData;
        break;

      case 'monthly':
        // For monthly, we can use the same as all but with a date filter
        const { data: monthlyData, error: monthlyError } = await supabase
          .from('profiles')
          .select('id, name, email, total_xp, streak, level, avatar_url, last_activity, created_at')
          .gte('last_activity', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .order('total_xp', { ascending: false })
          .limit(limit);
        
        if (monthlyError) throw monthlyError;
        leaderboardData = monthlyData?.map((user, index) => ({
          ...user,
          rank: index + 1,
          tier: getTier(user.total_xp)
        })) || [];
        break;

      default: // 'all'
        const { data: allData, error: allError } = await supabase
          .rpc('get_leaderboard', { limit_count: limit });
        
        if (allError) throw allError;
        leaderboardData = allData;
        break;
    }

    // Get user's rank if userId is provided
    if (userId) {
      const { data: rankData, error: rankError } = await supabase
        .rpc('get_user_rank', { user_id: userId });
      
      if (!rankError && rankData && rankData.length > 0) {
        userRank = rankData[0];
      }
    }

    // Get leaderboard statistics
    const { data: statsData, error: statsError } = await supabase
      .rpc('get_leaderboard_stats');
    
    if (!statsError && statsData && statsData.length > 0) {
      stats = statsData[0];
    }

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

// Helper function to determine user tier
function getTier(xp: number): string {
  if (xp >= 5000) return 'Master';
  if (xp >= 3000) return 'Expert';
  if (xp >= 1500) return 'Advanced';
  if (xp >= 500) return 'Intermediate';
  return 'Beginner';
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

    const { data, error } = await supabase
      .rpc('update_user_xp', {
        user_id: userId,
        xp_gained: xpGained,
        activity_type: activityType
      });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data[0],
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
