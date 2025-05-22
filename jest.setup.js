// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      supabaseUrl: process.env.SUPABASE_URL || 'https://test-project.supabase.co',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'test-anon-key',
      supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-service-role-key',
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_mock',
      stripeSecretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_mock',
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || 'test-maps-key',
      appName: process.env.APP_NAME || 'MiniShoppers',
      transactionFee: parseInt(process.env.TRANSACTION_FEE || '10'),
      monthlySubscriptionFee: parseInt(process.env.MONTHLY_SUBSCRIPTION_FEE || '300'),
    }
  }
})); 