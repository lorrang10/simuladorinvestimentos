import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.cf08df7441d24acd9ac0313c4b31fd38',
  appName: 'Simulador de Investimentos',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1a1a',
      showSpinner: false,
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#1a1a1a'
    },
    Keyboard: {
      resize: 'BODY',
      style: 'DARK',
      resizeOnFullScreen: true
    },
    App: {
      launchUrl: ''
    }
  },
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: false,
    presentationStyle: 'fullscreen'
  },
  android: {
    buildOptions: {
      keystorePath: '',
      keystoreAlias: '',
      releaseType: 'AAB',
      signingType: 'apksigner'
    },
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false
  }
};

export default config;