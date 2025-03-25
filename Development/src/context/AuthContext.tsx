import React, { createContext, useContext, useState, useEffect } from 'react';
import Airtable from 'airtable';
import type { User as AirtableUser } from '../services/airtable';

// Initialize Airtable with API key and base ID from environment variables
const base = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY, // Use environment variables
}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID || ''); // Fallback to an empty string

const usersTable = base('Users');

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  avatar: string;
  recipesCreated: number;
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

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Default to true until auth check is complete
  const [error, setError] = useState<string | null>(null);
  const [useAirtable, setUseAirtable] = useState(false);

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

    const testAirtable = async () => {
      try {
        await usersTable.select({ maxRecords: 1 }).firstPage();
        setUseAirtable(true);
      } catch (err) {
        console.warn('Airtable connection failed, falling back to local auth');
        setUseAirtable(false);
      }
    };

    checkAuth();
    testAirtable();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      let userObj: User;

      if (useAirtable) {
        const records = await usersTable
          .select({ filterByFormula: `{Email} = '${email}'` })
          .firstPage();

        if (records.length === 0) {
          throw new Error('User not found');
        }

        const airtableUser = records[0].fields as unknown as AirtableUser;
        userObj = {
          id: records[0].id,
          email: airtableUser.Email,
          firstName: airtableUser['First Name'],
          lastName: airtableUser['Last Name'],
          name: `${airtableUser['First Name']} ${airtableUser['Last Name']}`,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            `${airtableUser['First Name']} ${airtableUser['Last Name']}`
          )}`,
          recipesCreated: 0,
        };
      } else {
        userObj = {
          id: `user_${Date.now()}`,
          email,
          firstName: email.split('@')[0],
          lastName: 'User',
          name: `${email.split('@')[0]} User`,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            email.split('@')[0]
          )}`,
          recipesCreated: 0,
        };
      }

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
      let userObj: User;

      if (useAirtable) {
        const existingRecords = await usersTable
          .select({ filterByFormula: `{Email} = '${email}'` })
          .firstPage();

        if (existingRecords.length > 0) {
          throw new Error('User already exists');
        }

        const record = await usersTable.create({
          Email: email,
          'First Name': firstName,
          'Last Name': lastName,
        });

        const airtableUser = record.fields as unknown as AirtableUser;
        userObj = {
          id: record.id,
          email: airtableUser.Email,
          firstName: airtableUser['First Name'],
          lastName: airtableUser['Last Name'],
          name: `${airtableUser['First Name']} ${airtableUser['Last Name']}`,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            `${airtableUser['First Name']} ${airtableUser['Last Name']}`
          )}`,
          recipesCreated: 0,
        };
      } else {
        userObj = {
          id: `user_${Date.now()}`,
          email,
          firstName,
          lastName,
          name: `${firstName} ${lastName}`,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            `${firstName} ${lastName}`
          )}`,
          recipesCreated: 0,
        };
      }

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

export { AuthProvider };