import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Recipe, findSimilarRecipes, getRandomRecipes } from '../utils/recipeData';
import { useAuth } from '../context/AuthContext';

interface RecipeListProps {
  recipes: Recipe[];
  selectedRecipe?: Recipe;
  showSuggestions?: boolean;
}

const getDifficultyColor = (difficulty: Recipe['difficulty']) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'hard':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const RecipeList: React.FC<RecipeListProps> = ({ 
  recipes, 
  selectedRecipe, 
  showSuggestions = false 
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const searchTerm = (router.query.search as string)?.toLowerCase() || '';
  const [suggestedRecipes, setSuggestedRecipes] = useState<Recipe[]>([]);
  
  // Get user's preferred cuisines
  const userPreferredCuisines = useMemo(() => {
    return user?.preferredCuisines || [];
  }, [user]);

  // Filter recipes based on search term
  const filteredRecipes = useMemo(() => {
    if (!searchTerm) return recipes;

    return recipes.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(searchTerm) ||
        recipe.description.toLowerCase().includes(searchTerm)
    );
  }, [recipes, searchTerm]);

  // Generate recipe suggestions when selectedRecipe changes
  useEffect(() => {
    if (showSuggestions) {
      if (selectedRecipe) {
        // Find similar recipes based on the selected recipe and user preferences
        const similar = findSimilarRecipes(selectedRecipe, recipes, 3, userPreferredCuisines);
        setSuggestedRecipes(similar);
      } else {
        // Get random recipes with preference for user's preferred cuisines
        const random = getRandomRecipes(recipes, 3, userPreferredCuisines);
        setSuggestedRecipes(random);
      }
    }
  }, [selectedRecipe, recipes, showSuggestions, userPreferredCuisines]);

  if (filteredRecipes.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          No recipes found
        </h2>
        <p className="text-gray-600">
          {searchTerm
            ? `No recipes match "${searchTerm}". Try a different search term.`
            : 'No recipes available at the moment.'}
        </p>
      </div>
    );
  }

  const renderRecipeCard = (recipe: Recipe, isSuggestion = false) => (
    <Link
      key={recipe.id}
      href={`/recipe/${recipe.id}`}
      className="block hover:transform hover:scale-105 transition-transform duration-200"
    >
      <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${isSuggestion ? 'border-2 border-porkchop-300' : ''}`}>
        {recipe.imageUrl && (
          <div className="relative">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full h-48 object-cover"
            />
            {isSuggestion && recipe.matchPercentage && (
              <div className="absolute top-2 right-2 bg-porkchop-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                {recipe.matchPercentage}% Match
              </div>
            )}
          </div>
        )}
        <div className="p-4">
          <h2 className="text-xl font-bold text-porkchop-900 mb-2">
            {recipe.title}
          </h2>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {recipe.description}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {recipe.cookingTime} mins
            </span>
            <span
              className={`text-sm px-2 py-1 rounded-full capitalize ${getDifficultyColor(
                recipe.difficulty
              )}`}
            >
              {recipe.difficulty}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div>
      {/* Main recipe list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {filteredRecipes.map((recipe) => renderRecipeCard(recipe))}
      </div>

      {/* Recipe suggestions section */}
      {showSuggestions && suggestedRecipes.length > 0 && (
        <div className="mt-8 border-t border-butcher-200 pt-8">
          <h2 className="text-2xl font-serif font-bold text-butcher-800 mb-6 text-center">
            {selectedRecipe ? 'You Might Also Like' : 'Recipe Suggestions'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {suggestedRecipes.map((recipe) => renderRecipeCard(recipe, true))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeList;