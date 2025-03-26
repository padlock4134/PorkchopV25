import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useChefFreddie } from '../context/ChefFreddieContext';
import CreateRecipe from '../components/CreateRecipe';
import { useAchievementTracker } from '../utils/achievementTracker';
import Link from 'next/link';

const CreateRecipePage: NextPage = () => {
  const { setCurrentRoute, showChefFreddie } = useChefFreddie();
  const { trackRecipeCreation } = useAchievementTracker();

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
        
        {/* Ingredient selection component */}
        <CreateRecipe />
        
        <div className="mt-6">
          <Link href="/dashboard" className="text-porkchop-600 hover:text-porkchop-800">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipePage;
