import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { AuthResult } from '../../types/auth';
import { supabase } from '../supabase/client';

WebBrowser.maybeCompleteAuthSession();

export class SocialAuthService {
  private readonly googleClientIds: {
    ios?: string;
    android?: string;
    expo?: string;
    web?: string;
  };

  constructor() {
    // Get Google client IDs from environment variables
    this.googleClientIds = Constants.expoConfig?.extra?.googleClientIds || {};
    
    if (!this.googleClientIds.ios && !this.googleClientIds.android && !this.googleClientIds.expo) {
      console.warn('Google Client IDs not configured for any platform');
    }
  }

  private getGoogleClientId(): string | undefined {
    // Return the appropriate client ID based on the platform and environment
    if (Constants.appOwnership === 'expo') {
      // Running in Expo Go
      return this.googleClientIds.expo;
    } else if (Platform.OS === 'ios') {
      // Running on iOS device/simulator
      return this.googleClientIds.ios;
    } else if (Platform.OS === 'android') {
      // Running on Android device/emulator
      return this.googleClientIds.android;
    } else if (Platform.OS === 'web') {
      // Running on web
      return this.googleClientIds.web;
    }
    
    return undefined;
  }

  async signInWithGoogle(): Promise<AuthResult> {
    try {
      const clientId = this.getGoogleClientId();
      
      if (!clientId) {
        return { 
          success: false, 
          error: `Google Client ID not configured for platform: ${Platform.OS}` 
        };
      }

      const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: this.googleClientIds.android,
        iosClientId: this.googleClientIds.ios,
        clientId: this.googleClientIds.expo || this.googleClientIds.web, // For Expo Go and web
        webClientId: this.googleClientIds.web,
      });

      // Trigger the authentication flow
      const result = await promptAsync();

      if (result?.type === 'success') {
        const { id_token, access_token } = result.params;
        
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: id_token,
          access_token,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (!data.user) {
          return { success: false, error: 'No user data returned' };
        }

        // Get or create user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
            role: 'customer',
            avatar_url: data.user.user_metadata?.avatar_url,
          })
          .select()
          .single();

        if (profileError) {
          return { success: false, error: profileError.message };
        }

        return { success: true, user: profileData };
      }

      if (result?.type === 'cancel') {
        return { success: false, error: 'Google authentication was cancelled' };
      }

      return { 
        success: false, 
        error: result?.type === 'error' ? result.error?.message : 'Failed to authenticate with Google' 
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }

  async signInWithApple(): Promise<AuthResult> {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const { identityToken, email, fullName } = credential;

      if (!identityToken) {
        return { success: false, error: 'No identity token returned from Apple' };
      }

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: identityToken,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'No user data returned' };
      }

      // Construct name from Apple response
      const name = fullName 
        ? `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim()
        : email?.split('@')[0] || '';

      // Get or create user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          email: email || data.user.email,
          name: name,
          role: 'customer',
        })
        .select()
        .single();

      if (profileError) {
        return { success: false, error: profileError.message };
      }

      return { success: true, user: profileData };
    } catch (error: unknown) {
      if (error instanceof Error && 'code' in error && error.code === 1000) {
        return { success: false, error: 'Apple authentication was cancelled' };
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to authenticate with Apple'
      };
    }
  }
} 