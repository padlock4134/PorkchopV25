import type { NextPage } from 'next';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import ChefFreddieLogo from '../components/ChefFreddieLogo';
import { useSavedRecipes } from '../context/SavedRecipesContext';
import { useEffect, useState } from 'react';
import { useChefFreddie } from '../context/ChefFreddieContext';
import { useRouter } from 'next/router';
import { getDailyTip } from '../utils/cookingTips';
import { parseCSVRecipes, getRandomRecipes, Recipe, getDailyFeaturedRecipe, mockRecipes } from '../utils/recipeData';

const Dashboard: NextPage = () => {
  const { user, logout } = useAuth();
  const { savedRecipes, collections, addToSaved } = useSavedRecipes();
  const { showChefFreddie } = useChefFreddie();
  const router = useRouter();
  const [dailyTip, setDailyTip] = useState<string>('');
  const [featuredRecipe, setFeaturedRecipe] = useState<Recipe | null>(null);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  // Show Chef Freddie when dashboard loads, get daily tip, and load featured recipe
  useEffect(() => {
    const initDashboard = async () => {
      showChefFreddie();
      setDailyTip(getDailyTip());
      
      try {
        setLoading(true);
        
        // Use a mock recipe for the featured recipe with pork chops
        const porkChopRecipe = {
          ...mockRecipes[0],
          id: 'porkchop-featured',
          title: 'Garlic Butter Pork Chops',
          description: 'Juicy pork chops seared to perfection and basted with garlic herb butter. A quick and delicious weeknight dinner option.',
          cookingTime: 25,
          servings: 4,
          difficulty: 'easy' as 'easy' | 'medium' | 'hard',
          cuisine: 'American',
          imageUrl: 'https://images.unsplash.com/photo-1432139509613-5c4255815697?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
          instructions: [
            "Pat pork chops dry with paper towels and season generously with salt and pepper on both sides.",
            "Heat a large skillet over medium-high heat. Add 1 tablespoon olive oil.",
            "Once hot, add pork chops and sear for 4-5 minutes on each side until golden brown and cooked through (internal temperature of 145°F).",
            "Reduce heat to medium-low. Add 3 tablespoons butter, 4 minced garlic cloves, and 1 tablespoon fresh herbs (rosemary, thyme, or sage).",
            "Tilt the pan and spoon the garlic herb butter over the pork chops continuously for 1-2 minutes.",
            "Remove from heat and let rest for 5 minutes before serving.",
            "Serve with your favorite sides and enjoy!"
          ]
        };
        
        console.log('Using pork chop recipe for featured recipe');
        setFeaturedRecipe(porkChopRecipe);
        
        // Still load all recipes for other parts of the dashboard
        const recipes = await parseCSVRecipes();
        console.log('Loaded recipes:', recipes.length);
        setAllRecipes(recipes);
      } catch (error) {
        console.error('Error loading recipes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initDashboard();
  }, [showChefFreddie]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const quickActions = [
    {
      name: "What's in My Kitchen?",
      description: 'Create a recipe using ingredients you have',
      icon: '📝',
      link: '/create-recipe',
      bgColor: 'bg-butcher-600'
    },
    {
      name: 'My Cookbook',
      description: 'Access your saved recipes and collections',
      icon: '📚',
      link: '/my-cookbook',
      bgColor: 'bg-satriales-500'
    },
    {
      name: 'The Grange Marketplace',
      description: 'Connect with local farmers and food producers',
      icon: '🧺',
      link: '/the-grange',
      bgColor: 'bg-green-600'
    },
    {
      name: "Chef's Corner",
      description: 'Discover and share with the community',
      icon: '👨‍🍳',
      link: '/chefs-corner',
      bgColor: 'bg-blue-500'
    }
  ];

  const stats = [
    { name: 'Total Recipes', value: savedRecipes.length.toString() },
    { name: 'Favorite Recipes', value: collections.find(c => c.id === 'favorites')?.recipeIds.length.toString() || '0' },
    { name: 'Recipes Created', value: user?.recipesCreated?.toString() || '0' },
    { name: 'Recipe Collections', value: collections.length.toString() }
  ];

  const recentActivity = [
    ...(savedRecipes.slice(0, 3).map(recipe => ({
      type: 'saved',
      recipe: recipe.title,
      time: 'Recently'
    })))
  ];

  if (recentActivity.length === 0) {
    recentActivity.push({
      type: 'info',
      recipe: 'No recent activity',
      time: ''
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Message with Daily Tip */}
      <div className="bg-white rounded-lg shadow-vintage p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 transition-transform hover:scale-110">
            <ChefFreddieLogo />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-butcher-800">Welcome back, {user?.name || 'Chef'}!</h2>
            <p className="text-butcher-600">
              {savedRecipes.length === 0 
                ? "I notice you haven't saved any recipes yet. Would you like to start by creating one?"
                : `I see you have ${savedRecipes.length} saved recipes in your cookbook.`
              }
            </p>
          </div>
        </div>
        
        {/* Daily Tip - Now Static */}
        <div className="mt-4 p-4 bg-vintage-50 rounded-lg border border-satriales-200">
          <div className="flex items-start">
            <span className="text-2xl mr-3">💡</span>
            <div>
              <h3 className="font-medium text-butcher-800 mb-1">Tip of the Day:</h3>
              <p className="text-butcher-600">{dailyTip}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickActions.map((action) => (
          <Link
            key={action.name}
            href={action.link}
            className="block bg-white rounded-lg shadow-vintage overflow-hidden hover:shadow-vintage-lg transition-shadow"
          >
            <div className={`${action.bgColor} p-4`}>
              <span className="text-2xl">{action.icon}</span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-butcher-800">{action.name}</h3>
              <p className="text-sm text-butcher-600">{action.description}</p>
              {action.name === 'The Grange Marketplace' && action.link === '/the-grange' && (
                <span className="text-sm text-green-600">New! →</span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-vintage p-6">
            <p className="text-sm font-medium text-butcher-500 truncate">{stat.name}</p>
            <p className="mt-1 text-3xl font-semibold text-butcher-900">{stat.value}</p>
          </div>
        ))}
      </div>
      
      {/* Featured Recipe Section */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-vintage p-6 mb-8">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-satriales-600"></div>
          </div>
        </div>
      ) : featuredRecipe ? (
        <div className="bg-white rounded-lg shadow-vintage p-6 mb-8">
          <h3 className="text-lg font-semibold text-butcher-800 mb-4">
            Featured Recipe of the Day
            <span className="ml-2 text-sm text-butcher-500">Changes daily</span>
          </h3>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
              <div className="bg-vintage-100 h-48 rounded-lg flex items-center justify-center">
                {featuredRecipe.imageUrl ? (
                  <img
                    src={featuredRecipe.imageUrl}
                    alt={featuredRecipe.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-4xl">🍽️</span>
                )}
              </div>
            </div>
            <div className="md:w-2/3">
              <h4 className="text-xl font-semibold text-butcher-800 mb-2">{featuredRecipe.title}</h4>
              <p className="text-butcher-600 mb-4">{featuredRecipe.description}</p>
              <div className="flex space-x-4 text-sm">
                <span className="text-butcher-500">⏱️ {featuredRecipe.cookingTime} mins</span>
                <span className="text-butcher-500">👥 {featuredRecipe.servings} servings</span>
                <span className="text-butcher-500">🔥 {featuredRecipe.difficulty}</span>
                {featuredRecipe.cuisine && (
                  <span className="text-butcher-500">🌍 {featuredRecipe.cuisine}</span>
                )}
              </div>
              <div className="mt-4">
                <button 
                  onClick={() => setShowRecipeModal(true)}
                  className="px-4 py-2 bg-satriales-500 text-white rounded-lg hover:bg-satriales-600 transition-colors inline-block"
                >
                  View Recipe
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-vintage p-6 mb-8">
          <h3 className="text-lg font-semibold text-butcher-800 mb-4">
            Featured Recipe of the Day
          </h3>
          <p className="text-butcher-600 py-4">No featured recipe available today. Check back tomorrow!</p>
        </div>
      )}
      
      {/* Featured Recipe Modal */}
      {showRecipeModal && featuredRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-butcher-800">{featuredRecipe.title}</h3>
              <button 
                onClick={() => setShowRecipeModal(false)}
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
                      src={featuredRecipe.imageUrl || '/images/placeholder-recipe.jpg'} 
                      alt={featuredRecipe.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder-recipe.jpg';
                      }}
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-butcher-600">Cooking Time:</span>
                      <span className="text-sm font-medium text-butcher-800">{featuredRecipe.cookingTime} mins</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-butcher-600">Servings:</span>
                      <span className="text-sm font-medium text-butcher-800">{featuredRecipe.servings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-butcher-600">Difficulty:</span>
                      <span className="text-sm font-medium text-butcher-800">
                        {featuredRecipe.difficulty.charAt(0).toUpperCase() + featuredRecipe.difficulty.slice(1)}
                      </span>
                    </div>
                    {featuredRecipe.cuisine && (
                      <div className="flex justify-between">
                        <span className="text-sm text-butcher-600">Cuisine:</span>
                        <span className="text-sm font-medium text-butcher-800">{featuredRecipe.cuisine}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    {!savedRecipes.some(r => r.id === featuredRecipe.id) ? (
                      <button 
                        onClick={() => {
                          addToSaved(featuredRecipe);
                          alert('Recipe saved to cookbook!');
                        }}
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
                  <p className="text-butcher-600 mb-6">{featuredRecipe.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-butcher-800 mb-3">Ingredients</h4>
                    <ul className="space-y-2">
                      {featuredRecipe.ingredients.map((ingredient, idx) => (
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
                      {featuredRecipe.instructions.map((step, idx) => (
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
                <h4 className="text-lg font-medium text-butcher-800 mb-3">Featured Recipe</h4>
                <p className="text-butcher-600">
                  This recipe is today's featured recipe. Check back tomorrow for a new featured recipe!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-vintage p-6">
        <h3 className="text-lg font-semibold text-butcher-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-2">
              {activity.type === 'saved' && <span className="text-yellow-400">⭐</span>}
              {activity.type === 'info' && <span className="text-gray-400">ℹ️</span>}
              <span className="text-butcher-600">{activity.type === 'saved' ? `Saved ${activity.recipe}` : activity.recipe}</span>
              {activity.time && <span className="text-butcher-400">{activity.time}</span>}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;