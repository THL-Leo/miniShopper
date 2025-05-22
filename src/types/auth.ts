export type UserRole = 'customer' | 'store_owner' | 'admin';

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
} 