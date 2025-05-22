import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

// Mock the Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(),
    auth: {
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
    }
  }))
}));

describe('Supabase Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create client with correct configuration', () => {
    const { supabase } = require('../../services/supabase/client');
    
    expect(createClient).toHaveBeenCalledWith(
      'https://test-project.supabase.co',
      'test-anon-key',
      expect.objectContaining({
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
          storage: AsyncStorage
        }
      })
    );
  });

  it('should have required methods available', () => {
    const { supabase } = require('../../services/supabase/client');
    expect(supabase.auth).toBeDefined();
    expect(supabase.from).toBeDefined();
  });

  it('should have correct auth configuration', () => {
    const { supabase } = require('../../services/supabase/client');
    expect(supabase.auth.signUp).toBeDefined();
    expect(supabase.auth.signIn).toBeDefined();
    expect(supabase.auth.signOut).toBeDefined();
  });
}); 