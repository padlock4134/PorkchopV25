import type { AppProps } from 'next/app';
import '../styles/globals.css'; // Adjust path to your global CSS
import { AuthProvider } from '../context/AuthContext';
import { SavedRecipesProvider } from '../context/SavedRecipesContext';
import { ChefFreddieProvider } from '../context/ChefFreddieContext';
import { ChallengeProvider } from '../context/ChallengeContext';
import { AchievementsProvider } from '../context/AchievementsContext';
import GlobalChefFreddie from '../components/GlobalChefFreddie';
import Navigation from '../components/Navigation';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <SavedRecipesProvider>
        <ChefFreddieProvider>
          <ChallengeProvider>
            <AchievementsProvider>
              {Component.displayName !== 'Auth' && <Navigation />}
              <div className="pt-20"> 
                <Component {...pageProps} />
              </div>
              <GlobalChefFreddie />
            </AchievementsProvider>
          </ChallengeProvider>
        </ChefFreddieProvider>
      </SavedRecipesProvider>
    </AuthProvider>
  );
}

export default MyApp;