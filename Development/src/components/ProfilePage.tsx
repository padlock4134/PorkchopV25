import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Define common cuisine types
const CUISINE_TYPES = [
  'American',
  'Italian',
  'Mexican',
  'Chinese',
  'Japanese',
  'Indian',
  'Thai',
  'Mediterranean',
  'French',
  'Spanish',
  'Greek',
  'Middle Eastern',
  'Korean',
  'Vietnamese'
];

const ProfilePage: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
  
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
  
  useEffect(() => {
    // Try to get user data from context or localStorage
    if (user) {
      setUserData(user);
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        instagram: user.socialLinks?.instagram || '',
        facebook: user.socialLinks?.facebook || '',
        twitter: user.socialLinks?.twitter || '',
        website: user.socialLinks?.website || '',
        youtube: user.socialLinks?.youtube || '',
        preferredCuisines: user.preferredCuisines || []
      });
      setIsLoading(false);
    } else {
      // Try to load from localStorage as fallback
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUserData = JSON.parse(storedUser);
          setUserData(parsedUserData);
          setFormData({
            firstName: parsedUserData.firstName || '',
            lastName: parsedUserData.lastName || '',
            email: parsedUserData.email || '',
            instagram: parsedUserData.socialLinks?.instagram || '',
            facebook: parsedUserData.socialLinks?.facebook || '',
            twitter: parsedUserData.socialLinks?.twitter || '',
            website: parsedUserData.socialLinks?.website || '',
            youtube: parsedUserData.socialLinks?.youtube || '',
            preferredCuisines: parsedUserData.preferredCuisines || []
          });
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
      setIsLoading(false);
    }
  }, [user]);
  
  // Default avatar if no photoURL
  const getInitials = () => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase();
    }
    return 'U';
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('user'); // Clear local storage on logout
      router.push('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle cuisine preference changes
  const toggleCuisinePreference = (cuisine: string) => {
    setFormData(prev => {
      const updatedCuisines = prev.preferredCuisines.includes(cuisine)
        ? prev.preferredCuisines.filter(c => c !== cuisine)
        : [...prev.preferredCuisines, cuisine];
      
      return {
        ...prev,
        preferredCuisines: updatedCuisines
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage({ type: '', text: '' });
    
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
      
      // Update the local userData state to reflect changes
      setUserData(prev => ({
        ...prev,
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
      }));
      
      setIsEditing(false);
      setSaveMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Loading...</h2>
          <div className="mt-4 w-12 h-12 border-t-2 border-b-2 border-butcher-600 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // Always show profile content - even if userData is null, we'll show default values
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {saveMessage.text && (
          <div className={`mb-4 p-3 rounded-md ${saveMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {saveMessage.text}
          </div>
        )}
        
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {!isEditing ? (
              // View Mode
              <>
                <div className="flex items-center">
                  {userData?.avatar ? (
                    <img 
                      src={userData.avatar} 
                      alt="Profile" 
                      className="h-20 w-20 rounded-full"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-butcher-600 flex items-center justify-center text-white text-xl font-bold">
                      {getInitials()}
                    </div>
                  )}
                  
                  <div className="ml-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {userData?.firstName || 'First'} {userData?.lastName || 'Last'}
                    </h2>
                    <p className="text-sm text-gray-500">{userData?.email || 'user@example.com'}</p>
                    {userData?.createdAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        Member since {new Date(userData.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
                      <dl className="mt-2 text-sm text-gray-500">
                        <div className="mt-1">
                          <dt className="inline font-medium text-gray-700">Subscription: </dt>
                          <dd className="inline">{userData?.subscriptionTier === 'premium' ? 'Premium' : 'Free'}</dd>
                        </div>
                        <div className="mt-1">
                          <dt className="inline font-medium text-gray-700">Status: </dt>
                          <dd className="inline capitalize">{userData?.subscriptionStatus || 'active'}</dd>
                        </div>
                        <div className="mt-1">
                          <dt className="inline font-medium text-gray-700">Recipes Created: </dt>
                          <dd className="inline">{userData?.recipesCreated || 0}</dd>
                        </div>
                        <div className="mt-1">
                          <dt className="inline font-medium text-gray-700">Chef Rank: </dt>
                          <dd className="inline">{userData?.chefRank || 'Apprentice'} (Level {userData?.rankLevel || 1})</dd>
                        </div>
                      </dl>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Social Links</h3>
                      <dl className="mt-2 text-sm text-gray-500">
                        {userData?.socialLinks?.instagram ? (
                          <div className="mt-1">
                            <dt className="inline font-medium text-gray-700">Instagram: </dt>
                            <dd className="inline">@{userData.socialLinks.instagram}</dd>
                          </div>
                        ) : (
                          <div className="mt-1">
                            <dt className="inline font-medium text-gray-700">Instagram: </dt>
                            <dd className="inline text-gray-400">Not provided</dd>
                          </div>
                        )}
                        {userData?.socialLinks?.twitter ? (
                          <div className="mt-1">
                            <dt className="inline font-medium text-gray-700">Twitter: </dt>
                            <dd className="inline">@{userData.socialLinks.twitter}</dd>
                          </div>
                        ) : (
                          <div className="mt-1">
                            <dt className="inline font-medium text-gray-700">Twitter: </dt>
                            <dd className="inline text-gray-400">Not provided</dd>
                          </div>
                        )}
                        {userData?.socialLinks?.facebook ? (
                          <div className="mt-1">
                            <dt className="inline font-medium text-gray-700">Facebook: </dt>
                            <dd className="inline">{userData.socialLinks.facebook}</dd>
                          </div>
                        ) : (
                          <div className="mt-1">
                            <dt className="inline font-medium text-gray-700">Facebook: </dt>
                            <dd className="inline text-gray-400">Not provided</dd>
                          </div>
                        )}
                        {userData?.socialLinks?.website ? (
                          <div className="mt-1">
                            <dt className="inline font-medium text-gray-700">Website: </dt>
                            <dd className="inline">{userData.socialLinks.website}</dd>
                          </div>
                        ) : (
                          <div className="mt-1">
                            <dt className="inline font-medium text-gray-700">Website: </dt>
                            <dd className="inline text-gray-400">Not provided</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </div>

                  {/* Preferred Cuisines Section */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Preferred Cuisines</h3>
                    <p className="text-sm text-gray-500 mb-3">These preferences will help narrow down your recipe matches</p>
                    
                    {userData?.preferredCuisines && userData.preferredCuisines.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {userData.preferredCuisines.map((cuisine: string) => (
                          <span 
                            key={cuisine} 
                            className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-butcher-100 text-butcher-800"
                          >
                            {cuisine}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No cuisine preferences set</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between">
                  <Link 
                    href="/dashboard"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Back to Dashboard
                  </Link>
                  
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-butcher-600 hover:bg-butcher-700"
                  >
                    Edit Profile
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              // Edit Mode
              <form onSubmit={handleSubmit}>
                <div className="flex items-center mb-6">
                  {userData?.avatar ? (
                    <img 
                      src={userData.avatar} 
                      alt="Profile" 
                      className="h-20 w-20 rounded-full"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-butcher-600 flex items-center justify-center text-white text-xl font-bold">
                      {getInitials()}
                    </div>
                  )}
                  
                  <div className="ml-6">
                    <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                    <p className="text-sm text-gray-500">Update your personal information and social links</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4 mb-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-butcher-500 focus:border-butcher-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-butcher-500 focus:border-butcher-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-butcher-500 focus:border-butcher-500"
                      />
                    </div>
                  </div>

                  <h3 className="text-lg font-medium text-gray-900 mb-4">Social Links</h3>
                  <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4 mb-6">
                    <div>
                      <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
                        Instagram
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                          @
                        </span>
                        <input
                          type="text"
                          id="instagram"
                          name="instagram"
                          value={formData.instagram}
                          onChange={handleChange}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-butcher-500 focus:border-butcher-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">
                        Twitter
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                          @
                        </span>
                        <input
                          type="text"
                          id="twitter"
                          name="twitter"
                          value={formData.twitter}
                          onChange={handleChange}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-butcher-500 focus:border-butcher-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">
                        Facebook
                      </label>
                      <input
                        type="text"
                        id="facebook"
                        name="facebook"
                        value={formData.facebook}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-butcher-500 focus:border-butcher-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <input
                        type="text"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-butcher-500 focus:border-butcher-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="youtube" className="block text-sm font-medium text-gray-700 mb-1">
                        YouTube
                      </label>
                      <input
                        type="text"
                        id="youtube"
                        name="youtube"
                        value={formData.youtube}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-butcher-500 focus:border-butcher-500"
                      />
                    </div>
                  </div>
                  
                  {/* Preferred Cuisines Selection */}
                  <h3 className="text-lg font-medium text-gray-900 mb-4 mt-6">Preferred Cuisines</h3>
                  <p className="text-sm text-gray-500 mb-4">Select your favorite cuisines to improve recipe recommendations</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {CUISINE_TYPES.map(cuisine => (
                      <button
                        key={cuisine}
                        type="button"
                        onClick={() => toggleCuisinePreference(cuisine)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.preferredCuisines.includes(cuisine)
                            ? 'bg-butcher-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cuisine}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between border-t border-gray-200 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-butcher-600 hover:bg-butcher-700"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;