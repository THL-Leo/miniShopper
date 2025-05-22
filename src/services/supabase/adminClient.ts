import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseServiceRoleKey = Constants.expoConfig?.extra?.supabaseServiceRoleKey;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase admin configuration. Please check your app.config.js');
}

// Create a separate client with the service role key for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Example admin operations:
export const adminOperations = {
  // Approve a store application
  approveStore: async (storeId: string) => {
    return supabaseAdmin
      .from('stores')
      .update({ status: 'approved' })
      .eq('id', storeId);
  },

  // Get all pending store applications
  getPendingStores: async () => {
    return supabaseAdmin
      .from('stores')
      .select(`
        *,
        owner:profiles(*)
      `)
      .eq('status', 'pending');
  },

  // Suspend a store
  suspendStore: async (storeId: string, reason: string) => {
    return supabaseAdmin
      .from('stores')
      .update({ 
        status: 'suspended',
        suspension_reason: reason
      })
      .eq('id', storeId);
  }
}; 