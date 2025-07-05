'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@readrelay/ui/components/base/Button';
import { Text, Heading } from '@readrelay/ui/components/base/Typography';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/providers/AuthProvider';
import { getUserProfile } from '@readrelay/shared/api/auth';
import { getUserBooks } from '@readrelay/shared/api/books';
import { BookList } from '@readrelay/ui/components/book/BookList';
import type { Profile } from '@readrelay/shared/types';

interface Book {
  id: string;
  title: string;
  author: string;
  cover_image_url?: string | null;
  condition: string;
  availability_status: 'available' | 'exchanging' | 'unavailable';
  ownerName: string;
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const userId = params.userId as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [userBooks, setUserBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [booksLoading, setBooksLoading] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!userId) return;

      try {
        setIsLoading(true);
        setError(null);

        // Redirect to own profile if viewing self
        if (currentUser && userId === currentUser.id) {
          router.replace('/profile');
          return;
        }

        const result = await getUserProfile(userId);

        if (result.success && result.profile) {
          setProfile(result.profile);

          // Load user's books
          setBooksLoading(true);
          const booksResult = await getUserBooks(userId);

          if (booksResult.success && booksResult.books) {
            const formattedBooks: Book[] = booksResult.books.map(book => ({
              id: book.id,
              title: book.title,
              author: book.author,
              cover_image_url: book.cover_image_url || undefined,
              condition: book.condition,
              availability_status: book.availability_status as
                | 'available'
                | 'exchanging'
                | 'unavailable',
              ownerName:
                result.profile?.full_name ||
                result.profile?.username ||
                'Unknown',
            }));
            setUserBooks(formattedBooks);
          }
        } else {
          setError(result.error || 'User not found');
        }
      } catch (error) {
        setError('Failed to load user profile');
      } finally {
        setIsLoading(false);
        setBooksLoading(false);
      }
    };

    loadUserProfile();
  }, [userId, currentUser, router]);

  const handleBookClick = (bookId: string) => {
    router.push(`/books/${bookId}`);
  };

  const handleSendMessage = () => {
    // TODO: Implement messaging functionality
    router.push(`/messages?user=${userId}`);
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
          <div className="text-center">
            <div className="text-4xl mb-4">📚</div>
            <Text className="text-lg">Loading profile...</Text>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !profile) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
          <div className="text-center max-w-md">
            <div className="text-4xl mb-4">😕</div>
            <Heading level={2} className="text-xl font-semibold mb-2">
              Profile Not Found
            </Heading>
            <Text color="secondary" className="mb-6">
              {error ||
                'This user profile could not be found or is not accessible.'}
            </Text>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={`${profile.full_name || profile.username}'s profile`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-2xl">👤</span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <Heading
                    level={1}
                    className="text-2xl font-bold text-gray-900 mb-1"
                  >
                    {profile.full_name || profile.username}
                  </Heading>
                  <Text color="secondary" className="mb-2">
                    @{profile.username}
                  </Text>

                  {/* Location (if visible and available) */}
                  {(profile.privacy_settings as any)?.location_visible &&
                    profile.location_text && (
                      <div className="flex items-center gap-1 mb-3">
                        <span className="text-sm">📍</span>
                        <Text color="secondary" className="text-sm">
                          {profile.location_text}
                        </Text>
                      </div>
                    )}

                  {/* Bio */}
                  {profile.bio && (
                    <Text className="text-gray-700 leading-relaxed">
                      {profile.bio}
                    </Text>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 sm:flex-shrink-0">
                <Button onClick={handleSendMessage}>💬 Send Message</Button>

                {/* Contact Info (if visible) */}
                {(profile.privacy_settings as any)?.phone_visible &&
                  profile.phone && (
                    <div className="text-center">
                      <Text color="secondary" className="text-sm">
                        Phone
                      </Text>
                      <Text className="font-medium">{profile.phone}</Text>
                    </div>
                  )}
              </div>
            </div>

            {/* Preferred Meeting Locations */}
            {profile.preferred_meeting_locations &&
              profile.preferred_meeting_locations.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Text className="font-medium text-gray-900 mb-2">
                    Preferred Meeting Locations
                  </Text>
                  <div className="flex flex-wrap gap-2">
                    {profile.preferred_meeting_locations.map(
                      (location, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {location}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>

          {/* User's Books */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <Heading level={2} className="text-lg font-semibold">
                {profile.full_name || profile.username}&apos;s Books
              </Heading>
              <Text color="secondary">
                {userBooks.length} book{userBooks.length !== 1 ? 's' : ''}{' '}
                available
              </Text>
            </div>

            {booksLoading ? (
              <div className="text-center py-8">
                <Text color="secondary">Loading books...</Text>
              </div>
            ) : userBooks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📚</div>
                <Heading level={3} className="text-lg font-medium mb-2">
                  No Books Listed
                </Heading>
                <Text color="secondary">
                  This user hasn&apos;t added any books to their collection yet.
                </Text>
              </div>
            ) : (
              <BookList
                books={userBooks}
                onBookClick={handleBookClick}
                isLoading={booksLoading}
              />
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
