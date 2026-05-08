import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  startAdornment,
  endAdornment,
  fullWidth = false,
  size = 'md',
  className = '',
  ...props
}, ref) => {
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-4 py-3 text-lg',
  };

  const baseInputClass = `block w-full rounded-lg border-2 transition-all duration-200 focus:outline-none ${sizeClasses[size]}`;
  
  const errorClass = error 
    ? 'border-error-500 focus:border-error-600 focus:ring-2 focus:ring-error-100 bg-error-50' 
    : 'border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 hover:border-gray-300';
  
  const adornmentClass = startAdornment ? 'pl-10' : '';
  const endAdornmentClass = endAdornment ? 'pr-10' : '';
  
  return (
    <div className={`${widthClass} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-secondary-900 mb-2">
          {label}
          {props.required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {startAdornment && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-500">
            {startAdornment}
          </div>
        )}
        
        <input
          ref={ref}
          className={`${baseInputClass} ${errorClass} ${adornmentClass} ${endAdornmentClass}`}
          {...props}
        />
        
        {endAdornment && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-secondary-500">
            {endAdornment}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={`mt-1.5 text-sm font-medium ${error ? 'text-error-600' : 'text-secondary-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';