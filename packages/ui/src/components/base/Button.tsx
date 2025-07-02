import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
}) => {
  const baseClasses = `
    inline-flex items-center justify-center rounded-lg font-medium 
    transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
  `;

  const variantClasses = {
    primary: `
      bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500
      active:bg-primary-800
    `,
    secondary: `
      bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus:ring-secondary-500
      active:bg-secondary-300
    `,
    outline: `
      border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500
      active:bg-primary-100
    `,
    ghost: `
      text-secondary-700 hover:bg-secondary-100 focus:ring-secondary-500
      active:bg-secondary-200
    `,
    destructive: `
      bg-error-600 text-white hover:bg-error-700 focus:ring-error-500
      active:bg-error-800
    `,
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
    xl: 'px-8 py-4 text-lg gap-3',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${widthClass}
    ${className}
  `
    .replace(/\s+/g, ' ')
    .trim();

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
          Loading...
        </>
      );
    }

    if (icon && iconPosition === 'left') {
      return (
        <>
          {icon}
          {children}
        </>
      );
    }

    if (icon && iconPosition === 'right') {
      return (
        <>
          {children}
          {icon}
        </>
      );
    }

    return children;
  };

  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {renderContent()}
    </button>
  );
};

export default Button;
