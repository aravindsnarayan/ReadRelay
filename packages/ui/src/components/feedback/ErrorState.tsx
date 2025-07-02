import React from 'react';
import { Button } from '../base/Button';
import { Heading, Text } from '../base/Typography';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'minimal' | 'page';
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An error occurred while loading this content. Please try again.',
  actionLabel = 'Try again',
  onAction,
  variant = 'default',
  className = '',
}) => {
  const errorIcon = (
    <svg
      className={`${variant === 'page' ? 'w-16 h-16' : 'w-12 h-12'} text-error-400 mb-4`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
      />
    </svg>
  );

  if (variant === 'minimal') {
    return (
      <div className={`text-center py-4 ${className}`}>
        <Text color="error" className="mb-2">
          {message}
        </Text>
        {onAction && (
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    );
  }

  if (variant === 'page') {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${className}`}
      >
        <div className="text-center max-w-md mx-auto px-4">
          {errorIcon}
          <Heading level={2} className="mb-4">
            {title}
          </Heading>
          <Text color="secondary" className="mb-6">
            {message}
          </Text>
          {onAction && <Button onClick={onAction}>{actionLabel}</Button>}
        </div>
      </div>
    );
  }

  return (
    <div className={`text-center py-8 ${className}`}>
      {errorIcon}
      <Heading level={4} className="mb-2">
        {title}
      </Heading>
      <Text color="secondary" className="mb-4">
        {message}
      </Text>
      {onAction && (
        <Button variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
