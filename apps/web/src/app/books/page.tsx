'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@readrelay/ui/components/base/Button';
import { Input } from '@readrelay/ui/components/base/Input';
import { Text, Heading } from '@readrelay/ui/components/base/Typography';
import { BookList } from '@readrelay/ui/components/book/BookList';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  condition: string;
  availability_status: string;
  cover_image_url?: string;
  created_at: string;
  owner?: {
    id: string;
    username: string;
    full_name: string;
  };
}

export default function BooksPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  // Fetch books from API
  const fetchBooks = useCallback(
    async (query = '', reset = false) => {
      try {
        setIsSearching(true);
        setError(null);

        const currentOffset = reset ? 0 : offset;
        const params = new URLSearchParams({
          limit: '20',
          offset: currentOffset.toString(),
        });

        if (query.trim()) {
          params.append('q', query.trim());
        }

        const response = await fetch(`/api/books?${params}`);
        const data = await response.json();

        if (data.success) {
          if (reset) {
            setBooks(data.books || []);
            setOffset(0);
          } else {
            setBooks(prev => [...prev, ...(data.books || [])]);
          }
          setHasMore(data.hasMore || false);
          setOffset(prev => prev + (data.books?.length || 0));
        } else {
          setError(data.error || 'Failed to load books');
        }
      } catch (error) {
        console.error('Failed to fetch books:', error);
        setError('Failed to load books');
      } finally {
        setIsLoading(false);
        setIsSearching(false);
      }
    },
    [offset]
  );

  // Initial load
  useEffect(() => {
    fetchBooks('', true);
  }, [fetchBooks]);

  // Handle search
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setOffset(0);
      fetchBooks(query, true);
    },
    [fetchBooks]
  );

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (!isSearching && hasMore) {
      fetchBooks(searchQuery, false);
    }
  }, [fetchBooks, searchQuery, isSearching, hasMore]);

  // Navigate to add book page
  const handleAddBook = () => {
    router.push('/books/add');
  };

  // Navigate to book details
  const handleBookClick = (bookId: string) => {
    router.push(`/books/${bookId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Heading level={1} className="text-2xl font-bold text-gray-900">
                Discover Books
              </Heading>
              <Text color="secondary" className="mt-1">
                Find your next great read from our community
              </Text>
            </div>
            <Button onClick={handleAddBook} className="w-full sm:w-auto">
              + Add Your Book
            </Button>
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <Input
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by title, author, or ISBN..."
              className="max-w-md"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <Text color="error">{error}</Text>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchBooks(searchQuery, true)}
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        )}

        {isLoading && books.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Loading skeleton */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm p-4 animate-pulse"
              >
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">📚</div>
              <Heading level={3} className="text-lg font-medium mb-2">
                {searchQuery ? 'No books found' : 'No books available'}
              </Heading>
              <Text color="secondary" className="mb-6">
                {searchQuery
                  ? 'Try adjusting your search terms or browse all books.'
                  : 'Be the first to add a book to our community!'}
              </Text>
              {searchQuery ? (
                <Button
                  variant="outline"
                  onClick={() => handleSearch('')}
                  className="mr-2"
                >
                  Clear Search
                </Button>
              ) : null}
              <Button onClick={handleAddBook}>Add Your First Book</Button>
            </div>
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="mb-6">
              <Text color="secondary">
                {searchQuery ? (
                  <>
                    Found {books.length} book{books.length !== 1 ? 's' : ''} for
                    &quot;
                    <span className="font-medium">{searchQuery}</span>&quot;
                  </>
                ) : (
                  <>Showing {books.length} available books</>
                )}
              </Text>
            </div>

            {/* Books Grid */}
            <BookList
              books={books.map(book => ({
                id: book.id,
                title: book.title,
                author: book.author,
                cover_image_url: book.cover_image_url,
                condition: book.condition,
                availability_status: book.availability_status as
                  | 'available'
                  | 'exchanging'
                  | 'unavailable',
                ownerName:
                  book.owner?.full_name || book.owner?.username || 'Unknown',
              }))}
              onBookClick={handleBookClick}
              isLoading={isSearching}
            />

            {/* Load More */}
            {hasMore && (
              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={isSearching}
                  className="min-w-32"
                >
                  {isSearching ? 'Loading...' : 'Load More Books'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
