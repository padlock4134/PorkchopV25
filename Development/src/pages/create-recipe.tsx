import React from 'react';
import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useChefFreddie } from '../context/ChefFreddieContext';
import CreateRecipe from '../components/CreateRecipe';
import { useAchievementTracker } from '../utils/achievementTracker';
import Link from 'next/link';
import { withAuth } from '../components/withAuth';
import { useRouter } from 'next/router';
import RecipeMatching from '../components/RecipeMatching';

interface Recipe {
  instructions: string[] | string | undefined;
}

interface RecipeMatchingProps {
  recipe: Recipe;
}

const CreateRecipePage: NextPage = () => {
  const { setCurrentRoute, showChefFreddie } = useChefFreddie();
  const router = useRouter();
  
  // Safely try to use achievement tracker, but don't crash if it's not available
  let trackRecipeCreation: () => void = () => {};
  try {
    const achievementTracker = useAchievementTracker();
    trackRecipeCreation = achievementTracker.trackRecipeCreation;
  } catch (error) {
    console.warn('Achievement tracking not available:', error);
  }

  const handleFindMatches = () => {
    router.push('/recipes');
  };

  useEffect(() => {
    setCurrentRoute('/create-recipe');
    showChefFreddie();
  }, [setCurrentRoute, showChefFreddie]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-vintage p-6 mb-8">
        <h1 className="text-2xl font-bold text-butcher-800 mb-4">Create a Recipe</h1>
        <p className="text-butcher-600 mb-6">
          Select ingredients and cookware to find matching recipes or create your own custom recipe.
        </p>
        
        <CreateRecipe />
        
        <div className="mt-6 flex gap-4">
          <button
            onClick={handleFindMatches}
            className="bg-butcher-500 text-white px-4 py-2 rounded hover:bg-butcher-600"
          >
            Find Matches
          </button>
          
          <Link href="/dashboard" className="text-porkchop-600 hover:text-porkchop-800">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default withAuth(CreateRecipePage);