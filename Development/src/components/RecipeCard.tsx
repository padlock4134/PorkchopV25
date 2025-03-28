import React, { useState } from 'react';
import { Recipe } from '../utils/recipeData';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Handle card flip - prevent the Promise issue by keeping this synchronous
  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the onClick event of the parent
    setIsFlipped(!isFlipped);
  };
  
  // Handle card click (navigation to detail page) - must be synchronous, not async
  const handleCardClick = () => {
    if (!isFlipped) {
      onClick(recipe); // This should NOT be an async function
    }
  };
  
  // Function to get a fallback image if the image URL is invalid
  const getFallbackImageUrl = () => {
    return '/data/images/Recipe Stock Photos/default-recipe.jpg';
  };

  // Function to get the proper image URL
  const getImageUrl = (recipe: Recipe): string => {
    // Use imageUrl from Recipe interface if it exists and isn't empty
    if (recipe.imageUrl && recipe.imageUrl.trim() !== '') {
      return recipe.imageUrl;
    }
    
    // Try to find the image in your Recipe Stock Photos folder
    if (recipe.id) {
      return `/data/images/Recipe Stock Photos/${recipe.id}.jpg`;
    }
    
    return getFallbackImageUrl();
  };
  
  // Helper function to safely parse JSON strings to arrays
  const safeParseArray = (value: any): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    
    // If it's a string, try to parse it as JSON
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch (e) {
        // If parsing fails, split by comma
        return value.split(',').map((item: string) => item.trim());
      }
    }
    
    // If all else fails, return empty array
    return [];
  };
  
  // Get instructions safely
  const getInstructions = (recipe: Recipe): string[] => {
    return safeParseArray(recipe.instructions || recipe.steps);
  };
  
  // Get protein tags safely
  const getProteinTags = (recipe: Recipe): string[] => {
    return safeParseArray(recipe.proteinTags);
  };
  
  // Get veggie tags safely
  const getVeggieTags = (recipe: Recipe): string[] => {
    return safeParseArray(recipe.veggieTags);
  };
  
  const instructions = getInstructions(recipe);
  
  return (
    <div 
      className="relative w-full h-[450px]"
      style={{ perspective: '1000px' }}
      onClick={handleCardClick}
    >
      <div 
        className="w-full h-full transition-all duration-500"
        style={{ 
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          WebkitTransform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          willChange: 'transform'
        }}
      >
        {/* Front of card */}
        <div 
          className="absolute w-full h-full bg-white rounded-lg shadow-md overflow-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            zIndex: isFlipped ? 0 : 1
          }}
        >
          {/* Recipe image */}
          <div className="h-48 overflow-hidden">
            <img 
              src={getImageUrl(recipe)} 
              alt={recipe.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                // If image fails to load, use fallback
                const target = e.target as HTMLImageElement;
                target.onerror = null; // Prevent infinite loop
                target.src = getFallbackImageUrl();
              }}
            />
          </div>
          
          {/* Recipe card content */}
          <div className="p-6 flex-1 overflow-y-auto">
            <h3 className="text-xl font-bold text-butcher-800 mb-2">{recipe.title}</h3>
            
            {recipe.matchPercentage !== undefined && (
              <div className="mb-3 flex items-center">
                <span className="text-sm mr-2">Match:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${recipe.matchPercentage >= 70 ? 'bg-green-500' : recipe.matchPercentage >= 40 ? 'bg-yellow-400' : 'bg-red-400'}`}
                    style={{ width: `${recipe.matchPercentage}%` }}
                  ></div>
                </div>
                <span className="text-sm ml-2">{recipe.matchPercentage}%</span>
              </div>
            )}
            
            <div className="text-sm text-butcher-600 mb-3">
              <span className="inline-block mr-4">
                <span className="font-medium">Time:</span> {recipe.cookingTime || '?'} min
              </span>
              <span className="inline-block">
                <span className="font-medium">Difficulty:</span> {recipe.difficulty || 'medium'}
              </span>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-auto">
              {recipe.cuisine && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800">
                  {recipe.cuisine}
                </span>
              )}
              {getProteinTags(recipe).slice(0, 2).map((tag, i) => (
                <span key={`p-${i}`} className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                  {tag}
                </span>
              ))}
              {getVeggieTags(recipe).slice(0, 2).map((tag, i) => (
                <span key={`v-${i}`} className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Flip button */}
            <button
              onClick={handleFlip}
              className="mt-4 px-3 py-1.5 bg-butcher-100 text-butcher-800 rounded-md hover:bg-butcher-200 transition-colors text-sm flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              See Instructions
            </button>
          </div>
        </div>
        
        {/* Back of card (Instructions) */}
        <div 
          className="absolute w-full h-full bg-white rounded-lg shadow-md overflow-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            WebkitTransform: 'rotateY(180deg)',
            zIndex: isFlipped ? 1 : 0
          }}
        >
          <div className="p-6 h-full flex flex-col">
            <h3 className="text-xl font-bold text-butcher-800 mb-4">
              {recipe.title} - Instructions
            </h3>
            
            <div className="flex-1 overflow-y-auto">
              {instructions.length > 0 ? (
                <ol className="text-sm text-butcher-600 space-y-3 pl-4 list-decimal">
                  {instructions.map((step, idx) => (
                    <li key={idx} className="pl-1">{step}</li>
                  ))}
                </ol>
              ) : (
                <p className="text-butcher-400 italic">No instructions available</p>
              )}
            </div>
            
            {/* Flip back button */}
            <button
              onClick={handleFlip}
              className="mt-4 px-3 py-1.5 bg-butcher-100 text-butcher-800 rounded-md hover:bg-butcher-200 transition-colors text-sm flex items-center self-start"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;