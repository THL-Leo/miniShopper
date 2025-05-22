import { AuthService } from '../../services/auth/AuthService';
import { SignInData, SignUpData } from '../../services/auth/types';
import { supabase } from '../../services/supabase/client';

// Mock Supabase client
jest.mock('../../services/supabase/client', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn()
    },
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({
            data: {
              id: 'test-user-id',
              email: 'test@example.com',
              name: 'Test User',
              role: 'customer'
            },
            error: null
          }))
        }))
      })),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({
            data: {
              id: 'test-user-id',
              email: 'test@example.com',
              name: 'Test User',
              role: 'customer'
            },
            error: null
          }))
        }))
      }))
    }))
  }
}));

describe('AuthService', () => {
  let authService: AuthService;
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    role: 'customer' as const
  };

  const mockSignUpData: SignUpData = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User',
    role: 'customer'
  };

  const mockSignInData: SignInData = {
    email: 'test@example.com',
    password: 'password123'
  };

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should create a new user account successfully', async () => {
      // Mock successful signup
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: { id: mockUser.id, email: mockUser.email }, session: null },
        error: null
      });

      const result = await authService.signUp(mockSignUpData);

      expect(result.success).toBe(true);
      expect(result.user).toEqual(expect.objectContaining({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role
      }));
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: mockSignUpData.email,
        password: mockSignUpData.password
      });
    });

    it('should handle signup errors', async () => {
      // Mock signup error
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Email already registered' }
      });

      const result = await authService.signUp(mockSignUpData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email already registered');
    });
  });

  describe('signIn', () => {
    it('should sign in user successfully', async () => {
      // Mock successful sign in
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { 
          user: { id: mockUser.id, email: mockUser.email },
          session: { access_token: 'test-token' }
        },
        error: null
      });

      const result = await authService.signIn(mockSignInData);

      expect(result.success).toBe(true);
      expect(result.user).toEqual(expect.objectContaining({
        id: mockUser.id,
        email: mockUser.email
      }));
    });

    it('should handle invalid credentials', async () => {
      // Mock sign in error
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid credentials' }
      });

      const result = await authService.signIn(mockSignInData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });
  });

  describe('signOut', () => {
    it('should sign out user successfully', async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: null
      });

      const result = await authService.signOut();

      expect(result.success).toBe(true);
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it('should handle sign out errors', async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: { message: 'Network error' }
      });

      const result = await authService.signOut();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user if session exists', async () => {
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: {
          session: {
            user: { id: mockUser.id, email: mockUser.email }
          }
        },
        error: null
      });

      const result = await authService.getCurrentUser();

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.id).toBe(mockUser.id);
    });

    it('should return null if no session exists', async () => {
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
        error: null
      });

      const result = await authService.getCurrentUser();

      expect(result.success).toBe(true);
      expect(result.user).toBeUndefined();
    });
  });
}); 