# 🔧 Quick Fix for Signup Database Error

If you're seeing "Database error saving new user" when trying to sign up, follow these steps:

## Step 1: Run the Database Setup Script

1. Open your **Supabase Dashboard**
2. Go to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste the entire contents of `database/fix-signup-complete.sql`
5. Click **Run** (or press F5)

## Step 2: Verify Tables Exist

1. In Supabase Dashboard, go to **Table Editor**
2. Verify these tables exist:
   - ✅ `profiles` table
   - ✅ `users` table

## Step 3: Check Environment Variables

Make sure your `.env.local` file has:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**⚠️ Important:** The `SUPABASE_SERVICE_ROLE_KEY` is required for the signup API to bypass RLS policies.

## Step 4: Check Browser Console

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Try signing up again
4. Look for error messages starting with `[signup-api]`

## Step 5: Check Terminal/Server Logs

1. In your terminal where `npm run dev` is running
2. Look for log messages starting with:
   - `📩 [signup-api] Incoming signup request`
   - `✅ [signup-api] User created successfully`
   - `❌ [signup-api]` (any errors)

## Common Error Codes and Solutions

### Error Code: `42P01`
**Problem:** Table does not exist  
**Solution:** Run the SQL script in Step 1

### Error Code: `42501`
**Problem:** Permission denied  
**Solution:** 
1. Check that `SUPABASE_SERVICE_ROLE_KEY` is set correctly
2. Verify RLS policies were created (run the SQL script)

### Error Code: `23505`
**Problem:** Duplicate key (user already exists)  
**Solution:** Try logging in instead of signing up

### Error Code: `23503`
**Problem:** Foreign key constraint violation  
**Solution:** The user was created in auth.users but something is wrong. Try deleting the user from Supabase Auth and trying again.

## Still Having Issues?

1. Check the detailed error in the browser console
2. Check the server logs in your terminal
3. Verify all environment variables are set correctly
4. Make sure you're using the correct Supabase project URL and keys

