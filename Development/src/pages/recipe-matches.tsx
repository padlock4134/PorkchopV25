import React from 'react';
import { GetServerSideProps } from 'next';
import type { Recipe } from '../utils/recipeData';
import RecipeList from '../components/RecipeList';

interface RecipeMatchesProps {
  recipes: Recipe[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/recipes`);
    const recipes = await response.json();
    return {
      props: {
        recipes: recipes.slice(0, 6) // Show first 6 recipes
      }
    };
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return {
      props: {
        recipes: []
      }
    };
  }
};

const RecipeMatches: React.FC<RecipeMatchesProps> = ({ recipes }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Recipe Matches</h1>
      <RecipeList recipes={recipes} />
    </div>
  );
};

export default RecipeMatches;