'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heading, Text } from '@readrelay/ui/components/base/Typography';
import { BookEntryForm } from '@readrelay/ui/components/book/BookEntryForm';
import type { BookInput } from '@readrelay/shared';

export default function AddBookPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (bookData: BookInput) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to the new book's page or back to books list
        router.push(`/books/${result.book.id}`);
      } else {
        setError(result.error || 'Failed to add book');
      }
    } catch (error) {
      console.error('Failed to add book:', error);
      setError('Failed to add book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Heading level={1} className="text-3xl font-bold text-gray-900 mb-4">
            Add Your Book
          </Heading>
          <Text color="secondary" className="text-lg max-w-2xl mx-auto">
            Share your book with the ReadRelay community. Scan the ISBN or enter details manually.
          </Text>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 max-w-lg mx-auto">
            <Text color="error" className="text-center">
              {error}
            </Text>
          </div>
        )}

        {/* Book Entry Form */}
        <div className="max-w-lg mx-auto">
          <BookEntryForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isSubmitting}
          />
        </div>

        {/* Help Text */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <Heading level={3} className="text-lg font-semibold text-blue-900 mb-3">
              📚 Tips for Adding Books
            </Heading>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start">
                <span className="font-medium mr-2">📱</span>
                <Text className="text-sm">
                  Use the camera scanner to quickly capture ISBN barcodes and auto-fill book details
                </Text>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">📝</span>
                <Text className="text-sm">
                  Add a detailed description to help others understand what makes your book special
                </Text>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">🏷️</span>
                <Text className="text-sm">
                  Use tags to categorize your book (fiction, non-fiction, mystery, romance, etc.)
                </Text>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">🔄</span>
                <Text className="text-sm">
                  Choose your preferred exchange type: borrow temporarily, swap permanently, or give away
                </Text>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 