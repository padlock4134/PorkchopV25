import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Recipe, parseCSVRecipes } from '../utils/recipeData';
import { useChefFreddie } from '../context/ChefFreddieContext';
import { useAchievementTracker } from '../utils/achievementTracker';
import { useAuth } from '../context/AuthContext';
import RecipeMatching from './RecipeMatching';

// Define the type for selected items
type SelectedItems = {
  proteins: string[];
  vegetables: string[];
  grainsAndSpices: string[];
  pantry: string[];
  cookware: string[];
};

const CreateRecipe: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { trackRecipeCreation, trackIngredientUsed, trackCuisineCreated } = useAchievementTracker();
  const [currentStep, setCurrentStep] = useState(0);
  const [matchedRecipes, setMatchedRecipes] = useState<Recipe[]>([]);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({
    proteins: [],
    vegetables: [],
    grainsAndSpices: [],
    pantry: [],
    cookware: [],
  });
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [showRecipeMatching, setShowRecipeMatching] = useState(false);
  const [userCuisines, setUserCuisines] = useState<string[]>([]);

  const {
    currentRecipe,
    setCurrentRecipe,
  } = useChefFreddie();

  // Load recipes from CSV when component mounts
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setLoading(true);
        const loadedRecipes = await parseCSVRecipes();
        setRecipes(loadedRecipes);
      } catch (error) {
        console.error('Error loading recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, []);

  // Load user's preferred cuisines when component mounts
  useEffect(() => {
    if (user && user.preferredCuisines && Array.isArray(user.preferredCuisines)) {
      setUserCuisines(user.preferredCuisines);
    }
  }, [user]);

  const ingredients = {
    proteins: [
      // Beef
      { id: 'ground-beef', name: 'Ground Beef', category: 'Beef' },
      { id: 'steak', name: 'Steak', category: 'Beef' },
      { id: 'roast-beef', name: 'Roast Beef', category: 'Beef' },
      { id: 'beef-ribs', name: 'Beef Ribs', category: 'Beef' },
      { id: 'brisket', name: 'Brisket', category: 'Beef' },
      { id: 'beef-stew-meat', name: 'Stew Meat', category: 'Beef' },
      
      // Pork
      { id: 'pork-chops', name: 'Pork Chops', category: 'Pork' },
      { id: 'ground-pork', name: 'Ground Pork', category: 'Pork' },
      { id: 'bacon', name: 'Bacon', category: 'Pork' },
      { id: 'ham', name: 'Ham', category: 'Pork' },
      { id: 'pork-ribs', name: 'Pork Ribs', category: 'Pork' },
      { id: 'pork-tenderloin', name: 'Pork Tenderloin', category: 'Pork' },
      
      // Poultry
      { id: 'chicken-breast', name: 'Chicken Breast', category: 'Poultry' },
      { id: 'chicken-thighs', name: 'Chicken Thighs', category: 'Poultry' },
      { id: 'whole-chicken', name: 'Whole Chicken', category: 'Poultry' },
      { id: 'ground-chicken', name: 'Ground Chicken', category: 'Poultry' },
      { id: 'turkey', name: 'Turkey', category: 'Poultry' },
      { id: 'chicken-wings', name: 'Chicken Wings', category: 'Poultry' },
      
      // Seafood
      { id: 'salmon', name: 'Salmon', category: 'Seafood' },
      { id: 'tuna', name: 'Tuna', category: 'Seafood' },
      { id: 'shrimp', name: 'Shrimp', category: 'Seafood' },
      { id: 'cod', name: 'Cod', category: 'Seafood' },
      { id: 'tilapia', name: 'Tilapia', category: 'Seafood' },
      { id: 'crab', name: 'Crab', category: 'Seafood' },
      
      // Game
      { id: 'venison', name: 'Venison', category: 'Game' },
      { id: 'bison', name: 'Bison', category: 'Game' },
      { id: 'rabbit', name: 'Rabbit', category: 'Game' },
      { id: 'wild-boar', name: 'Wild Boar', category: 'Game' },
      { id: 'pheasant', name: 'Pheasant', category: 'Game' },
      { id: 'quail', name: 'Quail', category: 'Game' },
      
      // Vegetarian
      { id: 'tofu', name: 'Tofu', category: 'Vegetarian' },
      { id: 'tempeh', name: 'Tempeh', category: 'Vegetarian' },
      { id: 'seitan', name: 'Seitan', category: 'Vegetarian' },
      { id: 'beans', name: 'Beans', category: 'Vegetarian' },
      { id: 'lentils', name: 'Lentils', category: 'Vegetarian' },
      { id: 'chickpeas', name: 'Chickpeas', category: 'Vegetarian' },
    ],
    vegetables: [
      // Leafy Greens
      { id: 'spinach', name: 'Spinach', category: 'Leafy Greens' },
      { id: 'kale', name: 'Kale', category: 'Leafy Greens' },
      { id: 'lettuce', name: 'Lettuce', category: 'Leafy Greens' },
      { id: 'arugula', name: 'Arugula', category: 'Leafy Greens' },
      { id: 'swiss-chard', name: 'Swiss Chard', category: 'Leafy Greens' },
      { id: 'cabbage', name: 'Cabbage', category: 'Leafy Greens' },
      
      // Root Vegetables
      { id: 'carrots', name: 'Carrots', category: 'Root Vegetables' },
      { id: 'potatoes', name: 'Potatoes', category: 'Root Vegetables' },
      { id: 'sweet-potatoes', name: 'Sweet Potatoes', category: 'Root Vegetables' },
      { id: 'onions', name: 'Onions', category: 'Root Vegetables' },
      { id: 'beets', name: 'Beets', category: 'Root Vegetables' },
      { id: 'radishes', name: 'Radishes', category: 'Root Vegetables' },
      
      // Nightshades
      { id: 'tomatoes', name: 'Tomatoes', category: 'Nightshades' },
      { id: 'bell-peppers', name: 'Bell Peppers', category: 'Nightshades' },
      { id: 'eggplant', name: 'Eggplant', category: 'Nightshades' },
      { id: 'chili-peppers', name: 'Chili Peppers', category: 'Nightshades' },
      { id: 'tomatillos', name: 'Tomatillos', category: 'Nightshades' },
      { id: 'okra', name: 'Okra', category: 'Nightshades' },
      
      // Squash & Gourds
      { id: 'zucchini', name: 'Zucchini', category: 'Squash & Gourds' },
      { id: 'butternut-squash', name: 'Butternut Squash', category: 'Squash & Gourds' },
      { id: 'acorn-squash', name: 'Acorn Squash', category: 'Squash & Gourds' },
      { id: 'pumpkin', name: 'Pumpkin', category: 'Squash & Gourds' },
      { id: 'cucumber', name: 'Cucumber', category: 'Squash & Gourds' },
      { id: 'spaghetti-squash', name: 'Spaghetti Squash', category: 'Squash & Gourds' },
      
      // Cruciferous
      { id: 'broccoli', name: 'Broccoli', category: 'Cruciferous' },
      { id: 'cauliflower', name: 'Cauliflower', category: 'Cruciferous' },
      { id: 'brussels-sprouts', name: 'Brussels Sprouts', category: 'Cruciferous' },
      { id: 'bok-choy', name: 'Bok Choy', category: 'Cruciferous' },
      { id: 'kohlrabi', name: 'Kohlrabi', category: 'Cruciferous' },
      { id: 'turnips', name: 'Turnips', category: 'Cruciferous' },
      
      // Alliums & Aromatics
      { id: 'garlic', name: 'Garlic', category: 'Alliums & Aromatics' },
      { id: 'shallots', name: 'Shallots', category: 'Alliums & Aromatics' },
      { id: 'leeks', name: 'Leeks', category: 'Alliums & Aromatics' },
      { id: 'green-onions', name: 'Green Onions', category: 'Alliums & Aromatics' },
      { id: 'fennel', name: 'Fennel', category: 'Alliums & Aromatics' },
      { id: 'celery', name: 'Celery', category: 'Alliums & Aromatics' },
    ],
    grainsAndSpices: [
      // Grains
      { id: 'rice', name: 'Rice', category: 'Grains' },
      { id: 'pasta', name: 'Pasta', category: 'Grains' },
      { id: 'quinoa', name: 'Quinoa', category: 'Grains' },
      { id: 'couscous', name: 'Couscous', category: 'Grains' },
      { id: 'barley', name: 'Barley', category: 'Grains' },
      { id: 'farro', name: 'Farro', category: 'Grains' },
      
      // Herbs
      { id: 'basil', name: 'Basil', category: 'Herbs' },
      { id: 'cilantro', name: 'Cilantro', category: 'Herbs' },
      { id: 'parsley', name: 'Parsley', category: 'Herbs' },
      { id: 'rosemary', name: 'Rosemary', category: 'Herbs' },
      { id: 'thyme', name: 'Thyme', category: 'Herbs' },
      { id: 'mint', name: 'Mint', category: 'Herbs' },
      
      // Common Spices
      { id: 'black-pepper', name: 'Black Pepper', category: 'Common Spices' },
      { id: 'salt', name: 'Salt', category: 'Common Spices' },
      { id: 'garlic-powder', name: 'Garlic Powder', category: 'Common Spices' },
      { id: 'onion-powder', name: 'Onion Powder', category: 'Common Spices' },
      { id: 'paprika', name: 'Paprika', category: 'Common Spices' },
      { id: 'cumin', name: 'Cumin', category: 'Common Spices' },
      
      // Global Spices
      { id: 'curry-powder', name: 'Curry Powder', category: 'Global Spices' },
      { id: 'garam-masala', name: 'Garam Masala', category: 'Global Spices' },
      { id: 'five-spice', name: 'Five Spice', category: 'Global Spices' },
      { id: 'za-atar', name: 'Za\'atar', category: 'Global Spices' },
      { id: 'cajun-seasoning', name: 'Cajun Seasoning', category: 'Global Spices' },
      { id: 'italian-seasoning', name: 'Italian Seasoning', category: 'Global Spices' },
      
      // Baking Spices
      { id: 'cinnamon', name: 'Cinnamon', category: 'Baking Spices' },
      { id: 'nutmeg', name: 'Nutmeg', category: 'Baking Spices' },
      { id: 'cloves', name: 'Cloves', category: 'Baking Spices' },
      { id: 'vanilla', name: 'Vanilla', category: 'Baking Spices' },
      { id: 'allspice', name: 'Allspice', category: 'Baking Spices' },
      { id: 'cardamom', name: 'Cardamom', category: 'Baking Spices' },
      
      // Flours & Starches
      { id: 'all-purpose-flour', name: 'All-Purpose Flour', category: 'Flours & Starches' },
      { id: 'cornstarch', name: 'Cornstarch', category: 'Flours & Starches' },
      { id: 'bread-flour', name: 'Bread Flour', category: 'Flours & Starches' },
      { id: 'cornmeal', name: 'Cornmeal', category: 'Flours & Starches' },
      { id: 'rice-flour', name: 'Rice Flour', category: 'Flours & Starches' },
      { id: 'tapioca-starch', name: 'Tapioca Starch', category: 'Flours & Starches' },
    ],
    pantry: [
      // Dairy
      { id: 'milk', name: 'Milk', category: 'Dairy' },
      { id: 'butter', name: 'Butter', category: 'Dairy' },
      { id: 'cheese', name: 'Cheese', category: 'Dairy' },
      { id: 'yogurt', name: 'Yogurt', category: 'Dairy' },
      { id: 'cream', name: 'Cream', category: 'Dairy' },
      { id: 'sour-cream', name: 'Sour Cream', category: 'Dairy' },
      
      // Oils & Vinegars
      { id: 'olive-oil', name: 'Olive Oil', category: 'Oils & Vinegars' },
      { id: 'vegetable-oil', name: 'Vegetable Oil', category: 'Oils & Vinegars' },
      { id: 'balsamic-vinegar', name: 'Balsamic Vinegar', category: 'Oils & Vinegars' },
      { id: 'red-wine-vinegar', name: 'Red Wine Vinegar', category: 'Oils & Vinegars' },
      { id: 'apple-cider-vinegar', name: 'Apple Cider Vinegar', category: 'Oils & Vinegars' },
      { id: 'sesame-oil', name: 'Sesame Oil', category: 'Oils & Vinegars' },
      
      // Canned Goods
      { id: 'canned-tomatoes', name: 'Canned Tomatoes', category: 'Canned Goods' },
      { id: 'canned-beans', name: 'Canned Beans', category: 'Canned Goods' },
      { id: 'canned-tuna', name: 'Canned Tuna', category: 'Canned Goods' },
      { id: 'broth', name: 'Broth/Stock', category: 'Canned Goods' },
      { id: 'coconut-milk', name: 'Coconut Milk', category: 'Canned Goods' },
      { id: 'tomato-paste', name: 'Tomato Paste', category: 'Canned Goods' },
      
      // Condiments
      { id: 'ketchup', name: 'Ketchup', category: 'Condiments' },
      { id: 'mustard', name: 'Mustard', category: 'Condiments' },
      { id: 'mayonnaise', name: 'Mayonnaise', category: 'Condiments' },
      { id: 'soy-sauce', name: 'Soy Sauce', category: 'Condiments' },
      { id: 'hot-sauce', name: 'Hot Sauce', category: 'Condiments' },
      { id: 'worcestershire', name: 'Worcestershire Sauce', category: 'Condiments' },
      
      // Sweeteners
      { id: 'sugar', name: 'Sugar', category: 'Sweeteners' },
      { id: 'brown-sugar', name: 'Brown Sugar', category: 'Sweeteners' },
      { id: 'honey', name: 'Honey', category: 'Sweeteners' },
      { id: 'maple-syrup', name: 'Maple Syrup', category: 'Sweeteners' },
      { id: 'agave', name: 'Agave Nectar', category: 'Sweeteners' },
      { id: 'molasses', name: 'Molasses', category: 'Sweeteners' },
      
      // Nuts & Dried Fruits
      { id: 'almonds', name: 'Almonds', category: 'Nuts & Dried Fruits' },
      { id: 'walnuts', name: 'Walnuts', category: 'Nuts & Dried Fruits' },
      { id: 'raisins', name: 'Raisins', category: 'Nuts & Dried Fruits' },
      { id: 'dried-cranberries', name: 'Dried Cranberries', category: 'Nuts & Dried Fruits' },
      { id: 'pine-nuts', name: 'Pine Nuts', category: 'Nuts & Dried Fruits' },
      { id: 'dried-apricots', name: 'Dried Apricots', category: 'Nuts & Dried Fruits' },
    ],
    cookware: [
      // Stovetop
      { id: 'frying-pan', name: 'Frying Pan', category: 'Stovetop' },
      { id: 'saucepan', name: 'Saucepan', category: 'Stovetop' },
      { id: 'dutch-oven', name: 'Dutch Oven', category: 'Stovetop' },
      { id: 'wok', name: 'Wok', category: 'Stovetop' },
      { id: 'stockpot', name: 'Stockpot', category: 'Stovetop' },
      { id: 'pressure-cooker', name: 'Pressure Cooker', category: 'Stovetop' },
      
      // Oven
      { id: 'baking-sheet', name: 'Baking Sheet', category: 'Oven' },
      { id: 'casserole-dish', name: 'Casserole Dish', category: 'Oven' },
      { id: 'roasting-pan', name: 'Roasting Pan', category: 'Oven' },
      { id: 'pizza-stone', name: 'Pizza Stone', category: 'Oven' },
      { id: 'muffin-tin', name: 'Muffin Tin', category: 'Oven' },
      { id: 'loaf-pan', name: 'Loaf Pan', category: 'Oven' },
      
      // Small Appliances
      { id: 'slow-cooker', name: 'Slow Cooker', category: 'Small Appliances' },
      { id: 'food-processor', name: 'Food Processor', category: 'Small Appliances' },
      { id: 'blender', name: 'Blender', category: 'Small Appliances' },
      { id: 'stand-mixer', name: 'Stand Mixer', category: 'Small Appliances' },
      { id: 'air-fryer', name: 'Air Fryer', category: 'Small Appliances' },
      { id: 'instant-pot', name: 'Instant Pot', category: 'Small Appliances' },
      
      // Outdoor
      { id: 'grill', name: 'Grill', category: 'Outdoor' },
      { id: 'smoker', name: 'Smoker', category: 'Outdoor' },
      { id: 'cast-iron-skillet', name: 'Cast Iron Skillet', category: 'Outdoor' },
      { id: 'grill-basket', name: 'Grill Basket', category: 'Outdoor' },
      { id: 'rotisserie', name: 'Rotisserie', category: 'Outdoor' },
      { id: 'dutch-oven-outdoor', name: 'Dutch Oven (Outdoor)', category: 'Outdoor' },
      
      // Prep Tools
      { id: 'cutting-board', name: 'Cutting Board', category: 'Prep Tools' },
      { id: 'knife-set', name: 'Knife Set', category: 'Prep Tools' },
      { id: 'mixing-bowls', name: 'Mixing Bowls', category: 'Prep Tools' },
      { id: 'measuring-cups', name: 'Measuring Cups', category: 'Prep Tools' },
      { id: 'colander', name: 'Colander', category: 'Prep Tools' },
      { id: 'grater', name: 'Grater', category: 'Prep Tools' },
      
      // Specialty
      { id: 'meat-thermometer', name: 'Meat Thermometer', category: 'Specialty' },
      { id: 'kitchen-scale', name: 'Kitchen Scale', category: 'Specialty' },
      { id: 'mortar-pestle', name: 'Mortar & Pestle', category: 'Specialty' },
      { id: 'mandoline', name: 'Mandoline', category: 'Specialty' },
      { id: 'butcher-block', name: 'Butcher Block', category: 'Specialty' },
      { id: 'sous-vide', name: 'Sous Vide', category: 'Specialty' },
    ],
  };

  // Define the step field type to include all possible values
  type StepField = keyof typeof ingredients | 'matches';

  const steps = [
    {
      title: 'Select Proteins',
      description: 'Choose the main proteins for your dish',
      field: 'proteins' as StepField,
      items: ingredients.proteins,
    },
    {
      title: 'Select Vegetables',
      description: 'Choose the vegetables for your dish',
      field: 'vegetables' as StepField,
      items: ingredients.vegetables,
    },
    {
      title: 'Select Grains & Spices',
      description: 'Choose the grains and spices for your dish',
      field: 'grainsAndSpices' as StepField,
      items: ingredients.grainsAndSpices,
    },
    {
      title: 'Select Pantry Items',
      description: 'Choose additional pantry items for your dish',
      field: 'pantry' as StepField,
      items: ingredients.pantry,
    },
    {
      title: 'Select Cookware',
      description: 'Choose the cookware you want to use',
      field: 'cookware' as StepField,
      items: ingredients.cookware,
    },
    {
      title: 'Recipe Matches',
      description: 'View recipes that match your selections',
      field: 'matches' as StepField,
      items: [],
    },
  ];

  const getItemsByCategory = (items: typeof ingredients.proteins) => {
    const categories: { [key: string]: typeof items } = {};
    
    // Add null check to prevent TypeError
    if (!items || !Array.isArray(items)) {
      return categories;
    }
    
    items.forEach(item => {
      const category = item.category || 'Other';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
    });
    
    return categories;
  };

  const handleNext = async () => {
    if (currentStep === steps.length - 2) {
      // This is the "Find Matches" step
      try {
        setLoading(true);

        // Create a pseudo-recipe from selected ingredients to match against
        const pseudoRecipe: Recipe = {
          id: 'temp-recipe',
          title: 'Selected Ingredients',
          description: 'Recipe based on selected ingredients',
          cookingTime: 0,
          servings: 0,
          difficulty: 'medium',
          imageUrl: '',
          ingredients: [],
          instructions: [],
          requiredCookware: selectedItems.cookware,
          proteinTags: selectedItems.proteins,
          veggieTags: selectedItems.vegetables,
          herbTags: selectedItems.grainsAndSpices,
          pantryTags: selectedItems.pantry,
          steps: []
        };

        // Find recipes that match the selected ingredients
        const matches = recipes
          .map(recipe => {
            const proteinMatches = recipe.proteinTags?.filter(tag => 
              selectedItems.proteins.includes(tag)
            )?.length || 0;
            const veggieMatches = recipe.veggieTags?.filter(tag => 
              selectedItems.vegetables.includes(tag)
            )?.length || 0;
            const herbMatches = recipe.herbTags?.filter(tag => 
              selectedItems.grainsAndSpices.includes(tag)
            )?.length || 0;
            const pantryMatches = recipe.pantryTags?.filter(tag => 
              selectedItems.pantry.includes(tag)
            )?.length || 0;
            const cookwareMatches = recipe.requiredCookware?.filter(item =>
              selectedItems.cookware.includes(item)
            )?.length || 0;

            const totalMatches = proteinMatches + veggieMatches + herbMatches + pantryMatches + cookwareMatches;
            const totalSelected = selectedItems.proteins.length + selectedItems.vegetables.length + 
                                 selectedItems.grainsAndSpices.length + selectedItems.pantry.length +
                                 selectedItems.cookware.length;
            
            // Calculate match percentage based on how many selected ingredients match the recipe
            const matchPercentage = totalSelected > 0 ? Math.round((totalMatches / totalSelected) * 100) : 0;
            
            return {
              ...recipe,
              matchPercentage
            };
          })
          // Don't filter out recipes with 0% match percentage
          // Sort by match percentage (highest first)
          .sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
        
        // Always show some recipes, take top 6 matches or all recipes if less than 6
        const topMatches = matches.slice(0, Math.min(6, matches.length));
        setMatchedRecipes(topMatches);
        
        // Show the RecipeMatching component
        setShowRecipeMatching(true);
      } catch (err) {
        console.error('Error matching recipes:', err);
      } finally {
        setLoading(false);
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const toggleCard = (recipeId: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [recipeId]: !prev[recipeId]
    }));
  };

  const handleRecipeSelect = (recipe: Recipe) => {
    if (currentRecipe?.id === recipe.id) {
      setCurrentRecipe(null);
    } else {
      setCurrentRecipe(recipe);
    }
    
    // Track achievements
    trackRecipeCreation();
    
    // Track ingredients used
    const allIngredients: string[] = [];
    
    // Add selected proteins
    selectedItems.proteins.forEach(protein => {
      allIngredients.push(protein);
    });
    
    // Add selected vegetables
    selectedItems.vegetables.forEach(vegetable => {
      allIngredients.push(vegetable);
    });
    
    // Add selected grains and spices
    selectedItems.grainsAndSpices.forEach(item => {
      allIngredients.push(item);
    });
    
    // Add selected pantry items
    selectedItems.pantry.forEach(item => {
      allIngredients.push(item);
    });
    
    // Track ingredients for achievement
    trackIngredientUsed(allIngredients);
    
    // Track cuisine for achievement if the recipe has a cuisine
    // or use the first preferred cuisine from the user's profile
    if (recipe.cuisine) {
      trackCuisineCreated(recipe.cuisine);
    } else if (userCuisines.length > 0) {
      // Use the first preferred cuisine from the user's profile
      const recipeCopy = { ...recipe, cuisine: userCuisines[0] };
      // Update the recipe with the cuisine
      recipe = recipeCopy;
      trackCuisineCreated(userCuisines[0]);
    }
    
    // Navigate to the recipe details page
    router.push(`/recipe/${recipe.id}`);
  };

  const handleClearAll = () => {
    setSelectedItems({
      proteins: [],
      vegetables: [],
      grainsAndSpices: [],
      pantry: [],
      cookware: [],
    });
  };

  const handleItemSelect = (category: keyof SelectedItems, item: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [category]: prev[category].includes(item)
        ? prev[category].filter(i => i !== item)
        : [...prev[category], item]
    }));
  };

  return (
    <div className="bg-vintage-50 p-6 rounded-lg">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-vintage rounded-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-butcher-800">{steps[currentStep].title}</h2>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-sm font-medium text-satriales-600 hover:text-satriales-700 transition-colors"
            >
              Clear All
            </button>
          </div>

          {currentStep < steps.length - 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(() => {
                const currentStepObj = steps[currentStep];
                if (!currentStepObj) {
                  return null;
                }
                
                const category = currentStepObj.field;
                
                // Handle the matches step or if ingredients for the category don't exist
                if (category === 'matches' || !ingredients[category as keyof typeof ingredients]) {
                  return null;
                }
                
                const items = ingredients[category as keyof typeof ingredients];
                const categorizedItems = getItemsByCategory(items);
                
                return Object.entries(categorizedItems).map(([subCategory, subItems]) => (
                  <div key={`${category}-${subCategory}`} className="bg-white rounded-lg shadow-vintage p-6 border border-butcher-100 hover:shadow-vintage-lg transition-all duration-300">
                    <h3 className="text-lg font-medium text-butcher-700 mb-4 border-b border-butcher-200 pb-2">
                      {subCategory}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {subItems.map(item => (
                        <button
                          key={item.id}
                          onClick={() => handleItemSelect(category as keyof SelectedItems, item.id)}
                          className={`
                            ${selectedItems[category as keyof SelectedItems].includes(item.id)
                              ? 'bg-satriales-100 border-satriales-500 text-satriales-700 shadow-sm'
                              : 'bg-vintage-50 border-butcher-200 text-butcher-700 hover:bg-white hover:border-satriales-300'
                            }
                            px-3 py-2 text-sm font-medium border rounded-md transition-all duration-200
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-satriales-500
                            hover:shadow-sm
                          `}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>
          ) : (
            <div>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-satriales-600"></div>
                </div>
              ) : (
                <div>
                  {showRecipeMatching ? (
                    <RecipeMatching userRecipes={matchedRecipes} />
                  ) : (
                    <div>
                      <h3 className="text-xl font-bold text-butcher-800 mb-4">
                        Recipe Recommendations Based on Your Ingredients
                      </h3>
                      <p className="text-butcher-600 mb-6">
                        Here are recipes ranked from most to least relevant to your selected ingredients.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {matchedRecipes.length > 0 ? (
                          matchedRecipes.map(matchedRecipe => (
                            <div
                              key={matchedRecipe.id}
                              className={`
                                bg-white shadow-vintage rounded-lg overflow-hidden transform transition-all duration-300
                                hover:shadow-vintage-lg hover:-translate-y-1
                                ${currentRecipe?.id === matchedRecipe.id ? 'ring-2 ring-satriales-500' : ''}
                              `}
                            >
                              <div className="relative">
                                <img
                                  src={matchedRecipe.imageUrl}
                                  alt={matchedRecipe.title}
                                  className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-0 right-0 m-4">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-satriales-100 text-satriales-800">
                                    {Math.round(matchedRecipe.matchPercentage || 0)}% Match
                                  </span>
                                </div>
                              </div>
                              <div className="p-6">
                                <h3 className="text-xl font-bold text-butcher-800 mb-2">
                                  {matchedRecipe.title}
                                </h3>
                                <p className="text-butcher-600 mb-4 line-clamp-2">
                                  {matchedRecipe.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <span className="flex items-center text-sm text-butcher-500">
                                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                      {matchedRecipe.cookingTime} mins
                                    </span>
                                    <span className="flex items-center text-sm text-butcher-500">
                                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0M7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                      </svg>
                                      {matchedRecipe.servings} servings
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => handleRecipeSelect(matchedRecipe)}
                                    className="px-4 py-2 text-sm font-medium text-satriales-600 hover:text-satriales-700"
                                  >
                                    {currentRecipe?.id === matchedRecipe.id ? 'Selected' : 'Select'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-3 text-center py-8">
                            <p className="text-butcher-600">No recipes found. Please try again with different ingredients.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`
                px-4 py-2 rounded-md text-sm font-medium
                ${currentStep === 0
                  ? 'bg-butcher-100 text-butcher-400 cursor-not-allowed'
                  : 'bg-butcher-500 text-white hover:bg-butcher-600'}
              `}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className={`
                px-4 py-2 rounded-md text-sm font-medium
                ${currentStep === steps.length - 1
                  ? 'bg-butcher-100 text-butcher-400 cursor-not-allowed'
                  : 'bg-satriales-600 text-white hover:bg-satriales-700'}
              `}
            >
              {currentStep === steps.length - 2 ? 'Find Matches' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipe;