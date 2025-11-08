# 🚀 Quick Start Guide - Fix Login & Signup

## The Problem
"Failed to fetch" means the server is **not running** or **not accessible**.

## Complete Fix (3 Steps)

### 🔴 Step 1: Start/Restart Dev Server

**Open a terminal in your project folder and run:**

```bash
npm run dev
```

**Wait for it to start** - You should see:
```
✓ Ready in X.Xs
○ Local: http://localhost:3000
```

**Check for this important message:**
```
[signup-api] ✅ Supabase admin client initialized with URL: https://uaijcvhvyurbnfmkqnqt.supabase.co
```

**If you see this, the server is configured correctly!**

### 🟡 Step 2: Set Up Database Tables

**Run the SQL script in Supabase:**

1. Go to: https://supabase.com/dashboard
2. Select project: `uaijcvhvyurbnfmkqnqt`
3. Click **"SQL Editor"** → **"New query"**
4. Open file: `database/COMPLETE_SCHEMA_SETUP.sql`
5. Copy **ALL contents** (243 lines)
6. Paste into SQL Editor
7. Click **"Run"** button

**You should see:**
- ✅ "Success" message
- ✅ Verification queries showing tables exist

### 🟢 Step 3: Test Signup & Login

**After completing Steps 1 and 2:**

1. **Test Signup**:
   - Go to: http://localhost:3000/auth/signup
   - Fill in the form
   - Click "Create Account"
   - Should work! ✅

2. **Test Login**:
   - Go to: http://localhost:3000/auth/login
   - Use the account you created
   - Click "Login"
   - Should work! ✅

## Troubleshooting

### Server Won't Start?
- Check if port 3000 is in use
- Try: `npm run dev -- -p 3001`
- Then access: http://localhost:3001

### Still Getting "Failed to fetch"?
1. **Check server is running**: Visit http://localhost:3000
2. **Check terminal logs**: Look for error messages
3. **Check browser console**: Press F12, look for errors
4. **Verify .env file**: Make sure it's in project root

### Database Errors?
- Make sure you ran `database/COMPLETE_SCHEMA_SETUP.sql`
- Check Supabase Table Editor - you should see `profiles` and `user_settings` tables
- Verify RLS policies are created

## Files You Need

- ✅ `.env` - Environment variables (already created)
- ✅ `database/COMPLETE_SCHEMA_SETUP.sql` - Database setup (run this)
- ✅ `app/api/signup/route.ts` - Signup API (already updated)

## Quick Checklist

- [ ] Server is running (`npm run dev`)
- [ ] See Supabase initialization message in terminal
- [ ] Database tables created (ran SQL script)
- [ ] `profiles` table exists in Supabase
- [ ] `user_settings` table exists in Supabase
- [ ] Test signup works
- [ ] Test login works

