import React, { createContext, useContext, useState, useEffect } from 'react';
import Airtable from 'airtable';
import type { User as AirtableUser } from '../services/airtable';
import type { Recipe } from '../utils/recipeData';

// Initialize Airtable with API key and base ID from environment variables API key and base ID from environment variables
const base = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY, // Use environment variables
}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID || ''); // Fallback to an empty string}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID || ''); // Fallback to an empty string

const usersTable = base('Users');const usersTable = base('Users');

interface User {r {
  id: string;
  email: string;
  firstName: string;;
  lastName: string;g;
  name: string;
  avatar: string;
  recipesCreated: number; number;
  socialLinks?: {
    instagram?: string;
    facebook?: string;;
    twitter?: string;
    website?: string;
    youtube?: string;e?: string;
  }; };
}}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;ring, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>; updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined); AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => { = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Default to true until auth check is completeault to true until auth check is complete
  const [error, setError] = useState<string | null>(null););
  const [useAirtable, setUseAirtable] = useState(false); const [useAirtable, setUseAirtable] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {heckAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');= localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));r(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Error restoring user session:', err); err);
        setError('Failed to restore user session');user session');
      } finally {
        setIsLoading(false);false);
      }
    };    };

    const testAirtable = async () => {tAirtable = async () => {
      try {
        await usersTable.select({ maxRecords: 1 }).firstPage();Page();
        setUseAirtable(true);
      } catch (err) {
        console.warn('Airtable connection failed, falling back to local auth'); connection failed, falling back to local auth');
        setUseAirtable(false); setUseAirtable(false);
      }}
    };    };

    checkAuth();
    testAirtable();
  }, []);  }, []);

  const login = async (email: string, password: string) => {rd: string) => {
    setIsLoading(true);ue);
    setError(null);    setError(null);

    try {
      let userObj: User;serObj: User;

      if (useAirtable) {
        const records = await usersTable
          .select({ filterByFormula: `{Email} = '${email}'` })rmula: `{Email} = '${email}'` })
          .firstPage();   .firstPage();

        if (records.length === 0) {
          throw new Error('User not found'); throw new Error('User not found');
        }        }

        const airtableUser = records[0].fields as unknown as AirtableUser;rtableUser;
        userObj = {
          id: records[0].id,
          email: airtableUser.Email,
          firstName: airtableUser['First Name'],
          lastName: airtableUser['Last Name'],
          name: `${airtableUser['First Name']} ${airtableUser['Last Name']}`,]}`,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent((
            `${airtableUser['First Name']} ${airtableUser['Last Name']}`ableUser['First Name']} ${airtableUser['Last Name']}`
          )}`,
          recipesCreated: 0,
        };
      } else {
        userObj = {
          id: `user_${Date.now()}`,er_${Date.now()}`,
          email,
          firstName: email.split('@')[0],
          lastName: 'User',
          name: `${email.split('@')[0]} User`,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(vatars.com/api/?name=${encodeURIComponent(
            email.split('@')[0]plit('@')[0]
          )}`,
          recipesCreated: 0,recipesCreated: 0,
        }; };
      }      }

      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));setItem('user', JSON.stringify(userObj));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');rr instanceof Error ? err.message : 'Login failed');
      throw err;;
    } finally {
      setIsLoading(false);IsLoading(false);
    }}
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {(email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    setError(null);Error(null);

    try {
      let userObj: User;      let userObj: User;

      if (useAirtable) {
        const existingRecords = await usersTable
          .select({ filterByFormula: `{Email} = '${email}'` })terByFormula: `{Email} = '${email}'` })
          .firstPage();  .firstPage();

        if (existingRecords.length > 0) {
          throw new Error('User already exists'); throw new Error('User already exists');
        }        }

        const record = await usersTable.create({await usersTable.create({
          Email: email,
          'First Name': firstName,
          'Last Name': lastName,Last Name': lastName,
        });

        const airtableUser = record.fields as unknown as AirtableUser;bleUser = record.fields as unknown as AirtableUser;
        userObj = {
          id: record.id,
          email: airtableUser.Email,
          firstName: airtableUser['First Name'],],
          lastName: airtableUser['Last Name'],
          name: `${airtableUser['First Name']} ${airtableUser['Last Name']}`,]}`,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent((
            `${airtableUser['First Name']} ${airtableUser['Last Name']}`{airtableUser['First Name']} ${airtableUser['Last Name']}`
          )}`,
          recipesCreated: 0,recipesCreated: 0,
        };
      } else {
        userObj = {
          id: `user_${Date.now()}`,
          email,
          firstName,
          lastName,
          name: `${firstName} ${lastName}`,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(${encodeURIComponent(
            `${firstName} ${lastName}`
          )}`,
          recipesCreated: 0,recipesCreated: 0,
        }; };
      }

      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));setItem('user', JSON.stringify(userObj));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');rr instanceof Error ? err.message : 'Signup failed');
      throw err;;
    } finally {
      setIsLoading(false);Loading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);rror(null);

    try {
      setUser(null);
      localStorage.removeItem('user');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');ror ? err.message : 'Logout failed');
      throw err;
    } finally {
      setIsLoading(false); setIsLoading(false);
    }}
  };  };

  const updateProfile = async (updates: Partial<User>) => { async (updates: Partial<User>) => {
    setIsLoading(true);
    setError(null);ll);

    try {
      if (!user) {
        throw new Error('No user logged in');;
      }      }

      const updatedUser = { ...user, ...updates }; ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));tem('user', JSON.stringify(updatedUser));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Profile update failed');anceof Error ? err.message : 'Profile update failed');
      throw err;
    } finally {
      setIsLoading(false); setIsLoading(false);
    }
  };  };

  const value = {alue = {
    user,
    isLoading,ing,
    error,
    login,
    signup,
    logout,
    updateProfile,updateProfile,
  };  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;value={value}>{children}</AuthContext.Provider>;
};};

export { AuthProvider };rt { AuthProvider };

import React, { createContext, useContext, useState } from 'react';reateContext, useContext, useState } from 'react';
import type { Recipe } from '../utils/recipeData';Recipe } from '../utils/recipeData';

interface ChefFreddieContextType {eContextType {
  isVisible: boolean;an;
  showChefFreddie: () => void; => void;
  hideChefFreddie: () => void;=> void;
  currentRecipe: Recipe | null; null;
  setCurrentRecipe: (recipe: Recipe | null) => void;| null) => void;
  recommendedRecipe: Recipe | null;ecipe | null;
  setRecommendedRecipe: (recipe: Recipe | null) => void;pe: (recipe: Recipe | null) => void;
  getContextualHelp: (route: string) => string; (route: string) => string;
}

const ChefFreddieContext = createContext<ChefFreddieContextType | undefined>(undefined);FreddieContext = createContext<ChefFreddieContextType | undefined>(undefined);

const ChefFreddieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {eProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);= useState(false);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);nst [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [recommendedRecipe, setRecommendedRecipe] = useState<Recipe | null>(null);const [recommendedRecipe, setRecommendedRecipe] = useState<Recipe | null>(null);

  const showChefFreddie = () => setIsVisible(true);> setIsVisible(true);
  const hideChefFreddie = () => setIsVisible(false);e);

  const getContextualHelp = (route: string): string => {
    const routeHelpMap: Record<string, string> = { const routeHelpMap: Record<string, string> = {
      '/': 'Welcome to the dashboard! Here you can explore recipes and manage your cooking journey.',me to the dashboard! Here you can explore recipes and manage your cooking journey.',
      '/create-recipe': 'Here you can create your own recipes. Add ingredients, steps, and more!',    '/create-recipe': 'Here you can create your own recipes. Add ingredients, steps, and more!',
      '/my-cookbook': 'View and manage your saved recipes in your personal cookbook.',      '/my-cookbook': 'View and manage your saved recipes in your personal cookbook.',
      '/butcher-shop': 'Explore and purchase ingredients from the butcher shop.',tcher shop.',





























export { ChefFreddieProvider, useChefFreddie };};  return context;  }    throw new Error('useChefFreddie must be used within a ChefFreddieProvider');  if (!context) {  const context = useContext(ChefFreddieContext);const useChefFreddie = () => {};  return <ChefFreddieContext.Provider value={value}>{children}</ChefFreddieContext.Provider>;  };    getContextualHelp,    setRecommendedRecipe,    recommendedRecipe,    setCurrentRecipe,    currentRecipe,    hideChefFreddie,    showChefFreddie,    isVisible,  const value: ChefFreddieContextType = {  };    return routeHelpMap[route] || 'Explore the app and discover new features!';    };      '/profile': 'Manage your profile, preferences, and account settings.',      '/profile': 'Manage your profile, preferences, and account settings.',
    };




export { ChefFreddieProvider, useChefFreddie };
};
  return context;  }    throw new Error('useChefFreddie must be used within a ChefFreddieProvider');




  if (!context) {  const context = useContext(ChefFreddieContext);const useChefFreddie = () => {
};
  return <ChefFreddieContext.Provider value={value}>{children}</ChefFreddieContext.Provider>;
    return routeHelpMap[route] || 'Explore the app and discover new features!';
  };

  };
    getContextualHelp,
    setRecommendedRecipe,
    recommendedRecipe,




    setCurrentRecipe,    currentRecipe,    hideChefFreddie,    showChefFreddie,    isVisible,
  const value: ChefFreddieContextType = {