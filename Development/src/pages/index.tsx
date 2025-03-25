import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ChefFreddieLogo from '../components/ChefFreddieLogo';

const Home: NextPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect to dashboard if logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Handle direct navigation to dashboard
  const goToDashboard = () => {
    router.push('/dashboard');
  };

  const quickLinks = [
    { title: 'Create a Recipe', description: 'Craft your own recipes', icon: '📝', path: '/create-recipe' },
    { title: 'My Cookbook', description: 'View your saved recipes', icon: '📚', path: '/my-cookbook' },
    { title: 'Chef\'s Corner', description: 'Join the community', icon: '👨‍🍳', path: '/chefs-corner' },
    { title: 'Butcher Shop', description: 'Find quality ingredients', icon: '🥩', path: '/butcher-shop' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
          <div className="bg-butcher-100 p-12 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl font-bold text-butcher-800 mb-4 font-serif">Welcome to PorkChop</h1>
              <p className="text-xl text-butcher-600 mb-6">
                Your ultimate cooking companion for discovering recipes, creating meal plans, and connecting with local butchers.
              </p>
              <div className="flex space-x-4">
                <button 
                  onClick={goToDashboard}
                  className="px-6 py-3 bg-porkchop-600 text-white font-medium rounded-md hover:bg-porkchop-700 transition-colors"
                >
                  Get Started
                </button>
                <button className="px-6 py-3 border border-porkchop-600 text-porkchop-600 font-medium rounded-md hover:bg-porkchop-50 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-64 h-64">
                <ChefFreddieLogo />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickLinks.map((link) => (
            <div 
              key={link.title} 
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(link.path)}
            >
              <div className="text-3xl mb-4">{link.icon}</div>
              <h3 className="text-lg font-semibold text-butcher-800 mb-2">{link.title}</h3>
              <p className="text-sm text-butcher-600">{link.description}</p>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-butcher-800 mb-6 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-porkchop-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-porkchop-600 text-2xl">🍲</span>
              </div>
              <h3 className="text-lg font-semibold text-butcher-800 mb-2">Recipe Management</h3>
              <p className="text-sm text-butcher-600">Create, save, and organize your favorite recipes in personalized collections.</p>
            </div>
            <div className="text-center">
              <div className="bg-porkchop-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-porkchop-600 text-2xl">🧑‍🍳</span>
              </div>
              <h3 className="text-lg font-semibold text-butcher-800 mb-2">Chef Freddie Assistant</h3>
              <p className="text-sm text-butcher-600">Get cooking tips, ingredient substitutions, and recipe recommendations.</p>
            </div>
            <div className="text-center">
              <div className="bg-porkchop-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-porkchop-600 text-2xl">🏆</span>
              </div>
              <h3 className="text-lg font-semibold text-butcher-800 mb-2">Cooking Challenges</h3>
              <p className="text-sm text-butcher-600">Improve your skills with weekly cooking challenges and earn achievements.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-butcher-800 rounded-lg shadow-lg p-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Start Cooking?</h2>
          <p className="text-lg text-butcher-100 mb-6 max-w-2xl mx-auto">
            Join PorkChop today and discover a new way to experience cooking. Create, save, and share recipes with a growing community of food enthusiasts.
          </p>
          <button 
            onClick={() => router.push('/signup')}
            className="px-8 py-3 bg-porkchop-500 text-white font-medium rounded-md hover:bg-porkchop-600 transition-colors"
          >
            Sign Up Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;