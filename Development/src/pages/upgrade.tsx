import type { NextPage } from 'next';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/router';

const MONTHLY_PRICE = 15.99;
const YEARLY_PRICE = 129.00;

const UpgradePage: NextPage = () => {
  const { user, updateProfile } = useAuth();
  const router = useRouter();
  const [isAnnual, setIsAnnual] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpgrade = async () => {
    setIsLoading(true);
    setError('');

    try {
      // In a real app, this would integrate with a payment processor
      // For now, we'll just update the user's subscription status
      await updateProfile({
        subscriptionTier: 'premium',
        subscriptionStatus: 'active',
        // Set trial end date to 1 month or 1 year from now
        trialEndDate: new Date(Date.now() + (isAnnual ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString()
      });

      // Redirect to dashboard after successful upgrade
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to process upgrade. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-butcher-800 mb-4">Upgrade to El Dente Premium</h1>
          <p className="text-xl text-gray-600">Unlock the full potential of your culinary journey</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-butcher-800 mb-4">Monthly Plan</h2>

              <div className="text-4xl font-bold text-butcher-600 mb-6">
                ${MONTHLY_PRICE}
                <span className="text-lg text-gray-500 font-normal">/month</span>
              </div>
              <button
                onClick={() => {
                  setIsAnnual(false);
                  handleUpgrade();
                }}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-butcher-600 text-white rounded-md font-medium hover:bg-butcher-700 transition-colors disabled:bg-gray-400"
              >
                {isLoading ? 'Processing...' : 'Choose Monthly'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-butcher-600">
            <div className="bg-butcher-600 text-white text-center py-2 text-sm font-medium">
              BEST VALUE
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-butcher-800 mb-4">Annual Plan</h2>
              <div className="text-4xl font-bold text-butcher-600 mb-6">
                ${YEARLY_PRICE}
                <span className="text-lg text-gray-500 font-normal">/year</span>
              </div>
              <button
                onClick={() => {
                  setIsAnnual(true);
                  handleUpgrade();
                }}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-butcher-600 text-white rounded-md font-medium hover:bg-butcher-700 transition-colors disabled:bg-gray-400"
              >
                {isLoading ? 'Processing...' : 'Choose Annual'}
              </button>
              <p className="mt-4 text-center text-sm text-green-600 font-medium">
                Save ${(MONTHLY_PRICE * 12 - YEARLY_PRICE).toFixed(2)} per year
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-butcher-800 mb-6">El Dente Features</h2>
          <div className="space-y-8">
            {/* Premium AI Features */}
            <div>
              <h3 className="text-xl font-semibold text-butcher-700 mb-4">Premium AI Features</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">Chef Freddie AI</h3>
                    <p className="text-gray-500">Your personal AI cooking assistant and recipe advisor</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">The Grange</h3>
                    <p className="text-gray-500">Hyper localized marketplace where you can buy from local producers</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">Chef's Corner</h3>
                    <p className="text-gray-500">Expert cooking tips and technique analysis</p>
                  </div>
                </div>
              </div>
            </div>

          
            {/* Kitchen Tools */}
            <div>
              <h3 className="text-xl font-semibold text-butcher-700 mb-4">Kitchen Tools</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">Meal Planning</h3>
                    <p className="text-gray-500">Plan your meals with our interactive calendar</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">Shopping Lists</h3>
                    <p className="text-gray-500">Auto-generate shopping lists from your recipes</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">Cooking Timers</h3>
                    <p className="text-gray-500">Multi-stage cooking timers for complex recipes</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">Priority Support</h3>
                    <p className="text-gray-500">Get help from our team within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            No thanks, maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradePage;
