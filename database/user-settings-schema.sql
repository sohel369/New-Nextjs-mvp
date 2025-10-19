-- User Settings Database Schema
-- This schema stores user preferences and settings

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Theme Settings
    theme VARCHAR(20) DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
    
    -- Font Settings
    font_size VARCHAR(10) DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large', 'xl')),
    font_family VARCHAR(50) DEFAULT 'system',
    
    -- Notification Settings
    notifications_enabled BOOLEAN DEFAULT true,
    learning_reminders BOOLEAN DEFAULT true,
    achievement_notifications BOOLEAN DEFAULT true,
    live_session_alerts BOOLEAN DEFAULT false,
    security_alerts BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    
    -- Sound Settings
    sound_enabled BOOLEAN DEFAULT true,
    sound_effects BOOLEAN DEFAULT true,
    background_music BOOLEAN DEFAULT false,
    voice_guidance BOOLEAN DEFAULT true,
    sound_volume INTEGER DEFAULT 70 CHECK (sound_volume >= 0 AND sound_volume <= 100),
    
    -- Accessibility Settings
    high_contrast BOOLEAN DEFAULT false,
    reduced_motion BOOLEAN DEFAULT false,
    screen_reader BOOLEAN DEFAULT false,
    keyboard_navigation BOOLEAN DEFAULT true,
    
    -- Learning Preferences
    daily_goal_minutes INTEGER DEFAULT 15,
    reminder_time TIME DEFAULT '09:00:00',
    preferred_difficulty VARCHAR(20) DEFAULT 'adaptive' CHECK (preferred_difficulty IN ('easy', 'medium', 'hard', 'adaptive')),
    auto_advance BOOLEAN DEFAULT true,
    
    -- Privacy Settings
    profile_visibility VARCHAR(20) DEFAULT 'friends' CHECK (profile_visibility IN ('public', 'friends', 'private')),
    show_progress BOOLEAN DEFAULT true,
    show_achievements BOOLEAN DEFAULT true,
    show_streak BOOLEAN DEFAULT true,
    
    -- Language Settings
    interface_language VARCHAR(10) DEFAULT 'en',
    learning_language VARCHAR(10) DEFAULT 'ar',
    native_language VARCHAR(10) DEFAULT 'en',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one settings record per user
    UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_theme ON user_settings(theme);
CREATE INDEX IF NOT EXISTS idx_user_settings_notifications ON user_settings(notifications_enabled);

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to get or create user settings
CREATE OR REPLACE FUNCTION get_user_settings(target_user_id UUID)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    theme VARCHAR,
    font_size VARCHAR,
    font_family VARCHAR,
    notifications_enabled BOOLEAN,
    learning_reminders BOOLEAN,
    achievement_notifications BOOLEAN,
    live_session_alerts BOOLEAN,
    security_alerts BOOLEAN,
    email_notifications BOOLEAN,
    push_notifications BOOLEAN,
    sound_enabled BOOLEAN,
    sound_effects BOOLEAN,
    background_music BOOLEAN,
    voice_guidance BOOLEAN,
    sound_volume INTEGER,
    high_contrast BOOLEAN,
    reduced_motion BOOLEAN,
    screen_reader BOOLEAN,
    keyboard_navigation BOOLEAN,
    daily_goal_minutes INTEGER,
    reminder_time TIME,
    preferred_difficulty VARCHAR,
    auto_advance BOOLEAN,
    profile_visibility VARCHAR,
    show_progress BOOLEAN,
    show_achievements BOOLEAN,
    show_streak BOOLEAN,
    interface_language VARCHAR,
    learning_language VARCHAR,
    native_language VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    -- Try to get existing settings
    RETURN QUERY
    SELECT 
        us.id,
        us.user_id,
        us.theme,
        us.font_size,
        us.font_family,
        us.notifications_enabled,
        us.learning_reminders,
        us.achievement_notifications,
        us.live_session_alerts,
        us.security_alerts,
        us.email_notifications,
        us.push_notifications,
        us.sound_enabled,
        us.sound_effects,
        us.background_music,
        us.voice_guidance,
        us.sound_volume,
        us.high_contrast,
        us.reduced_motion,
        us.screen_reader,
        us.keyboard_navigation,
        us.daily_goal_minutes,
        us.reminder_time,
        us.preferred_difficulty,
        us.auto_advance,
        us.profile_visibility,
        us.show_progress,
        us.show_achievements,
        us.show_streak,
        us.interface_language,
        us.learning_language,
        us.native_language,
        us.created_at,
        us.updated_at
    FROM user_settings us
    WHERE us.user_id = target_user_id;
    
    -- If no settings found, create default settings
    IF NOT FOUND THEN
        INSERT INTO user_settings (user_id) VALUES (target_user_id);
        
        -- Return the newly created settings
        RETURN QUERY
        SELECT 
            us.id,
            us.user_id,
            us.theme,
            us.font_size,
            us.font_family,
            us.notifications_enabled,
            us.learning_reminders,
            us.achievement_notifications,
            us.live_session_alerts,
            us.security_alerts,
            us.email_notifications,
            us.push_notifications,
            us.sound_enabled,
            us.sound_effects,
            us.background_music,
            us.voice_guidance,
            us.sound_volume,
            us.high_contrast,
            us.reduced_motion,
            us.screen_reader,
            us.keyboard_navigation,
            us.daily_goal_minutes,
            us.reminder_time,
            us.preferred_difficulty,
            us.auto_advance,
            us.profile_visibility,
            us.show_progress,
            us.show_achievements,
            us.show_streak,
            us.interface_language,
            us.learning_language,
            us.native_language,
            us.created_at,
            us.updated_at
        FROM user_settings us
        WHERE us.user_id = target_user_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to update user settings
CREATE OR REPLACE FUNCTION update_user_settings(
    target_user_id UUID,
    new_theme VARCHAR DEFAULT NULL,
    new_font_size VARCHAR DEFAULT NULL,
    new_font_family VARCHAR DEFAULT NULL,
    new_notifications_enabled BOOLEAN DEFAULT NULL,
    new_learning_reminders BOOLEAN DEFAULT NULL,
    new_achievement_notifications BOOLEAN DEFAULT NULL,
    new_live_session_alerts BOOLEAN DEFAULT NULL,
    new_security_alerts BOOLEAN DEFAULT NULL,
    new_email_notifications BOOLEAN DEFAULT NULL,
    new_push_notifications BOOLEAN DEFAULT NULL,
    new_sound_enabled BOOLEAN DEFAULT NULL,
    new_sound_effects BOOLEAN DEFAULT NULL,
    new_background_music BOOLEAN DEFAULT NULL,
    new_voice_guidance BOOLEAN DEFAULT NULL,
    new_sound_volume INTEGER DEFAULT NULL,
    new_high_contrast BOOLEAN DEFAULT NULL,
    new_reduced_motion BOOLEAN DEFAULT NULL,
    new_screen_reader BOOLEAN DEFAULT NULL,
    new_keyboard_navigation BOOLEAN DEFAULT NULL,
    new_daily_goal_minutes INTEGER DEFAULT NULL,
    new_reminder_time TIME DEFAULT NULL,
    new_preferred_difficulty VARCHAR DEFAULT NULL,
    new_auto_advance BOOLEAN DEFAULT NULL,
    new_profile_visibility VARCHAR DEFAULT NULL,
    new_show_progress BOOLEAN DEFAULT NULL,
    new_show_achievements BOOLEAN DEFAULT NULL,
    new_show_streak BOOLEAN DEFAULT NULL,
    new_interface_language VARCHAR DEFAULT NULL,
    new_learning_language VARCHAR DEFAULT NULL,
    new_native_language VARCHAR DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    theme VARCHAR,
    font_size VARCHAR,
    font_family VARCHAR,
    notifications_enabled BOOLEAN,
    learning_reminders BOOLEAN,
    achievement_notifications BOOLEAN,
    live_session_alerts BOOLEAN,
    security_alerts BOOLEAN,
    email_notifications BOOLEAN,
    push_notifications BOOLEAN,
    sound_enabled BOOLEAN,
    sound_effects BOOLEAN,
    background_music BOOLEAN,
    voice_guidance BOOLEAN,
    sound_volume INTEGER,
    high_contrast BOOLEAN,
    reduced_motion BOOLEAN,
    screen_reader BOOLEAN,
    keyboard_navigation BOOLEAN,
    daily_goal_minutes INTEGER,
    reminder_time TIME,
    preferred_difficulty VARCHAR,
    auto_advance BOOLEAN,
    profile_visibility VARCHAR,
    show_progress BOOLEAN,
    show_achievements BOOLEAN,
    show_streak BOOLEAN,
    interface_language VARCHAR,
    learning_language VARCHAR,
    native_language VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    -- Update settings with provided values
    UPDATE user_settings SET
        theme = COALESCE(new_theme, theme),
        font_size = COALESCE(new_font_size, font_size),
        font_family = COALESCE(new_font_family, font_family),
        notifications_enabled = COALESCE(new_notifications_enabled, notifications_enabled),
        learning_reminders = COALESCE(new_learning_reminders, learning_reminders),
        achievement_notifications = COALESCE(new_achievement_notifications, achievement_notifications),
        live_session_alerts = COALESCE(new_live_session_alerts, live_session_alerts),
        security_alerts = COALESCE(new_security_alerts, security_alerts),
        email_notifications = COALESCE(new_email_notifications, email_notifications),
        push_notifications = COALESCE(new_push_notifications, push_notifications),
        sound_enabled = COALESCE(new_sound_enabled, sound_enabled),
        sound_effects = COALESCE(new_sound_effects, sound_effects),
        background_music = COALESCE(new_background_music, background_music),
        voice_guidance = COALESCE(new_voice_guidance, voice_guidance),
        sound_volume = COALESCE(new_sound_volume, sound_volume),
        high_contrast = COALESCE(new_high_contrast, high_contrast),
        reduced_motion = COALESCE(new_reduced_motion, reduced_motion),
        screen_reader = COALESCE(new_screen_reader, screen_reader),
        keyboard_navigation = COALESCE(new_keyboard_navigation, keyboard_navigation),
        daily_goal_minutes = COALESCE(new_daily_goal_minutes, daily_goal_minutes),
        reminder_time = COALESCE(new_reminder_time, reminder_time),
        preferred_difficulty = COALESCE(new_preferred_difficulty, preferred_difficulty),
        auto_advance = COALESCE(new_auto_advance, auto_advance),
        profile_visibility = COALESCE(new_profile_visibility, profile_visibility),
        show_progress = COALESCE(new_show_progress, show_progress),
        show_achievements = COALESCE(new_show_achievements, show_achievements),
        show_streak = COALESCE(new_show_streak, show_streak),
        interface_language = COALESCE(new_interface_language, interface_language),
        learning_language = COALESCE(new_learning_language, learning_language),
        native_language = COALESCE(new_native_language, native_language),
        updated_at = NOW()
    WHERE user_id = target_user_id;
    
    -- Return updated settings
    RETURN QUERY
    SELECT 
        us.id,
        us.user_id,
        us.theme,
        us.font_size,
        us.font_family,
        us.notifications_enabled,
        us.learning_reminders,
        us.achievement_notifications,
        us.live_session_alerts,
        us.security_alerts,
        us.email_notifications,
        us.push_notifications,
        us.sound_enabled,
        us.sound_effects,
        us.background_music,
        us.voice_guidance,
        us.sound_volume,
        us.high_contrast,
        us.reduced_motion,
        us.screen_reader,
        us.keyboard_navigation,
        us.daily_goal_minutes,
        us.reminder_time,
        us.preferred_difficulty,
        us.auto_advance,
        us.profile_visibility,
        us.show_progress,
        us.show_achievements,
        us.show_streak,
        us.interface_language,
        us.learning_language,
        us.native_language,
        us.created_at,
        us.updated_at
    FROM user_settings us
    WHERE us.user_id = target_user_id;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON user_settings TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_settings(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_settings(UUID, VARCHAR, VARCHAR, VARCHAR, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, INTEGER, BOOLEAN, BOOLEAN, BOOLEAN, BOOLEAN, INTEGER, TIME, VARCHAR, BOOLEAN, VARCHAR, BOOLEAN, BOOLEAN, BOOLEAN, VARCHAR, VARCHAR, VARCHAR) TO authenticated;
