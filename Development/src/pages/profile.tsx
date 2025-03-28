import React from 'react';
import type { NextPage } from 'next';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const CUISINE_OPTIONS = [
  'Italian',
  'French',
  'Japanese',
  'Chinese',
  'Mexican',
  'Indian',
  'Thai',
  'Mediterranean',
  'American',
  'BBQ',
  'Seafood',
  'Vegetarian',
  'Vegan',
  'Desserts',
  'Breakfast'
];

const Profile: NextPage = () => {
  const { user, isLoading: authLoading, updateProfile, logout } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    instagram: '',
    facebook: '',
    twitter: '',
    website: '',
    youtube: '',
    preferredCuisines: [] as string[]
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Update form when user data changes
  useEffect(() => {
    // Try to get user from localStorage if not in context
    const storedUser = localStorage.getItem('user');
    const userData = user || (storedUser ? JSON.parse(storedUser) : null);
    
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        instagram: userData.socialLinks?.instagram || '',
        facebook: userData.socialLinks?.facebook || '',
        twitter: userData.socialLinks?.twitter || '',
        website: userData.socialLinks?.website || '',
        youtube: userData.socialLinks?.youtube || '',
        preferredCuisines: userData.preferredCuisines || []
      });
    }
  }, [user]);

  // Handle auth state
  useEffect(() => {
    if (!authLoading && !user && !localStorage.getItem('user')) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCuisineToggle = (cuisine: string) => {
    setFormData(prev => {
      const cuisines = prev.preferredCuisines || [];
      if (cuisines.includes(cuisine)) {
        return {
          ...prev,
          preferredCuisines: cuisines.filter(c => c !== cuisine)
        };
      } else {
        return {
          ...prev,
          preferredCuisines: [...cuisines, cuisine]
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        socialLinks: {
          instagram: formData.instagram,
          facebook: formData.facebook,
          twitter: formData.twitter,
          website: formData.website,
          youtube: formData.youtube
        },
        preferredCuisines: formData.preferredCuisines
      });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      setError('Failed to logout. Please try again.');
    }
  };

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-butcher-800 mb-8">Profile Settings</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-butcher-500 focus:ring-butcher-500"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-butcher-500 focus:ring-butcher-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-butcher-500 focus:ring-butcher-500"
            />
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-butcher-800 mb-4">Social Links</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                  Instagram
                </label>
                <input
                  type="url"
                  id="instagram"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/username"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-butcher-500 focus:ring-butcher-500"
                />
              </div>

              <div>
                <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
                  Facebook
                </label>
                <input
                  type="url"
                  id="facebook"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  placeholder="https://facebook.com/username"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-butcher-500 focus:ring-butcher-500"
                />
              </div>

              <div>
                <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                  Twitter
                </label>
                <input
                  type="url"
                  id="twitter"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  placeholder="https://twitter.com/username"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-butcher-500 focus:ring-butcher-500"
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourwebsite.com"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-butcher-500 focus:ring-butcher-500"
                />
              </div>

              <div>
                <label htmlFor="youtube" className="block text-sm font-medium text-gray-700">
                  YouTube
                </label>
                <input
                  type="url"
                  id="youtube"
                  name="youtube"
                  value={formData.youtube}
                  onChange={handleChange}
                  placeholder="https://youtube.com/channel"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-butcher-500 focus:ring-butcher-500"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-butcher-800 mb-4">Cuisine Preferences</h2>
            <p className="text-sm text-gray-600 mb-4">Select your favorite cuisines to get personalized recipe recommendations</p>
            <div className="flex flex-wrap gap-2">
              {CUISINE_OPTIONS.map(cuisine => (
                <button
                  key={cuisine}
                  type="button"
                  onClick={() => handleCuisineToggle(cuisine)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    formData.preferredCuisines.includes(cuisine)
                      ? 'bg-butcher-600 text-white hover:bg-butcher-700 ring-2 ring-butcher-600 ring-offset-2'
                      : 'bg-white text-gray-700 hover:bg-gray-50 ring-1 ring-gray-300'
                  }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-6">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 rounded-md text-white font-medium bg-gray-600 hover:bg-gray-700 transition-colors flex items-center gap-2 group"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2} 
                stroke="currentColor" 
                className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 rounded-md text-white font-medium bg-gray-600 hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-butcher-600 hover:bg-butcher-700'
                }`}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
