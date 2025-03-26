import type { NextPage } from 'next';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import ChefFreddieLogo from '../components/ChefFreddieLogo';
import { useSavedRecipes } from '../context/SavedRecipesContext';
import { useEffect, useState, useRef } from 'react';
import { useChefFreddie } from '../context/ChefFreddieContext';
import { useRouter } from 'next/router';
import { getDailyTip } from '../utils/cookingTips';

const Dashboard: NextPage = () => {
  const { user, logout } = useAuth();
  const { savedRecipes, collections } = useSavedRecipes();
  const { showChefFreddie } = useChefFreddie();
  const router = useRouter();
  const [dailyTip, setDailyTip] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Show Chef Freddie when dashboard loads and get daily tip
  useEffect(() => {
    showChefFreddie();
    setDailyTip(getDailyTip());
  }, [showChefFreddie]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigateToProfile = () => {
    setDropdownOpen(false);
    router.push('/profile');
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
      name: 'Butcher Shop',
      description: 'Connect with local meat suppliers',
      icon: '🥩',
      link: '/butcher-shop',
      bgColor: 'bg-red-500'
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
      {/* Header with Profile Dropdown */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-butcher-800">Dashboard</h1>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="px-4 py-2 bg-butcher-600 text-white rounded-lg hover:bg-butcher-700 transition-colors flex items-center"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            {user?.firstName || 'Profile'}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <div className="py-1 rounded-md bg-white shadow-xs">
                <Link href="/temp-profile" legacyBehavior>
                  <a 
                    className="block px-4 py-2 text-sm text-butcher-700 hover:bg-butcher-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile Settings
                  </a>
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
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
              {action.name === 'Butcher Shop' && (
                <span className="text-sm text-butcher-500">Coming Soon →</span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-vintage p-6">
            <h4 className="text-sm font-medium text-butcher-500">{stat.name}</h4>
            <p className="mt-2 text-3xl font-semibold text-butcher-800">{stat.value}</p>
          </div>
        ))}
      </div>

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

      {/* Featured Recipe Section (if available) */}
      {savedRecipes.length > 0 && (
        <div className="bg-white rounded-lg shadow-vintage p-6 mt-8">
          <h3 className="text-lg font-semibold text-butcher-800 mb-4">Featured Recipe</h3>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
              <div className="bg-vintage-100 h-48 rounded-lg flex items-center justify-center">
                {savedRecipes[0].imageUrl ? (
                  <img
                    src={savedRecipes[0].imageUrl}
                    alt={savedRecipes[0].title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-4xl">🍽️</span>
                )}
              </div>
            </div>
            <div className="md:w-2/3">
              <h4 className="text-xl font-semibold text-butcher-800 mb-2">{savedRecipes[0].title}</h4>
              <p className="text-butcher-600 mb-4">{savedRecipes[0].description}</p>
              <div className="flex space-x-4 text-sm">
                <span className="text-butcher-500">⏱️ {savedRecipes[0].cookingTime} mins</span>
                <span className="text-butcher-500">👥 {savedRecipes[0].servings} servings</span>
                <span className="text-butcher-500">🔥 {savedRecipes[0].difficulty}</span>
              </div>
              <div className="mt-4">
                <Link 
                  href={`/recipe/${savedRecipes[0].id}`} 
                  className="px-4 py-2 bg-satriales-500 text-white rounded-lg hover:bg-satriales-600 transition-colors inline-block"
                >
                  View Recipe
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;