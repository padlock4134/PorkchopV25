import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useChefFreddie } from '../context/ChefFreddieContext';
import Link from 'next/link';

const ChefsCorner: NextPage = () => {
  const { showChefFreddie, setCurrentRoute } = useChefFreddie();
  
  // Set current route and show Chef Freddie
  useEffect(() => {
    setCurrentRoute('/chefs-corner');
    showChefFreddie();
  }, [setCurrentRoute, showChefFreddie]);

  const communityFeatures = [
    {
      title: 'Recipe Challenges',
      description: 'Participate in weekly cooking challenges and share your creations',
      icon: '🏆',
      comingSoon: false
    },
    {
      title: 'Cooking Achievements',
      description: 'Earn badges and track your cooking progress',
      icon: '🎖️',
      comingSoon: false
    },
    {
      title: 'Community Recipes',
      description: 'Discover and share recipes with the PorkChop community',
      icon: '👨‍🍳',
      comingSoon: true
    },
    {
      title: 'Live Cooking Events',
      description: 'Join virtual cooking sessions with other chefs',
      icon: '📺',
      comingSoon: true
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-vintage p-6 mb-8">
        <h1 className="text-2xl font-bold text-butcher-800 mb-4">Chef's Corner</h1>
        <p className="text-butcher-600 mb-6">
          Connect with the PorkChop community, participate in challenges, and showcase your culinary skills.
        </p>
        
        {/* Community Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {communityFeatures.map((feature, index) => (
            <div key={index} className="bg-vintage-50 p-6 rounded-lg border border-vintage-100 relative">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">{feature.icon}</span>
                <h3 className="text-lg font-semibold text-butcher-800">{feature.title}</h3>
              </div>
              <p className="text-butcher-600 mb-3">{feature.description}</p>
              
              {feature.comingSoon ? (
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                  Coming Soon
                </span>
              ) : (
                <button className="inline-block px-3 py-1 bg-porkchop-100 text-porkchop-700 rounded text-xs hover:bg-porkchop-200">
                  Explore
                </button>
              )}
            </div>
          ))}
        </div>
        
        {/* Featured Chef Section */}
        <div className="bg-satriales-50 p-6 rounded-lg border border-satriales-100 mb-8">
          <h2 className="text-xl font-semibold text-satriales-800 mb-4">Featured Chef of the Week</h2>
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 md:mb-0 md:mr-6 flex items-center justify-center">
              <span className="text-3xl">👨‍🍳</span>
            </div>
            <div>
              <h3 className="text-lg font-medium text-satriales-700 mb-1">Chef Freddie</h3>
              <p className="text-satriales-600 mb-2">
                Master of Italian cuisine with a specialty in traditional pasta dishes.
              </p>
              <p className="text-sm text-satriales-500">
                "The secret to great cooking is simplicity and respect for ingredients."
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Link href="/dashboard" className="text-porkchop-600 hover:text-porkchop-800">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChefsCorner;
