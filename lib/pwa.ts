'use client';

export const registerSW = () => {
  // next-pwa auto-registers the service worker, so we don't need manual registration
  // This function is kept for compatibility but will check if SW is already registered
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration) {
        console.log('Service Worker already registered:', registration);
      } else {
        console.log('Service Worker will be auto-registered by next-pwa');
      }
    });
  }
};

export const installPWA = () => {
  let deferredPrompt: any; // BeforeInstallPromptEvent type not available in all browsers
  
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
  });

  return {
    showInstallPrompt: () => {
      if (deferredPrompt) {
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
          if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          } else {
          console.log('User dismissed the install prompt');
          }
          deferredPrompt = null;
        });
      }
    },
    isInstallable: () => !!deferredPrompt
  };
};

export const checkOnlineStatus = () => {
  return navigator.onLine;
};

export const addToHomeScreen = () => {
  // For iOS devices
  if ((window.navigator as any).standalone === false) { // iOS Safari standalone mode
    // Show instructions for adding to home screen
    return true;
  }
  return false;
};
