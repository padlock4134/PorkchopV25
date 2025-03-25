import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { Recipe } from '../utils/recipeData';

interface RouteFeature {
  name: string;
  suggestedQuestions: string[];
}

interface RouteContext {
  description: string;
  features: RouteFeature[];
  suggestedQuestions: string[];
}

interface RecipeContext {
  suggestedQuestions: string[];
}

interface ChefFreddieContextType {
  isVisible: boolean;
  showChefFreddie: () => void;
  hideChefFreddie: () => void;
  currentRecipe: Recipe | null;
  setCurrentRecipe: (recipe: Recipe | null) => void;
  recommendedRecipe: Recipe | null;
  setRecommendedRecipe: (recipe: Recipe | null) => void;
  currentRoute: string;
  getContextualHelp: () => string;
  getRouteContext: () => RouteContext;
  getRecipeContext: () => RecipeContext | null;
}

const ChefFreddieContext = createContext<ChefFreddieContextType | undefined>(undefined);

export const useChefFreddie = () => {
  const context = useContext(ChefFreddieContext);
  if (!context) {
    throw new Error('useChefFreddie must be used within a ChefFreddieProvider');
  }
  return context;
};

export const ChefFreddieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [recommendedRecipe, setRecommendedRecipe] = useState<Recipe | null>(null);
  const location = useLocation();
  const currentRoute = location.pathname;

  // Reset current recipe when route changes
  useEffect(() => {
    setCurrentRecipe(null);
  }, [currentRoute]);

  // Show ChefFreddie automatically when a recipe is selected
  useEffect(() => {
    if (currentRecipe || recommendedRecipe) {
      setIsVisible(true);
    }
  }, [currentRecipe, recommendedRecipe]);

  const showChefFreddie = () => setIsVisible(true);
  const hideChefFreddie = () => setIsVisible(false);

  const getContextualHelp = (): string => {
    if (currentRecipe) {
      return `I see you're looking at ${currentRecipe.title}. This is a ${currentRecipe.difficulty} recipe that takes about ${currentRecipe.cookingTime} minutes to prepare. Would you like me to help you with any part of this recipe?`;
    }

    if (recommendedRecipe) {
      return `I've selected ${recommendedRecipe.title} based on your preferences. This is a ${recommendedRecipe.difficulty} recipe that takes about ${recommendedRecipe.cookingTime} minutes to prepare. Would you like me to tell you more about it?`;
    }

    // Default help based on current route
    const routeHelpMap: Record<string, string> = {
      '/': 'Welcome to the dashboard! Here you can explore recipes and manage your cooking journey.',
      '/create-recipe': 'Here you can create your own recipes. Add ingredients, steps, and more!',
      '/my-cookbook': 'View and manage your saved recipes in your personal cookbook.',
      '/butcher-shop': 'Explore and purchase ingredients from the butcher shop.',
      '/profile': 'Manage your profile, preferences, and account settings.',
      '/chefs-corner': 'Connect with other chefs, learn cooking techniques, and join challenges.'
    };

    return routeHelpMap[currentRoute] || 'Explore the app and discover new features!';
  };

  const getRouteContext = (): RouteContext => {
    const routeContextMap: Record<string, RouteContext> = {
      '/': {
        description: 'Welcome to the dashboard! Here you can explore recipes and manage your cooking journey.',
        features: [
          { 
            name: 'recipe recommendations', 
            suggestedQuestions: [
              'What recipes do you recommend?',
              'What should I cook today?',
              'Show me some popular recipes'
            ]
          },
          { 
            name: 'cooking stats', 
            suggestedQuestions: [
              'How many recipes have I saved?',
              'What\'s my cooking level?',
              'Show me my recent activity'
            ]
          }
        ],
        suggestedQuestions: [
          'What recipes do you recommend?',
          'How do I create a new recipe?',
          'Where can I find my saved recipes?'
        ]
      },
      '/create-recipe': {
        description: 'Here you can create your own recipes. Add ingredients, steps, and more!',
        features: [
          { 
            name: 'ingredient selection', 
            suggestedQuestions: [
              'What ingredients go well together?',
              'Can you suggest substitutes for an ingredient?',
              'How much of this ingredient should I use?'
            ]
          },
          { 
            name: 'cooking instructions', 
            suggestedQuestions: [
              'How should I write good instructions?',
              'What\'s the best way to describe this step?',
              'Can you help me format my recipe?'
            ]
          }
        ],
        suggestedQuestions: [
          'What makes a good recipe title?',
          'How detailed should my instructions be?',
          'How can I add a photo to my recipe?'
        ]
      },
      '/my-cookbook': {
        description: 'View and manage your saved recipes in your personal cookbook.',
        features: [
          { 
            name: 'recipe organization', 
            suggestedQuestions: [
              'How do I organize my recipes?',
              'Can I create collections?',
              'How do I find a specific recipe?'
            ]
          },
          { 
            name: 'recipe modifications', 
            suggestedQuestions: [
              'How can I edit a recipe?',
              'Can I add notes to recipes?',
              'How do I scale a recipe?'
            ]
          }
        ],
        suggestedQuestions: [
          'How do I create a new collection?',
          'Can I share my recipes with others?',
          'How do I mark a recipe as favorite?'
        ]
      },
      '/butcher-shop': {
        description: 'Explore and purchase ingredients from the butcher shop.',
        features: [
          { 
            name: 'meat selection', 
            suggestedQuestions: [
              'What cut of meat is best for grilling?',
              'How do I choose good quality meat?',
              'What's the difference between cuts?'
            ]
          },
          { 
            name: 'butcher services', 
            suggestedQuestions: [
              'Can butchers prepare custom cuts?',
              'Do they offer delivery?',
              'How do I contact a butcher?'
            ]
          }
        ],
        suggestedQuestions: [
          'What specialty meats are available?',
          'How do I find local butchers?',
          'What's the best cut for a slow cooker?'
        ]
      },
      '/chefs-corner': {
        description: 'Connect with other chefs, learn cooking techniques, and join challenges.',
        features: [
          { 
            name: 'cooking tutorials', 
            suggestedQuestions: [
              'What knife skills should I learn?',
              'How do I improve my cooking techniques?',
              'Are there videos for beginners?'
            ]
          },
          { 
            name: 'cooking challenges', 
            suggestedQuestions: [
              'What challenges are currently active?',
              'How do I join a challenge?',
              'What are the rewards for challenges?'
            ]
          }
        ],
        suggestedQuestions: [
          'How do I improve my cooking skills?',
          'What challenges can I participate in?',
          'How do I connect with other chefs?'
        ]
      },
      '/profile': {
        description: 'Manage your profile, preferences, and account settings.',
        features: [
          { 
            name: 'profile settings', 
            suggestedQuestions: [
              'How do I change my profile picture?',
              'Can I update my email address?',
              'Where do I change my password?'
            ]
          },
          { 
            name: 'subscription management', 
            suggestedQuestions: [
              'How do I upgrade my account?',
              'What benefits do premium users get?',
              'When does my subscription renew?'
            ]
          }
        ],
        suggestedQuestions: [
          'How do I edit my profile?',
          'What subscription plans are available?',
          'How do I delete my account?'
        ]
      }
    };