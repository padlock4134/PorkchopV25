import type { AppProps } from 'next/app';
import '../styles/globals.css'; // Adjust path to your global CSS
import { AuthProvider } from '../context/AuthContext';
import { SavedRecipesProvider } from '../context/SavedRecipesContext';
import { ChefFreddieProvider } from '../context/ChefFreddieContext';
import { ChallengeProvider } from '../context/ChallengeContext';
import GlobalChefFreddie from '../components/GlobalChefFreddie';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <SavedRecipesProvider>
        <ChefFreddieProvider>
          <ChallengeProvider>
            <Component {...pageProps} />
            <GlobalChefFreddie />
          </ChallengeProvider>
        </ChefFreddieProvider>
      </SavedRecipesProvider>
    </AuthProvider>
  );
}

export default MyApp;