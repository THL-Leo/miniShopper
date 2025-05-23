// Mock all dependencies BEFORE importing the component
jest.mock('expo-apple-authentication', () => ({
  AppleAuthenticationButton: 'AppleAuthenticationButton',
  AppleAuthenticationButtonType: {
    SIGN_IN: 'SIGN_IN',
  },
  AppleAuthenticationButtonStyle: {
    BLACK: 'BLACK',
  },
  AppleAuthenticationScope: {
    FULL_NAME: 'FULL_NAME',
    EMAIL: 'EMAIL',
  },
}));

jest.mock('expo-auth-session/providers/google', () => ({
  useAuthRequest: jest.fn(),
}));

jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
}));

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

jest.mock('../../services/auth/SocialAuthService');

jest.mock('../../constants/design', () => ({
  COLORS: {
    border: '#E5E7EB',
    text: {
      primary: '#1F2937',
    },
  },
  SPACING: {
    md: 16,
  },
  TYPOGRAPHY: {
    sizes: {
      base: 16,
    },
  },
}));

// Mock Platform.OS
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn(),
  },
  StyleSheet: {
    create: jest.fn((styles) => styles),
    flatten: jest.fn((styles) => styles),
  },
  Text: 'Text',
  TouchableOpacity: 'TouchableOpacity',
  View: 'View',
}));

import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { SocialAuthButtons } from '../../components/auth/SocialAuthButtons';
import { SocialAuthService } from '../../services/auth/SocialAuthService';

describe('SocialAuthButtons', () => {
  const mockOnAuthSuccess = jest.fn();
  const mockOnAuthError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Google sign in button', () => {
    const { getByText } = render(
      <SocialAuthButtons
        onAuthSuccess={mockOnAuthSuccess}
        onAuthError={mockOnAuthError}
      />
    );

    expect(getByText('Continue with Google')).toBeTruthy();
  });

  it('renders Apple sign in button on iOS', () => {
    const { getByTestId } = render(
      <SocialAuthButtons
        onAuthSuccess={mockOnAuthSuccess}
        onAuthError={mockOnAuthError}
      />
    );

    expect(getByTestId('apple-auth-button')).toBeTruthy();
  });

  it('handles successful Google sign in', async () => {
    // Mock successful Google sign in
    const mockSignInWithGoogle = jest.fn().mockResolvedValue({
      success: true,
      user: { id: '123', email: 'test@example.com' }
    });
    (SocialAuthService as jest.Mock).mockImplementation(() => ({
      signInWithGoogle: mockSignInWithGoogle
    }));

    const { getByText } = render(
      <SocialAuthButtons
        onAuthSuccess={mockOnAuthSuccess}
        onAuthError={mockOnAuthError}
      />
    );

    await act(async () => {
      fireEvent.press(getByText('Continue with Google'));
    });

    expect(mockSignInWithGoogle).toHaveBeenCalled();
    expect(mockOnAuthSuccess).toHaveBeenCalled();
    expect(mockOnAuthError).not.toHaveBeenCalled();
  });

  it('handles Google sign in error', async () => {
    // Mock Google sign in error
    const mockSignInWithGoogle = jest.fn().mockResolvedValue({
      success: false,
      error: 'Failed to sign in'
    });
    (SocialAuthService as jest.Mock).mockImplementation(() => ({
      signInWithGoogle: mockSignInWithGoogle
    }));

    const { getByText } = render(
      <SocialAuthButtons
        onAuthSuccess={mockOnAuthSuccess}
        onAuthError={mockOnAuthError}
      />
    );

    await act(async () => {
      fireEvent.press(getByText('Continue with Google'));
    });

    expect(mockSignInWithGoogle).toHaveBeenCalled();
    expect(mockOnAuthSuccess).not.toHaveBeenCalled();
    expect(mockOnAuthError).toHaveBeenCalledWith('Failed to sign in');
  });

  it('handles Apple sign in success', async () => {
    // Mock successful Apple sign in
    const mockSignInWithApple = jest.fn().mockResolvedValue({
      success: true,
      user: { id: '123', email: 'test@example.com' }
    });
    (SocialAuthService as jest.Mock).mockImplementation(() => ({
      signInWithApple: mockSignInWithApple
    }));

    const { getByTestId } = render(
      <SocialAuthButtons
        onAuthSuccess={mockOnAuthSuccess}
        onAuthError={mockOnAuthError}
      />
    );

    await act(async () => {
      fireEvent.press(getByTestId('apple-auth-button'));
    });

    expect(mockSignInWithApple).toHaveBeenCalled();
    expect(mockOnAuthSuccess).toHaveBeenCalled();
    expect(mockOnAuthError).not.toHaveBeenCalled();
  });

  it('handles Apple sign in error', async () => {
    // Mock Apple sign in error
    const mockSignInWithApple = jest.fn().mockResolvedValue({
      success: false,
      error: 'Failed to sign in'
    });
    (SocialAuthService as jest.Mock).mockImplementation(() => ({
      signInWithApple: mockSignInWithApple
    }));

    const { getByTestId } = render(
      <SocialAuthButtons
        onAuthSuccess={mockOnAuthSuccess}
        onAuthError={mockOnAuthError}
      />
    );

    await act(async () => {
      fireEvent.press(getByTestId('apple-auth-button'));
    });

    expect(mockSignInWithApple).toHaveBeenCalled();
    expect(mockOnAuthSuccess).not.toHaveBeenCalled();
    expect(mockOnAuthError).toHaveBeenCalledWith('Failed to sign in');
  });
}); 