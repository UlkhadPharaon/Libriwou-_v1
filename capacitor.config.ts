import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.libriwouo.app',
  appName: 'Libriwouô',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    LocalNotifications: {
      iconColor: '#D4AF37'
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#070B19',
      overlaysWebView: false
    }
  }
};

export default config;
