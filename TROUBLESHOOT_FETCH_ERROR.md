# 🔧 Troubleshooting "fetch failed" Error

## The Error
```
fetch failed
[signup] API error response: {}
```

This error means the browser cannot connect to your Next.js API route.

## Common Causes & Solutions

### 1. Dev Server Not Running ⚠️ MOST COMMON

**Symptom**: Browser shows "fetch failed" or network error

**Solution**:
1. Check if your terminal shows the dev server running
2. Look for: `Ready` or `Local: http://localhost:3000`
3. If not running, start it:
   ```bash
   npm run dev
   ```
4. Wait for it to fully start (should show "Ready")
5. Try signup again

### 2. Server Crashed or Restarting

**Symptom**: Server was running but stopped responding

**Solution**:
1. Check your terminal for error messages
2. Look for `[signup-api]` error logs
3. Restart the server:
   ```bash
   # Stop (Ctrl+C)
   npm run dev
   ```

### 3. Wrong Port or URL

**Symptom**: Server running on different port

**Solution**:
1. Check what port your server is running on (usually 3000)
2. Make sure you're accessing: `http://localhost:3000`
3. If using a different port, update your browser URL

### 4. API Route Has Errors

**Symptom**: Server running but API route crashes

**Solution**:
1. Check terminal logs for `[signup-api]` errors
2. Look for TypeScript/compilation errors
3. Common issues:
   - Missing environment variables
   - Supabase client initialization failed
   - Syntax errors in route.ts

### 5. Environment Variables Not Loaded

**Symptom**: Server running but Supabase connection fails

**Solution**:
1. Make sure `.env` file exists in project root
2. Restart the dev server (environment variables only load on startup)
3. Check terminal for: `[signup-api] ✅ Supabase admin client initialized`
4. If you see `❌ Missing required environment variables`, check your `.env` file

## Quick Diagnostic Steps

### Step 1: Check Server Status
```bash
# In your terminal, you should see:
✓ Ready in X.Xs
○ Local: http://localhost:3000
```

### Step 2: Test API Route Directly
Open in browser: `http://localhost:3000/api/signup`

You should see an error (expected - it needs POST), but it means the route exists.

### Step 3: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try signup
4. Look for the `/api/signup` request
5. Check if it shows:
   - ❌ Failed/Error (server not running)
   - ✅ 200/400/500 (server running, check response)

### Step 4: Check Terminal Logs
Look for:
- `[signup-api] ✅ Supabase admin client initialized` (good)
- `[signup-api] ❌ Missing required environment variables` (bad - check .env)
- `[signup-api] ❌ Supabase not configured properly` (bad - restart server)

## What I Fixed

I've improved error handling to:
- ✅ Catch fetch errors and show clear message
- ✅ Handle JSON parsing errors in API route
- ✅ Better error messages for debugging

## Still Not Working?

1. **Check terminal logs** - Look for any error messages
2. **Check browser console** - Look for detailed error info
3. **Verify server is running** - Should show "Ready" in terminal
4. **Restart everything**:
   ```bash
   # Stop server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

## Expected Behavior

When everything works:
1. Server shows: `✅ Supabase admin client initialized`
2. Browser console shows: `[signup] Starting signup process...`
3. API responds with success or clear error message
4. No "fetch failed" errors

