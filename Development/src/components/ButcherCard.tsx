import React, { ReactNode } from 'react';
import { useButcherTheme } from './ButcherThemeProvider';

export interface CardProps {
  children: ReactNode;
  variant?: 'paper' | 'wood' | 'meat' | 'clean';
  elevation?: 'flat' | 'raised' | 'floating';
  withBorder?: boolean;
  className?: string;
  heading?: string;
  subheading?: string;
  footer?: ReactNode;
}

const ButcherCard: React.FC<CardProps> = ({
  children,
  variant = 'paper',
  elevation = 'raised',
  withBorder = true,
  className = '',
  heading,
  subheading,
  footer
}) => {
  const theme = useButcherTheme();
  
  // Base classes
  const baseClasses = "overflow-hidden";
  
  // Variant classes
  const variantClasses = {
    paper: "bg-vintage-50 text-butcher-800",
    wood: "bg-butcher-700 text-vintage-50",
    meat: "bg-pink-50 text-butcher-800",
    clean: "bg-white text-butcher-800"
  };
  
  // Background patterns based on variant
  const variantPatterns = {
    paper: "bg-[url('/patterns/butcher-paper-texture.png')]",
    wood: "bg-[url('/patterns/wood-texture.png')]",
    meat: "bg-[url('/patterns/meat-tag-texture.png')]",
    clean: ""
  };
  
  // Elevation classes
  const elevationClasses = {
    flat: "shadow-none",
    raised: "shadow-md",
    floating: "shadow-xl"
  };
  
  // Border classes
  const borderClasses = withBorder ? {
    paper: "border-2 border-vintage-200",
    wood: "border-2 border-butcher-800",
    meat: "border-2 border-pink-200",
    clean: "border-2 border-gray-200"
  } : {
    paper: "",
    wood: "",
    meat: "",
    clean: ""
  };
  
  // Combine all classes
  const cardClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${variantPatterns[variant]}
    ${elevationClasses[elevation]}
    ${withBorder ? borderClasses[variant] : ''}
    rounded-lg
    ${className}
  `;

  return (
    <div 
      className={cardClasses}
      style={{
        borderRadius: theme.borders.radius.large,
        transition: theme.transitions.medium
      }}
    >
      {(heading || subheading) && (
        <div className={`p-4 border-b ${borderClasses[variant]}`}>
          {heading && (
            <h3 className="text-xl font-bold font-serif">{heading}</h3>
          )}
          {subheading && (
            <p className="text-sm mt-1 opacity-75">{subheading}</p>
          )}
        </div>
      )}
      
      <div className="p-4">
        {children}
      </div>
      
      {footer && (
        <div className={`p-4 border-t ${borderClasses[variant]}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default ButcherCard;