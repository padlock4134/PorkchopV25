import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Recipe, parseCSVRecipes } from '../../utils/recipeData';
import RecipeList from '../../components/RecipeList';
import { useChefFreddie } from '../../context/ChefFreddieContext';
import { useAchievementTracker } from '../../utils/achievementTracker';
import { useAuth } from '../../context/AuthContext';

const RecipeDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const { showChefFreddie } = useChefFreddie();
  const { user } = useAuth();
  const { trackRecipeSaved, trackIngredientUsed, trackCuisineCreated } = useAchievementTracker();

  useEffect(() => {
    showChefFreddie();
  }, [showChefFreddie]);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setLoading(true);
        const recipes = await parseCSVRecipes();
        setAllRecipes(recipes);
        
        if (id) {
          const foundRecipe = recipes.find(r => r.id === id);
          setRecipe(foundRecipe || null);
        }
      } catch (error) {
        console.error('Error loading recipe:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadRecipes();
    }
  }, [id]);

  // Function to save recipe to cookbook
  const saveRecipe = () => {
    if (!recipe || !user) return;
    
    // Get saved recipes from localStorage
    const savedRecipes = JSON.parse(localStorage.getItem(`saved_recipes_${user.id}`) || '[]');
    
    // Check if recipe is already saved
    if (!savedRecipes.some((r: any) => r.id === recipe.id)) {
      // Add recipe to saved recipes
      const updatedSavedRecipes = [...savedRecipes, recipe];
      localStorage.setItem(`saved_recipes_${user.id}`, JSON.stringify(updatedSavedRecipes));
      
      // Update UI state
      setIsSaved(true);
      
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
  
  // Function to remove recipe from cookbook
  const removeRecipe = () => {
    if (!recipe || !user) return;
    
    // Get saved recipes from localStorage
    const savedRecipes = JSON.parse(localStorage.getItem(`saved_recipes_${user.id}`) || '[]');
    
    // Filter out the current recipe
    const updatedSavedRecipes = savedRecipes.filter((r: any) => r.id !== recipe.id);
    localStorage.setItem(`saved_recipes_${user.id}`, JSON.stringify(updatedSavedRecipes));
    
    // Update UI state
    setIsSaved(false);
  };
  
  // Check if recipe is saved when component mounts or recipe changes
  useEffect(() => {
    if (recipe && user) {
      const savedRecipes = JSON.parse(localStorage.getItem(`saved_recipes_${user.id}`) || '[]');
      setIsSaved(savedRecipes.some((r: any) => r.id === recipe.id));
    }
  }, [recipe, user]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-vintage p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-8 bg-butcher-200 rounded w-3/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-butcher-200 rounded"></div>
                <div className="h-4 bg-butcher-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-vintage p-6">
          <h1 className="text-2xl font-bold text-butcher-800 mb-4">Recipe Not Found</h1>
          <p className="text-butcher-600 mb-6">
            Sorry, we couldn't find the recipe you're looking for.
          </p>
          <Link href="/dashboard" className="text-porkchop-600 hover:text-porkchop-800">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Recipe Detail Card */}
      <div className="bg-white rounded-lg shadow-vintage overflow-hidden mb-8">
        {recipe.imageUrl && (
          <div className="relative h-64 sm:h-96">
            <img 
              src={recipe.imageUrl} 
              alt={recipe.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-butcher-800">{recipe.title}</h1>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-butcher-100 text-butcher-800">
                {recipe.cookingTime} mins
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-satriales-100 text-satriales-800">
                {recipe.servings} servings
              </span>
            </div>
          </div>
          
          <p className="text-lg text-butcher-600 mb-6">{recipe.description}</p>
          
          {/* Recipe Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Ingredients */}
            <div className="bg-vintage-50 rounded-lg p-4">
              <h2 className="text-xl font-bold text-butcher-800 mb-3">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-satriales-600 mr-2">•</span>
                    <span className="text-butcher-700">
                      {typeof ingredient === 'string' 
                        ? ingredient 
                        : `${ingredient.amount} ${ingredient.unit} ${ingredient.name} ${ingredient.preparation || ''}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Cookware */}
            <div className="bg-vintage-50 rounded-lg p-4">
              <h2 className="text-xl font-bold text-butcher-800 mb-3">Cookware</h2>
              <ul className="space-y-2">
                {recipe.requiredCookware.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-satriales-600 mr-2">•</span>
                    <span className="text-butcher-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Tags */}
            <div className="bg-vintage-50 rounded-lg p-4">
              <h2 className="text-xl font-bold text-butcher-800 mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {recipe.proteinTags.map((tag, index) => (
                  <span key={`protein-${index}`} className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                    {tag}
                  </span>
                ))}
                {recipe.veggieTags.map((tag, index) => (
                  <span key={`veggie-${index}`} className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    {tag}
                  </span>
                ))}
                {recipe.herbTags.map((tag, index) => (
                  <span key={`herb-${index}`} className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {tag}
                  </span>
                ))}
                {recipe.cuisine && (
                  <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                    {recipe.cuisine}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-butcher-800 mb-4">Instructions</h2>
            <ol className="space-y-4">
              {recipe.steps.map((step, index) => (
                <li key={index} className="flex">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-satriales-100 text-satriales-800 font-bold mr-3">
                    {index + 1}
                  </span>
                  <div className="text-butcher-700 pt-1">{step}</div>
                </li>
              ))}
            </ol>
          </div>
          
          {/* Recipe Actions */}
          <div className="mt-6 flex flex-wrap gap-4">
            <button 
              onClick={isSaved ? removeRecipe : saveRecipe}
              className={`flex items-center px-4 py-2 rounded-md ${
                isSaved 
                  ? 'bg-butcher-100 text-butcher-700 hover:bg-butcher-200' 
                  : 'bg-butcher-600 text-white hover:bg-butcher-700'
              } transition-colors`}
            >
              <svg 
                className="w-5 h-5 mr-2" 
                fill={isSaved ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
                />
              </svg>
              {isSaved ? 'Saved to Cookbook' : 'Save to Cookbook'}
            </button>
          </div>
          
          <div className="mt-6">
            <Link href="/dashboard" className="text-porkchop-600 hover:text-porkchop-800">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
      
      {/* Recipe Suggestions */}
      <div className="mb-8">
        <h2 className="text-2xl font-serif font-bold text-butcher-800 mb-6">
          You Might Also Like
        </h2>
        <RecipeList 
          recipes={allRecipes} 
          selectedRecipe={recipe} 
          showSuggestions={true} 
        />
      </div>
    </div>
  );
};

export default RecipeDetailPage;
