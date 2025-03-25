import React, { ButtonHTMLAttributes } from 'react';
import { useButcherTheme } from './ButcherThemeProvider';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'meat' | 'wood';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  withIcon?: boolean;
  iconPosition?: 'left' | 'right';
  elevation?: 'flat' | 'raised' | 'floating';
}

const ButcherButton: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  withIcon = false,
  iconPosition = 'left',
  elevation = 'raised',
  className = '',
  ...props
}) => {
  const theme = useButcherTheme();
  
  // Base classes for all buttons
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all border-2";
  
  // Size-specific classes
  const sizeClasses = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg"
  };
  
  // Variant-specific classes
  const variantClasses = {
    primary: `bg-satriales-600 text-white border-satriales-700 hover:bg-satriales-700 active:bg-satriales-800`,
    secondary: `bg-butcher-600 text-white border-butcher-700 hover:bg-butcher-700 active:bg-butcher-800`,
    tertiary: `bg-vintage-50 text-butcher-800 border-vintage-200 hover:bg-vintage-100 active:bg-vintage-200`,
    meat: `bg-pink-500 text-white border-pink-600 hover:bg-pink-600 active:bg-pink-700`,
    wood: `bg-butcher-700 text-vintage-50 border-butcher-800 hover:bg-butcher-800 active:bg-butcher-900`
  };
  
  // Elevation classes
  const elevationClasses = {
    flat: "",
    raised: "shadow-md hover:shadow-lg",
    floating: "shadow-lg hover:shadow-xl transform hover:-translate-y-1"
  };
  
  // Width classes
  const widthClasses = fullWidth ? "w-full" : "";
  
  // Icon adjustment classes
  const iconClasses = withIcon ? (
    iconPosition === 'left' ? "justify-start" : "justify-end"
  ) : "";
  
  // Border radius based on theme
  const borderRadius = theme.borders.radius.medium;
  
  // Transition based on theme
  const transition = theme.transitions.medium;
  
  // Combine all classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${elevationClasses[elevation]}
    ${widthClasses}
    ${iconClasses}
    rounded-md
    ${className}
  `;
  
  return (
    <button
      className={buttonClasses}
      style={{
        borderRadius,
        transition
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default ButcherButton;