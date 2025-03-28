import React from 'react';
import ChefFreddieLogo from './ChefFreddieLogo';

const HeroChefFreddie: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Large glowing background effect */}
      <div className="absolute inset-0 bg-gradient-radial from-porkchop-200/50 to-transparent animate-pulse"></div>
      
      {/* Chef Freddie with dramatic scaling */}
      <div className="relative transform scale-100 hover:scale-110 transition-transform duration-700">
        <ChefFreddieLogo size="large" className="filter drop-shadow-2xl" />
      </div>
    </div>
  );
};

export default HeroChefFreddie;
