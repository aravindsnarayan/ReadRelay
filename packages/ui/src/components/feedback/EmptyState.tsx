import React from 'react';
import { Button } from '../base/Button';
import { Heading, Text } from '../base/Typography';

export interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'minimal';
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No items found',
  message = 'There are no items to display at the moment.',
  actionLabel = 'Add item',
  onAction,
  icon,
  variant = 'default',
  className = '',
}) => {
  const defaultIcon = (
    <svg
      className="w-12 h-12 text-secondary-400 mb-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  );

  if (variant === 'minimal') {
    return (
      <div className={`text-center py-6 ${className}`}>
        <Text color="secondary" className="mb-3">
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

  return (
    <div className={`text-center py-12 ${className}`}>
      {icon || defaultIcon}
      <Heading level={4} className="mb-2">
        {title}
      </Heading>
      <Text color="secondary" className="mb-6">
        {message}
      </Text>
      {onAction && <Button onClick={onAction}>{actionLabel}</Button>}
    </div>
  );
};

export default EmptyState;
