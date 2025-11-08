# 🚨 Emergency Signup Fix Instructions

If you're getting "Database error saving new user", follow these steps:

## Step 1: Run the Emergency Fix Script

1. **Open Supabase Dashboard**
   - Go to your Supabase project
   - Click **SQL Editor** in the left sidebar

2. **Run the Emergency Fix**
   - Click **New Query**
   - Copy the entire contents of `database/EMERGENCY_SIGNUP_FIX.sql`
   - Paste into SQL Editor
   - Click **Run** (or press F5)

3. **Check for Success Messages**
   - You should see ✅ messages for each step
   - If you see any ❌ errors, note them down

## Step 2: Verify Your Environment Variables

Make sure your `.env.local` file has:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**⚠️ CRITICAL:** The `SUPABASE_SERVICE_ROLE_KEY` is required! Without it, the signup API cannot bypass RLS policies.

## Step 3: Test Signup

1. Go to `/auth/signup` in your app
2. Try creating a new account
3. Check the browser console (F12) for any errors
4. Check your terminal/server logs for `[signup-api]` messages

## Step 4: Diagnostic Check (If Still Failing)

Run `database/test-signup-setup.sql` in Supabase SQL Editor to check:
- ✅ If profiles table exists
- ✅ If all required columns exist
- ✅ If RLS is enabled
- ✅ If policies exist
- ✅ If trigger function exists
- ✅ If trigger exists

## Common Issues and Solutions

### Issue: "column does not exist"
**Solution:** Run `EMERGENCY_SIGNUP_FIX.sql` - it adds all missing columns

### Issue: "permission denied" or "RLS policy violation"
**Solution:** 
1. Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
2. The service role key bypasses RLS, so this shouldn't happen
3. Check that the key is correct in Supabase Dashboard → Settings → API

### Issue: "duplicate key" error
**Solution:** The user already exists. Try logging in instead, or delete the user from Supabase Auth and try again.

### Issue: "foreign key constraint violation"
**Solution:** The user was created in auth.users but something is wrong. Check that the user exists in Supabase → Authentication → Users.

## What the Emergency Fix Does

1. ✅ Creates profiles table with ALL possible columns (supports both schemas)
2. ✅ Adds missing columns (user_id, updated_at, learning_languages, base_language)
3. ✅ Enables RLS
4. ✅ Creates simple RLS policies
5. ✅ Creates/updates handle_new_user() trigger function
6. ✅ Creates trigger on auth.users
7. ✅ Creates safe update_updated_at function

## Still Not Working?

1. **Check the exact error message** in browser console
2. **Check server logs** in your terminal - look for `[signup-api]` messages
3. **Run the diagnostic script** (`test-signup-setup.sql`) to see what's missing
4. **Verify service role key** is correct in Supabase Dashboard

The signup API now tries to insert with both schema variations, so it should work regardless of which columns your table has.

