# Supabase Setup Guide (বাংলা)

## 📋 প্রয়োজনীয় পদক্ষেপ

### 1️⃣ Project Root-এ যাও
```bash
cd path/to/LanguageLearningMVP
```

### 2️⃣ .env.local ফাইল তৈরি করুন

**Windows এর জন্য:**
```bash
notepad .env.local
```

**Mac/Linux এর জন্য:**
```bash
nano .env.local
```

### 3️⃣ .env.local ফাইলে নিচের কোডটি পেস্ট করুন

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY

# Google OAuth Configuration (Optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google Gemini API (Optional - AI Coach এর জন্য)
GEMINI_API_KEY=your-gemini-api-key-here

# Google TTS API (Optional)
NEXT_PUBLIC_GOOGLE_TTS_API_KEY=your-google-tts-api-key-here
```

**⚠️ গুরুত্বপূর্ণ:** 
- `YOUR_PROJECT_ID`, `YOUR_ANON_PUBLIC_KEY`, এবং `YOUR_SERVICE_ROLE_KEY` আপনার Supabase project থেকে পাওয়া actual keys দিয়ে replace করুন
- এই keys পাওয়ার জন্য: Supabase Dashboard → Project Settings → API

### 4️⃣ Supabase Keys কোথায় পাওয়া যাবে?

1. [Supabase Dashboard](https://app.supabase.com/) এ login করুন
2. আপনার project select করুন
3. **Settings** (⚙️) → **API** তে যান
4. সেখানে আপনি পাবেন:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Secret key - কখনো client-side এ share করবেন না)

### 5️⃣ Test Script চালান

**Option 1: npm script ব্যবহার করে:**
```bash
npm run test:supabase
```

**Option 2: সরাসরি node command:**
```bash
node test-supabase.js
```

### 6️⃣ Expected Output

যদি সব কিছু ঠিক থাকে, আপনি দেখবেন:
```
✅ Supabase URL found: https://...
✅ Supabase Anon Key found: eyJhbGciOiJIUzI1NiIs...
✅ Supabase client created successfully
✅ Basic connection test passed
✅ Table 'profiles' exists and is accessible
```

যদি error দেখেন, তাহলে:
- ✅ `.env.local` file তৈরি হয়েছে কিনা check করুন
- ✅ Keys সঠিকভাবে copy-paste করা হয়েছে কিনা verify করুন
- ✅ Supabase project active আছে কিনা check করুন

## 🔧 Troubleshooting

### Error: "Cannot find module 'dotenv'"
```bash
npm install dotenv @supabase/supabase-js
```

### Error: "NEXT_PUBLIC_SUPABASE_URL is not set"
- `.env.local` file project root-এ আছে কিনা check করুন
- File name ঠিক আছে কিনা verify করুন (`.env.local` - কোনো typo নেই)

### Error: "Connection failed"
- Internet connection check করুন
- Supabase project active আছে কিনা verify করুন
- Firewall/VPN blocking করছে কিনা check করুন

## 📝 Example .env.local File

```env
NEXT_PUBLIC_SUPABASE_URL=https://ufvuvkrinmkkoowngioe.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmdnV2a3Jpbm1ra29vd25naW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NDI0NjAsImV4cCI6MjA3NTExODQ2MH0.hl452FRWQmS51DQeL9AYZjfiinptZg2ewPWVjEhCaDc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmdnV2a3Jpbm1ra29vd25naW9lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU0MjQ2MCwiZXhwIjoyMDc1MTE4NDYwfQ.LXiIwSzsrqPxpiMm0CWJBuauOXhvzZapmM9tgW0-7O0
```

## ✅ Success Checklist

- [ ] `.env.local` file তৈরি করা হয়েছে
- [ ] Supabase keys সঠিকভাবে add করা হয়েছে
- [ ] `test-supabase.js` script চালানো হয়েছে
- [ ] সব tests pass হয়েছে
- [ ] কোনো error নেই

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

