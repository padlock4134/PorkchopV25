import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSavedRecipes } from '../context/SavedRecipesContext';
import { useButcherTheme } from './ButcherThemeProvider';
import type { Recipe } from '../utils/recipeData';

// Simple tag component for both difficulty and cuisine
const RecipeTag: React.FC<{
  children: React.ReactNode;
  color?: string;
  rotate?: boolean;
}> = ({ children, color = 'brown', rotate = true }) => {
  const theme = useButcherTheme();
  
  const getTagColor = () => {
    switch (color) {
      case 'green':
        return '#4CAF50';
      case 'yellow':
        return '#FFC107';
      case 'red':
        return '#F44336';
      case 'brown':
      default:
        return theme.colors.secondary;
    }
  };
  
  return (
    <div 
      className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-md"
      style={{
        backgroundColor: theme.colors.tertiary,
        color: getTagColor(),
        border: `1px solid ${getTagColor()}`,
        transform: rotate ? 'rotate(-2deg)' : 'none'
      }}
    >
      {children}
    </div>
  );
};

interface RecipeCardProps {
  recipe: Recipe;
  showDetails?: boolean;
}

const ButcherRecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe,
  showDetails = true
}) => {
  const { isRecipeSaved, addToSaved, removeFromSaved } = useSavedRecipes();
  const theme = useButcherTheme();
  const [isFlipped, setIsFlipped] = useState(false);
  const isSaved = isRecipeSaved(recipe.id);

  const getDifficultyColor = (difficulty: Recipe['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'green';
      case 'medium':
        return 'yellow';
      case 'hard':
        return 'red';
      default:
        return 'brown';
    }
  };
  
  const toggleSave = () => {
    if (isSaved) {
      removeFromSaved(recipe.id);
    } else {
      addToSaved(recipe);
    }
  };
  
  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className="relative perspective"
      style={{ 
        perspective: '1000px',
        height: showDetails ? '400px' : '320px' 
      }}
    >
      <div 
        className="w-full h-full transition-transform duration-500 transform-gpu preserve-3d"
        style={{ 
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transformStyle: 'preserve-3d' 
        }}
      >
        {/* Front Side - Recipe Preview */}
        <div 
          className="absolute w-full h-full backface-hidden rounded-lg overflow-hidden shadow-lg"
          style={{ 
            backfaceVisibility: 'hidden',
            backgroundColor: theme.colors.tertiary,
            backgroundImage: "url('/patterns/butcher-paper-texture.png')",
            border: `${theme.borders.width.medium} solid ${theme.colors.secondary}`
          }}
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src={recipe.imageUrl || '/images/placeholder-recipe.jpg'}
              alt={recipe.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/placeholder-recipe.jpg';
              }}
            />
            {/* Difficulty label */}
            <div className="absolute top-3 right-3">
              <RecipeTag 
                color={getDifficultyColor(recipe.difficulty)}
                rotate={true}
              >
                {recipe.difficulty}
              </RecipeTag>
            </div>
            
            {/* Cuisine label */}
            {recipe.cuisine && (
              <div className="absolute top-3 left-3">
                <RecipeTag color="brown">
                  🌍 {recipe.cuisine}
                </RecipeTag>
              </div>
            )}
          </div>
          
          <div className="p-4">
            <h3 
              className="text-xl font-bold text-butcher-800 mb-2 line-clamp-1"
              style={{ fontFamily: theme.fonts.display }}
            >
              {recipe.title}
            </h3>
            
            <p className="text-butcher-600 text-sm mb-4 line-clamp-2">
              {recipe.description}
            </p>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <span className="flex items-center text-sm text-butcher-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {recipe.cookingTime} mins
                </span>
                
                <span className="flex items-center text-sm text-butcher-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {recipe.servings}
                </span>
              </div>
              
              <div className="flex space-x-1">
                <button
                  onClick={toggleSave}
                  className="p-2 rounded-full hover:bg-butcher-100"
                  title={isSaved ? "Remove from saved" : "Add to saved"}
                >
                  <svg 
                    className={`h-5 w-5 ${isSaved ? 'text-yellow-500 fill-current' : 'text-butcher-400'}`}
                    fill={isSaved ? "currentColor" : "none"}
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </button>
                
                {showDetails && (
                  <button
                    onClick={toggleFlip}
                    className="p-2 rounded-full hover:bg-butcher-100"
                    title="View details"
                  >
                    <svg className="h-5 w-5 text-butcher-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Butcher Shop Tag */}
          <div className="absolute -top-2 -left-2 w-24 h-24 overflow-hidden">
            <div className="absolute top-0 left-0 w-4 h-4 bg-butcher-800"></div>
            <div 
              className="w-32 bg-satriales-600 text-white font-bold py-1 text-center text-xs transform rotate-[-45deg] origin-top-right translate-y-4 -translate-x-2"
              style={{ fontFamily: theme.fonts.display }}
            >
              PRIME CUT
            </div>
          </div>
        </div>
        
        {/* Back Side - Recipe Details */}
        <div 
          className="absolute w-full h-full backface-hidden rounded-lg overflow-hidden shadow-lg"
          style={{ 
            backfaceVisibility: 'hidden',
            backgroundColor: theme.colors.tertiary,
            backgroundImage: "url('/patterns/butcher-paper-texture.png')",
            border: `${theme.borders.width.medium} solid ${theme.colors.secondary}`,
            transform: 'rotateY(180deg)' 
          }}
        >
          <div className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <h4 
                className="text-xl font-bold text-butcher-800"
                style={{ fontFamily: theme.fonts.display }}
              >
                {recipe.title} Details
              </h4>
              
              <button
                onClick={toggleFlip}
                className="p-1 rounded-full hover:bg-butcher-100 text-butcher-500"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-1">
              {/* Ingredients Section */}
              <div className="mb-4">
                <h5 className="font-medium text-butcher-700 mb-2 border-b border-butcher-200 pb-1">
                  Ingredients:
                </h5>
                <ul className="space-y-1 text-sm text-butcher-600 list-disc pl-5">
                  {recipe.ingredients.slice(0, 5).map((ingredient, idx) => (
                    <li key={idx} className="text-butcher-600">
                      {typeof ingredient === 'string' ? ingredient : ingredient.name}
                    </li>
                  ))}
                  {recipe.ingredients.length > 5 && <li className="italic">and {recipe.ingredients.length - 5} more...</li>}
                </ul>
              </div>
              
              {/* Instructions Section - First few steps */}
              <div>
                <h5 className="font-medium text-butcher-700 mb-2 border-b border-butcher-200 pb-1">
                  Instructions:
                </h5>
                <ol className="space-y-2 text-sm">
                  {recipe.instructions.slice(0, 3).map((step, idx) => (
                    <li key={idx} className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-butcher-100 text-butcher-600 flex items-center justify-center font-medium">
                        {idx + 1}
                      </div>
                      <p className="text-butcher-600 flex-1">{step}</p>
                    </li>
                  ))}
                  {recipe.instructions.length > 3 && (
                    <li className="text-butcher-500 italic text-sm pl-9">
                      ...and {recipe.instructions.length - 3} more steps
                    </li>
                  )}
                </ol>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-butcher-200 flex justify-between items-center">
              <div className="flex text-xs text-butcher-500 space-x-3">
                <span>Time: {recipe.cookingTime} mins</span>
                <span>Servings: {recipe.servings}</span>
                <span className="capitalize">Difficulty: {recipe.difficulty}</span>
              </div>
              
              <Link
                to={`/recipe/${recipe.id}`}
                className="text-sm font-medium text-satriales-600 hover:text-satriales-700"
              >
                View Full Recipe →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButcherRecipeCard;