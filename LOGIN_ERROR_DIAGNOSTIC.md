# 🔍 Login Error Diagnostic Guide

## Quick Diagnosis Steps

### Step 1: Check Browser Console (F12)
1. Open browser console (Press F12)
2. Try to login
3. Look for error messages starting with `[Login]`
4. Copy the full error message

### Step 2: Common Error Types

#### Error: "Failed to fetch"
**Cause:** CORS issue or network problem
**Fix:**
1. Go to Supabase Dashboard → Settings → API
2. Add `http://localhost:3000` to allowed origins
3. Restart dev server

#### Error: "Invalid login credentials"
**Cause:** Wrong email or password
**Fix:** Check your credentials

#### Error: "Email not confirmed"
**Cause:** Email verification required
**Fix:** Check your email and click verification link

#### Error: "Database error"
**Cause:** Database tables not set up
**Fix:** Run `database/COMPLETE_SCHEMA_SETUP.sql` in Supabase SQL Editor

### Step 3: Test Login API

Use the test endpoint to diagnose:

```bash
curl -X POST http://localhost:3000/api/test-login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'
```

Or use this in browser console:
```javascript
fetch('/api/test-login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'your@email.com', password: 'yourpassword' })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

### Step 4: Check Environment Variables

Verify `.env` file has:
```
NEXT_PUBLIC_SUPABASE_URL=https://uaijcvhvyurbnfmkqnqt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### Step 5: Verify Supabase Project

1. Go to: https://supabase.com/dashboard
2. Check project `uaijcvhvyurbnfmkqnqt` is **Active** (not paused)
3. Check Settings → API for correct URL and keys

## Still Having Issues?

1. **Check server logs** - Look at terminal where `npm run dev` is running
2. **Check browser network tab** - See what requests are failing
3. **Try test endpoint** - Use `/api/test-login` to isolate the issue

## Report Error

When reporting, include:
- Exact error message from browser console
- Error code (if any)
- What you were doing when it happened
- Browser and OS version


