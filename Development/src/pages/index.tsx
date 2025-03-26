import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ChefFreddieLogo from '../components/ChefFreddieLogo';

const Home: NextPage = () => {
  const router = useRouter();

  const features = [
    { 
      title: 'Recipe Management', 
      description: 'Create, save, and organize your favorite recipes in personalized collections.', 
      icon: '🍲' 
    },
    { 
      title: 'Chef Freddie Assistant', 
      description: 'Get cooking tips, ingredient substitutions, and recipe recommendations.', 
      icon: '🧑‍🍳' 
    },
    { 
      title: 'Cooking Challenges', 
      description: 'Improve your skills with weekly cooking challenges and earn achievements.', 
      icon: '🏆' 
    },
    { 
      title: 'Meal Planning', 
      description: 'Plan your meals for the week and generate shopping lists automatically.', 
      icon: '📅' 
    },
    { 
      title: 'Butcher Shop Locator', 
      description: 'Find quality local butchers and specialty meat shops near you.', 
      icon: '🥩' 
    },
    { 
      title: 'Community Recipes', 
      description: 'Discover and share recipes with a growing community of food enthusiasts.', 
      icon: '👨‍👩‍👧‍👦' 
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      title: 'Home Cook',
      quote: 'PorkChop has completely transformed my cooking routine. The recipe management is intuitive and Chef Freddie\'s tips are invaluable!',
      avatar: '👩‍🍳'
    },
    {
      name: 'Michael Chen',
      title: 'Food Blogger',
      quote: 'As someone who creates recipes professionally, PorkChop\'s organization tools have been a game-changer for my workflow.',
      avatar: '👨‍🍳'
    },
    {
      name: 'Emily Rodriguez',
      title: 'Culinary Student',
      quote: 'The cooking challenges push me to try new techniques, and I love connecting with other food enthusiasts in the community.',
      avatar: '👩‍🎓'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="w-10 h-10">
                <ChefFreddieLogo />
              </div>
              <span className="ml-2 text-xl font-bold text-butcher-800">PorkChop</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" legacyBehavior>
                <a className="text-butcher-600 hover:text-butcher-800 transition-colors">Log In</a>
              </Link>
              <Link href="/signup" legacyBehavior>
                <a className="px-4 py-2 bg-porkchop-600 text-white rounded-md hover:bg-porkchop-700 transition-colors">
                  Sign Up
                </a>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-16">
          <div className="bg-gradient-to-r from-butcher-100 to-porkchop-100 p-12 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-5xl font-bold text-butcher-800 mb-4 font-serif">Your Ultimate Cooking Companion</h1>
              <p className="text-xl text-butcher-600 mb-8">
                PorkChop helps you discover recipes, create meal plans, and connect with local butchers for the freshest ingredients.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/signup" legacyBehavior>
                  <a className="px-8 py-4 bg-porkchop-600 text-white font-medium rounded-md hover:bg-porkchop-700 transition-colors text-center">
                    Get Started Free
                  </a>
                </Link>
                <a 
                  href="#features" 
                  className="px-8 py-4 border border-porkchop-600 text-porkchop-600 font-medium rounded-md hover:bg-porkchop-50 transition-colors text-center"
                >
                  See Features
                </a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-80 h-80">
                <ChefFreddieLogo />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-4xl font-bold text-porkchop-600 mb-2">10,000+</div>
            <div className="text-lg text-butcher-600">Recipes Available</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-4xl font-bold text-porkchop-600 mb-2">5,000+</div>
            <div className="text-lg text-butcher-600">Active Users</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-4xl font-bold text-porkchop-600 mb-2">500+</div>
            <div className="text-lg text-butcher-600">Local Butchers</div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mb-16">
          <h2 className="text-3xl font-bold text-butcher-800 mb-8 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
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
        <div className="bg-white rounded-lg shadow-lg p-12 mb-16">
          <h2 className="text-3xl font-bold text-butcher-800 mb-8 text-center">How PorkChop Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-porkchop-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-porkchop-600 text-2xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-butcher-800 mb-3">Create an Account</h3>
              <p className="text-butcher-600">Sign up for free and set up your personal profile to get started.</p>
            </div>
            <div className="text-center">
              <div className="bg-porkchop-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-porkchop-600 text-2xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-butcher-800 mb-3">Explore Recipes</h3>
              <p className="text-butcher-600">Browse our extensive collection or create your own custom recipes.</p>
            </div>
            <div className="text-center">
              <div className="bg-porkchop-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-porkchop-600 text-2xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-butcher-800 mb-3">Cook & Share</h3>
              <p className="text-butcher-600">Follow easy instructions and share your creations with the community.</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-butcher-800 mb-8 text-center">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-butcher-800">{testimonial.name}</h3>
                    <p className="text-sm text-butcher-600">{testimonial.title}</p>
                  </div>
                </div>
                <p className="text-butcher-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-butcher-800 rounded-lg shadow-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Cooking?</h2>
          <p className="text-xl text-butcher-100 mb-8 max-w-3xl mx-auto">
            Join PorkChop today and discover a new way to experience cooking. Create, save, and share recipes with a growing community of food enthusiasts.
          </p>
          <Link href="/signup" legacyBehavior>
            <a className="px-8 py-4 bg-porkchop-500 text-white font-medium rounded-md hover:bg-porkchop-600 transition-colors inline-block">
              Sign Up For Free
            </a>
          </Link>
          <p className="text-butcher-300 mt-4">No credit card required. Start cooking today!</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8">
                  <ChefFreddieLogo />
                </div>
                <span className="ml-2 text-lg font-bold text-butcher-800">PorkChop</span>
              </div>
              <p className="text-butcher-600 mb-4">Your ultimate cooking companion for discovering recipes and connecting with local butchers.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-butcher-800 mb-4">Features</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-butcher-600 hover:text-butcher-800 transition-colors">Recipe Management</a></li>
                <li><a href="#features" className="text-butcher-600 hover:text-butcher-800 transition-colors">Chef Freddie Assistant</a></li>
                <li><a href="#features" className="text-butcher-600 hover:text-butcher-800 transition-colors">Cooking Challenges</a></li>
                <li><a href="#features" className="text-butcher-600 hover:text-butcher-800 transition-colors">Meal Planning</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-butcher-800 mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-butcher-600 hover:text-butcher-800 transition-colors">About Us</a></li>
                <li><a href="#" className="text-butcher-600 hover:text-butcher-800 transition-colors">Careers</a></li>
                <li><a href="#" className="text-butcher-600 hover:text-butcher-800 transition-colors">Contact</a></li>
                <li><a href="#" className="text-butcher-600 hover:text-butcher-800 transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-butcher-800 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-butcher-600 hover:text-butcher-800 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-butcher-600 hover:text-butcher-800 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-butcher-600 hover:text-butcher-800 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-butcher-600">
            <p> {new Date().getFullYear()} PorkChop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;