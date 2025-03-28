import React, { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { DatabaseProvider } from '../context/DatabaseContext';
import { SavedRecipesProvider } from '../context/SavedRecipesContext';
import { ChefFreddieProvider } from '../context/ChefFreddieContext';
import { ChallengeProvider } from '../context/ChallengeContext';
import { SubscriptionProvider } from '../context/SubscriptionContext';
import { AchievementsProvider } from '../context/AchievementsContext';
import Navigation from '../components/Navigation';
import GlobalChefFreddie from '../components/GlobalChefFreddie';

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAuthPage = ['/login', '/signup'].includes(router.pathname);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);

  // Error handling for client-side errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Client-side error:', event.error);
      setErrorInfo(event.error?.toString() || 'Unknown error occurred');
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (errorInfo) {
    return (
      <div className="p-8 bg-red-50 text-red-800">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="mb-4">Error details: {errorInfo}</p>
        <button 
          onClick={() => setErrorInfo(null)}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <AuthProvider>
      <DatabaseProvider>
        <SavedRecipesProvider>
          <ChefFreddieProvider>
            <ChallengeProvider>
              <SubscriptionProvider>
                <AchievementsProvider>
                  <div className="min-h-screen bg-vintage-50">
                    {!isAuthPage && <Navigation />}
                    <main className={!isAuthPage ? 'pt-20' : ''}>
                      <Component {...pageProps} />
                    </main>
                    <GlobalChefFreddie />
                  </div>
                </AchievementsProvider>
              </SubscriptionProvider>
            </ChallengeProvider>
          </ChefFreddieProvider>
        </SavedRecipesProvider>
      </DatabaseProvider>
    </AuthProvider>
  );
}