import React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Chef ranking data
  const chefRank = user?.chefRank || 'Apprentice';
  const rankLevel = user?.rankLevel || 1;
  
  // Get chef icon and color based on rank level
  const getChefRankIcon = () => {
    switch(rankLevel) {
      case 1: 
        return { icon: '🧑‍🍳', color: 'text-gray-500', bg: 'bg-gray-100' }; // Apprentice
      case 2: 
        return { icon: '👨‍🍳', color: 'text-green-600', bg: 'bg-green-100' }; // Sous Chef
      case 3: 
        return { icon: '👨‍🍳', color: 'text-blue-600', bg: 'bg-blue-100' }; // Chef
      case 4: 
        return { icon: '👨‍🍳', color: 'text-purple-600', bg: 'bg-purple-100' }; // Master Chef
      case 5: 
        return { icon: '👑', color: 'text-yellow-600', bg: 'bg-yellow-100' }; // Executive Chef
      default: 
        return { icon: '🧑‍🍳', color: 'text-gray-500', bg: 'bg-gray-100' };
    }
  };

  const rankInfo = getChefRankIcon();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Determine if the current route is an auth page
  const isAuthPage = ['/login', '/signup'].includes(router.pathname);
  
  // Don't show navigation on auth pages
  if (isAuthPage) {
    return null;
  }
  
  // Only hide navigation on the home page if user is not logged in
  if (!user && router.pathname === '/') {
    return null;
  }

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link 
              href="/dashboard"
              className="text-2xl font-bold text-butcher-800 hover:text-butcher-600 transition-colors"
            >
              PorkChop
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {/* El Dente Upgrade Button */}
            {user?.subscriptionTier !== 'premium' && (
              <button
                onClick={() => router.push('/upgrade')}
                className="px-3 py-1.5 text-sm font-medium text-porkchop-600 hover:text-porkchop-800 transition-colors flex items-center gap-1"
              >
                <span>El Dente</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                  className="w-4 h-4"
                >
                  <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
                </svg>
              </button>
            )}
            {/* Chef Ranking Icon */}
            <div className="flex items-center space-x-2">
              <div className={`w-10 h-10 rounded-full ${rankInfo.bg} flex items-center justify-center text-xl`}>
                <span role="img" aria-label="Chef rank">{rankInfo.icon}</span>
              </div>
              <div>
                <span className={`text-xs font-medium block ${rankInfo.color}`}>Level {rankLevel}</span>
                <span className="text-xs text-gray-600 block">{chefRank}</span>
              </div>
            </div>

            {/* Profile Avatar */}
            <Link 
              href="/profile"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-butcher-600 text-white hover:bg-butcher-700 transition-colors"
            >
              {user?.firstName?.charAt(0) || 'P'}
            </Link>

            {/* Recipes Link */}
            <Link
              href="/recipes"
              className={`${
                router.pathname === '/recipes'
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              } inline-flex items-center px-1 pt-1 text-sm font-medium`}
            >
              Recipes
            </Link>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon for menu */}
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Mobile El Dente Upgrade Button */}
            {user?.subscriptionTier !== 'premium' && (
              <button
                onClick={() => router.push('/upgrade')}
                className="w-full px-3 py-2 text-sm font-medium text-porkchop-600 hover:text-porkchop-800 transition-colors flex items-center gap-1"
              >
                <span>El Dente</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                  className="w-4 h-4"
                >
                  <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
                </svg>
              </button>
            )}
            {/* Mobile Chef Ranking */}
            <div className="flex items-center py-2">
              <div className={`w-8 h-8 rounded-full ${rankInfo.bg} flex items-center justify-center text-lg mr-2`}>
                <span role="img" aria-label="Chef rank">{rankInfo.icon}</span>
              </div>
              <div>
                <span className={`text-xs font-medium ${rankInfo.color}`}>Level {rankLevel}</span>
                <p className="text-xs text-gray-600">{chefRank}</p>
              </div>
            </div>

            <Link 
              href="/profile"
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-butcher-600 text-white">
                {user?.firstName?.charAt(0) || 'P'}
              </div>
              <span>Profile</span>
            </Link>
            
            {user && (
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}