import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import ChefFreddieLogo from './ChefFreddieLogo';

export default function Navigation() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <ChefFreddieLogo />
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/">
                  <a className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    Home
                  </a>
                </Link>
                <Link href="/about">
                  <a className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                    About
                  </a>
                </Link>
                {user && (
                  <Link href="/dashboard">
                    <a className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                      Dashboard
                    </a>
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center">
            {user ? (
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            ) : (
              <Link href="/login">
                <a className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </a>
              </Link>
            )}
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/">
              <a className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
                Home
              </a>
            </Link>
            <Link href="/about">
              <a className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
                About
              </a>
            </Link>
            {user && (
              <Link href="/dashboard">
                <a className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
                  Dashboard
                </a>
              </Link>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
              >
                Logout
              </button>
            ) : (
              <Link href="/login">
                <a className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
                  Login
                </a>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}