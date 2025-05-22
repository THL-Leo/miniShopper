export default {
  expo: {
    name: 'MiniShoppers',
    slug: 'mini-shoppers',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#2563EB'
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.minishoppers.app',
      infoPlist: {
        NSLocationWhenInUseUsageDescription: 'Find nearby stores on MiniShoppers',
        NSCameraUsageDescription: 'Scan QR codes to order from local stores'
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.minishoppers.app',
      permissions: [
        'ACCESS_FINE_LOCATION',
        'CAMERA'
      ]
    },
    plugins: [
      'expo-location',
      'expo-camera',
      '@stripe/stripe-react-native'
    ],
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      eas: {
        projectId: 'your-project-id'
      }
    }
  }
}; 