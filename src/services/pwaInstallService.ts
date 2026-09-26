import { Platform } from 'react-native';

class PWAInstallService {
  private deferredPrompt: any = null;
  private isInstalled = false;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    // Inject PWA manifest and Apple tags if not present
    if (typeof document !== 'undefined') {
      try {
        if (!document.querySelector('link[rel="manifest"]')) {
          const link = document.createElement('link');
          link.rel = 'manifest';
          link.href = '/manifest.json';
          document.head.appendChild(link);
        }
        if (!document.querySelector('link[rel="apple-touch-icon"]')) {
          const appleLink = document.createElement('link');
          appleLink.rel = 'apple-touch-icon';
          appleLink.href = '/assets/icon.png';
          document.head.appendChild(appleLink);
        }
        if (!document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
          const meta = document.createElement('meta');
          meta.name = 'apple-mobile-web-app-capable';
          meta.content = 'yes';
          document.head.appendChild(meta);
        }
        if (!document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')) {
          const meta = document.createElement('meta');
          meta.name = 'apple-mobile-web-app-status-bar-style';
          meta.content = 'black-translucent';
          document.head.appendChild(meta);
        }
      } catch {
        // ignore
      }
    }

    // 1. Check if already installed in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    this.isInstalled = isStandalone;

    // 2. Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then(() => {
            console.log('ZAHIM Service Worker terdaftar.');
          })
          .catch((err) => {
            console.log('Notice: Service worker info:', err?.message || err);
          });
      });
    }

    // 3. Listen to beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.notify();
    });

    // 4. Listen to appinstalled event
    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.isInstalled = true;
      this.notify();
    });
  }

  addListener(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  getCanPrompt(): boolean {
    return !!this.deferredPrompt;
  }

  getIsInstalled(): boolean {
    return this.isInstalled;
  }

  getPlatformInfo(): { isIOS: boolean; isAndroid: boolean; isDesktop: boolean } {
    if (typeof navigator === 'undefined') {
      return { isIOS: false, isAndroid: false, isDesktop: true };
    }
    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);
    const isDesktop = !isIOS && !isAndroid;
    return { isIOS, isAndroid, isDesktop };
  }

  async promptInstall(): Promise<'accepted' | 'dismissed' | 'manual'> {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const choice = await this.deferredPrompt.userChoice;
      this.deferredPrompt = null;
      this.notify();
      return choice.outcome === 'accepted' ? 'accepted' : 'dismissed';
    }
    return 'manual';
  }
}

export const pwaInstallService = new PWAInstallService();
