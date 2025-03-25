import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useButcherTheme } from './ButcherThemeProvider';
import MeatTag from './MeatTag';

const ButcherHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const theme = useButcherTheme();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="relative bg-butcher-700 text-vintage-50 shadow-lg z-10">
      {/* Decorative meat hooks */}
      <div className="absolute top-0 left-0 w-full overflow-hidden h-2">
        <div className="flex justify-between max-w-7xl mx-auto px-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-6 w-px bg-gray-400 transform translate-y-[-50%]" />
          ))}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo area */}
          <div className="flex items-center">
            <Link 
              to="/"
              className="flex items-center space-x-2"
              style={{ fontFamily: theme.fonts.display }}
            >
              <div className="bg-satriales-600 text-white p-1 rounded-full flex items-center justify-center w-10 h-10">
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-bold tracking-tighter">PORKCHOP</span>
                <span 
                  className="text-xs text-vintage-200 tracking-wider"
                  style={{ fontFamily: theme.fonts.script }}
                >
                  Butcher Shop Edition
                </span>
              </div>
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex">
            <ul className="flex space-x-1">
              {['Dashboard', 'My Cookbook', 'Create Recipe', "Chef's Corner"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="px-3 py-2 rounded-md text-sm font-medium text-vintage-200 hover:text-white hover:bg-butcher-600 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* User area */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <MeatTag color="yellow" size="small" withHole={false}>
                  <Link to="/profile" className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{user.name}</span>
                  </Link>
                </MeatTag>
                <button 
                  onClick={handleLogout}
                  className="text-sm text-vintage-200 hover:text-white"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-vintage-200 hover:text-white"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="ml-3 px-3 py-2 rounded-md text-sm font-medium bg-satriales-600 text-white hover:bg-satriales-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom border with meat cleaver pattern */}
      <div className="h-2 bg-butcher-800 w-full relative overflow-hidden">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-px bg-butcher-400 opacity-30"></div>
        </div>
        <div className="flex justify-around max-w-7xl mx-auto">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-6 h-2 bg-butcher-500 opacity-60"></div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default ButcherHeader;