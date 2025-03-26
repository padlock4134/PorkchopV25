import React from 'react';

interface TutorialImageProps {
  title: string;
  category: string;
  className?: string;
}

// This component creates themed placeholder images for tutorials
// using the application's color palette
const TutorialImage: React.FC<TutorialImageProps> = ({ title, category, className = '' }) => {
  // Map categories to background colors from our theme
  const getCategoryColor = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'ingredient-focused':
        return 'bg-gradient-to-br from-porkchop-600 to-porkchop-800';
      case 'equipment-mastery':
        return 'bg-gradient-to-br from-satriales-500 to-satriales-700';
      case 'cooking-science':
        return 'bg-gradient-to-br from-blue-500 to-blue-700';
      case 'global-techniques':
        return 'bg-gradient-to-br from-amber-500 to-amber-700';
      case 'preparation-safety':
        return 'bg-gradient-to-br from-green-600 to-green-800';
      case 'meat-cutting':
        return 'bg-gradient-to-br from-butcher-700 to-butcher-900';
      case 'veggie-prep':
        return 'bg-gradient-to-br from-emerald-500 to-emerald-700';
      default:
        return 'bg-gradient-to-br from-vintage-400 to-vintage-600';
    }
  };

  // Map categories to icons
  const getCategoryIcon = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'ingredient-focused':
        return '🧂';
      case 'equipment-mastery':
        return '🍳';
      case 'cooking-science':
        return '🧪';
      case 'global-techniques':
        return '🌍';
      case 'preparation-safety':
        return '🧤';
      case 'meat-cutting':
        return '🔪';
      case 'veggie-prep':
        return '🥕';
      default:
        return '👨‍🍳';
    }
  };

  // Generate initials from title for the background
  const getInitials = (title: string): string => {
    return title
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 3);
  };

  return (
    <div 
      className={`${getCategoryColor(category)} ${className} w-full h-full flex items-center justify-center relative overflow-hidden`}
    >
      {/* Large faded initials in background */}
      <div className="absolute opacity-20 text-white text-9xl font-bold">
        {getInitials(title)}
      </div>
      
      {/* Category icon */}
      <div className="text-4xl z-10 mb-2">
        {getCategoryIcon(category)}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-white opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-full h-2 bg-white opacity-20"></div>
      <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white opacity-10"></div>
      <div className="absolute bottom-2 left-2 w-8 h-8 rounded-full bg-white opacity-10"></div>
      
      {/* Diagonal butcher shop pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{ 
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)' 
        }}></div>
      </div>
    </div>
  );
};

export default TutorialImage;
