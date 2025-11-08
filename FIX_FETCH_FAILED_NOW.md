# 🚨 URGENT: Fix "fetch failed" Error

## The Problem
You're getting `AuthRetryableFetchError: fetch failed` which means:
- The server is running ✅
- But Supabase client cannot connect ❌
- This is because **environment variables are NOT loaded**

## The Root Cause
The dev server was started **BEFORE** the `.env` file was updated. Next.js only loads environment variables when the server **starts**.

## The Solution (3 Steps)

### Step 1: Stop the Current Server
1. Go to your terminal where `npm run dev` is running
2. Press **Ctrl+C** to stop it
3. Wait for it to fully stop

### Step 2: Verify .env File
Make sure `.env` file exists in project root with:
```env
NEXT_PUBLIC_SUPABASE_URL=https://uaijcvhvyurbnfmkqnqt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaWpjdmh2eXVyYm5mbWtxbnF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTU3NzksImV4cCI6MjA3NTc5MTc3OX0.FbBITvB9ITLt7L3e5BAiP4VYa0Qw7YCOx-SHHl1k8zY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaWpjdmh2eXVyYm5mbWtxbnF0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDIxNTc3OSwiZXhwIjoyMDc1NzkxNzc5fQ.ZAMRcMEYtiF7lJjnrVzJvCqshe0QEDIopJ-P9fGDs-8
SUPABASE_PROJECT_ID=uaijcvhvyurbnfmkqnqt
```

### Step 3: Start Server Again
```bash
npm run dev
```

### Step 4: Verify It Worked
After restarting, check your terminal. You **MUST** see:
```
[signup-api] ✅ Supabase admin client initialized with URL: https://uaijcvhvyurbnfmkqnqt.supabase.co
```

If you see this, the server is configured correctly!

## Why This Happens

Next.js loads `.env` file **only once** when the server starts. If you:
- Created/updated `.env` after starting the server
- Changed environment variables
- Updated Supabase credentials

The server **will NOT** see the changes until you restart it.

## Quick Test

After restarting, test the API:
1. Open browser: http://localhost:3000/api/signup
2. You should see an error (expected - needs POST)
3. But it means the route exists and is working

## Still Getting "fetch failed"?

1. **Check terminal logs** - Look for `[signup-api]` messages
2. **Verify Supabase project is active** - Go to https://supabase.com/dashboard
3. **Check credentials** - Make sure they match your Supabase project exactly
4. **Try again** - Sometimes it takes a few seconds for Supabase to respond

