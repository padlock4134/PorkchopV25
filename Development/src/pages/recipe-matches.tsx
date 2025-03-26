import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useChefFreddie } from '../context/ChefFreddieContext';
import { useSavedRecipes } from '../context/SavedRecipesContext';
import Link from 'next/link';
import { Recipe } from '../utils/recipeData';
import { findSimilarRecipes, getRandomRecipes } from '../utils/recipeData';

const RecipeMatches: NextPage = () => {
  const { showChefFreddie, setCurrentRoute } = useChefFreddie();
  const { savedRecipes, addToSaved, isRecipeSaved } = useSavedRecipes();
  
  // State for filtering and sorting
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [matchedRecipes, setMatchedRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipeToView, setRecipeToView] = useState<Recipe | null>(null);
  
  // Set current route and show Chef Freddie
  useEffect(() => {
    setCurrentRoute('/recipe-matches');
    showChefFreddie();
  }, [setCurrentRoute, showChefFreddie]);

  // Generate recipe matches when the page loads or when the selected recipe changes
  useEffect(() => {
    if (savedRecipes.length === 0) {
      // If no saved recipes, use random recipes
      setMatchedRecipes(getRandomRecipes(6));
      return;
    }

    if (selectedRecipe) {
      // Find similar recipes based on the selected recipe
      const similar = findSimilarRecipes(selectedRecipe, 6);
      setMatchedRecipes(similar);
    } else {
      // If no recipe is selected, use the first saved recipe
      const similar = findSimilarRecipes(savedRecipes[0], 6);
      setMatchedRecipes(similar);
      setSelectedRecipe(savedRecipes[0]);
    }
  }, [savedRecipes, selectedRecipe]);

  // Filter recipes based on active filter
  const filteredRecipes = activeFilter === 'all' 
    ? matchedRecipes 
    : matchedRecipes.filter(recipe => {
        if (activeFilter === 'easy') return recipe.difficulty === 'easy';
        if (activeFilter === 'medium') return recipe.difficulty === 'medium';
        if (activeFilter === 'hard') return recipe.difficulty === 'hard';
        return true;
      });

  // Function to get match color based on percentage
  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 75) return 'bg-green-400';
    if (percentage >= 60) return 'bg-yellow-400';
    if (percentage >= 40) return 'bg-yellow-300';
    return 'bg-gray-300';
  };

  // Function to get background style based on recipe type
  const getRecipeBackground = (recipe: Recipe) => {
    if (recipe.proteinTags?.includes('pork')) return 'bg-pink-50';
    if (recipe.proteinTags?.includes('beef')) return 'bg-red-50';
    if (recipe.proteinTags?.includes('chicken')) return 'bg-yellow-50';
    if (recipe.proteinTags?.includes('fish')) return 'bg-blue-50';
    if (recipe.veggieTags?.length > 0) return 'bg-green-50';
    return 'bg-gray-50';
  };

  // Handle saving a recipe
  const handleSaveRecipe = (recipe: Recipe) => {
    addToSaved(recipe);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-vintage p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-butcher-800">Recipe Matches</h1>
            <p className="text-butcher-600">
              Discover new recipes based on your saved favorites
            </p>
          </div>
          <Link 
            href="/my-cookbook"
            className="px-4 py-2 bg-vintage-100 text-butcher-700 rounded-lg hover:bg-vintage-200 transition-colors"
          >
            ← Back to Cookbook
          </Link>
        </div>

        {/* Recipe Selection Section */}
        {savedRecipes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-butcher-700 mb-4">Find Matches Based On</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {savedRecipes.slice(0, 4).map(recipe => (
                <button
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className={`text-left p-4 rounded-lg border transition-all ${
                    selectedRecipe?.id === recipe.id
                      ? 'border-porkchop-500 ring-2 ring-porkchop-200'
                      : 'border-gray-200 hover:border-porkchop-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                      {recipe.imageUrl ? (
                        <img 
                          src={recipe.imageUrl} 
                          alt={recipe.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder-recipe.jpg';
                          }}
                        />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center text-xl">🍽️</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-butcher-800 truncate">{recipe.title}</h3>
                      <p className="text-xs text-butcher-500">
                        {recipe.proteinTags?.join(', ') || recipe.veggieTags?.join(', ') || 'Mixed'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filter Section */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'all' 
                  ? 'bg-porkchop-500 text-white' 
                  : 'bg-vintage-100 text-butcher-700 hover:bg-vintage-200'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              All Matches
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'easy' 
                  ? 'bg-porkchop-500 text-white' 
                  : 'bg-vintage-100 text-butcher-700 hover:bg-vintage-200'
              }`}
              onClick={() => setActiveFilter('easy')}
            >
              Easy
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'medium' 
                  ? 'bg-porkchop-500 text-white' 
                  : 'bg-vintage-100 text-butcher-700 hover:bg-vintage-200'
              }`}
              onClick={() => setActiveFilter('medium')}
            >
              Medium
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === 'hard' 
                  ? 'bg-porkchop-500 text-white' 
                  : 'bg-vintage-100 text-butcher-700 hover:bg-vintage-200'
              }`}
              onClick={() => setActiveFilter('hard')}
            >
              Hard
            </button>
          </div>
        </div>

        {/* Matched Recipes Section */}
        <div>
          <h2 className="text-xl font-semibold text-butcher-700 mb-4">
            {selectedRecipe 
              ? `Recipes Similar to "${selectedRecipe.title}"` 
              : "Recommended Recipes"}
          </h2>
          
          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map(recipe => (
                <div 
                  key={recipe.id} 
                  className={`
                    bg-white rounded-lg overflow-hidden relative
                    border border-vintage-200 shadow-sm hover:shadow-md transition-shadow
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
                      <span className="text-xs font-medium text-white px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-sm">
                        {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
                      </span>
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
                      {[...recipe.proteinTags || [], ...recipe.herbTags?.slice(0, 2) || []].slice(0, 3).map((tag, idx) => (
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
                              ? 'bg-satriales-100 text-satriales-600 cursor-default' 
                              : 'bg-vintage-100 hover:bg-vintage-200 text-butcher-600'}
                          `}
                          onClick={() => !isRecipeSaved(recipe.id) && handleSaveRecipe(recipe)}
                          disabled={isRecipeSaved(recipe.id)}
                          title={isRecipeSaved(recipe.id) ? "Already in cookbook" : "Save to cookbook"}
                        >
                          <svg className="w-4 h-4" fill={isRecipeSaved(recipe.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                      
                      <button 
                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-porkchop-500 text-white hover:bg-porkchop-600 transition-colors shadow-sm"
                        onClick={() => setRecipeToView(recipe)}
                      >
                        View Recipe
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
              <p className="text-gray-500">No matching recipes found.</p>
              <button
                onClick={() => setActiveFilter('all')}
                className="mt-2 inline-block text-porkchop-600 hover:text-porkchop-800"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Why These Matches Section */}
        <div className="mt-8 bg-vintage-50 p-6 rounded-lg border border-vintage-200">
          <h3 className="text-lg font-semibold text-butcher-800 mb-2">Why These Matches?</h3>
          <p className="text-butcher-600 mb-4">
            {selectedRecipe ? (
              <>
                These recipes are matched to <strong>"{selectedRecipe.title}"</strong> based on:
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                  <li>Similar protein types ({selectedRecipe.proteinTags?.join(', ') || 'None'})</li>
                  <li>Complementary herbs and seasonings</li>
                  <li>Comparable cooking techniques</li>
                  <li>Similar difficulty level</li>
                  <li>Matching cooking time range</li>
                </ul>
              </>
            ) : (
              "Our recommendation system analyzes your saved recipes to find dishes with similar ingredients, cooking methods, and flavor profiles that you might enjoy."
            )}
          </p>
        </div>

        {/* Local Producer Spotlight */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-butcher-700 mb-4">Local Producer Spotlight</h2>
          <div className="bg-butcher-50 p-6 rounded-lg border border-butcher-100">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4">
                <div className="h-40 bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src="/images/local-producer.jpg" 
                    alt="Local Producer" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/placeholder-producer.jpg';
                    }}
                  />
                </div>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-lg font-semibold text-butcher-800 mb-1">Hillside Farms</h3>
                <p className="text-sm text-butcher-600 mb-3">
                  Located just 15 miles from the city, Hillside Farms specializes in organic, pasture-raised meats and seasonal produce. Their commitment to sustainable farming practices ensures the highest quality ingredients for your recipes.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-butcher-100 text-butcher-700 px-2 py-0.5 rounded-full">Organic Beef</span>
                  <span className="text-xs bg-butcher-100 text-butcher-700 px-2 py-0.5 rounded-full">Heritage Pork</span>
                  <span className="text-xs bg-butcher-100 text-butcher-700 px-2 py-0.5 rounded-full">Free-Range Poultry</span>
                  <span className="text-xs bg-butcher-100 text-butcher-700 px-2 py-0.5 rounded-full">Seasonal Vegetables</span>
                </div>
                <button className="mt-4 px-4 py-2 bg-butcher-600 text-white rounded-lg hover:bg-butcher-700 transition-colors">
                  Shop Hillside Farms
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe View Modal */}
      {recipeToView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-butcher-800">{recipeToView.title}</h3>
              <button 
                onClick={() => setRecipeToView(null)}
                className="p-1.5 rounded-full bg-vintage-100 hover:bg-vintage-200 text-butcher-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="md:w-1/3">
                  <div className="h-60 bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={recipeToView.imageUrl || '/images/placeholder-recipe.jpg'} 
                      alt={recipeToView.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder-recipe.jpg';
                      }}
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-butcher-600">Cooking Time:</span>
                      <span className="text-sm font-medium text-butcher-800">{recipeToView.cookingTime} mins</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-butcher-600">Servings:</span>
                      <span className="text-sm font-medium text-butcher-800">{recipeToView.servings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-butcher-600">Difficulty:</span>
                      <span className="text-sm font-medium text-butcher-800">
                        {recipeToView.difficulty.charAt(0).toUpperCase() + recipeToView.difficulty.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-butcher-600">Match:</span>
                      <span className="text-sm font-medium text-butcher-800">{recipeToView.matchPercentage || 0}%</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    {!isRecipeSaved(recipeToView.id) ? (
                      <button 
                        onClick={() => handleSaveRecipe(recipeToView)}
                        className="w-full px-4 py-2 bg-porkchop-600 text-white rounded-lg hover:bg-porkchop-700 transition-colors"
                      >
                        Save to Cookbook
                      </button>
                    ) : (
                      <button 
                        disabled
                        className="w-full px-4 py-2 bg-gray-100 text-gray-500 rounded-lg cursor-default"
                      >
                        Already in Cookbook
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <p className="text-butcher-600 mb-6">{recipeToView.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-butcher-800 mb-3">Ingredients</h4>
                    <ul className="space-y-2">
                      {recipeToView.ingredients.map((ingredient, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="inline-block w-2 h-2 rounded-full bg-porkchop-500 mt-2 mr-2"></span>
                          <span className="text-butcher-600">
                            {typeof ingredient === 'string' 
                              ? ingredient 
                              : `${ingredient.amount} ${ingredient.unit} ${ingredient.name}${ingredient.preparation ? `, ${ingredient.preparation}` : ''}`
                            }
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-butcher-800 mb-3">Instructions</h4>
                    <ol className="space-y-4">
                      {recipeToView.instructions.map((step, idx) => (
                        <li key={idx} className="flex">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-porkchop-100 text-porkchop-600 flex items-center justify-center font-semibold mr-3">
                            {idx + 1}
                          </div>
                          <p className="text-butcher-600 flex-1 pt-1">{step}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-medium text-butcher-800 mb-3">Source</h4>
                <p className="text-butcher-600">
                  This recipe is provided by local producers in The Grange network. Support local food businesses by purchasing ingredients from our partners.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeMatches;
