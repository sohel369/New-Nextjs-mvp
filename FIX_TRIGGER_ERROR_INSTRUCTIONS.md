# Fix Database Trigger Error - Quick Guide

## Problem
You're getting this error when trying to sign up:
```
Database error creating new user
```

This is caused by a database trigger on `auth.users` that's failing when trying to create a profile.

## Solution

### Option 1: Quick Fix (Recommended - 30 seconds)

1. **Open Supabase SQL Editor**
   - Go to: https://supabase.com/dashboard
   - Select your project
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

2. **Run this SQL script:**
   ```sql
   DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
   ```

3. **Verify it worked:**
   ```sql
   SELECT trigger_name 
   FROM information_schema.triggers
   WHERE event_object_table = 'users'
   AND trigger_schema = 'auth';
   ```
   - Should return 0 rows (no triggers)

4. **Try signing up again** - it should work now!

### Option 2: Use the Complete Fix Script

If you want to keep the trigger but make it error-proof:

1. Open Supabase SQL Editor
2. Copy and paste the entire contents of `database/fix-trigger-error.sql`
3. Click "Run"
4. The script will:
   - Disable the old trigger
   - Create a fixed version that handles errors gracefully
   - You can optionally re-enable it later

## Why This Works

- The signup API (`app/api/signup/route.ts`) already creates profiles manually
- The database trigger was trying to do the same thing and failing
- Disabling the trigger lets the API handle profile creation without conflicts

## After Fixing

Once you run the SQL script:
- ✅ New user signups will work
- ✅ Profiles will be created by the API
- ✅ No more "Database error creating new user" errors

## Need Help?

If you still get errors after running the script:
1. Check the Supabase logs: Dashboard → Logs → Postgres Logs
2. Verify your `profiles` table structure matches what the API expects
3. Make sure RLS policies allow profile creation

