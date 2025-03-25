import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { Recipe } from '../utils/recipeData';

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

interface RouteContext {
  description: string;
  suggestedQuestions: string[];
  features: {
    name: string;
    suggestedQuestions: string[];
  }[];
}

interface RecipeContext {
  suggestedQuestions: string[];
}

const ChefFreddieContext = createContext<ChefFreddieContextType | undefined>(undefined);

export const ChefFreddieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [recommendedRecipe, setRecommendedRecipe] = useState<Recipe | null>(null);
  const [currentRoute, setCurrentRoute] = useState('/');

  // Update current route when navigation happens
  useEffect(() => {
    setCurrentRoute(router.pathname);
  }, [router.pathname]);

  const showChefFreddie = () => setIsVisible(true);
  const hideChefFreddie = () => setIsVisible(false);

  const getContextualHelp = (): string => {
    // If we have a current recipe or recommended recipe, prioritize that context
    if (currentRecipe) {
      return `Looking at ${currentRecipe.title}! This ${currentRecipe.difficulty} recipe takes about ${currentRecipe.cookingTime} minutes. Would you like cooking tips or ingredient substitutions?`;
    }

    if (recommendedRecipe) {
      return `I've recommended ${recommendedRecipe.title} based on your preferences. Would you like to know more about it?`;
    }

    // Otherwise, return route-specific help
    const routeHelpMap: Record<string, string> = {
      '/': 'Welcome to the dashboard! Here you can explore recipes and manage your cooking journey.',
      '/dashboard': 'Welcome to the dashboard! Here you can explore recipes and manage your cooking journey.',
      '/create-recipe': 'Here you can create your own recipes. Add ingredients, steps, and more!',
      '/my-cookbook': 'View and manage your saved recipes in your personal cookbook.',
      '/butcher-shop': 'Explore and purchase ingredients from the butcher shop.',
      '/chefs-corner': 'Join the community, share your passion, and grow as a chef!',
      '/profile': 'Manage your profile, preferences, and account settings.',
    };

    return routeHelpMap[currentRoute] || 'Explore the app and discover new features!';
  };

  const getRouteContext = (): RouteContext => {
    const routeContextMap: Record<string, RouteContext> = {
      '/': {
        description: 'Welcome to PorkChop! What would you like to do today?',
        suggestedQuestions: [
          'What can I cook with ingredients I have?',
          'Show me my saved recipes',
          'How do I create a new recipe?'
        ],
        features: [
          {
            name: 'Dashboard',
            suggestedQuestions: [
              'How do I use this dashboard?',
              'What do these stats mean?',
              'How can I see my recent activity?'
            ]
          }
        ]
      },
      '/create-recipe': {
        description: 'Ready to create a new recipe? I can help with ingredient selection and cooking methods.',
        suggestedQuestions: [
          'How do I choose the best protein?',
          'What vegetables pair well with beef?',
          'Help me with seasoning recommendations'
        ],
        features: [
          {
            name: 'Ingredient Selection',
            suggestedQuestions: [
              'What protein options do I have?',
              'How do I select multiple ingredients?',
              'Can I clear my selection?'
            ]
          },
          {
            name: 'Recipe Matching',
            suggestedQuestions: [
              'How does recipe matching work?',
              'Why did I get these recipe recommendations?',
              'How can I improve my matches?'
            ]
          }
        ]
      },
      '/my-cookbook': {
        description: 'Here are all your saved recipes. Need help organizing or finding something specific?',
        suggestedQuestions: [
          'How do I organize my recipes into collections?',
          'Can I sort recipes by difficulty?',
          'Show me my favorite recipes'
        ],
        features: [
          {
            name: 'Recipe Management',
            suggestedQuestions: [
              'How do I edit a recipe?',
              'Can I share my recipes?',
              'How do I delete a recipe?'
            ]
          },
          {
            name: 'Collections',
            suggestedQuestions: [
              'How do I create a new collection?',
              'Can I move recipes between collections?',
              'How do I rename a collection?'
            ]
          }
        ]
      },
      '/butcher-shop': {
        description: 'Welcome to the Butcher Shop! Connect with local butchers and specialty meat suppliers.',
        suggestedQuestions: [
          'How does the butcher shop work?',
          'When will this feature be available?',
          'What types of meats will be offered?'
        ],
        features: [
          {
            name: 'Local Partnerships',
            suggestedQuestions: [
              'How are local butchers selected?',
              'Can I request specific butchers?',
              'What is the delivery area?'
            ]
          }
        ]
      },
      '/chefs-corner': {
        description: 'Welcome to Chef\'s Corner! Connect with the community, share experiences, and improve your skills.',
        suggestedQuestions: [
          'How do challenges work?',
          'What tutorials are available?',
          'How do I earn achievements?'
        ],
        features: [
          {
            name: 'Challenges',
            suggestedQuestions: [
              'What is the current weekly challenge?',
              'How do I submit my challenge entry?',
              'What rewards can I earn?'
            ]
          },
          {
            name: 'Tutorials',
            suggestedQuestions: [
              'How do I access knife skills tutorials?',
              'Are there beginner-friendly tutorials?',
              'What cooking techniques can I learn?'
            ]
          }
        ]
      }
    };

    return routeContextMap[currentRoute] || {
      description: 'How can I help you with PorkChop today?',
      suggestedQuestions: [
        'What features does PorkChop offer?',
        'How do I create a recipe?',
        'Where can I find cooking tips?'
      ],
      features: []
    };
  };

  const getRecipeContext = (): RecipeContext | null => {
    if (!currentRecipe && !recommendedRecipe) return null;

    const recipe = currentRecipe || recommendedRecipe;
    
    if (!recipe) return null;

    return {
      suggestedQuestions: [
        `How long should I cook ${recipe.title}?`,
        `What's the best way to prepare the ingredients?`,
        `Do you have any substitution ideas for this recipe?`,
        `What cookware do I need for this recipe?`,
        `Would this recipe work for a beginner?`
      ]
    };
  };

  const value: ChefFreddieContextType = {
    isVisible,
    showChefFreddie,
    hideChefFreddie,
    currentRecipe,
    setCurrentRecipe,
    recommendedRecipe,
    setRecommendedRecipe,
    currentRoute,
    getContextualHelp,
    getRouteContext,
    getRecipeContext
  };

  return <ChefFreddieContext.Provider value={value}>{children}</ChefFreddieContext.Provider>;
};

export const useChefFreddie = () => {
  const context = useContext(ChefFreddieContext);
  if (!context) {
    throw new Error('useChefFreddie must be used within a ChefFreddieProvider');
  }
  return context;
};