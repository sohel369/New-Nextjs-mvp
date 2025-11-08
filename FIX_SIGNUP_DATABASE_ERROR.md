# Fix "Database error saving new user" Issue

## Problem
New users cannot create accounts because the profile insert fails with a database error.

## Root Cause
The Row Level Security (RLS) policy for inserting profiles may be missing or incorrectly configured.

## Solution

### Step 1: Fix the RLS Policy in Supabase

1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `database/fix-profile-insert-policy.sql`
5. Click **Run** to execute

This will:
- Drop any conflicting policies
- Create the correct INSERT policy: `auth.uid() = id`
- Enable RLS on the profiles table
- Verify the policy was created

### Step 2: Verify the Policy

Run this query in SQL Editor to verify:

```sql
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  cmd,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles' 
AND cmd = 'INSERT';
```

You should see a policy with:
- `cmd = 'INSERT'`
- `with_check = 'auth.uid() = id'`

### Step 3: Test Signup

1. Go to `/auth/signup`
2. Create a new account
3. Check the browser console for any errors
4. The profile should be created successfully

## How It Works

The signup code now:
1. **First tries direct insert** - Works if RLS policy is correct
2. **Falls back to API route** - Uses service role key (bypasses RLS)
3. **Falls back to users table** - Alternative table if profiles fails
4. **AuthContext creates profile** - Final fallback if all else fails

## Troubleshooting

### If signup still fails:

1. **Check Supabase logs**: Dashboard → Logs → Check for RLS errors
2. **Verify RLS is enabled**: 
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public' 
   AND tablename = 'profiles';
   ```
   Should return `rowsecurity = true`

3. **Check policy exists**:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'profiles' AND cmd = 'INSERT';
   ```

4. **Check user has auth.uid()**:
   The policy `auth.uid() = id` requires the user to be authenticated. 
   Make sure the signup process completes and creates a session before inserting the profile.

### Common Issues

- **"new row violates row-level security policy"**: Policy doesn't exist or is incorrect
- **"permission denied"**: RLS is enabled but no INSERT policy exists
- **"column does not exist"**: Table schema mismatch - check column names

## Alternative: Use API Route (Recommended)

The signup code now automatically falls back to the API route (`/api/create-profile`) which uses the service role key and bypasses RLS. This is the most reliable method.

## Files Modified

1. `database/fix-profile-insert-policy.sql` - SQL script to fix the policy
2. `app/auth/signup/page.tsx` - Improved error handling with API route fallback

