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

const RecipeMatching: React.FC<RecipeMatchingProps> = ({
  userRecipes
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { addToSaved, removeFromSaved, isRecipeSaved, addToCollection, removeFromCollection } = useSavedRecipes();
  
  // Safely try to use achievement tracker, but don't crash if it's not available
  let trackRecipeSaved = (_recipeId: string) => {};
  let trackIngredientUsed = (_ingredients: string[]) => {};
  let trackCuisineCreated = (_cuisine: string) => {};
  
  try {
    const achievementTracker = useAchievementTracker();
    trackRecipeSaved = achievementTracker.trackRecipeSaved;
    trackIngredientUsed = achievementTracker.trackIngredientUsed;
    trackCuisineCreated = achievementTracker.trackCuisineCreated;
  } catch (error) {
    console.warn('Achievement tracking not available:', error);
  }

  const [matchedRecipes, setMatchedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    const fetchMatchedRecipes = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/recipes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endpoint: 'getRecipes',
            userId: user?.id || 'default'
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        const recipes = await response.json();
        
        // For now, just show all recipes
        // TODO: Implement proper recipe matching based on user preferences and ingredients
        setMatchedRecipes(recipes);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        // Import mockRecipes as a fallback
        import('../utils/recipeData').then(({ mockRecipes }) => {
          console.log('Using mock recipes as fallback');
          setMatchedRecipes(mockRecipes);
        });
        setError('Failed to load recipes from server, using sample recipes instead');
      } finally {
        setLoading(false);
      }
    };

    fetchMatchedRecipes();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (matchedRecipes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No matching recipes found.</p>
      </div>
    );
  }

  // Filter recipes based on active category
  const filteredRecipes = activeCategory === 'all' 
    ? matchedRecipes 
    : matchedRecipes.filter(recipe => {
        if (activeCategory === 'easy') return recipe.difficulty === 'easy';
        if (activeCategory === 'medium') return recipe.difficulty === 'medium';
        if (activeCategory === 'hard') return recipe.difficulty === 'hard';
        return true;
      });

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
      trackRecipeSaved(recipe.id);
      
      // Track ingredients used for the Flavor Explorer achievement
      if (recipe.ingredients && recipe.ingredients.length > 0) {
        // Extract ingredient names from the ingredients array
        const ingredientNames = Array.isArray(recipe.ingredients) 
          ? recipe.ingredients.map(ing => typeof ing === 'string' ? ing : ing.name || ing.toString())
          : [];
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
        {filteredRecipes.map(recipe => (
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
                  {Array.isArray(recipe.ingredients) ? recipe.ingredients.map((ingredient, idx) => (
                    <li key={idx}>
                      {typeof ingredient === 'string' 
                        ? ingredient 
                        : `${ingredient.amount} ${ingredient.unit} ${ingredient.name}${ingredient.preparation ? `, ${ingredient.preparation}` : ''}`}
                    </li>
                  )) : <li>No ingredients listed.</li>}
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
