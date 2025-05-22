module.exports = {
  name: 'MiniShoppers',
  slug: 'mini-shoppers',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#2563EB'
  },
  extra: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    appName: process.env.APP_NAME,
    transactionFee: process.env.TRANSACTION_FEE,
    monthlySubscriptionFee: process.env.MONTHLY_SUBSCRIPTION_FEE,
  },
  plugins: [
    'expo-location',
    'expo-camera',
    '@stripe/stripe-react-native'
  ],
  ios: {
    bundleIdentifier: 'com.minishoppers.app',
    supportsTablet: true,
    infoPlist: {
      NSLocationWhenInUseUsageDescription: 'Find nearby stores on MiniShoppers',
      NSCameraUsageDescription: 'Scan QR codes to order from local stores'
    }
  },
  android: {
    package: 'com.minishoppers.app',
    permissions: [
      'ACCESS_FINE_LOCATION',
      'CAMERA'
    ]
  }
}; 