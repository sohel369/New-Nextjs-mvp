# 🔍 Verify Supabase Credentials

## The Error
"Unexpected token 'P', "Project pa"... is not valid JSON"

This error means Supabase returned an HTML error page instead of JSON. This usually happens when:
1. The Supabase URL is incorrect
2. The service role key is incorrect  
3. The Supabase project is paused or doesn't exist
4. The dev server hasn't been restarted to load .env

## Step 1: Verify Your Supabase Project

1. Go to: https://supabase.com/dashboard
2. Check if your project `uaijcvhvyurbnfmkqnqt` exists and is **active** (not paused)
3. If paused, click "Restore" to activate it

## Step 2: Get Correct Credentials

1. In Supabase Dashboard, select your project
2. Go to **Settings** → **API**
3. Copy these values:

   - **Project URL**: Should be `https://uaijcvhvyurbnfmkqnqt.supabase.co`
   - **Service Role Key** (secret): Click "Reveal" and copy the key
   - **Anon Key**: Copy the anon/public key

## Step 3: Update .env File

Make sure your `.env` file has the **exact** values from Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://uaijcvhvyurbnfmkqnqt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key-from-supabase>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key-from-supabase>
SUPABASE_PROJECT_ID=uaijcvhvyurbnfmkqnqt
```

**Important**: 
- The service role key is very long (starts with `eyJhbGci...`)
- Make sure there are no extra spaces or quotes
- Make sure the URL doesn't have a trailing slash

## Step 4: Restart Dev Server

**CRITICAL**: You MUST restart your dev server after updating .env:

```bash
# Stop server (Ctrl+C)
# Then restart:
npm run dev
```

## Step 5: Test Connection

After restarting, check your terminal logs. You should see:

```
[signup-api] ✅ Supabase admin client initialized with URL: https://uaijcvhvyurbnfmkqnqt.supabase.co
```

If you see errors, they will show what's wrong.

## Common Issues

### Issue: "Project paused"
- **Fix**: Go to Supabase Dashboard → Restore project

### Issue: "Invalid API key"
- **Fix**: Copy the service role key again from Settings → API (make sure it's the SERVICE ROLE key, not anon key)

### Issue: "URL not found"
- **Fix**: Verify the project URL matches exactly what's in Supabase Dashboard

### Issue: Environment variables not loading
- **Fix**: 
  1. Make sure `.env` is in the project root (same folder as `package.json`)
  2. Restart the dev server
  3. Check terminal logs for initialization messages

## Still Not Working?

1. Check browser console for the exact error
2. Check terminal/server logs for `[signup-api]` messages
3. Verify credentials in Supabase Dashboard match your .env file
4. Try creating a test API key in Supabase and use that

