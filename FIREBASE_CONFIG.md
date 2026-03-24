# Firebase Configuration

## 🔥 Firebase Project: Car Rental Dubai

Your application is now fully configured for the Firebase project: `car-rental-dubai-86748`

### 📋 Configuration Details

#### **Firebase URI**: `https://car-rental-dubai-86748.firebaseapp.com`
- Project Name: Car Rental Dubai
- Project ID: car-rental-dubai-86748
- Used for OAuth redirects
- Domain verification
- Production deployment

### 🛠️ Files Updated

1. **`lib/config.ts`** - Centralized configuration with Firebase URI
2. **`app/auth/login/page.tsx`** - Updated OAuth redirects
3. **`app/auth/signup/page.tsx`** - Updated OAuth redirects
4. **`app/auth/callback/route.ts`** - Enhanced callback handling

### 🔧 Configuration Features

#### **OAuth Redirects**
- Automatic detection of origin
- Fallback to Firebase URI for production
- Support for multiple domains

#### **Allowed Origins**
- `http://localhost:3000` (Development)
- `https://myreactmvp.firebaseapp.com` (Production)

#### **Helper Functions**
- `getRedirectUrl()` - Dynamic redirect URL generation
- `isAllowedOrigin()` - Origin validation
- Centralized configuration management

### 🚀 Setup Checklist

To fix the **400 (Bad Request)** and **Firestore (Database Not Found)** errors, please ensure:

#### **1. Authentication Setup**
- Go to **Firebase Console** → **Authentication** → **Sign-in method**.
- **Enable "Email/Password"**. If this is disabled, Firebase will reject all login/signup attempts with a 400 error.
- (Optional) Enable "Google" if you want to use Social Login.

#### **2. Authorized Domains**
- In **Authentication** → **Settings** (tab) → **Authorized domains**.
- Verify `localhost` is listed. It should be by default, but double-check if it was removed.

#### **3. Firestore Database Initialization**
- Go to **Firebase Console** → **Firestore Database**.
- Click **"Create database"**.
- Choose **"Start in test mode"** (to allow initial writes) or **"Start in production mode"** (requires rules).
- Ensure the database ID is `(default)`.
- **CRITICAL**: If you see "Database not found" in your console, it means this step was skipped.

#### **4. API Keys & Restrictions**
- If you have restricted your API Key in the Google Cloud Console, ensure **"Identity Toolkit API"** and **"Cloud Firestore API"** are allowed.

### 📝 Server-Side Setup (Admin SDK)

The **500 errors** in the settings API are caused by missing Admin SDK credentials in your `.env.local`. 

1. Go to **Project Settings** → **Service accounts**.
2. Click **"Generate new private key"**.
3. Download the JSON file.
4. Update your `.env.local` with:
   - `FIREBASE_CLIENT_EMAIL`: The `client_email` from your JSON.
   - `FIREBASE_PRIVATE_KEY`: The `private_key` from your JSON (make sure to include the `\n` characters).

### ✅ Benefits

- **Production Ready**: Firebase hosting support
- **OAuth Compatible**: Google authentication works
- **Domain Security**: Origin validation
- **Flexible Deployment**: Multiple domain support

### 🔍 Testing

Test the Firebase URI integration:
1. Deploy to Firebase hosting
2. Test Google OAuth authentication
3. Verify redirect URLs work correctly
4. Check domain validation

Your application is now configured for Firebase deployment with proper OAuth support! 🎉

