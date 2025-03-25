import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export interface AuthContextType {
  currentUser: {
    firstName: string;
    lastName: string;
    email: string;
    photoURL?: string;
    createdAt?: string;
  } | null;
  logout: () => Promise<void>;
  // Other properties
}

const ProfilePage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  
  // Default avatar if no photoURL
  const getInitials = () => {
    if (currentUser?.firstName && currentUser?.lastName) {
      return `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`.toUpperCase();
    }
    return 'U';
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Not Logged In</h2>
          <p className="mt-2 text-gray-600">Please log in to view your profile</p>
          <Link 
            to="/login" 
            className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              {currentUser.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt="Profile" 
                  className="h-20 w-20 rounded-full"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                  {getInitials()}
                </div>
              )}
              
              <div className="ml-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentUser.firstName} {currentUser.lastName}
                </h2>
                <p className="text-sm text-gray-500">{currentUser.email}</p>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
                  <dl className="mt-2 text-sm text-gray-500">
                    <div className="mt-1">
                      <dt className="inline font-medium">Email: </dt>
                      <dd className="inline">{currentUser.email}</dd>
                    </div>
                    <div className="mt-1">
                      <dt className="inline font-medium">Member since: </dt>
                      <dd className="inline">
                        {currentUser.createdAt ? 
                          new Date(currentUser.createdAt).toLocaleDateString() : 
                          'Not available'}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900">Account Actions</h3>
                  <div className="mt-2 flex flex-col space-y-3">
                    <Link 
                      to="/edit-profile" 
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Edit Profile
                    </Link>
                    <Link 
                      to="/change-password" 
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Change Password
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;