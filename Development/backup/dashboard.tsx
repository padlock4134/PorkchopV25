if (!Array.isArray(filteredRecipes) || filteredRecipes.length === 0) {
  return (
    <div className="text-center py-8">
      <p className="text-butcher-600">No matching recipes found. Try selecting different ingredients.</p>
    </div>
  );
}{Array.isArray(recipe.proteinTags) && Array.isArray(recipe.herbTags) ? 
  [...recipe.proteinTags, ...(recipe.herbTags || []).slice(0, 2)].slice(0, 3).map((tag, idx) => (
    <span key={idx} className="text-xs bg-vintage-100 text-butcher-700 px-2 py-0.5 rounded-full">
      {tag}
    </span>
  ))
: <span className="text-xs bg-vintage-100 text-butcher-700 px-2 py-0.5 rounded-full">Recipe</span>}import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useSavedRecipes } from '../context/SavedRecipesContext';
import { useChefFreddie } from '../context/ChefFreddieContext';
import { getDailyTip } from '../utils/cookingTips';
import { Recipe, mockRecipes } from '../utils/recipeData';

const Dashboard: NextPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { savedRecipes, collections, isLoading: recipesLoading, error } = useSavedRecipes();
  const { showChefFreddie } = useChefFreddie();
  const [dailyTip, setDailyTip] = useState('');
  const [featuredRecipe, setFeaturedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  // Handle loading states
  useEffect(() => {
    if (!authLoading && !recipesLoading) {
      setLoading(false);
    }
  }, [authLoading, recipesLoading]);

  // Initialize dashboard data
  useEffect(() => {
    if (!user) return;

    try {
      showChefFreddie();
      setDailyTip(getDailyTip());
      
      // Use a mock recipe for the featured recipe with pork chops
      const porkChopRecipe = mockRecipes[0];
      setFeaturedRecipe(porkChopRecipe);
    } catch (err) {
      console.error('Error initializing dashboard:', err);
    }
  }, [user, showChefFreddie]);

  // Safe access to user properties with fallback values
  const userName = user?.displayName?.toString() || 'Chef';
  const userEmail = user?.email?.toString() || '';

  // Stats with fallback values
  const stats = [
    { 
      name: 'Saved Recipes', 
      value: (savedRecipes?.length || 0).toString(),
      icon: '📋'
    },
    { 
      name: 'Collections', 
      value: (collections?.length || 0).toString(),
      icon: '📁'
    },
    { 
      name: 'Recipes Tried', 
      value: '0',
      icon: '🍽️'
    },
    { 
      name: 'Recipes Created', 
      value: '0',
      icon: '✏️'
    }
  ];

  // Recent activity with fallback
  const recentActivity = [
    { type: 'favorited', recipe: 'Classic Pork Chop', time: '2h ago' },
    { type: 'favorited', recipe: 'BBQ Ribs', time: '1d ago' },
    { type: 'viewed', recipe: 'Apple Pie', time: '3d ago' }
  ];

  // Quick actions
  const quickActions = [
    {
      name: "What's in My Kitchen?",
      description: 'Create a recipe using ingredients you have',
      icon: '🔪',
      link: '/create-recipe',
      bgColor: 'bg-butcher-600'
    },
    {
      name: 'My Cookbook',
      description: 'Access your saved recipes and collections',
      icon: '📚',
      link: '/my-cookbook',
      bgColor: 'bg-pink-500'
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Loading your dashboard...</h2>
          <div className="w-16 h-16 border-4 border-butcher-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6">Error: {error.message || String(error)}</div>;
  }

  return (
    <div className="min-h-screen bg-vintage-50 p-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h1 className="text-2xl font-bold text-butcher-900">
            Welcome back, {userName}!
          </h1>
          <p className="text-butcher-700 mt-2">
            What would you like to cook today?
          </p>
          {dailyTip && (
            <div className="mt-4 p-3 bg-vintage-100 rounded-lg border border-butcher-200">
              <h3 className="text-sm font-semibold text-butcher-800">Daily Cooking Tip:</h3>
              <p className="text-sm text-butcher-600">{dailyTip}</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-bold mb-4 text-butcher-800">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.link}
              className="block transition-all duration-200 hover:transform hover:scale-105"
            >
              <div className="bg-white rounded-lg shadow p-4 h-full">
                <div className={`${action.bgColor} text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl mb-3`}>
                  {action.icon}
                </div>
                <h3 className="text-lg font-semibold text-butcher-800 mb-1">
                  {action.name}
                </h3>
                <p className="text-sm text-butcher-600">{action.description}</p>
                {action.name === 'The Grange Marketplace' && (
                  <span className="inline-block mt-2 px-2 py-1 bg-satriales-100 text-satriales-800 text-xs font-medium rounded">
                    New!
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Stats */}
        <h2 className="text-xl font-bold mb-4 text-butcher-800">
          Your Kitchen Stats
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white rounded-lg shadow p-4"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{stat.icon}</div>
                <div>
                  <h4 className="text-sm font-medium text-butcher-500">{stat.name}</h4>
                  <p className="mt-1 text-2xl font-semibold text-butcher-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Recipe Section */}
        {featuredRecipe && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-4 text-butcher-800">Today's Featured Recipe</h2>
            <div className="flex flex-col md:flex-row items-start gap-4">
              <div className="w-full md:w-1/3 bg-butcher-100 rounded-lg h-48 flex items-center justify-center">
                <span className="text-4xl">🍖</span>
              </div>
              <div className="w-full md:w-2/3">
                <h3 className="text-lg font-semibold text-butcher-800">{featuredRecipe.title}</h3>
                <p className="text-butcher-600 mt-2">{featuredRecipe.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {featuredRecipe.tags?.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-vintage-100 text-butcher-700 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="mt-4 px-4 py-2 bg-butcher-600 text-white rounded hover:bg-butcher-700 transition-colors">
                  View Recipe
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-butcher-800">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 hover:bg-vintage-100 rounded-md transition-colors">
                  <span className="text-yellow-500 text-xl">
                    {activity.type === 'favorited' ? '⭐' : '👁️'}
                  </span>
                  <span className="text-butcher-700">
                    {activity.type === 'favorited' ? 'Favorited' : 'Viewed'} {activity.recipe}
                  </span>
                  <span className="text-butcher-400 text-sm">{activity.time}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-butcher-400">No recent activity</p>
                <p className="text-sm text-butcher-400 mt-2">Your activities will appear here</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-butcher-100">
            <button className="text-butcher-600 text-sm font-medium hover:text-butcher-800 transition-colors">
              View All Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Dashboard as default };