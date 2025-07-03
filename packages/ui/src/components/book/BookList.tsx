'use client';

import React from 'react';
import { Text, SmallText } from '../base/Typography';

interface BookListItem {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  condition: string;
  availabilityStatus: 'available' | 'exchanging' | 'unavailable';
  ownerName: string;
}

interface BookListProps {
  books: BookListItem[];
  onBookClick: (bookId: string) => void;
  isLoading?: boolean;
  className?: string;
}

const StatusBadge: React.FC<{ status: BookListItem['availabilityStatus'] }> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'exchanging':
        return 'bg-yellow-100 text-yellow-800';
      case 'unavailable':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'exchanging':
        return 'Exchanging';
      case 'unavailable':
        return 'Unavailable';
      default:
        return 'Unknown';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {getStatusText()}
    </span>
  );
};

const ConditionBadge: React.FC<{ condition: string }> = ({ condition }) => {
  const getConditionColor = () => {
    switch (condition.toLowerCase()) {
      case 'excellent':
        return 'bg-blue-100 text-blue-800';
      case 'good':
        return 'bg-green-100 text-green-800';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getConditionColor()}`}>
      {condition}
    </span>
  );
};

export const BookList: React.FC<BookListProps> = ({
  books,
  onBookClick,
  isLoading = false,
  className = '',
}) => {
  if (books.length === 0 && !isLoading) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Text color="secondary">No books to display</Text>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {books.map((book) => (
        <div
          key={book.id}
          onClick={() => onBookClick(book.id)}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden group"
        >
          {/* Book Cover */}
          <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={`Cover of ${book.title}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                <div className="text-center text-blue-600">
                  <div className="text-4xl mb-2">📚</div>
                  <SmallText className="font-medium px-2">
                    {book.title.substring(0, 20)}
                    {book.title.length > 20 ? '...' : ''}
                  </SmallText>
                </div>
              </div>
            )}
            
            {/* Status overlay */}
            <div className="absolute top-2 right-2">
              <StatusBadge status={book.availabilityStatus} />
            </div>
          </div>

          {/* Book Details */}
          <div className="p-4">
            <div className="mb-2">
              <Text className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {book.title}
              </Text>
              <SmallText color="secondary" className="line-clamp-1">
                by {book.author}
              </SmallText>
            </div>

            <div className="flex items-center justify-between">
              <ConditionBadge condition={book.condition} />
              <SmallText color="secondary" className="text-right">
                {book.ownerName}
              </SmallText>
            </div>
          </div>
        </div>
      ))}

      {/* Loading states */}
      {isLoading && (
        <>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`loading-${i}`}
              className="bg-white rounded-lg shadow-sm p-4 animate-pulse"
            >
              <div className="aspect-[3/4] bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-3 w-2/3"></div>
              <div className="flex justify-between">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default BookList;
