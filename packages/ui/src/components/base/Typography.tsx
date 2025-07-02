import React from 'react';

export interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'muted';
  align?: 'left' | 'center' | 'right' | 'justify';
  truncate?: boolean;
}

export interface HeadingProps extends TypographyProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const colorClasses = {
  default: 'text-secondary-900',
  primary: 'text-primary-600',
  secondary: 'text-secondary-600',
  success: 'text-success-600',
  warning: 'text-warning-600',
  error: 'text-error-600',
  muted: 'text-secondary-500',
};

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

export const Heading: React.FC<HeadingProps> = ({
  children,
  level = 1,
  className = '',
  color = 'default',
  align = 'left',
  truncate = false,
}) => {
  const baseClasses = 'font-semibold leading-tight';

  const sizeClasses = {
    1: 'text-4xl lg:text-5xl',
    2: 'text-3xl lg:text-4xl',
    3: 'text-2xl lg:text-3xl',
    4: 'text-xl lg:text-2xl',
    5: 'text-lg lg:text-xl',
    6: 'text-base lg:text-lg',
  };

  const truncateClass = truncate ? 'truncate' : '';

  const combinedClasses = `
    ${baseClasses}
    ${sizeClasses[level]}
    ${colorClasses[color]}
    ${alignClasses[align]}
    ${truncateClass}
    ${className}
  `
    .replace(/\s+/g, ' ')
    .trim();

  const Component = `h${level}` as keyof JSX.IntrinsicElements;

  return <Component className={combinedClasses}>{children}</Component>;
};

export const Text: React.FC<TypographyProps> = ({
  children,
  className = '',
  color = 'default',
  align = 'left',
  truncate = false,
}) => {
  const baseClasses = 'text-base leading-relaxed';
  const truncateClass = truncate ? 'truncate' : '';

  const combinedClasses = `
    ${baseClasses}
    ${colorClasses[color]}
    ${alignClasses[align]}
    ${truncateClass}
    ${className}
  `
    .replace(/\s+/g, ' ')
    .trim();

  return <p className={combinedClasses}>{children}</p>;
};

export const SmallText: React.FC<TypographyProps> = ({
  children,
  className = '',
  color = 'muted',
  align = 'left',
  truncate = false,
}) => {
  const baseClasses = 'text-sm leading-normal';
  const truncateClass = truncate ? 'truncate' : '';

  const combinedClasses = `
    ${baseClasses}
    ${colorClasses[color]}
    ${alignClasses[align]}
    ${truncateClass}
    ${className}
  `
    .replace(/\s+/g, ' ')
    .trim();

  return <span className={combinedClasses}>{children}</span>;
};

export const Label: React.FC<TypographyProps> = ({
  children,
  className = '',
  color = 'default',
  align = 'left',
  truncate = false,
}) => {
  const baseClasses = 'text-sm font-medium leading-normal';
  const truncateClass = truncate ? 'truncate' : '';

  const combinedClasses = `
    ${baseClasses}
    ${colorClasses[color]}
    ${alignClasses[align]}
    ${truncateClass}
    ${className}
  `
    .replace(/\s+/g, ' ')
    .trim();

  return <label className={combinedClasses}>{children}</label>;
};

export const Code: React.FC<TypographyProps> = ({
  children,
  className = '',
  color = 'default',
  align = 'left',
  truncate = false,
}) => {
  const baseClasses =
    'font-mono text-sm bg-secondary-100 px-1.5 py-0.5 rounded';
  const truncateClass = truncate ? 'truncate' : '';

  const combinedClasses = `
    ${baseClasses}
    ${colorClasses[color]}
    ${alignClasses[align]}
    ${truncateClass}
    ${className}
  `
    .replace(/\s+/g, ' ')
    .trim();

  return <code className={combinedClasses}>{children}</code>;
};

// Export all components
export default {
  Heading,
  Text,
  SmallText,
  Label,
  Code,
};
