'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@readrelay/ui/components/base/Button';
import { Text, Heading } from '@readrelay/ui/components/base/Typography';
import { Input } from '@readrelay/ui/components/base/Input';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/providers/AuthProvider';
import { getUserBooks } from '@readrelay/shared/api/books';
import { BookList } from '@readrelay/ui/components/book/BookList';

interface Book {
  id: string;
  title: string;
  author: string;
  cover_image_url?: string | null;
  condition: string;
  availability_status: 'available' | 'exchanging' | 'unavailable';
  ownerName: string;
  description?: string;
  isbn?: string;
  genre?: string;
  created_at: string | null;
}

type FilterType = 'all' | 'available' | 'exchanging' | 'unavailable';

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');

  useEffect(() => {
    const loadUserBooks = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);

        const result = await getUserBooks(user.id);

        if (result.success && result.books) {
          const formattedBooks: Book[] = result.books.map(book => ({
            id: book.id,
            title: book.title,
            author: book.author,
            cover_image_url: book.cover_image_url || undefined,
            condition: book.condition,
            availability_status: book.availability_status as
              | 'available'
              | 'exchanging'
              | 'unavailable',
            ownerName: profile?.full_name || profile?.username || 'You',
            description: book.description || undefined,
            isbn: book.isbn || undefined,
            genre: book.genre || undefined,
            created_at: book.created_at,
          }));
          setBooks(formattedBooks);
        } else {
          setError(result.error || 'Failed to load books');
        }
      } catch (error) {
        setError('Failed to load your books');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserBooks();
  }, [user, profile]);

  const handleBookClick = (bookId: string) => {
    router.push(`/books/${bookId}`);
  };

  const handleAddBook = () => {
    router.push('/books/add');
  };

  const handleEditBook = (bookId: string) => {
    router.push(`/books/${bookId}/edit`);
  };

  // Filter books based on search and status
  const filteredBooks = books.filter(book => {
    const matchesSearch =
      searchQuery === '' ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.genre?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || book.availability_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Get book statistics
  const stats = {
    total: books.length,
    available: books.filter(b => b.availability_status === 'available').length,
    exchanging: books.filter(b => b.availability_status === 'exchanging')
      .length,
    unavailable: books.filter(b => b.availability_status === 'unavailable')
      .length,
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <Heading level={1} className="text-3xl font-bold text-gray-900">
                  Welcome back,{' '}
                  {profile?.full_name || profile?.username || 'Reader'}!
                </Heading>
                <Text color="secondary" className="mt-2">
                  Manage your book collection and track your exchanges
                </Text>
              </div>
              <Button
                onClick={handleAddBook}
                className="flex items-center gap-2"
              >
                <span>➕</span>
                Add New Book
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-xl">📚</span>
                </div>
                <div>
                  <Text className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </Text>
                  <Text color="secondary" className="text-sm">
                    Total Books
                  </Text>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-xl">✅</span>
                </div>
                <div>
                  <Text className="text-2xl font-bold text-gray-900">
                    {stats.available}
                  </Text>
                  <Text color="secondary" className="text-sm">
                    Available
                  </Text>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <span className="text-xl">🔄</span>
                </div>
                <div>
                  <Text className="text-2xl font-bold text-gray-900">
                    {stats.exchanging}
                  </Text>
                  <Text color="secondary" className="text-sm">
                    Exchanging
                  </Text>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <span className="text-xl">🚫</span>
                </div>
                <div>
                  <Text className="text-2xl font-bold text-gray-900">
                    {stats.unavailable}
                  </Text>
                  <Text color="secondary" className="text-sm">
                    Unavailable
                  </Text>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  label="Search your books"
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search by title, author, or genre..."
                  className="w-full"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as FilterType)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="exchanging">Exchanging</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            </div>
          </div>

          {/* Books Collection */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Heading level={2} className="text-lg font-semibold">
                  Your Book Collection
                </Heading>
                <Text color="secondary" className="text-sm">
                  {filteredBooks.length} of {stats.total} books
                  {searchQuery && ` matching "${searchQuery}"`}
                  {statusFilter !== 'all' && ` with status "${statusFilter}"`}
                </Text>
              </div>

              {filteredBooks.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => router.push('/books?owner=' + user?.id)}
                >
                  View Public Profile
                </Button>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <Text color="error">{error}</Text>
              </div>
            )}

            {isLoading ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📚</div>
                <Text color="secondary">Loading your books...</Text>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">
                  {searchQuery || statusFilter !== 'all' ? '🔍' : '📚'}
                </div>
                <Heading level={3} className="text-lg font-medium mb-2">
                  {searchQuery || statusFilter !== 'all'
                    ? 'No books found'
                    : 'No books in your collection yet'}
                </Heading>
                <Text color="secondary" className="mb-6">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Start building your collection by adding your first book'}
                </Text>
                {!searchQuery && statusFilter === 'all' && (
                  <Button onClick={handleAddBook}>Add Your First Book</Button>
                )}
              </div>
            ) : (
              <BookList
                books={filteredBooks}
                onBookClick={handleBookClick}
                isLoading={isLoading}
                showOwner={false}
                actions={{
                  edit: handleEditBook,
                }}
              />
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📱</span>
                <Heading level={3} className="text-lg font-medium">
                  Quick Add
                </Heading>
              </div>
              <Text color="secondary" className="text-sm mb-4">
                Add books quickly by scanning ISBN barcodes
              </Text>
              <Button
                variant="outline"
                onClick={() => router.push('/books/add?mode=scan')}
                className="w-full"
              >
                Scan ISBN
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🔍</span>
                <Heading level={3} className="text-lg font-medium">
                  Browse Community
                </Heading>
              </div>
              <Text color="secondary" className="text-sm mb-4">
                Discover books available in your area
              </Text>
              <Button
                variant="outline"
                onClick={() => router.push('/books')}
                className="w-full"
              >
                Browse Books
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">💬</span>
                <Heading level={3} className="text-lg font-medium">
                  Messages
                </Heading>
              </div>
              <Text color="secondary" className="text-sm mb-4">
                Check your messages and exchange requests
              </Text>
              <Button
                variant="outline"
                onClick={() => router.push('/messages')}
                className="w-full"
              >
                View Messages
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
