# 🔒 RLS Policy Fix Instructions (Bangla)

## সমস্যা
Frontend থেকে Supabase query করার সময় `{}` error আসছে। এর মূল কারণ **Row Level Security (RLS) Policy** সঠিকভাবে setup না থাকা।

## সমাধান

### ১. Supabase SQL Editor এ যান

1. [Supabase Dashboard](https://supabase.com/dashboard) → আপনার project
2. **SQL Editor** tab এ ক্লিক করুন
3. **New Query** বাটনে ক্লিক করুন

### ২. RLS Policy Script Run করুন

`database/fix-all-rls-policies.sql` file এর সম্পূর্ণ content copy করে SQL Editor এ paste করুন এবং **Run** করুন।

অথবা সরাসরি এই commands গুলো run করুন:

```sql
-- Quiz History
ALTER TABLE quiz_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own quiz history" ON quiz_history;
CREATE POLICY "Users can view own quiz history" ON quiz_history
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own quiz history" ON quiz_history;
CREATE POLICY "Users can insert own quiz history" ON quiz_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- User Settings
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own settings" ON user_settings;
CREATE POLICY "Users can view own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own settings" ON user_settings;
CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own settings" ON user_settings;
CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);
```

### ৩. Verify করুন

SQL Editor এ এই query run করুন policies verify করতে:

```sql
SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('quiz_history', 'profiles', 'user_settings')
ORDER BY tablename;
```

আপনার দেখতে হবে policies list হবে।

### ৪. Session Check করুন

Browser Console এ check করুন:
1. **Application** → **Local Storage** → `supabase.auth.token` আছে কিনা
2. যদি না থাকে, logout করে আবার login করুন

### ৫. Environment Variables Check করুন

`.env.local` file এ এই variables আছে কিনা verify করুন:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

### ৬. App Restart করুন

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### ৭. Test করুন

1. Browser console open করুন (F12)
2. Logout করুন
3. আবার Login করুন
4. Dashboard load করুন
5. Console এ এখন proper error messages দেখাবে (যদি কোনো error থাকে)

## Error Messages এখন দেখাবে:

আগে যা দেখতেন:
```
Error fetching quiz stats: {}
```

এখন যা দেখবেন:
```
[Supabase Error] Error fetching quiz stats: {
  message: "new row violates row-level security policy",
  code: "42501",
  details: "...",
  fullError: "{...}"
}
```

## Common Issues & Solutions

### Issue 1: "permission denied for table"
**Solution**: RLS enable আছে কিন্তু policy নেই → `fix-all-rls-policies.sql` run করুন

### Issue 2: "new row violates row-level security"
**Solution**: INSERT policy নেই → উপরের scripts run করুন

### Issue 3: Empty error object `{}`
**Solution**: 
- Code update করা হয়েছে এখন full error details দেখাবে
- RLS policies verify করুন
- Session check করুন

## ✅ Success Indicators

1. Console এ error object এর মধ্যে `message`, `code`, `details` field দেখবেন
2. RLS policy violation errors দেখবেন (যা fix করতে হবে)
3. "no rows returned" errors suppress হবে (expected error)

## Help

যদি এখনও সমস্যা থাকে:
1. Browser console এর exact error message screenshot নিন
2. Supabase SQL Editor → Policies tab screenshot নিন
3. Error details share করুন


