import React, { createContext, useContext, ReactNode } from 'react';

// Theme context types
export interface ButcherTheme {
  colors: {
    primary: string; // Porkchop red
    secondary: string; // Butcher brown
    tertiary: string; // Vintage cream
    accent: string; // Mint green for accents
    paper: string; // Butcher paper background
    wood: string; // Wood textures
    meat: string; // Meat tag colors
    text: {
      primary: string;
      secondary: string;
      light: string;
      accent: string;
    };
  };
  fonts: {
    display: string; // For headings
    body: string; // For body text
    script: string; // For accent text
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
  borders: {
    radius: {
      small: string;
      medium: string;
      large: string;
    };
    width: {
      thin: string;
      medium: string;
      thick: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  transitions: {
    fast: string;
    medium: string;
    slow: string;
  };
}

// Default butcher shop theme
export const defaultButcherTheme: ButcherTheme = {
  colors: {
    primary: '#dc2626', // Porkchop red
    secondary: '#8b6347', // Butcher brown
    tertiary: '#f7f7f2', // Vintage cream
    accent: '#80eba8', // Mint green
    paper: '#f8f5f2', // Butcher paper
    wood: '#5d3f24', // Wood
    meat: '#ff5e62', // Meat tag
    text: {
      primary: '#2c281a', // Dark brown
      secondary: '#5c5235', // Medium brown
      light: '#e6e4d9', // Light cream
      accent: '#1ad961', // Bright green
    },
  },
  fonts: {
    display: '"Libre Bodoni", serif',
    body: 'system-ui, sans-serif',
    script: '"Dancing Script", cursive',
  },
  shadows: {
    small: '0 2px 4px rgba(139, 99, 71, 0.1)',
    medium: '0 4px 6px rgba(139, 99, 71, 0.1), 0 2px 4px rgba(139, 99, 71, 0.06)',
    large: '0 10px 15px rgba(139, 99, 71, 0.1), 0 4px 6px rgba(139, 99, 71, 0.05)',
  },
  borders: {
    radius: {
      small: '0.25rem',
      medium: '0.5rem',
      large: '0.75rem',
    },
    width: {
      thin: '1px',
      medium: '2px',
      thick: '4px',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
    xl: '4rem',
  },
  transitions: {
    fast: '150ms ease-in-out',
    medium: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },
};

// Create theme context
const ThemeContext = createContext<ButcherTheme>(defaultButcherTheme);

// Theme provider props
interface ThemeProviderProps {
  children: ReactNode;
  theme?: Partial<ButcherTheme>;
}

// Theme provider component
export const ButcherThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  theme 
}) => {
  // Merge custom theme with default theme
  const mergedTheme = theme 
    ? { ...defaultButcherTheme, ...theme } 
    : defaultButcherTheme;

  return (
    <ThemeContext.Provider value={mergedTheme}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Libre+Bodoni:wght@400;500;600;700&display=swap');
        
        :root {
          --color-primary: ${mergedTheme.colors.primary};
          --color-secondary: ${mergedTheme.colors.secondary};
          --color-tertiary: ${mergedTheme.colors.tertiary};
          --color-accent: ${mergedTheme.colors.accent};
          --color-paper: ${mergedTheme.colors.paper};
          --color-wood: ${mergedTheme.colors.wood};
          --color-meat: ${mergedTheme.colors.meat};
          --text-primary: ${mergedTheme.colors.text.primary};
          --text-secondary: ${mergedTheme.colors.text.secondary};
          --text-light: ${mergedTheme.colors.text.light};
          --text-accent: ${mergedTheme.colors.text.accent};
          --font-display: ${mergedTheme.fonts.display};
          --font-body: ${mergedTheme.fonts.body};
          --font-script: ${mergedTheme.fonts.script};
        }
        
        body {
          font-family: var(--font-body);
          color: var(--text-primary);
          background-color: var(--color-paper);
          background-image: url('/patterns/butcher-paper-texture.png');
          background-repeat: repeat;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: var(--font-display);
          font-weight: 600;
        }
      `}</style>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme
export const useButcherTheme = () => useContext(ThemeContext);

export default ButcherThemeProvider;