import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Recipe } from '../utils/recipeData';
import { useSavedRecipes } from '../context/SavedRecipesContext';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useAchievementTracker } from '../utils/achievementTracker';

interface RecipeMatchingProps {
  userRecipes?: Recipe[];
}

// Mock data for recipe matching
const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Classic Pork Chops',
    description: 'Juicy, tender pork chops with a perfect sear and delicious seasoning.',
    ingredients: [
      '2 bone-in pork chops, 1-inch thick',
      '2 cloves garlic, minced',
      '1 tablespoon fresh rosemary, chopped',
      '1 teaspoon black pepper',
      '1 teaspoon kosher salt',
      '2 tablespoons olive oil'
    ],
    instructions: [
      'Pat pork chops dry with paper towels and season generously with salt and pepper on both sides.',
      'Mix minced garlic and chopped rosemary in a small bowl.',
      'Rub the garlic and rosemary mixture onto both sides of the pork chops.',
      'Heat olive oil in a large skillet over medium-high heat until shimmering.',
      'Add pork chops to the skillet and cook for 4-5 minutes on each side until golden brown and internal temperature reaches 145°F.',
      'Remove from heat and let rest for 5 minutes before serving.'
    ],
    cookingTime: 20,
    servings: 2,
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80',
    requiredCookware: ['skillet', 'tongs'],
    proteinTags: ['pork'],
    veggieTags: [],
    herbTags: ['rosemary', 'garlic'],
    pantryTags: ['olive oil', 'salt', 'pepper'],
    steps: [],
    matchPercentage: 95,
    cuisine: 'American'
  },
  {
    id: '2',
    title: 'Garlic Butter Steak',
    description: 'Perfectly seared steak with a rich garlic butter sauce.',
    ingredients: [
      '2 ribeye steaks, 1-inch thick',
      '4 tablespoons butter',
      '4 cloves garlic, minced',
      '2 sprigs fresh thyme',
      '1 sprig fresh rosemary',
      '1 tablespoon olive oil',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Remove steaks from refrigerator 30 minutes before cooking to bring to room temperature.',
      'Pat steaks dry with paper towels and season generously with salt and pepper on both sides.',
      'Heat olive oil in a cast iron skillet over high heat until smoking.',
      'Add steaks to the skillet and cook for 3-4 minutes on each side for medium-rare.',
      'Reduce heat to medium-low, add butter, garlic, thyme, and rosemary to the skillet.',
      'Tilt the pan slightly and spoon the garlic butter over the steaks continuously for 1-2 minutes.',
      'Remove steaks from the skillet and let rest for 5-10 minutes before serving.',
      'Slice against the grain and serve with the garlic butter sauce from the pan.'
    ],
    cookingTime: 25,
    servings: 2,
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    requiredCookware: ['cast iron skillet', 'tongs'],
    proteinTags: ['beef'],
    veggieTags: [],
    herbTags: ['thyme', 'rosemary', 'garlic'],
    pantryTags: ['butter', 'olive oil', 'salt', 'pepper'],
    steps: [],
    matchPercentage: 85,
    cuisine: 'American'
  },
  {
    id: '3',
    title: 'Herb Roasted Chicken',
    description: 'Whole roasted chicken with herbs and lemon for a perfect Sunday dinner.',
    ingredients: [
      '1 whole chicken (4-5 pounds)',
      '1 lemon, quartered',
      '4 cloves garlic, crushed',
      '2 tablespoons fresh thyme leaves',
      '2 tablespoons fresh rosemary, chopped',
      '2 tablespoons olive oil',
      '1 tablespoon butter, softened',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Preheat oven to 425°F (220°C).',
      'Remove giblets from chicken cavity and pat the chicken dry with paper towels.',
      'In a small bowl, mix together softened butter, thyme, rosemary, salt, and pepper.',
      'Gently loosen the skin over the chicken breast and spread the herb butter underneath.',
      'Stuff the chicken cavity with quartered lemon and crushed garlic cloves.',
      'Tie the legs together with kitchen twine and tuck the wing tips under the body.',
      'Rub the outside of the chicken with olive oil and season with additional salt and pepper.',
      'Place the chicken breast-side up in a roasting pan.',
      'Roast for 1 hour and 15 minutes, or until the internal temperature reaches 165°F (74°C) in the thickest part of the thigh.',
      'Let the chicken rest for 15 minutes before carving and serving.'
    ],
    cookingTime: 75,
    servings: 4,
    difficulty: 'medium',
    imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80',
    requiredCookware: ['roasting pan', 'kitchen twine', 'meat thermometer'],
    proteinTags: ['chicken'],
    veggieTags: [],
    herbTags: ['thyme', 'rosemary', 'garlic'],
    pantryTags: ['olive oil', 'butter', 'salt', 'pepper'],
    steps: [],
    matchPercentage: 78,
    cuisine: 'American'
  },
  {
    id: '4',
    title: 'Vegetable Stir Fry',
    description: 'Quick and healthy vegetable stir fry with a savory sauce.',
    ingredients: [
      '2 tablespoons vegetable oil',
      '2 cloves garlic, minced',
      '1 tablespoon ginger, grated',
      '1 bell pepper, sliced',
      '1 carrot, julienned',
      '1 cup broccoli florets',
      '1 cup snap peas',
      '1 cup mushrooms, sliced',
      '2 tablespoons soy sauce',
      '1 tablespoon oyster sauce',
      '1 teaspoon sesame oil',
      '1/4 cup water',
      '1 teaspoon cornstarch (mixed with water)'
    ],
    instructions: [
      'Heat vegetable oil in a wok or large skillet over high heat.',
      'Add garlic and ginger, stir-fry for 30 seconds until fragrant.',
      'Add carrots and stir-fry for 1 minute.',
      'Add bell pepper, broccoli, and snap peas, stir-fry for 2-3 minutes.',
      'Add mushrooms and stir-fry for another minute.',
      'In a small bowl, mix soy sauce, oyster sauce, sesame oil, water, and cornstarch slurry.',
      'Pour sauce over vegetables and stir to coat evenly.',
      'Cook for 1-2 more minutes until sauce thickens and vegetables are crisp-tender.',
      'Serve immediately over rice or noodles.'
    ],
    cookingTime: 15,
    servings: 4,
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    requiredCookware: ['wok', 'spatula'],
    proteinTags: [],
    veggieTags: ['bell pepper', 'carrot', 'broccoli', 'snap peas', 'mushrooms'],
    herbTags: ['garlic', 'ginger'],
    pantryTags: ['soy sauce', 'oyster sauce', 'sesame oil', 'cornstarch'],
    steps: [],
    matchPercentage: 65,
    cuisine: 'Asian'
  }
];

// Fallback recipes to show when no matches are found
const fallbackRecipes: Recipe[] = [
  {
    id: '5',
    title: 'Simple Pasta Marinara',
    description: 'Classic pasta with marinara sauce, ready in minutes.',
    ingredients: [
      '8 oz spaghetti or pasta of choice',
      '2 cups marinara sauce',
      '2 cloves garlic, minced',
      '1 tablespoon olive oil',
      '1/4 cup fresh basil, chopped',
      'Grated Parmesan cheese for serving',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Bring a large pot of salted water to a boil.',
      'Add pasta and cook according to package instructions until al dente.',
      'While pasta is cooking, heat olive oil in a saucepan over medium heat.',
      'Add minced garlic and sauté for 30 seconds until fragrant.',
      'Add marinara sauce and simmer for 5 minutes.',
      'Season with salt and pepper to taste.',
      'Drain pasta and return to pot.',
      'Pour sauce over pasta and toss to coat evenly.',
      'Serve topped with fresh basil and grated Parmesan cheese.'
    ],
    cookingTime: 15,
    servings: 2,
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1563379926898-4316c288032e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    requiredCookware: ['pot', 'saucepan', 'colander'],
    proteinTags: [],
    veggieTags: [],
    herbTags: ['basil', 'garlic'],
    pantryTags: ['pasta', 'marinara sauce', 'olive oil', 'parmesan'],
    steps: [],
    matchPercentage: 50,
    cuisine: 'Italian'
  },
  {
    id: '6',
    title: 'Avocado Toast',
    description: 'Simple and nutritious avocado toast with various toppings.',
    ingredients: [
      '2 slices whole grain bread',
      '1 ripe avocado',
      '1 tablespoon lemon juice',
      '1/4 teaspoon red pepper flakes',
      '2 eggs (optional)',
      'Salt and pepper to taste',
      'Microgreens or sprouts for garnish'
    ],
    instructions: [
      'Toast bread slices until golden brown.',
      'Cut avocado in half, remove pit, and scoop flesh into a bowl.',
      'Add lemon juice, salt, and pepper to avocado and mash with a fork to desired consistency.',
      'Spread mashed avocado evenly on toast slices.',
      'If using eggs, fry or poach them to your liking.',
      'Top avocado toast with eggs if desired.',
      'Sprinkle with red pepper flakes and garnish with microgreens.',
      'Serve immediately.'
    ],
    cookingTime: 10,
    servings: 1,
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1603046891744-76176c7f0e25?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
    requiredCookware: ['toaster', 'bowl', 'fork'],
    proteinTags: ['eggs'],
    veggieTags: ['avocado'],
    herbTags: [],
    pantryTags: ['bread', 'lemon juice', 'red pepper flakes', 'salt', 'pepper'],
    steps: [],
    matchPercentage: 40,
    cuisine: 'American'
  },
  {
    id: '7',
    title: 'Fruit Smoothie Bowl',
    description: 'Refreshing smoothie bowl topped with fresh fruits and granola.',
    ingredients: [
      '1 frozen banana',
      '1 cup frozen mixed berries',
      '1/2 cup Greek yogurt',
      '1/4 cup milk of choice',
      '1 tablespoon honey or maple syrup',
      'Toppings: sliced banana, fresh berries, granola, chia seeds, coconut flakes'
    ],
    instructions: [
      'Add frozen banana, mixed berries, Greek yogurt, milk, and sweetener to a blender.',
      'Blend until smooth, adding more milk if needed to reach desired consistency.',
      'Pour smoothie into a bowl.',
      'Arrange toppings in sections over the smoothie.',
      'Serve immediately before it melts.'
    ],
    cookingTime: 5,
    servings: 1,
    difficulty: 'easy',
    imageUrl: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1764&q=80',
    requiredCookware: ['blender', 'bowl'],
    proteinTags: [],
    veggieTags: ['banana', 'berries'],
    herbTags: [],
    pantryTags: ['yogurt', 'milk', 'honey', 'granola', 'chia seeds', 'coconut flakes'],
    steps: [],
    matchPercentage: 35,
    cuisine: 'American'
  }
];

const RecipeMatching: React.FC<RecipeMatchingProps> = ({
  userRecipes
}) => {
  const { user } = useAuth();
  const { addToSaved, removeFromSaved, isRecipeSaved, addToCollection, removeFromCollection } = useSavedRecipes();
  const { trackRecipeSaved, trackIngredientUsed, trackCuisineCreated } = useAchievementTracker();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  
  // Use userRecipes if provided, otherwise use mockRecipes
  const recipes = userRecipes && userRecipes.length > 0 ? userRecipes : mockRecipes;
  
  // Filter recipes based on active category
  const filteredRecipes = activeCategory === 'all' 
    ? recipes 
    : recipes.filter(recipe => {
        if (activeCategory === 'easy') return recipe.difficulty === 'easy';
        if (activeCategory === 'medium') return recipe.difficulty === 'medium';
        if (activeCategory === 'hard') return recipe.difficulty === 'hard';
        return true;
      });

  // Use fallback recipes if no recipes match the filter
  const displayRecipes = filteredRecipes.length > 0 ? filteredRecipes : fallbackRecipes;

  // Function to get a color based on match percentage
  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 75) return 'bg-green-400';
    if (percentage >= 60) return 'bg-yellow-400';
    if (percentage >= 40) return 'bg-yellow-300';
    return 'bg-gray-300';
  };

  // Function to get a background style based on recipe type
  const getRecipeBackground = (recipe: Recipe) => {
    if (recipe.proteinTags?.includes('pork')) return 'bg-pink-50';
    if (recipe.proteinTags?.includes('beef')) return 'bg-red-50';
    if (recipe.proteinTags?.includes('chicken')) return 'bg-yellow-50';
    if (recipe.proteinTags?.includes('fish')) return 'bg-blue-50';
    if (recipe.veggieTags?.length > 0) return 'bg-green-50';
    return 'bg-gray-50';
  };

  // Function to flip a card
  const flipCard = (recipeId: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [recipeId]: !prev[recipeId]
    }));
  };

  // Function to toggle a recipe in cookbook (add or remove)
  const toggleSaveRecipe = (recipe: Recipe) => {
    if (isRecipeSaved(recipe.id)) {
      removeFromSaved(recipe.id);
      removeFromCollection('favorites', recipe.id);
    } else {
      addToSaved(recipe);
      addToCollection('favorites', recipe.id);
      
      // Track achievements
      trackRecipeSaved();
      
      // Track ingredients used for the Flavor Explorer achievement
      if (recipe.ingredients && recipe.ingredients.length > 0) {
        // Extract ingredient names from the ingredients array
        const ingredientNames = recipe.ingredients.map(ing => 
          typeof ing === 'string' ? ing : ing.name
        );
        trackIngredientUsed(ingredientNames);
      }
      
      // Track cuisine for the Global Chef achievement
      if (recipe.cuisine) {
        trackCuisineCreated(recipe.cuisine);
      }
    }
  };

  return (
    <div className="mt-8 bg-white shadow rounded-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-butcher-900 font-serif">Recipes You Might Like</h2>
          <p className="text-butcher-600">Based on your selected ingredients</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === 'all' 
                ? 'bg-porkchop-500 text-white' 
                : 'bg-vintage-100 text-butcher-700 hover:bg-vintage-200'
            }`}
            onClick={() => setActiveCategory('all')}
          >
            All Recipes
          </button>
          <button
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === 'easy' 
                ? 'bg-porkchop-500 text-white' 
                : 'bg-vintage-100 text-butcher-700 hover:bg-vintage-200'
            }`}
            onClick={() => setActiveCategory('easy')}
          >
            Easy
          </button>
          <button
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === 'medium' 
                ? 'bg-porkchop-500 text-white' 
                : 'bg-vintage-100 text-butcher-700 hover:bg-vintage-200'
            }`}
            onClick={() => setActiveCategory('medium')}
          >
            Medium
          </button>
          <button
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === 'hard' 
                ? 'bg-porkchop-500 text-white' 
                : 'bg-vintage-100 text-butcher-700 hover:bg-vintage-200'
            }`}
            onClick={() => setActiveCategory('hard')}
          >
            Hard
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayRecipes.map(recipe => (
          <div 
            key={recipe.id} 
            className={`
              bg-white rounded-lg overflow-hidden relative
              h-[450px] perspective-1000
            `}
            style={{
              boxShadow: '0 4px 6px -1px rgba(169, 124, 80, 0.1), 0 2px 4px -1px rgba(169, 124, 80, 0.06)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'rgba(236, 213, 197, 0.6)'
            }}
          >
            {/* Card Front */}
            <div 
              className={`
                absolute w-full h-full backface-hidden transition-all duration-500
                ${flippedCards[recipe.id] ? 'rotate-y-180' : ''}
              `}
            >
              <div className="h-48 relative">
                <img 
                  src={recipe.imageUrl || '/images/placeholder-recipe.jpg'} 
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder-recipe.jpg';
                  }}
                />
                <div className="absolute top-2 right-2">
                  <div className="flex items-center bg-white px-2 py-1 rounded-full shadow-md">
                    <div className={`w-2 h-2 rounded-full mr-1 ${getMatchColor(recipe.matchPercentage || 0)}`}></div>
                    <span className="text-xs font-medium text-butcher-800">{recipe.matchPercentage || 0}% Match</span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <div className="flex justify-between">
                    <span className="text-xs font-medium text-white px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-sm">
                      {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
                    </span>
                    {recipe.cuisine && (
                      <span className="text-xs font-medium text-white px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-sm">
                        🌍 {recipe.cuisine}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif font-semibold text-butcher-800 text-lg">{recipe.title}</h3>
                  <span className="flex items-center text-xs text-butcher-500">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {recipe.cookingTime} mins
                  </span>
                </div>
                
                <p className="text-sm text-butcher-600 mb-3 line-clamp-2">{recipe.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {[...recipe.proteinTags, ...recipe.herbTags.slice(0, 2)].slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="text-xs bg-vintage-100 text-butcher-700 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                  {recipe.servings > 0 && (
                    <span className="text-xs bg-vintage-100 text-butcher-700 px-2 py-0.5 rounded-full">
                      {recipe.servings} {recipe.servings === 1 ? 'serving' : 'servings'}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <button 
                      className={`
                        p-1.5 rounded-full transition-colors
                        ${isRecipeSaved(recipe.id) 
                          ? 'bg-satriales-100 text-satriales-600' 
                          : 'bg-vintage-100 hover:bg-vintage-200 text-butcher-600'}
                      `}
                      onClick={() => toggleSaveRecipe(recipe)}
                      title={isRecipeSaved(recipe.id) ? "Remove from cookbook" : "Save to cookbook"}
                    >
                      <svg className="w-4 h-4" fill={isRecipeSaved(recipe.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    <button className="p-1.5 rounded-full bg-vintage-100 hover:bg-vintage-200 text-butcher-600 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                  
                  <button 
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-porkchop-500 text-white hover:bg-porkchop-600 transition-colors shadow-sm"
                    onClick={() => flipCard(recipe.id)}
                  >
                    View Recipe
                  </button>
                </div>
              </div>
            </div>

            {/* Card Back */}
            <div 
              className={`
                absolute w-full h-full backface-hidden transition-all duration-500 bg-white p-5 overflow-y-auto
                ${flippedCards[recipe.id] ? '' : 'rotate-y-180'}
              `}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-serif font-semibold text-butcher-800 text-lg">{recipe.title}</h3>
                <button 
                  onClick={() => flipCard(recipe.id)}
                  className="p-1.5 rounded-full bg-vintage-100 hover:bg-vintage-200 text-butcher-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-butcher-700 mb-2">Ingredients:</h4>
                <ul className="text-sm text-butcher-600 space-y-1 pl-4 list-disc">
                  {recipe.ingredients.map((ingredient, idx) => (
                    <li key={idx}>
                      {typeof ingredient === 'string' 
                        ? ingredient 
                        : `${ingredient.amount} ${ingredient.unit} ${ingredient.name}${ingredient.preparation ? `, ${ingredient.preparation}` : ''}`
                      }
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-butcher-700 mb-2">Instructions:</h4>
                <ol className="text-sm text-butcher-600 space-y-2 pl-4 list-decimal">
                  {recipe.instructions.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-vintage-200">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-butcher-500">
                    {recipe.cookingTime} mins | {recipe.servings} servings
                  </span>
                </div>
                
                <button 
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm transition-colors
                    ${isRecipeSaved(recipe.id)
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-satriales-600 text-white hover:bg-satriales-700'}
                  `}
                  onClick={() => toggleSaveRecipe(recipe)}
                >
                  {isRecipeSaved(recipe.id) ? 'Remove from Cookbook' : 'Add to Cookbook'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <button className="px-5 py-2.5 bg-white border border-porkchop-300 text-porkchop-600 rounded-lg font-medium hover:bg-porkchop-50 transition-colors shadow-sm">
          View More Recipe Matches
        </button>
      </div>
    </div>
  );
};

export default RecipeMatching;
