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
      },
      config: {
        usesAppleSignIn: true,
        googleSignIn: {
          reservedClientId: process.env.GOOGLE_IOS_CLIENT_ID
        }
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
      ],
      config: {
        googleSignIn: {
          apiKey: process.env.GOOGLE_ANDROID_API_KEY,
          certificateHash: process.env.GOOGLE_ANDROID_CERT_HASH
        }
      }
    },
    plugins: [
      'expo-location',
      'expo-camera',
      'expo-web-browser',
      [
        'expo-apple-authentication'
      ]
    ],
    scheme: 'minishoppers',
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      googleClientIds: {
        ios: process.env.GOOGLE_IOS_CLIENT_ID,
        android: process.env.GOOGLE_ANDROID_CLIENT_ID,
        expo: process.env.GOOGLE_EXPO_CLIENT_ID,
        web: process.env.GOOGLE_WEB_CLIENT_ID
      },
      eas: {
        projectId: 'your-project-id'
      }
    }
  }
}; 