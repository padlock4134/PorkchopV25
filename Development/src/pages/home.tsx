import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ChefFreddieLogo from '../components/ChefFreddieLogo';
import { useAuth } from '../context/AuthContext';
import HeroChefFreddie from '../components/HeroChefFreddie';

const Home: NextPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  const features = [
    { 
      title: 'Chef Freddie AI', 
      description: 'Your personal AI cooking companion who learns your style and helps you become a better cook.', 
      icon: '🧑‍🍳',
      category: 'core'
    },
    { 
      title: 'Smart Recipe Management', 
      description: 'Create, organize, and discover recipes with intelligent suggestions and easy sharing.', 
      icon: '📖',
      category: 'core'
    },
    { 
      title: 'The Grange Marketplace', 
      description: 'Connect with local butchers, farmers, and specialty food producers in your area.', 
      icon: '🏪',
      category: 'core'
    },
    { 
      title: 'Interactive Tutorials', 
      description: 'Master cooking techniques with our comprehensive learning paths and expert guides.', 
      icon: '🎓',
      category: 'learning'
    },
    { 
      title: 'Cooking Challenges', 
      description: 'Test your skills with exciting cooking challenges and earn achievements.', 
      icon: '🏆',
      category: 'learning'
    },
    { 
      title: 'Achievement System', 
      description: 'Track your progress and unlock rewards as you grow your culinary expertise.', 
      icon: '⭐',
      category: 'learning'
    }
  ];

  return (
    <div className="min-h-screen bg-vintage-50">
      {/* Fixed Navigation */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-xl font-bold text-butcher-800">PorkChop</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-butcher-600 hover:text-butcher-800 transition-colors">Features</a>
              <a href="#how-it-works" className="text-butcher-600 hover:text-butcher-800 transition-colors">How It Works</a>
              <Link href="/signup" legacyBehavior>
                <a className="px-4 py-2 bg-porkchop-600 text-white rounded-md hover:bg-porkchop-700 transition-colors">
                  Get Started
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white shadow-lg rounded-lg max-w-6xl mx-auto my-8">
        <div className="relative min-h-[90vh]">
          {/* Background gradient with radial effect */}
          <div className="absolute inset-0 bg-gradient-radial from-porkchop-100 via-butcher-100 to-white rounded-lg"></div>
          
          {/* Content container */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative h-full">
            <div className="pt-24 pb-20 h-full">
              <div className="flex flex-col md:flex-row items-center h-full relative">
                {/* Text content - taking less space and pushed to left */}
                <div className="md:w-1/3 z-10 mb-12 md:mb-0 md:pr-8">
                  <h1 className="text-8xl font-bold text-butcher-800 mb-8 font-serif leading-none whitespace-nowrap">
                    Cook Better!
                  </h1>
                  <p className="text-5xl text-butcher-600 mb-8 leading-tight whitespace-nowrap">
                    Meet Chef Freddie.
                  </p>
                  <p className="text-2xl text-butcher-600 mb-12">
                    Your AI kitchen companion
                  </p>
                </div>
                
                {/* Chef Freddie - massive and centered */}
                <div className="md:absolute md:right-8 md:top-1/2 md:-translate-y-1/2 flex items-center justify-center overflow-hidden">
                  <div className="w-[400px] h-[400px] relative">
                    <div className="absolute inset-0 bg-gradient-radial from-porkchop-100 via-butcher-100/50 to-transparent"></div>
                    <HeroChefFreddie />
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Tiers - Full Width */}
            <div className="w-full px-4 sm:px-6 lg:px-8 py-12 border-t border-butcher-100">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Free Tier */}
                  <div className="bg-gray-50 p-6 rounded-lg border-2 border-butcher-200">
                    <h3 className="text-xl font-bold text-butcher-800 mb-3">Free Features (Rare)</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start text-butcher-600">
                        <span className="mr-2 mt-1">✓</span>
                        <div>
                          <div className="font-medium">What's in my Fridge</div>
                          <div className="text-sm text-butcher-500">Find recipes with ingredients you have</div>
                        </div>
                      </li>
                      <li className="flex items-start text-butcher-600">
                        <span className="mr-2 mt-1">✓</span>
                        <div>
                          <div className="font-medium">My Cook Book</div>
                          <div className="text-sm text-butcher-500">Save and organize your favorite recipes</div>
                        </div>
                      </li>
                      <li className="flex items-start text-butcher-600">
                        <span className="mr-2 mt-1">✓</span>
                        <div>
                          <div className="font-medium">Tips of the Day</div>
                          <div className="text-sm text-butcher-500">Daily cooking insights and tricks</div>
                        </div>
                      </li>
                      <li className="flex items-start text-butcher-600">
                        <span className="mr-2 mt-1">✓</span>
                        <div>
                          <div className="font-medium">Recipe of the Day</div>
                          <div className="text-sm text-butcher-500">Fresh recipe inspiration daily</div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Premium Tier */}
                  <div className="bg-porkchop-50 p-6 rounded-lg border-2 border-porkchop-200">
                    <h3 className="text-xl font-bold text-butcher-800 mb-3">Premium (El Dente)</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start text-butcher-600">
                        <span className="mr-2 mt-1">✨</span>
                        <div>
                          <div className="font-medium">Chef Freddie AI Assistant</div>
                          <div className="text-sm text-butcher-500">Your personal AI cooking companion</div>
                        </div>
                      </li>
                      <li className="flex items-start text-butcher-600">
                        <span className="mr-2 mt-1">✨</span>
                        <div>
                          <div className="font-medium">Grange Marketplace</div>
                          <div className="text-sm text-butcher-500">Shop ingredients directly from recipes</div>
                        </div>
                      </li>
                      <li className="flex items-start text-butcher-600">
                        <span className="mr-2 mt-1">✨</span>
                        <div>
                          <div className="font-medium">Chef's Corner</div>
                          <div className="text-sm text-butcher-500">Expert cooking techniques and tutorials</div>
                        </div>
                      </li>
                      <li className="flex items-start text-butcher-600 font-medium">
                        <span className="mr-2 mt-1">+</span>
                        <div>
                          <div className="font-medium">All Free Features</div>
                          <div className="text-sm text-butcher-500">Everything from the free tier included</div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="text-center">
                  <Link href="/signup" legacyBehavior>
                    <a className="inline-block px-12 py-6 bg-porkchop-600 text-white text-2xl font-bold rounded-lg hover:bg-porkchop-700 transition-all duration-300 text-center shadow-lg hover:shadow-2xl transform hover:-translate-y-1">
                      Start Cooking
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Features Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="features" className="bg-white rounded-lg shadow-lg p-12 mb-16 scroll-mt-20">
          <h2 className="text-3xl font-bold text-butcher-800 mb-2 text-center">Core Features</h2>
          <p className="text-xl text-butcher-600 mb-8 text-center">Everything you need to elevate your cooking journey</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.filter(f => f.category === 'core').map((feature) => (
              <div 
                key={feature.title} 
                className="bg-gray-50 rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow relative border-2 border-butcher-200"
              >
                <div className="bg-butcher-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <span className="text-butcher-600 text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-butcher-800 mb-3">{feature.title}</h3>
                <p className="text-butcher-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Features Section */}
        <div className="bg-white rounded-lg shadow-lg p-12 mb-16">
          <h2 className="text-3xl font-bold text-butcher-800 mb-2 text-center">Learn & Grow</h2>
          <p className="text-xl text-butcher-600 mb-8 text-center">Track your progress and master new skills</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.filter(f => f.category === 'learning').map((feature) => (
              <div 
                key={feature.title} 
                className="bg-gray-50 rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow relative border-2 border-butcher-200"
              >
                <div className="bg-porkchop-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <span className="text-porkchop-600 text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-butcher-800 mb-3">{feature.title}</h3>
                <p className="text-butcher-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div id="how-it-works" className="bg-white rounded-lg shadow-lg p-12 mb-16 scroll-mt-20">
          <h2 className="text-3xl font-bold text-butcher-800 mb-8 text-center">How PorkChop Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-porkchop-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-porkchop-600 text-2xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-butcher-800 mb-3">Create Your Kitchen</h3>
              <p className="text-butcher-600">Set up your digital kitchen and let Chef Freddie get to know you.</p>
            </div>
            <div className="text-center">
              <div className="bg-porkchop-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-porkchop-600 text-2xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-butcher-800 mb-3">Cook & Learn</h3>
              <p className="text-butcher-600">Follow tutorials, take on challenges, and track your progress.</p>
            </div>
            <div className="text-center">
              <div className="bg-porkchop-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-porkchop-600 text-2xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-butcher-800 mb-3">Connect & Share</h3>
              <p className="text-butcher-600">Join the community, share recipes, and discover local ingredients.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-butcher-700 to-butcher-800 rounded-lg shadow-lg p-12 text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Culinary Journey?</h2>
          <p className="text-lg text-white mb-8">
            Join PorkChop today and let Chef Freddie guide you to becoming a better cook.
          </p>
          <Link href="/signup" legacyBehavior>
            <a className="inline-block px-8 py-4 bg-porkchop-600 text-white font-bold rounded-md hover:bg-porkchop-700 transition-colors">
              Join Now
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;