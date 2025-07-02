import React from 'react';
import { BookCard, BookCardProps } from './BookCard';
import { Text } from '../base/Typography';

export interface BookListProps {
  books: BookCardProps['book'][];
  onBookClick?: (bookId: string) => void;
  layout?: 'grid' | 'list';
  variant?: BookCardProps['variant'];
  showOwner?: boolean;
  showLocation?: boolean;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
}

export const BookList: React.FC<BookListProps> = ({
  books,
  onBookClick,
  layout = 'grid',
  variant = 'default',
  showOwner = true,
  showLocation = true,
  emptyMessage = 'No books found',
  loading = false,
  className = '',
}) => {
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-secondary-100 rounded-xl h-32"
          />
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <svg
          className="mx-auto h-12 w-12 text-secondary-400 mb-4"
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
        <Text color="secondary">{emptyMessage}</Text>
      </div>
    );
  }

  const layoutClasses = {
    grid: `
      grid gap-4 
      grid-cols-1 
      sm:grid-cols-2 
      lg:grid-cols-3 
      xl:grid-cols-4
    `,
    list: 'space-y-4',
  };

  return (
    <div className={`${layoutClasses[layout]} ${className}`}>
      {books.map(book => (
        <BookCard
          key={book.id}
          book={book}
          onClick={onBookClick}
          variant={layout === 'list' ? 'default' : variant}
          showOwner={showOwner}
          showLocation={showLocation}
        />
      ))}
    </div>
  );
};

export default BookList;
