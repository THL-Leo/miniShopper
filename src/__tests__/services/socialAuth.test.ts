import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';

// Mock dependencies BEFORE importing the service
jest.mock('../../services/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithIdToken: jest.fn(),
    },
    from: jest.fn(() => ({
      upsert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
  },
}));

jest.mock('expo-web-browser');
jest.mock('expo-auth-session/providers/google');
jest.mock('expo-apple-authentication');
jest.mock('expo-constants', () => ({
  expoConfig: {
    extra: {
      googleClientIds: {
        ios: 'mock-ios-client-id',
        android: 'mock-android-client-id',
        expo: 'mock-expo-client-id',
        web: 'mock-web-client-id',
      },
    },
  },
  appOwnership: 'expo',
}));

// Now import after mocking
import { SocialAuthService } from '../../services/auth/SocialAuthService';
import { supabase } from '../../services/supabase/client';

describe('SocialAuthService', () => {
  let socialAuthService: SocialAuthService;
  
  beforeEach(() => {
    socialAuthService = new SocialAuthService();
    jest.clearAllMocks();
  });

  describe('Google Authentication', () => {
    it('should authenticate with Google successfully', async () => {
      // Mock Google auth response
      const mockPromptAsync = jest.fn().mockResolvedValue({
        type: 'success',
        params: {
          id_token: 'mock-id-token',
          access_token: 'mock-access-token',
        },
      });

      (Google.useAuthRequest as jest.Mock).mockReturnValue([
        null,
        null,
        mockPromptAsync,
      ]);

      // Mock Supabase responses
      const mockUser = {
        id: 'google123',
        email: 'test@gmail.com',
        user_metadata: {
          full_name: 'Test User',
          avatar_url: 'https://example.com/photo.jpg',
        },
      };

      (supabase.auth.signInWithIdToken as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockProfile = {
        id: 'google123',
        email: 'test@gmail.com',
        name: 'Test User',
        role: 'customer',
        avatar_url: 'https://example.com/photo.jpg',
      };

      (supabase.from as jest.Mock).mockReturnValue({
        upsert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockProfile,
              error: null,
            }),
          }),
        }),
      });

      const result = await socialAuthService.signInWithGoogle();

      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockProfile);
      expect(mockPromptAsync).toHaveBeenCalled();
      expect(supabase.auth.signInWithIdToken).toHaveBeenCalledWith({
        provider: 'google',
        token: 'mock-id-token',
        access_token: 'mock-access-token',
      });
    });

    it('should handle Google auth cancellation', async () => {
      const mockPromptAsync = jest.fn().mockResolvedValue({
        type: 'cancel',
      });

      (Google.useAuthRequest as jest.Mock).mockReturnValue([
        null,
        null,
        mockPromptAsync,
      ]);

      const result = await socialAuthService.signInWithGoogle();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Google authentication was cancelled');
    });

    it('should handle Google auth error', async () => {
      const mockPromptAsync = jest.fn().mockResolvedValue({
        type: 'error',
        error: { message: 'Failed to authenticate' },
      });

      (Google.useAuthRequest as jest.Mock).mockReturnValue([
        null,
        null,
        mockPromptAsync,
      ]);

      const result = await socialAuthService.signInWithGoogle();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to authenticate');
    });
  });

  describe('Apple Authentication', () => {
    it('should authenticate with Apple successfully', async () => {
      // Mock Apple sign in response
      const mockAppleCredential = {
        user: 'apple123',
        email: 'test@icloud.com',
        fullName: { givenName: 'Test', familyName: 'User' },
        identityToken: 'mock-identity-token',
      };

      (AppleAuthentication.signInAsync as jest.Mock).mockResolvedValue(mockAppleCredential);

      // Mock Supabase responses
      const mockUser = {
        id: 'apple123',
        email: 'test@icloud.com',
      };

      (supabase.auth.signInWithIdToken as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockProfile = {
        id: 'apple123',
        email: 'test@icloud.com',
        name: 'Test User',
        role: 'customer',
      };

      (supabase.from as jest.Mock).mockReturnValue({
        upsert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockProfile,
              error: null,
            }),
          }),
        }),
      });

      const result = await socialAuthService.signInWithApple();

      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockProfile);
      expect(supabase.auth.signInWithIdToken).toHaveBeenCalledWith({
        provider: 'apple',
        token: 'mock-identity-token',
      });
    });

    it('should handle Apple auth cancellation', async () => {
      // Create an error object that matches the service's error handling logic
      const cancellationError = new Error('User cancelled');
      (cancellationError as any).code = 1000;

      (AppleAuthentication.signInAsync as jest.Mock).mockRejectedValue(cancellationError);

      const result = await socialAuthService.signInWithApple();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Apple authentication was cancelled');
    });

    it('should handle Apple auth error', async () => {
      (AppleAuthentication.signInAsync as jest.Mock).mockRejectedValue(
        new Error('Failed to authenticate with Apple')
      );

      const result = await socialAuthService.signInWithApple();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to authenticate with Apple');
    });
  });
}); 