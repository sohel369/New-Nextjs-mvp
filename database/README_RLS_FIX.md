# 🔧 Safe RLS Policy Fix for Profiles Table

## Problem
You're getting errors like:
- `column user_id of relation profiles already exists`
- `policy Users read only own data for table profiles already exists`

## Solution
Use the `database/safe-fix-profiles-rls.sql` script which:
1. ✅ Checks if `user_id` column exists before creating it
2. ✅ Checks if policies exist before creating them
3. ✅ Handles both `id` and `user_id` columns
4. ✅ Sets up proper foreign key relationships
5. ✅ Creates RLS policies that work with either column

## How to Use

1. **Open Supabase Dashboard**
   - Go to your Supabase project
   - Click on **SQL Editor** in the left sidebar

2. **Run the Script**
   - Click **New Query**
   - Copy the entire contents of `database/safe-fix-profiles-rls.sql`
   - Paste into the SQL Editor
   - Click **Run** (or press F5)

3. **Verify Results**
   - Check the output messages - you should see ✅ for successful operations
   - Go to **Table Editor** → **profiles** → **Policies** tab
   - You should see 4 policies:
     - `Users read only own data` (SELECT)
     - `Users insert own data` (INSERT)
     - `Users update own data` (UPDATE)
     - `Users delete own data` (DELETE)

## What the Script Does

### Step 1: Handle user_id Column
- Checks if `user_id` column exists
- If not, creates it and links it to `auth.users(id)`
- If `id` column exists, copies values to `user_id`

### Step 2: Ensure Foreign Keys
- Ensures `id` has foreign key to `auth.users(id)` (if it exists)
- Ensures `user_id` has foreign key to `auth.users(id)`

### Step 3: Enable RLS
- Enables Row Level Security on the profiles table

### Step 4: Clean Up Policies
- Drops all existing policies to avoid conflicts

### Step 5: Create Policies Safely
- Checks if each policy exists before creating
- Creates policies that work with both `id` and `user_id` columns
- Uses: `(auth.uid() = id) OR (auth.uid() = user_id)`

## Policy Details

All policies use this logic:
```sql
USING (
  (auth.uid() = id) OR 
  (auth.uid() = user_id)
)
```

This ensures the policies work whether your table uses:
- `id` as the primary key (references `auth.users(id)`)
- `user_id` as a separate foreign key column
- Both columns

## Troubleshooting

### If you still get errors:
1. Check the error message in the SQL Editor output
2. Look for the specific policy or column causing issues
3. The script should handle most cases, but if you see specific errors, share them

### To verify everything is correct:
Run this query in SQL Editor:
```sql
-- Check columns
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'profiles';

-- Check policies
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles';
```

## Important Notes

- ⚠️ This script is **safe** - it checks before creating anything
- ✅ It won't break existing data
- ✅ It handles both `id` and `user_id` column scenarios
- ✅ Policies work with authenticated users only
- ✅ Each user can only access their own profile data

