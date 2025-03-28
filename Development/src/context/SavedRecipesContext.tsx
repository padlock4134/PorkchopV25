import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';  // Add this import
import { useDatabase } from './DatabaseContext';
import type { Recipe } from '../utils/recipeData';

interface Collection {
  id: string;
  name: string;
  description: string;
  recipeIds: string[];
  createdAt: string;
  updatedAt: string;
}

interface SavedRecipesContextType {
  savedRecipes: Recipe[];
  collections: Collection[];
  isLoading: boolean;
  error: Error | null;
  addToSaved: (recipe: Recipe) => Promise<void>;
  removeFromSaved: (recipeId: string) => Promise<void>;
  createCollection: (name: string, description: string) => Promise<void>;
  updateCollection: (id: string, updates: Partial<Collection>) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  addToCollection: (collectionId: string, recipeId: string) => Promise<void>;
  removeFromCollection: (collectionId: string, recipeId: string) => Promise<void>;
  isRecipeSaved: (recipeId: string) => boolean;
  getRecipeCollections: (recipeId: string) => Collection[];
  addRecipe: (recipe: Recipe) => Promise<void>;
  removeRecipe: (id: string) => Promise<void>;
}

const SavedRecipesContext = createContext<SavedRecipesContextType | undefined>(undefined);

export const SavedRecipesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();  // Now this will work
  const db = useDatabase();
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // In a real app, you would load data from the database here
        // For now, we're just setting the loading state to false
        
        // Mock data loading delay
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (err) {
        console.error('Error loading saved recipes:', err);
        setError(err instanceof Error ? err : new Error('Failed to load saved recipes'));
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [user?.id]);

  const value: SavedRecipesContextType = {
    savedRecipes,
    collections,
    isLoading,
    error,
    addToSaved: async (recipe: Recipe) => {
      // Implementation
    },
    removeFromSaved: async (recipeId: string) => {
      // Implementation
    },
    createCollection: async (name: string, description: string) => {
      // Implementation
    },
    updateCollection: async (id: string, updates: Partial<Collection>) => {
      // Implementation
    },
    deleteCollection: async (id: string) => {
      // Implementation
    },
    addToCollection: async (collectionId: string, recipeId: string) => {
      // Implementation
    },
    removeFromCollection: async (collectionId: string, recipeId: string) => {
      // Implementation
    },
    isRecipeSaved: (recipeId: string) => {
      // Implementation
      return false;
    },
    getRecipeCollections: (recipeId: string) => {
      // Implementation
      return [];
    },
    addRecipe: async (recipe: Recipe) => {
      // Implementation
    },
    removeRecipe: async (id: string) => {
      // Implementation
    }
  };

  return (
    <SavedRecipesContext.Provider value={value}>
      {children}
    </SavedRecipesContext.Provider>
  );
};

export const useSavedRecipes = () => {
  const context = useContext(SavedRecipesContext);
  if (!context) {
    throw new Error('useSavedRecipes must be used within a SavedRecipesProvider');
  }
  return context;
};