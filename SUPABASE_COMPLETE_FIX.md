# 🔧 Complete Supabase Login/Signup Fix Checklist

## ✅ Step 1: Update Environment Variables

**CRITICAL:** Your `.env.local` has the OLD Supabase URL. Update it now:

1. Open `.env.local` file
2. Replace with these values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://uaijcvhvyurbnfmkqnqt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaWpjdmh2eXVyYm5mbWtxbnF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTU3NzksImV4cCI6MjA3NTc5MTc3OX0.FbBITvB9ITLt7L3e5BAiP4VYa0Qw7YCOx-SHHl1k8zY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaWpjdmh2eXVyYm5mbWtxbnF0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDIxNTc3OSwiZXhwIjoyMDc1NzkxNzc5fQ.ZAMRcMEYtiF7lJjnrVzJvCqshe0QEDIopJ-P9fGDs-8
SUPABASE_PROJECT_ID=uaijcvhvyurbnfmkqnqt
```

3. **Restart dev server** after updating:
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

## ✅ Step 2: Configure Supabase Auth URLs

1. Go to: https://supabase.com/dashboard
2. Select project: `uaijcvhvyurbnfmkqnqt`
3. Go to **Settings** → **Authentication** → **URL Configuration**
4. Set:
   - **Site URL:** `http://localhost:3000`
   - **Redirect URLs:** Add these (one per line):
     ```
     http://localhost:3000/**
     http://localhost:3000/auth/callback
     http://127.0.0.1:3000/**
     http://127.0.0.1:3000/auth/callback
     ```
5. Click **Save**

## ✅ Step 3: Configure CORS

1. In Supabase Dashboard, go to **Settings** → **API**
2. Scroll to **"CORS Configuration"** or **"Allowed Origins"**
3. Add:
   ```
   http://localhost:3000
   http://127.0.0.1:3000
   ```
4. Click **Save**

## ✅ Step 4: Run Database Setup

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **"New query"**
3. Open file: `database/COMPLETE_SCHEMA_SETUP.sql`
4. Copy **ALL contents** (243 lines)
5. Paste into SQL Editor
6. Click **"Run"**
7. Verify success - should see:
   - ✅ Tables created: `profiles`, `user_settings`
   - ✅ RLS policies created
   - ✅ Triggers created

## ✅ Step 5: Verify Database Schema

Run this in Supabase SQL Editor to verify:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'user_settings');

-- Check columns are UUID type
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('profiles', 'user_settings')
AND column_name IN ('id', 'user_id')
ORDER BY table_name, column_name;

-- Check RLS is enabled
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'user_settings');
```

**Expected Results:**
- ✅ Both tables exist
- ✅ `id` and `user_id` columns are `uuid` type (NOT `bigint`)
- ✅ RLS is enabled (`rowsecurity = true`)

## ✅ Step 6: Verify API Code

### Signup API (`app/api/signup/route.ts`)
✅ Already correct:
- Uses `supabaseAdmin` with `SERVICE_ROLE_KEY`
- Creates user via `auth.admin.createUser`
- Upserts `profiles` table with UUID `id` and `user_id`
- Inserts `user_settings` table with UUID `id` and `user_id`
- Proper error handling

### Login Page (`app/auth/login/page.tsx`)
✅ Already correct:
- Uses `supabase.auth.signInWithPassword`
- Proper error handling
- Network error detection

## ✅ Step 7: Test Connection

### Test 1: Environment Variables
```bash
# In terminal where server is running, check for:
[signup-api] ✅ Supabase admin client initialized with URL: https://uaijcvhvyurbnfmkqnqt.supabase.co
```

### Test 2: Test Login API
Open browser console (F12) and run:
```javascript
fetch('/api/test-login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'test@example.com', 
    password: 'test123456' 
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

### Test 3: Network Tab
1. Open Browser DevTools → **Network** tab
2. Try to login
3. Look for:
   - ✅ `POST /auth/v1/token` → Status 200 (success) or 400 (wrong credentials)
   - ❌ CORS errors → Fix Step 3
   - ❌ 401/403 → Check RLS policies

## ✅ Step 8: Common Issues & Fixes

### Issue: "Failed to fetch"
**Fix:** Complete Steps 2 & 3 (Auth URLs + CORS)

### Issue: "Database error" or "Table does not exist"
**Fix:** Complete Step 4 (Run database setup SQL)

### Issue: "Invalid credentials" (but credentials are correct)
**Fix:** 
- Check `.env.local` has correct URL (Step 1)
- Restart dev server
- Clear browser cache

### Issue: "UUID type mismatch"
**Fix:** 
- Verify database schema (Step 5)
- Ensure `id` and `user_id` are `uuid` type, not `bigint`
- Re-run database setup SQL if needed

### Issue: "RLS policy violation"
**Fix:**
- Check RLS policies exist (Step 5)
- Verify service role key is used in API routes
- Check policies allow service role operations

## ✅ Step 9: Final Verification

After completing all steps:

1. **Restart dev server:**
   ```bash
   npm run dev
   ```

2. **Test Signup:**
   - Go to: http://localhost:3000/auth/signup
   - Create new account
   - Should succeed ✅

3. **Test Login:**
   - Go to: http://localhost:3000/auth/login
   - Login with created account
   - Should succeed ✅

4. **Check Browser Console:**
   - No CORS errors
   - No fetch errors
   - Success messages

## 📋 Quick Checklist

- [ ] `.env.local` updated with correct Supabase URL
- [ ] Dev server restarted after env update
- [ ] Supabase Auth URLs configured (Site URL + Redirect URLs)
- [ ] CORS configured in Supabase Dashboard
- [ ] Database setup SQL run successfully
- [ ] Database schema verified (UUID types, RLS enabled)
- [ ] Test signup works
- [ ] Test login works
- [ ] No errors in browser console
- [ ] No errors in server terminal

## 🆘 Still Having Issues?

1. **Check server terminal** for error messages
2. **Check browser console** (F12) for detailed errors
3. **Check Supabase Dashboard** → Logs → Postgres Logs
4. **Verify project is Active** (not paused) in Supabase Dashboard


