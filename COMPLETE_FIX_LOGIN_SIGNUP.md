# 🔧 Complete Fix: Can't Login or Sign Up

## Quick Fix Checklist

Follow these steps in order:

### ✅ Step 1: Restart Dev Server (CRITICAL)

**The server MUST be restarted to load environment variables:**

1. **Stop the server**:
   - Go to terminal where `npm run dev` is running
   - Press **Ctrl+C**

2. **Start it again**:
   ```bash
   npm run dev
   ```

3. **Wait for this message**:
   ```
   [signup-api] ✅ Supabase admin client initialized with URL: https://uaijcvhvyurbnfmkqnqt.supabase.co
   ```

### ✅ Step 2: Set Up Database Tables

**Your new Supabase project needs the `profiles` table:**

1. Go to: https://supabase.com/dashboard
2. Select project: `uaijcvhvyurbnfmkqnqt`
3. Click **"SQL Editor"** → **"New query"**
4. Open file: `database/SETUP_PROFILES_TABLE.sql`
5. Copy **entire contents** and paste into SQL Editor
6. Click **"Run"**

### ✅ Step 3: Verify Setup

After completing both steps above:

1. **Test signup**: Go to http://localhost:3000/auth/signup
2. **Test login**: Go to http://localhost:3000/auth/login
3. Both should work now!

## Common Issues & Solutions

### Issue 1: "fetch failed"
- **Cause**: Server not running or environment variables not loaded
- **Fix**: Restart server (Step 1)

### Issue 2: "Database error" or "Table does not exist"
- **Cause**: Database tables not created
- **Fix**: Run SQL script (Step 2)

### Issue 3: "Invalid credentials" on login
- **Cause**: User doesn't exist or wrong password
- **Fix**: Create account first via signup

### Issue 4: "Server configuration error"
- **Cause**: Environment variables not loaded
- **Fix**: Restart server (Step 1)

## Still Not Working?

1. **Check terminal logs** - Look for `[signup-api]` or error messages
2. **Check browser console** - Press F12, look for errors
3. **Verify Supabase project** - Make sure it's active (not paused)
4. **Check .env file** - Make sure it's in project root

