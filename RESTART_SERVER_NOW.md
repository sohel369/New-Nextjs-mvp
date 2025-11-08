# ⚠️ IMPORTANT: Restart Your Dev Server NOW!

## The Problem
"fetch failed" error means your dev server is either:
1. **Not running** - The server needs to be started
2. **Not restarted** - Environment variables only load when the server starts

## The Solution

### Step 1: Stop Your Current Server
1. Go to your terminal where `npm run dev` is running
2. Press **Ctrl+C** to stop it
3. Wait for it to fully stop

### Step 2: Start the Server Again
```bash
npm run dev
```

### Step 3: Wait for It to Start
You should see:
```
✓ Ready in X.Xs
○ Local: http://localhost:3000
```

### Step 4: Check for Success Message
Look for this in your terminal:
```
[signup-api] ✅ Supabase admin client initialized with URL: https://uaijcvhvyurbnfmkqnqt.supabase.co
```

If you see this, the server is configured correctly!

## Why This Is Required

Next.js only loads `.env` file when the server **starts**. If you:
- Created/updated `.env` file
- Changed environment variables
- Updated Supabase credentials

You **MUST** restart the server for changes to take effect.

## Quick Checklist

- [ ] Stopped the current dev server (Ctrl+C)
- [ ] Started it again (`npm run dev`)
- [ ] See "Ready" message in terminal
- [ ] See Supabase initialization message
- [ ] Try signup again

## Still Getting "fetch failed"?

1. **Check if server is running**:
   - Open: http://localhost:3000
   - If it doesn't load, server isn't running

2. **Check terminal for errors**:
   - Look for any error messages
   - Check if port 3000 is already in use

3. **Verify .env file**:
   - Make sure `.env` is in project root (same folder as `package.json`)
   - Check file contents are correct

4. **Try a different port**:
   ```bash
   npm run dev -- -p 3001
   ```
   Then access: http://localhost:3001

