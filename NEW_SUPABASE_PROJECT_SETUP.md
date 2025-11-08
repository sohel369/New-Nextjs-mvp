# 🚀 New Supabase Project Setup Guide

## ✅ Step 1: Environment Variables (Already Done)

Your `.env` file has been configured with:
- **Project URL**: `https://uaijcvhvyurbnfmkqnqt.supabase.co`
- **Anon Key**: Configured
- **Service Role Key**: Configured
- **Project ID**: `uaijcvhvyurbnfmkqnqt`

## ⚠️ Step 2: Restart Dev Server (REQUIRED)

**IMPORTANT**: You MUST restart your dev server to load the new environment variables:

```bash
# Stop your current server (Ctrl+C)
# Then restart:
npm run dev
```

After restarting, check your terminal. You should see:
```
[signup-api] ✅ Supabase admin client initialized with URL: https://uaijcvhvyurbnfmkqnqt.supabase.co
```

## 🗄️ Step 3: Set Up Database Tables

Your new Supabase project needs the `profiles` table. Follow these steps:

### 3.1 Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard
2. Select your project: `uaijcvhvyurbnfmkqnqt`
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New query"**

### 3.2 Run the Setup Script

1. Open the file: `database/SETUP_PROFILES_TABLE.sql`
2. Copy the **entire contents** of the file
3. Paste it into the SQL Editor
4. Click **"Run"** (or press Ctrl+Enter)

### 3.3 Verify Setup

After running the script, you should see:
- ✅ "Success. No rows returned" or similar success message
- ✅ A verification query result showing the table exists

You can also verify in the **Table Editor**:
- Go to **"Table Editor"** in the left sidebar
- You should see the `profiles` table listed

## 🧪 Step 4: Test Signup

1. Go to your app's signup page: `http://localhost:3000/auth/signup`
2. Fill in the signup form
3. Click "Create Account"
4. If successful, you should be redirected to the dashboard

## 🔍 Troubleshooting

### Issue: "Server configuration error"
- **Fix**: Make sure you restarted the dev server after updating `.env`

### Issue: "Database error" or "Table does not exist"
- **Fix**: Run the SQL script in `database/SETUP_PROFILES_TABLE.sql` in Supabase SQL Editor

### Issue: "Invalid Supabase configuration"
- **Fix**: 
  1. Verify your credentials in Supabase Dashboard → Settings → API
  2. Make sure the project is active (not paused)
  3. Restart the dev server

### Issue: Still getting errors
1. Check your terminal logs for `[signup-api]` messages
2. Check browser console for detailed error messages
3. Verify the `profiles` table exists in Supabase Table Editor

## 📋 Quick Checklist

- [ ] `.env` file created with correct credentials
- [ ] Dev server restarted
- [ ] SQL script run in Supabase SQL Editor
- [ ] `profiles` table visible in Table Editor
- [ ] Test signup works

## 🎉 Next Steps

Once signup works:
- ✅ Test login functionality
- ✅ Verify profile data is saved correctly
- ✅ Test updating profile settings
- ✅ Check that user data appears in Supabase Table Editor

## 📚 Files Reference

- **Environment Config**: `.env` (in project root)
- **Database Setup**: `database/SETUP_PROFILES_TABLE.sql`
- **Signup API**: `app/api/signup/route.ts`
- **Signup Page**: `app/auth/signup/page.tsx`

