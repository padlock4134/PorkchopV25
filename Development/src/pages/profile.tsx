import type { NextPage } from 'next';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ChefFreddieLogo from '../components/ChefFreddieLogo';
import ProtectedRoute from '../components/ProtectedRoute';

const Profile: NextPage = () => {
  const { user, logout, updateProfile } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    instagram: '',
    facebook: '',
    twitter: '',
    website: '',
    youtube: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  
  useEffect(() => {
    // Load user data from localStorage or context
    const loadUserData = () => {
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
          youtube: parsedUserData.socialLinks?.youtube || ''
        });
      } else if (user) {
        setUserData(user);
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          instagram: user.socialLinks?.instagram || '',
          facebook: user.socialLinks?.facebook || '',
          twitter: user.socialLinks?.twitter || '',
          website: user.socialLinks?.website || '',
          youtube: user.socialLinks?.youtube || ''
        });
      }
      
      setIsLoading(false);
    };
    
    loadUserData();
  }, [user]);
  
  // Update form when user data changes
  useEffect(() => {
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
        youtube: user.socialLinks?.youtube || ''
      });
      setIsLoading(false);
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        }
      });
      
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
  
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  if (isLoading) {
    return <div className="text-center p-8">Loading...</div>;
  }
  
  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-butcher-800">Profile Settings</h1>
          <Link href="/dashboard">
            <a className="text-butcher-600 hover:text-butcher-800 transition-colors">
              Back to Dashboard
            </a>
          </Link>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-butcher-700 text-white p-6 flex items-center">
            <div className="w-20 h-20 rounded-full bg-white text-butcher-700 flex items-center justify-center text-3xl font-bold mr-4 overflow-hidden">
              {userData && userData.firstName ? userData.firstName.charAt(0) : ''}
              {userData && userData.lastName ? userData.lastName.charAt(0) : ''}
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {userData ? `${userData.firstName} ${userData.lastName}` : 'User'}
              </h2>
              <p className="text-butcher-200">{userData?.email || ''}</p>
            </div>
          </div>
          
          {saveMessage.text && (
            <div className={`p-3 mb-4 rounded-md ${
              saveMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {saveMessage.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-butcher-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isEditing ? 'border-butcher-300' : 'border-gray-200 bg-gray-50'
                  }`}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-butcher-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isEditing ? 'border-butcher-300' : 'border-gray-200 bg-gray-50'
                  }`}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-butcher-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isEditing ? 'border-butcher-300' : 'border-gray-200 bg-gray-50'
                  }`}
                />
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-butcher-800 mb-3 border-b border-butcher-100 pb-2">
              Social Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-butcher-700 mb-1">
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
                    disabled={!isEditing}
                    className={`flex-1 px-3 py-2 border rounded-r-md ${
                      isEditing ? 'border-butcher-300' : 'border-gray-200 bg-gray-50'
                    }`}
                    placeholder="username"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="facebook" className="block text-sm font-medium text-butcher-700 mb-1">
                  Facebook
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    facebook.com/
                  </span>
                  <input
                    type="text"
                    id="facebook"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`flex-1 px-3 py-2 border rounded-r-md ${
                      isEditing ? 'border-butcher-300' : 'border-gray-200 bg-gray-50'
                    }`}
                    placeholder="username"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="twitter" className="block text-sm font-medium text-butcher-700 mb-1">
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
                    disabled={!isEditing}
                    className={`flex-1 px-3 py-2 border rounded-r-md ${
                      isEditing ? 'border-butcher-300' : 'border-gray-200 bg-gray-50'
                    }`}
                    placeholder="username"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-butcher-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isEditing ? 'border-butcher-300' : 'border-gray-200 bg-gray-50'
                  }`}
                  placeholder="https://yourwebsite.com"
                />
              </div>
              <div>
                <label htmlFor="youtube" className="block text-sm font-medium text-butcher-700 mb-1">
                  YouTube
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    youtube.com/
                  </span>
                  <input
                    type="text"
                    id="youtube"
                    name="youtube"
                    value={formData.youtube}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`flex-1 px-3 py-2 border rounded-r-md ${
                      isEditing ? 'border-butcher-300' : 'border-gray-200 bg-gray-50'
                    }`}
                    placeholder="channel"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between border-t border-butcher-100 pt-6">
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Sign Out
              </button>
              
              <div className="space-x-3">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-butcher-300 text-butcher-700 rounded-lg hover:bg-butcher-50 transition-colors"
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-butcher-600 text-white rounded-lg hover:bg-butcher-700 transition-colors"
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-butcher-600 text-white rounded-lg hover:bg-butcher-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden mt-8">
          <h3 className="text-lg font-semibold text-butcher-800 mb-4 p-6">Account Information</h3>
          <div className="space-y-4 p-6">
            <div className="flex justify-between items-center pb-2 border-b border-butcher-100">
              <span className="text-butcher-600">Subscription</span>
              <span className="font-medium text-butcher-800">{userData?.subscriptionTier === 'premium' ? 'Premium' : 'Free'}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-butcher-100">
              <span className="text-butcher-600">Status</span>
              <span className="font-medium text-butcher-800 capitalize">{userData?.subscriptionStatus}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-butcher-100">
              <span className="text-butcher-600">Recipes Created</span>
              <span className="font-medium text-butcher-800">{userData?.recipesCreated}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-butcher-600">Member Since</span>
              <span className="font-medium text-butcher-800">{userData ? new Date(userData.createdAt).toLocaleDateString() : ''}</span>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
