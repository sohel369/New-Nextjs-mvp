# Fix "Database error saving new user" - Complete Guide

## Quick Fix

Run this SQL script in your Supabase SQL Editor:

1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `database/fix-signup-database-error.sql`
5. Click **Run**

## What This Script Does

1. ✅ Creates `profiles` table if it doesn't exist
2. ✅ Creates `users` table if it doesn't exist (fallback)
3. ✅ Enables Row Level Security (RLS) on both tables
4. ✅ Creates INSERT policies so users can insert their own profiles
5. ✅ Creates SELECT, UPDATE, DELETE policies
6. ✅ Verifies the setup

## Changes Made to Code

### 1. API Route (`app/api/signup/route.ts`)
- ✅ Added language code normalization (converts 'english' → 'en')
- ✅ Improved error logging with detailed error messages
- ✅ Better fallback to `users` table if `profiles` fails
- ✅ Returns detailed error messages to help debug

### 2. Signup Page (`app/auth/signup/page.tsx`)
- ✅ Fixed default language code from `['english']` to `['en']`
- ✅ Fixed syntax error (added missing catch block)

## Testing

After running the SQL script:

1. Try to create a new account
2. Check the browser console for detailed error messages
3. Check the server logs for `[signup-api]` messages

## Common Issues

### Issue 1: "new row violates row-level security policy"
**Fix**: The INSERT policy is missing or incorrect. Run the SQL script above.

### Issue 2: "column does not exist"
**Fix**: The table schema doesn't match. The SQL script will create the correct schema.

### Issue 3: "duplicate key value violates unique constraint"
**Fix**: A profile already exists for this user. The code will handle this gracefully.

### Issue 4: Language code mismatch
**Fix**: The code now normalizes language codes automatically (e.g., 'english' → 'en').

## Verification

After running the script, verify with this query:

```sql
-- Check if INSERT policy exists
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

You should see:
- `cmd = 'INSERT'`
- `with_check = 'auth.uid() = id'`

## Next Steps

1. ✅ Run the SQL script
2. ✅ Restart your dev server
3. ✅ Try creating an account
4. ✅ Check console logs for detailed error messages if it still fails

## Still Having Issues?

If you still get errors, check:
1. **Service Role Key**: Make sure `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
2. **Table Schema**: Run `SELECT * FROM information_schema.columns WHERE table_name = 'profiles';` to verify columns
3. **RLS Status**: Run `SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'profiles';`

The error messages in the console will now be more detailed and help identify the exact issue.

