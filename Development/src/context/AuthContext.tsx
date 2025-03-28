import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { GOOGLE_CLIENT_ID } from '../config/google-auth';

interface User {
  id: string;
  uid: string;
  email: string | null;
  displayName: string | null;
  firstName: string;
  lastName: string;
  name: string;
  avatar: string;
  recipesCreated: number;
  createdAt: string;
  subscriptionTier: 'free' | 'premium';
  subscriptionStatus: 'active' | 'canceled' | 'trial' | 'expired';
  trialEndDate?: string;
  chefRank?: string;
  rankLevel?: number;
  preferredCuisines?: string[];
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
  loginWithGoogle: (credential: string) => Promise<void>;
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

  // Initialize with empty user object to prevent undefined errors
  const initialUser: User = {
    id: '',
    uid: '',
    email: null,
    displayName: null,
    firstName: '',
    lastName: '',
    name: '',
    avatar: '',
    recipesCreated: 0,
    createdAt: '',
    subscriptionTier: 'free',
    subscriptionStatus: 'trial',
    socialLinks: {}
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser({ ...initialUser, ...parsedUser });
        } else {
          setUser(null);
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
      const userObj: User = {
        ...initialUser,
        id: `user_${Date.now()}`,
        uid: `uid_${Date.now()}`,
        email,
        displayName: email.split('@')[0],
        firstName: email.split('@')[0],
        lastName: 'User',
        name: `${email.split('@')[0]} User`,
        avatar: '/images/default-avatar.png',
        createdAt: new Date().toISOString(),
        trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
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
      const userObj: User = {
        ...initialUser,
        id: `user_${Date.now()}`,
        uid: `uid_${Date.now()}`,
        email,
        displayName: `${firstName} ${lastName}`,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        avatar: '/images/default-avatar.png',
        createdAt: new Date().toISOString(),
        trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
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

  const loginWithGoogle = async (credential: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const decoded: any = jwtDecode(credential);
      
      const userObj: User = {
        ...initialUser,
        id: `google_${decoded.sub}`,
        uid: `google_${decoded.sub}`,
        email: decoded.email,
        displayName: decoded.name,
        firstName: decoded.given_name || decoded.name.split(' ')[0],
        lastName: decoded.family_name || decoded.name.split(' ').slice(1).join(' '),
        name: decoded.name,
        avatar: decoded.picture || '/images/default-avatar.png',
        createdAt: new Date().toISOString(),
        trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };

      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));
    } catch (err) {
      console.error('Error in Google login:', err);
      setError('Failed to login with Google');
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

      const updatedUser = { 
        ...user, 
        ...updates,
        socialLinks: {
          ...user.socialLinks,
          ...(updates.socialLinks || {})
        }
      };
      
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
    loginWithGoogle,
    logout,
    updateProfile
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};