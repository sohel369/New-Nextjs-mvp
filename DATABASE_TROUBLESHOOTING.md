# Database Troubleshooting Guide

## 🚨 Current Issue: "column users.learning_language does not exist"

### **Root Cause:**
The AuthContext is trying to query a `users` table that either:
1. Doesn't exist in your Supabase database
2. Exists but doesn't have the expected columns
3. Has different column names than expected

### **Solution Steps:**

## 1. **Check Current Database State**

Visit: `http://localhost:3000/test-database`

This will show you:
- ✅ Which tables exist
- ❌ Which tables are missing
- 🔍 What errors occur when accessing tables
- 📊 Current user profile status

## 2. **Set Up Database Schema**

### **Option A: Quick Fix (Recommended)**
Run this SQL in your Supabase SQL Editor:

```sql
-- Create users table with correct schema
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  learning_language VARCHAR(10) DEFAULT 'ar' CHECK (learning_language IN ('en', 'ar', 'nl', 'id', 'ms', 'th', 'km')),
  native_language VARCHAR(10) DEFAULT 'en' CHECK (native_language IN ('en', 'ar', 'nl', 'id', 'ms', 'th', 'km')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own data" ON users
  FOR DELETE USING (auth.uid() = id);
```

### **Option B: Complete Setup**
Run the complete database setup from `database/setup-database.sql`

## 3. **Verify Database Setup**

After running the SQL:

1. **Check Tables Exist:**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('users', 'profiles', 'languages', 'user_settings');
   ```

2. **Check Users Table Schema:**
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'users' 
   ORDER BY ordinal_position;
   ```

3. **Test Table Access:**
   ```sql
   SELECT * FROM users LIMIT 1;
   ```

## 4. **Common Issues & Solutions**

### **Issue 1: "relation users does not exist"**
**Solution:** The `users` table doesn't exist. Run the SQL from Step 2.

### **Issue 2: "column users.learning_language does not exist"**
**Solution:** The table exists but has wrong column names. Check the schema and update it.

### **Issue 3: "permission denied for table users"**
**Solution:** RLS policies are blocking access. Check and fix RLS policies.

### **Issue 4: "duplicate key value violates unique constraint"**
**Solution:** User already exists. Check for existing records and handle conflicts.

## 5. **Test Authentication Flow**

After database setup:

1. **Test Login:** Try logging in with existing credentials
2. **Test Signup:** Try creating a new account
3. **Check Console:** Look for database errors in browser console
4. **Verify Profile:** Check if user profile is created correctly

## 6. **Debug Steps**

### **Step 1: Check Browser Console**
Look for these error messages:
- `Error fetching user profile`
- `column users.learning_language does not exist`
- `relation users does not exist`

### **Step 2: Check Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to "Table Editor"
3. Check if `users` table exists
4. Verify column names match the expected schema

### **Step 3: Test Database Connection**
1. Visit `/test-database` page
2. Click "Test Database" button
3. Check which tables are accessible
4. Look for specific error messages

### **Step 4: Check RLS Policies**
1. Go to Supabase Dashboard → Authentication → Policies
2. Verify RLS policies exist for `users` table
3. Check if policies allow the current user to access data

## 7. **Expected Database Schema**

### **Users Table:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  learning_language VARCHAR(10) DEFAULT 'ar',
  native_language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Profiles Table:**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  base_language VARCHAR(10) DEFAULT 'en',
  learning_languages TEXT[] DEFAULT ARRAY['en'],
  level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 8. **Quick Fix Commands**

### **Create Missing Table:**
```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  learning_language VARCHAR(10) DEFAULT 'ar',
  native_language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Enable RLS:**
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

### **Create RLS Policies:**
```sql
CREATE POLICY "Users can access own data" ON users
  FOR ALL USING (auth.uid() = id);
```

## 9. **Verification Checklist**

- [ ] `users` table exists in Supabase
- [ ] `users` table has correct column names
- [ ] RLS is enabled on `users` table
- [ ] RLS policies allow user access
- [ ] No database errors in browser console
- [ ] Login/signup works without errors
- [ ] User profile is created successfully
- [ ] Dashboard loads with user data

## 10. **Still Having Issues?**

If the problem persists:

1. **Check Supabase Logs:** Go to Supabase Dashboard → Logs
2. **Verify Environment Variables:** Check your `.env.local` file
3. **Test Database Connection:** Use the test page at `/test-database`
4. **Check Network Tab:** Look for failed API requests
5. **Contact Support:** Provide specific error messages and database state

---

**Next Steps:**
1. Run the database setup SQL
2. Test the database connection
3. Try logging in again
4. Check for any remaining errors
