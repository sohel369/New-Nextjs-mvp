import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardStyle } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'com.language.linguaai',
  appName: 'LinguaAI',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    // For development, you can use:
    // url: 'http://localhost:3000',
    // cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#1e1b4b',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      iosSpinnerStyle: 'small',
      spinnerColor: '#3b82f6',
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1e1b4b',
    },
    Keyboard: {
      style: KeyboardStyle.Dark,
      resizeOnFullScreen: true,
    },
  },
  android: {
    allowMixedContent: true,
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
  ios: {
    scheme: 'LinguaAI',
    allowsLinkPreview: false,
    scrollEnabled: true,
    contentInset: 'automatic',
  },
};

export default config;
