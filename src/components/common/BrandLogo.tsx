import React from 'react';
import logoImg from '../../assets/logo.png';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'sidebar' | 'full';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  size = 'sidebar', 
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-6 w-auto max-w-[90px]',
    md: 'h-8 w-auto max-w-[130px]',
    lg: 'h-10 w-auto max-w-[160px]',
    sidebar: 'w-full h-14 object-contain',
    full: 'w-full h-full object-contain'
  }[size];

  return (
    <img 
      src={logoImg} 
      alt="Orbita Logo" 
      className={`${sizeClasses} shrink-0 ${className}`}
    />
  );
};
