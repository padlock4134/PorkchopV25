import React, { useState, useEffect } from 'react';
import { Recipe } from '../utils/recipeData';
import { useUser } from '../context/UserContext';

interface RecipeMatchingProps {
  recipes: Recipe[];
}

const RecipeMatching: React.FC<RecipeMatchingProps> = ({ recipes }) => {
  const { user } = useUser();
  const [matchedRecipes, setMatchedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  useEffect(() => {
    const fetchMatchedRecipes = async () => {
      try {
        // Fetch matched recipes based on user's ingredients
        const response = await fetch(`/api/recipes/matches?userId=${user?.id}`);
        const data = await response.json();
        setMatchedRecipes(data);
      } catch (err) {
        setError('Failed to fetch matched recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchMatchedRecipes();
  }, [user?.id]);

  const validatedInstructions = (recipe: Recipe): string[] => {
    if (!recipe.instructions) return [];
    return Array.isArray(recipe.instructions) ? 
      recipe.instructions : 
      typeof recipe.instructions === 'string' ? 
        recipe.instructions.split('\n') : 
        [];
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // Filter recipes based on active category
  const filteredRecipes = activeCategory === 'all' 
    ? matchedRecipes 
    : matchedRecipes.filter(recipe => {
        if (activeCategory === 'easy') return recipe.difficulty === 'easy';
        if (activeCategory === 'medium') return recipe.difficulty === 'medium';
        if (activeCategory === 'hard') return recipe.difficulty === 'hard';
        return true;
      });

  // Function to get a color based on match percentage
  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 75) return 'bg-green-400';
    if (percentage >= 60) return 'bg-yellow-400';
    if (percentage >= 40) return 'bg-yellow-300';
    return 'bg-red-400';
  };

  return (
    <div className="recipe-matching-container">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-butcher-800">Matched Recipes</h2>
        
        <div className="flex gap-2">
          <button
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === 'all' 
                ? 'bg-porkchop-500 text-white' 
                : 'bg-vintage-100 text-butcher-700 hover:bg-vintage-200'
            }`}
            onClick={() => setActiveCategory('all')}
          >
            All
          </button>
          <button
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === 'easy' 
                ? 'bg-porkchop-500 text-white' 
                : 'bg-vintage-100 text-butcher-700 hover:bg-vintage-200'
            }`}
            onClick={() => setActiveCategory('easy')}
          >
            Easy
          </button>
          <button
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === 'medium' 
                ? 'bg-porkchop-500 text-white' 
                : 'bg-vintage-100 text-butcher-700 hover:bg-vintage-200'
            }`}
            onClick={() => setActiveCategory('medium')}
          >
            Medium
          </button>
          <button
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === 'hard' 
                ? 'bg-porkchop-500 text-white' 
                : 'bg-vintage-100 text-butcher-700 hover:bg-vintage-200'
            }`}
            onClick={() => setActiveCategory('hard')}
          >
            Hard
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map(recipe => (
          <div 
            key={recipe.id} 
            className="bg-white rounded-lg overflow-hidden relative h-[450px] perspective-1000"
          >
            {/* Recipe card content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-butcher-800 mb-2">{recipe.name}</h3>
              
              <div className="recipe-instructions mb-4">
                <h4 className="text-sm font-medium text-butcher-700 mb-2">Instructions:</h4>
                {validatedInstructions(recipe).length > 0 ? (
                  <ol className="text-sm text-butcher-600 space-y-2 pl-4 list-decimal">
                    {validatedInstructions(recipe).map((step: string, idx: number) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-butcher-400 italic">No instructions available</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeMatching;