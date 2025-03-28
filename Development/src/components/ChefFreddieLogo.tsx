import React from 'react';

interface ChefFreddieLogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  showNotification?: boolean;
}

const ChefFreddieLogo: React.FC<ChefFreddieLogoProps> = ({ className, size = 'medium', showNotification = false }) => {
  // Determine the appropriate class based on size
  let sizeClass = '';
  
  switch (size) {
    case 'small':
      sizeClass = 'w-8 h-8';
      break;
    case 'large':
      sizeClass = 'w-80 h-80';  // Made bigger (320x320) to fill the container better
      break;
    case 'medium':
    default:
      sizeClass = 'w-12 h-12';
      break;
  }
  
  // Combine custom className with size class
  const combinedClassName = className ? `${sizeClass} ${className}` : sizeClass;
  
  return (
    <div className="relative">
      <svg
        className={combinedClassName}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circle background - smaller border */}
        <circle cx="50" cy="50" r="46" fill="currentColor" className="text-white" />
        
        {/* Chef Hat - slightly larger */}
        <path
          d="M28 23h44c0 0 6-16-22-16s-22 16-22 16z"
          fill="currentColor"
          className="text-black"
        />
        
        {/* Chef Coat - slightly larger */}
        <path
          d="M18 60v25c0 0 17 10 32 10s32-10 32-10v-25c-5 15-27 20-32 20s-27-5-32-20z"
          fill="currentColor"
          className="text-gray-100"
        />
        <path
          d="M18 60v25c0 0 17 10 32 10s32-10 32-10v-25"
          stroke="currentColor"
          strokeWidth="2"
          className="text-gray-400"
        />
        
        {/* Pig Face - larger */}
        <path
          d="M23 50c0-14.8 12.2-27 27-27s27 12.2 27 27-12.2 27-27 27S23 64.8 23 50z"
          fill="currentColor"
          className="text-pink-200"
        />
        
        {/* Eyes - slightly larger */}
        <circle cx="38" cy="45" r="6" fill="currentColor" className="text-black" />
        <circle cx="62" cy="45" r="6" fill="currentColor" className="text-black" />
        
        {/* Snout - slightly larger */}
        <circle cx="50" cy="55" r="9" fill="currentColor" className="text-pink-300" />
        <circle cx="47" cy="54" r="2.5" fill="currentColor" className="text-black" />
        <circle cx="53" cy="54" r="2.5" fill="currentColor" className="text-black" />
        
        {/* Bow Tie */}
        <path
          d="M45 65l5 5 5-5-5-5z"
          fill="currentColor"
          className="text-black"
        />
        
        {/* Chef Uniform Buttons */}
        <circle cx="50" cy="75" r="2" fill="currentColor" className="text-black" />
        <circle cx="50" cy="82" r="2" fill="currentColor" className="text-black" />
        
        {/* Spatula */}
        <path
          d="M70 40l15 10-5 5-15-10z"
          fill="currentColor"
          className="text-black"
        />
      </svg>
      
      {/* Notification dot */}
      {showNotification && (
        <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border border-white" />
      )}
    </div>
  );
};

export default ChefFreddieLogo;