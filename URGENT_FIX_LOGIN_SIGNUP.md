# 🚨 URGENT: Fix Login & Signup Issues

## The Problem
You can't login or sign up because:
1. ❌ Server needs restart to load environment variables
2. ❌ Database tables may not be set up

## Complete Fix (Do These 3 Steps)

### 🔴 Step 1: RESTART SERVER (MOST IMPORTANT!)

**You MUST restart the server for environment variables to load:**

1. **Find your terminal** where `npm run dev` is running
2. **Press Ctrl+C** to stop it
3. **Wait for it to stop completely**
4. **Start it again**:
   ```bash
   npm run dev
   ```
5. **Wait for it to start** - Look for:
   ```
   ✓ Ready in X.Xs
   ○ Local: http://localhost:3000
   ```
6. **Check for this message**:
   ```
   [signup-api] ✅ Supabase admin client initialized with URL: https://uaijcvhvyurbnfmkqnqt.supabase.co
   ```

**If you see this message, the server is configured correctly!**

### 🟡 Step 2: Set Up Database Tables

**Your new Supabase project needs the `profiles` table:**

1. **Open Supabase Dashboard**:
   - Go to: https://supabase.com/dashboard
   - Select your project: `uaijcvhvyurbnfmkqnqt`

2. **Open SQL Editor**:
   - Click **"SQL Editor"** in left sidebar
   - Click **"New query"**

3. **Run the Setup Script**:
   - Open the file: `database/SETUP_PROFILES_TABLE.sql`
   - Copy the **entire contents** (all 88 lines)
   - Paste into SQL Editor
   - Click **"Run"** button

4. **Verify Success**:
   - You should see "Success" message
   - Go to **"Table Editor"** → You should see `profiles` table

### 🟢 Step 3: Test Login & Signup

After completing Steps 1 and 2:

1. **Test Signup**:
   - Go to: http://localhost:3000/auth/signup
   - Fill in the form
   - Click "Create Account"
   - Should work now! ✅

2. **Test Login**:
   - Go to: http://localhost:3000/auth/login
   - Use the account you just created
   - Click "Login"
   - Should work now! ✅

## Why This Fixes It

### Why Restart Server?
- Next.js loads `.env` file **only when server starts**
- Your server was started **before** `.env` was updated
- Without restart, it's using empty/old environment variables
- This causes "fetch failed" errors

### Why Set Up Database?
- Your new Supabase project is empty
- It doesn't have the `profiles` table yet
- Signup tries to create a profile but table doesn't exist
- This causes "Database error" or "Table does not exist"

## Quick Checklist

- [ ] Server restarted (Step 1)
- [ ] See Supabase initialization message in terminal
- [ ] Database tables created (Step 2)
- [ ] `profiles` table visible in Supabase Table Editor
- [ ] Test signup works
- [ ] Test login works

## Still Having Issues?

### Check Terminal Logs
Look for these messages:
- ✅ `[signup-api] ✅ Supabase admin client initialized` (good!)
- ❌ `[signup-api] ❌ Missing required environment variables` (bad - restart server)
- ❌ `[signup-api] ❌ Supabase not configured properly` (bad - restart server)

### Check Browser Console
1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Try signup/login
4. Look for error messages

### Check Network Tab
1. Press **F12** → **Network** tab
2. Try signup/login
3. Look for `/api/signup` request
4. Check if it shows:
   - ✅ 200 (success)
   - ❌ 500 (server error - check terminal)
   - ❌ Failed (server not running)

## Need More Help?

1. **Check terminal** - Look for error messages
2. **Check browser console** - Look for detailed errors
3. **Verify Supabase project** - Make sure it's active (not paused)
4. **Verify .env file** - Make sure it's in project root

