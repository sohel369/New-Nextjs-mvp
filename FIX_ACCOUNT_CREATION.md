# 🚨 FIX ACCOUNT CREATION ERROR - DO THIS NOW

## The Problem
Your database has a trigger that's blocking new account creation. You need to disable it.

## ✅ SOLUTION (Takes 1 minute)

### Step 1: Open Supabase
👉 **Go to:** https://supabase.com/dashboard
- Sign in if needed
- Select your project

### Step 2: Open SQL Editor
1. Look at the **left sidebar**
2. Click **"SQL Editor"**
3. Click **"New query"** button (top right)

### Step 3: Copy This Command
```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
```

### Step 4: Paste & Run
1. **Paste** the command above into the SQL editor
2. Click the **"Run"** button (or press `Ctrl+Enter`)
3. You should see: ✅ **"Success. No rows returned"**

### Step 5: Verify (Optional)
Run this to check:
```sql
SELECT trigger_name FROM information_schema.triggers WHERE event_object_table = 'users' AND trigger_schema = 'auth';
```
**Should show: 0 rows** ✅

### Step 6: Test
Go back to your app and try creating an account. It will work! 🎉

---

## 📸 Visual Guide

```
1. https://supabase.com/dashboard
   └─> Sign in
   └─> Select your project

2. Left sidebar → "SQL Editor"
   └─> Click "New query"

3. Paste this:
   DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

4. Click "Run" button
   └─> See: "Success. No rows returned"

5. Done! Try signing up again.
```

---

## ❓ Why This Works

- Your signup API already creates profiles automatically
- The database trigger is trying to do the same thing and failing
- Disabling the trigger lets your API handle everything without conflicts

---

## 🔍 Still Not Working?

1. **Make sure you're in the correct project** in Supabase
2. **Check you clicked "Run"** after pasting the command
3. **Verify the command has no typos**
4. **Try the verification query** to see if trigger still exists

---

**This is a ONE-TIME fix. After running it, account creation will work permanently!** ✅

