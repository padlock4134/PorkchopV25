import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useChefFreddie } from '../context/ChefFreddieContext';
import { useSavedRecipes } from '../context/SavedRecipesContext';
import Link from 'next/link';

const MyCookbook: NextPage = () => {
  const { showChefFreddie, setCurrentRoute } = useChefFreddie();
  const { savedRecipes, collections } = useSavedRecipes();
  
  // Set current route and show Chef Freddie
  useEffect(() => {
    setCurrentRoute('/my-cookbook');
    showChefFreddie();
  }, [setCurrentRoute, showChefFreddie]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-vintage p-6 mb-8">
        <h1 className="text-2xl font-bold text-butcher-800 mb-4">My Cookbook</h1>
        <p className="text-butcher-600 mb-6">
          Access your saved recipes and collections.
        </p>
        
        {/* Collections Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-butcher-700 mb-4">Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {collections.map(collection => (
              <div key={collection.id} className="bg-porkchop-50 p-4 rounded-lg border border-porkchop-100">
                <h3 className="font-medium text-porkchop-800">{collection.name}</h3>
                <p className="text-sm text-porkchop-600 mb-2">{collection.description}</p>
                <p className="text-xs text-porkchop-500">{collection.recipeIds.length} recipes</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Saved Recipes Section */}
        <div>
          <h2 className="text-xl font-semibold text-butcher-700 mb-4">Saved Recipes</h2>
          {savedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedRecipes.map(recipe => (
                <div key={recipe.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="h-40 bg-gray-100 rounded mb-3 flex items-center justify-center">
                    {recipe.imageUrl ? (
                      <img 
                        src={recipe.imageUrl} 
                        alt={recipe.title} 
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <span className="text-3xl">🍽️</span>
                    )}
                  </div>
                  <h3 className="font-medium text-butcher-800 mb-1">{recipe.title}</h3>
                  <p className="text-sm text-butcher-600 mb-2 line-clamp-2">{recipe.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2 text-xs text-butcher-500">
                      <span>⏱️ {recipe.cookingTime} mins</span>
                      <span>👥 {recipe.servings}</span>
                    </div>
                    <Link 
                      href={`/recipe/${recipe.id}`}
                      className="text-xs text-porkchop-600 hover:text-porkchop-800"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
              <p className="text-gray-500">You haven't saved any recipes yet.</p>
              <Link 
                href="/create-recipe"
                className="mt-2 inline-block text-porkchop-600 hover:text-porkchop-800"
              >
                Create your first recipe →
              </Link>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <Link href="/dashboard" className="text-porkchop-600 hover:text-porkchop-800">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyCookbook;
