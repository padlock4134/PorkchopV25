import { ReactNode, useEffect, useState } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { SavedRecipesProvider } from '../context/SavedRecipesContext';
import { ChefFreddieProvider } from '../context/ChefFreddieContext';
import { ChallengeProvider } from '../context/ChallengeContext';
import { isStorageAvailable } from '../utils/localStorage';
import GlobalChefFreddie from '../components/GlobalChefFreddie';
import Navigation from '../components/Navigation';

interface AppWrapperProps {
  children: ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    // Check if localStorage is available (will not be during SSR)
    if (typeof window !== 'undefined') {
      const storageAvailable = isStorageAvailable();
      setIsStorageReady(storageAvailable);
      setStorageError(!storageAvailable);
    }
  }, []);

  // Don't render anything during SSR or if checking storage availability
  if (typeof window === 'undefined' || !isStorageReady) {
    return null;
  }

  // Show error message if localStorage is not available
  if (storageError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-xl font-bold text-red-600 mb-4">Storage Error</h1>
          <p className="text-gray-700 mb-4">
            PorkChop requires localStorage to function properly, but it appears to be unavailable in your browser. This could be due to:
          </p>
          <ul className="list-disc pl-5 mb-4 text-gray-700">
            <li>Private browsing mode</li>
            <li>Browser settings that block storage</li>
            <li>Storage quota exceeded</li>
          </ul>
          <p className="text-gray-700">
            Please try a different browser or adjust your privacy settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <SavedRecipesProvider>
        <ChefFreddieProvider>
          <ChallengeProvider>
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <main className="pt-16">
                {children}
              </main>
              <GlobalChefFreddie />
            </div>
          </ChallengeProvider>
        </ChefFreddieProvider>
      </SavedRecipesProvider>
    </AuthProvider>
  );
}