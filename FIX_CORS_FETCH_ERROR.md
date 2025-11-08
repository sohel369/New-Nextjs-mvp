# 🔧 Fix "Failed to fetch" Login Error

## Problem
Login shows: `TypeError: Failed to fetch` when trying to authenticate.

## Root Cause
This is a **CORS (Cross-Origin Resource Sharing)** issue. Supabase is blocking requests from `http://localhost:3000`.

## ✅ Quick Fix (2 Steps)

### Step 1: Add Localhost to Supabase Allowed Origins

1. Go to: https://supabase.com/dashboard
2. Select project: `uaijcvhvyurbnfmkqnqt`
3. Go to **Settings** → **API**
4. Scroll down to **"CORS Configuration"** or **"Allowed Origins"**
5. Add these URLs (one per line):
   ```
   http://localhost:3000
   http://127.0.0.1:3000
   ```
6. Click **"Save"**

### Step 2: Restart Dev Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

## 🔍 Verify Fix

1. Open browser console (F12)
2. Try login again
3. Should see: `[Login] Login Success:` instead of fetch error

## Alternative: Check Project Status

If CORS is already configured, check:

1. **Project is Active** (not paused):
   - Go to Supabase Dashboard
   - Check project status
   - If paused, click "Resume"

2. **Correct Supabase URL**:
   - Verify `.env` file has:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://uaijcvhvyurbnfmkqnqt.supabase.co
     ```

3. **Network Connection**:
   - Check internet connection
   - Try accessing: https://uaijcvhvyurbnfmkqnqt.supabase.co in browser

## Still Not Working?

### Test Supabase Connection

Create a test file `test-supabase-connection.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Test Supabase Connection</title>
</head>
<body>
  <h1>Testing Supabase Connection</h1>
  <button onclick="testConnection()">Test</button>
  <pre id="result"></pre>
  
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script>
    const supabaseUrl = 'https://uaijcvhvyurbnfmkqnqt.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaWpjdmh2eXVyYm5mbWtxbnF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTU3NzksImV4cCI6MjA3NTc5MTc3OX0.FbBITvB9ITLt7L3e5BAiP4VYa0Qw7YCOx-SHHl1k8zY';
    
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
    
    async function testConnection() {
      const resultEl = document.getElementById('result');
      resultEl.textContent = 'Testing...';
      
      try {
        // Test basic connection
        const { data, error } = await supabase.auth.getSession();
        resultEl.textContent = JSON.stringify({ 
          success: !error, 
          error: error?.message || null,
          hasSession: !!data?.session 
        }, null, 2);
      } catch (err) {
        resultEl.textContent = 'Error: ' + err.message;
      }
    }
  </script>
</body>
</html>
```

Open this file in your browser. If it shows a CORS error, the issue is confirmed.

## Summary

**Most likely fix:** Add `http://localhost:3000` to Supabase allowed origins in Dashboard → Settings → API.


