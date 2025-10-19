# Google OAuth Setup Guide

## 🔐 Google OAuth Configuration

Your language learning app now includes Google OAuth integration with the provided Client ID.

### 📋 Google OAuth Client ID
```
1043282254579-3gdapkcdb40dvg77hiar17sjhdor303c.apps.googleusercontent.com
```

### 🛠️ Supabase Configuration Steps

#### 1. **Access Supabase Dashboard**
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: `uaijcvhvyurbnfmkqnqt`
3. Navigate to **Authentication** → **Providers**

#### 2. **Configure Google OAuth Provider**
1. Find **Google** in the providers list
2. Click **Enable** if not already enabled
3. Enter the following configuration:

**Google OAuth Settings:**
- **Client ID**: `1043282254579-3gdapkcdb40dvg77hiar17sjhdor303c.apps.googleusercontent.com`
- **Client Secret**: [You need to get this from Google Cloud Console]
- **Redirect URL**: `https://uaijcvhvyurbnfmkqnqt.supabase.co/auth/v1/callback`

#### 3. **Google Cloud Console Setup**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID: `1043282254579-3gdapkcdb40dvg77hiar17sjhdor303c.apps.googleusercontent.com`
5. Click **Edit** to configure authorized redirect URIs

**Add these Redirect URIs:**
```
https://uaijcvhvyurbnfmkqnqt.supabase.co/auth/v1/callback
http://localhost:3000/auth/callback
https://myreactmvp.firebaseapp.com/auth/callback
```

#### 4. **Get Client Secret**
1. In Google Cloud Console, click on your OAuth 2.0 Client ID
2. Copy the **Client Secret** value
3. Add it to your Supabase Google OAuth configuration

### 🔧 Environment Variables

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://uaijcvhvyurbnfmkqnqt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhaWpjdmh2eXVyYm5mbWtxbnF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMTU3NzksImV4cCI6MjA3NTc5MTc3OX0.FbBITvB9ITLt7L3e5BAiP4VYa0Qw7YCOx-SHHl1k8zY

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=1043282254579-3gdapkcdb40dvg77hiar17sjhdor303c.apps.googleusercontent.com

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_FIREBASE_URL=https://myreactmvp.firebaseapp.com
```

### 🎯 OAuth Flow Configuration

#### **Current Implementation:**
Your app already has Google OAuth integration in:
- `app/auth/login/page.tsx` - Login with Google
- `app/auth/signup/page.tsx` - Signup with Google
- `app/auth/callback/route.ts` - OAuth callback handler

#### **OAuth Redirect URLs:**
- **Development**: `http://localhost:3000/auth/callback`
- **Production**: `https://myreactmvp.firebaseapp.com/auth/callback`
- **Supabase**: `https://uaijcvhvyurbnfmkqnqt.supabase.co/auth/v1/callback`

### 🚀 Testing Google OAuth

#### **Test Steps:**
1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Test Login Flow:**
   - Go to `http://localhost:3000/auth/login`
   - Click "Continue with Google"
   - Complete Google authentication
   - Verify redirect to homepage

3. **Test Signup Flow:**
   - Go to `http://localhost:3000/auth/signup`
   - Click "Continue with Google"
   - Complete Google authentication
   - Verify user profile creation

### 🔒 Security Configuration

#### **Google Cloud Console Security:**
1. **Authorized JavaScript Origins:**
   ```
   http://localhost:3000
   https://myreactmvp.firebaseapp.com
   https://uaijcvhvyurbnfmkqnqt.supabase.co
   ```

2. **Authorized Redirect URIs:**
   ```
   https://uaijcvhvyurbnfmkqnqt.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback
   https://myreactmvp.firebaseapp.com/auth/callback
   ```

#### **Supabase Security:**
- Row Level Security (RLS) enabled
- User profiles automatically created
- Session management handled by Supabase

### 📱 Mobile OAuth Support

Your app supports mobile OAuth through:
- **Deep linking** for mobile apps
- **Universal links** for iOS
- **App links** for Android

### 🎨 UI/UX Features

#### **Google OAuth Button:**
- Consistent Google branding
- Loading states during authentication
- Error handling for failed authentication
- Responsive design for all devices

#### **User Experience:**
- Seamless authentication flow
- Automatic profile creation
- Language preference setup
- Progress tracking integration

### 🔧 Troubleshooting

#### **Common Issues:**

1. **"Invalid redirect URI" error:**
   - Verify redirect URIs in Google Cloud Console
   - Check Supabase OAuth configuration

2. **"Client ID not found" error:**
   - Verify Client ID in Supabase settings
   - Check environment variables

3. **"Access denied" error:**
   - Check OAuth consent screen configuration
   - Verify user permissions in Google Cloud Console

#### **Debug Steps:**
1. Check browser console for errors
2. Verify Supabase authentication logs
3. Test with different browsers
4. Check network requests in DevTools

### ✅ Verification Checklist

- [ ] Google OAuth Client ID configured in Supabase
- [ ] Client Secret added to Supabase
- [ ] Redirect URIs configured in Google Cloud Console
- [ ] Environment variables set correctly
- [ ] OAuth consent screen configured
- [ ] Test login flow works
- [ ] Test signup flow works
- [ ] User profiles created automatically
- [ ] Redirect to homepage after authentication

### 🚀 Production Deployment

#### **Firebase Hosting:**
1. Deploy to Firebase: `https://myreactmvp.firebaseapp.com`
2. Update Google Cloud Console with production URLs
3. Test OAuth flow in production
4. Monitor authentication logs

#### **Domain Verification:**
- Verify domain ownership in Google Cloud Console
- Add production domain to authorized origins
- Test OAuth flow with production URLs

Your Google OAuth integration is now ready! Users can authenticate with Google and have their profiles automatically created in your language learning app. 🎉
