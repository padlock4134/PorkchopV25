import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useSavedRecipes } from '../context/SavedRecipesContext';

const Dashboard: React.FC = () => {
  // Initialize context with safe defaults
  const { user = {} } = useAuth() || {};
  const { savedRecipes = [], collections = [] } = useSavedRecipes() || {};

  // Safe access to user properties with fallback values
  const userName = user?.displayName?.toString() || 'Chef';
  const userEmail = user?.email?.toString() || '';
  const userId = user?.uid?.toString() || '';

  // Stats with fallback values
  const stats = [
    { 
      name: 'Saved Recipes', 
      value: (savedRecipes?.length || 0).toString() 
    },
    { 
      name: 'Collections', 
      value: (collections?.length || 0).toString() 
    },
    { 
      name: 'Recipes Tried', 
      value: '0' // Placeholder for future feature
    },
    { 
      name: 'Recipes Created', 
      value: '0' // Placeholder for future feature
    }
  ];

  // Recent activity with fallback
  const recentActivity = [
    { recipe: 'Classic Pork Chop', time: '2h ago' },
    { recipe: 'BBQ Ribs', time: '1d ago' },
    { recipe: 'Apple Pie', time: '3d ago' }
  ];

  return (
    <div className="p-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {userName}!
        </h1>
        <p className="text-gray-600 mt-2">
          What would you like to cook today?
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <h4 className="text-sm font-medium text-gray-500">{stat.name}</h4>
            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recipe List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Your Saved Recipes
        </h3>
        {savedRecipes.length > 0 ? (
          <div className="space-y-4">
            {savedRecipes.map((recipe) => (
              <div key={recipe.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{recipe.title}</h4>
                  <p className="text-sm text-gray-600">{recipe.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">You haven't saved any recipes yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;