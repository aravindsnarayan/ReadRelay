import React from 'react';
import { Card, CardBody } from '../base/Card';
import { Heading, Text, SmallText } from '../base/Typography';

export interface BookCardProps {
  book: {
    id: string;
    title: string;
    author: string;
    isbn?: string;
    coverUrl?: string;
    condition: 'excellent' | 'good' | 'fair' | 'poor';
    description?: string;
    availabilityStatus: 'available' | 'reserved' | 'borrowed' | 'unavailable';
    ownerUsername?: string;
    location?: {
      city: string;
      distance?: number;
    };
  };
  onClick?: (bookId: string) => void;
  showOwner?: boolean;
  showLocation?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

const conditionColors = {
  excellent: 'text-success-600 bg-success-50',
  good: 'text-primary-600 bg-primary-50',
  fair: 'text-warning-600 bg-warning-50',
  poor: 'text-error-600 bg-error-50',
};

const statusColors = {
  available: 'text-success-600 bg-success-50',
  reserved: 'text-warning-600 bg-warning-50',
  borrowed: 'text-secondary-600 bg-secondary-50',
  unavailable: 'text-error-600 bg-error-50',
};

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onClick,
  showOwner = true,
  showLocation = true,
  variant = 'default',
  className = '',
}) => {
  const handleClick = () => {
    onClick?.(book.id);
  };

  const renderCover = () => {
    if (book.coverUrl) {
      return (
        <img
          src={book.coverUrl}
          alt={`${book.title} cover`}
          className="w-16 h-20 object-cover rounded-md bg-secondary-100"
        />
      );
    }

    return (
      <div className="w-16 h-20 bg-secondary-100 rounded-md flex items-center justify-center">
        <svg
          className="w-8 h-8 text-secondary-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>
    );
  };

  const renderCompactView = () => (
    <div className="flex gap-3">
      {renderCover()}
      <div className="flex-1 min-w-0">
        <Heading level={6} truncate className="mb-1">
          {book.title}
        </Heading>
        <SmallText color="secondary" truncate>
          by {book.author}
        </SmallText>
        <div className="flex flex-wrap gap-2 mt-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[book.availabilityStatus]}`}
          >
            {book.availabilityStatus}
          </span>
        </div>
      </div>
    </div>
  );

  const renderDefaultView = () => (
    <div className="flex gap-4">
      {renderCover()}
      <div className="flex-1 min-w-0">
        <Heading level={5} truncate className="mb-1">
          {book.title}
        </Heading>
        <Text color="secondary" truncate className="mb-2">
          by {book.author}
        </Text>

        {book.description && (
          <Text className="text-sm line-clamp-2 mb-3">{book.description}</Text>
        )}

        <div className="flex flex-wrap gap-2 mb-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[book.availabilityStatus]}`}
          >
            {book.availabilityStatus}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${conditionColors[book.condition]}`}
          >
            {book.condition}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm text-secondary-600">
          {showOwner && book.ownerUsername && (
            <SmallText>Owner: {book.ownerUsername}</SmallText>
          )}
          {showLocation && book.location && (
            <SmallText>
              {book.location.city}
              {book.location.distance &&
                ` • ${book.location.distance.toFixed(1)}km away`}
            </SmallText>
          )}
        </div>
      </div>
    </div>
  );

  const renderDetailedView = () => (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="w-24 h-32 flex-shrink-0">
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={`${book.title} cover`}
              className="w-full h-full object-cover rounded-md bg-secondary-100"
            />
          ) : (
            <div className="w-full h-full bg-secondary-100 rounded-md flex items-center justify-center">
              <svg
                className="w-12 h-12 text-secondary-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <Heading level={4} className="mb-2">
            {book.title}
          </Heading>
          <Text color="secondary" className="mb-3">
            by {book.author}
          </Text>

          {book.isbn && (
            <SmallText color="muted" className="mb-3">
              ISBN: {book.isbn}
            </SmallText>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[book.availabilityStatus]}`}
            >
              {book.availabilityStatus}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${conditionColors[book.condition]}`}
            >
              {book.condition} condition
            </span>
          </div>
        </div>
      </div>

      {book.description && (
        <div>
          <Text className="text-sm">{book.description}</Text>
        </div>
      )}

      <div className="flex justify-between items-center pt-3 border-t border-secondary-200">
        {showOwner && book.ownerUsername && (
          <SmallText>Owner: {book.ownerUsername}</SmallText>
        )}
        {showLocation && book.location && (
          <SmallText>
            {book.location.city}
            {book.location.distance &&
              ` • ${book.location.distance.toFixed(1)}km away`}
          </SmallText>
        )}
      </div>
    </div>
  );

  const getContent = () => {
    switch (variant) {
      case 'compact':
        return renderCompactView();
      case 'detailed':
        return renderDetailedView();
      default:
        return renderDefaultView();
    }
  };

  return (
    <Card
      onClick={handleClick}
      hoverable={!!onClick}
      padding={variant === 'compact' ? 'sm' : 'md'}
      className={className}
    >
      <CardBody className="p-0">{getContent()}</CardBody>
    </Card>
  );
};

export default BookCard;
