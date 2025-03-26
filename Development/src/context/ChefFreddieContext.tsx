import React, { createContext, useContext, useState } from 'react';
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
  setCurrentRoute: (route: string) => void;
  getContextualHelp: () => string;
  getRouteContext: () => RouteContext;
  getRecipeContext: () => RecipeContext | null;
}

interface RouteContext {
  description: string;
  suggestedQuestions: string[];
  features: RouteFeature[];
}

interface RouteFeature {
  name: string;
  suggestedQuestions: string[];
}

interface RecipeContext {
  suggestedQuestions: string[];
}

const ChefFreddieContext = createContext<ChefFreddieContextType | undefined>(undefined);

const ChefFreddieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [recommendedRecipe, setRecommendedRecipe] = useState<Recipe | null>(null);
  const [currentRoute, setCurrentRoute] = useState('/');

  const showChefFreddie = () => setIsVisible(true);
  const hideChefFreddie = () => setIsVisible(false);

  const getContextualHelp = (): string => {
    if (currentRecipe) {
      return `I see you're looking at ${currentRecipe.title}! This recipe takes about ${currentRecipe.cookingTime} minutes to prepare and serves ${currentRecipe.servings} people. Would you like some cooking tips?`;
    }

    if (recommendedRecipe) {
      return `I've recommended ${recommendedRecipe.title} based on your preferences. Would you like to know more about this recipe?`;
    }

    const routeHelpMap: Record<string, string> = {
      '/': "Welcome to PorkChop! I'm Chef Freddie, your cooking assistant. How can I help you today?",
      '/dashboard': "Welcome to your dashboard! Here you can explore recipes and manage your cooking journey.",
      '/create-recipe': "Looking to create a recipe? Let me know what ingredients you have, and I can suggest some dishes!",
      '/my-cookbook': "Here's your cookbook! You can view and manage all your saved recipes here.",
      '/butcher-shop': "Welcome to the Butcher Shop! I can help you find high-quality cuts of meat from local suppliers.",
      '/chefs-corner': "Welcome to Chef's Corner! Join the community, share your passion, and grow as a chef!",
      '/profile': "This is your profile page where you can manage your account settings and preferences.",
    };

    return routeHelpMap[currentRoute] || 'How can I help you with your cooking today?';
  };

  const getRouteContext = (): RouteContext => {
    const routeContextMap: Record<string, RouteContext> = {
      '/': {
        description: "Welcome to PorkChop! I'm Chef Freddie, your cooking assistant. How can I help you today?",
        suggestedQuestions: [
          "What can I cook with chicken?",
          "How do I perfect a steak?",
          "What are some quick dinner ideas?"
        ],
        features: []
      },
      '/dashboard': {
        description: "Welcome to your dashboard! Here you can explore recipes and manage your cooking journey.",
        suggestedQuestions: [
          "How do I save recipes?",
          "Can you recommend something new?",
          "What are trending recipes?"
        ],
        features: []
      },
      '/create-recipe': {
        description: "Looking to create a recipe? Let me know what ingredients you have, and I can suggest some dishes!",
        suggestedQuestions: [
          "What can I make with these ingredients?",
          "How do I balance flavors?",
          "What's a good substitution for eggs?"
        ],
        features: [
          {
            name: 'Ingredient Selection',
            suggestedQuestions: [
              "How much of this ingredient should I use?",
              "What pairs well with this?",
              "Is this ingredient in season?"
            ]
          },
          {
            name: 'Recipe Matching',
            suggestedQuestions: [
              "Why were these recipes suggested?",
              "How can I modify this recipe?",
              "What makes this recipe special?"
            ]
          }
        ]
      },
      '/my-cookbook': {
        description: "Here's your cookbook! You can view and manage all your saved recipes here.",
        suggestedQuestions: [
          "How do I organize my recipes?",
          "Can I share my recipes?",
          "How do I create a collection?"
        ],
        features: []
      },
      '/butcher-shop': {
        description: "Welcome to the Butcher Shop! I can help you find high-quality cuts of meat from local suppliers.",
        suggestedQuestions: [
          "What cut is best for slow cooking?",
          "How do I choose a good steak?",
          "What's the difference between cuts?"
        ],
        features: []
      },
      '/chefs-corner': {
        description: "Welcome to Chef's Corner! Join the community, share your passion, and grow as a chef!",
        suggestedQuestions: [
          "How do I join a challenge?",
          "What are the tutorials about?",
          "How do I earn badges?"
        ],
        features: [
          {
            name: 'Tutorials',
            suggestedQuestions: [
              "Which tutorial is best for beginners?",
              "How do I improve my knife skills?",
              "What cooking methods should I learn first?"
            ]
          },
          {
            name: 'Challenges',
            suggestedQuestions: [
              "How do weekly challenges work?",
              "What are the rewards?",
              "How do I submit my challenge entry?"
            ]
          },
          {
            name: 'Community',
            suggestedQuestions: [
              "How do I connect with other chefs?",
              "Can I share my recipes with the community?",
              "How do I join cooking groups?"
            ]
          }
        ]
      }
    };

    return routeContextMap[currentRoute] || {
      description: 'How can I help you with your cooking today?',
      suggestedQuestions: [
        "What can I cook with what I have?",
        "Give me a quick recipe idea",
        "How do I improve my cooking skills?"
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
        `How long does it take to cook ${recipe.title}?`,
        `What's the difficulty level of this recipe?`,
        `Are there any special techniques for this recipe?`,
        `Can I substitute any ingredients in this recipe?`,
        `How should I store leftovers from this recipe?`
      ]
    };
  };

  const value = {
    isVisible,
    showChefFreddie,
    hideChefFreddie,
    currentRecipe,
    setCurrentRecipe,
    recommendedRecipe,
    setRecommendedRecipe,
    currentRoute,
    setCurrentRoute,
    getContextualHelp,
    getRouteContext,
    getRecipeContext
  };

  return <ChefFreddieContext.Provider value={value}>{children}</ChefFreddieContext.Provider>;
};

const useChefFreddie = () => {
  const context = useContext(ChefFreddieContext);
  if (!context) {
    throw new Error('useChefFreddie must be used within a ChefFreddieProvider');
  }
  return context;
};

export { ChefFreddieProvider, useChefFreddie };