import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'link' | 'success' | 'warning' | 'error';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  // Base styles with improved transitions
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-250 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer active:scale-95';
  
  // Size styles
  const sizeStyles = {
    xs: 'text-xs px-2.5 py-1.5 gap-1',
    sm: 'text-sm px-3 py-2 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2',
    xl: 'text-lg px-8 py-3.5 gap-2.5',
  };
  
  // Variant styles with improved hover and focus states
  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 focus:ring-offset-white shadow-md hover:shadow-lg active:shadow-sm',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 focus:ring-offset-white shadow-md hover:shadow-lg active:shadow-sm',
    accent: 'bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-400 focus:ring-offset-white shadow-md hover:shadow-lg active:shadow-sm',
    outline: 'border-2 border-primary-600 bg-transparent text-primary-600 hover:bg-primary-50 focus:ring-primary-500 active:bg-primary-100',
    ghost: 'bg-transparent text-primary-600 hover:bg-gray-100 focus:ring-primary-500 active:bg-gray-200',
    link: 'bg-transparent text-primary-600 hover:text-primary-700 hover:underline focus:ring-primary-500 p-0',
    success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500 focus:ring-offset-white shadow-md hover:shadow-lg active:shadow-sm',
    warning: 'bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500 focus:ring-offset-white shadow-md hover:shadow-lg active:shadow-sm',
    error: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500 focus:ring-offset-white shadow-md hover:shadow-lg active:shadow-sm',
  };
  
  // Disabled state
  const disabledClass = disabled || isLoading ? 'opacity-60 cursor-not-allowed pointer-events-none' : '';
  
  // Width
  const widthClass = fullWidth ? 'w-full' : '';
  
  const combinedClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthClass} ${disabledClass} ${className}`;
  
  return (
    <button
      className={combinedClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};