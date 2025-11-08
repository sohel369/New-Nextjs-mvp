# 🔧 Supabase RLS Policies & Default Data Setup

This guide will help you fix Row Level Security (RLS) policies and set up automatic default data creation for new users in your Supabase project.

## 📋 Prerequisites

1. Access to your Supabase project dashboard
2. Admin/Superuser access to run SQL scripts
3. Your project should have the following tables:
   - `profiles` or `users` (user profile data)
   - `user_settings` (user preferences)
   - `quiz_history` (quiz completion records)
   - `quiz_stats` (optional, quiz statistics)
   - `leaderboard` (can be a table or view)

## 🚀 Quick Setup

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run the Setup Script

1. Open the file: `database/fix-auth-rls-and-defaults.sql`
2. Copy the entire contents
3. Paste into the SQL Editor
4. Click **Run** or press `Ctrl+Enter`

### Step 3: Verify Setup

Run these queries in SQL Editor to verify everything worked:

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'users', 'user_settings', 'quiz_history', 'quiz_stats', 'leaderboard');

-- Check policies exist
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'users', 'user_settings', 'quiz_history', 'quiz_stats', 'leaderboard');

-- Check trigger exists
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_name = 'create_user_defaults';
```

## 📝 What This Script Does

### 1. Enables Row Level Security (RLS)
- Enables RLS on all user-related tables
- Prevents users from accessing other users' data

### 2. Creates RLS Policies
- **profiles/users**: Users can only access/modify their own data
- **user_settings**: Users can only access/modify their own settings
- **quiz_history**: Users can only see their own quiz history
- **quiz_stats**: Users can only see their own stats
- **leaderboard**: Public read access (everyone can view)

### 3. Auto-Creates Default Data
- When a new user signs up, the trigger automatically:
  - Creates a default `user_settings` row
  - Creates a default `quiz_stats` row (if table exists)
  - Creates a `profiles` entry (if table exists)

## 🔍 Manual Setup for Existing Users

If you have existing users without default data, run this (replace `YOUR_USER_UUID`):

```sql
-- Find your user UUID first
SELECT id, email FROM auth.users;

-- Insert default settings
INSERT INTO user_settings (user_id, base_language, learning_languages, dark_mode, notifications_enabled, sound_enabled)
VALUES ('YOUR_USER_UUID', 'en', ARRAY['en'], true, true, true)
ON CONFLICT (user_id) DO NOTHING;

-- Insert default quiz stats (if table exists)
INSERT INTO quiz_stats (user_id, total_quizzes, correct_answers)
VALUES ('YOUR_USER_UUID', 0, 0)
ON CONFLICT (user_id) DO NOTHING;
```

## 🐛 Troubleshooting

### Error: "table does not exist"
- The script checks if tables exist before operating on them
- If you see this error, make sure your table names match (check for `profiles` vs `users`)

### Error: "permission denied"
- Make sure you're running the script as a superuser/admin
- Check your Supabase project permissions

### Error: "policy already exists"
- The script drops existing policies first, so this shouldn't happen
- If it does, manually drop the policy and rerun the script

### Users can't access their data
1. Check if RLS is enabled: `SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'your_table';`
2. Check if policies exist: `SELECT * FROM pg_policies WHERE tablename = 'your_table';`
3. Verify user is authenticated: Check `auth.uid()` returns the correct user ID
4. Check console logs in browser for specific RLS errors

## 📊 Verify Policies in Supabase Dashboard

1. Go to **Table Editor** in Supabase dashboard
2. Select a table (e.g., `user_settings`)
3. Click on the **Policies** tab
4. You should see policies like:
   - "Users can read/write their own settings"

## ✅ Testing Checklist

After running the script, test:

- [ ] New user signup creates default settings automatically
- [ ] Users can read their own profile/settings
- [ ] Users can update their own profile/settings
- [ ] Users cannot access other users' data
- [ ] Leaderboard is publicly readable
- [ ] Quiz history is user-specific
- [ ] No RLS errors in browser console

## 🔗 Related Files

- `database/fix-auth-rls-and-defaults.sql` - Main setup script
- `database/complete-user-schema.sql` - Full database schema
- `lib/supabase.ts` - Supabase client configuration

## 💡 Common Issues

### Issue: Empty error objects `{}` in console
**Solution**: This usually means RLS policies are missing or incorrect. Run the setup script.

### Issue: "Permission denied" errors
**Solution**: 
1. Verify RLS policies are created correctly
2. Check that `auth.uid()` matches the `user_id` in your tables
3. Ensure user is properly authenticated

### Issue: Default data not created for new users
**Solution**:
1. Check if trigger exists: `SELECT * FROM information_schema.triggers WHERE trigger_name = 'create_user_defaults';`
2. Manually create data for existing users using the manual setup section above

## 📞 Need Help?

If you're still having issues:
1. Check Supabase logs in Dashboard → Logs
2. Check browser console for specific error messages
3. Verify your table structure matches the expected schema
4. Check that `auth.uid()` is working correctly (run `SELECT auth.uid();` in SQL Editor while authenticated)


