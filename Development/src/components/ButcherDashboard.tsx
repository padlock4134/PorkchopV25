import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useButcherTheme } from './ButcherThemeProvider';
import ButcherCard from './ButcherCard';
import MeatTag from './MeatTag';
import ButcherButton from './ButcherButton';
import ChefFreddieLogo from '../components/ChefFreddieLogo';

const ButcherDashboard: React.FC = () => {
  const { user } = useAuth();
  const theme = useButcherTheme();
  const navigate = useNavigate();

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

  const stats = [
    { name: 'Total Recipes', value: '4', icon: '📋' },
    { name: 'Favorite Recipes', value: '2', icon: '⭐' },
    { name: 'Recipes Created', value: '0', icon: '✏️' },
    { name: 'Recipe Collections', value: '4', icon: '📁' }
  ];

  const recentActivity = [
    {
      type: 'favorited',
      recipe: 'Clam Chowder',
      time: 'Just now'
    },
    {
      type: 'favorited',
      recipe: 'Paella Valenciana',
      time: 'Just now'
    }
  ];

  const handleExploreRecipes = () => {
    navigate('/recipes');
  };

  const handleCreateRecipe = () => {
    navigate('/create-recipe');
  };

  return (
    <div className="min-h-screen bg-vintage-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner with Butcher Paper Texture */}
        <ButcherCard
          variant="paper"
          elevation="raised"
          withBorder
          className="mb-8"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-satriales-500">
              <ChefFreddieLogo className="w-10 h-10" />
            </div>
            <div>
              <h1 
                className="text-2xl font-bold text-butcher-900"
                style={{ fontFamily: theme.fonts.display }}
              >
                Welcome back, {user?.name || 'Chef'}!
              </h1>
              <p 
                className="text-butcher-700"
                style={{ fontFamily: theme.fonts.body }}
              >
                I notice you haven't created any recipes yet. Would you like to start by telling me what's in your kitchen?
              </p>
              <p className="text-butcher-700 mt-1">
                I see you have 4 saved recipes in your cookbook.
              </p>
            </div>
          </div>
        </ButcherCard>

        {/* Quick Actions */}
        <h2 
          className="text-xl font-bold mb-4 text-butcher-800"
          style={{ fontFamily: theme.fonts.display }}
        >
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.link}
              className="block transition-all duration-200 hover:transform hover:scale-105"
            >
              <ButcherCard
                variant={action.name === 'The Grange Marketplace' ? 'paper' : 'paper'}
                elevation="raised"
                withBorder
              >
                <div className={`${action.bgColor} text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl mb-3`}>
                  {action.icon}
                </div>
                <h3 
                  className="text-lg font-semibold text-butcher-800 mb-1"
                  style={{ fontFamily: theme.fonts.display }}
                >
                  {action.name}
                </h3>
                <p className="text-sm text-butcher-600">{action.description}</p>
                {action.name === 'The Grange Marketplace' && (
                  <MeatTag color="green" size="small" className="mt-3">
                    New!
                  </MeatTag>
                )}
              </ButcherCard>
            </Link>
          ))}
        </div>

        {/* Stats */}
        <h2 
          className="text-xl font-bold mb-4 text-butcher-800"
          style={{ fontFamily: theme.fonts.display }}
        >
          Your Kitchen Stats
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <ButcherCard
              key={stat.name}
              variant="clean"
              elevation="raised"
              withBorder
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{stat.icon}</div>
                <div>
                  <h4 className="text-sm font-medium text-butcher-500">{stat.name}</h4>
                  <p className="mt-1 text-2xl font-semibold text-butcher-900">{stat.value}</p>
                </div>
              </div>
            </ButcherCard>
          ))}
        </div>

        {/* Recent Activity */}
        <ButcherCard
          variant="paper"
          elevation="raised"
          withBorder
          heading="Recent Activity"
          className="mb-8"
        >
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 hover:bg-vintage-100 rounded-md transition-colors">
                  <span className="text-yellow-500 text-xl">⭐</span>
                  <span className="text-butcher-700">Favorited {activity.recipe}</span>
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
            <ButcherButton variant="tertiary" size="small">
              View All Activity
            </ButcherButton>
          </div>
        </ButcherCard>
        
        {/* Chef Freddie's Tips */}
        <ButcherCard
          variant="wood"
          elevation="raised"
          heading="Daily Cooking Tip"
          className="mb-8"
        >
          <div className="flex items-start space-x-4">
            <div className="text-3xl">💡</div>
            <div>
              <p className="text-vintage-100 italic">
                "Always let meat rest after cooking. This allows the juices to redistribute, resulting in a more tender and flavorful dish."
              </p>
              <p className="text-vintage-200 text-sm mt-3">- Chef Freddie</p>
            </div>
          </div>
        </ButcherCard>
        
        {/* Call to Action */}
        <ButcherCard
          variant="meat"
          elevation="floating"
          className="text-center py-8"
        >
          <h3 
            className="text-2xl font-bold text-pink-800 mb-2"
            style={{ fontFamily: theme.fonts.display }}
          >
            Ready to Start Cooking?
          </h3>
          <p className="text-pink-700 max-w-md mx-auto mb-6">
            Explore recipes, save your favorites, and create your own culinary masterpieces.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <ButcherButton
              variant="primary"
              size="large"
              onClick={handleExploreRecipes}
              aria-label="Explore Recipes"
            >
              Explore Recipes
            </ButcherButton>
            <ButcherButton
              variant="secondary"
              size="large"
              onClick={handleCreateRecipe}
              aria-label="Create Recipe"
            >
              Create Recipe
            </ButcherButton>
          </div>
        </ButcherCard>
      </div>
    </div>
  );
};

export default ButcherDashboard;