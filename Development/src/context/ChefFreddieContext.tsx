import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { Recipe } from '../utils/recipeData';
import { findSimilarRecipes, getRandomRecipes, mockRecipes } from '../utils/recipeData';

// Define the three prebuilt GPT contexts
interface GPTContext {
  name: string;
  description: string;
  expertise: string[];
  suggestedQuestions: string[];
  sampleQuestions: string[];
  getResponse: (query: string) => Promise<string>;
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
  setCurrentRoute: (route: string) => void;
  activeGPTContextName: string;
  setActiveGPTContextName: (contextName: string) => void;
  getActiveGPTContext: () => GPTContext;
  getGPTContextResponse: (query: string) => Promise<string>;
  getContextualHelp: () => string;
  getRouteSuggestedQuestions: () => string[];
  getSimilarRecipeRecommendations: (recipe: Recipe) => Recipe[];
  getRandomRecipeRecommendations: (count?: number) => Recipe[];
  getRouteTitle: () => string;
}

interface RouteContext {
  suggestedQuestions: string[];
  description?: string;
  features?: Array<{
    name: string;
    suggestedQuestions: string[];
  }>;
}

interface RecipeContext {
  suggestedQuestions: string[];
}

const ChefFreddieContext = createContext<ChefFreddieContextType>({
  isVisible: false,
  showChefFreddie: () => {},
  hideChefFreddie: () => {},
  currentRecipe: null,
  setCurrentRecipe: () => {},
  recommendedRecipe: null,
  setRecommendedRecipe: () => {},
  currentRoute: '',
  setCurrentRoute: () => {},
  activeGPTContextName: 'Recipe Expert',
  setActiveGPTContextName: () => {},
  getActiveGPTContext: () => ({ name: 'Recipe Expert', description: '', expertise: [], suggestedQuestions: [], sampleQuestions: [], getResponse: async () => '' }),
  getGPTContextResponse: async () => '',
  getContextualHelp: () => '',
  getRouteSuggestedQuestions: () => [],
  getSimilarRecipeRecommendations: () => [],
  getRandomRecipeRecommendations: () => [],
  getRouteTitle: () => ''
});

const ChefFreddieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Set initial visibility to FALSE so Chef Freddie doesn't appear automatically
  const [isVisible, setIsVisible] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [recommendedRecipe, setRecommendedRecipe] = useState<Recipe | null>(null);
  const [activeGPTContextName, setActiveGPTContextName] = useState<string>('Recipe Expert');
  const router = useRouter();
  const [currentRoutePath, setCurrentRoutePath] = useState<string>(router.pathname);

  // Update currentRoutePath when router.pathname changes - DON'T auto-show Chef Freddie
  useEffect(() => {
    setCurrentRoutePath(router.pathname);
  }, [router.pathname]);

  // Define the GPT contexts
  const gptContexts: GPTContext[] = [
    {
      name: 'Recipe Expert',
      description: 'Specialized in recipe creation, modifications, and ingredient substitutions.',
      expertise: ['Recipe Development', 'Flavor Pairing', 'Ingredient Substitutions', 'Menu Planning'],
      suggestedQuestions: [
        'How can I modify this recipe to be gluten-free?',
        'What can I substitute for eggs in this recipe?',
        'How do I adjust cooking time for a larger portion?',
        'What spices would complement this dish?'
      ],
      sampleQuestions: [
        'What are some common ingredient substitutions?',
        'How do I convert a recipe to be vegan?',
        'What are some tips for meal planning?',
        'How do I adjust cooking time for a smaller portion?'
      ],
      getResponse: async (query: string) => {
        // Simulate a response from the Recipe Expert context
        if (query.toLowerCase().includes('substitute') || query.toLowerCase().includes('replacement')) {
          return "Based on my recipe expertise, I recommend these substitutions: For eggs, you can use applesauce or flaxseed meal mixed with water. For dairy milk, try almond, oat, or coconut milk. For butter, avocado or olive oil work well in most recipes.";
        } else if (query.toLowerCase().includes('gluten') || query.toLowerCase().includes('gluten-free')) {
          return "To make this recipe gluten-free, you can substitute regular flour with almond flour, rice flour, or a gluten-free flour blend. For thickening sauces, use cornstarch or arrowroot powder instead of wheat flour.";
        } else if (query.toLowerCase().includes('spice') || query.toLowerCase().includes('flavor')) {
          return "For this dish, I'd recommend complementary spices like thyme, rosemary, and a touch of garlic powder. If you want to add more depth, consider adding a pinch of smoked paprika or a splash of balsamic vinegar to enhance the flavors.";
        } else {
          return "As a Recipe Expert, I can help you with ingredient substitutions, recipe modifications, and flavor pairings. Feel free to ask me specific questions about your recipe!";
        }
      }
    },
    {
      name: 'Cooking Technique Expert',
      description: 'Focused on cooking methods, knife skills, and kitchen equipment.',
      expertise: ['Knife Skills', 'Cooking Methods', 'Kitchen Equipment', 'Food Safety'],
      suggestedQuestions: [
        "What's the best way to sear a steak?",
        'How do I properly julienne vegetables?',
        'What\'s the difference between braising and stewing?',
        'How do I season a cast iron pan?'
      ],
      sampleQuestions: [
        'What are some common cooking techniques?',
        'How do I sharpen my knives?',
        'What are some essential kitchen tools?',
        'How do I prevent cross-contamination?'
      ],
      getResponse: async (query: string) => {
        // Simulate a response from the Cooking Technique Expert context
        if (query.toLowerCase().includes('knife') || query.toLowerCase().includes('cut')) {
          return "For proper knife skills, always maintain a claw grip with your non-dominant hand to protect your fingers. For julienning, first slice the vegetable into thin planks, stack them, and then cut into matchstick-sized pieces. Keep your knife sharp for safety and precision.";
        } else if (query.toLowerCase().includes('sear') || query.toLowerCase().includes('steak')) {
          return "For a perfect steak sear: 1) Pat the meat completely dry, 2) Season generously with salt and pepper, 3) Use a very hot cast iron pan with a high smoke-point oil, 4) Don't move the steak for at least 3-4 minutes to develop a crust, 5) Flip once and finish with butter basting.";
        } else if (query.toLowerCase().includes('cast iron') || query.toLowerCase().includes('season')) {
          return "To season a cast iron pan: 1) Scrub it well and dry completely, 2) Apply a thin layer of vegetable oil or shortening all over, 3) Place it upside down in a 375°F oven with foil beneath to catch drips, 4) Bake for 1 hour, 5) Let cool in the oven. Repeat this process 2-3 times for a new pan.";
        } else {
          return "As a Cooking Technique Expert, I can help you with knife skills, cooking methods, and kitchen equipment usage. What specific technique would you like to learn about?";
        }
      }
    },
    {
      name: 'Nutrition Expert',
      description: 'Provides nutritional information, dietary restrictions, and healthy cooking advice.',
      expertise: ['Nutritional Analysis', 'Dietary Restrictions', 'Healthy Substitutions', 'Meal Planning'],
      suggestedQuestions: [
        'How can I make this recipe more heart-healthy?',
        'What\'s the nutritional profile of this dish?',
        'How do I adjust this for a low-carb diet?',
        'What are good protein sources for vegetarians?'
      ],
      sampleQuestions: [
        'What are some common nutritional mistakes?',
        'How do I read a nutrition label?',
        'What are some healthy alternatives to sugar?',
        'How do I plan a balanced meal?'
      ],
      getResponse: async (query: string) => {
        // Simulate a response from the Nutrition Expert context
        if (query.toLowerCase().includes('protein') || query.toLowerCase().includes('vegetarian')) {
          return "Great vegetarian protein sources include: 1) Legumes like lentils, chickpeas, and black beans (about 15g protein per cup), 2) Tofu and tempeh (20g per cup), 3) Seitan (25g per 3.5oz), 4) Greek yogurt (17g per cup), 5) Quinoa (8g per cup), and 6) Various nuts and seeds. Try to incorporate a variety of these for complete amino acid profiles.";
        } else if (query.toLowerCase().includes('heart') || query.toLowerCase().includes('healthy')) {
          return "To make this recipe more heart-healthy: 1) Replace saturated fats with olive or avocado oil, 2) Reduce sodium by using herbs and spices instead of salt, 3) Add more vegetables for fiber, 4) Include heart-healthy fats from nuts, seeds, or fatty fish, 5) Choose whole grains over refined options.";
        } else if (query.toLowerCase().includes('carb') || query.toLowerCase().includes('keto')) {
          return "For a low-carb version of this recipe: 1) Replace starchy vegetables with cauliflower, zucchini, or bell peppers, 2) Use lettuce wraps instead of bread or tortillas, 3) Substitute rice with cauliflower rice, 4) Replace sugar with a low-carb sweetener, 5) Focus on increasing healthy fats and proteins to maintain satiety.";
        } else {
          return "As a Nutrition Expert, I can provide information on nutritional content, dietary modifications, and healthy cooking techniques. What specific nutritional advice are you looking for?";
        }
      }
    }
  ];

  // Show Chef Freddie - only happens when user explicitly clicks the button
  const showChefFreddie = () => {
    setIsVisible(true);
  };

  // Hide Chef Freddie - sets visibility to false and remembers it's been closed
  const hideChefFreddie = () => {
    setIsVisible(false);
  };

  // Get contextual help based on the current route or recipe
  const getContextualHelp = (): string => {
    // If viewing a recipe, provide recipe-specific help
    if (currentRecipe) {
      return `I see you're looking at ${currentRecipe.title}! Would you like cooking tips, ingredient substitutions, or help with any part of this recipe?`;
    }
    
    // Otherwise, provide route-based help
    const routeHelp = getRouteBasedHelp();
    if (routeHelp) {
      return routeHelp;
    }
    
    // Default greeting
    return "Hello! I'm Chef Freddie, your cooking assistant. How can I help you with your cooking journey today?";
  };
  
  // Get help text based on the current route
  const getRouteBasedHelp = (): string | null => {
    console.log('Getting route-based help for:', currentRoutePath);
    
    switch (currentRoutePath) {
      case '/':
      case '/dashboard':
        return "Welcome to PorkChop! I'm Chef Freddie, your personal cooking assistant. Looking for recipe inspiration or cooking tips?";
      case '/create-recipe':
        return "I see you're creating a new recipe! Need help with ingredient combinations, cooking techniques, or recipe structure? I can suggest flavor pairings or cooking methods.";
      case '/my-cookbook':
        return "Looking through your saved recipes? I can help you organize them, suggest modifications, or provide cooking tips for any recipe in your collection.";
      case '/recipe-matching':
        return "Looking for recipe ideas? Tell me what ingredients you have on hand, and I can suggest some dishes that would work well with them!";
      case '/chefs-corner':
        return "Welcome to the Chef's Corner! Here you can connect with other cooking enthusiasts and share your culinary creations. Need help with posting or food photography?";
      case '/tutorials':
        return "Our tutorials section has step-by-step guides for various cooking techniques. What would you like to learn today? From knife skills to baking methods, I'm here to help!";
      case '/challenges':
        return "Ready for a cooking challenge? These challenges will help you develop new skills and expand your culinary repertoire! Want some tips for success?";
      case '/the-grange':
        return "Welcome to The Grange Marketplace! Here you can explore seasonal ingredients and connect with local food producers. Need recommendations for fresh finds?";
      case '/nutrition':
        return "Looking for nutrition information? I can help you understand dietary requirements, make healthier substitutions, or balance your meals for optimal nutrition.";
      case '/meal-planning':
        return "Planning your meals? I can help you create a balanced meal plan, suggest recipes that work well together, or provide tips for efficient meal prep.";
      default:
        if (currentRoutePath.startsWith('/recipe/')) {
          return "You're viewing a recipe detail page. Would you like cooking tips, ingredient substitutions, or help with any part of the recipe?";
        }
        return null;
    }
  };

  // Get suggested questions based on the current route
  const getRouteSuggestedQuestions = (): string[] => {
    switch (currentRoutePath) {
      case '/':
      case '/dashboard':
        return [
          'What should I cook for dinner tonight?',
          'Show me recipes that match my skill level',
          'What are some quick 30-minute meals?'
        ];
      case '/create-recipe':
        return [
          'What flavor combinations work well together?',
          'How can I make this recipe healthier?',
          'What cooking method is best for these ingredients?'
        ];
      case '/my-cookbook':
        return [
          'Which recipes can I make with what I have?',
          'What\'s a good menu for a dinner party?',
          'How can I batch cook these recipes?'
        ];
      case '/recipe-matching':
        return [
          'What can I make with chicken and vegetables?',
          'I have pasta and tomatoes, what can I cook?',
          'Show me 15-minute recipes with these ingredients'
        ];
      case '/chefs-corner':
        return [
          'How can I improve my food photography?',
          'Tips for sharing recipes that others will love',
          'What makes a recipe description engaging?'
        ];
      case '/tutorials':
        return [
          'What knife skills should I learn first?',
          'How do I properly sear meat?',
          'Best techniques for cooking vegetables'
        ];
      case '/challenges':
        return [
          'Tips for completing the current challenge',
          'How can I put my own spin on this challenge?',
          'What techniques will help me succeed?'
        ];
      case '/the-grange':
        return [
          'What seasonal ingredients should I try now?',
          'How to select the freshest produce',
          'Best ways to store fresh ingredients'
        ];
      case '/nutrition':
        return [
          'How can I make this recipe more nutritious?',
          'Healthy substitutions for common ingredients',
          'Balancing macros in my daily meals'
        ];
      case '/meal-planning':
        return [
          'Create a week of balanced dinner recipes',
          'Efficient meal prep strategies for busy weeks',
          'How to build a versatile pantry'
        ];
      default:
        if (currentRoutePath.startsWith('/recipe/')) {
          return [
            'What can I substitute in this recipe?',
            'How can I adjust portion sizes?',
            'What sides pair well with this dish?'
          ];
        }
        return [
          'Recommend a recipe based on my preferences',
          'What new cooking techniques should I learn?',
          'Suggest a menu for my next meal'
        ];
    }
  };

  // Get route-specific context
  const getRouteContext = (): RouteContext => {
    switch (currentRoutePath) {
      case '/create-recipe':
        return {
          description: "Looking to create a recipe? Let me know what ingredients you have, and I can suggest some dishes!",
          suggestedQuestions: getRouteSuggestedQuestions(),
          features: []
        };
      case '/recipe-matching':
        return {
          description: "Looking for recipe ideas? Tell me what ingredients you have on hand, and I can suggest some dishes that would work well with them!",
          suggestedQuestions: getRouteSuggestedQuestions(),
          features: []
        };
      case '/my-cookbook':
        return {
          description: "Looking through your saved recipes? Let me know if you need help with any modifications or cooking tips!",
          suggestedQuestions: getRouteSuggestedQuestions(),
          features: []
        };
      default:
        return {
          description: "Hello! I'm Chef Freddie, your cooking assistant. How can I help you with your cooking journey today?",
          suggestedQuestions: getRouteSuggestedQuestions(),
          features: []
        };
    }
  };

  // Get recipe-specific context
  const getRecipeContext = (): RecipeContext => {
    if (!currentRecipe) {
      return {
        suggestedQuestions: []
      };
    }

    return {
      suggestedQuestions: [
        `What's the best way to prepare ${currentRecipe.title}?`,
        `What sides go well with ${currentRecipe.title}?`,
        `How can I adjust ${currentRecipe.title} for dietary restrictions?`,
        `What wine pairs well with ${currentRecipe.title}?`
      ]
    };
  };

  // Get contextual titles based on the current route
  const getRouteTitle = (): string => {
    switch (currentRoutePath) {
      case '/':
      case '/dashboard':
        return "Welcome to Your Cooking Dashboard!";
      case '/create-recipe':
        return "Let's Create Something Delicious!";
      case '/my-cookbook':
        return "Your Personal Cookbook Collection";
      case '/recipe-matching':
        return "Let's Find Recipes With Your Ingredients";
      case '/chefs-corner':
        return "Welcome to the Chef's Community";
      case '/tutorials':
        return "Time to Master New Skills";
      case '/challenges':
        return "Ready for Today's Cooking Challenge?";
      case '/the-grange':
        return "Fresh Ingredients Await You";
      case '/nutrition':
        return "Nutrition & Healthy Cooking";
      case '/meal-planning':
        return "Plan Your Perfect Menu";
      default:
        if (currentRoutePath.startsWith('/recipe/')) {
          return currentRecipe ? `Cooking: ${currentRecipe.title}` : "Recipe Details";
        }
        return "Your Cooking Assistant";
    }
  };

  // Get the active GPT context
  const getActiveGPTContext = (): GPTContext => {
    // Automatically determine the appropriate context based on the current route or recipe
    const autoDetectContext = (): string => {
      // If viewing a recipe, use Recipe Expert
      if (currentRecipe) {
        return 'Recipe Expert';
      }
      
      // Route-based context detection
      switch (currentRoutePath) {
        case '/create-recipe':
          return 'Recipe Expert';
        case '/recipe-matching':
          return 'Recipe Expert';
        case '/tutorials':
          return 'Cooking Technique Expert';
        case '/challenges':
          return 'Cooking Technique Expert';
        case '/nutrition':
          return 'Nutrition Expert';
        case '/meal-planning':
          return 'Nutrition Expert';
        default:
          // Default to Recipe Expert
          return 'Recipe Expert';
      }
    };
    
    // Get the automatically detected context
    const detectedContextName = autoDetectContext();
    
    // Find and return the detected context
    return gptContexts.find(context => context.name === detectedContextName) || gptContexts[0];
  };

  // This function is kept for backward compatibility but no longer changes the context
  // since context is now automatically determined
  const setActiveGPTContext = (contextName: string) => {
    console.log('Context is now automatically determined based on user activity');
    // No longer manually setting the context
  };

  // Get all GPT contexts
  const getAllGPTContexts = (): GPTContext[] => {
    return gptContexts;
  };

  // Get a response from the active GPT context
  const getGPTContextResponse = async (query: string): Promise<string> => {
    const activeContext = getActiveGPTContext();
    return await activeContext.getResponse(query);
  };

  // Get similar recipe recommendations based on the current recipe
  const getSimilarRecipeRecommendations = (recipe: Recipe): Recipe[] => {
    try {
      // Pass the recipe, mockRecipes as the allRecipes parameter, and count=3
      return findSimilarRecipes(recipe, mockRecipes, 3);
    } catch (error) {
      console.error("Error finding similar recipes:", error);
      return [];
    }
  };

  // Get random recipe recommendations
  const getRandomRecipeRecommendations = (count: number = 3): Recipe[] => {
    try {
      // Pass mockRecipes as the allRecipes parameter and the count
      return getRandomRecipes(mockRecipes, count);
    } catch (error) {
      console.error("Error getting random recipes:", error);
      return [];
    }
  };

  const value = {
    isVisible,
    showChefFreddie,
    hideChefFreddie,
    currentRecipe,
    setCurrentRecipe,
    recommendedRecipe,
    setRecommendedRecipe,
    currentRoute: currentRoutePath,
    setCurrentRoute: setCurrentRoutePath,
    activeGPTContextName,
    setActiveGPTContextName,
    getActiveGPTContext,
    getGPTContextResponse,
    getContextualHelp,
    getRouteSuggestedQuestions,
    getSimilarRecipeRecommendations,
    getRandomRecipeRecommendations,
    getRouteTitle
  };

  return (
    <ChefFreddieContext.Provider value={value}>
      {children}
    </ChefFreddieContext.Provider>
  );
};

const useChefFreddie = () => {
  const context = useContext(ChefFreddieContext);
  if (!context) {
    throw new Error('useChefFreddie must be used within a ChefFreddieProvider');
  }
  return context;
};

export { ChefFreddieProvider, useChefFreddie };