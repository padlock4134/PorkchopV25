import React, { useState, useEffect } from 'react';
import { Recipe } from '../utils/recipeData';

interface RecipeCardProps {
  recipe: Recipe | undefined;
  onClick: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  // State variables
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Check if recipe is valid
  const isValidRecipe = recipe !== undefined && recipe !== null;
  
  // Early return for invalid recipe data
  if (!isValidRecipe) {
    console.warn('RecipeCard received invalid recipe data:', recipe);
    return (
      <div className="relative w-full h-[450px] bg-white rounded-lg shadow-md p-6">
        <div className="h-48 bg-gray-100 mb-4 rounded"></div>
        <div className="h-6 bg-gray-100 w-3/4 mb-4 rounded"></div>
        <div className="h-4 bg-gray-100 w-1/2 rounded mb-3"></div>
        <div className="h-4 bg-gray-100 w-1/3 rounded"></div>
      </div>
    );
  }
  
  // Event handlers (only defined if recipe is valid)
  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the onClick event of the parent
    setIsFlipped(!isFlipped);
  };
  
  const handleCardClick = () => {
    if (!isFlipped && isValidRecipe) {
      onClick(recipe);
    }
  };
  
  // Function to get a fallback image if the image URL is invalid
  const getFallbackImageUrl = () => {
    return '/images/recipes/default-recipe.jpg';
  };

  // Function to get the proper image URL
  const getImageUrl = (): string => {
    if (!isValidRecipe) return getFallbackImageUrl();
    
    const imageUrl = recipe.imageUrl;
    console.log('Original image URL:', imageUrl);
    
    let resolvedUrl = '';

    // Use imageUrl from Recipe interface if it exists and isn't empty
    if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '') {
      // If imageUrl already starts with /images/recipes, use it as is
      if (imageUrl.startsWith('/images/recipes/')) {
        resolvedUrl = imageUrl;
      }
      // If it's pointing to data folder, redirect to public folder
      else if (imageUrl.includes('Recipe Stock Photos')) {
        const filename = imageUrl.split('/').pop();
        resolvedUrl = filename ? `/images/recipes/${filename}` : getFallbackImageUrl();
      }
      // If it's just a filename, add the proper path
      else if (!imageUrl.includes('/')) {
        resolvedUrl = `/images/recipes/${imageUrl}`;
      }
      // Otherwise use as is
      else {
        resolvedUrl = imageUrl;
      }
    }
    // Try to find the image by recipe ID if no imageUrl
    else if (recipe.id) {
      resolvedUrl = `/images/recipes/${recipe.id}.jpg`;
    }
    // If nothing else works, use fallback
    else {
      resolvedUrl = getFallbackImageUrl();
    }
    
    console.log('Resolved image URL:', resolvedUrl);
    return resolvedUrl;
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
  
  // Safe getter functions
  const getTitle = (): string => {
    return isValidRecipe && recipe.title ? recipe.title : 'Untitled Recipe';
  };
  
  const getDifficulty = (): string => {
    return isValidRecipe && recipe.difficulty ? recipe.difficulty : 'medium';
  };
  
  const getCookingTime = (): string => {
    return isValidRecipe && recipe.cookingTime ? `${recipe.cookingTime}` : '?';
  };
  
  const getMatchPercentage = (): number | undefined => {
    return isValidRecipe ? recipe.matchPercentage : undefined;
  };
  
  const getCuisine = (): string | undefined => {
    return isValidRecipe ? recipe.cuisine : undefined;
  };
  
  // Get instructions safely
  const getInstructions = (): string[] => {
    if (!isValidRecipe) return [];
    
    // Try different properties where instructions might be stored
    if (recipe.instructions) {
      return safeParseArray(recipe.instructions);
    }
    
    if (recipe.steps) {
      return safeParseArray(recipe.steps);
    }
    
    return [];
  };
  
  // Get protein tags safely
  const getProteinTags = (): string[] => {
    if (!isValidRecipe || !recipe.proteinTags) return [];
    return safeParseArray(recipe.proteinTags);
  };
  
  // Get veggie tags safely
  const getVeggieTags = (): string[] => {
    if (!isValidRecipe || !recipe.veggieTags) return [];
    return safeParseArray(recipe.veggieTags);
  };
  
  // Preload image to prevent flickering
  useEffect(() => {
    if (isValidRecipe) {
      const img = new Image();
      const imgSrc = getImageUrl();
      img.src = imgSrc;
      img.onload = () => setImageLoaded(true);
      img.onerror = () => {
        img.src = getFallbackImageUrl();
        img.onload = () => setImageLoaded(true);
      };
    }
  }, [recipe]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Get recipe data
  const title = getTitle();
  const instructions = getInstructions();
  const matchPercentage = getMatchPercentage();
  const cuisine = getCuisine();
  const proteinTags = getProteinTags();
  const veggieTags = getVeggieTags();
  
  // Render the card
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
          {/* Recipe image with loading state */}
          <div className="h-48 overflow-hidden bg-gray-100 relative">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Loading image...</div>
              </div>
            )}
            <img 
              src={getImageUrl()} 
              alt={title} 
              className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
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
            <h3 className="text-xl font-bold text-butcher-800 mb-2">{title}</h3>
            
            {matchPercentage !== undefined && (
              <div className="mb-3 flex items-center">
                <span className="text-sm mr-2">Match:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${matchPercentage >= 70 ? 'bg-green-500' : matchPercentage >= 40 ? 'bg-yellow-400' : 'bg-red-400'}`}
                    style={{ width: `${matchPercentage}%` }}
                  ></div>
                </div>
                <span className="text-sm ml-2">{matchPercentage}%</span>
              </div>
            )}
            
            <div className="text-sm text-butcher-600 mb-3">
              <span className="inline-block mr-4">
                <span className="font-medium">Time:</span> {getCookingTime()} min
              </span>
              <span className="inline-block">
                <span className="font-medium">Difficulty:</span> {getDifficulty()}
              </span>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-auto">
              {cuisine && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-800">
                  {cuisine}
                </span>
              )}
              {proteinTags.slice(0, 2).map((tag, i) => (
                <span key={`p-${i}`} className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                  {tag}
                </span>
              ))}
              {veggieTags.slice(0, 2).map((tag, i) => (
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
              {title} - Instructions
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