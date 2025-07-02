import React from 'react';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-20 h-20 text-2xl',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name = '',
  size = 'md',
  className = '',
  onClick,
}) => {
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const baseClasses = `
    inline-flex items-center justify-center rounded-full bg-primary-100 
    text-primary-700 font-medium select-none overflow-hidden
    ${onClick ? 'cursor-pointer hover:bg-primary-200 transition-colors' : ''}
  `;

  const combinedClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${className}
  `
    .replace(/\s+/g, ' ')
    .trim();

  if (src) {
    return (
      <div className={combinedClasses} onClick={onClick}>
        <img
          src={src}
          alt={alt || name}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={combinedClasses} onClick={onClick}>
      {getInitials(name) || '?'}
    </div>
  );
};

export default Avatar;
