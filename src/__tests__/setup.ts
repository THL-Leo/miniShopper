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

// Mock expo-constants with test values
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      supabaseUrl: 'https://test-project.supabase.co',
      supabaseAnonKey: 'test-anon-key',
      supabaseServiceRoleKey: 'test-service-role-key',
      stripePublishableKey: 'pk_test_mock',
      stripeSecretKey: 'sk_test_mock',
      googleMapsApiKey: 'test-maps-key',
      appName: 'MiniShoppers',
      transactionFee: 10,
      monthlySubscriptionFee: 300,
    }
  }
})); 