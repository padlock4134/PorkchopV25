import React from 'react';
import type { NextPage } from 'next';
import { useChefFreddie } from '../context/ChefFreddieContext';
import { useEffect } from 'react';

const ButcherShop: NextPage = () => {
  const { showChefFreddie } = useChefFreddie();
  
  // Show Chef Freddie when page loads
  useEffect(() => {
    showChefFreddie();
  }, [showChefFreddie]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-butcher-900 mb-4 font-serif">Butcher Shop</h1>
        <p className="text-xl text-butcher-600">Connect with local butchers and specialty meat suppliers</p>
      </div>

      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-satriales-100 to-satriales-50 rounded-xl p-8 mb-12 text-center shadow-vintage">
        <h2 className="text-2xl font-semibold text-butcher-900 mb-4">Coming Soon!</h2>
        <p className="text-butcher-700 mb-6">
          We're working on partnerships with local butchers and specialty meat suppliers to bring you the finest cuts and expert advice.
        </p>
        <button
          className="bg-satriales-500 text-white px-6 py-3 rounded-full font-medium hover:bg-satriales-600 transition-colors shadow-md"
          onClick={() => alert('Feature coming soon!')}
        >
          Get Notified
        </button>
      </div>

      {/* Feature Previews */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow-vintage p-6 border border-butcher-200">
          <div className="w-16 h-16 bg-satriales-100 rounded-full mb-4 flex items-center justify-center">
            <span className="text-2xl">🏬</span>
          </div>
          <h3 className="text-xl font-semibold text-butcher-900 mb-3">Local Partnerships</h3>
          <p className="text-butcher-600">
            Connect with trusted local butchers and meat suppliers in your area. Support local businesses while getting the highest quality products.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-vintage p-6 border border-butcher-200">
          <div className="w-16 h-16 bg-satriales-100 rounded-full mb-4 flex items-center justify-center">
            <span className="text-2xl">👨‍🍳</span>
          </div>
          <h3 className="text-xl font-semibold text-butcher-900 mb-3">Expert Advice</h3>
          <p className="text-butcher-600">
            Get professional tips and recommendations for your meat selections. Learn about different cuts, cooking methods, and pairings.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-vintage p-6 border border-butcher-200">
          <div className="w-16 h-16 bg-satriales-100 rounded-full mb-4 flex items-center justify-center">
            <span className="text-2xl">📦</span>
          </div>
          <h3 className="text-xl font-semibold text-butcher-900 mb-3">Special Orders</h3>
          <p className="text-butcher-600">
            Place custom orders for special cuts and premium selections. Get exactly what you need for your culinary masterpieces.
          </p>
        </div>
      </div>

      {/* Vintage Butcher Shop Image */}
      <div className="mt-16 bg-white p-8 rounded-lg shadow-vintage relative butcher-stamp">
        <h2 className="text-2xl font-semibold text-butcher-900 mb-6 font-serif text-center">The Butcher Shop Experience</h2>
        <div className="bg-vintage-100 h-64 rounded-lg mb-6 flex items-center justify-center">
          <p className="text-center text-butcher-500">Vintage Butcher Shop Image</p>
        </div>
        <p className="text-butcher-600 mb-4">
          Our butcher shop feature will bring the authentic 1950s butcher shop experience to your digital world. 
          We're partnering with butchers who take pride in their craft, offering premium cuts with personal service.
        </p>
        <p className="text-butcher-600">
          Until our full launch, browse our recipes and cooking tips to prepare for the amazing dishes you'll create with quality meats from local providers.
        </p>
      </div>
      
      {/* Newsletter Signup */}
      <div className="mt-12 bg-butcher-800 text-white p-8 rounded-lg shadow-vintage">
        <h2 className="text-2xl font-semibold mb-4 font-serif">Stay Informed</h2>
        <p className="mb-6">
          Be the first to know when our Butcher Shop feature launches. Sign up for notifications and get exclusive offers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <input 
            type="email" 
            placeholder="Your email address" 
            className="flex-1 px-4 py-3 rounded-md text-butcher-800 focus:outline-none focus:ring-2 focus:ring-satriales-500"
          />
          <button className="bg-satriales-500 hover:bg-satriales-600 transition-colors px-6 py-3 rounded-md font-medium">
            Notify Me
          </button>
        </div>
      </div>
    </div>
  );
};

export default ButcherShop;