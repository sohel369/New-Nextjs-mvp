# 🔧 Complete Authentication & Database Fix Instructions

This guide fixes all authentication and database issues in your app.

## Problems Fixed

1. ✅ **Logout not working** - Fixed redirect logic
2. ✅ **Signup database errors** - Fixed trigger and RLS policies
3. ✅ **Profile auto-creation** - Fixed trigger function
4. ✅ **RLS policies** - Created safe, working policies

## Step 1: Run Database Fix Script

1. **Open Supabase Dashboard**
   - Go to your Supabase project
   - Click **SQL Editor** in the left sidebar

2. **Run the Complete Fix Script**
   - Click **New Query**
   - Copy the entire contents of `database/complete-auth-fix.sql`
   - Paste into SQL Editor
   - Click **Run** (or press F5)

3. **Verify Success**
   - Check the output messages - you should see ✅ for each step
   - Go to **Table Editor** → **profiles** → **Policies** tab
   - You should see 4 policies created

## Step 2: Verify Environment Variables

Make sure your `.env.local` file has:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**⚠️ Important:** The `SUPABASE_SERVICE_ROLE_KEY` is required for signup to work.

## Step 3: Test the Fixes

### Test Signup
1. Go to `/auth/signup`
2. Create a new account
3. Check Supabase → Table Editor → profiles
4. You should see a new profile automatically created

### Test Logout
1. Log in to your account
2. Go to profile page
3. Click logout button
4. You should be redirected to `/auth/login`
5. You should NOT be redirected back to dashboard

## What Was Fixed

### Database (SQL Script)
- ✅ Added `user_id` column to profiles table
- ✅ Created `handle_new_user()` trigger function
- ✅ Created trigger that auto-creates profiles on signup
- ✅ Enabled RLS on profiles table
- ✅ Created 4 RLS policies (SELECT, INSERT, UPDATE, DELETE)
- ✅ Backfilled existing profiles with user_id

### Frontend (Code Changes)
- ✅ Fixed logout in `AuthContext.tsx` - clears all storage before redirect
- ✅ Fixed logout in `app/profile/page.tsx` - properly awaits signOut
- ✅ Fixed redirect logic in `app/page.tsx` - prevents redirect loops

## Troubleshooting

### If signup still fails:
1. Check browser console for errors
2. Check terminal/server logs for `[signup-api]` messages
3. Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
4. Check Supabase → Table Editor → profiles table exists

### If logout still redirects to dashboard:
1. Clear browser cache and localStorage
2. Check browser console for errors
3. Verify the code changes were saved
4. Restart your dev server: `npm run dev`

### If profile is not auto-created:
1. Check Supabase → Database → Functions
2. Verify `handle_new_user()` function exists
3. Check Supabase → Database → Triggers
4. Verify `on_auth_user_created` trigger exists
5. Try creating a test user and check the logs

## Verification Queries

Run these in Supabase SQL Editor to verify everything:

```sql
-- Check trigger exists
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check function exists
SELECT * FROM pg_proc 
WHERE proname = 'handle_new_user';

-- Check policies exist
SELECT * FROM pg_policies 
WHERE tablename = 'profiles';

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';
```

## Success Indicators

✅ **Signup works:**
- New user account created
- Profile automatically created in profiles table
- No "Database error saving new user" message

✅ **Logout works:**
- Clicking logout redirects to `/auth/login`
- No redirect back to dashboard
- User is actually logged out

✅ **RLS works:**
- Users can only see their own profile
- Users can only update their own profile
- Service role can still create profiles (for signup)

## Need More Help?

If you're still having issues:
1. Check the error messages in browser console
2. Check server logs in terminal
3. Verify all SQL script steps completed successfully
4. Make sure environment variables are correct

