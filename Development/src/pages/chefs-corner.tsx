import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useChefFreddie } from '../context/ChefFreddieContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getDailyChefQuote } from '../utils/chefQuotes';

const ChefsCorner: NextPage = () => {
  const { showChefFreddie, setCurrentRoute } = useChefFreddie();
  const [dailyQuote, setDailyQuote] = useState<{ quote: string; author: string; role: string } | null>(null);
  const router = useRouter();
  
  // Set current route and show Chef Freddie
  useEffect(() => {
    setCurrentRoute('/chefs-corner');
    showChefFreddie();
    
    // Get the daily chef quote
    setDailyQuote(getDailyChefQuote());
  }, [setCurrentRoute, showChefFreddie]);

  const communityFeatures = [
    {
      title: 'Recipe Challenges',
      description: 'Participate in weekly cooking challenges and share your creations',
      icon: '🏆',
      comingSoon: false,
      link: '/challenges'
    },
    {
      title: 'Cooking Achievements',
      description: 'Earn badges and track your cooking progress',
      icon: '🎖️',
      comingSoon: false,
      link: '/achievements'
    },
    {
      title: 'Community Recipes',
      description: 'Discover and share recipes with the PorkChop community',
      icon: '👨‍🍳',
      comingSoon: true,
      link: ''
    },
    {
      title: 'Tutorials',
      description: 'Learn essential cooking basics and fundamental techniques',
      icon: '📚',
      comingSoon: false,
      link: '/tutorials'
    }
  ];

  const handleExplore = (feature: typeof communityFeatures[0]) => {
    if (!feature.comingSoon && feature.link) {
      router.push(feature.link);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-vintage p-6 mb-8">
        <h1 className="text-2xl font-bold text-butcher-800 mb-4">Chef's Corner</h1>
        <p className="text-butcher-600 mb-6">
          Connect with the PorkChop community, learn essential cooking skills, and showcase your culinary talents.
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
                <Link 
                  href={feature.link}
                  className="inline-block px-4 py-2 bg-porkchop-500 text-white rounded-md text-sm hover:bg-porkchop-600 transition-colors"
                >
                  Explore {feature.title}
                </Link>
              )}
            </div>
          ))}
        </div>
        
        {/* Chef's Quote of the Day Section */}
        <div className="bg-satriales-50 p-6 rounded-lg border border-satriales-100 mb-8">
          <h2 className="text-xl font-semibold text-satriales-800 mb-4">Chef's Quote of the Day</h2>
          {dailyQuote && (
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-24 h-24 bg-satriales-100 rounded-full mb-4 md:mb-0 md:mr-6 flex items-center justify-center">
                <span className="text-3xl">👨‍🍳</span>
              </div>
              <div>
                <p className="text-lg text-satriales-700 mb-3 italic">
                  "{dailyQuote.quote}"
                </p>
                <p className="text-satriales-600 font-medium">
                  {dailyQuote.author}
                </p>
                <p className="text-sm text-satriales-500">
                  {dailyQuote.role}
                </p>
              </div>
            </div>
          )}
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
