# Supabase Setup Guide

This guide will help you configure Supabase environment variables correctly for your Next.js app.

## Quick Setup

### 1. Create `.env.local` file

Create a file named `.env.local` in the root of your project (same level as `package.json`):

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Service Role Key (for server-side operations only - keep this secret!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 2. Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### 3. Restart Your Dev Server

After creating/updating `.env.local`, restart your Next.js development server:

```bash
npm run dev
```

## Verify Configuration

### Option 1: Test via API Route

Visit this URL in your browser or use curl:

```bash
# Browser
http://localhost:3000/api/test-supabase

# Or with curl
curl http://localhost:3000/api/test-supabase
```

You should see:
```json
{
  "success": true,
  "message": "Connection successful",
  "data": [...],
  "timestamp": "2024-..."
}
```

### Option 2: Test in Code

You can test the connection programmatically:

```typescript
import { testSupabaseConnection } from '@/lib/supabase';

// In a component or API route
const result = await testSupabaseConnection();
if (result.success) {
  console.log('✅ Supabase connection successful');
} else {
  console.error('❌ Supabase connection failed:', result.error);
}
```

### Option 3: Check Console on Server Start

When you start your dev server, check the console for validation messages:

- ✅ **Success**: No warnings shown
- ⚠️ **Warning**: "NEXT_PUBLIC_SUPABASE_URL not found in .env.local - using fallback"
- ❌ **Error**: "NEXT_PUBLIC_SUPABASE_URL is not set in .env.local"

## Troubleshooting

### Error: "Error loading user learning languages: {}"

This usually means:
1. **Environment variables not set** - Check your `.env.local` file exists and has correct values
2. **Server not restarted** - Restart your dev server after changing `.env.local`
3. **Wrong credentials** - Verify your Supabase URL and keys are correct

**Fix:**
```bash
# 1. Verify .env.local exists and has correct values
cat .env.local

# 2. Restart dev server
npm run dev

# 3. Test connection
curl http://localhost:3000/api/test-supabase
```

### Connection Test Fails

If `/api/test-supabase` returns an error:

1. **Check environment variables are loaded:**
   ```bash
   # In your terminal, check if variables are set
   echo $NEXT_PUBLIC_SUPABASE_URL
   ```

2. **Verify Supabase project is active:**
   - Go to Supabase Dashboard
   - Check if project is paused (free tier projects pause after inactivity)

3. **Check RLS policies:**
   - The test queries the `profiles` table
   - Make sure RLS policies allow reading (at least for testing)

### Common Issues

#### Issue: Empty error object `{}`

**Cause:** Supabase client initialized but connection fails silently

**Solution:**
1. Verify `.env.local` file exists in project root
2. Check variable names are correct (case-sensitive)
3. Restart dev server completely
4. Clear Next.js cache: `rm -rf .next` (or `Remove-Item -Recurse -Force .next` on Windows)

#### Issue: "PGRST116" error

**Cause:** This is expected if the table exists but has no rows

**Solution:** This is fine! The connection is working. The error just means no data exists yet.

## File Structure

```
your-project/
├── .env.local              # ← Create this file (not in git)
├── .env.local.example      # Template (optional)
├── lib/
│   └── supabase.ts        # Supabase client initialization
└── app/
    └── api/
        └── test-supabase/
            └── route.ts   # Connection test endpoint
```

## Security Notes

⚠️ **Important:**
- Never commit `.env.local` to git (it's in `.gitignore`)
- `NEXT_PUBLIC_*` variables are exposed to the browser
- `SUPABASE_SERVICE_ROLE_KEY` should NEVER be in client-side code
- Use environment variables for different environments (dev/staging/prod)

## Production Deployment

For production, set environment variables in your hosting platform:

- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Build & Deploy → Environment
- **Railway**: Project Settings → Variables
- **Docker**: Use `docker-compose.yml` or `.env` file

## Next Steps

After setup:
1. ✅ Test connection: `GET /api/test-supabase`
2. ✅ Verify no console errors on page load
3. ✅ Test profile loading in your app
4. ✅ Test quiz stats fetching

Your Supabase connection should now work correctly for:
- Profile management
- Settings sync
- Leaderboard data
- Quiz statistics
- User authentication

