# Fix Signup Issue - User Cannot Access Dashboard After Registration

## Problem
Users can sign up successfully but cannot access the dashboard because the user profile insert fails due to database schema mismatches.

## Solution

### Step 1: Run the SQL Migration

1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Create a new query
4. Copy and paste the entire contents of `database/fix-signup-issue.sql`
5. Click **Run** to execute the migration

This migration will:
- Create/update the `users` table with the correct columns
- Create/update the `profiles` table
- Add missing columns (`learning_languages` array support)
- Set up RLS (Row Level Security) policies
- Create triggers to sync data between columns

### Step 2: Verify the Fix

After running the migration, test the signup flow:

1. Go to `/auth/signup`
2. Create a new account
3. You should be redirected to `/dashboard` successfully

### Step 3: Check for Errors

If you still see errors:

1. Check the browser console for detailed error messages
2. Check Supabase logs in the Dashboard → Logs
3. Verify that:
   - The `users` table has both `learning_languages` (TEXT[]) and `learning_language` (VARCHAR) columns
   - The `profiles` table has `learning_languages` (TEXT[]) column
   - RLS policies are enabled and allow INSERT operations

## Schema Details

### Users Table Structure
```sql
- id (UUID, PRIMARY KEY, REFERENCES auth.users)
- name (TEXT)
- email (TEXT, UNIQUE)
- level (INTEGER, default 1)
- total_xp (INTEGER, default 0)
- streak (INTEGER, default 0)
- learning_languages (TEXT[], array of languages)
- learning_language (VARCHAR, single language for compatibility)
- native_language (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Profiles Table Structure
```sql
- id (UUID, PRIMARY KEY, REFERENCES auth.users)
- name (TEXT)
- email (TEXT, UNIQUE)
- avatar_url (TEXT)
- base_language (VARCHAR)
- learning_languages (TEXT[], array of languages)
- level (INTEGER)
- total_xp (INTEGER)
- streak (INTEGER)
- last_activity (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## RLS Policies

Both tables have these RLS policies:
- **SELECT**: Users can view their own data (`auth.uid() = id`)
- **INSERT**: Users can insert their own data (`auth.uid() = id`)
- **UPDATE**: Users can update their own data (`auth.uid() = id`)
- **DELETE**: Users can delete their own data (`auth.uid() = id`)

## Troubleshooting

### Error: "relation does not exist"
- Make sure you ran the migration SQL in Supabase SQL Editor
- Check that you're connected to the correct database project

### Error: "permission denied"
- Verify RLS policies are created correctly
- Check that the user is authenticated before trying to insert

### Error: "duplicate key value"
- The user profile already exists
- The code should handle this gracefully and allow login

### Still having issues?
1. Check the detailed error logs we added in the code
2. Verify your Supabase project URL and keys in `.env.local`
3. Make sure email confirmations are disabled in Supabase Auth settings if you want immediate access after signup

