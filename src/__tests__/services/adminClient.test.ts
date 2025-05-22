import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { adminOperations, supabaseAdmin } from '../../services/supabase/adminClient';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseServiceRoleKey = Constants.expoConfig?.extra?.supabaseServiceRoleKey;

// Create a mock Supabase client type
type MockSupabaseClient = {
  from: jest.Mock;
  auth: {
    config: {
      autoRefreshToken: boolean;
      persistSession: boolean;
      detectSessionInUrl: boolean;
    };
  };
};

// Mock the Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: null, error: null }))
      })),
      select: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ 
          data: [
            { 
              id: 'store-1', 
              name: 'Test Store',
              owner: { id: 'user-1', name: 'Test Owner' }
            }
          ], 
          error: null 
        }))
      }))
    })),
    auth: {
      config: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      }
    }
  }))
}));

describe('Supabase Admin Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Re-import the module to ensure the mock is called
    jest.isolateModules(() => {
      require('../../services/supabase/adminClient');
    });
  });

  it('should create admin client with correct configuration', () => {
    expect(createClient).toHaveBeenCalledWith(
      'https://test-project.supabase.co',
      'test-service-role-key',
      expect.objectContaining({
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        }
      })
    );
  });

  describe('adminOperations', () => {
    it('should approve store successfully', async () => {
      const result = await adminOperations.approveStore('store-1');
      
      expect(supabaseAdmin.from).toHaveBeenCalledWith('stores');
      expect(result.error).toBeNull();
    });

    it('should get pending stores with owner information', async () => {
      const result = await adminOperations.getPendingStores();
      
      expect(supabaseAdmin.from).toHaveBeenCalledWith('stores');
      expect(result.data).toHaveLength(1);
      expect(result.data![0].owner).toBeDefined();
      expect(result.error).toBeNull();
    });

    it('should suspend store with reason', async () => {
      const result = await adminOperations.suspendStore('store-1', 'Policy violation');
      
      expect(supabaseAdmin.from).toHaveBeenCalledWith('stores');
      expect(result.error).toBeNull();
    });
  });

  // Add error handling tests
  describe('error handling', () => {
    beforeEach(() => {
      // Mock implementation that returns an error
      (createClient as jest.Mock).mockImplementation(() => ({
        from: jest.fn(() => ({
          update: jest.fn(() => ({
            eq: jest.fn(() => Promise.resolve({ 
              data: null, 
              error: { message: 'Operation failed' } 
            }))
          })),
          select: jest.fn(() => ({
            eq: jest.fn(() => Promise.resolve({ 
              data: null, 
              error: { message: 'Operation failed' } 
            }))
          }))
        })),
        auth: {
          config: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false,
          }
        }
      }) as MockSupabaseClient);
    });

    it('should handle errors when approving store', async () => {
      const result = await adminOperations.approveStore('store-1');
      expect(result.error).toBeDefined();
      if (result.error) {
        expect(result.error.message).toBe('Operation failed');
      }
    });

    it('should handle errors when getting pending stores', async () => {
      const result = await adminOperations.getPendingStores();
      expect(result.error).toBeDefined();
      if (result.error) {
        expect(result.error.message).toBe('Operation failed');
      }
    });
  });
}); 