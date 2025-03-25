import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  avatar: string;
  recipesCreated: number;
  createdAt: string;
  subscriptionTier: 'free' | 'premium';
  subscriptionStatus: 'active' | 'canceled' | 'trial' | 'expired';
  trialEndDate?: string;
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
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Error restoring user session:', err);
        setError('Failed to restore user session');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // This is a simplified mock login - in a real app, you'd call an API
      // For demo purposes, any email/password will work
      
      // Create a demo user object for any login
      const userObj: User = {
        id: `user_${Date.now()}`,
        email,
        firstName: email.split('@')[0],
        lastName: 'User',
        name: `${email.split('@')[0]} User`,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          email.split('@')[0]
        )}`,
        recipesCreated: 0,
        createdAt: new Date().toISOString(),
        subscriptionTier: 'free',
        subscriptionStatus: 'trial',
        trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days trial
      };

      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // This is a simplified mock signup - in a real app, you'd call an API
      // Create a new user object
      const userObj: User = {
        id: `user_${Date.now()}`,
        email,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          `${firstName} ${lastName}`
        )}`,
        recipesCreated: 0,
        createdAt: new Date().toISOString(),
        subscriptionTier: 'free',
        subscriptionStatus: 'trial',
        trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days trial
      };

      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      setUser(null);
      localStorage.removeItem('user');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
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