-- Leaderboard Database Schema
-- This schema supports live leaderboard functionality

-- Create leaderboard view for real-time rankings
CREATE OR REPLACE VIEW leaderboard_view AS
SELECT 
    p.id,
    p.name,
    p.email,
    p.total_xp,
    p.streak,
    p.level,
    p.avatar_url,
    ROW_NUMBER() OVER (ORDER BY p.total_xp DESC, p.streak DESC, p.level DESC) as rank,
    CASE 
        WHEN p.total_xp >= 5000 THEN 'Master'
        WHEN p.total_xp >= 3000 THEN 'Expert'
        WHEN p.total_xp >= 1500 THEN 'Advanced'
        WHEN p.total_xp >= 500 THEN 'Intermediate'
        ELSE 'Beginner'
    END as tier,
    p.last_activity,
    p.created_at
FROM profiles p
WHERE p.total_xp > 0
ORDER BY p.total_xp DESC, p.streak DESC, p.level DESC;

-- Create function to get leaderboard data
CREATE OR REPLACE FUNCTION get_leaderboard(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    email VARCHAR,
    total_xp INTEGER,
    streak INTEGER,
    level INTEGER,
    avatar_url TEXT,
    rank BIGINT,
    tier TEXT,
    last_activity TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        lv.id,
        lv.name,
        lv.email,
        lv.total_xp,
        lv.streak,
        lv.level,
        lv.avatar_url,
        lv.rank,
        lv.tier,
        lv.last_activity,
        lv.created_at
    FROM leaderboard_view lv
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to get user's rank
CREATE OR REPLACE FUNCTION get_user_rank(user_id UUID)
RETURNS TABLE (
    rank BIGINT,
    total_users BIGINT,
    percentile NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    WITH user_stats AS (
        SELECT 
            lv.rank,
            COUNT(*) OVER() as total_users
        FROM leaderboard_view lv
        WHERE lv.id = user_id
    )
    SELECT 
        us.rank,
        us.total_users,
        ROUND((1.0 - (us.rank - 1.0) / us.total_users) * 100, 2) as percentile
    FROM user_stats us;
END;
$$ LANGUAGE plpgsql;

-- Create function to get leaderboard statistics
CREATE OR REPLACE FUNCTION get_leaderboard_stats()
RETURNS TABLE (
    total_users BIGINT,
    total_xp BIGINT,
    avg_xp NUMERIC,
    max_xp INTEGER,
    avg_streak NUMERIC,
    max_streak INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_users,
        SUM(p.total_xp) as total_xp,
        ROUND(AVG(p.total_xp), 2) as avg_xp,
        MAX(p.total_xp) as max_xp,
        ROUND(AVG(p.streak), 2) as avg_streak,
        MAX(p.streak) as max_streak
    FROM profiles p
    WHERE p.total_xp > 0;
END;
$$ LANGUAGE plpgsql;

-- Create function to update user XP and recalculate rankings
CREATE OR REPLACE FUNCTION update_user_xp(
    user_id UUID,
    xp_gained INTEGER,
    activity_type TEXT DEFAULT 'lesson'
)
RETURNS TABLE (
    new_total_xp INTEGER,
    new_level INTEGER,
    new_rank BIGINT
) AS $$
DECLARE
    current_xp INTEGER;
    current_level INTEGER;
    new_total INTEGER;
    new_level_calc INTEGER;
BEGIN
    -- Get current XP and level
    SELECT total_xp, level INTO current_xp, current_level
    FROM profiles 
    WHERE id = user_id;
    
    -- Calculate new total XP
    new_total := current_xp + xp_gained;
    
    -- Calculate new level (every 200 XP = 1 level)
    new_level_calc := 1 + (new_total / 200);
    
    -- Update user profile
    UPDATE profiles 
    SET 
        total_xp = new_total,
        level = new_level_calc,
        last_activity = NOW(),
        updated_at = NOW()
    WHERE id = user_id;
    
    -- Get new rank
    RETURN QUERY
    SELECT 
        new_total as new_total_xp,
        new_level_calc as new_level,
        lv.rank as new_rank
    FROM leaderboard_view lv
    WHERE lv.id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to get weekly leaderboard
CREATE OR REPLACE FUNCTION get_weekly_leaderboard(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    email VARCHAR,
    weekly_xp INTEGER,
    streak INTEGER,
    rank BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.email,
        COALESCE(up.weekly_xp, 0) as weekly_xp,
        p.streak,
        ROW_NUMBER() OVER (ORDER BY COALESCE(up.weekly_xp, 0) DESC, p.streak DESC) as rank
    FROM profiles p
    LEFT JOIN (
        SELECT 
            user_id,
            SUM(xp_earned) as weekly_xp
        FROM user_progress 
        WHERE completed_at >= NOW() - INTERVAL '7 days'
        GROUP BY user_id
    ) up ON p.id = up.user_id
    WHERE COALESCE(up.weekly_xp, 0) > 0
    ORDER BY COALESCE(up.weekly_xp, 0) DESC, p.streak DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_total_xp ON profiles(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_streak ON profiles(streak DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_level ON profiles(level DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_last_activity ON profiles(last_activity DESC);

-- Create RLS policies for leaderboard
CREATE POLICY "Anyone can view leaderboard" ON profiles FOR SELECT USING (true);

-- Grant permissions
GRANT SELECT ON leaderboard_view TO authenticated;
GRANT EXECUTE ON FUNCTION get_leaderboard(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_rank(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_leaderboard_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_xp(UUID, INTEGER, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_weekly_leaderboard(INTEGER) TO authenticated;
