# 📱 Mobile App Build Guide - LinguaAI

Complete guide to build and deploy LinguaAI as a native Android and iOS mobile app using Capacitor.

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v18 or higher)
2. **Android Studio** (for Android builds)
3. **Xcode** (for iOS builds - macOS only)
4. **Java JDK** (v11 or higher for Android)

### Installation Steps

```bash
# 1. Install dependencies
npm install

# 2. Build the Next.js app for static export
npm run export

# 3. Add Android platform (first time only)
npx cap add android

# 4. Add iOS platform (first time only, macOS only)
npx cap add ios

# 5. Sync and open in IDE
npm run cap:open:android   # For Android
npm run cap:open:ios       # For iOS (macOS only)
```

## 📦 Building for Android

### Step 1: Build Static Export
```bash
npm run export
```

### Step 2: Sync with Capacitor
```bash
npm run cap:sync:android
```

Or use the combined command:
```bash
npm run cap:open:android
```

### Step 3: Open in Android Studio
The command above will automatically open Android Studio. If not:
```bash
npx cap open android
```

### Step 4: Build in Android Studio

1. **Wait for Gradle Sync** to complete
2. **Select a device**:
   - Click device dropdown (top toolbar)
   - Choose emulator or connected device
3. **Run the app**:
   - Click the green ▶️ Run button
   - Or press `Shift + F10`

### Step 5: Generate APK/AAB

#### Debug APK:
```
Build → Build Bundle(s) / APK(s) → Build APK(s)
```

#### Release APK/AAB:
1. **Create Keystore** (first time only):
   ```bash
   keytool -genkey -v -keystore linguaai-release.keystore -alias linguaai -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure Signing**:
   - File → Project Structure → Modules → app
   - Signing Configs → Release
   - Add your keystore path and credentials

3. **Build Release**:
   - Build → Generate Signed Bundle / APK
   - Select Android App Bundle (AAB) for Play Store
   - Or APK for direct distribution

### Android Permissions

The app requests these permissions automatically:
- ✅ **RECORD_AUDIO** - For microphone/speech recognition
- ✅ **MODIFY_AUDIO_SETTINGS** - For audio playback
- ✅ **INTERNET** - For API calls
- ✅ **ACCESS_NETWORK_STATE** - For connectivity checks
- ✅ **VIBRATE** - For haptic feedback

## 🍎 Building for iOS

### Step 1: Build Static Export
```bash
npm run export
```

### Step 2: Sync with Capacitor
```bash
npm run cap:sync:ios
```

Or use the combined command:
```bash
npm run cap:open:ios
```

### Step 3: Open in Xcode
The command above will automatically open Xcode. If not:
```bash
npx cap open ios
```

### Step 4: Configure Signing

1. **Select Project** in Navigator
2. **Select Target**: `App`
3. **Signing & Capabilities** tab
4. **Team**: Select your Apple Developer Team
5. **Bundle Identifier**: `com.language.linguaai` (or your custom ID)

### Step 5: Build and Run

1. **Select Device**:
   - Click device dropdown (top toolbar)
   - Choose simulator or connected device
2. **Run**:
   - Click ▶️ Run button
   - Or press `Cmd + R`

### Step 6: Archive for App Store

1. **Select "Any iOS Device"** as target
2. **Product → Archive**
3. **Distribute App**:
   - Choose distribution method
   - Follow App Store Connect workflow

### iOS Permissions

The app requests these permissions:
- ✅ **Microphone** - For speech recognition
- ✅ **Speech Recognition** - For voice input

Add to `Info.plist` (auto-configured):
```xml
<key>NSMicrophoneUsageDescription</key>
<string>We need access to your microphone for speech recognition in language learning exercises.</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>We need speech recognition to help you practice pronunciation.</string>
```

## 🔧 Available Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Production build

# Static Export (for mobile)
npm run export                 # Build static export
npm run export:pwa             # Build with PWA optimizations

# Capacitor Commands
npm run cap:sync               # Sync web files to native projects
npm run cap:copy               # Build + copy files
npm run cap:open:android       # Build + copy + open Android Studio
npm run cap:open:ios           # Build + copy + open Xcode
npm run cap:sync:android       # Build + copy + sync Android
npm run cap:sync:ios           # Build + copy + sync iOS

# Platform-specific
npx cap add android            # Add Android platform (first time)
npx cap add ios                # Add iOS platform (first time)
npx cap update                 # Update Capacitor and plugins
```

## 📱 Testing on Devices

### Android

#### Physical Device:
1. **Enable Developer Options** on your Android device
2. **Enable USB Debugging**
3. **Connect device** via USB
4. **Select device** in Android Studio
5. **Run app**

#### Emulator:
1. **Create AVD** in Android Studio
2. **Start emulator**
3. **Select emulator** in device dropdown
4. **Run app**

### iOS

#### Physical Device:
1. **Connect iPhone/iPad** via USB
2. **Trust computer** on device
3. **Select device** in Xcode
4. **Run app** (may need to trust developer certificate on device)

#### Simulator:
1. **Select simulator** from device dropdown
2. **Run app**

## 🎨 App Configuration

### App Details (capacitor.config.ts)

- **App ID**: `com.language.linguaai`
- **App Name**: `LinguaAI`
- **Theme Color**: `#3b82f6`
- **Background Color**: `#1e1b4b`

### Customization

Edit `capacitor.config.ts` to change:
- App ID/Name
- Splash screen settings
- Status bar style
- Keyboard behavior
- Permissions

## 🐛 Troubleshooting

### Android Issues

#### Gradle Build Fails
```bash
cd android
./gradlew clean
cd ..
npm run cap:sync:android
```

#### Permission Denied
- Check `AndroidManifest.xml` has required permissions
- Verify `capacitor.config.ts` permissions array

#### App Crashes on Launch
- Check Android Studio Logcat for errors
- Verify all Capacitor plugins are installed
- Ensure `out/` directory exists after export

### iOS Issues

#### Build Fails
- Check Xcode console for errors
- Verify signing and capabilities
- Ensure CocoaPods dependencies are installed:
  ```bash
  cd ios/App
  pod install
  ```

#### Permissions Not Requested
- Check `Info.plist` has usage descriptions
- Verify permissions in Capacitor config

#### App Won't Install on Device
- Trust developer certificate in Settings → General → VPN & Device Management
- Ensure bundle identifier is unique

### General Issues

#### Changes Not Reflecting
```bash
# Always rebuild before syncing
npm run export
npx cap sync
```

#### Capacitor Plugins Not Working
```bash
# Update all plugins
npx cap update
npm run cap:sync
```

## 📦 Distribution

### Android - Google Play Store

1. **Generate Signed AAB**:
   - Build → Generate Signed Bundle / APK
   - Choose Android App Bundle
   - Use your release keystore

2. **Upload to Play Console**:
   - Go to [Google Play Console](https://play.google.com/console)
   - Create new app or update existing
   - Upload AAB file
   - Complete store listing
   - Submit for review

### iOS - App Store

1. **Archive Build**:
   - Product → Archive in Xcode
   - Wait for archive to complete

2. **Distribute**:
   - Click "Distribute App"
   - Choose App Store Connect
   - Follow upload workflow
   - Complete App Store Connect listing
   - Submit for review

### Direct Distribution (APK)

1. **Generate APK**:
   - Build → Generate Signed Bundle / APK
   - Choose APK
   - Use your release keystore

2. **Share APK**:
   - Host APK on server
   - Users download and install
   - Must enable "Install from Unknown Sources" on Android

## ✅ Checklist

Before releasing:

- [ ] App builds successfully for Android
- [ ] App builds successfully for iOS
- [ ] All features work on physical devices
- [ ] Microphone permissions work
- [ ] TTS/audio playback works
- [ ] AI Coach works with speech recognition
- [ ] App icons display correctly
- [ ] Splash screen displays correctly
- [ ] Status bar styling is correct
- [ ] Keyboard behavior is good
- [ ] App works offline (PWA features)
- [ ] All API endpoints are accessible
- [ ] Error handling works properly
- [ ] Performance is acceptable

## 📚 Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/studio)
- [iOS Developer Guide](https://developer.apple.com/documentation/)
- [Google Play Console](https://play.google.com/console)
- [App Store Connect](https://appstoreconnect.apple.com)

## 🎉 Success!

Your LinguaAI app is now ready for mobile deployment! 🚀

