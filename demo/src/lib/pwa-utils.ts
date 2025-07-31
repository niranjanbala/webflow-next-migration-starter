// PWA utility functions

export function isPWAInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if running in standalone mode
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  
  // Check for iOS standalone mode
  const isInWebAppiOS = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  
  return isStandalone || isInWebAppiOS;
}

export function isOnline(): boolean {
  if (typeof window === 'undefined') return true;
  return navigator.onLine;
}

export function getPWADisplayMode(): string {
  if (typeof window === 'undefined') return 'browser';
  
  const displayModes = ['fullscreen', 'standalone', 'minimal-ui', 'browser'];
  
  for (const displayMode of displayModes) {
    if (window.matchMedia(`(display-mode: ${displayMode})`).matches) {
      return displayMode;
    }
  }
  
  return 'browser';
}

export function canInstallPWA(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if already installed
  if (isPWAInstalled()) return false;
  
  // Check if beforeinstallprompt event is supported
  return 'onbeforeinstallprompt' in window;
}

export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

export function unregisterServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  navigator.serviceWorker.ready
    .then((registration) => {
      registration.unregister();
    })
    .catch((error) => {
      console.error(error.message);
    });
}

export function updateServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  navigator.serviceWorker.ready
    .then((registration) => {
      registration.update();
    })
    .catch((error) => {
      console.error('Service worker update failed:', error);
    });
}

export function addToHomeScreen(): Promise<boolean> {
  return new Promise((resolve) => {
    const deferredPrompt = (window as Window & { deferredPrompt?: BeforeInstallPromptEvent }).deferredPrompt;
    
    if (!deferredPrompt) {
      resolve(false);
      return;
    }

    deferredPrompt.prompt();
    
    deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
        resolve(true);
      } else {
        console.log('User dismissed the A2HS prompt');
        resolve(false);
      }
      
      (window as Window & { deferredPrompt?: BeforeInstallPromptEvent }).deferredPrompt = undefined;
    });
  });
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function trackPWAUsage(): void {
  if (typeof window === 'undefined') return;
  
  const displayMode = getPWADisplayMode();
  const isInstalled = isPWAInstalled();
  
  // Track PWA usage analytics
  console.log('PWA Usage:', {
    displayMode,
    isInstalled,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  });
  
  // You can send this data to your analytics service
  // analytics.track('pwa_usage', { displayMode, isInstalled });
}

export function handlePWAInstallPrompt(): void {
  if (typeof window === 'undefined') return;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    
    // Stash the event so it can be triggered later
    (window as Window & { deferredPrompt?: BeforeInstallPromptEvent }).deferredPrompt = e as BeforeInstallPromptEvent;
    
    // Update UI to notify the user they can install the PWA
    console.log('PWA install prompt available');
  });
  
  window.addEventListener('appinstalled', () => {
    // Log install to analytics
    console.log('PWA was installed');
    
    // Clear the deferredPrompt
    (window as Window & { deferredPrompt?: BeforeInstallPromptEvent }).deferredPrompt = undefined;
  });
}