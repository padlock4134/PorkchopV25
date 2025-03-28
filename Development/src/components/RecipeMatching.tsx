import React, { useState } from 'react';
import { Recipe } from '../utils/recipeData';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import RecipeCard from './RecipeCard';

interface RecipeMatchingProps {
  recipes: Recipe[];
}

const RecipeMatching: React.FC<RecipeMatchingProps> = ({ recipes }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  // Ensure recipes is always treated as an array
  const recipesToUse = Array.isArray(recipes) ? recipes : [];
  
  console.log('RecipeMatching recipes count:', recipesToUse.length);

  // Filter recipes based on active category
  const filteredRecipes = activeCategory === 'all' 
    ? recipesToUse 
    : recipesToUse.filter(recipe => {
        if (activeCategory === 'easy') return recipe.difficulty === 'easy';
        if (activeCategory === 'medium') return recipe.difficulty === 'medium';
        if (activeCategory === 'hard') return recipe.difficulty === 'hard';
        return true;
      });

  // Function to handle recipe selection - SYNCHRONOUS function
  const handleRecipeSelect = (recipe: Recipe) => {
    router.push(`/recipe/${recipe.id}`);
  };

  return (
    <div className="recipe-matching-container">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-butcher-800">Matched Recipes</h2>
        
        <div className="flex gap-2">
          <button
            id="filter-all"
            name="filter"
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
            id="filter-easy"
            name="filter"
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
            id="filter-medium"
            name="filter"
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
            id="filter-hard"
            name="filter"
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
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map(recipe => (
            <RecipeCard 
              key={recipe.id}
              recipe={recipe}
              onClick={handleRecipeSelect}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-8">
            <p className="text-butcher-600">No recipes found. Try a different filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeMatching;