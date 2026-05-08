import React from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface AvatarProps {
  src: string;
  alt: string;
  size?: AvatarSize;
  className?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  className = '',
  status,
}) => {
  const sizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
    '2xl': 'h-20 w-20',
  };
  
  const statusColors = {
    online: 'bg-success-500',
    offline: 'bg-secondary-400',
    away: 'bg-warning-500',
    busy: 'bg-error-500',
  };
  
  const statusSizes = {
    xs: 'h-1.5 w-1.5 ring-1',
    sm: 'h-2 w-2 ring-1',
    md: 'h-2.5 w-2.5 ring-2',
    lg: 'h-3 w-3 ring-2',
    xl: 'h-4 w-4 ring-2',
    '2xl': 'h-5 w-5 ring-2',
  };
  
  return (
    <div className={`relative inline-block flex-shrink-0 ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`rounded-full object-cover ${sizeClasses[size]} border border-gray-100`}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=random&bold=true`;
        }}
      />
      
      {status && (
        <span 
          className={`absolute bottom-0 right-0 block rounded-full ring-white ${statusColors[status]} ${statusSizes[size]}`}
        />
      )}
    </div>
  );
};