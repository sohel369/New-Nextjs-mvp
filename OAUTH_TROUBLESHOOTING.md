# Google OAuth Troubleshooting Guide

## Common Issues and Solutions

### 1. "Unable to exchange external code" Error

This error typically occurs due to one of the following issues:

#### **Issue A: Incorrect Redirect URL Configuration**

**Problem**: The redirect URL in Google Console doesn't match your application's callback URL.

**Solution**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Find your OAuth 2.0 Client ID
4. Add the correct redirect URI:
   - For development: `http://localhost:3000/auth/callback`
   - For production: `https://yourdomain.com/auth/callback`

#### **Issue B: Supabase OAuth Configuration**

**Problem**: Google OAuth is not properly configured in Supabase.

**Solution**:
1. Go to your Supabase Dashboard
2. Navigate to "Authentication" > "Providers"
3. Enable Google provider
4. Add your Google Client ID and Client Secret
5. Set the redirect URL to: `https://your-project.supabase.co/auth/v1/callback`

#### **Issue C: Environment Variables**

**Problem**: Missing or incorrect environment variables.

**Solution**: Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. "Invalid code" Error

**Problem**: The authorization code is invalid or expired.

**Solutions**:
- Ensure the code is being passed correctly in the URL
- Check that the code hasn't expired (Google codes expire quickly)
- Verify the redirect URL matches exactly

### 3. "Server error" Error

**Problem**: Internal server error during code exchange.

**Solutions**:
- Check Supabase service status
- Verify your Supabase project is active
- Check for any rate limiting issues

## Debug Steps

### Step 1: Check Configuration
Visit `/auth/debug-oauth` to verify:
- Supabase URL is configured
- Anon key is present
- Google Client ID is present
- Redirect URL is correct

### Step 2: Test OAuth Flow
1. Click "Test Google Login" in the debug page
2. Check browser console for errors
3. Monitor network requests in DevTools

### Step 3: Verify Supabase Setup
1. Check Supabase Dashboard > Authentication > Providers
2. Ensure Google is enabled
3. Verify redirect URL in Supabase matches your app

### Step 4: Check Google Console
1. Verify OAuth consent screen is configured
2. Check that redirect URIs are correct
3. Ensure the app is not in testing mode (if needed)

## Environment Variables Checklist

```env
# Required for Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Required for Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# Optional but recommended
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Common Redirect URLs

### Development
- `http://localhost:3000/auth/callback`

### Production
- `https://yourdomain.com/auth/callback`
- `https://your-project.supabase.co/auth/v1/callback` (for Supabase)

## Testing Checklist

- [ ] Environment variables are set
- [ ] Google OAuth is enabled in Supabase
- [ ] Redirect URLs match in Google Console and Supabase
- [ ] OAuth consent screen is configured
- [ ] App is not in testing mode (if needed)
- [ ] No CORS issues
- [ ] Network connectivity is working

## Still Having Issues?

1. Check the browser console for detailed error messages
2. Use the debug page at `/auth/debug-oauth`
3. Verify all URLs match exactly (including http vs https)
4. Try clearing browser cache and cookies
5. Test with a different browser or incognito mode
