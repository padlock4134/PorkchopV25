import React, { ReactNode } from 'react';
import { useButcherTheme } from './ButcherThemeProvider';

export interface MeatTagProps {
  children: ReactNode;
  color?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'paper' | 'wood' | 'meat';
  className?: string;
}

const MeatTag: React.FC<MeatTagProps> = ({ children, color = 'primary', className = '' }) => {
  const { colors } = useButcherTheme();
  
  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={{
        backgroundColor: colors[color]['100'],
        color: colors[color]['800']
      }}
    >
      {children}
    </span>
  );
};

export default MeatTag;