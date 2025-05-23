import * as AppleAuthentication from 'expo-apple-authentication';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants/design';
import { SocialAuthService } from '../../services/auth/SocialAuthService';

interface Props {
  onAuthSuccess: () => void;
  onAuthError: (error: string) => void;
}

export const SocialAuthButtons: React.FC<Props> = ({ onAuthSuccess, onAuthError }) => {
  const socialAuthService = new SocialAuthService();

  const handleGoogleSignIn = async () => {
    try {
      const result = await socialAuthService.signInWithGoogle();
      if (result.success) {
        onAuthSuccess();
      } else {
        onAuthError(result.error || 'Failed to sign in with Google');
      }
    } catch (error) {
      onAuthError('An unexpected error occurred');
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const result = await socialAuthService.signInWithApple();
      if (result.success) {
        onAuthSuccess();
      } else {
        onAuthError(result.error || 'Failed to sign in with Apple');
      }
    } catch (error) {
      onAuthError('An unexpected error occurred');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.googleButton]}
        onPress={handleGoogleSignIn}
        testID="google-auth-button"
      >
        <Text style={[styles.buttonText, styles.googleButtonText]}>
          Continue with Google
        </Text>
      </TouchableOpacity>

      {Platform.OS === 'ios' && (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={8}
          style={styles.appleButton}
          onPress={handleAppleSignIn}
          testID="apple-auth-button"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonText: {
    fontWeight: '500',
    fontSize: TYPOGRAPHY.sizes.base,
  },
  googleButtonText: {
    color: COLORS.text.primary,
  },
  appleButton: {
    height: 48,
    width: '100%',
  },
}); 