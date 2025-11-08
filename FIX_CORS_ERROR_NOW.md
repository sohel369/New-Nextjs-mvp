# 🔧 Fix "Failed to fetch" / CORS Error - Quick Guide

## Problem
You're seeing: `AuthRetryableFetchError: Failed to fetch` or `TypeError: Failed to fetch` when trying to login.

## Root Cause
This is a **CORS (Cross-Origin Resource Sharing)** issue. Supabase is blocking requests from your local development server.

## ✅ Quick Fix (3 Steps)

### Step 1: Add Your Origin to Supabase Allowed Origins

1. Go to: https://supabase.com/dashboard
2. Select your project: `uaijcvhvyurbnfmkqnqt`
3. Go to **Settings** → **API**
4. Scroll down to **"CORS Configuration"** or **"Allowed Origins"**
5. Add these URLs (one per line):
   ```
   http://localhost:3000
   http://127.0.0.1:3000
   ```
6. Click **"Save"**

### Step 2: Verify Project is Active

1. In Supabase Dashboard, check that your project status shows **"Active"** (not paused)
2. If paused, click **"Resume"** or **"Restore"**

### Step 3: Restart Your Dev Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

## 🔍 Verify the Fix

1. Open browser console (F12)
2. Try login again
3. You should see: `[Login] Connection test response: 200` or similar
4. Login should work without CORS errors

## Still Not Working?

### Check Environment Variables

Verify your `.env.local` file has:
```env
NEXT_PUBLIC_SUPABASE_URL=https://uaijcvhvyurbnfmkqnqt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Test Connection Manually

Open browser console and run:
```javascript
fetch('https://uaijcvhvyurbnfmkqnqt.supabase.co/rest/v1/', {
  method: 'HEAD',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaWpjdmh2eXVyYm5mbWtxbnF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTU3NzksImV4cCI6MjA3NTc5MTc3OX0.FbBITvB9ITLt7L3e5BAiP4VYa0Qw7YCOx-SHHl1k8zY'
  }
})
.then(r => console.log('✅ Success:', r.status))
.catch(e => console.error('❌ CORS Error:', e))
```

If you see a CORS error, the allowed origins are not configured correctly.

## Summary

**Most common fix:** Add `http://localhost:3000` to Supabase Dashboard → Settings → API → Allowed Origins, then restart your dev server.

