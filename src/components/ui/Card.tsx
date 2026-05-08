import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  elevation?: 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  elevation = 'sm',
}) => {
  const elevationClass = {
    sm: 'shadow-md',
    md: 'shadow-lg',
    lg: 'shadow-xl',
  }[elevation];

  const hoverableClass = hoverable 
    ? 'transform hover:-translate-y-1 transition-all duration-300 hover:shadow-lg cursor-pointer' 
    : 'transition-shadow duration-300';
  
  const clickableClass = onClick ? 'cursor-pointer' : '';
  
  return (
    <div 
      className={`bg-white rounded-lg ${elevationClass} overflow-hidden border border-gray-100 ${hoverableClass} ${clickableClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  withDivider?: boolean;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
  withDivider = true,
}) => {
  return (
    <div className={`px-6 py-4 ${withDivider ? 'border-b border-gray-100' : ''} ${className}`}>
      {children}
    </div>
  );
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = '',
  padding = 'md',
}) => {
  const paddingClass = {
    sm: 'px-4 py-3',
    md: 'px-6 py-4',
    lg: 'px-8 py-6',
  }[padding];

  return (
    <div className={`${paddingClass} ${className}`}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  withDivider?: boolean;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
  withDivider = true,
}) => {
  return (
    <div className={`px-6 py-4 ${withDivider ? 'border-t border-gray-100' : ''} bg-gray-50 ${className}`}>
      {children}
    </div>
  );
};