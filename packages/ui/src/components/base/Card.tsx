import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
  hoverable = false,
}) => {
  const baseClasses = `
    rounded-xl transition-all duration-200 ease-in-out
  `;

  const variantClasses = {
    default: 'bg-white border border-secondary-200',
    outlined: 'bg-white border-2 border-secondary-300',
    elevated: 'bg-white shadow-medium border border-secondary-100',
    flat: 'bg-secondary-50',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };

  const interactiveClasses =
    onClick || hoverable
      ? 'cursor-pointer hover:shadow-large transform hover:-translate-y-0.5'
      : '';

  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${paddingClasses[padding]}
    ${interactiveClasses}
    ${className}
  `
    .replace(/\s+/g, ' ')
    .trim();

  return (
    <div className={combinedClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`pb-3 border-b border-secondary-200 ${className}`}>
      {children}
    </div>
  );
};

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = '',
}) => {
  return <div className={`py-3 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`pt-3 border-t border-secondary-200 ${className}`}>
      {children}
    </div>
  );
};

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardBody.displayName = 'CardBody';
CardFooter.displayName = 'CardFooter';

export default Card;
