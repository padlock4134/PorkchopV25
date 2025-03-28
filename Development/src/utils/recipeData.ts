import Papa from 'papaparse';

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  preparation?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  cookingTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl: string;
  ingredients: (string | Ingredient)[];
  instructions: string[];
  requiredCookware: string[];
  cookware: string[];
  proteinTags: string[];
  veggieTags: string[];
  herbTags: string[];
  pantryTags: string[];
  steps: string[];
  prepTime?: number;
  totalTime?: number;
  cuisine?: string;
  tags?: string[];
  equipment?: string[];
  nutritionInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  matchPercentage?: number;
}

// Keep our mock recipes as fallback
export const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Classic Pork Chops',
    description: 'Juicy, tender pork chops with a perfect sear and delicious seasoning.',
    ingredients: [
      'pork-chop',
      'garlic',
      'rosemary',
      'black-pepper',
      'salt'
    ],
    instructions: [
      'Season pork chops',
      'Heat skillet',
      'Cook 4-5 minutes per side'
    ],
    cookingTime: 20,
    servings: 4,
    difficulty: 'medium',
    cuisine: 'American',
    imageUrl: 'https://example.com/porkchop.jpg',
    requiredCookware: ['skillet', 'tongs'],
    cookware: ['skillet', 'tongs'],
    proteinTags: ['pork'],
    veggieTags: [],
    herbTags: ['rosemary', 'garlic'],
    pantryTags: [],
    steps: [
      'Season pork chops',
      'Heat skillet',
      'Cook 4-5 minutes per side'
    ]
  },
  {
    id: '2',
    title: 'Herb-Crusted Pork Tenderloin',
    description: 'Tender pork loin coated with a fragrant herb crust and roasted to perfection.',
    ingredients: [
      'pork-tenderloin',
      'thyme',
      'rosemary',
      'sage',
      'garlic',
      'olive-oil'
    ],
    instructions: [
      'Preheat oven to 375°F',
      'Mix herbs and oil to create paste',
      'Coat tenderloin with herb mixture',
      'Roast for 25-30 minutes until internal temperature reaches 145°F',
      'Let rest for 5 minutes before slicing'
    ],
    cookingTime: 35,
    servings: 6,
    difficulty: 'medium',
    cuisine: 'French',
    imageUrl: 'https://example.com/pork-tenderloin.jpg',
    requiredCookware: ['roasting-pan', 'meat-thermometer'],
    cookware: ['roasting-pan', 'meat-thermometer'],
    proteinTags: ['pork'],
    veggieTags: [],
    herbTags: ['thyme', 'rosemary', 'sage', 'garlic'],
    pantryTags: ['olive-oil'],
    steps: [
      'Preheat oven to 375°F',
      'Mix herbs and oil to create paste',
      'Coat tenderloin with herb mixture',
      'Roast for 25-30 minutes until internal temperature reaches 145°F',
      'Let rest for 5 minutes before slicing'
    ]
  },
  {
    id: '3',
    title: 'Spicy Korean Pork Belly',
    description: 'Crispy pork belly slices marinated in a spicy Korean sauce and grilled to perfection.',
    ingredients: [
      'pork-belly',
      'gochujang',
      'soy-sauce',
      'brown-sugar',
      'garlic',
      'ginger',
      'sesame-oil'
    ],
    instructions: [
      'Slice pork belly into 1/4-inch thick pieces',
      'Mix marinade ingredients',
      'Marinate pork for at least 2 hours',
      'Grill or pan-fry until crispy and caramelized',
      'Garnish with green onions and sesame seeds'
    ],
    cookingTime: 30,
    servings: 4,
    difficulty: 'hard',
    cuisine: 'Korean',
    imageUrl: 'https://example.com/korean-pork-belly.jpg',
    requiredCookware: ['grill', 'mixing-bowl'],
    cookware: ['grill', 'mixing-bowl'],
    proteinTags: ['pork'],
    veggieTags: [],
    herbTags: ['garlic', 'ginger'],
    pantryTags: ['gochujang', 'soy-sauce', 'brown-sugar', 'sesame-oil'],
    steps: [
      'Slice pork belly into 1/4-inch thick pieces',
      'Mix marinade ingredients',
      'Marinate pork for at least 2 hours',
      'Grill or pan-fry until crispy and caramelized',
      'Garnish with green onions and sesame seeds'
    ]
  },
  {
    id: '4',
    title: 'Italian Porchetta',
    description: 'Traditional Italian porchetta with crispy skin and herb-infused meat.',
    ingredients: [
      'pork-belly',
      'pork-loin',
      'rosemary',
      'sage',
      'fennel-seeds',
      'garlic',
      'lemon-zest',
      'salt',
      'black-pepper'
    ],
    instructions: [
      'Butterfly pork loin and lay flat',
      'Mix herbs, garlic, and seasonings',
      'Spread mixture over pork',
      'Roll and tie with butcher twine',
      'Roast at 450°F for 30 minutes, then reduce to 325°F for 2 hours',
      'Let rest before slicing'
    ],
    cookingTime: 150,
    servings: 8,
    difficulty: 'hard',
    cuisine: 'Italian',
    imageUrl: 'https://example.com/porchetta.jpg',
    requiredCookware: ['roasting-pan', 'butcher-twine', 'meat-thermometer'],
    cookware: ['roasting-pan', 'butcher-twine', 'meat-thermometer'],
    proteinTags: ['pork'],
    veggieTags: [],
    herbTags: ['rosemary', 'sage', 'garlic'],
    pantryTags: ['fennel-seeds', 'lemon-zest', 'salt', 'black-pepper'],
    steps: [
      'Butterfly pork loin and lay flat',
      'Mix herbs, garlic, and seasonings',
      'Spread mixture over pork',
      'Roll and tie with butcher twine',
      'Roast at 450°F for 30 minutes, then reduce to 325°F for 2 hours',
      'Let rest before slicing'
    ]
  },
  {
    id: '5',
    title: 'Spanish Pork and Chorizo Stew',
    description: 'Hearty Spanish stew with pork shoulder, chorizo, and smoky paprika.',
    ingredients: [
      'pork-shoulder',
      'chorizo',
      'onion',
      'bell-pepper',
      'tomatoes',
      'garlic',
      'smoked-paprika',
      'bay-leaf',
      'chicken-stock'
    ],
    instructions: [
      'Cut pork shoulder into 1-inch cubes',
      'Brown pork and chorizo in a Dutch oven',
      'Add vegetables and sauté',
      'Add spices, tomatoes, and stock',
      'Simmer for 2 hours until pork is tender',
      'Serve with crusty bread'
    ],
    cookingTime: 150,
    servings: 6,
    difficulty: 'medium',
    cuisine: 'Spanish',
    imageUrl: 'https://example.com/spanish-pork-stew.jpg',
    requiredCookware: ['dutch-oven', 'wooden-spoon'],
    cookware: ['dutch-oven', 'wooden-spoon'],
    proteinTags: ['pork', 'chorizo'],
    veggieTags: ['onion', 'bell-pepper', 'tomatoes'],
    herbTags: ['garlic', 'bay-leaf'],
    pantryTags: ['smoked-paprika', 'chicken-stock'],
    steps: [
      'Cut pork shoulder into 1-inch cubes',
      'Brown pork and chorizo in a Dutch oven',
      'Add vegetables and sauté',
      'Add spices, tomatoes, and stock',
      'Simmer for 2 hours until pork is tender',
      'Serve with crusty bread'
    ]
  }
];

export const parseCSVRecipes = async (): Promise<Recipe[]> => {
  try {
    console.log('Fetching recipe data...');
    const response = await fetch('/data/csv/recipes_rows.csv');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvData = await response.text();
    console.log('CSV data loaded, parsing...');
    
    const { data } = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true
    });

    console.log('Parsed CSV data:', data.length, 'rows found');

    const validRecipes = data
      .filter((row: any): row is Recipe => {
        const isValid = row && 
               typeof row.id === 'string' &&
               typeof row.name === 'string' &&
               typeof row.description === 'string' &&
               typeof row.image_url === 'string' &&
               typeof row.ingredients === 'string' &&
               typeof row.steps === 'string' &&
               typeof row.cook_time === 'string' &&
               typeof row.prep_time === 'string' &&
               typeof row.servings === 'string' &&
               typeof row.required_cookware === 'string' &&
               typeof row.protein_tags === 'string' &&
               typeof row.veggie_tags === 'string' &&
               typeof row.herb_tags === 'string';

        if (!isValid) {
          console.warn('Invalid recipe row:', row);
        }
        return isValid;
      })
      .map((row: any): Recipe | null => {
        try {
          return {
            id: row.id,
            title: row.name,
            description: row.description,
            imageUrl: row.image_url,
            ingredients: JSON.parse(row.ingredients),
            instructions: JSON.parse(row.steps),
            cookingTime: parseInt(row.cook_time),
            servings: parseInt(row.servings),
            difficulty: 'medium', // Default difficulty
            requiredCookware: JSON.parse(row.required_cookware),
            cookware: JSON.parse(row.required_cookware),
            proteinTags: JSON.parse(row.protein_tags),
            veggieTags: JSON.parse(row.veggie_tags),
            herbTags: JSON.parse(row.herb_tags),
            pantryTags: JSON.parse(row.pantry_tags),
            steps: JSON.parse(row.steps),
            prepTime: row.prep_time ? parseInt(row.prep_time) : undefined,
            totalTime: row.cook_time ? parseInt(row.cook_time) + (row.prep_time ? parseInt(row.prep_time) : 0) : undefined,
            cuisine: row.cuisine,
            tags: row.tags ? JSON.parse(row.tags) : undefined,
            equipment: row.equipment ? JSON.parse(row.equipment) : undefined,
            nutritionInfo: row.calories || row.protein || row.carbs || row.fat ? {
              calories: row.calories ? parseInt(row.calories) : undefined,
              protein: row.protein ? parseInt(row.protein) : undefined,
              carbs: row.carbs ? parseInt(row.carbs) : undefined,
              fat: row.fat ? parseInt(row.fat) : undefined
            } : undefined
          };
        } catch (e) {
          console.warn('Failed to parse recipe:', row);
          return null;
        }
      })
      .filter((recipe): recipe is Recipe => recipe !== null);

    console.log('Successfully loaded', validRecipes.length, 'recipes');
    return validRecipes;
  } catch (error) {
    console.error('Error loading recipes:', error);
    console.log('Falling back to mock recipes');
    return mockRecipes;
  }
};

export const normalizeIngredient = (ingredient: string | unknown): string => {
  if (typeof ingredient !== 'string') {
    console.warn('Received non-string ingredient:', ingredient);
    return '';
  }
  
  return ingredient.toLowerCase()
    .replace(/[0-9]+/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .split(' ')
    .filter(word => !['cup', 'cups', 'tablespoon', 'tablespoons', 'teaspoon', 'teaspoons', 
                      'pound', 'pounds', 'oz', 'ounce', 'ounces', 'lb', 'lbs', 'g', 'gram', 
                      'grams', 'ml', 'milliliter', 'milliliters', 'large', 'medium', 'small', 
                      'fresh', 'dried', 'piece', 'pieces', 'inch', 'inches'].includes(word))
    .join(' ');
};

export const findSimilarRecipes = (
  recipe: Recipe, 
  allRecipes: Recipe[], 
  count: number = 3,
  userPreferredCuisines: string[] = []
): Recipe[] => {
  if (!recipe || !allRecipes || allRecipes.length === 0) {
    return [];
  }
  
  // Filter out the current recipe from candidates
  const candidates = allRecipes.filter(r => r.id !== recipe.id);
  
  // Score each candidate recipe based on similarity
  const scoredRecipes = candidates
    .map(candidateRecipe => {
      let score = 0;
      
      // Score based on protein tags overlap
      const proteinOverlap = recipe.proteinTags.filter(tag => 
        candidateRecipe.proteinTags.includes(tag)).length;
      score += proteinOverlap * 3; // Proteins are important for matching
      
      // Score based on veggie tags overlap
      const veggieOverlap = recipe.veggieTags.filter(tag => 
        candidateRecipe.veggieTags.includes(tag)).length;
      score += veggieOverlap * 2;
      
      // Score based on herb tags overlap
      const herbOverlap = recipe.herbTags.filter(tag => 
        candidateRecipe.herbTags.includes(tag)).length;
      score += herbOverlap * 1.5;
      
      // Score based on cuisine type if available
      if (recipe.cuisine && candidateRecipe.cuisine && 
          recipe.cuisine === candidateRecipe.cuisine) {
        score += 5;
      }
      
      // Boost score if candidate recipe's cuisine is in user's preferred cuisines
      if (userPreferredCuisines.length > 0 && 
          candidateRecipe.cuisine && 
          userPreferredCuisines.includes(candidateRecipe.cuisine)) {
        score += 7; // Higher boost than matching the current recipe's cuisine
      }
      
      // Score based on cooking method similarity (using requiredCookware as proxy)
      const cookwareOverlap = recipe.requiredCookware.filter(item => 
        candidateRecipe.requiredCookware.includes(item)).length;
      score += cookwareOverlap;
      
      // Calculate match percentage (for display purposes)
      // Max possible score would be if all tags matched plus same cuisine
      const maxPossibleScore = 
        (recipe.proteinTags.length * 3) + 
        (recipe.veggieTags.length * 2) + 
        (recipe.herbTags.length * 1.5) + 
        (recipe.cuisine ? 5 : 0) +
        (userPreferredCuisines.length > 0 ? 7 : 0) +
        recipe.requiredCookware.length;
      
      const matchPercentage = maxPossibleScore > 0 
        ? Math.round((score / maxPossibleScore) * 100) 
        : 0;
      
      return {
        ...candidateRecipe,
        matchPercentage
      };
    });
  
  // Sort by score (highest first) and take the top 'count' recipes
  return scoredRecipes
    .sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0))
    .slice(0, count);
};

export const getRandomRecipes = (
  allRecipes: Recipe[], 
  count: number = 3,
  userPreferredCuisines: string[] = []
): Recipe[] => {
  if (!allRecipes || allRecipes.length === 0) {
    return [];
  }
  
  // If user has preferred cuisines, prioritize those recipes first
  if (userPreferredCuisines.length > 0) {
    const preferredCuisineRecipes = allRecipes.filter(
      recipe => recipe.cuisine && userPreferredCuisines.includes(recipe.cuisine)
    );
    
    // If we have enough preferred cuisine recipes, return those
    if (preferredCuisineRecipes.length >= count) {
      // Shuffle the array to get random recipes from preferred cuisines
      return shuffleArray(preferredCuisineRecipes).slice(0, count);
    }
    
    // If we don't have enough, get some from preferred cuisines and fill the rest with random
    if (preferredCuisineRecipes.length > 0) {
      const shuffledPreferred = shuffleArray(preferredCuisineRecipes);
      const remainingCount = count - shuffledPreferred.length;
      
      // Get remaining recipes excluding the ones we already selected
      const remainingRecipeIds = shuffledPreferred.map(r => r.id);
      const otherRecipes = shuffleArray(
        allRecipes.filter(r => !remainingRecipeIds.includes(r.id))
      ).slice(0, remainingCount);
      
      return [...shuffledPreferred, ...otherRecipes];
    }
  }
  
  // If no preferred cuisines or not enough matches, just return random recipes
  return shuffleArray(allRecipes).slice(0, count);
};

// Helper function to shuffle an array
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Gets a featured recipe that changes daily at midnight
 * Uses the current date as a seed to ensure the same recipe is shown all day
 */
export const getDailyFeaturedRecipe = (
  allRecipes: Recipe[],
  userPreferredCuisines: string[] = []
): Recipe | null => {
  if (!allRecipes || allRecipes.length === 0) {
    return null;
  }
  
  // Get today's date (without time) to use as a seed
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  
  // Create a deterministic seed based on the date
  let seed = 0;
  for (let i = 0; i < dateString.length; i++) {
    seed += dateString.charCodeAt(i);
  }
  
  // Use the seed to select a recipe index
  const recipeIndex = seed % allRecipes.length;
  
  // First try to get a recipe from user's preferred cuisines
  if (userPreferredCuisines.length > 0) {
    const preferredCuisineRecipes = allRecipes.filter(
      recipe => recipe.cuisine && userPreferredCuisines.includes(recipe.cuisine)
    );
    
    if (preferredCuisineRecipes.length > 0) {
      // Use the same seed to select from preferred recipes
      const preferredIndex = seed % preferredCuisineRecipes.length;
      return preferredCuisineRecipes[preferredIndex];
    }
  }
  
  // If no preferred cuisines or no matches, return a recipe using the seed
  return allRecipes[recipeIndex];
};