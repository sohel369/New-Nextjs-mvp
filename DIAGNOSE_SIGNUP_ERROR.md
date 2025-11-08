# 🔍 Diagnose Signup Error - Step by Step

## Current Issue
You're getting "Database error creating new user" even after disabling the trigger.

## Step 1: Verify Trigger is Actually Disabled

Run this in Supabase SQL Editor:

```sql
SELECT trigger_name 
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
AND trigger_schema = 'auth';
```

**Expected:** Should return **0 rows** (empty)

**If you see any rows:**
- The trigger is still active
- Run: `DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;` again
- Verify with the SELECT query above

## Step 2: Check Supabase Postgres Logs

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **"Logs"** in the left sidebar
4. Select **"Postgres Logs"**
5. Try creating an account
6. Look for error messages in the logs

The logs will show the **actual database error** that's blocking user creation.

## Step 3: Check for Other Triggers or Functions

Run this to check for other triggers:

```sql
-- Check all triggers on auth schema
SELECT 
  trigger_name, 
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'auth';

-- Check for handle_new_user function
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname LIKE '%user%' 
AND proname LIKE '%new%';
```

## Step 4: Check Service Role Key

Make sure your `.env.local` or environment has:
- `SUPABASE_SERVICE_ROLE_KEY` set correctly
- The key has admin privileges

## Step 5: Check Browser Console

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Try signing up
4. Look for `[signup-api] Admin createUser error:` message
5. Check the error details

## Step 6: Check Terminal/Server Logs

In your terminal where `npm run dev` is running, look for:
- `[signup-api] Admin createUser error:` - This will show the actual error

## Common Issues After Disabling Trigger

1. **Function still exists** - The trigger function might still be there
   - Run: `DROP FUNCTION IF EXISTS public.handle_new_user();`

2. **Other triggers** - There might be other triggers
   - Check with the SQL queries above

3. **RLS policies** - Row Level Security might be blocking
   - The admin client should bypass this, but verify

4. **Table constraints** - Foreign key or check constraints
   - Check Supabase Postgres logs for details

## Quick Fix: Drop Everything Related

Run this in Supabase SQL Editor to clean up:

```sql
-- Drop trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Verify
SELECT trigger_name FROM information_schema.triggers 
WHERE event_object_table = 'users' AND trigger_schema = 'auth';
```

## Next Steps

After checking the Postgres logs, you'll see the actual error. Common errors:
- **42P01**: Table doesn't exist
- **42501**: Permission denied
- **23503**: Foreign key violation
- **23505**: Duplicate key (user exists)

Share the error from Postgres logs and I can help fix it!

