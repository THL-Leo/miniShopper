import { supabase } from '../supabase/client';
import { AuthResult, SignInData, SignUpData, User } from './types';

export class AuthService {
  async signUp(data: SignUpData): Promise<AuthResult> {
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (signUpError) {
        return { success: false, error: signUpError.message };
      }

      if (!authData.user) {
        return { success: false, error: 'Failed to create user' };
      }

      // Create user profile in profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: data.email,
          name: data.name,
          role: data.role,
          phone: data.phone,
        })
        .select()
        .single();

      if (profileError) {
        return { success: false, error: profileError.message };
      }

      return {
        success: true,
        user: profileData as User
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }

  async signIn(data: SignInData): Promise<AuthResult> {
    try {
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (signInError) {
        return { success: false, error: signInError.message };
      }

      if (!authData.user) {
        return { success: false, error: 'Failed to sign in' };
      }

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select()
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        return { success: false, error: profileError.message };
      }

      return {
        success: true,
        user: profileData as User
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }

  async signOut(): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }

  async getCurrentUser(): Promise<AuthResult> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        return { success: false, error: error.message };
      }

      if (!session?.user) {
        return { success: true };
      }

      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select()
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        return { success: false, error: profileError.message };
      }

      return {
        success: true,
        user: profileData as User
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }
} 