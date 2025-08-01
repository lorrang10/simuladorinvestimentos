import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.cf08df7441d24acd9ac0313c4b31fd38',
  appName: 'simuladorinvestimentos',
  webDir: 'dist',
  server: {
    url: 'https://cf08df74-41d2-4acd-9ac0-313c4b31fd38.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1a1a',
      showSpinner: false
    }
  }
};

export default config;