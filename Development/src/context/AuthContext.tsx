import React, { createContext, useContext, useState, useEffect } from 'react';
import { setStorageItem, getStorageItem, removeStorageItem } from '../utils/localStorage';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  avatar: string;
  recipesCreated: number;
  createdAt: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    website?: string;
    youtube?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const USER_STORAGE_KEY = 'porkchop_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = getStorageItem<User | null>(USER_STORAGE_KEY, null);
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, we'd validate credentials against an API
      // For now, we'll create a mock user with the provided email
      
      // Simple email validation
      if (!email.includes('@')) {
        throw new Error('Invalid email format');
      }
      
      // Simple password validation
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        firstName: email.split('@')[0],
        lastName: 'User',
        name: `${email.split('@')[0]} User`,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          email.split('@')[0]
        )}`,
        recipesCreated: 0,
        createdAt: new Date().toISOString()
      };

      setUser(newUser);
      setStorageItem(USER_STORAGE_KEY, newUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simple email validation
      if (!email.includes('@')) {
        throw new Error('Invalid email format');
      }
      
      // Simple password validation
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          `${firstName} ${lastName}`
        )}`,
        recipesCreated: 0,
        createdAt: new Date().toISOString()
      };

      setUser(newUser);
      setStorageItem(USER_STORAGE_KEY, newUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      setUser(null);
      removeStorageItem(USER_STORAGE_KEY);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      const updatedUser = { ...user, ...updates };
      
      // Update the name if first name or last name changed
      if (updates.firstName || updates.lastName) {
        updatedUser.name = `${updatedUser.firstName} ${updatedUser.lastName}`;
      }

      setUser(updatedUser);
      setStorageItem(USER_STORAGE_KEY, updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Profile update failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};