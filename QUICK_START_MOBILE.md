# 🚀 Quick Start - Mobile App

Get your LinguaAI app running on Android/iOS in 5 minutes!

## 📱 For Android

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Add Android Platform (First Time Only)
```bash
npm run cap:add:android
```

### Step 3: Build and Open
```bash
npm run mobile:android
```

This will:
1. ✅ Build the Next.js app
2. ✅ Copy files to Android project
3. ✅ Open Android Studio

### Step 4: Run in Android Studio
1. Wait for Gradle sync
2. Click the green ▶️ Run button
3. Select emulator or device
4. Enjoy! 🎉

## 🍎 For iOS (macOS Only)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Add iOS Platform (First Time Only)
```bash
npm run cap:add:ios
```

### Step 3: Build and Open
```bash
npm run mobile:ios
```

This will:
1. ✅ Build the Next.js app
2. ✅ Copy files to iOS project
3. ✅ Open Xcode

### Step 4: Run in Xcode
1. Select your development team in Signing
2. Click the ▶️ Run button
3. Select simulator or device
4. Enjoy! 🎉

## 📝 After Making Changes

Whenever you update your code:

```bash
# For Android
npm run mobile:android

# For iOS
npm run mobile:ios
```

## 🎯 What's Included

✅ Native Android and iOS app support  
✅ Microphone permissions for speech recognition  
✅ Optimized for mobile performance  
✅ Status bar and keyboard handling  
✅ Splash screen configured  
✅ PWA support for installable web app  

## 📚 Need More Details?

See [MOBILE_APP_BUILD_GUIDE.md](./MOBILE_APP_BUILD_GUIDE.md) for complete documentation.

## 🐛 Issues?

- **Android Studio not opening?** Run `npx cap open android` manually
- **Xcode not opening?** Run `npx cap open ios` manually  
- **Build fails?** Make sure you ran `npm install` first
- **Permissions not working?** Check `capacitor.config.ts` has the right permissions

Happy coding! 🚀

