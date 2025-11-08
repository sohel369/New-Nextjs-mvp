# 🔧 Fix CORS Error - Step by Step Guide

## The Problem
You're seeing: `CORS Error: Supabase is blocking requests from http://localhost:3000`

This happens because Supabase needs to explicitly allow requests from your local development server.

## ✅ Quick Fix (5 Minutes)

### Step 1: Open Supabase Dashboard
1. Go to: **https://supabase.com/dashboard**
2. Sign in if needed

### Step 2: Select Your Project
1. Find and click on your project: `uaijcvhvyurbnfmkqnqt`
2. Wait for the dashboard to load

### Step 3: Navigate to API Settings
1. Click on **"Settings"** in the left sidebar (gear icon)
2. Click on **"API"** in the settings menu

### Step 4: Add CORS Origin
1. Scroll down to find **"CORS Configuration"** or **"Allowed Origins"** section
2. You'll see a text area or input field for allowed origins
3. Add these URLs (one per line):
   ```
   http://localhost:3000
   http://127.0.0.1:3000
   ```
4. If there are already URLs there, add these on new lines (don't remove existing ones)

### Step 5: Save Changes
1. Click the **"Save"** button (usually at the bottom of the settings page)
2. Wait for confirmation that settings are saved

### Step 6: Verify Project Status
1. While in the dashboard, check that your project shows **"Active"** status
2. If it shows **"Paused"**, click **"Resume"** or **"Restore"**

### Step 7: Restart Your Dev Server
1. Go back to your terminal where `npm run dev` is running
2. Press **Ctrl+C** to stop the server
3. Run: `npm run dev` again
4. Wait for the server to start

### Step 8: Test Login
1. Go to: `http://localhost:3000/auth/login`
2. Try logging in again
3. The CORS error should be gone!

## 🔍 If It Still Doesn't Work

### Check 1: Verify CORS Settings Were Saved
1. Go back to Supabase Dashboard → Settings → API
2. Verify that `http://localhost:3000` is still in the allowed origins list
3. If it's not there, add it again and save

### Check 2: Check Project Status
1. In Supabase Dashboard, check the project status
2. Make sure it's **Active** (not paused)
3. If paused, resume it and wait a few minutes

### Check 3: Verify Environment Variables
1. Check your `.env.local` file (or `.env` file)
2. Make sure it has:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://uaijcvhvyurbnfmkqnqt.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. If missing, add them and restart the server

### Check 4: Clear Browser Cache
1. Open browser DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
4. Try again

### Check 5: Test Supabase Connection
Open browser console (F12) and run:
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

If you still see a CORS error, the settings haven't taken effect yet. Wait 1-2 minutes and try again.

## 📝 Alternative: Check Authentication URL Settings

Sometimes CORS is also controlled in Authentication settings:

1. Go to Supabase Dashboard → Settings → **Authentication**
2. Scroll to **"URL Configuration"**
3. Make sure **"Site URL"** is set to: `http://localhost:3000`
4. In **"Redirect URLs"**, add:
   ```
   http://localhost:3000/**
   http://localhost:3000/auth/callback
   http://127.0.0.1:3000/**
   http://127.0.0.1:3000/auth/callback
   ```
5. Click **Save**

## ✅ Success Indicators

After fixing CORS, you should see:
- ✅ Login page loads without errors
- ✅ No CORS errors in browser console
- ✅ Login requests succeed
- ✅ You can authenticate successfully

## 🆘 Still Having Issues?

If you've followed all steps and it still doesn't work:
1. Check the browser console (F12) for any other errors
2. Check the server console for error messages
3. Verify your Supabase project URL is correct
4. Make sure you're using the correct API keys


